# Taking money: how /support/ works, and what the money is

Mike Wolf's estate · written 2026-09-17 with Claude Opus 5 (CCc).

Two halves. The first is the machinery that is now in this repo. The second is
the set of questions Mike asked while asking for it — whether a subscription and
a donation are different things, whether there are tax consequences, and how a
501(c)(3) would sit next to the LLC. The second half is the one that decides
what the first half should be pointed at, so it is not an appendix.

---

## 1. What is built

One page takes money for the whole estate. Every other property links to it and
says in the query string what it is asking on behalf of:

```
https://minds-aligned.org/support/?campaign=garage-door&ref=garage-door-song
```

| Piece | Where | Does |
|---|---|---|
| The ask | `hub-public/support/index.html` | Draws the campaign's copy, tiers and amounts |
| Display copy | `hub-public/support/catalog.json` | Words and suggested numbers. Cannot charge anyone |
| The prices | `hub-public-functions/support-catalog.mjs` | Maps campaign+tier → Stripe Price ID → the real amount |
| Checkout | `hub-public-functions/checkout.mjs` → `/api/checkout` | Creates the Stripe Checkout Session, 303s to it |
| Receipts back | `hub-public-functions/stripe-webhook.mjs` → `/api/stripe-webhook` | Verifies the signature, records who came from where |
| Thank you | `hub-public/support/thanks/` | Stripe's `success_url` |
| Drift check | `ops/check-support-catalog.mjs` | Fails if the page offers something the server cannot price |
| Tests | `ops/test-checkout.mjs` | 38 assertions, no network, no Stripe account needed |

**The one rule that makes it safe: the client never supplies a price.** The URL
carries keys — which campaign, which intent, which tier — and the server turns a
key into a Stripe Price ID. If the amount came out of the URL then `&amount=0.01`
buys a $50 subscription. The single exception is an open-ended donation, where
the donor choosing the number is the whole point; that path clamps to a
per-campaign floor and ceiling, so a card-testing probe and a fat finger both
land somewhere sane.

Two consequences worth stating plainly, because they are the reason to build it
this way rather than pasting a Stripe Payment Link into each site:

- **The other sites hold nothing.** No key, no price, no checkout code. When an
  amount changes, or a campaign moves from the LLC to the nonprofit, no link
  anywhere else has to be re-issued.
- **`ref` makes attribution real.** It is written onto the Session *and* the
  Subscription, so the eleventh month of a supporter's pledge still knows the
  song page brought them in. Session metadata alone does not survive to later
  invoices — that one line in `checkout.mjs` is the difference between
  attribution that works once and attribution that keeps working.

`ref` is an attribution label and never a redirect target. A page that sends the
browser wherever its own query string says is an open redirect, and an open
redirect on the domain that also runs the checkout is exactly what a phishing
page wants to borrow. Destinations come from an allowlist Mike wrote.

### Switch it on

1. **Stripe Dashboard → Product catalogue.** Create one Product, "Support for
   Minds Aligned", with four recurring monthly Prices: $5, $15, $50, $150.
2. **Netlify → `minds-aligned-soma` → environment variables:**
   ```
   STRIPE_SECRET_KEY               sk_live_…
   MA_PRICE_INITIATIVE_FRIEND      price_…      ($5/mo)
   MA_PRICE_INITIATIVE_SUPPORTER   price_…      ($15/mo)
   MA_PRICE_INITIATIVE_PATRON      price_…      ($50/mo)
   MA_PRICE_INITIATIVE_BENEFACTOR  price_…      ($150/mo)
   STRIPE_WEBHOOK_SECRET           whsec_…
   ```
3. **Stripe → Developers → Webhooks** → `https://minds-aligned.org/api/stripe-webhook`,
   events `checkout.session.completed`, `invoice.paid`, `invoice.payment_failed`,
   `customer.subscription.deleted`. Copy the signing secret into the var above.
4. `node ops/check-support-catalog.mjs` prints which of those are still unset.
5. Test in Stripe **test mode** first with card `4242 4242 4242 4242`. Test-mode
   keys and test-mode Price IDs go in the same variables.

Until `STRIPE_SECRET_KEY` is set, `/support/` renders and the Continue button
bounces back with "this one is not switched on yet". Nothing half-charges.

---

## 2. Is a subscription different from a donation?

**Federally, for the LLC: no.** Both are gross receipts of Minds Aligned LLC and
both are ordinary business income — Schedule C if it is a single-member
disregarded entity, Form 1065/K-1 if there is more than one member. Calling a
payment a donation does not make it one. There is a gift exclusion under §102,
but *Commissioner v. Duberstein* requires "detached and disinterested
generosity", and money sent to a business by people who follow that business'
work is not that. Assume every dollar through the LLC is taxable revenue.

**And nobody paying the LLC gets a deduction.** There is no such thing as a
tax-deductible contribution to a for-profit company, whatever the button says.
This is why the word "donate" is doing real work on a nonprofit page and is
mostly decorative on a for-profit one — and why `/support/` says so on its face
rather than letting a supporter assume the friendlier answer.

### Where they genuinely differ

1. **Sales tax — the real one.** A donation buys nothing, so there is no taxable
   sale. A *subscription* that delivers something — access, downloads, a members'
   feed — can be a taxable sale of a digital product in the states that tax
   those, once economic nexus thresholds are crossed. Two defences, and take
   both: keep the recurring tiers as **support with no gated deliverable**
   (which is what the tiers in `catalog.json` currently are — thanks and early
   word, not access), and turn on **Stripe Tax** so registration thresholds are
   monitored rather than discovered.
2. **The moment the tier promises a thing, it is a product.** A tier that
   delivers a download, a private feed or a physical item is revenue for a good,
   with sales tax, fulfilment and refund expectations attached. That is a fine
   business to be in — just decide it deliberately rather than drifting into it
   one perk at a time.
3. **Chargeback texture.** Recurring charges get disputed at higher rates than
   one-time ones, mostly from people who forgot they signed up. Stripe's dunning
   and a clear descriptor cost nothing and help.
4. **1099-K.** Stripe issues one at **$20,000 and 200 transactions** — both,
   through one platform, in a calendar year. The One Big Beautiful Bill Act
   (July 2025) repealed the phased-down $600 threshold and restored the old one
   for 2025 onward. The income is reportable either way; the form is not the
   trigger.

**So: for the LLC, subscription vs donation is a labelling choice, not a tax
choice — right up until a tier promises something, at which point it is a
product and the answer changes.**

---

## 3. What changes under a 501(c)(3)

Everything, and it is the reason to do it:

- **The donor deducts.** That is the whole product. It is worth roughly the
  donor's marginal rate to them, and it is the only reason a foundation or a
  donor-advised fund can send money at all.
- **The org does not pay federal income tax** on contributions or on revenue
  substantially related to the exempt purpose.
- **Stripe charges less**: eligible 501(c)(3)s get **2.2% + $0.30** instead of
  2.9% + $0.30, by emailing `nonprofit@stripe.com` with the determination letter.
  It applies to donations, not to ticket or merchandise sales, and it is not
  retroactive.

And the obligations arrive with it:

- **Quid pro quo.** If a donor gets something back, only the amount above the
  fair market value of what they got is deductible, and for payments over **$75**
  a **written disclosure** stating that is required. This is precisely where
  Patreon-shaped tiers get messy — perks turn a clean gift into arithmetic.
- **Safe harbours for 2026.** Benefits are ignored entirely if they are worth the
  lesser of 2% of the payment or **$139**; or if the payment is **$69.50** or
  more and the only benefit is token items costing the org **$13.90** or less.
  Inside those lines the whole gift stays deductible. Design the tiers to sit
  inside them and the disclosure problem disappears.
- **UBIT.** A trade or business regularly carried on and not substantially
  related to the exempt purpose is taxed at 21% on Form 990-T. A song that
  advances a public-education mission is plausibly related; branded t-shirts are
  the textbook example of unrelated.
- **Form 990 every year**, forever. 990-N if receipts are under $50k, but never
  nothing — three missed years is automatic revocation.
- **Assets are permanently dedicated to charitable purposes.** Money that goes in
  cannot come back out to Mike. On dissolution it goes to another 501(c)(3).
- **A board.** Most states want at least three directors, and the IRS looks hard
  at boards that are one person or one family. **This is the part that surprises
  people: Mike will not control the 501(c)(3) the way he controls the LLC.** That
  is not a formality to paper over; it is the deal.
- **State charitable-solicitation registration.** Roughly 40 states require
  registration *before* soliciting donations from their residents, and a public
  "donate" button solicits everywhere at once. This is the most commonly skipped
  obligation in the whole list, and a fiscal sponsor absorbs it entirely.

---

## 4. The trap in running both

An LLC and a 501(c)(3) with the same name, the same founder and the same website
is a **private benefit** problem waiting to be found. The nonprofit's resources
must not subsidise the for-profit. If the nonprofit pays for a tool the LLC uses,
or the LLC trades on goodwill the nonprofit's donors built, exemption is at risk.

It is entirely doable — it is a standard structure — but it has to be built:

1. **Decide who owns "Minds Aligned."** LLC owns the mark and licenses it to the
   nonprofit for free: fine, that is a gift to charity. Nonprofit owns it and
   lets the LLC use it for free: not fine, that is private benefit.
2. **Separate everything.** Bank accounts, books, Stripe accounts, email. Never
   one card for both. The `ACCOUNTS` split in `support-catalog.mjs` is this
   principle in code: an `org` campaign with no nonprofit key fails closed rather
   than quietly billing the LLC and generating a receipt nobody can honour.
3. **Write down every shared thing.** Anything the two share — IP, services,
   Mike's time, office costs — needs an arm's-length written agreement at fair
   market value, approved by the directors who are not Mike.
4. **Split the donor list from the customer list** at the point of collection.
   Retrofitting that is miserable.

---

## 5. Recommendation

**Do not file Form 1023 yet. Get a fiscal sponsor.**

A fiscal sponsorship agreement is executed in days. A 501(c)(3) determination
takes three to nine months, wants financial projections and governance policies
an early project cannot honestly produce, and costs **$600** (Form 1023) or
**$275** (1023-EZ, if projected revenue is under $50k) before anyone's time. A
sponsor charges **5–15%** of funds raised — 7–10% is typical — and in exchange
you get deductibility on day one, their 990, their state registrations, their
insurance and their board.

The break-even against running your own compliance is somewhere around
**$150k–$300k a year**. Below that the sponsor is cheaper than the work, and the
work is the part that actually gets skipped.

So, in order:

1. **Now.** Turn on the LLC Stripe account and take non-deductible support. The
   machinery above is built for it; `/support/` already says plainly what it is
   and is not. Nothing here is blocked on any of the rest.
2. **Next.** Approach a fiscal sponsor whose mission language covers public
   education about AI. Ask specifically: Model A or Model C, the fee, who owns
   the IP produced under sponsorship, and what happens if you later spin out.
   Model C leaves the project independent with a grant relationship; Model A
   makes the project part of the sponsor. **The IP question is the one to get in
   writing** — the whole point of Minds Aligned is publishing the work, and some
   Model A agreements would have the sponsor own it.
3. **When sponsored.** Add `STRIPE_SECRET_KEY_ORG` and flip a campaign's
   `account` from `llc` to `org`. One word in `support-catalog.mjs`. No link on
   any other site changes.
4. **Later, if volume justifies it.** File 1023, recruit a real board, and move
   off the sponsor.

Two things genuinely need a professional rather than this memo: **the entity
structure** (an attorney, once both entities exist, for the IP licence and the
services agreement between them) and **state charitable registration** (which
the fiscal sponsor removes from the list entirely — a good reason to start
there). Everything else above is operational and settled.

---

## 6. Patreon

### The numbers

Patreon retired its three-tier plan structure for new creators on **4 August
2025**. A new account pays a flat **10% platform fee** on membership income, plus
payment processing of **2.9% + $0.30** (or **5% + $0.10** on pledges under $3),
plus currency conversion and payout fees. Legacy creators sit at 5%, 8% or 11%.

Stripe Billing, for the same subscription: **2.9% + $0.30** on the card, plus
**0.5%** (Starter) or **0.7%** (Scale) of billing volume.

At $1,000/month from 40 supporters averaging $25:

| | Platform | Processing | Total | Take-home |
|---|---|---|---|---|
| **Stripe Billing (Starter)** | $5.00 | $41.00 | **$46.00** — 4.6% | $954 |
| **Patreon (10% standard)** | $100.00 | $41.00 | **$141.00** — 14.1% | $859 |

**About $95 a month, $1,140 a year, at a scale that is not yet ambitious.**

### What the extra 9.5% buys

Discovery, a membership CMS, a mobile app, comment threads, and a payments
relationship you do not have to maintain. Whether that is worth it depends on one
question: **do you want the audience Patreon can send you, or do you want the
supporter list you already have?**

Given that every property in this estate already links to one page you control,
and that `ref` already tells you which page produced which supporter, the honest
recommendation is:

**Stripe first. Patreon second, if at all — and never as the only channel.**

With Stripe you own the customer record, the email address and the renewal
relationship, and it costs a third as much. Patreon's real argument is
discovery, and discovery is worth paying for only once there is something to
discover. If you do add it, the page supports it already: set `"patreon"` in
`catalog.json` to the URL and the alternative link appears. Do not split the
effort at the start.

One caveat if the nonprofit happens later: **Patreon is not built for deductible
giving.** Receipting and substantiation would be your problem, and the 10% would
come off the top of money that is supposed to be a gift. Keep charitable giving
on the nonprofit's own Stripe account where the receipts are yours to issue.

---

## 7. Adding a campaign

1. Create the Product and Prices in Stripe.
2. Add the campaign to `CAMPAIGNS` in `hub-public-functions/support-catalog.mjs`
   with the env var names for the Price IDs, and its `account` (`llc` or `org`).
3. Add the matching display block to `hub-public/support/catalog.json`.
4. If a new site is linking in, add it to `REFERRERS` **and** to `referrers` in
   `catalog.json` — the server half decides where an abandoned checkout returns
   to, the page half names it on the back link.
5. Set the env vars on the Netlify site.
6. `node ops/check-support-catalog.mjs && node ops/test-checkout.mjs`
7. Link to it: `https://minds-aligned.org/support/?campaign=<key>&ref=<site>`

Optional extras in the link: `&intent=monthly|once`, `&tier=<key>`, `&amount=25`.
All of them are preselections a visitor can change, and all of them are priced by
the server.

---

## Sources

Rates and thresholds verified 2026-09-17. They move — re-check before relying on
a number here.

- [Patreon creator fees](https://support.patreon.com/hc/en-us/articles/11111747095181-Creator-fees-overview) · [2026 breakdown](https://creatorrevenuecalculator.com/blog/patreon-fees-2026-breakdown-of-platform-and-transaction-cost/)
- [Stripe Billing pricing](https://stripe.com/billing/pricing) · [nonprofit fee discount](https://support.stripe.com/questions/fee-discount-for-nonprofit-organizations)
- [IRS: quid pro quo contributions](https://www.irs.gov/charities-non-profits/charitable-organizations/charitable-contributions-quid-pro-quo-contributions) · [Publication 1771](https://www.irs.gov/pub/irs-pdf/p1771.pdf) · [2026 inflation adjustments for nonprofits](https://clarknuber.com/articles/2026-tax-inflation-adjustments-relevant-to-not-for-profit-organizations/)
- [IRS: Form 1023 user fee](https://www.irs.gov/charities-non-profits/form-1023-and-1023-ez-amount-of-user-fee)
- [Public Counsel: fiscal sponsorship as an alternative to incorporating](https://publiccounsel.org/publications/fiscal-sponsorship-an-alternative-to-forming-a-nonprofit-501c3-corporation/)
- [1099-K threshold after the OBBBA](https://www.anchin.com/articles/preparing-for-1099-filing-season-what-the-obbba-means-for-1099-k-and-other-reporting-thresholds/)
