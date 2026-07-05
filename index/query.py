#!/usr/bin/env python3
"""CLI retrieval over the KEYSTONE namespaced LanceDB index."""

from __future__ import annotations

import argparse
import sys

from common import connect_db, open_table, search_chunks, snippet


def print_results(rows: list[dict]) -> None:
    if not rows:
        print("No results.")
        return
    for i, row in enumerate(rows, 1):
        score = row.get("score")
        score_s = f" score={score:.3f}" if score is not None else ""
        print(f"\n--- [{i}]{score_s} {row.get('thinker')} / {row.get('source_type')} ---")
        if row.get("date"):
            print(f"date: {row['date']}")
        if row.get("url"):
            print(f"url:  {row['url']}")
        print(snippet(row.get("text", ""), max_len=400))


def main() -> int:
    parser = argparse.ArgumentParser(description="Query the KEYSTONE index")
    parser.add_argument("query", help="Search query text")
    parser.add_argument(
        "--thinkers",
        default="",
        help="Comma-separated namespaces (e.g. joscha-bach,karl-friston). Omit for all.",
    )
    parser.add_argument("-k", "--k", type=int, default=8, help="Number of chunks to return")
    args = parser.parse_intermixed_args()

    thinkers = [t.strip() for t in args.thinkers.split(",") if t.strip()] or None

    db = connect_db()
    table = open_table(db)
    rows = search_chunks(table, args.query, thinkers=thinkers, k=args.k)
    print_results(rows)
    return 0


if __name__ == "__main__":
    sys.exit(main())