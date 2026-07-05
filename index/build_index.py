#!/usr/bin/env python3
"""Ingest thinker corpora into the shared namespaced LanceDB index (KEYSTONE)."""

from __future__ import annotations

import argparse
import json
import sys
from dataclasses import dataclass
from pathlib import Path

from common import (
    CHUNK_WORDS,
    FRISTON_JSONL,
    GOERTZEL_JSONL,
    JOSCHA_JSONL,
    LEVIN_PAPERS,
    LEVIN_TERMS,
    TABLE_NAME,
    chunk_words,
    connect_db,
    embed_texts,
    existing_ids,
    open_table,
    paper_date,
    paper_text,
    paper_url,
    parse_term_md,
    table_schema,
)


@dataclass
class ChunkRecord:
    thinker: str
    source_type: str
    id: str
    url: str
    date: str
    text: str


def load_levin_papers() -> list[ChunkRecord]:
    records: list[ChunkRecord] = []
    for path in sorted(LEVIN_PAPERS.glob("*.json")):
        data = json.loads(path.read_text(encoding="utf-8"))
        title = (data.get("title") or "").strip()
        abstract = (data.get("abstract") or "").strip()
        body = f"{title}\n\n{abstract}".strip() if abstract else title
        if not body:
            continue
        url = data.get("doi_url") or (f"https://doi.org/{data['doi']}" if data.get("doi") else "")
        date = str(data.get("year") or "")
        base_id = data.get("doi") or path.stem
        for idx, chunk in enumerate(chunk_words(body)):
            records.append(
                ChunkRecord(
                    thinker="michael-levin",
                    source_type="paper",
                    id=f"michael-levin:paper:{base_id}:{idx}",
                    url=url,
                    date=date,
                    text=chunk,
                )
            )
    return records


def load_levin_terms() -> list[ChunkRecord]:
    records: list[ChunkRecord] = []
    for path in sorted(LEVIN_TERMS.glob("*.md")):
        slug, title, body = parse_term_md(path)
        text = f"{title}\n\n{body}".strip()
        if not text:
            continue
        for idx, chunk in enumerate(chunk_words(text)):
            records.append(
                ChunkRecord(
                    thinker="michael-levin",
                    source_type="term",
                    id=f"michael-levin:term:{slug}:{idx}",
                    url=f"https://levinese.org/terms/{slug}",
                    date="",
                    text=chunk,
                )
            )
    return records


def load_jsonl_posts(
    path: Path,
    thinker: str,
    source_type: str,
    id_prefix: str,
) -> list[ChunkRecord]:
    records: list[ChunkRecord] = []
    with path.open(encoding="utf-8") as fh:
        for line in fh:
            line = line.strip()
            if not line:
                continue
            row = json.loads(line)
            text = (row.get("text") or "").strip()
            if not text:
                continue
            post_id = row.get("id") or row.get("doi") or row.get("title", "")[:40]
            records.append(
                ChunkRecord(
                    thinker=thinker,
                    source_type=source_type,
                    id=f"{id_prefix}:{post_id}",
                    url=row.get("url") or "",
                    date=row.get("date") or "",
                    text=text,
                )
            )
    return records


def load_openalex_papers(path: Path, thinker: str) -> list[ChunkRecord]:
    records: list[ChunkRecord] = []
    with path.open(encoding="utf-8") as fh:
        for line in fh:
            line = line.strip()
            if not line:
                continue
            row = json.loads(line)
            body = paper_text(row)
            if not body:
                continue
            work_id = row.get("id", "").rsplit("/", 1)[-1] or row.get("doi", "unknown")
            url = paper_url(row)
            date = paper_date(row)
            for idx, chunk in enumerate(chunk_words(body)):
                records.append(
                    ChunkRecord(
                        thinker=thinker,
                        source_type="paper",
                        id=f"{thinker}:paper:{work_id}:{idx}",
                        url=url,
                        date=date,
                        text=chunk,
                    )
                )
    return records


def all_chunk_records() -> list[ChunkRecord]:
    records: list[ChunkRecord] = []
    records.extend(load_levin_papers())
    records.extend(load_levin_terms())
    records.extend(load_jsonl_posts(JOSCHA_JSONL, "joscha-bach", "tweet", "joscha-bach:tweet"))
    records.extend(load_openalex_papers(FRISTON_JSONL, "karl-friston"))
    records.extend(load_openalex_papers(GOERTZEL_JSONL, "ben-goertzel"))
    return records


def add_records(table, records: list[ChunkRecord], batch_size: int = 64) -> int:
    if not records:
        return 0
    added = 0
    for start in range(0, len(records), batch_size):
        batch = records[start : start + batch_size]
        vectors = embed_texts([r.text for r in batch])
        rows = [
            {
                "vector": vectors[i],
                "thinker": r.thinker,
                "source_type": r.source_type,
                "id": r.id,
                "url": r.url,
                "date": r.date,
                "text": r.text,
            }
            for i, r in enumerate(batch)
        ]
        if added == 0 and table.count_rows() == 0:
            table = table  # first write handled below
        table.add(rows)
        added += len(batch)
        print(f"  embedded + wrote {added}/{len(records)} new chunks", flush=True)
    return added


def namespace_counts(table) -> dict[str, int]:
    from collections import Counter

    thinkers = table.to_arrow().column("thinker").to_pylist()
    return dict(Counter(thinkers))


def main() -> int:
    parser = argparse.ArgumentParser(description="Build the KEYSTONE namespaced RAG index")
    parser.add_argument("--rebuild", action="store_true", help="Drop and rebuild the chunks table")
    parser.add_argument("--batch-size", type=int, default=64)
    args = parser.parse_args()

    print("KEYSTONE index build")
    print(f"  chunk target: ~{CHUNK_WORDS} words (~512 tokens)")

    db = connect_db()
    if args.rebuild:
        names = db.table_names()
        if TABLE_NAME in names:
            db.drop_table(TABLE_NAME)
            print(f"  dropped existing table '{TABLE_NAME}'")

    try:
        table = open_table(db, create=False)
    except FileNotFoundError:
        table = db.create_table(TABLE_NAME, schema=table_schema())
        print(f"  created table '{TABLE_NAME}'")

    known = existing_ids(table)
    print(f"  existing chunks in store: {len(known)}")

    corpus = all_chunk_records()
    by_ns: dict[str, int] = {}
    for r in corpus:
        by_ns[r.thinker] = by_ns.get(r.thinker, 0) + 1
    print("  corpus chunk candidates:")
    for ns in sorted(by_ns):
        print(f"    {ns}: {by_ns[ns]}")

    new_records = [r for r in corpus if r.id not in known]
    print(f"  new chunks to embed: {len(new_records)}")

    if new_records:
        add_records(table, new_records, batch_size=args.batch_size)

    table = open_table(db)
    counts = namespace_counts(table)
    print("\nIndexed chunk counts by namespace:")
    for ns in sorted(counts):
        print(f"  {ns}: {counts[ns]}")
    print(f"  TOTAL: {sum(counts.values())}")
    return 0


if __name__ == "__main__":
    sys.exit(main())