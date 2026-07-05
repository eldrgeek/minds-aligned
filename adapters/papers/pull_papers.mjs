#!/usr/bin/env node
/**
 * pull_papers.mjs — deterministic OpenAlex papers adapter (no LLM)
 *
 * Usage:
 *   node pull_papers.mjs --name "Karl Friston" --slug karl-friston --cap 400
 *   node pull_papers.mjs --name "Ben Goertzel" --slug ben-goertzel
 *
 * Outputs:
 *   raw/papers-<slug>.jsonl          (verbatim OpenAlex work records, 1/line)
 *   sites/<slug>/papers/<doi-slug>.json  (Levinese schema one-per-work)
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..', '..');

const UA = 'agi-2026-papers/0.1 (mailto:mw@mike-wolf.com; +https://github.com/mikewolf/agi-2026)';
const BASE = 'https://api.openalex.org';
const PER_PAGE = 200;
const SLEEP_MS = 120; // polite

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

function kebab(s) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

function doiToSlug(doi, workId = null) {
  const tail = workId ? workId.split('/').pop() : null;
  if (doi) {
    let d = doi.replace(/^https?:\/\/(dx\.)?doi\.org\//i, '');
    d = d.replace(/^doi:/i, '');
    let s = d.replace(/[\/.:]/g, '-').replace(/-+/g, '-');
    if (tail) s = `${s}--${tail}`;
    return s;
  }
  if (tail) return 'openalex-' + tail;
  return null;
}

function makeDoiUrl(doi) {
  if (!doi) return null;
  if (doi.startsWith('http')) return doi;
  if (doi.startsWith('doi:')) return 'https://doi.org/' + doi.slice(4);
  return 'https://doi.org/' + doi;
}

function extractBareDoi(doi) {
  if (!doi) return null;
  return doi.replace(/^https?:\/\/(dx\.)?doi\.org\//i, '').replace(/^doi:/i, '');
}

async function fetchJson(url, retries = 2) {
  for (let i = 0; i <= retries; i++) {
    try {
      const res = await fetch(url, { headers: { 'User-Agent': UA, 'Accept': 'application/json' } });
      if (res.status === 429) {
        await sleep(1000 * (i + 1));
        continue;
      }
      if (!res.ok) throw new Error(`HTTP ${res.status} ${url}`);
      return await res.json();
    } catch (e) {
      if (i === retries) throw e;
      await sleep(300 * (i + 1));
    }
  }
}

async function resolveAuthor({ name, orcid, authorId }) {
  if (authorId) {
    const id = authorId.replace(/^https?:\/\/openalex\.org\//, '');
    return { id, display_name: name || id };
  }
  if (orcid) {
    const url = `${BASE}/authors?filter=orcid:${encodeURIComponent(orcid)}&per-page=5`;
    const d = await fetchJson(url);
    const hit = (d.results || []).find(a => (a.orcid || '').includes(orcid));
    if (hit) return { id: hit.id.replace(/^https?:\/\/openalex\.org\//, ''), display_name: hit.display_name, orcid: hit.orcid, works_count: hit.works_count };
  }
  // name search — score for best name match (contains query tokens) + high activity
  const q = encodeURIComponent(name);
  const url = `${BASE}/authors?search=${q}&per-page=10`;
  const d = await fetchJson(url);
  const results = d.results || [];
  if (!results.length) throw new Error(`No author found for "${name}"`);
  const qLower = name.toLowerCase();
  const qTokens = qLower.split(/\s+/).filter(Boolean);
  function score(a) {
    const dn = (a.display_name || '').toLowerCase();
    const hasAll = qTokens.every(t => dn.includes(t));
    const hasGoertzel = dn.includes('goertzel');
    const nameScore = (hasAll ? 100 : 0) + (hasGoertzel ? 50 : 0) + (dn.includes(qLower) ? 30 : 0);
    const activity = (a.cited_by_count || 0) * 0.0001 + (a.works_count || 0) * 0.01;
    return nameScore + activity;
  }
  results.sort((a, b) => score(b) - score(a));
  const hit = results[0];
  return {
    id: hit.id.replace(/^https?:\/\/openalex\.org\//, ''),
    display_name: hit.display_name,
    orcid: hit.orcid,
    works_count: hit.works_count,
    cited_by_count: hit.cited_by_count
  };
}

function reconstructAbstract(inv) {
  if (!inv || typeof inv !== 'object') return null;
  const posToWord = {};
  for (const [word, positions] of Object.entries(inv)) {
    if (!Array.isArray(positions)) continue;
    for (const p of positions) {
      const idx = Number(p);
      if (!Number.isNaN(idx)) posToWord[idx] = word;
    }
  }
  if (!Object.keys(posToWord).length) return null;
  const text = Object.keys(posToWord).sort((a, b) => a - b).map(k => posToWord[k]).join(' ').trim();
  return text || null;
}

function extractJournal(w) {
  // primary_location.source.display_name is current
  const pl = w.primary_location || {};
  if (pl.source && pl.source.display_name) return pl.source.display_name;
  if (w.host_venue && w.host_venue.display_name) return w.host_venue.display_name;
  // fallback container or publisher
  if (w.biblio && w.biblio.journal) return w.biblio.journal;
  return null;
}

function extractAuthors(w) {
  const auths = w.authorships || [];
  const names = [];
  for (const a of auths) {
    if (a.author && a.author.display_name) {
      names.push(a.author.display_name);
    } else if (typeof a === 'string') {
      names.push(a);
    }
  }
  return names;
}

function toLevineseRecord(w, linkFallback) {
  const rawDoi = w.doi || (w.ids && w.ids.doi) || null;
  const bare = extractBareDoi(rawDoi);
  const doi_url = makeDoiUrl(rawDoi || bare);
  const title = w.title || w.display_name || '';
  const year = w.publication_year ? String(w.publication_year) : null;
  const journal = extractJournal(w);
  const authors = extractAuthors(w);
  const abstract = w.abstract || reconstructAbstract(w.abstract_inverted_index) || '';
  const link = doi_url || linkFallback || (w.id ? w.id : null);
  return {
    doi: bare || rawDoi || null,
    doi_url,
    title,
    year,
    journal,
    authors,
    abstract,
    link
  };
}

async function fetchAllWorks(authorId, { cap = null, sort = null } = {}) {
  const works = [];
  let cursor = '*';
  let page = 0;
  const filter = `author.id:${authorId}`;
  while (true) {
    let url = `${BASE}/works?filter=${encodeURIComponent(filter)}&per-page=${PER_PAGE}&cursor=${encodeURIComponent(cursor)}`;
    if (sort) url += `&sort=${encodeURIComponent(sort)}`;
    const d = await fetchJson(url);
    const batch = d.results || [];
    works.push(...batch);
    page++;
    console.error(`  page ${page}: +${batch.length} (total ${works.length})`);
    const meta = d.meta || {};
    cursor = meta.next_cursor || null;
    if (!cursor || batch.length === 0) break;
    if (cap && works.length >= cap) {
      console.error(`  cap ${cap} reached, truncating`);
      break;
    }
    await sleep(SLEEP_MS);
  }
  if (cap) return works.slice(0, cap);
  return works;
}

async function writeRawJsonl(slug, works) {
  const outPath = path.join(ROOT, 'raw', `papers-${slug}.jsonl`);
  const lines = works.map(w => JSON.stringify(w)).join('\n') + (works.length ? '\n' : '');
  fs.writeFileSync(outPath, lines, 'utf8');
  return outPath;
}

async function writeSiteRecords(slug, works) {
  const dir = path.join(ROOT, 'sites', slug, 'papers');
  fs.mkdirSync(dir, { recursive: true });
  let written = 0;
  const writtenPaths = [];
  for (const w of works) {
    const rec = toLevineseRecord(w);
    const doiSlug = doiToSlug(rec.doi || rec.doi_url, w.id) || `openalex-${(w.id || '').split('/').pop()}`;
    const out = path.join(dir, `${doiSlug}.json`);
    fs.writeFileSync(out, JSON.stringify(rec, null, 2), 'utf8');
    written++;
    writtenPaths.push(out);
    if (written % 50 === 0) console.error(`  wrote ${written} site records...`);
  }
  return { dir, count: written };
}

async function runFor(name, { slug = null, cap = null, orcid = null, authorId = null, sort = null } = {}) {
  const s = slug || kebab(name);
  console.log(`\n=== ${name} (slug=${s}) ===`);
  const author = await resolveAuthor({ name, orcid, authorId });
  console.log(`Resolved: ${author.id} "${author.display_name}" works~${author.works_count || '?'} cited~${author.cited_by_count || '?'}`);
  if (orcid && author.orcid) console.log(`  ORCID: ${author.orcid}`);

  const works = await fetchAllWorks(author.id, { cap, sort });
  console.log(`Fetched ${works.length} works`);

  const rawPath = await writeRawJsonl(s, works);
  console.log(`Wrote raw: ${rawPath}`);

  const site = await writeSiteRecords(s, works);
  console.log(`Wrote site records: ${site.dir} (${site.count} files)`);

  // samples
  console.log('Sample titles:');
  for (const w of works.slice(0, 5)) {
    const y = w.publication_year || '?';
    const t = (w.title || '').slice(0, 90);
    console.log(`  ${y}  ${t}`);
  }

  return {
    slug: s,
    author_id: author.id,
    display_name: author.display_name,
    resolved_orcid: author.orcid || null,
    count: works.length,
    raw_path: rawPath,
    site_dir: site.dir,
    cap_applied: cap || null,
    sort_applied: sort || null
  };
}

async function main() {
  const args = process.argv.slice(2);
  const getArg = (k) => {
    const i = args.indexOf(k);
    return i >= 0 ? args[i + 1] : null;
  };
  const has = (k) => args.includes(k);

  if (has('--help') || args.length === 0) {
    console.log('Usage: node pull_papers.mjs --name "Name" [--slug s] [--cap N] [--orcid O] [--author-id Axxxx] [--sort cited_by_count:desc]');
    process.exit(0);
  }

  const name = getArg('--name');
  const slug = getArg('--slug');
  const capStr = getArg('--cap');
  const cap = capStr ? parseInt(capStr, 10) : null;
  const orcid = getArg('--orcid');
  const authorId = getArg('--author-id');
  const sort = getArg('--sort');

  if (!name && !authorId) {
    console.error('Need --name or --author-id');
    process.exit(1);
  }

  const res = await runFor(name || 'author', { slug, cap, orcid, authorId, sort });
  console.log('\nDone:', JSON.stringify(res, null, 2));
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(e => { console.error(e); process.exit(1); });
}

export { runFor, resolveAuthor, reconstructAbstract, toLevineseRecord };