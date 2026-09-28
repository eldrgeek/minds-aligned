#!/usr/bin/env node
/* test-stripe-setup — runs ops/stripe-setup.mjs against a fake Stripe.
 *
 * WHY THIS EXISTS. stripe-setup will one day be pointed at a LIVE payments
 * account, where the cost of a bug in the idempotency lookups is four duplicate
 * prices and no way to tell which one the site is charging against. Every
 * create path is exercised here first, with no network, no account and no key.
 *
 * The properties that matter, in rough order of what they would cost:
 *   - running twice creates NOTHING the second time, and reports the same ids;
 *   - the amounts sent to Stripe are the amounts intended ($5/$10/$50/$100);
 *   - the env var names come from support-catalog.mjs, so what gets created is
 *     what the running site looks up — a rename cannot drift;
 *   - lookup_key is stable and derived, because it is the whole idempotency key;
 *   - the webhook subscribes to exactly the events stripe-webhook.mjs handles;
 *   - a test key never produces live objects, and a malformed key is refused;
 *   - --dry-run POSTs nothing at all.
 *
 * Run: node ops/test-stripe-setup.mjs      (exit 0 = all green)
 */

import { run, formatEnv, tiersToCreate, WEBHOOK_EVENTS, WEBHOOK_URL, PRODUCT_MARKER, StripeSetupError } from './stripe-setup.mjs';

let pass = 0, total = 0;
const check = (name, cond, extra = '') => {
  total++; if (cond) { pass++; console.log('PASS  ' + name); }
  else console.log('FAIL  ' + name + (extra ? '  → ' + extra : ''));
};

/* A Stripe that remembers what it was told, so a second run can find it. */
function fakeStripe({ failWith = null } = {}) {
  const state = { products: [], prices: [], hooks: [] };
  const calls = [];
  let n = 0;
  const ok = (data) => ({ ok: true, status: 200, json: async () => data });

  const fetchImpl = async (url, opts = {}) => {
    const u = new URL(url);
    const path = u.pathname.replace(/^\/v1\//, '');
    const method = opts.method || 'GET';
    const body = opts.body ? Object.fromEntries(new URLSearchParams(String(opts.body))) : null;
    calls.push({ path, method, body, headers: opts.headers, query: u.searchParams });

    if (failWith) return { ok: false, status: failWith.status, json: async () => ({ error: { message: failWith.message } }) };

    if (path === 'products/search') {
      const wanted = u.searchParams.get('query') || '';
      return ok({ data: state.products.filter((p) => wanted.includes(p.metadata.marker)) });
    }
    if (path === 'products' && method === 'POST') {
      const p = { id: `prod_fake${++n}`, metadata: { marker: body['metadata[marker]'] }, name: body.name };
      state.products.push(p);
      return ok(p);
    }
    if (path === 'prices' && method === 'GET') {
      const keys = u.searchParams.getAll('lookup_keys[]');
      return ok({ data: state.prices.filter((p) => keys.includes(p.lookup_key)) });
    }
    if (path === 'prices' && method === 'POST') {
      const p = {
        id: `price_fake${++n}`, lookup_key: body.lookup_key, unit_amount: Number(body.unit_amount),
        recurring: { interval: body['recurring[interval]'] }, product: body.product, currency: body.currency,
      };
      state.prices.push(p);
      return ok(p);
    }
    if (path === 'webhook_endpoints' && method === 'GET') return ok({ data: state.hooks });
    if (path === 'webhook_endpoints' && method === 'POST') {
      const events = Object.entries(body).filter(([k]) => k.startsWith('enabled_events['))
        .sort((a, b) => Number(a[0].match(/\d+/)) - Number(b[0].match(/\d+/))).map(([, v]) => v);
      const h = { id: `we_fake${++n}`, url: body.url, enabled_events: events, secret: 'whsec_fake_secret' };
      state.hooks.push(h);
      return ok(h);
    }
    throw new Error(`fake Stripe got an unexpected call: ${method} ${path}`);
  };
  return { fetchImpl, state, calls };
}

const KEY = 'sk_test_fake';

// ── 1. First run creates everything, correctly ───────────────────────────
let s = fakeStripe();
let r1 = await run({ key: KEY, fetchImpl: s.fetchImpl });

check('mode read from the key prefix', r1.mode === 'TEST' && r1.live === false);
check('product created once', s.state.products.length === 1);
check('product carries the idempotency marker', s.state.products[0].metadata.marker === PRODUCT_MARKER);
check('four prices created', s.state.prices.length === 4, String(s.state.prices.length));

const byLookup = Object.fromEntries(s.state.prices.map((p) => [p.lookup_key, p]));
const expected = {
  ma_price_initiative_month_5: [500, 'month'],
  ma_price_initiative_month_10: [1000, 'month'],
  ma_price_initiative_year_50: [5000, 'year'],
  ma_price_initiative_year_100: [10000, 'year'],
};
for (const [lk, [amount, interval]] of Object.entries(expected)) {
  check(`  ${lk} → ${amount} cents / ${interval}`,
    byLookup[lk]?.unit_amount === amount && byLookup[lk]?.recurring.interval === interval,
    JSON.stringify(byLookup[lk] ?? null));
}
check('every price hangs off the one product', s.state.prices.every((p) => p.product === s.state.products[0].id));
check('every price is USD', s.state.prices.every((p) => p.currency === 'usd'));

// The names the site looks up must be the names that got created.
const catalogEnvs = tiersToCreate().map((t) => t.env).sort();
check('env names come from support-catalog, not typed here',
  JSON.stringify(Object.keys(r1.prices).sort()) === JSON.stringify(catalogEnvs), catalogEnvs.join(','));
check('lookup_key is the env name lowercased (stable, derived)',
  tiersToCreate().every((t) => t.lookupKey === t.env.toLowerCase()));

check('webhook created', s.state.hooks.length === 1);
check('  at the endpoint the function serves', s.state.hooks[0].url === WEBHOOK_URL, s.state.hooks[0].url);
check('  subscribed to exactly the handled events',
  JSON.stringify(s.state.hooks[0].enabled_events) === JSON.stringify(WEBHOOK_EVENTS),
  JSON.stringify(s.state.hooks[0].enabled_events));
check('  signing secret returned to the caller', r1.webhookSecret === 'whsec_fake_secret');
check('report lists what was created', r1.created.length === 6, r1.created.join(','));

check('auth header sent on every call', s.calls.every((c) => c.headers?.authorization === `Bearer ${KEY}`));
check('API version pinned on every call', s.calls.every((c) => c.headers?.['stripe-version'] === '2025-08-27.basil'));

// ── 2. THE ONE THAT MATTERS: running again creates nothing ───────────────
const writesBefore = s.calls.filter((c) => c.method === 'POST').length;
const r2 = await run({ key: KEY, fetchImpl: s.fetchImpl });
const writesAfter = s.calls.filter((c) => c.method === 'POST').length;

check('second run POSTs nothing', writesAfter === writesBefore, `${writesAfter - writesBefore} extra writes`);
check('second run creates no duplicate prices', s.state.prices.length === 4, String(s.state.prices.length));
check('second run creates no duplicate product', s.state.products.length === 1);
check('second run creates no duplicate webhook', s.state.hooks.length === 1);
check('second run reports the SAME price ids', JSON.stringify(r2.prices) === JSON.stringify(r1.prices));
check('second run reports nothing created', r2.created.length === 0, r2.created.join(','));
check('second run cannot return a secret it never saw', r2.webhookSecret === null);

// ── 3. --dry-run touches nothing ─────────────────────────────────────────
const d = fakeStripe();
const rd = await run({ key: KEY, dryRun: true, fetchImpl: d.fetchImpl });
check('dry run POSTs nothing', d.calls.filter((c) => c.method === 'POST').length === 0);
check('dry run still reports the four tiers', Object.keys(rd.prices).length === 4);
check('dry run marks its ids as fake', Object.values(rd.prices).every((v) => v === 'price_DRYRUN'));

// ── 4. --no-hook ─────────────────────────────────────────────────────────
const nh = fakeStripe();
const rn = await run({ key: KEY, noHook: true, fetchImpl: nh.fetchImpl });
check('--no-hook creates no webhook', nh.state.hooks.length === 0 && rn.webhook === null);
check('--no-hook still creates the prices', nh.state.prices.length === 4);

// ── 5. An endpoint that already exists is reused, not duplicated ─────────
const ex = fakeStripe();
ex.state.hooks.push({ id: 'we_existing', url: WEBHOOK_URL, enabled_events: WEBHOOK_EVENTS });
const re = await run({ key: KEY, fetchImpl: ex.fetchImpl });
check('existing webhook reused', ex.state.hooks.length === 1 && re.webhook === 'we_existing');
check('  and no secret is invented for it', re.webhookSecret === null);

// ── 6. Keys ──────────────────────────────────────────────────────────────
const liveRun = await run({ key: 'sk_live_fake', fetchImpl: fakeStripe().fetchImpl });
check('live key → LIVE mode', liveRun.mode === 'LIVE' && liveRun.live === true);
const rkRun = await run({ key: 'rk_test_fake', fetchImpl: fakeStripe().fetchImpl });
check('restricted key accepted', rkRun.mode === 'TEST');

for (const [name, bad] of [['missing key', undefined], ['garbage key', 'hunter2'], ['publishable key', 'pk_test_x']]) {
  let threw = null;
  try { await run({ key: bad, fetchImpl: fakeStripe().fetchImpl }); } catch (e) { threw = e; }
  check(`${name} refused before any call`, threw instanceof StripeSetupError, String(threw));
}

// ── 7. A Stripe error stops the run, loudly ──────────────────────────────
let sErr = null;
try {
  await run({ key: KEY, fetchImpl: fakeStripe({ failWith: { status: 402, message: 'Your account cannot create prices.' } }).fetchImpl });
} catch (e) { sErr = e; }
check('Stripe error surfaces with its message',
  sErr instanceof StripeSetupError && sErr.message.includes('cannot create prices'), String(sErr));

// ── 8. The output a human acts on ────────────────────────────────────────
const out = formatEnv(r1, KEY);
check('output lists all four env vars', tiersToCreate().every((t) => out.includes(t.env)));
check('output carries the real price ids', Object.values(r1.prices).every((id) => out.includes(id)));
check('output never prints the key in full', !out.includes(KEY));
check('output says price ids are not secret', out.includes('NOT A SECRET'));
check('output tells you to mark the keys secret', out.includes('--secret'));

console.log('\n' + pass + '/' + total + ' passed');
process.exit(pass === total ? 0 : 1);
