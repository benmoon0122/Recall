import json
from services.db import get_pool


async def retrieve_top_k(query_embedding: list[float], org_id: str, k: int = 10) -> list[dict]:
    """
    pgvector top-k retrieval.
    Returns chunk dicts with text, metadata, chunk_id, document_id.
    """
    pool = await get_pool()
    vec_literal = "[" + ",".join(str(v) for v in query_embedding) + "]"

    rows = await pool.fetch(
        """
        SELECT
            c.id        AS chunk_id,
            c.document_id,
            c.chunk_index,
            c.text,
            c.metadata  AS chunk_metadata,
            d.title     AS doc_title,
            d.source,
            d.metadata  AS doc_metadata
        FROM embeddings e
        JOIN chunks c    ON c.id = e.chunk_id
        JOIN documents d ON d.id = c.document_id
        WHERE e.org_id = $1::uuid
        ORDER BY e.embedding <-> $2::vector
        LIMIT $3
        """,
        org_id,
        vec_literal,
        k,
    )

    results = []
    for r in rows:
        chunk_meta = json.loads(r["chunk_metadata"]) if isinstance(r["chunk_metadata"], str) else (r["chunk_metadata"] or {})
        doc_meta = json.loads(r["doc_metadata"]) if isinstance(r["doc_metadata"], str) else (r["doc_metadata"] or {})
        results.append({
            "chunk_id": str(r["chunk_id"]),
            "document_id": str(r["document_id"]),
            "chunk_index": r["chunk_index"],
            "text": r["text"],
            "channel": chunk_meta.get("channel", ""),
            "metadata": {**chunk_meta, **doc_meta},
            "doc_title": r["doc_title"],
            "source": r["source"],
        })
    return results
