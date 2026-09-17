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
 *   supporter is charged came out of the URL, then `&amount=0.01` buys a $10/mo
 *   subscription. So the URL carries KEYS ONLY — which campaign, which intent,
 *   which tier — and this file maps a key to a Stripe Price ID that lives in the
 *   Stripe account. Nothing a visitor can edit reaches `unit_amount`.
 *
 *   The deliberate exception is an OPEN AMOUNT, where the supporter choosing the
 *   number is the entire point — a tip, or a supporter who wants to give more
 *   than the listed prices. That path still never trusts the URL blindly: the
 *   `clamp` on each intent bounds it, so a typo or a prank lands inside a range
 *   Mike picked. An open amount buys nothing extra (see BENEFITS below), so
 *   there is no good to under-pay for — the only risks are a $0.01 card-testing
 *   probe and a fat finger, and the clamp closes both.
 *
 *   `hub-public/support/catalog.json` is the OTHER half: the words and the
 *   suggested numbers the page draws. It is display copy, deliberately
 *   powerless. The two files share nothing but KEY NAMES. If they drift, the
 *   page offers a tier this file cannot price and /api/checkout answers with a
 *   named error instead of a wrong charge — and `ops/check-support-catalog.mjs`
 *   catches the drift before a deploy does. Run it after editing either file.
 *
 * WHY EVERY LEVEL GETS THE SAME THING (2026-09-17)
 *
 *   There are no perk bundles here, and that is the load-bearing decision, not
 *   an omission. A higher amount buys MORE SUPPORT OF THE WORK, not more stuff.
 *   Every supporter gets the same three things: a name on the supporters page if
 *   they want one, their mail read and answered by a person, and the occasional
 *   note from the workbench with NO promised cadence.
 *
 *   Two independent constraints land on the same answer, which is how you know
 *   it is the right one:
 *
 *   1. Burden. Every retrospective from a small membership that folded names the
 *      same cause: a promise whose cost scales with members, or a promise on a
 *      calendar. Nothing in this estate has ever shipped monthly — work arrives
 *      in multi-day bursts around events. A tier ladder with four distinct perk
 *      bundles is four production lines that outlive the enthusiasm that made
 *      them.
 *   2. Deductibility. If a campaign later moves to `org` (below), a gift stays
 *      fully deductible only if the benefits are worth at most the LESSER of 2%
 *      of the payment or $139 — at $120/year that ceiling is $2.40. Recognition
 *      and replies have no ascertainable market value, so they cost nothing
 *      against it. Early access, a private community, a scheduled call and
 *      anything physical all do have value, and all of them would have to be
 *      netted out of the deduction.
 *
 *   So: no early access (it also contradicts publishing in the open — it would
 *   be selling a delay imposed on everyone else), no Discord, no scheduled
 *   calls, no downloads, no merch. Add one and BOTH tests fail at once.
 *
 * ADDING A CAMPAIGN
 *   1. Create the Product and its Prices in Stripe (recurring monthly/yearly for
 *      the subscription intents, nothing for `once` — that is priced ad hoc).
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
 * `org`  → the 501(c)(3), or the fiscal sponsor standing in for one, once it
 *          exists and has its own Stripe account. Contributions there are
 *          deductible and need a receipt.
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

/* The recurring prices for the initiative itself, shared by reference so the
 * song's "back the shop" and the front door's ask are the SAME subscription —
 * one supporter, one Stripe Price, one place to change the amount.
 *
 * Keys ARE the dollar amount, because the tier IS the amount. There is no
 * Friend/Patron ladder: at a dozen supporters who mostly know each other, a
 * status ladder makes somebody publicly the cheap one, and it buys nothing —
 * the benefits are identical at every level anyway.
 *
 * Two displayed prices per interval, not four. Donors reliably pick the
 * second-lowest of whatever is shown, so the $5 mostly exists to make $10 the
 * second-lowest; a third and fourth rung would add decision friction and no
 * revenue. Anyone who wants to give more uses the open amount, which has no
 * ceiling — a fixed top tier would cap the most generous supporter at its price.
 */
const MONTHLY_TIERS = {
  5:  { env: 'MA_PRICE_INITIATIVE_MONTH_5' },
  10: { env: 'MA_PRICE_INITIATIVE_MONTH_10' },
};

/* Annual at ten months' price. 12-month retention on annual plans runs far
 * ahead of monthly, and at this scale the cash matters more than the discount
 * costs: ten annual supporters is a year in the bank in week one, against 120
 * separate chances to cancel — arriving exactly when there is least momentum to
 * survive them.
 */
const YEARLY_TIERS = {
  50:  { env: 'MA_PRICE_INITIATIVE_YEAR_50' },
  100: { env: 'MA_PRICE_INITIATIVE_YEAR_100' },
};

/* What every supporter gets, at every level, on every campaign.
 *
 * Deliberately three things that cost nothing per supporter and promise nothing
 * on a calendar. `/support/` renders this list once, above the prices, instead
 * of a per-tier blurb — because it IS the same at every price, and showing it
 * per tier would imply otherwise.
 *
 * NOTE the wording of the third one. An earlier draft said "you are on the list
 * and you hear things first". There is no list — no Mailchimp, no Buttondown,
 * nothing anywhere in the estate — so that sentence was a promise with no
 * mechanism behind it. Stripe puts every supporter's email on the Customer
 * record, which is a real mechanism for mailing a dozen people when something
 * actually lands, and it is the one this now describes.
 */
export const BENEFITS = [
  'Your name on the supporters page, if you want it there.',
  'Your mail gets read and answered by a person.',
  'The occasional note from the workbench when something lands — no schedule, no newsletter.',
];

/* Amounts are in CENTS, because that is what Stripe takes and every conversion
 * between dollars and cents is a rounding bug waiting to be written twice.
 *
 * `clamp` bounds the OPEN amount for each intent. A campaign that omits an
 * intent does not offer it at all.
 */
export const CAMPAIGNS = {
  /* The default. A bare /support/ with no query string lands here. */
  'minds-aligned': {
    account: 'llc',
    product: 'Support for Minds Aligned',
    once:    { clamp: { min: 200, max: 500000 } },
    monthly: { tiers: MONTHLY_TIERS, clamp: { min: 300, max: 100000 } },
    yearly:  { tiers: YEARLY_TIERS,  clamp: { min: 2500, max: 1000000 } },
  },

  /* First adopter: the Garage Door song page.
   *
   * One-time leads, and that is not a default to revisit — it is the honest ask.
   * The song is ONE finished thing, made in a day and complete, and everything
   * about it is already free: the mp3, the lyrics, the timed SRT, the narration
   * script and all ten exact prompts. A recurring charge implicitly answers
   * "what do I get next month", and this property has no answer. That is a tip
   * jar, and tip jars are one-time.
   *
   * The subscription stays available one click deeper, sharing the initiative's
   * prices by reference — so it is not a subscription to a finished song, which
   * would be incoherent. It is backing the shop that made it, and the copy in
   * catalog.json says exactly that.
   */
  'garage-door': {
    account: 'llc',
    product: 'Support for Garage Door',
    once:    { clamp: { min: 200, max: 100000 } },
    monthly: { tiers: MONTHLY_TIERS, clamp: { min: 300, max: 100000 } },
    yearly:  { tiers: YEARLY_TIERS,  clamp: { min: 2500, max: 1000000 } },
  },
};

/* Stripe's `recurring[interval]` for each subscription intent. `once` is absent
 * because it is not a subscription — that absence is what tells checkout.mjs
 * which Stripe `mode` to ask for.
 */
export const INTERVALS = { monthly: 'month', yearly: 'year' };

export const INTENTS = ['once', 'monthly', 'yearly'];

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
 *
 * NOT listed, on purpose: /a-different-mind/. It is "a page for people who don't
 * use AI and don't want to", whose host is told not to try to win. Pointing a
 * money ask at that audience would break the one promise the page makes.
 */
export const REFERRERS = {
  'garage-door-song': 'https://garage-door-song.netlify.app/',
  'minds-aligned': 'https://minds-aligned.org/',
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
