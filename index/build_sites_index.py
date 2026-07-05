#!/usr/bin/env python3
"""Ingest per-speaker site corpora (sites/<slug>/papers + videos) into the shared
KEYSTONE chunks table. Additive + idempotent (skips existing ids). Reuses common.py."""
from __future__ import annotations
import json, sys
from pathlib import Path
from common import (embed_texts, chunk_words, connect_db, open_table,
                    existing_ids, table_schema)

SITES = Path.home() / "Projects/agi-2026/sites"
# anchors already indexed from raw/ jsonl — skip their papers to avoid dup namespaces
ANCHOR_PAPERS_DONE = {"michael-levin", "joscha-bach", "karl-friston", "ben-goertzel"}
ANCHORS_SKIP_ALL = {"michael-levin", "joscha-bach"}  # full sites live elsewhere; only videos thin

def paper_records(slug, pdir):
    out = []
    for f in sorted(pdir.glob("*.json")):
        try: row = json.loads(f.read_text(encoding="utf-8"))
        except Exception: continue
        title = (row.get("title") or "").strip()
        abstract = (row.get("abstract") or "").strip()
        body = (f"{title}\n\n{abstract}".strip()) if abstract else title
        if not body: continue
        url = row.get("link") or row.get("doi_url") or row.get("url") or ""
        date = str(row.get("year") or row.get("date") or "")
        for idx, chunk in enumerate(chunk_words(body)):
            out.append({"thinker": slug, "source_type": "paper",
                        "id": f"{slug}:paper:{f.stem}:{idx}", "url": url,
                        "date": date, "text": chunk})
    return out

def video_records(slug, vdir):
    out = []
    for f in sorted(vdir.glob("*.json")):
        try: row = json.loads(f.read_text(encoding="utf-8"))
        except Exception: continue
        title = (row.get("title") or "").strip()
        if not title: continue
        ex = (row.get("excerpt") or "").strip()
        ch = (row.get("channel") or "").strip()
        body = title + (f"\n\n{ex}" if ex else "") + (f"\n\n[{ch}]" if ch else "")
        out.append({"thinker": slug, "source_type": "video",
                    "id": f"{slug}:video:{f.stem}", "url": row.get("url") or "",
                    "date": str(row.get("date") or ""), "text": body})
    return out

def main():
    db = connect_db()
    try: table = open_table(db)
    except FileNotFoundError:
        table = db.create_table("chunks", schema=table_schema())
    have = existing_ids(table)
    recs = []
    for d in sorted(SITES.iterdir()):
        if not d.is_dir() or d.name == "_shared": continue
        slug = d.name
        if slug in ANCHORS_SKIP_ALL: continue
        if (d/"papers").is_dir() and slug not in ANCHOR_PAPERS_DONE:
            recs += paper_records(slug, d/"papers")
        if (d/"videos").is_dir():
            recs += video_records(slug, d/"videos")
    new = [r for r in recs if r["id"] not in have]
    print(f"candidates={len(recs)} new={len(new)}")
    B = 64
    for i in range(0, len(new), B):
        batch = new[i:i+B]
        vecs = embed_texts([r["text"] for r in batch])
        rows = [{"vector": vecs[j], **{k: batch[j][k] for k in
                 ("thinker","source_type","id","url","date","text")}} for j in range(len(batch))]
        table.add(rows)
        print(f"  wrote {min(i+B,len(new))}/{len(new)}", flush=True)
    # counts
    import collections
    df = table.to_pandas()[["thinker","source_type"]]
    print("\nNamespace x source counts:")
    for (t,s),c in sorted(collections.Counter(map(tuple, df.values)).items()):
        print(f"  {t:22} {s:6} {c}")
    print(f"TOTAL rows = {table.count_rows()}")
    return 0

if __name__ == "__main__":
    sys.exit(main())
