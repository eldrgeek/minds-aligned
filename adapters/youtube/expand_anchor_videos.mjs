#!/usr/bin/env node
/**
 * expand_anchor_videos.mjs — widen the video-metadata list (yt-dlp
 * flat-playlist, no transcript yet) for the 4 TIER A anchors before running
 * pull_transcripts.mjs against them, per task step 4.
 *
 * Scope discipline: writes ONLY to raw/videos-<slug>.jsonl (append, dedup by
 * id). Does NOT touch sites/<slug>/videos — that's out of scope per the
 * task constraints (sites/ is reserved for the index-rebuild pass).
 *
 * Cap ~50 videos/anchor (existing 25 + up to 25 new). Runs several
 * targeted search queries per anchor biased toward lectures/talks/
 * interviews (title/channel signal only — flat-playlist has no reliable
 * "is this a Short" flag, so duration >= MIN_DURATION_SEC is used as the
 * lecture-vs-short proxy, matching the shortest legitimate long-form items
 * already in the existing corpus, e.g. TEDx clips ~800-1200s).
 *
 * Usage: node expand_anchor_videos.mjs [--slug michael-levin]
 */
import { execFileSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { loadJsonl, appendJsonl, idSet, sleep, jitter } from './lib.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..', '..');
const RAW_DIR = path.join(ROOT, 'raw');

const CAP = 50;
const MIN_DURATION_SEC = 180; // 3 min — bias away from Shorts/clips, per task step 4
const SEARCH_RESULTS_PER_QUERY = 40;

const ANCHORS = [
  ['michael-levin', [
    'Michael Levin full lecture',
    'Michael Levin interview 2025 biology cognition',
    'Michael Levin keynote conference talk',
  ]],
  ['joscha-bach', [
    'Joscha Bach full lecture',
    'Joscha Bach interview 2025 AGI consciousness',
    'Joscha Bach keynote conference talk',
  ]],
  ['karl-friston', [
    'Karl Friston full lecture active inference',
    'Karl Friston interview 2025 free energy',
    'Karl Friston keynote symposium talk',
  ]],
  ['ben-goertzel', [
    'Ben Goertzel full lecture AGI',
    'Ben Goertzel interview 2025 SingularityNET',
    'Ben Goertzel keynote conference talk',
  ]],
];

const args = process.argv.slice(2);
const slugArgIdx = args.indexOf('--slug');
const slugFilter = slugArgIdx >= 0 ? args[slugArgIdx + 1] : null;

function searchYoutube(query) {
  let out = '';
  try {
    out = execFileSync('yt-dlp', ['--flat-playlist', '--no-warnings',
      '--print', '%(id)s\t%(title)s\t%(duration)s\t%(channel)s\t%(view_count)s',
      `ytsearch${SEARCH_RESULTS_PER_QUERY}:${query}`],
      { encoding: 'utf8', timeout: 120000, maxBuffer: 1 << 24 });
  } catch (e) {
    console.log(`    search error for "${query}": ${(e.message || '').slice(0, 80)}`);
    return [];
  }
  const rows = [];
  for (const line of out.split('\n')) {
    const [id, title, dur, channel, views] = line.split('\t');
    if (!id || !title) continue;
    rows.push({ id, title, duration_sec: parseInt(dur) || null, channel: channel || null, views: parseInt(views) || null });
  }
  return rows;
}

async function expandOne(slug, queries) {
  const rawPath = path.join(RAW_DIR, `videos-${slug}.jsonl`);
  const existing = loadJsonl(rawPath);
  const existingIds = idSet(existing);
  const need = CAP - existing.length;
  console.log(`\n[${slug}] existing=${existing.length} cap=${CAP} need=${Math.max(need, 0)}`);
  if (need <= 0) { console.log('  already at/above cap, skipping'); return { slug, added: 0 }; }

  let added = 0;
  const seenThisRun = new Set();
  for (const q of queries) {
    if (added >= need) break;
    console.log(`  query: "${q}"`);
    const results = searchYoutube(q);
    // prefer longer (more lecture-like), stable sort by duration desc
    results.sort((a, b) => (b.duration_sec || 0) - (a.duration_sec || 0));
    for (const r of results) {
      if (added >= need) break;
      if (!r.id || existingIds.has(r.id) || seenThisRun.has(r.id)) continue;
      if (!r.duration_sec || r.duration_sec < MIN_DURATION_SEC) continue; // skip shorts/clips/unknown-length
      const rec = {
        title: r.title, url: `https://www.youtube.com/watch?v=${r.id}`,
        date: null, platform: 'youtube', duration_sec: r.duration_sec,
        channel: r.channel, views: r.views, excerpt: null, has_transcript: false,
        id: r.id,
      };
      appendJsonl(rawPath, rec);
      existingIds.add(r.id);
      seenThisRun.add(r.id);
      added++;
      console.log(`    +${r.id}  ${r.duration_sec}s  "${r.title.slice(0, 60)}"`);
    }
    await sleep(jitter(2500, 1500));
  }
  console.log(`  [${slug}] added ${added} new video-metadata records (total now ${existing.length + added})`);
  return { slug, added };
}

async function main() {
  const targets = ANCHORS.filter(([slug]) => !slugFilter || slug === slugFilter);
  const results = [];
  for (const [slug, queries] of targets) {
    results.push(await expandOne(slug, queries));
  }
  console.log('\n=== EXPAND SUMMARY ===');
  for (const r of results) console.log(`${r.slug.padEnd(16)} +${r.added}`);
}

main().catch(e => { console.error('[expand_anchor_videos] fatal', e); process.exit(1); });
