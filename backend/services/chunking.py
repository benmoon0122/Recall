import uuid

def chunk_document(doc, max_chars=1200, overlap=150):
    """
    Split a document into overlapping text chunks.
    """

    text = doc["text"]
    chunks = []

    start = 0
    chunk_index = 0

    while start < len(text):
        end = min(len(text), start + max_chars)

        chunk_text = text[start:end].strip()

        if chunk_text:
            chunks.append({
                "chunk_id": str(uuid.uuid4()),
                "document_id": doc["document_id"],
                "chunk_index": chunk_index,
                "text": chunk_text,
                "metadata": {
                    "channel": doc.get("channel"),
                    "thread_ts": doc.get("thread_ts")
                }
            })

            chunk_index += 1

        if end == len(text):
            break

        start = end - overlap

    return chunks