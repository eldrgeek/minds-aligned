# Society of Minds Aligned (SoMA)

A destination that weaves the thought-streams of the thinkers building toward AGI
into a living, queryable whole — anchored on the **AGI-26** conference roster
(San Francisco, 27–30 July 2026). Each thinker gets a corpus, an AI **community
manager** that RAGs over all of their work, and a **room**; the hub lets their
representatives converse with each other — and with visitors — across corpora.

Build order (the keystone is the shared index):

```
scraper/   deterministic, program-not-inference harvest → raw/ (append-only, verbatim)
derive/    raw → organized units (threads, themes) + clean corpus docs
index/     one vector store, per-thinker NAMESPACES → managers + cross-corpus synthesis
hub/       "Society of Minds Aligned" landing + per-thinker subsites + rooms
```

## Layers, on purpose
- **raw/** is sacred and append-only: one verbatim record per source item. We never
  lose it, so we can re-derive a different organization anytime.
- **derive/** turns raw into human/RAG units (threads, theme clusters). Disposable.
- **index/** embeds the derived docs under a per-thinker namespace so the same store
  serves single-thinker RAG and cross-thinker synthesis.

## Anchors (confirmed AGI-26 keynotes)
Michael Levin · Joscha Bach · Karl Friston · Ben Goertzel — deep tier first.
Then the roster (Seth, Koch, Gopnik, Eagleman, Ororbia, Spivak, Hazan, …) as
lighter tiers, each with a "claim your page" co-ownership hook.

Status: foundation in progress (scraper first).
