from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware

# import your pipeline pieces
from services.slack_export import parse_slack_export
from services.bedrock_embed import embed_one
from services.nova_extract import extract_decisions
# import your chunking function name here:
from services.chunking import chunk_document  # <-- adjust if your function is named differently

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)

class QueryRequest(BaseModel):
    question: str
    org_id: str | None = "demo"
    top_k: int | None = 8

# cache so you don’t re-embed every query
INDEX = None

def cosine(a, b):
    import math
    dot = sum(x*y for x, y in zip(a, b))
    na = math.sqrt(sum(x*x for x in a))
    nb = math.sqrt(sum(x*x for x in b))
    return dot / (na*nb + 1e-9)

def build_index():
    docs = parse_slack_export("slack_export")
    chunks = []
    for d in docs:
        chunks.extend(chunk_document(d))  # each chunk should have chunk_id + text + metadata

    for c in chunks:
        c["embedding"] = embed_one(c["text"])
    return chunks

@app.get("/")
async def root():
    return {"message": "Backend running"}

@app.post("/query")
async def query(req: QueryRequest):
    global INDEX
    if INDEX is None:
        INDEX = build_index()

    qvec = embed_one(req.question, purpose="TEXT_RETRIEVAL")

    scored = sorted(INDEX, key=lambda c: cosine(c["embedding"], qvec), reverse=True)
    top = scored[: (req.top_k or 8)]

    extracted = extract_decisions(req.question, top)

    sources = []

    for t in top:
        # try to find the channel in either place
        chan = t.get("channel") or t.get("metadata", {}).get("channel") or ""

        title = "Slack"
        if chan:
            title = f"Slack · #{chan}"

        sources.append({
            "id": t.get("chunk_id", ""),
            "title": title,
            "excerpt": t.get("text", "")[:240],
        })

    return {"decisions": extracted.get("decisions", []), "sources": sources}