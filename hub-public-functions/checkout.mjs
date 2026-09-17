/* checkout — /api/checkout on minds-aligned.org.
 *
 * Turns a link from anywhere in the estate into a Stripe Checkout Session and
 * sends the browser to it:
 *
 *     https://minds-aligned.org/support/?campaign=garage-door&ref=garage-door-song
 *       → the /support/ page, which offers the asks for that campaign
 *       → /api/checkout?campaign=garage-door&intent=once&amount=15&ref=garage-door-song
 *       → 303 to checkout.stripe.com
 *
 * Every other site in the estate therefore holds ONE link and no Stripe code, no
 * publishable key, and no price. When an amount changes, or the money moves from
 * the LLC to the 501(c)(3), nothing out there has to be re-issued.
 *
 * WHAT THE URL IS ALLOWED TO SAY
 *   campaign  a key in support-catalog.mjs CAMPAIGNS       (default: minds-aligned)
 *   intent    `once` | `monthly` | `yearly`                  (default: once)
 *   tier      a listed price for that intent, e.g. `10`      (subscriptions)
 *   amount    dollars, clamped to that intent's range        (any intent)
 *   ref       an attribution label — NEVER a redirect target
 *
 * `tier` and `amount` are alternatives: a tier names a Stripe Price, an amount
 * is the open "give what you like" path. A tier always wins if both arrive.
 *
 * Prices are resolved from the catalog and the Stripe account. See the header of
 * support-catalog.mjs for why that is the whole security model.
 *
 * ZERO DEPENDENCIES, ON PURPOSE. minds-aligned.org deploys `hub-public/` with
 * `command = ""` and no package.json in the base directory, so nothing is ever
 * `npm install`ed for this site. The Stripe SDK would be a build step; one
 * form-encoded POST is not. If you add an import here that is not a node:
 * builtin or a sibling file, the function will 502 in production and pass in
 * every local test you run — that is the trap this paragraph exists to prevent.
 *
 * Added 2026-09-17 (Mike Wolf's estate; Claude Opus 5, CCc).
 */

import {
  ACCOUNTS, CAMPAIGNS, REFERRERS, DEFAULT_CAMPAIGN, SITE, INTENTS, INTERVALS,
  slug, resolveAmount,
} from './support-catalog.mjs';

const STRIPE_API = 'https://api.stripe.com/v1/checkout/sessions';

/* Error codes the /support/ page knows how to phrase. Keep them in sync with the
 * ERRORS map in hub-public/support/index.html — the page shows a sentence, this
 * file decides which one, and a code with no sentence falls back to a generic
 * apology rather than a blank panel.
 */
const ERR = {
  campaign: 'unknown-campaign',
  tier: 'unknown-tier',
  amount: 'bad-amount',
  unconfigured: 'not-configured',
  stripe: 'stripe-error',
};

/* Flatten { line_items: [{ price_data: { currency: 'usd' } }] } into the
 * `line_items[0][price_data][currency]` spelling Stripe's form encoding wants.
 * Writing the nested object and flattening once beats hand-writing bracket
 * strings at nine call sites and mistyping one of them.
 */
function form(obj, prefix = '', out = new URLSearchParams()) {
  for (const [k, v] of Object.entries(obj)) {
    if (v === undefined || v === null || v === '') continue;
    const key = prefix ? `${prefix}[${k}]` : k;
    if (typeof v === 'object') form(v, key, out);
    else out.append(key, String(v));
  }
  return out;
}

/* A one-time Checkout Session URL is single-use and carries the session id. A
 * cached 303 would hand the SECOND visitor the FIRST visitor's session, so this
 * response must never be stored — not by a browser, not by a CDN, not by a
 * corporate proxy. `no-store` on every exit path, including the error ones.
 */
const NO_STORE = { 'cache-control': 'no-store, no-cache, must-revalidate', pragma: 'no-cache' };

const backToSupport = (params, code) => {
  const q = new URLSearchParams();
  for (const k of ['campaign', 'intent', 'tier', 'ref']) if (params[k]) q.set(k, params[k]);
  if (code) q.set('error', code);
  return new Response(null, {
    status: 303,
    headers: { ...NO_STORE, location: `${SITE}/support/?${q}` },
  });
};

const json = (status, body) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...NO_STORE, 'content-type': 'application/json' },
  });

export default async (request) => {
  const url = new URL(request.url);

  /* GET so a plain <a href> works with no JavaScript at all; POST so a page that
   * wants a JSON URL back (a modal, an app) can have one. Same resolution both
   * ways — only the shape of the answer differs.
   */
  let input;
  if (request.method === 'POST') {
    const ct = request.headers.get('content-type') || '';
    input = ct.includes('application/json')
      ? await request.json().catch(() => ({}))
      : Object.fromEntries(new URLSearchParams(await request.text()));
  } else if (request.method === 'GET') {
    input = Object.fromEntries(url.searchParams);
  } else {
    return json(405, { error: 'method-not-allowed' });
  }
  const wantsJson = request.method === 'POST';

  const askedIntent = slug(input.intent);
  const params = {
    campaign: slug(input.campaign) || DEFAULT_CAMPAIGN,
    intent: INTENTS.includes(askedIntent) ? askedIntent : 'once',
    tier: slug(input.tier),
    ref: slug(input.ref),
  };
  const fail = (code, detail) =>
    wantsJson ? json(400, { error: code, detail }) : backToSupport(params, code);

  const campaign = CAMPAIGNS[params.campaign];
  if (!campaign) return fail(ERR.campaign, `No campaign "${params.campaign}".`);

  const account = ACCOUNTS[campaign.account];
  const secret = process.env[account.env];
  if (!secret) {
    /* Fails CLOSED. An `org` campaign with no nonprofit key must not fall back
     * to the LLC key: that would bill the wrong entity and issue a receipt for a
     * deduction the payer is not entitled to. A dead button is recoverable; a
     * wrong-entity charge with a bad receipt is a letter to an accountant.
     */
    return fail(ERR.unconfigured, `${account.env} is not set on this site.`);
  }

  /* ── The line item: a catalogued Price, or a supporter-chosen amount ────── */
  const offer = campaign[params.intent];
  if (!offer) return fail(ERR.campaign, `"${params.campaign}" does not offer ${params.intent} support.`);

  const interval = INTERVALS[params.intent];          // undefined for `once`
  const mode = interval ? 'subscription' : 'payment';
  let lineItem, submitType;

  if (params.tier && offer.tiers?.[params.tier]) {
    /* A listed price. The tier key is a LABEL that selects a Stripe Price ID;
     * the dollar figure the page printed next to it is cosmetic and is never
     * what gets charged. That is the whole point of the indirection. */
    const price = process.env[offer.tiers[params.tier].env];
    if (!price) return fail(ERR.unconfigured, `${offer.tiers[params.tier].env} is not set on this site.`);
    lineItem = { price, quantity: 1 };
  } else if (params.tier) {
    return fail(ERR.tier, `No ${params.intent} tier "${params.tier}" in "${params.campaign}".`);
  } else {
    /* No amount NAMED is not the same as a bad amount. A site can link to
     * /api/checkout?campaign=garage-door with no figure at all and mean "ask
     * them" — that is a visitor to route, not an error to apologise for. Only
     * an amount that was supplied and could not be read is a complaint.
     */
    const asked = String(input.amount ?? '').trim();
    if (!asked) return wantsJson ? json(400, { error: 'amount-required' }) : backToSupport(params, null);

    const amount = resolveAmount(asked, offer.clamp);
    if (amount === null) return fail(ERR.amount, 'Amount must be a positive number of dollars.');

    /* The open path. A supporter naming their own number is the point here, and
     * it has no ceiling short of the clamp — a fixed top tier would cap the most
     * generous supporter at its price. It buys nothing extra either way: the
     * benefits are identical at every level, which is what keeps this a gift
     * rather than a purchase. */
    lineItem = {
      quantity: 1,
      price_data: {
        currency: 'usd',
        unit_amount: amount,
        product_data: { name: campaign.product },
        ...(interval ? { recurring: { interval } } : {}),
      },
    };
    if (!interval) submitType = 'donate';
  }

  /* The referring page is where an abandoned checkout goes back to — looked up
   * by exact key, never built from the query string. An unknown `ref` is still
   * worth recording, but it sends nobody anywhere.
   */
  const cancelUrl = REFERRERS[params.ref] || `${SITE}/support/?campaign=${params.campaign}`;

  const metadata = {
    campaign: params.campaign,
    intent: params.intent,
    tier: params.tier || '',
    ref: params.ref || 'direct',
    entity: campaign.account,
  };

  const body = form({
    mode,
    submit_type: submitType,
    'line_items[0]': lineItem,
    success_url: `${SITE}/support/thanks/?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: cancelUrl,
    client_reference_id: params.ref || undefined,
    metadata,
    /* Session metadata does NOT reach the Subscription object, and the
     * Subscription is what every later invoice hangs off. Without this line the
     * second month of a supporter's pledge arrives with no idea which page sent
     * them — attribution that works once and then quietly stops.
     */
    ...(mode === 'subscription' ? { subscription_data: { metadata } } : {}),
    /* One-time supporters become Customers too, so a donor who comes back is one
     * record rather than three, and so there is a name attached to the receipt.
     */
    ...(mode === 'payment' ? { customer_creation: 'always' } : {}),
  });

  let session;
  try {
    const res = await fetch(STRIPE_API, {
      method: 'POST',
      headers: {
        authorization: `Bearer ${secret}`,
        'content-type': 'application/x-www-form-urlencoded',
        'stripe-version': '2025-08-27.basil',
      },
      body,
    });
    session = await res.json();
    if (!res.ok) {
      console.error('[checkout] stripe rejected', res.status, session?.error?.message);
      return fail(ERR.stripe, session?.error?.message || `Stripe returned ${res.status}.`);
    }
  } catch (e) {
    console.error('[checkout] stripe unreachable', e);
    return fail(ERR.stripe, 'Could not reach Stripe.');
  }

  if (wantsJson) return json(200, { url: session.url, id: session.id });
  return new Response(null, { status: 303, headers: { ...NO_STORE, location: session.url } });
};

/* Functions 2.0 path routing — matched BEFORE _redirects, same as
 * /api/copy-canonize. Nothing needs to be added to hub-public/_redirects.
 */
export const config = { path: '/api/checkout' };
