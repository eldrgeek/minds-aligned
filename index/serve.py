#!/usr/bin/env python3
"""Keyless FastAPI retrieval service for managers and the multi-agent room."""

from __future__ import annotations

from contextlib import asynccontextmanager
from typing import Annotated

import uvicorn
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field

from common import connect_db, open_table, search_chunks, snippet

_table = None


@asynccontextmanager
async def lifespan(_app: FastAPI):
    global _table
    db = connect_db()
    _table = open_table(db)
    yield


app = FastAPI(title="KEYSTONE Retrieve", version="1.0.0", lifespan=lifespan)


class RetrieveRequest(BaseModel):
    thinkers: list[str] = Field(default_factory=list, description="Namespaces to search; empty = all")
    query: str
    k: int = Field(default=8, ge=1, le=50)


class ChunkResult(BaseModel):
    thinker: str
    source_type: str
    id: str
    url: str
    date: str
    text: str
    snippet: str
    score: float | None = None


class RetrieveResponse(BaseModel):
    query: str
    thinkers: list[str]
    k: int
    chunks: list[ChunkResult]


@app.get("/health")
def health():
    return {"status": "ok", "service": "keystone-retrieve"}


@app.post("/retrieve", response_model=RetrieveResponse)
def retrieve(req: RetrieveRequest):
    if _table is None:
        raise HTTPException(status_code=503, detail="Index not loaded")
    thinkers = req.thinkers or None
    rows = search_chunks(_table, req.query, thinkers=thinkers, k=req.k)
    chunks = [
        ChunkResult(
            thinker=row.get("thinker", ""),
            source_type=row.get("source_type", ""),
            id=row.get("id", ""),
            url=row.get("url", ""),
            date=row.get("date", ""),
            text=row.get("text", ""),
            snippet=snippet(row.get("text", "")),
            score=row.get("score"),
        )
        for row in rows
    ]
    return RetrieveResponse(
        query=req.query,
        thinkers=req.thinkers,
        k=req.k,
        chunks=chunks,
    )


def main():
    uvicorn.run("serve:app", host="127.0.0.1", port=8765, reload=False)


if __name__ == "__main__":
    main()