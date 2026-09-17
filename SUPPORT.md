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
| The prices | `hub-public-functions/support-catalog.mjs` | Maps campaign+intent+tier → Stripe Price ID → the real amount |
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
   Minds Aligned", with four recurring Prices: $5/month, $10/month, $50/year,
   $100/year.
2. **Netlify → `minds-aligned-soma` → environment variables:**
   ```
   STRIPE_SECRET_KEY               sk_live_…
   MA_PRICE_INITIATIVE_MONTH_5     price_…      ($5/month)
   MA_PRICE_INITIATIVE_MONTH_10    price_…      ($10/month)
   MA_PRICE_INITIATIVE_YEAR_50     price_…      ($50/year)
   MA_PRICE_INITIATIVE_YEAR_100    price_…      ($100/year)
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

## 2. The offer, and why it is this shape

Decided 2026-09-17 after looking at what the estate actually produces, what small
memberships report about what killed them, and what survives a move to charitable
status. Three questions, and the answers all point the same way.

### Two prices per interval, not four

| | Monthly | Yearly |
|---|---|---|
| | $5 | $50 |
| **suggested** | **$10** | **$100** |
| Open amount | from $3, no ceiling | from $25, no ceiling |

One-time stays separate and per-campaign: $10/$25/$100 on the front door,
$5/$15/$50 on the song.

People reliably pick the second-lowest of whatever is shown, so the $5 mostly
exists to make $10 second-lowest. A third and fourth rung add decision friction
and no revenue. Anyone who wants to give more uses the open amount — which has no
ceiling, because a fixed top tier caps your most generous supporter at its price.

Yearly is ten months' money for twelve, and the front door leads with it.
Twelve-month retention on annual runs far ahead of monthly, and at this scale the
cash matters more than the discount costs: ten annual supporters is a year in the
bank in week one, against 120 separate chances to cancel arriving exactly when
there is least momentum to survive them.

### Every level gets the same three things

- Your name on the supporters page, if you want it there.
- Your mail gets read and answered by a person.
- The occasional note from the workbench when something lands — no schedule, no
  newsletter.

**This is the load-bearing decision, not an omission.** A higher amount buys more
support of the work, not more stuff. Two independent constraints land on it:

1. **Burden.** Every retrospective from a small membership that folded names the
   same cause — a promise whose cost scales with members, or a promise on a
   calendar. Nothing in this estate has ever shipped monthly; work arrives in
   multi-day bursts around events. Four tiers with four perk bundles is four
   production lines that outlive the enthusiasm that made them.
2. **Deductibility.** If a campaign moves to `org`, a gift stays fully deductible
   only if benefits are worth at most the lesser of 2% of the payment or $139. At
   $120/year that ceiling is **$2.40**. Recognition and replies have no
   ascertainable market value and cost nothing against it.

So: no early access, no Discord, no scheduled calls, no downloads, no merch. Add
one and both tests fail at once. Early access is the tempting one and it is also
the most wrong — it would mean selling a delay imposed on everyone else, from an
outfit whose whole position is publishing in the open.

### No Friend/Patron ladder

The tier key is the amount. Among a dozen supporters who mostly know each other
and know Mike, a status ladder makes somebody publicly the cheap one, and buys
nothing when the benefits are identical anyway. Each price carries one plain line
about what it covers instead.

### Garage Door asks once

One-time leads there and that is not a default to revisit. The song is one
finished thing, and everything about it is already free — the mp3, the lyrics,
the timed SRT, the narration script, all ten exact prompts. A recurring charge
implicitly answers "what do I get next month" and that page has no answer. It is
a tip jar, and tip jars are one-time.

The subscription stays one click deeper, sharing the initiative's prices, with
one line of copy doing the work: *a subscription isn't to this song — it's
finished, and it's yours for nothing. It's how the next one gets made.* Backing
the shop, not subscribing to a finished song.

### One promise that had to be withdrawn

An earlier draft of the tiers said *"You are on the list and you hear things
first."* **There is no list** — no Mailchimp, no Buttondown, nothing anywhere in
the estate. Stripe does put every supporter's email on the Customer record, which
is a real mechanism for mailing a dozen people when something lands, and that is
what the wording now describes. Worth stating because it is the exact failure
mode this whole section is built to avoid: a sentence in a catalogue file is a
promise, and nothing in the repo was going to keep that one.

### What actually gets the first ten supporters

Not this page. Small memberships consistently report the first supporters coming
from direct personal asks — an email, a DM, a conversation — and the page
existing so there is somewhere to point. Mike's audience is largely people who
already know him. **The page took an afternoon; the ask is the work.** For the
"found one artifact" audience, the thing that matters is a low-key support line
on every artifact, which is what the Garage Door tip jar is.

Realistic first-year outcome: tens of dollars a month. At five to fifteen
supporters that is a success, and the offer above is designed so it stays
sustainable at that size rather than collapsing under promises.

---

## 3. Is a subscription different from a donation?

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

## 4. What changes under a 501(c)(3)

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

## 5. The trap in running both

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

## 6. Fiscal sponsorship — what it means, and who to email

A fiscal sponsor is an existing 501(c)(3) that lets your project operate under
its exemption. You form nothing, file no 1023, recruit no board.

### Follow a $50 donation through it

1. The donor pays **the sponsor** — not you, not the LLC.
2. **The sponsor's EIN is on the receipt.** Their determination letter is what
   makes the deduction real.
3. They take the fee off the top — at 8%, $4 — and credit ~$46 to a restricted
   fund for your project.
4. You request a disbursement naming the expense. They approve it against the
   charitable purpose and transfer, typically 2–5 business days.

Two things that surprise people. **The money is not yours while it sits there** —
the sponsor holds legal title and retains variance power, the right to redirect
funds if the project stops doing the charitable thing. That is not a formality;
it is the feature that makes the gift deductible. And **a donor cannot earmark to
you personally**: "for Mike" breaks the deduction, "for the Minds Aligned
project" is fine.

### Model C, not Model A

|  | Model A | Model C |
|---|---|---|
| Who owns the essays, the site, the song, the corpus | **The sponsor** | **You** |
| Is Minds Aligned still yours | No — a program of their org | Yes — you are a grantee |
| Who employs anyone you pay | Sponsor, on their payroll | You do |
| Typical fee | 9–15% | 4–10% |

**The Model A trap is fatal here:** the sponsor becomes copyright owner of
everything produced with project funds. For a project whose entire product is
published work with the prompts and credits attached, that means *someone else
decides the licence* — and if they merge, dissolve, or simply disagree, you are
negotiating for your own archive. With an identically-named LLC beside it you
would have a for-profit called Minds Aligned and a charitable program called
Minds Aligned owned by a third party.

### The shortlist (verified September 2026)

**Dead ends — do not spend a week on these.** Open Collective Foundation
dissolved 31 Dec 2024, taking ~600 projects with it. Open Source Collective is
alive but is a **501(c)(6)**, so gifts to it are **not deductible** — it fails
the only requirement. Propel sunset its program in March 2026. Hack Club's HCB is
now restricted to projects led by 13–18 year olds.

| Sponsor | Fee | Model | Fit |
|---|---|---|---|
| **[Fractured Atlas](https://www.fracturedatlas.org/fiscal-sponsorship)** | 8% + $120/yr membership | C | **Best overall.** No minimum budget — the only one here without one. Explicitly allows an **LLC as the grantee entity**, which is your exact situation. ~10 business days. Frame as interdisciplinary media/literary arts, not AI research |
| **[Manifund](https://manifund.org/about/donor-faq)** | 5% | C | **Fastest and cheapest.** Explicitly sponsors individuals and for-profits. Funds out in <48h. Requires a public project proposal — aligned with publishing openly. Confirm scope; their centre of gravity is AI safety |
| **[Aspiration](https://aspirationtech.org/services/fiscalsponsorship)** | sliding scale | — | Tech/digital rights, with stated emphasis on open **intellectual property** approaches. Everything negotiated; no published terms |
| **[Social Good Fund](https://www.socialgoodfund.org/fiscal-sponsorship/)** | 5–8% + $29/mo | A/B/C | Generalist backup. ~1,000 applications a year against capacity for ~100 |

Ruled out on minimums or scope: Players Philanthropy Fund ($30k minimum
budget), NYFA ($15k minimum), Code for Science & Society (15%, and a mandatory
advisory committee — the board recruitment you were avoiding), Software Freedom
Conservancy (FOSS only), NumFOCUS (scientific software only).

### The flag: you already own Minds Aligned LLC

Raise this first rather than letting a sponsor find it. A 501(c)(3) cannot confer
private benefit on a for-profit or its owner, and your case has two aggravating
facts: **same name** (charitable dollars visibly build a brand you own
commercially) and **same owner** (you are on both sides of every transaction).

It is solvable and routinely solved, but have these ready:

1. **A clean line between the two.** Name the charitable activity precisely —
   publishing the essays, the corpus and the song openly and free, under open
   licences — and name what the LLC does commercially that is *not* sponsored.
2. **Separate bank account and books** for the sponsored side. Non-negotiable.
3. **A written restricted-use commitment:** grant funds pay project expenses
   only. No distributions, no subsidising commercial work.
4. **A royalty-free trademark licence from the LLC to the project** for the name,
   so the charity is not building equity in a mark it has no rights to — and so
   you keep the mark when you leave. Offer this before they ask.
5. **Lead with the open licensing.** Everything published free with prompts and
   credits attached is unusually strong evidence of public benefit.

If a sponsor balks at the LLC, the fallback is to make the grantee *you
personally* and leave the LLC out of the sponsored side entirely.

### Ask these before signing

- Who owns copyright in work created with sponsored funds — in writing, before
  signing?
- Will you agree in the contract not to restrict open sharing or licensing of the
  work to the public?
- Who controls the domain names?
- Is the fee on gross or net? On pass-through grants? Are card fees on top?
- Can I run my own Stripe account, or must donations go through yours? (Usually
  theirs — the receipt has to come from their EIN. Do not assume the checkout
  built here carries over on the `org` side.)
- What happens to the fund balance if I leave, who approves the successor, and is
  there a claim window? (Fractured Atlas: 90 days, then it reverts to them.)
- Do you require an advisory committee? (This is how "no board needed" quietly
  becomes a board.)

### The honest economics, which change the recommendation

At $1,000 raised through Fractured Atlas: $80 fee + $120 membership = **$200, or
20%**. Non-deductible support straight to the LLC costs about 3%. So at hundreds
to low thousands a year, **fiscal sponsorship is not obviously worth it** — you
would be paying roughly $200/year to buy your donors a deduction most of them
were not going to itemise anyway.

Two things push the other way, and they are what should decide it:

1. **2026 is the first year in a while the deduction is worth something to small
   donors.** Non-itemisers can now deduct up to $1,000 ($2,000 joint) of cash
   gifts to public charities above the line. Being sponsored before December is
   worth more than it would have been in 2024.
2. **The real unlock is grants, not $50 gifts.** The moment you want to apply for
   anything requiring 501(c)(3) status, sponsorship is the only door. That is
   where the 20% stops looking expensive.

**So the revised recommendation:** run the LLC checkout now — it is built, it
costs 3%, and nothing is blocked on any of this. Apply to a sponsor **when there
is a specific reason**: a grant you want to apply for, a donor who needs the
deduction, or donation volume past roughly $2,000/year where the percentage
starts buying something. If you want to move now anyway, apply to **Fractured
Atlas and Manifund the same week** and take the first written yes that lets you
keep the IP, accepts the LLC or you personally as grantee, and has no minimum.

Do not file Form 1023 in either case. Sponsors' own guidance puts the spin-out
point at $250k–$500k a year, and the counterparty risk is real — OCF dissolved
with 600 projects inside it, and exits are what people report regretting.

---

## 7. Patreon

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

## 8. Adding a campaign

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

Optional extras in the link: `&intent=once|monthly|yearly`, `&tier=<key>`,
`&amount=25`. All of them are preselections a visitor can change, and all of them
are priced by the server.

---

## Sources

Rates and thresholds verified 2026-09-17. They move — re-check before relying on
a number here.

- [Patreon creator fees](https://support.patreon.com/hc/en-us/articles/11111747095181-Creator-fees-overview) · [2026 breakdown](https://creatorrevenuecalculator.com/blog/patreon-fees-2026-breakdown-of-platform-and-transaction-cost/)
- [Stripe Billing pricing](https://stripe.com/billing/pricing) · [nonprofit fee discount](https://support.stripe.com/questions/fee-discount-for-nonprofit-organizations)
- [IRS: quid pro quo contributions](https://www.irs.gov/charities-non-profits/charitable-organizations/charitable-contributions-quid-pro-quo-contributions) · [Publication 1771](https://www.irs.gov/pub/irs-pdf/p1771.pdf) · [2026 inflation adjustments for nonprofits](https://clarknuber.com/articles/2026-tax-inflation-adjustments-relevant-to-not-for-profit-organizations/)
- [IRS: Form 1023 user fee](https://www.irs.gov/charities-non-profits/form-1023-and-1023-ez-amount-of-user-fee)
- [Public Counsel: fiscal sponsorship as an alternative to incorporating](https://publiccounsel.org/publications/fiscal-sponsorship-an-alternative-to-forming-a-nonprofit-501c3-corporation/) · [the models, summarised](https://fiscalsponsorship.com/the-models-summary/)
- Sponsors: [Fractured Atlas fees](https://fracturedatlas.zendesk.com/hc/en-us/articles/115001290913-Administrative-Fees) and [acceptable legal entities](https://fracturedatlas.zendesk.com/hc/en-us/articles/115001291953-About-Legal-Entities) · [Manifund](https://manifund.org/about/donor-faq) · [Aspiration](https://aspirationtech.org/services/fiscalsponsorship) · [Social Good Fund](https://www.socialgoodfund.org/fiscal-sponsorship/)
- Dead ends, verified: [Open Collective Foundation dissolved](https://opencollective.com/foundation/updates/announcement-we-are-dissolving-open-collective-foundation-at-the-end-of-this-year) · [Open Source Collective is a 501(c)(6), gifts not deductible](https://docs.oscollective.org/how-it-works/tax-info) · [Propel sunset its programme](https://propelnonprofits.org/blog/programmatic-update-sunsetting-fiscal-sponsorship-at-propel/) · [HCB is now 13–18 only](https://help.hcb.hackclub.com/en/articles/15409923-who-can-apply-for-fiscal-sponsorship)
- [Nonprofit Law Blog: six ways to get fiscal sponsorship wrong](https://nonprofitlawblog.com/fiscal-sponsorship-six-ways-to-do-it-wrong/) · [exits and transferring assets](https://nonprofitlawblog.com/fiscal-sponsorship-exit-transfer-assets/)
- [1099-K threshold after the OBBBA](https://www.anchin.com/articles/preparing-for-1099-filing-season-what-the-obbba-means-for-1099-k-and-other-reporting-thresholds/) · [2026 above-the-line charitable deduction for non-itemisers](https://taxfoundation.org/blog/charitable-deduction-big-beautiful-bill/)
