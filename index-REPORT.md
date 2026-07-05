# index-REPORT — KEYSTONE shared namespaced RAG

**Track:** `index/` (KEYSTONE)  
**Date:** 2026-06-20  
**Status:** Done — built, queried, serve smoke-tested

## What was built

One LanceDB vector store at `index/store/` (gitignored) serving four thinker **namespaces** from a single `chunks` table. Embeddings use local **fastembed** (`BAAI/bge-small-en-v1.5`, ONNX/CPU, 384-dim). No API keys.

| File | Purpose |
|------|---------|
| `index/common.py` | Paths, chunking, embedder, LanceDB helpers, search |
| `index/build_index.py` | Idempotent ingest + embed + write |
| `index/query.py` | CLI cross-namespace retrieval |
| `index/serve.py` | FastAPI `POST /retrieve` (keyless) |
| `index/requirements.txt` | Python deps |
| `index/.venv/` | Local venv (not committed) |

### Schema (`chunks`)

| Column | Type | Notes |
|--------|------|-------|
| `vector` | float32[384] | bge-small-en-v1.5 |
| `thinker` | string | Namespace slug |
| `source_type` | string | `paper`, `term`, `tweet` |
| `id` | string | Stable chunk id; dedup key |
| `url` | string | Source link |
| `date` | string | ISO date or year |
| `text` | string | Chunk body |

## Corpora ingested

| Namespace | Sources | Chunks |
|-----------|---------|--------|
| `michael-levin` | 364 papers JSON + 119 terms MD | **489** |
| `joscha-bach` | `raw/Plinz.jsonl` (non-empty tweets) | **2191** |
| `karl-friston` | `raw/papers-karl-friston.jsonl` | **403** |
| `ben-goertzel` | `raw/papers-ben-goertzel.jsonl` | **417** |
| **TOTAL** | | **3500** |

Chunking: papers/abstracts ~400 words (~512 tokens); tweets atomic; OpenAlex abstracts reconstructed from `abstract_inverted_index` when needed.

## Usage

```bash
cd ~/Projects/agi-2026/index
source .venv/bin/activate   # or .venv/bin/python ...

# Build (idempotent — skips existing ids)
python build_index.py
python build_index.py --rebuild   # drop table and rebuild

# CLI query (one or many namespaces)
python query.py --thinkers joscha-bach,karl-friston "agency" --k 8

# HTTP retrieval (managers + room)
python serve.py
# POST http://127.0.0.1:8765/retrieve
# {"thinkers": ["michael-levin"], "query": "agency", "k": 8}
```

## Sample query

```bash
python query.py --thinkers joscha-bach,karl-friston "agency" --k 8
```

Top hit (score 0.378):

- **thinker:** joscha-bach  
- **date:** 2023-03-27  
- **url:** https://x.com/Plinz/status/1640202689413001216  
- **snippet:** "I think agency is the ability to control future states"

Cross-namespace "free energy principle" correctly surfaces Friston papers alongside a Joscha tweet referencing FEP.

## Idempotency

Re-running `build_index.py` reports `new chunks to embed: 0` when all 3500 ids are present.

## Downstream consumers

- **Managers:** `POST /retrieve` with single `thinkers[]` entry  
- **Room:** `POST /retrieve` with multiple namespaces for synthesis retrieval  
- Generation stays in callers (BYOK); this layer is retrieval-only.

## Notes / follow-ups

- Empty Joscha tweets (~15) skipped per spec.
- Levin papers with empty abstracts indexed as title-only chunks.
- `serve.py` binds `127.0.0.1:8765` by default (local only).