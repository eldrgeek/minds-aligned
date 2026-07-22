# adapters/youtube — video-transcript adapter (U-01)

Implements the transcript puller `CORPUS-CATALOG.md` flags as the single
highest-leverage harvest gap: `raw/videos-*.jsonl` held 283 yt-dlp
flat-playlist metadata records (title/url/duration/channel/views) with
`has_transcript:false` and zero actual content. This adapter fetches real
transcript text for those videos.

## Files

- `lib.mjs` — shared helpers: JSONL read/append, id-set dedup, VTT parser
  (`parseVtt`), yt-dlp error classifier.
- `expand_anchor_videos.mjs` — TIER A only (Levin/Bach/Friston/Goertzel):
  widens `raw/videos-<slug>.jsonl` toward a 50-video cap via targeted
  lecture/interview/keynote searches before the transcript run, so those
  four anchors have more to land transcripts on. Writes ONLY to
  `raw/videos-<slug>.jsonl` (append, dedup by id) — never touches `sites/`.
- `pull_transcripts.mjs` — the transcript fetcher. Run this for everyone.

## Method

`yt-dlp --skip-download --write-auto-sub --sub-lang en --sub-format vtt`
per video id. No video/audio bytes ever hit disk — subtitles only, into a
tmp dir that's deleted after each fetch. `--ignore-no-formats-error` is
required: yt-dlp's format resolver otherwise errors out even with
`--skip-download` set (reproduced during dev — see git history / this
README's date). We only request `--write-auto-sub` (auto-generated
captions), not `--write-subs` (manual/creator-uploaded) — YouTube
auto-captions exist on virtually every talk/lecture in this corpus, and
requesting both types ambiguously overwrites the same on-disk filename with
no reliable way to tell after the fact which one yt-dlp actually wrote. Every
record in this adapter's output is therefore `transcript_kind: "auto"`. The
schema still carries the field (rather than omitting it) so a future pass
that adds manual-subtitle detection is a pure additive change, not a schema
migration.

**VTT cleanup.** YouTube auto-caption VTT is a *rolling* format — each cue
re-displays the tail of the previous cue plus newly-revealed words
(word-level `<c>` timestamp tags), then a near-zero-duration cue "finalizes"
that line before the next window starts. Naive concatenation duplicates
~2x the content. `parseVtt()` in `lib.mjs` strips all `<...>` tags then does
a sliding-window token-overlap dedup: for each cue's token list, find the
longest suffix of the accumulated output that matches a prefix of the new
cue, and append only the non-overlapping remainder. Verified against a
2026-07-17 test fetch (Gopnik TED talk, `cplaWsiu7Yg`) — clean, non-repeating
17,253-char / 3,176-word output, first/last lines checked by hand.

## Schema decision — parallel file, not in-place upgrade

`raw/videos-<slug>.jsonl` is treated as sacred/append-only per the repo-wide
convention (`~/Projects/agi-2026/CLAUDE.md`: *"raw/ is sacred + append-only
... never edit raw to 'fix' derived output"*). Rewriting existing video
records in place to inject transcript text would mean rewriting an existing
raw file wholesale — against that convention, and racy against any other
process reading it concurrently (this repo has multiple worker tracks that
touch `raw/`).

Instead, transcripts land in a **new raw file per thinker**:

```
raw/transcripts-<slug>.jsonl        # one JSON object per successfully-fetched video
raw/transcripts-<slug>.skiplist.jsonl   # one JSON object per permanently-failed video
```

This mirrors how papers/X already get their own `raw/<type>-<slug>.jsonl`
file rather than being merged into a shared per-person record — same
pattern, new source type. `raw/videos-<slug>.jsonl` (the metadata stubs)
is left byte-for-byte as it was; `has_transcript`/`transcript_chars` on
those existing stub records are NOT backfilled by this adapter (that would
require the in-place rewrite this design avoids) — a future index-build
pass that joins `videos-<slug>.jsonl` + `transcripts-<slug>.jsonl` on `id`
can derive that join without ever mutating either raw file.

### `raw/transcripts-<slug>.jsonl` record shape

```json
{
  "id": "cplaWsiu7Yg",
  "video_id": "cplaWsiu7Yg",
  "slug": "alison-gopnik",
  "title": "Alison Gopnik: What do babies think?",
  "url": "https://www.youtube.com/watch?v=cplaWsiu7Yg",
  "channel": "TED",
  "duration_sec": 1110,
  "transcript_kind": "auto",
  "language": "en",
  "text": "what is going on in this Baby's mind if you'd asked people ...",
  "chars": 17253,
  "words": 3176,
  "fetched_at": "2026-07-17T18:32:04.123Z",
  "source": "yt-dlp-auto-caption"
}
```

### `raw/transcripts-<slug>.skiplist.jsonl` record shape

```json
{
  "id": "abc123", "video_id": "abc123", "slug": "gary-marcus",
  "title": "...", "url": "https://www.youtube.com/watch?v=abc123",
  "reason": "no-captions", "fetched_at": "2026-07-17T18:40:11.000Z"
}
```

`reason` is one of: `no-captions`, `private`, `unavailable`, `members-only`,
`age-restricted`, `bot-check`, `rate-limited`, `timeout`, or a truncated
`error: ...` fallback. Dedup/resume logic in `pull_transcripts.mjs` treats
skip-listed ids as terminal (won't retry) unless `--retry-failed` is passed
— `no-captions`/`private`/`unavailable`/`age-restricted`/`members-only` are
genuinely permanent; `bot-check`/`rate-limited`/`timeout` are worth a
`--retry-failed` pass later if YouTube throttling eases.

## Resumability / throttling

- Idempotent by construction: pending set = `videos - transcripts -
  skiplist`, same pattern as `gather_all.mjs --skip-existing` and
  `x_scrape.mjs`'s "already have N ids". Interrupting the process (Ctrl-C,
  crash, cooldown-exhaustion) and re-running picks up exactly where it left
  off — nothing to configure.
- Politeness: 3.5-6s randomized delay between fetches (`--sleep-ms` /
  `--sleep-spread-ms`), no parallelism.
- Bot-check/rate-limit handling: 5 consecutive `bot-check`/`rate-limited`
  failures trigger a 90s cooldown (`--cooldown-after` / `--cooldown-ms`);
  after `--max-cooldowns` (default 4) cooldowns in one file, the script
  gives up on that thinker for this run and moves to the next — it never
  crashes the whole run, and a later re-run resumes cleanly. yt-dlp on this
  machine authenticates via browser-cookie extraction (already configured
  outside this adapter — see `Extracting cookies from chrome` in yt-dlp's
  own log output), which measurably reduces bot-check hits vs. anonymous
  requests.

## Usage

```bash
cd ~/Projects/agi-2026/adapters/youtube

# 1. (once) widen TIER A anchor video lists toward 50 each
node expand_anchor_videos.mjs

# 2. fetch transcripts for everyone (all raw/videos-*.jsonl)
node pull_transcripts.mjs

# one thinker, or a few
node pull_transcripts.mjs --slug karl-friston
node pull_transcripts.mjs --slug michael-levin,joscha-bach

# testing / small batch
node pull_transcripts.mjs --limit 5

# after a throttling episode has cooled off, retry the skip-list too
node pull_transcripts.mjs --retry-failed
```

## What this adapter deliberately does NOT do

Per task constraints: does not touch `raw/papers-*.jsonl`, `sites/`, or
`hub/`; does not rebuild `index/` (a separate pass consumes
`raw/transcripts-*.jsonl` once all harvest lanes land — it isn't wired into
`index/build_sites_index.py` yet, by design); does not deploy or push.
