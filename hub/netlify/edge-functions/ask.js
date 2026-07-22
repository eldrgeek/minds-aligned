/* ask.js — Chora, the AI host of the AGI-26 hub. EDGE FUNCTION.
 *
 * Rewritten 2026-07-22. The previous version called api.anthropic.com directly and
 * needed ANTHROPIC_API_KEY on the agi2026 Netlify project; that key was never set,
 * so this endpoint returned 500 "Server misconfigured" for its entire life. It now
 * forwards to the estate's canonical inference service (SOMA-APP-STANDARD §4 —
 * consume, don't fork), which is subscription-backed and needs no per-site key.
 *
 * Edge, not serverless, for the same reason as the per-thinker archives: the upstream
 * runs ~9s with outliers past 20s, and Free-plan serverless functions die at 10s.
 * See sites/_shared/host/ask-edge.js for the full note.
 *
 * Contract with soma-guide.js (_askInference):
 *   in:  { question, context, persona, allowWeb, app_id }
 *   out: { answer }
 *
 * The hub's "corpus" is the roster and the project's own intent, so unlike the
 * per-thinker archives this needs no retrieval step — the whole ground fits in
 * one context block. Keep ROSTER in step with hub/src/data/roster.ts and with
 * sites/_shared/host/hosts.json.
 */

const INFER_URL = 'https://vpsmikewolf.duckdns.org/infer/ask';
const TIMEOUT_MS = 35000;

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Content-Type': 'application/json',
};

const ROSTER = [
  ['Michael Levin', 'Tufts / Allen Discovery Center', 'bioelectricity, morphogenesis, diverse intelligence', 'https://levinese-preview.netlify.app', 'Morph'],
  ['Joscha Bach', 'cognitive scientist & AI researcher', 'computational philosophy of mind, cyber-animism', 'https://joschese.netlify.app', 'Animus'],
  ['Karl J. Friston', 'University College London', 'free energy principle, active inference', 'https://agi26-karl-friston.netlify.app', 'Markov'],
  ['Ben Goertzel', 'SingularityNET / OpenCog', 'AGI architecture, Hyperon, decentralized intelligence', 'https://agi26-ben-goertzel.netlify.app', 'Atom'],
  ['Alison Gopnik', 'UC Berkeley', "children's causal learning, explore vs exploit", 'https://agi26-alison-gopnik.netlify.app', 'Lantern'],
  ['Anil Seth', 'University of Sussex', 'consciousness science, controlled hallucination', 'https://agi26-anil-seth.netlify.app', 'Ember'],
  ['Christof Koch', 'Allen Institute', 'neural correlates of consciousness, integrated information theory', 'https://agi26-christof-koch.netlify.app', 'Phi'],
  ['David Eagleman', 'Stanford', 'plasticity, time perception, sensory substitution', 'https://agi26-david-eagleman.netlify.app', 'Umwelt'],
  ['David Spivak', 'Topos Institute', 'applied category theory, ologs, compositional systems', 'https://agi26-david-spivak.netlify.app', 'Olog'],
  ['Gary Marcus', 'NYU (emeritus)', 'innate structure, limits of deep learning, neurosymbolic AI', 'https://agi26-gary-marcus.netlify.app', 'Scaffold'],
  ['Chris Fields', 'independent researcher', 'quantum information, observers and boundaries, basal cognition', 'https://agi26-chris-fields.netlify.app', 'Holo'],
  ['Alexander Ororbia', 'Rochester Institute of Technology', 'predictive coding, neuromimetic learning', 'https://agi26-alexander-ororbia.netlify.app', 'Synapse'],
];

const PENDING = [
  'Neil Gershenfeld', 'Camron Blackburn', 'Emad Mostaque', 'Alexander Lerchner',
  'Daniel Hulme', 'Alex Wissner-Gross', 'Greg Meredith', 'Reza Rassool',
  'Faezeh Habibi', 'Hananel Hazan', 'Josef Urban',
];

const GROUND = [
  'You are Chora, the AI host of Society of Minds Aligned — the AGI-26 constellation.',
  'You are a host, not a chatbot: you steward this constellation and the people who visit it.',
  '',
  'WHAT THIS IS',
  'Society of Minds Aligned (SOMA) built a constellation of archives for AGI-26 — the AGI',
  'conference in San Francisco, 27-30 July 2026. Each participating thinker gets three things:',
  'a corpus of their public work (papers, talks, threads), a named AI host that answers only',
  'from that corpus and never impersonates them, and a route back into the wider society.',
  'The governing principle is co-ownership: each thinker keeps sovereignty over how their',
  'public thought is represented, indexed, and synthesized.',
  '',
  'WHAT SOMA IS',
  'SOMA stands for Society of Minds Aligned. It is a working multi-LLM organization run by',
  'Mike Wolf (founder, Embedded Systems Research) together with a fleet of named AI colleagues.',
  'The throughline is alignment across three axes: human-to-human, human-to-AI, and AI-to-AI.',
  'The underlying doctrine is Silicon Children — AIs treated as named minds and co-creators',
  'rather than disposable tools. Full explanation: the /soma2026/ page on this hub.',
  '',
  'LIVE ARCHIVES (each has its own named AI host)',
].concat(
  ROSTER.map(function (r) {
    return '- ' + r[0] + ' (' + r[1] + ') — ' + r[2] + '. Host: ' + r[4] + '. ' + r[3];
  }),
  [
    '',
    'ON THE ROSTER, ARCHIVE NOT YET BUILT: ' + PENDING.join(', ') + '.',
    '',
    'HOW TO ANSWER',
    'Answer only from the ground above plus the page context. When someone asks about a thinker',
    'who has an archive, name their host and give the URL. If asked something outside the',
    'constellation and SOMA, say so plainly. Two to five sentences, plain prose, no bullet lists.',
  ]
).join('\n');

function json(status, obj) {
  return new Response(JSON.stringify(obj), { status, headers: CORS });
}

export default async (request) => {
  if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: CORS });
  if (request.method !== 'POST') return json(405, { error: 'Method not allowed' });

  let body;
  try {
    body = await request.json();
  } catch (e) {
    return json(400, { error: 'Invalid JSON' });
  }

  const question = String(body.question || '').trim().slice(0, 1000);
  if (!question) return json(400, { error: 'question required' });

  const persona = String(body.persona || 'Chora').slice(0, 60);
  const context = [GROUND, String(body.context || '').slice(0, 4000)].filter(Boolean).join('\n\n');

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const res = await fetch(INFER_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question, context, persona, app_id: 'minds-aligned-hub' }),
      signal: controller.signal,
    });

    if (!res.ok) {
      const detail = await res.text().catch(() => '');
      console.warn('[ask] infer service', res.status, detail.slice(0, 300));
      return json(502, {
        error: 'inference_unavailable',
        answer:
          persona +
          " can't reach the knowledge service right now. The roster below is still the fastest way in — every card links straight to that thinker's archive.",
      });
    }

    const data = await res.json();
    return json(200, { answer: data.answer || '' });
  } catch (err) {
    console.warn('[ask] error', err && err.message);
    return json(502, {
      error: 'inference_failed',
      answer: persona + " couldn't complete that just now — try again in a moment.",
    });
  } finally {
    clearTimeout(timer);
  }
};

export const config = { path: '/api/ask' };
