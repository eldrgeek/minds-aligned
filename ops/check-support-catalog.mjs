#!/usr/bin/env node
/* check-support-catalog — keeps the two halves of /support/ from drifting apart.
 *
 * hub-public/support/catalog.json holds the WORDS the page draws.
 * hub-public-functions/support-catalog.mjs holds the PRICES the server resolves.
 * They share nothing but key names, which is what makes the display copy
 * powerless — and also what lets them rot apart silently.
 *
 * The failure this catches: a campaign or tier offered by the page that the
 * server cannot price. The visitor picks it, /api/checkout answers
 * `unknown-tier` or `not-configured`, and they are bounced back to the page
 * they were just on. Nothing is charged wrongly — but somebody willing to pay
 * was turned away, and nothing anywhere would have said so.
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
const { CAMPAIGNS, ACCOUNTS, REFERRERS } = await import(
  join(root, 'hub-public-functions/support-catalog.mjs')
);
const display = JSON.parse(readFileSync(join(root, 'hub-public/support/catalog.json'), 'utf8'));

const problems = [];
const fail = (m) => problems.push(m);

const serverKeys = Object.keys(CAMPAIGNS);
const displayKeys = Object.keys(display.campaigns);

for (const k of displayKeys) {
  if (!CAMPAIGNS[k]) fail(`catalog.json offers campaign "${k}" that support-catalog.mjs cannot price.`);
}
for (const k of serverKeys) {
  if (!display.campaigns[k]) fail(`support-catalog.mjs prices campaign "${k}" that catalog.json never shows.`);
}

for (const [key, shown] of Object.entries(display.campaigns)) {
  const priced = CAMPAIGNS[key];
  if (!priced) continue;

  for (const tier of shown.monthly ?? []) {
    if (!display.tiers[tier]) fail(`${key}: tier "${tier}" has no entry in catalog.json "tiers".`);
    if (!priced.monthly?.[tier]) fail(`${key}: tier "${tier}" is offered but support-catalog.mjs has no price for it.`);
  }
  for (const tier of Object.keys(priced.monthly ?? {})) {
    if (!(shown.monthly ?? []).includes(tier)) fail(`${key}: tier "${tier}" is priced but the page never offers it.`);
  }

  if (!ACCOUNTS[priced.account]) fail(`${key}: account "${priced.account}" is not in ACCOUNTS.`);

  /* A suggested amount outside the clamp is a button that cannot work: the
     visitor picks $1, the server silently raises it to the minimum, and the
     charge does not match what they were shown. */
  const { min, max } = priced.donation ?? {};
  for (const dollars of shown.amounts ?? []) {
    const cents = Math.round(dollars * 100);
    if (cents < min || cents > max) {
      fail(`${key}: suggested $${dollars} falls outside the donation clamp ($${min / 100}–$${max / 100}).`);
    }
  }
  if (shown.defaultAmount && !(shown.amounts ?? []).includes(shown.defaultAmount)) {
    fail(`${key}: defaultAmount $${shown.defaultAmount} is not one of the offered amounts.`);
  }
  if (shown.lead && !['once', 'monthly'].includes(shown.lead)) {
    fail(`${key}: lead must be "once" or "monthly", got "${shown.lead}".`);
  }
}

for (const [ref, url] of Object.entries(REFERRERS)) {
  if (!/^https:\/\//.test(url)) fail(`REFERRERS["${ref}"] must be an absolute https URL — got "${url}".`);
}

/* catalog.json mirrors REFERRERS so the page's "back to where you came from"
   link can name a real destination. Both sides are allowlists of Mike's own
   sites; the point of checking them is that a ref which resolves on ONE side is
   a visitor who gets sent somewhere the other side never agreed to. */
const shownRefs = display.referrers ?? {};
for (const [ref, url] of Object.entries(REFERRERS)) {
  const shown = shownRefs[ref];
  if (!shown) fail(`REFERRERS["${ref}"] has no entry in catalog.json "referrers" — the back link will fall through to the front door.`);
  else if (shown.url !== url) fail(`referrer "${ref}" disagrees: server says ${url}, page says ${shown.url}.`);
  else if (!shown.label) fail(`referrer "${ref}" has no label for the back link.`);
}
for (const ref of Object.keys(shownRefs)) {
  if (!REFERRERS[ref]) fail(`catalog.json shows referrer "${ref}" that the server does not recognise — an abandoned checkout would not return there.`);
}

/* The env vars a deploy needs. Not a failure: on a dev machine none of them are
   set, and that is fine. It is the checklist for the Netlify site's settings. */
const vars = new Set();
for (const c of Object.values(CAMPAIGNS)) {
  vars.add(ACCOUNTS[c.account]?.env);
  for (const t of Object.values(c.monthly ?? {})) vars.add(t.env);
}
vars.delete(undefined);

console.log(`campaigns: ${serverKeys.length} priced, ${displayKeys.length} shown`);
console.log(`\nenv vars this site needs set on Netlify (minds-aligned-soma):`);
for (const v of [...vars].sort()) {
  console.log(`  ${process.env[v] ? '[set]  ' : '[unset]'} ${v}`);
}
console.log(`  ${process.env.STRIPE_WEBHOOK_SECRET ? '[set]  ' : '[unset]'} STRIPE_WEBHOOK_SECRET`);

if (problems.length) {
  console.error(`\n${problems.length} problem(s):`);
  for (const p of problems) console.error(`  ✗ ${p}`);
  process.exit(1);
}
console.log('\n✓ catalogs agree');
