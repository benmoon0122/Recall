import json
import uuid
from services.db import get_pool
from services.slack_export import parse_slack_export
from services.chunking import chunk_document
from services.bedrock_embed import embed_one


async def ingest_slack_export(export_dir: str, org_id: str) -> dict:
    """
    Full ingest pipeline: parse Slack export → chunk → embed → store in Supabase.
    Returns summary stats.
    """
    pool = await get_pool()

    docs = parse_slack_export(export_dir)
    total_chunks = 0
    total_embeddings = 0

    for doc in docs:
        # 1. Insert document
        doc_id = uuid.uuid4()
        await pool.execute(
            """
            INSERT INTO documents (id, org_id, source, title, raw_text, metadata)
            VALUES ($1, $2::uuid, $3, $4, $5, $6)
            """,
            doc_id,
            org_id,
            doc.get("source", "slack_export"),
            doc.get("title", ""),
            doc.get("text", ""),
            json.dumps({
                "channel": doc.get("channel"),
                "thread_ts": doc.get("thread_ts"),
                "participants": doc.get("participants"),
                "start_ts": doc.get("start_ts"),
                "end_ts": doc.get("end_ts"),
                "message_count": doc.get("metadata", {}).get("message_count"),
            }),
        )

        # 2. Chunk
        chunks = chunk_document(doc)
        total_chunks += len(chunks)

        for chunk in chunks:
            chunk_id = uuid.uuid4()

            # 3. Insert chunk
            await pool.execute(
                """
                INSERT INTO chunks (id, org_id, document_id, chunk_index, text, metadata)
                VALUES ($1, $2::uuid, $3, $4, $5, $6)
                """,
                chunk_id,
                org_id,
                doc_id,
                chunk["chunk_index"],
                chunk["text"],
                json.dumps(chunk.get("metadata", {})),
            )

            # 4. Embed + insert embedding
            vec = embed_one(chunk["text"])
            vec_literal = "[" + ",".join(str(v) for v in vec) + "]"
            await pool.execute(
                """
                INSERT INTO embeddings (chunk_id, org_id, embedding)
                VALUES ($1, $2::uuid, $3::vector)
                """,
                chunk_id,
                org_id,
                vec_literal,
            )
            total_embeddings += 1

    return {
        "documents": len(docs),
        "chunks": total_chunks,
        "embeddings": total_embeddings,
    }
