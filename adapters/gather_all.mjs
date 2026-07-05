#!/usr/bin/env node
/**
 * gather_all.mjs — DETERMINISTIC multi-source corpus gathering (no LLM, no rate limit).
 * Per speaker: OpenAlex papers (+ co-author collaborators) and YouTube talks via yt-dlp.
 * Writes raw/* (append-only) and sites/<slug>/{papers,videos}/*.json + collaborators.json.
 *
 *   node gather_all.mjs                # all speakers
 *   node gather_all.mjs joscha-bach    # one slug
 *   node gather_all.mjs --skip-existing
 */
import { execFileSync } from 'child_process';
import { mkdirSync, writeFileSync, existsSync, appendFileSync, readdirSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const onlySlug = process.argv.slice(2).find(a => !a.startsWith('--'));
const SKIP = process.argv.includes('--skip-existing');

// slug, display name, openalex search (academic only), youtube query, x handle
const SPEAKERS = [
  ['michael-levin','Michael Levin','Michael Levin Tufts','Michael Levin biology cognition talk'],
  ['joscha-bach','Joscha Bach',null,'Joscha Bach consciousness AI talk lecture'],
  ['karl-friston','Karl Friston','Karl Friston','Karl Friston free energy active inference talk'],
  ['ben-goertzel','Ben Goertzel','Ben Goertzel','Ben Goertzel AGI SingularityNET talk'],
  ['chris-fields','Chris Fields','Chris Fields quantum','Chris Fields quantum cognition talk'],
  ['christof-koch','Christof Koch','Christof Koch','Christof Koch consciousness talk'],
  ['david-spivak','David Spivak','David Spivak category theory','David Spivak category theory talk'],
  ['anil-seth','Anil Seth','Anil Seth Sussex','Anil Seth consciousness talk'],
  ['alison-gopnik','Alison Gopnik','Alison Gopnik Berkeley','Alison Gopnik child learning talk'],
  ['david-eagleman','David Eagleman','David Eagleman Stanford','David Eagleman brain talk'],
  ['alexander-ororbia','Alexander Ororbia','Alexander Ororbia','Alexander Ororbia predictive coding talk'],
  ['gary-marcus','Gary Marcus','Gary Marcus','Gary Marcus AI talk'],
  ['anil-gopnik-placeholder','',null,null], // guard slot (ignored)
];

const sleep = n => new Promise(r => setTimeout(r, n));
async function oaJson(url) {
  const r = await fetch(url, { headers: { 'User-Agent': 'agi-2026/1.0 (mailto:mw@mike-wolf.com)' } });
  if (!r.ok) throw new Error('OpenAlex ' + r.status);
  return r.json();
}
function deInvert(inv) {
  if (!inv) return '';
  const words = [];
  for (const [w, ps] of Object.entries(inv)) for (const p of ps) words[p] = w;
  return words.join(' ');
}
const slugify = s => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 70);

async function papers(slug, name, searchHint) {
  const dir = resolve(ROOT, 'sites', slug, 'papers');
  if (SKIP && existsSync(dir) && readdirSync(dir).length > 5) { console.log(`  papers: skip (${readdirSync(dir).length})`); return; }
  const au = await oaJson(`https://api.openalex.org/authors?search=${encodeURIComponent(searchHint)}&per-page=1`);
  const author = au.results?.[0];
  if (!author) { console.log('  papers: author not resolved'); return; }
  console.log(`  papers: ${author.display_name} (${author.works_count} works, id ${author.id.split('/').pop()})`);
  mkdirSync(dir, { recursive: true });
  const coauthors = {};
  let cursor = '*', got = 0;
  const CAP = 200;
  while (cursor && got < CAP) {
    const j = await oaJson(`https://api.openalex.org/works?filter=author.id:${author.id.split('/').pop()}&sort=cited_by_count:desc&per-page=50&cursor=${cursor}`);
    for (const w of j.results) {
      const rec = {
        doi: w.doi ? w.doi.replace('https://doi.org/', '') : null,
        doi_url: w.doi || null,
        title: w.title || w.display_name || 'Untitled',
        year: w.publication_year || null,
        journal: w.primary_location?.source?.display_name || null,
        authors: (w.authorships || []).map(a => a.author?.display_name).filter(Boolean),
        abstract: deInvert(w.abstract_inverted_index).slice(0, 4000),
        link: w.primary_location?.landing_page_url || w.doi || null,
      };
      for (const a of rec.authors) if (a !== author.display_name) coauthors[a] = (coauthors[a] || 0) + 1;
      const fn = slugify(rec.doi || rec.title) || ('w' + got);
      writeFileSync(resolve(dir, fn + '.json'), JSON.stringify(rec, null, 2));
      appendFileSync(resolve(ROOT, 'raw', `papers-${slug}.jsonl`), JSON.stringify(rec) + '\n');
      got++;
    }
    cursor = j.meta?.next_cursor; await sleep(120);
  }
  const collab = Object.entries(coauthors).sort((a, b) => b[1] - a[1]).slice(0, 30)
    .map(([name, count]) => ({ name, count }));
  writeFileSync(resolve(ROOT, 'sites', slug, 'collaborators.json'), JSON.stringify(collab, null, 2));
  console.log(`  papers: wrote ${got}; collaborators: ${collab.length}`);
}

function videos(slug, query) {
  const dir = resolve(ROOT, 'sites', slug, 'videos');
  if (SKIP && existsSync(dir) && readdirSync(dir).length > 3) { console.log(`  videos: skip (${readdirSync(dir).length})`); return; }
  mkdirSync(dir, { recursive: true });
  let out = '';
  try {
    out = execFileSync('yt-dlp', ['--flat-playlist', '--no-warnings',
      '--print', '%(id)s\t%(title)s\t%(duration)s\t%(channel)s\t%(view_count)s',
      `ytsearch25:${query}`], { encoding: 'utf8', timeout: 120000, maxBuffer: 1 << 24 });
  } catch (e) { console.log('  videos: yt-dlp error', e.message.slice(0, 60)); return; }
  let n = 0;
  for (const line of out.split('\n')) {
    const [id, title, dur, channel, views] = line.split('\t');
    if (!id || !title) continue;
    const rec = {
      title, url: `https://www.youtube.com/watch?v=${id}`,
      date: null, platform: 'youtube',
      duration_sec: parseInt(dur) || null, channel: channel || null,
      views: parseInt(views) || null, excerpt: null, has_transcript: false,
    };
    writeFileSync(resolve(dir, `yt-${id}.json`), JSON.stringify(rec, null, 2));
    appendFileSync(resolve(ROOT, 'raw', `videos-${slug}.jsonl`), JSON.stringify({ ...rec, id }) + '\n');
    n++;
  }
  console.log(`  videos: wrote ${n}`);
}

const main = async () => {
  mkdirSync(resolve(ROOT, 'raw'), { recursive: true });
  for (const [slug, name, oa, yq] of SPEAKERS) {
    if (!slug || !name) continue;
    if (onlySlug && slug !== onlySlug) continue;
    console.log(`\n== ${name} (${slug}) ==`);
    if (oa) { try { await papers(slug, name, oa); } catch (e) { console.log('  papers ERR', e.message.slice(0, 60)); } }
    if (yq) videos(slug, yq);
  }
  console.log('\n[gather_all] done.');
};
main().catch(e => { console.error(e); process.exit(1); });
