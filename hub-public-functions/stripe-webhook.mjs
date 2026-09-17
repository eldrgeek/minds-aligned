/* stripe-webhook — /api/stripe-webhook on minds-aligned.org.
 *
 * WHAT IT IS FOR
 *   /api/checkout writes `campaign`, `intent`, `tier`, `ref` and `entity` onto
 *   every Session and every Subscription. That metadata is the whole reason the
 *   query-string design is worth building: it is the answer to "did the song
 *   page actually bring anyone in?". Stripe will show it in the dashboard, but
 *   only this endpoint can act on it the moment it happens — and only this
 *   endpoint sees the SECOND month of a subscription, which the dashboard shows
 *   as just another invoice unless something reads the metadata forward.
 *
 * WHAT IT DELIBERATELY DOES NOT DO
 *   There is no database on this site — it is static HTML with two functions —
 *   so this does not try to be a ledger. It verifies, summarises, logs, and
 *   forwards to SUPPORT_NOTIFY_URL if one is set. Stripe remains the book of
 *   record. When there is somewhere real to write, the forward becomes a write
 *   and nothing else here changes.
 *
 * WHY THE SIGNATURE CHECK IS NOT OPTIONAL
 *   This URL is public and its shape is documented by Stripe. Without
 *   verification, anyone who can POST JSON can fabricate a $10,000 donation,
 *   and every downstream thing that trusts this endpoint — a notification, a
 *   thank-you, a dashboard number, eventually a fulfilment — believes them.
 *   If STRIPE_WEBHOOK_SECRET is unset this endpoint refuses EVERY request
 *   rather than accepting unverified ones; an unconfigured webhook that fails
 *   loudly gets fixed, one that passes everything through does not.
 *
 * SETUP
 *   Stripe Dashboard → Developers → Webhooks → add endpoint
 *     https://minds-aligned.org/api/stripe-webhook
 *   Events: checkout.session.completed, invoice.paid,
 *           invoice.payment_failed, customer.subscription.deleted
 *   Copy the signing secret (whsec_…) into STRIPE_WEBHOOK_SECRET on the Netlify
 *   site. A second Stripe account (the 501(c)(3)) can point at this same URL:
 *   set STRIPE_WEBHOOK_SECRET_ORG and both secrets are tried.
 *
 * Added 2026-09-17 (Mike Wolf's estate; Claude Opus 5, CCc).
 */

import { createHmac, timingSafeEqual } from 'node:crypto';

/* Stripe's own tolerance. It exists so a captured-and-replayed delivery stops
 * working: the timestamp is inside the signed string, so an attacker cannot
 * move it without invalidating the signature, and after five minutes a replay
 * of the genuine bytes is refused too.
 */
const TOLERANCE_SECONDS = 300;

const json = (status, body) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json', 'cache-control': 'no-store' },
  });

/* Equal-length buffers only — timingSafeEqual throws otherwise, and a thrown
 * comparison is a failed comparison, which is the answer we want anyway.
 */
function sameSignature(a, b) {
  const x = Buffer.from(a, 'utf8');
  const y = Buffer.from(b, 'utf8');
  return x.length === y.length && timingSafeEqual(x, y);
}

/* Returns the parsed event, or null. The raw body TEXT is signed, not the
 * parsed object: re-serialising JSON reorders keys and changes whitespace, and
 * the signature is over the exact bytes Stripe sent. Parse only after verifying.
 */
export function verify(rawBody, header, secrets) {
  const parts = Object.fromEntries(
    String(header || '').split(',').map((p) => {
      const i = p.indexOf('=');
      return i < 0 ? ['', ''] : [p.slice(0, i).trim(), p.slice(i + 1).trim()];
    })
  );
  const timestamp = Number.parseInt(parts.t, 10);
  if (!Number.isFinite(timestamp)) return null;
  if (Math.abs(Math.floor(Date.now() / 1000) - timestamp) > TOLERANCE_SECONDS) return null;

  /* A header can carry several v1 signatures during a secret rotation, and this
   * site may serve two Stripe accounts. Accept if ANY pair matches.
   */
  const signatures = String(header).split(',')
    .filter((p) => p.trim().startsWith('v1='))
    .map((p) => p.trim().slice(3));
  if (!signatures.length) return null;

  const signed = `${timestamp}.${rawBody}`;
  const ok = secrets.filter(Boolean).some((secret) => {
    const expected = createHmac('sha256', secret).update(signed, 'utf8').digest('hex');
    return signatures.some((sig) => sameSignature(sig, expected));
  });
  if (!ok) return null;

  try { return JSON.parse(rawBody); } catch { return null; }
}

/* One flat line per event, whatever the event is — so a log search for a
 * campaign finds the first payment and the eleventh renewal in the same shape.
 */
function summarise(event) {
  const o = event.data?.object ?? {};
  const meta = o.metadata ?? o.subscription_details?.metadata ?? {};
  const cents = o.amount_total ?? o.amount_paid ?? o.amount_due ?? null;
  return {
    type: event.type,
    at: new Date((event.created ?? Date.now() / 1000) * 1000).toISOString(),
    amount: cents === null ? null : (cents / 100).toFixed(2),
    currency: (o.currency || 'usd').toUpperCase(),
    email: o.customer_details?.email ?? o.customer_email ?? null,
    campaign: meta.campaign ?? null,
    intent: meta.intent ?? null,
    tier: meta.tier ?? null,
    ref: meta.ref ?? null,
    entity: meta.entity ?? null,
    livemode: event.livemode === true,
    id: event.id,
  };
}

export default async (request) => {
  if (request.method !== 'POST') return json(405, { error: 'method-not-allowed' });

  const secrets = [process.env.STRIPE_WEBHOOK_SECRET, process.env.STRIPE_WEBHOOK_SECRET_ORG];
  if (!secrets.some(Boolean)) {
    console.error('[stripe-webhook] STRIPE_WEBHOOK_SECRET is not set — refusing.');
    return json(500, { error: 'not-configured' });
  }

  const raw = await request.text();
  const event = verify(raw, request.headers.get('stripe-signature'), secrets);
  if (!event) {
    console.warn('[stripe-webhook] rejected: bad or missing signature');
    return json(400, { error: 'bad-signature' });
  }

  const summary = summarise(event);
  console.log('[stripe-webhook]', JSON.stringify(summary));

  /* Best-effort and never fatal. Stripe retries a non-2xx for days; a
   * notification hook that is down must not turn a payment that already
   * succeeded into a queue of angry retries.
   */
  const notify = process.env.SUPPORT_NOTIFY_URL;
  if (notify) {
    try {
      await fetch(notify, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ source: 'minds-aligned/support', ...summary }),
      });
    } catch (e) {
      console.error('[stripe-webhook] notify failed (ignored):', e.message);
    }
  }

  return json(200, { received: true });
};

export const config = { path: '/api/stripe-webhook' };
