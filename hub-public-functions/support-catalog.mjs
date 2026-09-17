/* support-catalog — the SERVER-SIDE half of minds-aligned.org/support/.
 *
 * WHY THIS FILE EXISTS, AND WHY IT IS NOT THE ONE THE PAGE READS
 *
 *   /support/ takes a query string from some other site — "?campaign=garage-door
 *   &intent=once&ref=garage-door-song" — and turns it into a Stripe Checkout
 *   Session. The single rule that makes that safe:
 *
 *       THE CLIENT NEVER SUPPLIES A PRICE.
 *
 *   A query string is typed by whoever is holding the keyboard. If the amount a
 *   supporter is charged came out of the URL, then `&amount=0.01` buys a $50
 *   subscription. So the URL carries KEYS ONLY — which campaign, which intent,
 *   which tier — and this file maps a key to a Stripe Price ID that lives in the
 *   Stripe account. Nothing a visitor can edit reaches `unit_amount`.
 *
 *   The one deliberate exception is an open-ended DONATION, where the donor
 *   choosing the number is the entire point. That path still never trusts the
 *   URL blindly: `donation.min`/`donation.max` below clamp it, so a typo or a
 *   prank lands inside a range Mike picked. A donation buys nothing, so there is
 *   no good to under-pay for — the only risks are a $0.01 card-testing probe and
 *   a $1,000,000 fat finger, and the clamp closes both.
 *
 *   `hub-public/support/catalog.json` is the OTHER half: the words and the
 *   suggested numbers the page draws. It is display copy, deliberately powerless.
 *   The two files share nothing but KEY NAMES. If they drift, the page offers a
 *   tier this file cannot price and /api/checkout answers with a named error
 *   instead of a wrong charge — and `ops/check-support-catalog.mjs` catches the
 *   drift before a deploy does. Run it after editing either file.
 *
 * ADDING A CAMPAIGN
 *   1. Create the Product and its Prices in Stripe (recurring for `monthly`,
 *      one-time for `once`).
 *   2. Add the campaign here with the Price IDs' ENV VAR NAMES.
 *   3. Set those vars on the Netlify site (minds-aligned-soma).
 *   4. Add the matching display block to hub-public/support/catalog.json.
 *   5. Run `node ops/check-support-catalog.mjs`.
 *
 * WHY ENV VARS AND NOT THE IDS THEMSELVES
 *   Price IDs are not secret — Stripe puts them in the Checkout URL. They are in
 *   env because they are ACCOUNT STATE, not source: the LLC account and the
 *   (future) 501(c)(3) account will hold different IDs for the same tier, and a
 *   test-mode key needs test-mode prices. Keeping them out of git means pointing
 *   this site at a different account is a settings change, not a commit.
 *
 * Added 2026-09-17 (Mike Wolf's estate; Claude Opus 5, CCc).
 */

/* Which Stripe account a campaign settles into.
 *
 * `llc`  → Minds Aligned LLC. Taxable business income. NOT tax-deductible to the
 *          payer, whatever the button says — see SUPPORT.md.
 * `org`  → the 501(c)(3) (or its fiscal sponsor), once it exists and has its own
 *          Stripe account. Contributions there are deductible and need a receipt.
 *
 * The split is here from day one on purpose. When the nonprofit side opens, a
 * campaign moves across by changing ONE WORD — no new page, no new function, no
 * link to re-issue on any of the referring sites. Until `STRIPE_SECRET_KEY_ORG`
 * is set, an `org` campaign fails closed with a clear message rather than
 * quietly billing the LLC and creating a receipt nobody can honour.
 */
export const ACCOUNTS = {
  llc: { env: 'STRIPE_SECRET_KEY', label: 'Minds Aligned LLC', deductible: false },
  org: { env: 'STRIPE_SECRET_KEY_ORG', label: 'Minds Aligned (501(c)(3))', deductible: true },
};

/* The recurring tiers for the initiative itself. Shared by reference, so the
 * song's "support this monthly" and the front door's are the SAME subscription —
 * one supporter, one Stripe Price, one place to change the amount.
 */
const INITIATIVE_TIERS = {
  friend:     { env: 'MA_PRICE_INITIATIVE_FRIEND' },
  supporter:  { env: 'MA_PRICE_INITIATIVE_SUPPORTER' },
  patron:     { env: 'MA_PRICE_INITIATIVE_PATRON' },
  benefactor: { env: 'MA_PRICE_INITIATIVE_BENEFACTOR' },
};

/* Amounts are in CENTS, because that is what Stripe takes and every conversion
 * between dollars and cents is a rounding bug waiting to be written twice.
 */
export const CAMPAIGNS = {
  /* The default. A bare /support/ with no query string lands here. */
  'minds-aligned': {
    account: 'llc',
    product: 'Support for Minds Aligned',
    monthly: INITIATIVE_TIERS,
    donation: { min: 200, max: 500000 },
  },

  /* First adopter: the Garage Door song page. One-time support is the headline
   * ask (someone who just listened to a rap is not signing up for a monthly),
   * with the same initiative subscription available underneath.
   */
  'garage-door': {
    account: 'llc',
    product: 'Support for Garage Door',
    monthly: INITIATIVE_TIERS,
    donation: { min: 200, max: 100000 },
  },
};

/* Referring sites, by `ref`.
 *
 * READ THIS BEFORE ADDING A REDIRECT ANYWHERE NEAR `ref`. The value is an
 * ATTRIBUTION LABEL and NOTHING ELSE. It is recorded in Stripe metadata so Mike
 * can see which page produced which supporter. It is NEVER concatenated into a
 * URL from the query string, because "take a URL from the caller and send the
 * browser there" is an open redirect, and an open redirect on the domain that
 * also runs the checkout is exactly the thing a phishing page wants to borrow.
 *
 * A visitor who abandons checkout goes back to the URL THIS TABLE gives for
 * their `ref` — a value Mike wrote, matched by an exact key. An unrecognised
 * `ref` is still recorded (sanitised, truncated) but returns nobody anywhere
 * except /support/.
 */
export const REFERRERS = {
  'garage-door-song': 'https://garage-door-song.netlify.app/',
  'minds-aligned': 'https://minds-aligned.org/',
  'a-different-mind': 'https://minds-aligned.org/a-different-mind/',
  'mike-wolf': 'https://mike-wolf.com/',
};

export const DEFAULT_CAMPAIGN = 'minds-aligned';
export const SITE = 'https://minds-aligned.org';

/* `ref` and `tier` come off the wire. Everything downstream — a Stripe metadata
 * value, a log line, an error message echoed to the page — assumes they are
 * boring. Make them boring here, once, rather than trusting each caller.
 */
export const slug = (v) => String(v ?? '').toLowerCase().replace(/[^a-z0-9._-]/g, '').slice(0, 64);

/* Dollars in the URL (`&amount=25`, `&amount=12.50`) because a URL a human might
 * read or hand-edit should say what a human means. Cents out, clamped.
 * Returns null for anything that is not a positive finite number, so the caller
 * can tell "they asked for nonsense" from "they asked for too much".
 */
export function resolveAmount(raw, { min, max }) {
  const n = Number.parseFloat(String(raw ?? '').replace(/[$,\s]/g, ''));
  if (!Number.isFinite(n) || n <= 0) return null;
  return Math.min(Math.max(Math.round(n * 100), min), max);
}
