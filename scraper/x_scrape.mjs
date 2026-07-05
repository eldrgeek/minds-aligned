#!/usr/bin/env node
/**
 * x_scrape.mjs — deterministic X harvest (program, not inference).
 *
 * Talks RAW CDP (chrome-remote-interface) to the user's already-running,
 * logged-in Chrome (chrome-debug skill: ChromeMain on :9222). It creates ONE
 * new tab and attaches only to that target — so it is unaffected by however
 * many other tabs are open (Playwright's connectOverCDP attaches to ALL targets
 * and hangs when the everyday browser has dozens of heavy tabs).
 *
 * Walks  x.com/search?q=from:<handle> since:S until:U&f=live  in date windows,
 * scraping ONLY the handle's authored posts (the profile timeline is ~75%
 * reposts and depth-capped; `from:` search is clean and pages back further).
 *
 * Writes an append-only, verbatim RAW layer: raw/<handle>.jsonl, one record per
 * post. Resumable + idempotent (skips ids already in the file). No model in the
 * loop — every field is read straight from the DOM.
 *
 * Usage:
 *   npm install                      # in scraper/
 *   node x_scrape.mjs --handle Plinz --since 2021-01-01 --until 2026-06-20
 *
 * Flags: --handle H (req) --since YYYY-MM-DD --until YYYY-MM-DD
 *        --window-days N (30) --port 9222 --out PATH --max-stall N (6)
 *
 * Prereq: Chrome on :9222 logged into X — ~/Projects/SOMA/tools/chrome-debug-launcher.sh
 * NOTE: X throttles background tabs, so the scrape tab is activated (brought to
 * front) while harvesting.
 */

import CDP from 'chrome-remote-interface';
import { appendFileSync, existsSync, mkdirSync, readFileSync } from 'fs';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const arg = (n, d) => { const i = process.argv.indexOf('--' + n); return i >= 0 && process.argv[i + 1] ? process.argv[i + 1] : d; };

const HANDLE = arg('handle');
if (!HANDLE) { console.error('ERROR: --handle required'); process.exit(1); }
const SINCE = arg('since', '2018-01-01');
const UNTIL = arg('until', new Date().toISOString().slice(0, 10));
const WINDOW_DAYS = parseInt(arg('window-days', '30'));
const PORT = parseInt(arg('port', '9222'));
const MAX_STALL = parseInt(arg('max-stall', '6'));
const OUT = resolve(arg('out', resolve(__dirname, '..', 'raw', `${HANDLE}.jsonl`)));

const sleep = ms => new Promise(r => setTimeout(r, ms));
const fmt = d => d.toISOString().slice(0, 10);

function* windows(since, until, days) {
  let cur = new Date(since + 'T00:00:00Z');
  const end = new Date(until + 'T00:00:00Z');
  while (cur < end) {
    const nxt = new Date(Math.min(end.getTime(), cur.getTime() + days * 864e5));
    yield [fmt(cur), fmt(nxt)];
    cur = nxt;
  }
}

// In-page harvester — read every rendered tweet verbatim. Self-contained.
const HARVEST_SRC = `(() => {
  const out = [];
  document.querySelectorAll('article[data-testid="tweet"]').forEach(a => {
    const timeEl = a.querySelector('time'); if (!timeEl) return;
    const permaA = timeEl.closest('a'); const href = permaA ? permaA.getAttribute('href') : null;
    if (!href) return;
    const m = href.match(/^\\/([^/]+)\\/status\\/(\\d+)/); if (!m) return;
    const social = a.querySelector('[data-testid="socialContext"]');
    const socialText = social ? social.innerText : '';
    const textEl = a.querySelector('[data-testid="tweetText"]');
    const reply = Array.from(a.querySelectorAll('span')).some(e => /^Replying to/.test(e.textContent || ''));
    out.push({
      id: m[2], author: m[1], date: timeEl.getAttribute('datetime'),
      url: 'https://x.com' + href.split('/photo')[0].split('/analytics')[0],
      text: textEl ? textEl.innerText : '',
      is_reply: reply, is_repost: /reposted/i.test(socialText)
    });
  });
  return out;
})()`;

const SCROLL_SRC = `(() => { window.scrollTo(0, document.documentElement.scrollHeight); return document.documentElement.scrollHeight; })()`;

function loadSeen(path) {
  const seen = new Set();
  if (existsSync(path)) for (const line of readFileSync(path, 'utf8').split('\n')) {
    if (line.trim()) { try { seen.add(JSON.parse(line).id); } catch {} }
  }
  return seen;
}

async function main() {
  mkdirSync(dirname(OUT), { recursive: true });
  const seen = loadSeen(OUT);
  console.log(`[x-scrape] @${HANDLE}  ${SINCE} → ${UNTIL}  (${WINDOW_DAYS}d windows)`);
  console.log(`[x-scrape] out=${OUT}  already have ${seen.size} ids`);

  // Create a dedicated tab and attach to ONLY it.
  const tab = await CDP.New({ port: PORT, url: 'about:blank' });
  const client = await CDP({ port: PORT, target: tab.id });
  const { Page, Runtime } = client;
  await Page.enable();
  await Runtime.enable();
  const evaluate = async expr => {
    const { result, exceptionDetails } = await Runtime.evaluate({ expression: expr, returnByValue: true, awaitPromise: true });
    if (exceptionDetails) throw new Error(exceptionDetails.text || 'eval error');
    return result.value;
  };

  let totalNew = 0;
  // Adaptive windowing: widen on empty (cover barren spans fast), reset to base on
  // a hit, and stop once a long empty stretch shows we've hit X's search-history wall.
  const MAXWIN = Math.max(WINDOW_DAYS * 8, 365);
  const MAX_EMPTY_SPAN = parseInt(arg('max-empty-days', '540'));
  const D = d => new Date(d + 'T00:00:00Z');
  const shift = (iso, days) => fmt(new Date(D(iso).getTime() + days * 864e5));

  async function scrapeWindow(s, u) {
    const q = `from:${HANDLE} since:${s} until:${u}`;
    const url = `https://x.com/search?q=${encodeURIComponent(q)}&f=live&src=typed_query`;
    await CDP.Activate({ port: PORT, id: tab.id }); // foreground so X renders
    await Page.navigate({ url });
    await sleep(2800);
    let winNew = 0, stall = 0, lastH = 0;
    const winIds = new Set(); // distinct authored tweets RENDERED this window (seen or new)
    for (let i = 0; i < 60; i++) {
      let batch = [];
      try { batch = await evaluate(HARVEST_SRC); } catch {}
      for (const r of (batch || [])) {
        if (r.is_repost) continue;
        if (r.author.toLowerCase() !== HANDLE.toLowerCase()) continue;
        winIds.add(r.id);
        if (seen.has(r.id)) continue;
        seen.add(r.id);
        appendFileSync(OUT, JSON.stringify({ ...r, handle: HANDLE, scraped_at: new Date().toISOString() }) + '\n');
        winNew++; totalNew++;
      }
      let h = lastH;
      try { h = await evaluate(SCROLL_SRC); } catch {}
      await sleep(1300);
      if (h === lastH) stall++; else stall = 0;
      lastH = h;
      if (stall >= MAX_STALL) break;
    }
    return { winNew, winRendered: winIds.size };
  }

  try {
    let cur = UNTIL, winDays = WINDOW_DAYS, emptySpan = 0;
    while (D(cur) > D(SINCE)) {
      const start = D(shift(cur, -winDays)) < D(SINCE) ? SINCE : shift(cur, -winDays);
      const { winNew, winRendered } = await scrapeWindow(start, cur);
      console.log(`  [${start}..${cur}]  +${winNew} new / ${winRendered} rendered  (win ${winDays}d, total ${totalNew}, seen ${seen.size})`);
      // Widen/stop on TRUE emptiness (nothing rendered), not on "all already-seen".
      if (winRendered > 0) { winDays = WINDOW_DAYS; emptySpan = 0; }
      else { emptySpan += winDays; winDays = Math.min(MAXWIN, winDays * 2); }
      if (emptySpan >= MAX_EMPTY_SPAN) { console.log(`  [stop] ${emptySpan}d consecutive empty — hit X search-history wall.`); break; }
      cur = start;
    }
  } finally {
    try { await CDP.Close({ port: PORT, id: tab.id }); } catch {}
    try { await client.close(); } catch {}
  }
  console.log(`[x-scrape] done. ${totalNew} new posts → ${OUT}`);
}

main().catch(e => { console.error(e); process.exit(1); });
