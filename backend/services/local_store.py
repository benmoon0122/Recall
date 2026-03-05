import json

def save_local_index(path: str, chunks: list[dict], embeddings: list[list[float]]):
    data = []
    for c, e in zip(chunks, embeddings):
        data.append({
            "chunk_id": c["chunk_id"],
            "document_id": c["document_id"],
            "text": c["text"],
            "metadata": c.get("metadata", {}),
            "embedding": e,
        })
    with open(path, "w", encoding="utf-8") as f:
        json.dump(data, f)
    return path

def load_local_index(path: str):
    with open(path, "r", encoding="utf-8") as f:
        return json.load(f)