#!/usr/bin/env node
/* build-hosts.mjs — generate the AI-host layer for every AGI-26 archive site.
 *
 *   node sites/_shared/host/build-hosts.mjs [slug ...]
 *
 * For each site with an entry in hosts.json it writes three generated files:
 *
 *   sites/<slug>/netlify/edge-lib/corpus-index.js       — retrieval corpus (ESM default export);
 *                                                         NOT in edge-functions/, see writeCorpusModule
 *   sites/<slug>/netlify/edge-functions/ask.js          — retrieval shim (copy of _shared/host/ask-edge.js),
 *                                                         served at /api/ask via its inline config export
 *   sites/<slug>/public/<slug>-host.js                  — persona + inferenceUrl + scopeGuard, merged
 *                                                         over the site's hand-authored guide config
 *
 * Nothing hand-authored is touched. Walkthroughs live in <slug>-guide-config.js and are
 * merged under the generated host layer at load time (see AIHost.astro for the order).
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, '../../..');
const SITES = path.join(ROOT, 'sites');

const manifest = JSON.parse(fs.readFileSync(path.join(HERE, 'hosts.json'), 'utf8'));
const ASK_EDGE_SRC = fs.readFileSync(path.join(HERE, 'ask-edge.js'), 'utf8');

const only = process.argv.slice(2);

/* Abstracts are the substance of a citation; titles alone make a thin answer.
 * Cap each one so a 400-paper corpus stays a sane function bundle. */
const ABSTRACT_CAP = 1200;
const MAX_DOCS = 500;

function readJson(p, fallback) {
  try {
    return JSON.parse(fs.readFileSync(p, 'utf8'));
  } catch {
    return fallback;
  }
}

/* Levin and Bach live in their own repos (hosts.json → external). Everything else
 * is a workspace under sites/. Resolve both through one accessor so the rest of the
 * generator does not have to care which family a slug belongs to. */
function siteRoot(slug) {
  const ext = (manifest.external || {})[slug];
  return ext ? ext.root : path.join(SITES, slug);
}

/* The public/ config file is named after the site, and the two external repos
 * predate the slug convention (levinese-guide-config.js, joscha-guide-config.js). */
function configSlug(slug) {
  const ext = (manifest.external || {})[slug];
  return ext && ext.configSlug ? ext.configSlug : slug;
}

function buildCorpus(slug, host) {
  const siteDir = siteRoot(slug);
  const papers = readJson(path.join(siteDir, 'src/data/papers.json'), []);

  const docs = [];
  for (const p of papers) {
    if (!p || !p.title) continue;
    docs.push({
      t: String(p.title).trim(),
      y: p.year || null,
      j: (p.journal || '').trim() || null,
      a: (p.abstract || '').replace(/\s+/g, ' ').trim().slice(0, ABSTRACT_CAP) || null,
      u: p.link || p.doi_url || null,
    });
  }

  /* Talks carry ideas the papers often don't — title + description is a real passage. */
  const videoDir = fs.existsSync(path.join(siteDir, 'videos'))
    ? path.join(siteDir, 'videos')
    : path.join(siteDir, 'src/content/videos');
  if (fs.existsSync(videoDir)) {
    for (const f of fs.readdirSync(videoDir).filter((n) => n.endsWith('.json'))) {
      const v = readJson(path.join(videoDir, f), null);
      if (!v || !v.title) continue;
      docs.push({
        t: String(v.title).trim(),
        y: (v.published_at || v.publishedAt || '').slice(0, 4) || null,
        j: 'talk / video',
        a: (v.description || '').replace(/\s+/g, ' ').trim().slice(0, ABSTRACT_CAP) || null,
        u: v.url || (v.id ? 'https://www.youtube.com/watch?v=' + v.id : null),
      });
    }
  }

  /* Bach's corpus is threads, not papers — src/content/xposts/*.json in the Joscha repo.
   * Same shape as everything else once you map excerpt→abstract. Any site with a
   * content/<kind>/ directory of {title, excerpt, url, date} records rides this path. */
  for (const kind of ['xposts', 'substack', 'blog', 'magazine']) {
    const dir = path.join(siteDir, 'src/content', kind);
    if (!fs.existsSync(dir)) continue;
    for (const f of fs.readdirSync(dir).filter((n) => n.endsWith('.json'))) {
      const r = readJson(path.join(dir, f), null);
      if (!r || !r.title) continue;
      docs.push({
        t: String(r.title).trim(),
        y: (r.date || '').slice(0, 4) || null,
        j: kind === 'xposts' ? 'thread / post' : kind,
        a: (r.excerpt || r.body || r.text || '').replace(/\s+/g, ' ').trim().slice(0, ABSTRACT_CAP) || null,
        u: r.url || null,
      });
    }
  }

  /* Dictionary terms are the densest grounding in these archives: a definition written
   * for exactly the concept someone is about to ask about. Levinese ships 119 and Joscha
   * 60 as markdown with YAML frontmatter. Without these, "what is cyber-animism?" retrieved
   * nothing on joschese even though the archive has a term page for it. */
  const termsDir = path.join(siteDir, 'src/content/terms');
  if (fs.existsSync(termsDir)) {
    for (const f of fs.readdirSync(termsDir).filter((n) => n.endsWith('.md'))) {
      const raw = fs.readFileSync(path.join(termsDir, f), 'utf8');
      const m = raw.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
      if (!m) continue;
      const fm = m[1];
      const pick = (key) => {
        const hit = fm.match(new RegExp('^' + key + ':\\s*"?(.*?)"?\\s*$', 'm'));
        return hit ? hit[1].trim() : '';
      };
      const title = pick('title') || f.replace(/\.md$/, '');
      const gloss = m[2].replace(/\s+/g, ' ').trim();
      if (!gloss) continue;
      docs.push({
        t: title,
        y: null,
        j: 'dictionary term',
        a: [pick('subtitle'), gloss].filter(Boolean).join(' — ').slice(0, ABSTRACT_CAP),
        u: pick('source').startsWith('http') ? pick('source') : null,
      });
    }
  }

  /* Rank: dictionary terms first (a definition beats an abstract for a concept question),
   * then anything quotable, then most recent. This ordering is what survives the MAX_DOCS
   * cut, so it decides what the host can actually cite. */
  const rank = (d) => (d.j === 'dictionary term' ? 2 : d.a ? 1 : 0);
  docs.sort((a, b) => rank(b) - rank(a) || (b.y || 0) - (a.y || 0));

  return {
    slug,
    host: host.name,
    person: host.subject.replace(/'s published work$/, '').replace(/^the /, ''),
    subject: host.subject,
    docs: docs.slice(0, MAX_DOCS),
  };
}

function writeCorpusModule(slug, corpus) {
  /* Edge, not serverless: the inference upstream runs ~9s with outliers past 20s and
   * this account's Free plan caps serverless functions at 10s. See ask-edge.js header. */
  const dir = path.join(siteRoot(slug), 'netlify/edge-functions');
  /* The corpus goes in a SIBLING directory, not in edge-functions/. Netlify treats
   * every top-level file under edge-functions/ as a function and rejects any whose
   * default export is not a handler — a data module there fails the whole deploy with
   * "Default export ... must be a function". */
  const lib = path.join(siteRoot(slug), 'netlify/edge-lib');
  fs.mkdirSync(dir, { recursive: true });
  fs.mkdirSync(lib, { recursive: true });
  const body =
    '/* GENERATED by sites/_shared/host/build-hosts.mjs — do not edit by hand. */\n' +
    'export default ' +
    JSON.stringify(corpus) +
    ';\n';
  fs.writeFileSync(path.join(lib, 'corpus-index.js'), body);
  fs.writeFileSync(path.join(dir, 'ask.js'), ASK_EDGE_SRC);
  return corpus.docs.length;
}

function writeHostConfig(slug, host, corpus) {
  const dir = path.join(siteRoot(slug), 'public');
  fs.mkdirSync(dir, { recursive: true });

  /* A short, always-in-context brief so the host can answer "what is this?" and
   * "what is SOMA?" without a retrieval hit. */
  const knowledge = [
    `This site is the archive of ${host.subject} — one property in the AGI-26 constellation,`,
    `built by Society of Minds Aligned (SOMA) for the AGI-26 conference, San Francisco, 27–30 July 2026.`,
    `It holds ${corpus.docs.length} indexed sources: published papers and recorded talks.`,
    `The constellation hub is ${manifest.hubUrl}, and every property links to /soma2026/ there,`,
    `which explains what SOMA is and why we built this.`,
    `Pages here: Home, Corpus (every indexed source, searchable), Dictionary, Ask.`,
  ].join(' ');

  const cfg = {
    persona: {
      id: slug,
      name: host.name,
      avatar: host.avatar,
      greeting: host.greeting,
      shortGreeting: `${host.name} here. Where shall we pick up?`,
    },
    inferenceUrl: '/api/ask',
    askFirst: true,
    tenantId: slug,
    knowledge,
    scopeGuard: {
      contextNote:
        `You are ${host.name}, host of the archive of ${host.subject}, within Society of Minds Aligned. ` +
        `Stay on this archive, the AGI-26 constellation, and SOMA.`,
      deflect: `That's outside this archive. I can help you with ${host.subject}, the AGI-26 constellation, or SOMA — try me there.`,
    },
  };

  const body =
    `/* GENERATED by sites/_shared/host/build-hosts.mjs — do not edit by hand.\n` +
    ` * Host: ${host.name} — ${host.concept}\n` +
    ` * Merges OVER ${slug}-guide-config.js, so hand-authored walkthroughs survive a regen. */\n` +
    `(function () {\n` +
    `  var host = ${JSON.stringify(cfg, null, 2).replace(/\n/g, '\n  ')};\n` +
    `  var cfg = window.SomaGuideConfig || (window.SomaGuideConfig = {});\n` +
    `  cfg.persona = Object.assign({}, cfg.persona, host.persona);\n` +
    `  cfg.inferenceUrl = host.inferenceUrl;\n` +
    `  cfg.askFirst     = host.askFirst;\n` +
    `  cfg.tenantId     = host.tenantId;\n` +
    `  cfg.knowledge    = host.knowledge;\n` +
    `  cfg.scopeGuard   = Object.assign({}, cfg.scopeGuard, host.scopeGuard);\n` +
    `}());\n`;

  fs.writeFileSync(path.join(dir, `${configSlug(slug)}-host.js`), body);
}

/* Per-site netlify.toml. Without one, a `netlify deploy` run from sites/<slug>/ walks
 * up and picks the MONOREPO ROOT netlify.toml — which points publish at hub/dist and
 * the functions dir at a path that does not exist here, and the deploy dies with a
 * bare "Error while running build". This file stops that walk and declares the edge
 * function. (The edge function also carries an inline `export const config`, but the
 * explicit declaration keeps the routing legible in the repo.) */
function writeNetlifyToml(slug) {
  const p = path.join(siteRoot(slug), 'netlify.toml');
  const generated = '# GENERATED by sites/_shared/host/build-hosts.mjs';

  /* The two external repos have hand-written netlify.toml files with redirects that
   * matter. Append the edge-function block instead of overwriting them. */
  if (fs.existsSync(p)) {
    const cur = fs.readFileSync(p, 'utf8');
    if (cur.includes('function = "ask"')) return false;
    fs.writeFileSync(
      p,
      cur.trimEnd() +
        '\n\n' + generated + ' — AI host (see sites/_shared/host/)\n' +
        '[[edge_functions]]\n  path = "/api/ask"\n  function = "ask"\n'
    );
    return true;
  }

  fs.writeFileSync(
    p,
    generated + ' — do not edit by hand.\n' +
      '# Present so a deploy from this directory does not inherit the monorepo root config.\n\n' +
      '[build]\n' +
      '  publish = "dist"\n' +
      '  command = "npm run build"\n\n' +
      '# The AI host. Edge, not serverless: the inference upstream runs ~9s with outliers\n' +
      '# past 20s, and Free-plan serverless functions are capped at 10s.\n' +
      '[[edge_functions]]\n  path = "/api/ask"\n  function = "ask"\n'
  );
  return true;
}

/* A minimal guide config for sites that never had one, so the <slug>-guide-config.js
 * script tag resolves instead of 404-ing. Sites with a hand-authored config keep it. */
function ensureGuideConfig(slug, host) {
  const p = path.join(siteRoot(slug), 'public', `${configSlug(slug)}-guide-config.js`);
  if (fs.existsSync(p)) return false;
  fs.mkdirSync(path.dirname(p), { recursive: true });
  fs.writeFileSync(
    p,
    `/* Minimal guide config for ${slug} — created by build-hosts.mjs because none existed.\n` +
      ` * Safe to replace with a hand-authored siteMap + walkthroughs; the host layer in\n` +
      ` * ${slug}-host.js merges over whatever is here. */\n` +
      `window.SomaGuideConfig = {\n` +
      `  siteMap: [\n` +
      `    { label: 'Home',       path: '/',            description: 'Overview of the archive of ${host.subject}.' },\n` +
      `    { label: 'Corpus',     path: '/corpus/',     description: 'Every indexed paper and talk, searchable.' },\n` +
      `    { label: 'Dictionary', path: '/dictionary/', description: 'Key terms drawn from the work.' },\n` +
      `    { label: 'Ask',        path: '/ask/',        description: 'Ask a question and get an answer grounded in the corpus.' },\n` +
      `  ],\n` +
      `  walkthroughs: [],\n` +
      `};\n`
  );
  return true;
}

/* ── run ─────────────────────────────────────────────────────────────────── */

let built = 0;
for (const [slug, host] of Object.entries(manifest.hosts)) {
  if (slug === 'minds-aligned-hub') continue; // the hub has its own generator below
  if (only.length && !only.includes(slug)) continue;
  if (!fs.existsSync(siteRoot(slug))) {
    console.warn(`skip ${slug} — no site directory`);
    continue;
  }

  const corpus = buildCorpus(slug, host);
  if (!corpus.docs.length) {
    console.warn(`skip ${slug} — empty corpus (no papers.json, no videos)`);
    continue;
  }

  const n = writeCorpusModule(slug, corpus);
  writeHostConfig(slug, host, corpus);
  const madeGuide = ensureGuideConfig(slug, host);
  writeNetlifyToml(slug);
  const kb = Math.round(
    fs.statSync(path.join(siteRoot(slug), 'netlify/edge-lib/corpus-index.js')).size / 1024
  );
  console.log(
    `${host.name.padEnd(9)} ${slug.padEnd(20)} ${String(n).padStart(4)} docs  ${String(kb).padStart(4)}KB` +
      (madeGuide ? '  (+ minimal guide config)' : '')
  );
  built++;
}

console.log(`\n${built} host${built === 1 ? '' : 's'} built.`);
