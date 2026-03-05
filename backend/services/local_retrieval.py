import math

def _cosine_sim(a: list[float], b: list[float]) -> float:
    dot = 0.0
    na = 0.0
    nb = 0.0
    for x, y in zip(a, b):
        dot += x * y
        na += x * x
        nb += y * y
    if na == 0 or nb == 0:
        return 0.0
    return dot / (math.sqrt(na) * math.sqrt(nb))

def retrieve_top_k_local(index_rows: list[dict], query_embedding: list[float], k: int = 10):
    scored = []
    for row in index_rows:
        sim = _cosine_sim(row["embedding"], query_embedding)
        scored.append((sim, row))
    scored.sort(key=lambda x: x[0], reverse=True)
    return [r for _, r in scored[:k]]