"""Shared KEYSTONE index utilities: paths, chunking, embeddings, LanceDB."""

from __future__ import annotations

import re
from pathlib import Path
from typing import Iterable, Iterator, Sequence

import lancedb
import pyarrow as pa

INDEX_DIR = Path(__file__).resolve().parent
STORE_DIR = INDEX_DIR / "store"
TABLE_NAME = "chunks"
EMBED_MODEL = "BAAI/bge-small-en-v1.5"

LEVIN_PAPERS = Path.home() / "Projects/Levinese/src/content/papers"
LEVIN_TERMS = Path.home() / "Projects/Levinese/src/content/terms"
JOSCHA_JSONL = Path.home() / "Projects/agi-2026/raw/Plinz.jsonl"
FRISTON_JSONL = Path.home() / "Projects/agi-2026/raw/papers-karl-friston.jsonl"
GOERTZEL_JSONL = Path.home() / "Projects/agi-2026/raw/papers-ben-goertzel.jsonl"

# ~512 tokens ≈ 400 words for English prose.
CHUNK_WORDS = 400
CHUNK_OVERLAP_WORDS = 50

_embedder = None


def get_embedder():
    global _embedder
    if _embedder is None:
        try:
            from fastembed import TextEmbedding

            _embedder = TextEmbedding(model_name=EMBED_MODEL)
        except ImportError:
            from sentence_transformers import SentenceTransformer

            _embedder = SentenceTransformer("all-MiniLM-L6-v2")
    return _embedder


def embed_texts(texts: Sequence[str]) -> list[list[float]]:
    if not texts:
        return []
    model = get_embedder()
    if hasattr(model, "embed"):
        return [vec.tolist() for vec in model.embed(texts)]
    return model.encode(list(texts), show_progress_bar=False).tolist()


def chunk_words(text: str, max_words: int = CHUNK_WORDS, overlap: int = CHUNK_OVERLAP_WORDS) -> list[str]:
    words = text.split()
    if not words:
        return []
    if len(words) <= max_words:
        return [text.strip()]
    chunks: list[str] = []
    start = 0
    while start < len(words):
        end = min(start + max_words, len(words))
        chunks.append(" ".join(words[start:end]).strip())
        if end >= len(words):
            break
        start = max(0, end - overlap)
    return [c for c in chunks if c]


def reconstruct_abstract(inv: dict | None) -> str:
    if not inv:
        return ""
    pos_to_word: dict[int, str] = {}
    for word, positions in inv.items():
        if not isinstance(positions, list):
            continue
        for p in positions:
            try:
                pos_to_word[int(p)] = word
            except (TypeError, ValueError):
                continue
    if not pos_to_word:
        return ""
    return " ".join(pos_to_word[i] for i in sorted(pos_to_word)).strip()


def parse_term_md(path: Path) -> tuple[str, str, str]:
    raw = path.read_text(encoding="utf-8")
    title = path.stem.replace("-", " ").title()
    body = raw
    if raw.startswith("---"):
        parts = raw.split("---", 2)
        if len(parts) >= 3:
            front = parts[1]
            body = parts[2].strip()
            m = re.search(r'^title:\s*["\']?(.+?)["\']?\s*$', front, re.MULTILINE)
            if m:
                title = m.group(1).strip().strip('"').strip("'")
    body = re.sub(r"<br\s*/?>", "\n", body)
    body = re.sub(r"\n{3,}", "\n\n", body).strip()
    return path.stem, title, body


def paper_url(record: dict) -> str:
    doi = record.get("doi") or (record.get("ids") or {}).get("doi")
    if doi:
        if doi.startswith("http"):
            return doi
        return f"https://doi.org/{doi.lstrip('https://doi.org/')}"
    pl = record.get("primary_location") or {}
    if pl.get("landing_page_url"):
        return pl["landing_page_url"]
    return record.get("id") or ""


def paper_date(record: dict) -> str:
    return (
        record.get("publication_date")
        or (str(record["publication_year"]) if record.get("publication_year") else "")
        or record.get("year")
        or ""
    )


def paper_text(record: dict) -> str:
    title = (record.get("title") or record.get("display_name") or "").strip()
    abstract = (record.get("abstract") or reconstruct_abstract(record.get("abstract_inverted_index")) or "").strip()
    if abstract:
        return f"{title}\n\n{abstract}".strip()
    return title


def connect_db() -> lancedb.DBConnection:
    STORE_DIR.mkdir(parents=True, exist_ok=True)
    return lancedb.connect(str(STORE_DIR))


def table_schema() -> pa.Schema:
    return pa.schema(
        [
            pa.field("vector", pa.list_(pa.float32(), 384)),
            pa.field("thinker", pa.string()),
            pa.field("source_type", pa.string()),
            pa.field("id", pa.string()),
            pa.field("url", pa.string()),
            pa.field("date", pa.string()),
            pa.field("text", pa.string()),
        ]
    )


def open_table(db: lancedb.DBConnection, create: bool = False):
    names = db.table_names()
    if TABLE_NAME in names:
        return db.open_table(TABLE_NAME)
    if not create:
        raise FileNotFoundError(
            f"LanceDB table '{TABLE_NAME}' not found at {STORE_DIR}. Run build_index.py first."
        )
    return db.create_table(TABLE_NAME, schema=table_schema())


def existing_ids(table) -> set[str]:
    if table.count_rows() == 0:
        return set()
    return set(table.to_arrow().column("id").to_pylist())


def snippet(text: str, max_len: int = 240) -> str:
    one_line = " ".join(text.split())
    if len(one_line) <= max_len:
        return one_line
    return one_line[: max_len - 1] + "…"


def thinkers_filter(thinkers: Sequence[str]) -> str:
    quoted = ", ".join(f"'{t}'" for t in thinkers)
    return f"thinker IN ({quoted})"


def search_chunks(
    table,
    query: str,
    thinkers: Sequence[str] | None = None,
    k: int = 8,
) -> list[dict]:
    vec = embed_texts([query])[0]
    search = table.search(vec).limit(k)
    if thinkers:
        search = search.where(thinkers_filter(thinkers))
    rows = search.to_list()
    for row in rows:
        row.pop("vector", None)
        if "_distance" in row:
            row["score"] = 1.0 - float(row.pop("_distance"))
    return rows