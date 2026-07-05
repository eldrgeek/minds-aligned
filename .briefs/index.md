# Worker brief: the shared namespaced RAG index (KEYSTONE)

Engineering worker on Mike's Mac. Read `~/Projects/agi-2026/BUILD.md`. Work ONLY in
`~/Projects/agi-2026/index`. HARD RULES: no deploy, no git push, no secrets in code.
Append new ideas to `~/Projects/agi-2026/IDEAS.md`. Write `index-REPORT.md`.

## Goal
One vector store over ALL thinker corpora, with a per-thinker NAMESPACE, so the same
store serves single-thinker RAG (the managers) AND cross-namespace synthesis (the room).
Use a LOCAL embedding model — NO API key. Deterministic, re-runnable.

## Stack (no external keys)
- Embeddings: `fastembed` (BAAI/bge-small-en-v1.5, ONNX, CPU) — `pip install fastembed`.
  (Fallback: sentence-transformers all-MiniLM-L6-v2.)
- Store: LanceDB (`pip install lancedb`) at `index/store/` (gitignored). One table `chunks`
  with columns: vector, thinker (namespace), source_type, id, url, date, text.

## Ingest these corpora into chunks (thinker = namespace)
- **michael-levin**: `~/Projects/Levinese/src/content/papers/*.json` (title+abstract) and
  `~/Projects/Levinese/src/content/terms/*.md` (term + body).
- **joscha-bach**: `~/Projects/agi-2026/raw/Plinz.jsonl` (one chunk per post; field `text`;
  skip empty). ~2200 posts.
- **karl-friston**: `~/Projects/agi-2026/raw/papers-karl-friston.jsonl` (title+abstract).
- **ben-goertzel**: `~/Projects/agi-2026/raw/papers-ben-goertzel.jsonl` (title+abstract).
Chunk papers/abstracts to ~512 tokens; tweets are atomic. Store source url + date.

## Deliver
- `index/build_index.py` — ingest + embed + write LanceDB. Idempotent (skip existing ids).
- `index/query.py` — CLI: `python query.py --thinkers joscha-bach,karl-friston "agency" --k 8`
  → prints top chunks (thinker, date, url, snippet). Supports one or many namespaces
  (many = cross-corpus synthesis retrieval).
- `index/serve.py` (FastAPI, optional) — POST /retrieve {thinkers[], query, k} → JSON chunks.
  This is what the managers + room will call. Keep it keyless (retrieval only; generation
  happens elsewhere with the caller's key).
Run build_index.py on all four corpora; report chunk counts per namespace + a sample query.
