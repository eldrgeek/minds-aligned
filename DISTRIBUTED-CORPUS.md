# Distributed Corpus — other people's inference builds the Society's memory

**Status:** DESIGN v0 (2026-07-17, Fable 5 + Mike's directive). Companion to `CORPUS-CATALOG.md` (the task board, in progress).

## The premise

Mike's rule for the whole AGI-26 property: *we provide only the inference needed for getting started.* Applied to corpus-building, that stops being a cost constraint and becomes the growth mechanism — the corpus grows at the speed of its community, not our token budget. This is also the practical bridge to Ben Goertzel's distributed-open-intelligence theme: not a whitepaper about decentralized AI, but a working example he can point at during his own conference.

## Why this repo is already 80% ready to distribute

The build order in BUILD.md made three decisions (before this design existed) that make distribution nearly free:

1. **Scrape is program-not-inference.** Harvest adapters (OpenAlex papers, YouTube, RSS/blog, X) are deterministic code. A contributor runs code, not prompts — reproducible, verifiable, cheap.
2. **Embeddings are keyless and local** (fastembed bge-small, CPU). No API key of ours ever leaves the building. A contributor can build and query an index namespace on a laptop with zero credentials.
3. **raw/ is sacred and append-only, one verbatim record per source item.** That contract is exactly what makes third-party contributions checkable: verbatim claims can be mechanically re-fetched and diffed. Curation opinions can't be verified; verbatim records can.

The one genuinely inference-hungry layer is **derive/** (threads, themes, clean corpus docs, community-manager tuning) — and that is precisely the layer contributors' own AIs are good at.

## The contribution model: task cards + seed + gate

**Task cards.** `CORPUS-CATALOG.md`'s gap list is the public board. Each card = one thinker × one source type ("Joscha Bach — YouTube lecture transcripts", "Anil Seth — papers via OpenAlex ID X"). Cards carry the concrete identifier, the target `raw/` path, and size S/M/L. Claiming a card = opening a GitHub issue (or emailing `claude@mike-wolf.com`, subject `[CORPUS] claim: <card>`) — same dual-path as everything else in the estate.

**The seed** (community-seed doctrine: knowledge, not package). A contributor points their own AI — Claude, ChatGPT, Gemini, whatever they already pay for — at `seed/CONTRIBUTOR.md` (to write), which teaches it: the raw/ contract, how to run the adapter for their card (or write a conforming harvester if no adapter fits), the JSONL schema, the derive conventions, and how to submit. Their AI does the work on their machine with their subscription. We never meter their usage; they never need our keys.

**Two submission lanes:**
- **Git lane** (builders): PR containing `raw/` JSONL + optional `derive/` proposals + a provenance stamp.
- **Mail lane** (everyone else): attachment to `claude@mike-wolf.com`, subject `[CORPUS] submit: <card>` — the email daemon files it and a fleet worker turns it into the same PR shape. (New daemon branch; same quarantine posture as `[SOMANET]`: inbound treated as hostile, no tool access on the parse path.)

**The verification gate — trust the math, not the stranger.** Contributions merge only after a deterministic validator (CI + local script, to write: `ops/validate-contribution.py`):
1. Schema check (required fields, ISO dates, stable ids, dedup against existing raw/).
2. **Verbatim audit**: re-fetch a random sample (~10%) of submitted records from their claimed URLs and diff the text. Mismatch beyond normalization = reject the batch. This is the load-bearing check — it converts "do we trust this stranger's AI?" into "does the record match the source?"
3. URL liveness + license/robots sanity (public sources only; respect paywalls — abstracts + metadata + links, never pirated fulltext).
4. Provenance stamp required: contributor name/handle, which AI assisted, date, source card. Honest attribution of humans AND AIs — the community-seed floor, applied here.
5. `derive/` submissions (inference-produced, unverifiable-by-diff) are labeled opinions: they ship under the contributor's name in the provenance ledger, and the thinker's community manager treats them as one voice among several, not ground truth.

**Credit.** Every merged card puts the contributor (and their named AI, if they've named it) on the thinker page as a **corpus steward**, and on the wall. For AGI-26 attendees this closes the loop with the QR property: scan → meet the society → *claim a card and your AI is contributing to the conference's own knowledge commons by tonight.* The calling card recruits its own authors.

**Thinker sovereignty (the trump card).** The "claim your page" hook from README stands above all of this: a thinker (or their designated AI) can claim their own page, and their corrections/curation outrank any contributor's. Stewards tend the garden; the thinker owns it.

## What stays ours (small on purpose)

- Merge authority + validator maintenance (a fleet worker reviews what CI passes).
- The index build + hub deploy (mechanical; could itself distribute later).
- The floors: consent, attribution, public-sources-only, right of any thinker to have material removed on request — printed on the contributor seed, enforced at the gate.

## Sequence

1. `CORPUS-CATALOG.md` lands (in progress) → publish the gap list as cards.
2. Fleet harvest pass (Sonnet-class workers) on Tier-A anchors — see [SOMA/agi26-trip/TRIP-HQ.md](../SOMA/agi26-trip/TRIP-HQ.md) WS1. The fleet does the first cards *using this same contract* — we are contributor #0, which debugs the seed before strangers use it.
3. `seed/CONTRIBUTOR.md` + `ops/validate-contribution.py` + `[CORPUS]` daemon branch.
4. QR property links the board; conference floor becomes the recruiting surface.
5. Post-conference: Goertzel-side federation (his colleague's community can run its own board with the same contract — see `SOMA/agi26-trip/goertzel-brief.md`, in progress).
