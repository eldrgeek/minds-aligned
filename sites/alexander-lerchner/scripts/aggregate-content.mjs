#!/usr/bin/env node
import { readdirSync, readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

const root = new URL('..', import.meta.url).pathname;
const papersDir = join(root, 'papers');
const outFile = join(root, 'src/data/papers.json');

const files = readdirSync(papersDir).filter(f => f.endsWith('.json')).sort();
const papers = files.map(f => {
  const slug = f.replace(/\.json$/, '');
  const data = JSON.parse(readFileSync(join(papersDir, f), 'utf8'));
  return { slug, ...data };
});

writeFileSync(outFile, JSON.stringify(papers, null, 2));
console.log(`Aggregated ${papers.length} papers → src/data/papers.json`);
