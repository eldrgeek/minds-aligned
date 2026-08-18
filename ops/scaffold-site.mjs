#!/usr/bin/env node
/* Scaffold a thinker subsite from the hananel-hazan reference build.
 *
 * Copies only the MECHANICAL layer — configs, shared layout, corpus/ask pages,
 * vendored widget assets. Everything that makes a claim about a living person
 * (index.astro, dictionary, readings, site.config.json, FACTCHECK.md) is left
 * for a human/AI to write against that person's own corpus.
 *
 * Usage: node ops/scaffold-site.mjs <slug> "<Display Name>"
 */
import { cpSync, existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';

const [slug, name] = process.argv.slice(2);
if (!slug || !name) { console.error('usage: scaffold-site.mjs <slug> "<Display Name>"'); process.exit(1); }

const sites = new URL('../sites/', import.meta.url).pathname;
const REF = join(sites, 'hananel-hazan');
const OUT = join(sites, slug);
if (!existsSync(join(OUT, 'papers'))) { console.error(`${slug}: no papers/ dir — harvest the corpus first`); process.exit(1); }

/* Verbatim copies — nothing person-specific in them. */
for (const f of ['astro.config.mjs', 'tailwind.config.mjs', 'tsconfig.json', '.gitignore',
                 'scripts/aggregate-content.mjs', 'src/env.d.ts', 'src/content/config.ts',
                 'public/favicon.svg']) {
  mkdirSync(dirname(join(OUT, f)), { recursive: true });
  cpSync(join(REF, f), join(OUT, f));
}
/* Generated/vendored asset trees. soma-page-qr + soma-auth are rebuilt by their own
 * builders; copying keeps a fresh site buildable before those run. */
for (const d of ['public/js', 'public/vendor']) cpSync(join(REF, d), join(OUT, d), { recursive: true });

/* Name-substituted copies. */
const sub = (s) => s.replaceAll('Hananel Hazan', name).replaceAll('hananel-hazan', slug).replaceAll('Hazan', name.split(' ').pop());
for (const f of ['package.json', 'src/layouts/Base.astro', 'src/pages/corpus/index.astro']) {
  mkdirSync(dirname(join(OUT, f)), { recursive: true });
  writeFileSync(join(OUT, f), sub(readFileSync(join(REF, f), 'utf8')));
}
mkdirSync(join(OUT, 'src/data'), { recursive: true });
mkdirSync(join(OUT, 'src/content/readings'), { recursive: true });
console.log(`${slug}: mechanical layer scaffolded. Still to write by hand:
  site.config.json · src/pages/index.astro · src/pages/dictionary/index.astro
  src/pages/ask/index.astro · src/content/readings/*.md · FACTCHECK.md`);
