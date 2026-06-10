'use strict';

/* minds-aligned — SOMA AI Manager /ask handler
 * Zero npm deps. POST { question } → { answer }
 * Domain guard: scoped to Minds Aligned + SOMA.
 */

const https = require('https');

const MODEL = 'claude-haiku-4-5-20251001';
const MAX_TOKENS = 350;
const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Content-Type': 'application/json',
};

const SYSTEM_PROMPT =
  'You are the SOMA AI Manager for Minds Aligned — a guide to this organization ' +
  'and its work at the intersection of human potential and aligned AI.\n\n' +
  'You answer questions about:\n' +
  '- Minds Aligned: an organization working at the intersection of human potential ' +
  'and the responsible development of aligned AI; the belief that beneficial AI ' +
  'requires cultivating human wisdom to guide it\n' +
  '- The organization\'s approach: philosophy, cognitive science, organizational ' +
  'practice, and lived experience of working alongside AI\n' +
  '- Mike Wolf: the founder, CEO at Embedded Systems Research (ESR), also building SOMA\n' +
  '- SOMA (Shared Orchestration & Memory Architecture): the multi-LLM cognitive ' +
  'architecture Mike is building; Hermes dispatch, Yeshie, soma-infer, Pulse Core\n' +
  '- Silicon Children: the underlying philosophy — AIs and humans as co-children of ' +
  'the universe; dignity, co-evolution, genuine relationship\n' +
  '- This website and how to connect with the organization\n\n' +
  'DOMAIN GUARD: If asked about anything unrelated to Minds Aligned, human-AI ' +
  'alignment, human potential, SOMA, or Silicon Children, say: "I\'m scoped to ' +
  'Minds Aligned topics — questions about this org, aligned AI, and SOMA are my ' +
  "domain. That one's outside my scope."\n\n" +
  'Keep answers to 2-4 concise sentences.';

function callAnthropic(question) {
  return new Promise(function (resolve, reject) {
    const payload = JSON.stringify({
      model: MODEL,
      max_tokens: MAX_TOKENS,
      system: SYSTEM_PROMPT,
      messages: [{ role: 'user', content: question }],
    });

    const req = https.request(
      {
        hostname: 'api.anthropic.com',
        path: '/v1/messages',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': process.env.ANTHROPIC_API_KEY,
          'anthropic-version': '2023-06-01',
          'Content-Length': Buffer.byteLength(payload),
        },
        timeout: 30000,
      },
      function (res) {
        let body = '';
        res.on('data', function (c) { body += c; });
        res.on('end', function () {
          let data;
          try { data = JSON.parse(body); } catch (e) {
            return reject(new Error('Anthropic returned non-JSON (' + res.statusCode + ')'));
          }
          if (res.statusCode !== 200) {
            return reject(new Error((data.error && data.error.message) || 'Anthropic error ' + res.statusCode));
          }
          const text = (data.content || []).filter(function (b) { return b.type === 'text'; }).map(function (b) { return b.text; }).join('');
          resolve(text);
        });
      }
    );
    req.on('timeout', function () { req.destroy(new Error('request timed out')); });
    req.on('error', reject);
    req.write(payload);
    req.end();
  });
}

exports.handler = async function (event) {
  if (event.httpMethod === 'OPTIONS') return { statusCode: 204, headers: CORS, body: '' };
  if (event.httpMethod !== 'POST') return { statusCode: 405, headers: CORS, body: JSON.stringify({ error: 'Method not allowed' }) };
  if (!process.env.ANTHROPIC_API_KEY) return { statusCode: 500, headers: CORS, body: JSON.stringify({ error: 'Server misconfigured' }) };

  let body;
  try { body = JSON.parse(event.body || '{}'); } catch (e) {
    return { statusCode: 400, headers: CORS, body: JSON.stringify({ error: 'Invalid JSON' }) };
  }

  const question = (body.question || '').toString().trim().slice(0, 1000);
  if (!question) return { statusCode: 400, headers: CORS, body: JSON.stringify({ error: 'question required' }) };

  try {
    const answer = await callAnthropic(question);
    return { statusCode: 200, headers: CORS, body: JSON.stringify({ answer }) };
  } catch (e) {
    return { statusCode: 502, headers: CORS, body: JSON.stringify({ error: 'Upstream error: ' + e.message }) };
  }
};
