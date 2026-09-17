#!/usr/bin/env node
/* check-support-catalog — keeps the two halves of /support/ from drifting apart.
 *
 * hub-public/support/catalog.json holds the WORDS the page draws.
 * hub-public-functions/support-catalog.mjs holds the PRICES the server resolves.
 * They share nothing but key names, which is what makes the display copy
 * powerless — and also what lets them rot apart silently.
 *
 * The failure this catches: a price or campaign offered by the page that the
 * server cannot resolve. The visitor picks it, /api/checkout answers
 * `unknown-tier` or `not-configured`, and they are bounced back to the page they
 * were just on. Nothing is charged wrongly — but somebody willing to pay was
 * turned away, and nothing anywhere would have said so.
 *
 * It also reports which price env vars a deploy still needs. That list is the
 * setup checklist, generated rather than written down and left behind.
 *
 * Run: node ops/check-support-catalog.mjs
 * Exit 0 clean, 1 on drift. Safe in CI — reads two files, calls nothing.
 */

import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const { CAMPAIGNS, ACCOUNTS, REFERRERS, BENEFITS, INTENTS, INTERVALS } = await import(
  join(root, 'hub-public-functions/support-catalog.mjs')
);
const display = JSON.parse(readFileSync(join(root, 'hub-public/support/catalog.json'), 'utf8'));

const problems = [];
const fail = (m) => problems.push(m);

/* ── Campaigns ─────────────────────────────────────────────────────────── */
for (const k of Object.keys(display.campaigns)) {
  if (!CAMPAIGNS[k]) fail(`catalog.json offers campaign "${k}" that support-catalog.mjs cannot price.`);
}
for (const k of Object.keys(CAMPAIGNS)) {
  if (!display.campaigns[k]) fail(`support-catalog.mjs prices campaign "${k}" that catalog.json never shows.`);
}

/* ── Subscription tiers, per interval ──────────────────────────────────── */
for (const intent of Object.keys(INTERVALS)) {
  const shown = display.tiers?.[intent] ?? [];
  const shownKeys = shown.map((t) => String(t.key));

  if (!shown.length) fail(`catalog.json has no "${intent}" tiers to draw.`);
  if (shown.filter((t) => t.suggested).length !== 1) {
    fail(`"${intent}" must mark exactly one tier suggested — people pick the highlighted one, and two highlights is none.`);
  }
  for (const t of shown) {
    if (!t.key) fail(`a "${intent}" tier has no key.`);
    if (typeof t.amount !== 'number' || t.amount <= 0) fail(`"${intent}" tier "${t.key}" has no usable amount.`);
    if (!t.note) fail(`"${intent}" tier "${t.key}" has no note — a bare number tells a supporter nothing about what it does.`);
  }

  /* Every campaign offering this intent must price exactly what the page shows.
     The tiers are shared by reference server-side, so a mismatch here means the
     sharing was broken, not that one campaign diverged on purpose. */
  for (const [key, priced] of Object.entries(CAMPAIGNS)) {
    const offer = priced[intent];
    if (!offer) {
      if (display.campaigns[key]) fail(`"${key}" does not offer ${intent}, but the page will show ${intent} tiers for it.`);
      continue;
    }
    const pricedKeys = Object.keys(offer.tiers ?? {});
    for (const k of shownKeys) {
      if (!pricedKeys.includes(k)) fail(`${key}/${intent}: page offers "${k}" but support-catalog.mjs has no price for it.`);
    }
    for (const k of pricedKeys) {
      if (!shownKeys.includes(k)) fail(`${key}/${intent}: "${k}" is priced but the page never offers it.`);
    }
  }
}

/* ── Per-campaign one-time amounts ─────────────────────────────────────── */
for (const [key, shown] of Object.entries(display.campaigns)) {
  const priced = CAMPAIGNS[key];
  if (!priced) continue;

  if (!ACCOUNTS[priced.account]) fail(`${key}: account "${priced.account}" is not in ACCOUNTS.`);
  if (shown.lead && !INTENTS.includes(shown.lead)) {
    fail(`${key}: lead must be one of ${INTENTS.join('/')}, got "${shown.lead}".`);
  }
  if (shown.lead && !priced[shown.lead]) fail(`${key}: leads with "${shown.lead}" but does not offer it.`);

  /* A suggested amount outside the clamp is a button that cannot work: the
     visitor picks $1, the server silently raises it to the minimum, and the
     charge does not match what they were shown. */
  const clamp = priced.once?.clamp;
  for (const dollars of shown.once?.amounts ?? []) {
    const cents = Math.round(dollars * 100);
    if (!clamp || cents < clamp.min || cents > clamp.max) {
      fail(`${key}: suggested $${dollars} falls outside the one-time clamp ($${clamp?.min / 100}–$${clamp?.max / 100}).`);
    }
  }
  if (shown.once?.defaultAmount && !(shown.once.amounts ?? []).includes(shown.once.defaultAmount)) {
    fail(`${key}: defaultAmount $${shown.once.defaultAmount} is not one of the offered amounts.`);
  }
}

/* ── Benefits: identical at every level, and identical across the two files ─ */
const shownBenefits = display.benefits ?? [];
if (shownBenefits.length !== BENEFITS.length || shownBenefits.some((b, i) => b !== BENEFITS[i])) {
  fail('catalog.json "benefits" does not match BENEFITS in support-catalog.mjs — the page would promise something the offer does not.');
}
/* A tier that carries its own perk is the thing this whole design exists to
   avoid: it re-creates the per-level promise, and at $120/year the charitable
   safe harbour leaves $2.40 of room for it. */
for (const tiers of Object.values(display.tiers ?? {})) {
  for (const t of tiers) {
    if (t.benefits || t.perks) fail(`tier "${t.key}" carries its own benefits — every level must get the same thing.`);
  }
}

/* ── Referrers ─────────────────────────────────────────────────────────── */
const shownRefs = display.referrers ?? {};
for (const [ref, url] of Object.entries(REFERRERS)) {
  if (!/^https:\/\//.test(url)) fail(`REFERRERS["${ref}"] must be an absolute https URL — got "${url}".`);
  const shown = shownRefs[ref];
  if (!shown) fail(`REFERRERS["${ref}"] has no entry in catalog.json "referrers" — the back link will fall through to the front door.`);
  else if (shown.url !== url) fail(`referrer "${ref}" disagrees: server says ${url}, page says ${shown.url}.`);
  else if (!shown.label) fail(`referrer "${ref}" has no label for the back link.`);
}
for (const ref of Object.keys(shownRefs)) {
  if (!REFERRERS[ref]) fail(`catalog.json shows referrer "${ref}" that the server does not recognise — an abandoned checkout would not return there.`);
}

/* ── The env checklist ─────────────────────────────────────────────────── */
const vars = new Set();
for (const c of Object.values(CAMPAIGNS)) {
  vars.add(ACCOUNTS[c.account]?.env);
  for (const intent of Object.keys(INTERVALS)) {
    for (const t of Object.values(c[intent]?.tiers ?? {})) vars.add(t.env);
  }
}
vars.delete(undefined);

console.log(`campaigns: ${Object.keys(CAMPAIGNS).length} priced, ${Object.keys(display.campaigns).length} shown`);
console.log(`intents:   ${INTENTS.join(', ')}`);
console.log(`benefits:  ${BENEFITS.length}, identical at every level`);
console.log(`\nenv vars this site needs set on Netlify (minds-aligned-soma):`);
for (const v of [...vars].sort()) console.log(`  ${process.env[v] ? '[set]  ' : '[unset]'} ${v}`);
console.log(`  ${process.env.STRIPE_WEBHOOK_SECRET ? '[set]  ' : '[unset]'} STRIPE_WEBHOOK_SECRET`);

if (problems.length) {
  console.error(`\n${problems.length} problem(s):`);
  for (const p of problems) console.error(`  ✗ ${p}`);
  process.exit(1);
}
console.log('\n✓ catalogs agree');
