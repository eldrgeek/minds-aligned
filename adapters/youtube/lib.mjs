// lib.mjs — shared helpers for the youtube transcript adapter.
import fs from 'fs';

/** Read a JSONL file into an array of objects. Tolerant of trailing blank
 *  lines and malformed rows (skips + counts them rather than throwing —
 *  raw/ files are hand-grown over months and not guaranteed pristine). */
export function loadJsonl(p) {
  if (!fs.existsSync(p)) return [];
  const out = [];
  const lines = fs.readFileSync(p, 'utf8').split('\n');
  for (const line of lines) {
    const t = line.trim();
    if (!t) continue;
    try { out.push(JSON.parse(t)); } catch { /* skip malformed row */ }
  }
  return out;
}

/** Append one record as a JSON line (the raw/ append-only convention used
 *  throughout this repo — see pull_papers.mjs / gather_all.mjs / x_scrape.mjs). */
export function appendJsonl(p, rec) {
  fs.appendFileSync(p, JSON.stringify(rec) + '\n');
}

export function idSet(records, key = 'id') {
  return new Set(records.map(r => r && r[key]).filter(Boolean));
}

/**
 * Parse a YouTube auto-caption (or manual) VTT file into clean running text.
 *
 * YouTube's auto-caption VTT is a *rolling* format: each cue re-displays the
 * tail of the previous cue plus newly-revealed words (word-level <c> tags),
 * then a near-zero-duration cue "finalizes" that line before the next
 * window starts. Naively concatenating cue text duplicates ~2x the content.
 *
 * Fix: strip all <...> tags (both the cue-level and inline word-timestamp
 * tags), then walk cues in order doing a sliding-window token-overlap dedup
 * — for each new cue's token list, find the longest suffix of the
 * accumulated output that matches a prefix of the new cue, and only append
 * the non-overlapping remainder. This is the standard technique for
 * cleaning rolling YouTube auto-subs and degrades gracefully on manual
 * (non-rolling) VTT too — manual subs have no overlap, so every cue is
 * appended in full.
 */
export function parseVtt(vtt) {
  const lines = vtt.split(/\r?\n/);
  const blocks = [];
  let cur = [];
  for (const line of lines) {
    if (line.trim() === '') {
      if (cur.length) blocks.push(cur);
      cur = [];
    } else {
      cur.push(line);
    }
  }
  if (cur.length) blocks.push(cur);

  const cueTexts = [];
  for (const block of blocks) {
    const timingIdx = block.findIndex(l => l.includes('-->'));
    if (timingIdx === -1) continue; // WEBVTT header / NOTE / Kind: / Language: block
    let joined = block.slice(timingIdx + 1).join(' ');
    joined = joined.replace(/<[^>]+>/g, ''); // strip <c>, </c>, <00:00:16.960>, etc.
    joined = joined.replace(/\s+/g, ' ').trim();
    if (joined) cueTexts.push(joined);
  }

  const out = [];
  const MAX_WINDOW = 40; // rolling overlap is a few words to one line; 40 is generous headroom
  for (const t of cueTexts) {
    const tokens = t.split(' ').filter(Boolean);
    const maxOverlap = Math.min(out.length, tokens.length, MAX_WINDOW);
    let overlap = 0;
    for (let k = maxOverlap; k > 0; k--) {
      let match = true;
      for (let i = 0; i < k; i++) {
        if (out[out.length - k + i] !== tokens[i]) { match = false; break; }
      }
      if (match) { overlap = k; break; }
    }
    for (let i = overlap; i < tokens.length; i++) out.push(tokens[i]);
  }
  return out.join(' ').replace(/\s+/g, ' ').trim();
}

/** Rough, deterministic error classifier so the skip-list reason column is
 *  grep-able instead of a wall of raw stderr per row. */
export function classifyYtdlpError(msg) {
  const m = (msg || '').toLowerCase();
  if (m.includes('sign in to confirm') || m.includes('confirm you’re not a bot') || m.includes('confirm you are not a bot')) return 'bot-check';
  if (m.includes('http error 429') || m.includes('429')) return 'rate-limited';
  if (m.includes('private video')) return 'private';
  if (m.includes('video unavailable') || m.includes('this video is not available')) return 'unavailable';
  if (m.includes('members-only') || m.includes('join this channel')) return 'members-only';
  if (m.includes('age-restricted') || m.includes('sign in to confirm your age')) return 'age-restricted';
  if (m.includes('no subtitles') || m.includes('no automatic captions') || m.includes('requested format is not available')) return 'no-captions';
  if (m.includes('etimedout') || m.includes('timed out') || m.includes('timeout')) return 'timeout';
  return 'error: ' + (msg || '').toString().replace(/\s+/g, ' ').trim().slice(0, 140);
}

export function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

export function jitter(baseMs, spreadMs) {
  return baseMs + Math.floor(Math.random() * spreadMs);
}
