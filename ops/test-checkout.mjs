#!/usr/bin/env node
/* test-checkout — exercises /api/checkout with Stripe stubbed out.
 *
 * Every assertion here is a property somebody could otherwise break by editing
 * checkout.mjs in a hurry. The ones that matter most are not the happy paths:
 *
 *   - a price NEVER comes out of the query string (only a Price ID from env, or
 *     an open amount clamped into that intent's range);
 *   - `ref` never becomes a redirect target, however it is spelled;
 *   - a missing account key fails CLOSED instead of billing the LLC for what was
 *     meant to be a deductible gift to the nonprofit;
 *   - nothing reaches Stripe on bad input;
 *   - the 303 to a single-use Checkout Session is never cacheable.
 *
 * Run: node ops/test-checkout.mjs      (exit 0 = all green)
 * No network, no Stripe account, no secrets — `fetch` is replaced below.
 */

process.env.STRIPE_SECRET_KEY = 'sk_test_fake';
process.env.MA_PRICE_INITIATIVE_MONTH_5 = 'price_month5';
process.env.MA_PRICE_INITIATIVE_MONTH_10 = 'price_month10';
process.env.MA_PRICE_INITIATIVE_YEAR_100 = 'price_year100';
// MA_PRICE_INITIATIVE_YEAR_50 deliberately left unset — see the fail-closed case.

let lastCall = null;
globalThis.fetch = async (url, opts) => {
  lastCall = { url, body: Object.fromEntries(new URLSearchParams(opts.body)) };
  return { ok: true, status: 200, json: async () => ({ url: 'https://checkout.stripe.com/c/pay/cs_test_abc', id: 'cs_test_abc' }) };
};

const { default: checkout } = await import(new URL('../hub-public-functions/checkout.mjs', import.meta.url).href);
const call = (qs, init) => { lastCall = null; return checkout(new Request('https://minds-aligned.org/api/checkout?' + qs, init)); };

let pass = 0, total = 0;
const check = (name, cond, extra = '') => {
  total++; if (cond) { pass++; console.log('PASS  ' + name); }
  else console.log('FAIL  ' + name + (extra ? '  → ' + extra : ''));
};
const B = () => lastCall.body;

// ── 1. Listed subscription prices resolve from env, never from the URL ────
let r = await call('campaign=minds-aligned&intent=monthly&tier=10&ref=garage-door-song');
check('monthly → 303 to Stripe', r.status === 303 && r.headers.get('location').startsWith('https://checkout.stripe.com/'));
check('monthly → mode=subscription', B().mode === 'subscription', B().mode);
check('monthly → Price ID from env', B()['line_items[0][price]'] === 'price_month10', B()['line_items[0][price]']);
check('monthly → no client-settable unit_amount', !('line_items[0][price_data][unit_amount]' in B()));
check('monthly → metadata on the SUBSCRIPTION too', B()['subscription_data[metadata][ref]'] === 'garage-door-song');
check('monthly → intent recorded', B()['metadata[intent]'] === 'monthly');
check('redirect is never cached', /no-store/.test(r.headers.get('cache-control')));

await call('campaign=minds-aligned&intent=yearly&tier=100');
check('yearly → its own Price ID', B()['line_items[0][price]'] === 'price_year100', B()['line_items[0][price]']);
check('yearly → still a subscription', B().mode === 'subscription');

await call('campaign=minds-aligned&intent=monthly&tier=5');
check('the lower monthly rung works too', B()['line_items[0][price]'] === 'price_month5');

// An amount alongside a listed tier must not override the tier's real price.
await call('campaign=minds-aligned&intent=monthly&tier=10&amount=0.01');
check('&amount=0.01 cannot undercut a listed tier', B()['line_items[0][price]'] === 'price_month10' && !('line_items[0][price_data][unit_amount]' in B()), JSON.stringify(B()['line_items[0][price_data][unit_amount]']));

// ── 2. The open amount: supporter picks, the clamp bounds it ──────────────
await call('campaign=minds-aligned&intent=monthly&amount=40');
check('open monthly → recurring price_data', B()['line_items[0][price_data][recurring][interval]'] === 'month', B()['line_items[0][price_data][recurring][interval]']);
check('open monthly → $40 becomes 4000 cents', B()['line_items[0][price_data][unit_amount]'] === '4000');
check('open monthly → still a subscription', B().mode === 'subscription');

await call('campaign=minds-aligned&intent=yearly&amount=500');
check('open yearly → interval=year', B()['line_items[0][price_data][recurring][interval]'] === 'year');
check('open yearly has no ceiling short of the clamp', B()['line_items[0][price_data][unit_amount]'] === '50000');

await call('campaign=minds-aligned&intent=monthly&amount=0.01');
check('open monthly $0.01 clamps UP to $3', B()['line_items[0][price_data][unit_amount]'] === '300', B()['line_items[0][price_data][unit_amount]']);
await call('campaign=minds-aligned&intent=yearly&amount=99999');
check('open yearly clamps DOWN to $10,000', B()['line_items[0][price_data][unit_amount]'] === '1000000', B()['line_items[0][price_data][unit_amount]']);

// ── 3. One-time ───────────────────────────────────────────────────────────
r = await call('campaign=garage-door&intent=once&amount=15&ref=garage-door-song');
check('one-time → mode=payment', B().mode === 'payment');
check('one-time → $15 becomes 1500 cents', B()['line_items[0][price_data][unit_amount]'] === '1500');
check('one-time → submit_type=donate', B().submit_type === 'donate');
check('one-time → no recurring block', !('line_items[0][price_data][recurring][interval]' in B()));
check('one-time → customer_creation=always', B().customer_creation === 'always');
check('one-time → cancel_url is the referring site', B().cancel_url === 'https://garage-door-song.netlify.app/', B().cancel_url);
await call('campaign=garage-door&intent=once&amount=12.505');
check('fractional cents round, not truncate', B()['line_items[0][price_data][unit_amount]'] === '1251');

// ── 4. Bad input bounces back and never reaches Stripe ────────────────────
for (const [name, qs, code] of [
  ['non-numeric amount',      'campaign=garage-door&intent=once&amount=abc', 'bad-amount'],
  ['negative amount',         'campaign=garage-door&intent=once&amount=-50', 'bad-amount'],
  ['unknown campaign',        'campaign=not-a-thing&intent=once&amount=10',  'unknown-campaign'],
  ['unknown tier',            'campaign=garage-door&intent=monthly&tier=999', 'unknown-tier'],
  ['tier with no price set',  'campaign=garage-door&intent=yearly&tier=50',  'not-configured'],
]) {
  r = await call(qs);
  const loc = r.headers.get('location') || '';
  check(name + ' → bounced with ?error=' + code, r.status === 303 && loc.includes('error=' + code), loc);
  check(name + ' → Stripe never called', lastCall === null);
}

r = await call('');
check('bare /api/checkout → sent to /support/ to pick, not an error', r.status === 303 && (r.headers.get('location') || '').includes('/support/') && !(r.headers.get('location') || '').includes('error='));
check('bare /api/checkout → Stripe never called', lastCall === null);
r = await call('campaign=garage-door&intent=once');
check('no amount named → ask, do not complain', !(r.headers.get('location') || '').includes('error='));
r = await call('campaign=garage-door&intent=sideways&amount=10');
check('nonsense intent falls back to once, not a crash', B().mode === 'payment');

// ── 5. `ref` is a label, never a redirect target ──────────────────────────
await call('campaign=garage-door&intent=once&amount=10&ref=https://evil.example.com/phish');
check('hostile ref → sanitised, not used as a URL', B().cancel_url === 'https://minds-aligned.org/support/?campaign=garage-door', B().cancel_url);
check('hostile ref → still recorded, harmlessly', /^[a-z0-9._-]*$/.test(B()['metadata[ref]']), B()['metadata[ref]']);
await call('campaign=garage-door&intent=once&amount=10&ref=' + encodeURIComponent('//evil.example.com'));
check('protocol-relative ref → also neutered', B().cancel_url.startsWith('https://minds-aligned.org/'));
await call('campaign=garage-door&intent=once&amount=10');
check('no ref → metadata says "direct"', B()['metadata[ref]'] === 'direct');

// ── 6. Fail closed rather than bill the wrong entity ──────────────────────
const saved = process.env.STRIPE_SECRET_KEY;
delete process.env.STRIPE_SECRET_KEY;
r = await call('campaign=garage-door&intent=once&amount=10');
check('no secret key → not-configured', (r.headers.get('location') || '').includes('error=not-configured'));
check('no secret key → Stripe never called', lastCall === null);
process.env.STRIPE_SECRET_KEY = saved;

// ── 7. Shapes ─────────────────────────────────────────────────────────────
r = await call('x', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ campaign: 'garage-door', intent: 'monthly', tier: '10' }) });
const body = await r.json();
check('POST → JSON with the Checkout URL', r.status === 200 && body.url.startsWith('https://checkout.stripe.com/'), JSON.stringify(body));
r = await call('', { method: 'DELETE' });
check('DELETE → 405', r.status === 405);

globalThis.fetch = async () => ({ ok: false, status: 402, json: async () => ({ error: { message: 'Declined.' } }) });
r = await call('campaign=garage-door&intent=once&amount=10');
check('Stripe error → bounced with ?error=stripe-error', (r.headers.get('location') || '').includes('error=stripe-error'));

console.log('\n' + pass + '/' + total + ' passed');
process.exit(pass === total ? 0 : 1);
