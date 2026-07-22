#!/usr/bin/env node
/**
 * pull_transcripts.mjs — video-transcript adapter (U-01 in CORPUS-CATALOG.md).
 *
 * Fetches YouTube auto-captions (yt-dlp --write-auto-sub, --skip-download —
 * no video/audio ever hits disk) for every video record already sitting in
 * raw/videos-<slug>.jsonl, cleans the rolling-caption VTT into plain text
 * (see lib.mjs parseVtt), and writes ONE NEW record per video to a parallel
 * file: raw/transcripts-<slug>.jsonl.
 *
 * Schema choice (documented per task brief, see also README.md in this dir):
 *   raw/videos-<slug>.jsonl is treated as sacred/append-only per repo
 *   convention (CLAUDE.md: "raw/ is sacred + append-only ... never edit raw
 *   to 'fix' derived output"). Rather than mutate existing video records in
 *   place (which would mean rewriting an existing raw file — against that
 *   convention, and racy against any other process reading it concurrently),
 *   transcripts land in a NEW raw file per thinker, one JSON object per
 *   video, keyed by the same YouTube video id. This mirrors how papers/X
 *   already get their own raw/<type>-<slug>.jsonl files rather than being
 *   merged into a shared record.
 *
 * Usage:
 *   node pull_transcripts.mjs                       # all raw/videos-*.jsonl
 *   node pull_transcripts.mjs --slug karl-friston    # one thinker
 *   node pull_transcripts.mjs --slug a,b,c           # a few
 *   node pull_transcripts.mjs --limit 20             # cap fetches this run (testing)
 *   node pull_transcripts.mjs --retry-failed         # also retry ids already in skip-list
 *
 * Resumable by construction: every successful fetch is appended immediately
 * to raw/transcripts-<slug>.jsonl and every permanent failure to
 * raw/transcripts-<slug>.skiplist.jsonl; re-running the script re-derives
 * the pending set as (videos - transcripts - skiplist), same idempotent
 * pattern as gather_all.mjs --skip-existing / x_scrape.mjs "already have N".
 */
import { execFileSync } from 'child_process';
import fs from 'fs';
import os from 'os';
import path from 'path';
import { fileURLToPath } from 'url';
import { loadJsonl, appendJsonl, idSet, parseVtt, classifyYtdlpError, sleep, jitter } from './lib.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..', '..');
const RAW_DIR = path.join(ROOT, 'raw');

function getArg(args, k, dflt = null) {
  const i = args.indexOf(k);
  return i >= 0 ? args[i + 1] : dflt;
}

const args = process.argv.slice(2);
const slugFilter = getArg(args, '--slug');
const slugSet = slugFilter ? new Set(slugFilter.split(',').map(s => s.trim())) : null;
const limit = parseInt(getArg(args, '--limit', '0'), 10) || Infinity;
const retryFailed = args.includes('--retry-failed');
const baseSleepMs = parseInt(getArg(args, '--sleep-ms', '3500'), 10);
const sleepSpreadMs = parseInt(getArg(args, '--sleep-spread-ms', '2500'), 10);
const cooldownAfter = parseInt(getArg(args, '--cooldown-after', '5'), 10); // consecutive rate-limit/bot-check failures
const cooldownMs = parseInt(getArg(args, '--cooldown-ms', '90000'), 10);
const maxCooldowns = parseInt(getArg(args, '--max-cooldowns', '4'), 10);

function discoverVideoFiles() {
  return fs.readdirSync(RAW_DIR)
    .filter(f => /^videos-.*\.jsonl$/.test(f))
    .map(f => ({ file: f, slug: f.replace(/^videos-/, '').replace(/\.jsonl$/, '') }))
    .filter(({ slug }) => !slugSet || slugSet.has(slug))
    .sort((a, b) => a.slug.localeCompare(b.slug));
}

function fetchTranscriptVtt(videoId) {
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'agi26-yt-'));
  try {
    execFileSync('yt-dlp', [
      '--skip-download',
      '--write-auto-sub',
      '--sub-lang', 'en',
      '--sub-format', 'vtt',
      '--no-warnings',
      '--ignore-no-formats-error',
      '--no-playlist',
      '-o', '%(id)s.%(ext)s',
      `https://www.youtube.com/watch?v=${videoId}`,
    ], { cwd: tmpDir, encoding: 'utf8', timeout: 90000, maxBuffer: 1 << 26, stdio: ['ignore', 'pipe', 'pipe'] });
  } catch (e) {
    const files = fs.existsSync(tmpDir) ? fs.readdirSync(tmpDir) : [];
    const vttFile = files.find(f => f.endsWith('.vtt'));
    if (!vttFile) {
      fs.rmSync(tmpDir, { recursive: true, force: true });
      const msg = (e.stderr ? e.stderr.toString() : '') + ' ' + (e.stdout ? e.stdout.toString() : '') + ' ' + (e.message || '');
      throw new Error(classifyYtdlpError(msg));
    }
  }
  const files = fs.readdirSync(tmpDir);
  const vttFile = files.find(f => f.endsWith('.vtt'));
  if (!vttFile) {
    fs.rmSync(tmpDir, { recursive: true, force: true });
    throw new Error('no-captions');
  }
  const content = fs.readFileSync(path.join(tmpDir, vttFile), 'utf8');
  fs.rmSync(tmpDir, { recursive: true, force: true });
  return content;
}

async function processFile({ file, slug }) {
  const videosPath = path.join(RAW_DIR, file);
  const transcriptsPath = path.join(RAW_DIR, `transcripts-${slug}.jsonl`);
  const skiplistPath = path.join(RAW_DIR, `transcripts-${slug}.skiplist.jsonl`);

  const videos = loadJsonl(videosPath).filter(v => v && v.id);
  const doneIds = idSet(loadJsonl(transcriptsPath));
  const skipRecs = loadJsonl(skiplistPath);
  const skipIds = idSet(skipRecs);

  const pending = videos.filter(v => {
    if (doneIds.has(v.id)) return false;
    if (skipIds.has(v.id) && !retryFailed) return false;
    return true;
  });

  const stats = { slug, total: videos.length, already_done: doneIds.size, already_skipped: skipIds.size, attempted: 0, fetched: 0, failed: 0, chars: 0, words: 0, reasons: {} };

  if (!pending.length) {
    console.log(`[${slug}] nothing pending (${doneIds.size} done, ${skipIds.size} skipped of ${videos.length})`);
    return stats;
  }
  console.log(`[${slug}] ${pending.length} pending of ${videos.length} (${doneIds.size} already done, ${skipIds.size} in skip-list)`);

  let consecutiveThrottle = 0;
  let cooldowns = 0;

  for (const v of pending) {
    if (globalCount >= limit) break;
    stats.attempted++;
    globalCount++;
    try {
      const vtt = fetchTranscriptVtt(v.id);
      const text = parseVtt(vtt);
      if (!text) throw new Error('no-captions');
      const rec = {
        id: v.id,
        video_id: v.id,
        slug,
        title: v.title || null,
        url: v.url || `https://www.youtube.com/watch?v=${v.id}`,
        channel: v.channel || null,
        duration_sec: v.duration_sec || null,
        transcript_kind: 'auto',
        language: 'en',
        text,
        chars: text.length,
        words: text.split(/\s+/).filter(Boolean).length,
        fetched_at: new Date().toISOString(),
        source: 'yt-dlp-auto-caption',
      };
      appendJsonl(transcriptsPath, rec);
      stats.fetched++;
      stats.chars += rec.chars;
      stats.words += rec.words;
      consecutiveThrottle = 0;
      console.log(`  ok  ${v.id}  ${rec.chars}ch  "${(v.title || '').slice(0, 60)}"`);
    } catch (e) {
      const reason = e.message || 'error';
      stats.failed++;
      stats.reasons[reason] = (stats.reasons[reason] || 0) + 1;
      appendJsonl(skiplistPath, {
        id: v.id, video_id: v.id, slug, title: v.title || null,
        url: v.url || `https://www.youtube.com/watch?v=${v.id}`,
        reason, fetched_at: new Date().toISOString(),
      });
      console.log(`  FAIL ${v.id}  ${reason}  "${(v.title || '').slice(0, 60)}"`);
      if (reason === 'bot-check' || reason === 'rate-limited') {
        consecutiveThrottle++;
        if (consecutiveThrottle >= cooldownAfter) {
          cooldowns++;
          if (cooldowns > maxCooldowns) {
            console.log(`  [${slug}] hit ${cooldowns} cooldowns, giving up on this file for this run — re-run later to resume.`);
            return stats;
          }
          console.log(`  [${slug}] ${consecutiveThrottle} consecutive throttle errors, cooling down ${cooldownMs}ms (cooldown ${cooldowns}/${maxCooldowns})...`);
          await sleep(cooldownMs);
          consecutiveThrottle = 0;
        }
      }
    }
    if (globalCount >= limit) break;
    await sleep(jitter(baseSleepMs, sleepSpreadMs));
  }
  return stats;
}

let globalCount = 0;

async function main() {
  const files = discoverVideoFiles();
  if (!files.length) { console.log('No raw/videos-*.jsonl files match filter.'); return; }
  console.log(`Transcript adapter: ${files.length} thinker(s), sleep ${baseSleepMs}-${baseSleepMs + sleepSpreadMs}ms/req, limit=${limit === Infinity ? 'none' : limit}\n`);

  const allStats = [];
  for (const f of files) {
    if (globalCount >= limit) { console.log(`[global limit ${limit} reached, stopping]`); break; }
    const stats = await processFile(f);
    allStats.push(stats);
  }

  console.log('\n=== SUMMARY ===');
  let totFetched = 0, totFailed = 0, totChars = 0, totWords = 0;
  for (const s of allStats) {
    totFetched += s.fetched; totFailed += s.failed; totChars += s.chars; totWords += s.words;
    console.log(`${s.slug.padEnd(22)} fetched=${s.fetched} failed=${s.failed} chars=${s.chars} words=${s.words} reasons=${JSON.stringify(s.reasons)}`);
  }
  console.log(`TOTAL fetched=${totFetched} failed=${totFailed} chars=${totChars} words=${totWords}`);
}

main().catch(e => { console.error('[pull_transcripts] fatal', e); process.exit(1); });
