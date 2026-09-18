#!/usr/bin/env node
/* stripe-setup — creates everything minds-aligned.org/support/ needs in Stripe.
 *
 * WHY THIS IS A SCRIPT AND NOT A BROWSER ROBOT
 *
 *   Yeshie drives Mike's Chrome for apps that have no API worth using — Suno,
 *   ElevenLabs, YeshID. Stripe is the opposite case: it has one of the better
 *   REST APIs in existence, and everything /support/ needs is four POSTs. A
 *   payload that clicks through dashboard.stripe.com would be slower, would
 *   break on every dashboard redesign, and would need a site model Yeshie does
 *   not have. Use Yeshie where there is no API. Use the API where there is one.
 *
 *   The result: ONE human action (produce a key, once), then one command does
 *   the rest — products, prices, AND the webhook endpoint with its signing
 *   secret. Nothing here needs a person clicking anything.
 *
 * WHAT IT CREATES
 *   1. One Product, "Support for Minds Aligned".
 *   2. Four recurring Prices — $5/mo, $10/mo, $50/yr, $100/yr.
 *   3. A webhook endpoint at /api/stripe-webhook subscribed to the four events
 *      stripe-webhook.mjs actually handles, and prints its signing secret.
 *
 * IDEMPOTENT, ON PURPOSE. Every object is looked up before it is created, by a
 * stable `lookup_key` (prices) or metadata marker (product). Run it twice and
 * the second run creates nothing and prints the same ids. That matters because
 * the failure mode of a non-idempotent setup script is four duplicate prices in
 * a live account and no way to tell which one the site is pointed at.
 *
 * IT REFUSES TO MIX MODES. Test keys make test prices; live keys make live
 * prices; a test price on a live site fails at checkout with a confusing error.
 * The key prefix decides, and the script says which mode it is in, loudly.
 *
 * THE ENV VAR NAMES ARE NOT TYPED HERE. They are read out of
 * hub-public-functions/support-catalog.mjs, so the names this prints are by
 * construction the names the running site looks up. A rename in the catalog
 * cannot drift from what got created.
 *
 * RUN IT
 *   export STRIPE_SECRET_KEY=sk_test_...      # test mode first
 *   node ops/stripe-setup.mjs
 *
 *   --dry-run   show what would be created, touch nothing
 *   --no-hook   skip the webhook endpoint
 *
 * Added 2026-09-18 (Mike Wolf's estate; Claude Opus 5, CCc).
 */

import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const { CAMPAIGNS, INTERVALS, SITE } = await import(
  join(root, 'hub-public-functions/support-catalog.mjs')
);

const DRY = process.argv.includes('--dry-run');
const NO_HOOK = process.argv.includes('--no-hook');
const KEY = process.env.STRIPE_SECRET_KEY;

const PRODUCT_NAME = 'Support for Minds Aligned';
const PRODUCT_MARKER = 'minds-aligned-support';      // metadata, survives a rename
const WEBHOOK_URL = `${SITE}/api/stripe-webhook`;
const WEBHOOK_EVENTS = [
  'checkout.session.completed',
  'invoice.paid',
  'invoice.payment_failed',
  'customer.subscription.deleted',
];

/* The display amounts live in catalog.json, but this script must not depend on
 * the page's copy to decide what to CHARGE. The amounts are here, next to the
 * tier keys they belong to, and check-support-catalog.mjs is what keeps the
 * page's labels honest about them. */
const AMOUNTS = {
  monthly: { 5: 500, 10: 1000 },
  yearly: { 50: 5000, 100: 10000 },
};

const die = (msg) => { console.error(`\n✗ ${msg}\n`); process.exit(1); };

if (!KEY) {
  console.error(`
✗ STRIPE_SECRET_KEY is not set.

  This is the one step nobody can do for you: the key has to come from your
  own Stripe account, and it should never be pasted into a chat or a remote
  session. Get it from the dashboard, export it in THIS shell, and re-run.

    https://dashboard.stripe.com/test/apikeys     (test mode — start here)
    export STRIPE_SECRET_KEY=sk_test_...
    node ops/stripe-setup.mjs

  A restricted key with write access to Products, Prices and Webhook
  Endpoints is enough, and is the safer choice.
`);
  /* If we are on Mike's Mac, put the alert in front of whatever he is doing
   * and open the page he needs. Silently does nothing anywhere else. */
  try {
    const { needsMike } = await import(join(root, 'ops/needs-mike.mjs'));
    await needsMike({
      title: 'Stripe setup needs you',
      message: 'stripe-setup can do the rest by itself, but the API key has to come from you. Opening the Stripe API keys page.',
      url: 'https://dashboard.stripe.com/test/apikeys',
      button: 'Open Stripe',
    });
  } catch { /* not on a Mac, or the notifier is missing: the text above is enough */ }
  process.exit(1);
}

const LIVE = KEY.startsWith('sk_live_') || KEY.startsWith('rk_live_');
const MODE = LIVE ? 'LIVE' : 'TEST';
if (!/^(sk|rk)_(test|live)_/.test(KEY)) die('STRIPE_SECRET_KEY does not look like a Stripe secret or restricted key.');

/* One form-encoded POST, the same shape checkout.mjs uses. Zero dependencies:
 * the Stripe SDK would be a build step, and this file has four calls in it. */
async function stripe(path, { method = 'GET', body } = {}) {
  const res = await fetch(`https://api.stripe.com/v1/${path}`, {
    method,
    headers: {
      authorization: `Bearer ${KEY}`,
      ...(body ? { 'content-type': 'application/x-www-form-urlencoded' } : {}),
      'stripe-version': '2025-08-27.basil',
    },
    ...(body ? { body: new URLSearchParams(body) } : {}),
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) die(`Stripe ${method} /${path} → ${res.status}: ${json?.error?.message || 'unknown error'}`);
  return json;
}

console.log(`\n  Stripe setup — ${MODE} MODE`);
console.log(`  ${'─'.repeat(52)}`);
if (LIVE) console.log('  ⚠  This is your LIVE account. Real prices, real charges.\n');
if (DRY) console.log('  (dry run — nothing will be created)\n');

/* ── 1. The Product ───────────────────────────────────────────────────── */
const found = await stripe(`products/search?query=${encodeURIComponent(`metadata['marker']:'${PRODUCT_MARKER}'`)}`);
let product = found.data?.[0];
if (product) {
  console.log(`  product   ${product.id}  (already there)`);
} else if (DRY) {
  console.log(`  product   would create "${PRODUCT_NAME}"`);
  product = { id: 'prod_DRYRUN' };
} else {
  product = await stripe('products', {
    method: 'POST',
    body: {
      name: PRODUCT_NAME,
      description: 'Support for the work Minds Aligned publishes. Everything it makes stays free to read.',
      'metadata[marker]': PRODUCT_MARKER,
      url: `${SITE}/support/`,
    },
  });
  console.log(`  product   ${product.id}  (created)`);
}

/* ── 2. The Prices ────────────────────────────────────────────────────── */
console.log('');
const envVars = {};
const tiers = [];
for (const intent of Object.keys(INTERVALS)) {
  for (const [key, tier] of Object.entries(CAMPAIGNS['minds-aligned'][intent].tiers)) {
    tiers.push({ intent, key, env: tier.env, amount: AMOUNTS[intent][key] });
  }
}
for (const t of tiers) {
  if (!t.amount) die(`No amount defined for ${t.intent} tier "${t.key}" — add it to AMOUNTS.`);
  const lookup = t.env.toLowerCase();                       // stable, survives everything
  const existing = await stripe(`prices?lookup_keys[]=${encodeURIComponent(lookup)}&limit=1`);
  let price = existing.data?.[0];

  if (price) {
    console.log(`  price     ${price.id}  ${t.env}  (already there)`);
  } else if (DRY) {
    console.log(`  price     would create $${t.amount / 100}/${INTERVALS[t.intent]}  ${t.env}`);
    price = { id: 'price_DRYRUN' };
  } else {
    price = await stripe('prices', {
      method: 'POST',
      body: {
        product: product.id,
        currency: 'usd',
        unit_amount: String(t.amount),
        'recurring[interval]': INTERVALS[t.intent],
        lookup_key: lookup,
        nickname: `$${t.amount / 100}/${INTERVALS[t.intent]}`,
      },
    });
    console.log(`  price     ${price.id}  ${t.env}  (created — $${t.amount / 100}/${INTERVALS[t.intent]})`);
  }
  envVars[t.env] = price.id;
}

/* ── 3. The webhook endpoint ──────────────────────────────────────────── */
let webhookSecret = null;
if (!NO_HOOK) {
  console.log('');
  const hooks = await stripe('webhook_endpoints?limit=100');
  const hook = hooks.data?.find((h) => h.url === WEBHOOK_URL);
  if (hook) {
    console.log(`  webhook   ${hook.id}  (already there)`);
    console.log(`            Stripe only reveals a signing secret at creation. If you do not`);
    console.log(`            have it, roll it in the dashboard and set STRIPE_WEBHOOK_SECRET.`);
  } else if (DRY) {
    console.log(`  webhook   would create ${WEBHOOK_URL}`);
  } else {
    const created = await stripe('webhook_endpoints', {
      method: 'POST',
      body: {
        url: WEBHOOK_URL,
        description: 'minds-aligned.org /support/ — attribution and receipts',
        ...Object.fromEntries(WEBHOOK_EVENTS.map((e, i) => [`enabled_events[${i}]`, e])),
      },
    });
    webhookSecret = created.secret;
    console.log(`  webhook   ${created.id}  (created — ${WEBHOOK_EVENTS.length} events)`);
  }
}

/* ── 4. What to do with the output ────────────────────────────────────── */
console.log(`\n  ${'─'.repeat(52)}`);
console.log(`  Set these on Netlify (site minds-aligned-soma):\n`);
for (const [k, v] of Object.entries(envVars)) console.log(`    ${k.padEnd(31)} ${v}`);
console.log(`    ${'STRIPE_SECRET_KEY'.padEnd(31)} ${KEY.slice(0, 11)}…  (the key you just used)`);
if (webhookSecret) console.log(`    ${'STRIPE_WEBHOOK_SECRET'.padEnd(31)} ${webhookSecret}`);
else if (!NO_HOOK) console.log(`    ${'STRIPE_WEBHOOK_SECRET'.padEnd(31)} whsec_…  (from the dashboard)`);

console.log(`
  A PRICE ID IS NOT A SECRET. Stripe puts them in the Checkout URL. The four
  MA_PRICE_* values above are safe to paste anywhere, including back into a
  chat — hand them over and they can be set on Netlify for you.

  THE TWO KEYS ARE SECRET. STRIPE_SECRET_KEY and STRIPE_WEBHOOK_SECRET should
  go straight into the Netlify UI, or:

    netlify env:set STRIPE_SECRET_KEY "$STRIPE_SECRET_KEY" --context production

  Then check it took:  node ops/check-support-catalog.mjs
`);
if (!LIVE) console.log(`  Test mode: walk a checkout with card 4242 4242 4242 4242 before going live.\n`);
