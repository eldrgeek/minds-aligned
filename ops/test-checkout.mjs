#!/usr/bin/env node
/* test-checkout — exercises /api/checkout with Stripe stubbed out.
 *
 * Every assertion here is a property somebody could otherwise break by editing
 * checkout.mjs in a hurry. The ones that matter most are not the happy paths:
 *
 *   - a price NEVER comes out of the query string (only a Price ID from env,
 *     or a donation amount clamped into the campaign's range);
 *   - `ref` never becomes a redirect target, however it is spelled;
 *   - a missing account key fails CLOSED instead of billing the LLC for what
 *     was meant to be a deductible gift to the nonprofit;
 *   - nothing reaches Stripe on bad input;
 *   - the 303 to a single-use Checkout Session is never cacheable.
 *
 * Run: node ops/test-checkout.mjs      (exit 0 = all green)
 * No network, no Stripe account, no secrets — `fetch` is replaced below.
 */

process.env.STRIPE_SECRET_KEY = 'sk_test_fake';
process.env.MA_PRICE_INITIATIVE_SUPPORTER = 'price_supporter_123';
process.env.MA_PRICE_INITIATIVE_FRIEND = 'price_friend_123';

let lastCall = null;
globalThis.fetch = async (url, opts) => {
  lastCall = { url, body: Object.fromEntries(new URLSearchParams(opts.body)), headers: opts.headers };
  return { ok: true, status: 200, json: async () => ({ url: 'https://checkout.stripe.com/c/pay/cs_test_abc', id: 'cs_test_abc' }) };
};

const { default: checkout } = await import(new URL('../hub-public-functions/checkout.mjs', import.meta.url).href);
const call = (qs, init) => { lastCall = null; return checkout(new Request('https://minds-aligned.org/api/checkout?' + qs, init)); };

let pass = 0, total = 0;
const check = (name, cond, extra = '') => {
  total++; if (cond) { pass++; console.log('PASS  ' + name); }
  else console.log('FAIL  ' + name + (extra ? '  → ' + extra : ''));
};

// 1. Monthly subscription resolves the Price ID from env, never from the URL.
let r = await call('campaign=minds-aligned&intent=monthly&tier=supporter&ref=garage-door-song');
check('monthly → 303 to Stripe', r.status === 303 && r.headers.get('location').startsWith('https://checkout.stripe.com/'));
check('monthly → mode=subscription', lastCall.body.mode === 'subscription', lastCall.body.mode);
check('monthly → price from env', lastCall.body['line_items[0][price]'] === 'price_supporter_123', lastCall.body['line_items[0][price]']);
check('monthly → no client-settable unit_amount', !('line_items[0][price_data][unit_amount]' in lastCall.body));
check('monthly → metadata on the SUBSCRIPTION too', lastCall.body['subscription_data[metadata][ref]'] === 'garage-door-song', JSON.stringify(lastCall.body['subscription_data[metadata][ref]']));
check('monthly → campaign in metadata', lastCall.body['metadata[campaign]'] === 'minds-aligned');
check('redirect is never cached', /no-store/.test(r.headers.get('cache-control')), r.headers.get('cache-control'));

// 2. An amount in the URL is honoured, but only inside the clamp.
r = await call('campaign=garage-door&intent=once&amount=15&ref=garage-door-song');
check('one-time → mode=payment', lastCall.body.mode === 'payment');
check('one-time → $15 becomes 1500 cents', lastCall.body['line_items[0][price_data][unit_amount]'] === '1500', lastCall.body['line_items[0][price_data][unit_amount]']);
check('one-time → submit_type=donate', lastCall.body.submit_type === 'donate');
check('one-time → customer_creation=always', lastCall.body.customer_creation === 'always');
check('one-time → cancel_url is the referring site', lastCall.body.cancel_url === 'https://garage-door-song.netlify.app/', lastCall.body.cancel_url);

await call('campaign=garage-door&intent=once&amount=0.01');
check('$0.01 clamps UP to the $2 floor', lastCall.body['line_items[0][price_data][unit_amount]'] === '200', lastCall.body['line_items[0][price_data][unit_amount]']);
await call('campaign=garage-door&intent=once&amount=999999');
check('$999,999 clamps DOWN to the $1000 ceiling', lastCall.body['line_items[0][price_data][unit_amount]'] === '100000', lastCall.body['line_items[0][price_data][unit_amount]']);
await call('campaign=garage-door&intent=once&amount=12.505');
check('fractional cents round, not truncate', lastCall.body['line_items[0][price_data][unit_amount]'] === '1251', lastCall.body['line_items[0][price_data][unit_amount]']);

// 3. Bad input bounces back to /support/ and never reaches Stripe.
for (const [name, qs, code] of [
  ['non-numeric amount', 'campaign=garage-door&intent=once&amount=abc', 'bad-amount'],
  ['negative amount',    'campaign=garage-door&intent=once&amount=-50', 'bad-amount'],
  ['unknown campaign',   'campaign=not-a-thing&intent=once&amount=10',  'unknown-campaign'],
  ['unknown tier',       'campaign=garage-door&intent=monthly&tier=platinum', 'unknown-tier'],
  ['tier with no price set', 'campaign=garage-door&intent=monthly&tier=patron', 'not-configured'],
]) {
  r = await call(qs);
  const loc = r.headers.get('location') || '';
  check(name + ' → bounced with ?error=' + code, r.status === 303 && loc.includes('error=' + code), loc);
  check(name + ' → Stripe never called', lastCall === null);
}

// 4. `ref` is an attribution label. It must never become a redirect target.
r = await call('campaign=garage-door&intent=once&amount=10&ref=https://evil.example.com/phish');
check('hostile ref → sanitised, not used as a URL', lastCall.body.cancel_url === 'https://minds-aligned.org/support/?campaign=garage-door', lastCall.body.cancel_url);
check('hostile ref → still recorded, harmlessly', /^[a-z0-9._-]*$/.test(lastCall.body['metadata[ref]']), lastCall.body['metadata[ref]']);
r = await call('campaign=garage-door&intent=once&amount=10&ref=' + encodeURIComponent('//evil.example.com'));
check('protocol-relative ref → also neutered', lastCall.body.cancel_url.startsWith('https://minds-aligned.org/'), lastCall.body.cancel_url);

// 5. Fail closed when the account key is missing — do NOT bill the wrong entity.
const saved = process.env.STRIPE_SECRET_KEY;
delete process.env.STRIPE_SECRET_KEY;
r = await call('campaign=garage-door&intent=once&amount=10');
check('no secret key → not-configured', (r.headers.get('location') || '').includes('error=not-configured'));
check('no secret key → Stripe never called', lastCall === null);
process.env.STRIPE_SECRET_KEY = saved;

// 6. Defaults, and the POST/JSON shape.
r = await call('');
let loc0 = r.headers.get('location') || '';
check('bare /api/checkout → sent to /support/ to pick, not an error', r.status === 303 && loc0.includes('/support/') && !loc0.includes('error='), loc0);
check('bare /api/checkout → Stripe never called', lastCall === null);

r = await call('campaign=garage-door&intent=once');
loc0 = r.headers.get('location') || '';
check('no amount named → ask, do not complain', !loc0.includes('error='), loc0);

await call('campaign=minds-aligned&intent=once&amount=25');
check('default campaign resolves', lastCall.body['metadata[campaign]'] === 'minds-aligned' && lastCall.body.mode === 'payment');
check('no ref → metadata says "direct"', lastCall.body['metadata[ref]'] === 'direct');

r = await call('campaign=garage-door&intent=once&amount=20', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ campaign: 'garage-door', intent: 'once', amount: 20 }) });
const body = await r.json();
check('POST → JSON with the Checkout URL', r.status === 200 && body.url.startsWith('https://checkout.stripe.com/'), JSON.stringify(body));

r = await call('', { method: 'DELETE' });
check('DELETE → 405', r.status === 405);

// 7. Stripe itself refusing must not look like success.
globalThis.fetch = async () => ({ ok: false, status: 402, json: async () => ({ error: { message: 'Your card was declined.' } }) });
r = await call('campaign=garage-door&intent=once&amount=10');
check('Stripe error → bounced with ?error=stripe-error', (r.headers.get('location') || '').includes('error=stripe-error'));

console.log('\n' + pass + '/' + total + ' passed');
process.exit(pass === total ? 0 : 1);
