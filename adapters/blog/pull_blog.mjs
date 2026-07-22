#!/usr/bin/env node
/**
 * pull_blog.mjs — deterministic RSS/Atom blog adapter (no LLM)
 *
 * Fetches a person's public blog/Substack/WordPress feed, verbatim, and
 * appends new posts to raw/blog-<slug>.jsonl. Follows the conventions of
 * adapters/papers/pull_papers.mjs: no API key, polite sleep between
 * requests, append-only raw output, idempotent re-runs (dedup by stable id).
 *
 * Usage:
 *   node pull_blog.mjs --url "https://thoughtforms.life/feed" --slug michael-levin --name "Michael Levin"
 *   node pull_blog.mjs --url "https://example.substack.com/feed" --slug some-thinker --max-pages 1
 *
 * Supports:
 *   - RSS 2.0 (<item>) with WordPress-style ?paged=N pagination (auto-detected;
 *     stops when a page 404s, repeats the previous page, or returns 0 new items)
 *   - Atom (<entry>) single-page feeds (most Substack/Atom feeds are one page,
 *     no pagination convention to rely on — fetches what's offered)
 *
 * Outputs:
 *   raw/blog-<slug>.jsonl   one JSON record per line, verbatim post text
 *     { id, slug, source, feed_url, title, link, author, published, updated,
 *       summary, content_html, content_text, categories, fetched_at }
 *
 * Dedup key: id = <guid or Atom id, else link> — matches the doi/tweet-id/
 * video-id dedup pattern used by the other adapters. Re-running the same
 * feed only appends genuinely new posts (raw/ is append-only, never rewritten).
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..', '..');

const UA = 'agi-2026-blog/0.1 (mailto:mw@mike-wolf.com; +https://github.com/mikewolf/agi-2026)';
const SLEEP_MS = 400; // polite — these are small personal sites/WordPress/Substack, not an API
const MAX_PAGES_DEFAULT = 20; // safety cap on WordPress-style ?paged=N crawls

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

function kebab(s) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

async function fetchText(url, retries = 2) {
  for (let i = 0; i <= retries; i++) {
    try {
      const res = await fetch(url, { headers: { 'User-Agent': UA, 'Accept': 'application/rss+xml, application/atom+xml, text/xml, */*' } });
      if (res.status === 404) return { status: 404, body: null };
      if (res.status === 429) { await sleep(1500 * (i + 1)); continue; }
      if (!res.ok) throw new Error(`HTTP ${res.status} ${url}`);
      return { status: res.status, body: await res.text() };
    } catch (e) {
      if (i === retries) throw e;
      await sleep(500 * (i + 1));
    }
  }
}

// --- tiny, dependency-free XML text extraction (feeds are well-formed enough
// for regex-based item/entry splitting; avoids pulling in an XML parser dep) ---

function splitBlocks(xml, tag) {
  const re = new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, 'g');
  const out = [];
  let m;
  while ((m = re.exec(xml))) out.push(m[1]);
  return out;
}

function tag(block, name) {
  // handles both <name>text</name> and <name attr="..">text</name>, CDATA-aware
  const re = new RegExp(`<${name}(?:[^>]*)>([\\s\\S]*?)<\\/${name}>`, 'i');
  const m = block.match(re);
  if (!m) return null;
  let v = m[1].trim();
  const cdata = v.match(/^<!\[CDATA\[([\s\S]*?)\]\]>$/);
  if (cdata) v = cdata[1];
  return v;
}

function attrLink(block, rel) {
  // Atom <link rel="alternate" href="...">
  const re = new RegExp(`<link[^>]*rel=["']${rel}["'][^>]*href=["']([^"']+)["']`, 'i');
  const m = block.match(re);
  if (m) return m[1];
  const m2 = block.match(/<link[^>]*href=["']([^"']+)["']/i);
  return m2 ? m2[1] : null;
}

function stripHtml(html) {
  if (!html) return '';
  return html
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1')
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&#8217;/g, "'")
    .replace(/&#8216;/g, "'")
    .replace(/&#8220;/g, '"')
    .replace(/&#8221;/g, '"')
    .replace(/&#8211;/g, '-')
    .replace(/&#8230;/g, '...')
    .replace(/\s+/g, ' ')
    .trim();
}

function parseRssItems(xml) {
  const items = splitBlocks(xml, 'item');
  return items.map(block => {
    const title = tag(block, 'title') || '';
    const link = tag(block, 'link') || '';
    const guid = tag(block, 'guid') || link;
    const pubDate = tag(block, 'pubDate');
    const creator = tag(block, 'dc:creator');
    const description = tag(block, 'description') || '';
    const contentEncoded = tag(block, 'content:encoded') || '';
    const categories = splitBlocks(block, 'category').map(c => c.replace(/<!\[CDATA\[([\s\S]*?)\]\]>/, '$1').trim());
    return {
      id: guid || link,
      title: stripHtml(title),
      link,
      author: creator,
      published: pubDate ? new Date(pubDate).toISOString() : null,
      updated: null,
      summary: stripHtml(description),
      content_html: contentEncoded || description || null,
      content_text: stripHtml(contentEncoded || description),
      categories,
    };
  });
}

function parseAtomEntries(xml) {
  const entries = splitBlocks(xml, 'entry');
  return entries.map(block => {
    const title = tag(block, 'title') || '';
    const link = attrLink(block, 'alternate') || '';
    const id = tag(block, 'id') || link;
    const published = tag(block, 'published');
    const updated = tag(block, 'updated');
    const author = tag(block, 'name'); // <author><name>..</name></author>
    const summary = tag(block, 'summary') || '';
    const content = tag(block, 'content') || '';
    const categories = splitBlocks(block, 'category'); // rarely populated for Atom <category term="x"/>
    return {
      id,
      title: stripHtml(title),
      link,
      author,
      published: published ? new Date(published).toISOString() : null,
      updated: updated ? new Date(updated).toISOString() : null,
      summary: stripHtml(summary),
      content_html: content || summary || null,
      content_text: stripHtml(content || summary),
      categories,
    };
  });
}

function detectFeedType(xml) {
  if (/<feed[\s>]/i.test(xml) && /<entry[\s>]/i.test(xml)) return 'atom';
  if (/<rss[\s>]/i.test(xml) || /<item[\s>]/i.test(xml)) return 'rss';
  return null;
}

function parseFeed(xml) {
  const kind = detectFeedType(xml);
  if (kind === 'atom') return { kind, records: parseAtomEntries(xml) };
  if (kind === 'rss') return { kind, records: parseRssItems(xml) };
  return { kind: null, records: [] };
}

function loadExistingIds(rawPath) {
  const ids = new Set();
  if (!fs.existsSync(rawPath)) return ids;
  const lines = fs.readFileSync(rawPath, 'utf8').split('\n').filter(Boolean);
  for (const line of lines) {
    try {
      const rec = JSON.parse(line);
      if (rec.id) ids.add(rec.id);
    } catch { /* skip malformed line, never crash on dirty data */ }
  }
  return ids;
}

function appendRawJsonl(rawPath, records) {
  if (!records.length) return;
  fs.mkdirSync(path.dirname(rawPath), { recursive: true });
  const lines = records.map(r => JSON.stringify(r)).join('\n') + '\n';
  fs.appendFileSync(rawPath, lines, 'utf8');
}

function buildPagedUrl(baseUrl, page) {
  if (page <= 1) return baseUrl;
  const u = new URL(baseUrl);
  u.searchParams.set('paged', String(page));
  return u.toString();
}

/**
 * Pull a feed. For RSS feeds with WordPress-style ?paged=N support, walks
 * pages until a 404, an empty page, or a page whose items are all already
 * seen (guards against feeds that just repeat page 1 for out-of-range paged=N).
 * Atom feeds (Substack, etc.) are fetched as a single page — most Atom
 * publishers don't expose a stable pagination param, and guessing one risks
 * silently fetching garbage.
 */
async function pullFeed(feedUrl, { slug, name = null, maxPages = MAX_PAGES_DEFAULT } = {}) {
  const s = slug || kebab(name || new URL(feedUrl).hostname);
  const rawPath = path.join(ROOT, 'raw', `blog-${s}.jsonl`);
  const existingIds = loadExistingIds(rawPath);
  console.log(`\n=== blog: ${name || s} (slug=${s}) ===`);
  console.log(`Feed: ${feedUrl}`);
  console.log(`Existing raw records: ${existingIds.size}`);

  const first = await fetchText(feedUrl);
  if (first.status === 404 || !first.body) {
    throw new Error(`Feed URL returned 404 or empty body: ${feedUrl}`);
  }
  const { kind, records: firstRecords } = parseFeed(first.body);
  if (!kind) throw new Error(`Could not detect RSS/Atom in response from ${feedUrl} — not a feed?`);
  console.log(`Feed type: ${kind}`);

  let allRecords = [...firstRecords];
  let page = 1;
  let seenSetForLoopGuard = new Set(firstRecords.map(r => r.id));

  if (kind === 'rss') {
    while (page < maxPages) {
      page++;
      const pagedUrl = buildPagedUrl(feedUrl, page);
      await sleep(SLEEP_MS);
      let res;
      try {
        res = await fetchText(pagedUrl);
      } catch (e) {
        console.log(`  page ${page}: fetch error (${e.message}), stopping pagination`);
        break;
      }
      if (res.status === 404 || !res.body) {
        console.log(`  page ${page}: 404/empty, end of feed`);
        break;
      }
      const parsed = parseFeed(res.body);
      if (!parsed.kind || !parsed.records.length) {
        console.log(`  page ${page}: no items, end of feed`);
        break;
      }
      const newOnThisPage = parsed.records.filter(r => !seenSetForLoopGuard.has(r.id));
      if (newOnThisPage.length === 0) {
        console.log(`  page ${page}: all items already seen (likely repeats page 1 past the real end), stopping`);
        break;
      }
      console.log(`  page ${page}: +${newOnThisPage.length} items`);
      for (const r of newOnThisPage) seenSetForLoopGuard.add(r.id);
      allRecords.push(...newOnThisPage);
    }
  }

  const now = new Date().toISOString();
  const toWrite = [];
  let skippedDup = 0;
  for (const r of allRecords) {
    if (!r.id) continue;
    if (existingIds.has(r.id)) { skippedDup++; continue; }
    existingIds.add(r.id);
    toWrite.push({
      id: r.id,
      slug: s,
      source: 'blog',
      feed_url: feedUrl,
      title: r.title,
      link: r.link,
      author: r.author,
      published: r.published,
      updated: r.updated,
      summary: r.summary,
      content_html: r.content_html,
      content_text: r.content_text,
      categories: r.categories,
      fetched_at: now,
    });
  }

  appendRawJsonl(rawPath, toWrite);
  console.log(`Fetched ${allRecords.length} total items across feed; ${toWrite.length} new, ${skippedDup} already present`);
  console.log(`Wrote raw: ${rawPath}`);
  console.log('Sample titles:');
  for (const r of toWrite.slice(0, 5)) console.log(`  ${r.published ? r.published.slice(0, 10) : '?'}  ${(r.title || '').slice(0, 90)}`);

  return {
    slug: s,
    feed_url: feedUrl,
    feed_type: kind,
    total_seen: allRecords.length,
    new_written: toWrite.length,
    already_present: skippedDup,
    raw_path: rawPath,
  };
}

async function main() {
  const args = process.argv.slice(2);
  const getArg = (k) => {
    const i = args.indexOf(k);
    return i >= 0 ? args[i + 1] : null;
  };

  if (args.includes('--help') || args.length === 0) {
    console.log('Usage: node pull_blog.mjs --url "<feed-url>" --slug <slug> [--name "Display Name"] [--max-pages N]');
    process.exit(0);
  }

  const url = getArg('--url');
  const slug = getArg('--slug');
  const name = getArg('--name');
  const maxPagesStr = getArg('--max-pages');
  const maxPages = maxPagesStr ? parseInt(maxPagesStr, 10) : MAX_PAGES_DEFAULT;

  if (!url) { console.error('Need --url'); process.exit(1); }
  if (!slug) { console.error('Need --slug'); process.exit(1); }

  const res = await pullFeed(url, { slug, name, maxPages });
  console.log('\nDone:', JSON.stringify(res, null, 2));
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(e => { console.error(e); process.exit(1); });
}

export { pullFeed, parseFeed, parseRssItems, parseAtomEntries, stripHtml };
