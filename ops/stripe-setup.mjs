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
 *   The result: ONE credential, then one command does the rest — products,
 *   prices, AND the webhook endpoint with its signing secret.
 *
 * WHAT IT CREATES
 *   1. One Product, "Support for Minds Aligned".
 *   2. Four recurring Prices — $5/mo, $10/mo, $50/yr, $100/yr.
 *   3. A webhook endpoint at /api/stripe-webhook subscribed to the four events
 *      stripe-webhook.mjs actually handles, and returns its signing secret.
 *
 * IDEMPOTENT, ON PURPOSE. Every object is looked up before it is created, by a
 * stable `lookup_key` (prices) or metadata marker (product). Run it twice and
 * the second run creates nothing and reports the same ids. That matters because
 * the failure mode of a non-idempotent setup script is four duplicate prices in
 * a live account and no way to tell which one the site is pointed at.
 *
 * IT REFUSES TO MIX MODES. Test keys make test prices; live keys make live
 * prices; a test price on a live site fails at checkout with a confusing error.
 * The key prefix decides, and the run reports which mode it was in, loudly.
 *
 * THE ENV VAR NAMES ARE NOT TYPED HERE. They are read out of
 * hub-public-functions/support-catalog.mjs, so the names this reports are by
 * construction the names the running site looks up. A rename in the catalog
 * cannot drift from what got created.
 *
 * STRUCTURE: `run()` does the work and THROWS on failure; the CLI at the bottom
 * is a thin wrapper that prints and sets exit codes. That split is what lets
 * ops/test-stripe-setup.mjs exercise every create path against a fake Stripe —
 * which matters for a script that will one day be aimed at a live payments
 * account. Importing this file must never charge anyone or create anything.
 *
 * RUN IT
 *   export STRIPE_SECRET_KEY=sk_test_...      # test mode first
 *   node ops/stripe-setup.mjs
 *
 *   --dry-run   report what would be created, POST nothing
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

export const PRODUCT_NAME = 'Support for Minds Aligned';
export const PRODUCT_MARKER = 'minds-aligned-support';   // metadata, survives a rename
export const WEBHOOK_URL = `${SITE}/api/stripe-webhook`;
export const WEBHOOK_EVENTS = [
  'checkout.session.completed',
  'invoice.paid',
  'invoice.payment_failed',
  'customer.subscription.deleted',
];

/* The display amounts live in catalog.json, but this script must not depend on
 * the page's copy to decide what to CHARGE. The amounts are here, next to the
 * tier keys they belong to, and check-support-catalog.mjs is what keeps the
 * page's labels honest about them. */
export const AMOUNTS = {
  monthly: { 5: 500, 10: 1000 },
  yearly: { 50: 5000, 100: 10000 },
};

/* Every tier the site can price, in the order a human would read them. Derived,
 * never typed: the env var names come from the catalog the site actually uses. */
export function tiersToCreate() {
  const out = [];
  for (const intent of Object.keys(INTERVALS)) {
    for (const [key, tier] of Object.entries(CAMPAIGNS['minds-aligned'][intent].tiers)) {
      out.push({
        intent,
        key,
        env: tier.env,
        amount: AMOUNTS[intent]?.[key],
        interval: INTERVALS[intent],
        lookupKey: tier.env.toLowerCase(),   // stable; survives renames of everything else
      });
    }
  }
  return out;
}

export class StripeSetupError extends Error {}

/* ── The work ─────────────────────────────────────────────────────────────
 * Returns a plain report. Throws StripeSetupError on anything that should stop
 * a human. Never calls process.exit, never prints unless given a logger — so a
 * test can run the whole thing and assert on what Stripe was asked for.
 */
export async function run({
  key = process.env.STRIPE_SECRET_KEY,
  dryRun = false,
  noHook = false,
  fetchImpl = globalThis.fetch,
  log = () => {},
} = {}) {
  if (!key) throw new StripeSetupError('STRIPE_SECRET_KEY is not set.');
  if (!/^(sk|rk)_(test|live)_/.test(key)) {
    throw new StripeSetupError('STRIPE_SECRET_KEY does not look like a Stripe secret or restricted key.');
  }

  const live = key.startsWith('sk_live_') || key.startsWith('rk_live_');
  const mode = live ? 'LIVE' : 'TEST';

  /* One form-encoded call, the same shape checkout.mjs uses. Zero dependencies:
   * the Stripe SDK would be a build step, and this has four calls in it. */
  async function stripe(path, { method = 'GET', body } = {}) {
    const res = await fetchImpl(`https://api.stripe.com/v1/${path}`, {
      method,
      headers: {
        authorization: `Bearer ${key}`,
        ...(body ? { 'content-type': 'application/x-www-form-urlencoded' } : {}),
        'stripe-version': '2025-08-27.basil',
      },
      ...(body ? { body: new URLSearchParams(body) } : {}),
    });
    const json = await res.json().catch(() => ({}));
    if (!res.ok) {
      throw new StripeSetupError(
        `Stripe ${method} /${path} → ${res.status}: ${json?.error?.message || 'unknown error'}`);
    }
    return json;
  }

  const report = { mode, live, dryRun, product: null, prices: {}, webhook: null, webhookSecret: null, created: [] };

  log(`\n  Stripe setup — ${mode} MODE`);
  log(`  ${'─'.repeat(52)}`);
  if (live) log('  ⚠  This is your LIVE account. Real prices, real charges.\n');
  if (dryRun) log('  (dry run — nothing will be created)\n');

  /* ── 1. The Product ─────────────────────────────────────────────────── */
  const q = encodeURIComponent(`metadata['marker']:'${PRODUCT_MARKER}'`);
  const found = await stripe(`products/search?query=${q}`);
  let product = found.data?.[0];
  if (product) {
    log(`  product   ${product.id}  (already there)`);
  } else if (dryRun) {
    log(`  product   would create "${PRODUCT_NAME}"`);
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
    report.created.push(`product:${product.id}`);
    log(`  product   ${product.id}  (created)`);
  }
  report.product = product.id;

  /* ── 2. The Prices ──────────────────────────────────────────────────── */
  log('');
  for (const t of tiersToCreate()) {
    if (!t.amount) throw new StripeSetupError(`No amount defined for ${t.intent} tier "${t.key}" — add it to AMOUNTS.`);

    const existing = await stripe(`prices?lookup_keys[]=${encodeURIComponent(t.lookupKey)}&limit=1`);
    let price = existing.data?.[0];

    if (price) {
      log(`  price     ${price.id}  ${t.env}  (already there)`);
    } else if (dryRun) {
      log(`  price     would create $${t.amount / 100}/${t.interval}  ${t.env}`);
      price = { id: 'price_DRYRUN' };
    } else {
      price = await stripe('prices', {
        method: 'POST',
        body: {
          product: product.id,
          currency: 'usd',
          unit_amount: String(t.amount),
          'recurring[interval]': t.interval,
          lookup_key: t.lookupKey,
          nickname: `$${t.amount / 100}/${t.interval}`,
        },
      });
      report.created.push(`price:${t.env}`);
      log(`  price     ${price.id}  ${t.env}  (created — $${t.amount / 100}/${t.interval})`);
    }
    report.prices[t.env] = price.id;
  }

  /* ── 3. The webhook endpoint ────────────────────────────────────────── */
  if (!noHook) {
    log('');
    const hooks = await stripe('webhook_endpoints?limit=100');
    const hook = hooks.data?.find((h) => h.url === WEBHOOK_URL);
    if (hook) {
      report.webhook = hook.id;
      log(`  webhook   ${hook.id}  (already there)`);
      log(`            Stripe only reveals a signing secret at creation. If you do not`);
      log(`            have it, roll it in the dashboard and set STRIPE_WEBHOOK_SECRET.`);
    } else if (dryRun) {
      log(`  webhook   would create ${WEBHOOK_URL}`);
    } else {
      const created = await stripe('webhook_endpoints', {
        method: 'POST',
        body: {
          url: WEBHOOK_URL,
          description: 'minds-aligned.org /support/ — attribution and receipts',
          ...Object.fromEntries(WEBHOOK_EVENTS.map((e, i) => [`enabled_events[${i}]`, e])),
        },
      });
      report.webhook = created.id;
      report.webhookSecret = created.secret ?? null;
      report.created.push(`webhook:${created.id}`);
      log(`  webhook   ${created.id}  (created — ${WEBHOOK_EVENTS.length} events)`);
    }
  }

  return report;
}

/* ── What to do with the output ───────────────────────────────────────── */
export function formatEnv(report, key) {
  const lines = [`\n  ${'─'.repeat(52)}`, `  Set these on Netlify (site minds-aligned-soma):\n`];
  for (const [k, v] of Object.entries(report.prices)) lines.push(`    ${k.padEnd(31)} ${v}`);
  lines.push(`    ${'STRIPE_SECRET_KEY'.padEnd(31)} ${key.slice(0, 11)}…  (the key you just used)`);
  lines.push(`    ${'STRIPE_WEBHOOK_SECRET'.padEnd(31)} ${report.webhookSecret ?? 'whsec_…  (from the dashboard)'}`);
  lines.push(`
  A PRICE ID IS NOT A SECRET. Stripe puts them in the Checkout URL. The four
  MA_PRICE_* values above are safe to paste anywhere, including back into a
  chat — hand them over and they can be set on Netlify for you.

  THE TWO KEYS ARE SECRET. STRIPE_SECRET_KEY and STRIPE_WEBHOOK_SECRET should
  go straight into the Netlify UI, marked "secret" so the API will not read
  them back out, or:

    netlify env:set STRIPE_SECRET_KEY "$STRIPE_SECRET_KEY" --context production --secret

  Then check it took:  node ops/check-support-catalog.mjs`);
  if (!report.live) lines.push(`\n  Test mode: walk a checkout with card 4242 4242 4242 4242 before going live.`);
  return lines.join('\n') + '\n';
}

// ── CLI ──────────────────────────────────────────────────────────────────
if (import.meta.url === `file://${process.argv[1]}`) {
  const key = process.env.STRIPE_SECRET_KEY;

  if (!key) {
    console.error(`
✗ STRIPE_SECRET_KEY is not set.

  This is the one step nobody can do for you: the key has to come from your
  own Stripe account. Get it from the dashboard, export it in THIS shell, and
  re-run.

    https://dashboard.stripe.com/test/apikeys     (test mode — start here)
    export STRIPE_SECRET_KEY=sk_test_...
    node ops/stripe-setup.mjs

  A restricted key with write access to Products, Prices and Webhook
  Endpoints is enough, and is the safer choice.

  Better still: connect the Stripe MCP connector on claude.ai and let an
  agent drive the API directly — no key is handled by anyone in that path.
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

  try {
    const report = await run({
      key,
      dryRun: process.argv.includes('--dry-run'),
      noHook: process.argv.includes('--no-hook'),
      log: console.log,
    });
    console.log(formatEnv(report, key));
  } catch (e) {
    console.error(`\n✗ ${e.message}\n`);
    process.exit(1);
  }
}
