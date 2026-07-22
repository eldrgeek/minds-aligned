/* ask.js — AI-host inference endpoint for an AGI-26 archive site.
 *
 * GENERATED FILE. Source of truth: sites/_shared/host/ask.js
 * Regenerate every site's copy with: node sites/_shared/host/build-hosts.mjs
 *
 * What it is: a *retrieval shim* in front of the canonical SOMA inference
 * service. The soma-guide widget POSTs { question, context, persona, app_id }
 * to this function (cfg.inferenceUrl); we retrieve the passages from THIS
 * thinker's corpus that actually bear on the question, staple them to the
 * context with citations, and forward to the shared infer service. The answer
 * comes back grounded in the archive rather than in the model's memory.
 *
 * Why a shim and not a direct Anthropic call: the infer service is the estate's
 * canonical, subscription-backed inference path (SOMA-APP-STANDARD §4 — consume,
 * don't fork). It means no per-site ANTHROPIC_API_KEY, one place to change models,
 * and one place where cost is accounted.
 *
 * Contract with the widget (soma-guide.js _askInference):
 *   in:  { question, context, persona, allowWeb, app_id }
 *   out: { answer }            <- anything else the widget ignores
 */

import CORPUS from './corpus-index.js';

const INFER_URL = 'https://vpsmikewolf.duckdns.org/infer/ask';
const TOP_K = 6;
const MAX_PASSAGE_CHARS = 900;
const INFER_TIMEOUT_MS = 25000;

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Content-Type': 'application/json',
};

/* ── Retrieval ─────────────────────────────────────────────────────────────
 * BM25 over title + abstract + journal, computed in-process. The corpora here
 * are hundreds of documents, not millions — a vector store would be more
 * machinery than the job needs, and it would have to live somewhere. This runs
 * cold-start in a few milliseconds with zero infrastructure.
 */

const STOP = new Set([
  'a', 'an', 'and', 'are', 'as', 'at', 'be', 'but', 'by', 'do', 'does', 'for', 'from',
  'has', 'have', 'how', 'i', 'in', 'is', 'it', 'its', 'of', 'on', 'or', 'that', 'the',
  'their', 'this', 'to', 'was', 'were', 'what', 'when', 'where', 'which', 'who', 'why',
  'will', 'with', 'you', 'your', 'me', 'my', 'about', 'can', 'tell',
]);

function tokenize(s) {
  return String(s || '')
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, ' ')
    .split(/\s+/)
    .filter((t) => t.length > 2 && !STOP.has(t));
}

/* Built once per container, reused across warm invocations. */
const INDEX = (function buildIndex() {
  const docs = (CORPUS.docs || []).map((d, i) => {
    const tokens = tokenize(d.t + ' ' + (d.a || '') + ' ' + (d.j || ''));
    const tf = new Map();
    for (const tok of tokens) tf.set(tok, (tf.get(tok) || 0) + 1);
    return { i, doc: d, tf, len: tokens.length };
  });
  const df = new Map();
  for (const d of docs) for (const tok of d.tf.keys()) df.set(tok, (df.get(tok) || 0) + 1);
  const avgLen = docs.reduce((s, d) => s + d.len, 0) / Math.max(docs.length, 1);
  return { docs, df, avgLen, N: docs.length };
})();

function retrieve(question, k = TOP_K) {
  const qTokens = [...new Set(tokenize(question))];
  if (!qTokens.length || !INDEX.N) return [];

  const k1 = 1.2;
  const b = 0.75;
  const scored = INDEX.docs.map((d) => {
    let score = 0;
    for (const q of qTokens) {
      const f = d.tf.get(q);
      if (!f) continue;
      const n = INDEX.df.get(q) || 0;
      const idf = Math.log(1 + (INDEX.N - n + 0.5) / (n + 0.5));
      score += idf * ((f * (k1 + 1)) / (f + k1 * (1 - b + (b * d.len) / INDEX.avgLen)));
    }
    /* Small nudge toward documents that actually carry an abstract — a title-only
     * hit is a weaker citation than one we can quote from. */
    if (score > 0 && d.doc.a) score *= 1.15;
    return { score, doc: d.doc };
  });

  return scored
    .filter((s) => s.score > 0)
    .sort((a, b2) => b2.score - a.score)
    .slice(0, k)
    .map((s) => s.doc);
}

function renderPassages(docs) {
  if (!docs.length) return '';
  const lines = docs.map((d, i) => {
    const head = [d.t, d.y ? '(' + d.y + ')' : '', d.j ? '— ' + d.j : ''].filter(Boolean).join(' ');
    const body = (d.a || '').slice(0, MAX_PASSAGE_CHARS);
    const link = d.u ? '\n   Link: ' + d.u : '';
    return `[${i + 1}] ${head}${body ? '\n   ' + body : ''}${link}`;
  });
  return (
    'RETRIEVED FROM THE ARCHIVE (the only sources you may cite; cite by title, not by number):\n\n' +
    lines.join('\n\n')
  );
}

/* ── Grounding frame ─────────────────────────────────────────────────────── */

function systemFrame(hostName, subject) {
  return [
    `You are ${hostName}, the AI host of the archive of ${subject}.`,
    `You are NOT ${CORPUS.person}. Never write in their voice, never speak as "I" on their behalf,`,
    `and never invent a quotation. If someone asks what ${CORPUS.person} thinks, answer with what the`,
    `published work says and attribute it to the work.`,
    '',
    'Answer ONLY from the retrieved passages below plus the page context. Cite the paper titles you',
    'used, inline. If the passages do not cover the question, say so plainly and name the closest',
    'thing the archive does contain — do not fill the gap from general knowledge.',
    '',
    'Two to five sentences. Plain prose, no headers, no bullet lists.',
  ].join('\n');
}

/* ── Handler ──────────────────────────────────────────────────────────────── */

export const handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') return { statusCode: 204, headers: CORS, body: '' };
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers: CORS, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  let body;
  try {
    body = JSON.parse(event.body || '{}');
  } catch {
    return { statusCode: 400, headers: CORS, body: JSON.stringify({ error: 'Invalid JSON' }) };
  }

  const question = String(body.question || '').trim();
  if (!question) {
    return { statusCode: 400, headers: CORS, body: JSON.stringify({ error: 'Missing question' }) };
  }

  const hostName = String(body.persona || CORPUS.host || 'Host').slice(0, 60);
  const hits = retrieve(question);

  const context = [
    systemFrame(hostName, CORPUS.subject),
    renderPassages(hits),
    String(body.context || '').slice(0, 4000),
  ]
    .filter(Boolean)
    .join('\n\n');

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), INFER_TIMEOUT_MS);

  try {
    const res = await fetch(INFER_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        question,
        context,
        persona: hostName,
        app_id: CORPUS.slug,
      }),
      signal: controller.signal,
    });

    if (!res.ok) {
      const detail = await res.text().catch(() => '');
      console.warn('[ask] infer service', res.status, detail.slice(0, 300));
      return {
        statusCode: 502,
        headers: CORS,
        body: JSON.stringify({
          error: 'inference_unavailable',
          answer:
            hostName +
            " can't reach the knowledge service right now. The archive itself is still fully browsable — try the corpus page.",
        }),
      };
    }

    const data = await res.json();
    return {
      statusCode: 200,
      headers: CORS,
      body: JSON.stringify({
        answer: data.answer || '',
        sources: hits.map((d) => ({ title: d.t, year: d.y, url: d.u })),
        retrieved: hits.length,
      }),
    };
  } catch (err) {
    console.warn('[ask] error', err && err.message);
    return {
      statusCode: 502,
      headers: CORS,
      body: JSON.stringify({
        error: 'inference_failed',
        answer:
          hostName +
          " couldn't complete that just now. Try again, or browse the corpus directly — everything I know is in there.",
      }),
    };
  } finally {
    clearTimeout(timer);
  }
};
