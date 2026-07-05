import { readFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = dirname(fileURLToPath(import.meta.url));

function fail(msg) {
  console.error(`build: FAIL — ${msg}`);
  process.exit(1);
}

const indexPath = join(root, 'index.html');
const artifactsPath = join(root, 'artifacts.json');

if (!existsSync(indexPath)) fail('index.html missing');
if (!existsSync(artifactsPath)) fail('artifacts.json missing');

const html = readFileSync(indexPath, 'utf8');
if (!html.includes('Review Control Room')) fail('index.html missing expected content');

let artifacts;
try {
  artifacts = JSON.parse(readFileSync(artifactsPath, 'utf8'));
} catch (e) {
  fail(`artifacts.json invalid JSON: ${e.message}`);
}

if (!Array.isArray(artifacts) || artifacts.length === 0) {
  fail('artifacts.json must be a non-empty array');
}

const required = ['id', 'title', 'direction', 'status'];
for (const item of artifacts) {
  for (const key of required) {
    if (!(key in item)) fail(`artifact "${item.id ?? '?'}" missing field: ${key}`);
  }
  if (item.direction.split(/[.!?]/).filter(Boolean).length > 2) {
    fail(`artifact "${item.id}" direction must be one sentence`);
  }
}

const ids = new Set();
for (const item of artifacts) {
  if (ids.has(item.id)) fail(`duplicate artifact id: ${item.id}`);
  ids.add(item.id);
}

const expected = ['hub', 'michael-levin', 'joscha-bach', 'karl-friston', 'ben-goertzel', 'room'];
for (const id of expected) {
  if (!ids.has(id)) fail(`missing expected artifact: ${id}`);
}

console.log(`build: OK — ${artifacts.length} artifacts validated`);