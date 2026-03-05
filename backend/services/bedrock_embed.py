import os, json
import boto3
from dotenv import load_dotenv

load_dotenv()

REGION = os.environ.get("AWS_REGION", "us-east-1")
MODEL_ID = os.environ["NOVA_EMBED_MODEL_ID"]  # amazon.nova-2-multimodal-embeddings-v1:0

brt = boto3.client("bedrock-runtime", region_name=REGION)

def embed_one(
    text: str,
    *,
    purpose: str = "GENERIC_INDEX",
    dim: int = 1024,
    truncation_mode: str = "END",
) -> list[float]:
    

    """
    Nova Multimodal Embeddings (SINGLE_EMBEDDING) for TEXT.
    Schema: nova-multimodal-embed-v1
    """
    body = {
        "schemaVersion": "nova-multimodal-embed-v1",
        "taskType": "SINGLE_EMBEDDING",
        "singleEmbeddingParams": {
            "embeddingPurpose": purpose,          # e.g. GENERIC_INDEX, TEXT_RETRIEVAL
            "embeddingDimension": dim,            # 256 | 384 | 1024 | 3072
            "text": {
                "truncationMode": truncation_mode,  # START | END | NONE
                "value": text
            }
        }
    }

    resp = brt.invoke_model(
        modelId=MODEL_ID,
        body=json.dumps(body).encode("utf-8"),
        accept="application/json",
        contentType="application/json",
    )

    payload = json.loads(resp["body"].read().decode("utf-8"))

    # Response schema: {"embeddings":[{"embeddingType":"TEXT","embedding":[...]}]}
    return payload["embeddings"][0]["embedding"]

import time

def embed_many_texts(texts: list[str], *, purpose: str = "GENERIC_INDEX", dim: int = 1024):
    vectors = []
    for i, t in enumerate(texts):
        if i % 10 == 0:
            print(f"embedding {i+1}/{len(texts)}")
        vectors.append(embed_one(t, purpose=purpose, dim=dim))
        time.sleep(0.05)  # tiny sleep helps avoid throttling in demos
    return vectors

def embed_chunks(chunks):
    """
    Takes a list of chunk dictionaries and returns embeddings for each.
    """
    results = []

    for chunk in chunks:
        vec = embed_one(chunk["text"])

        results.append({
            "chunk_id": chunk["chunk_id"],
            "document_id": chunk["document_id"],
            "embedding": vec,
            "text": chunk["text"]
        })

    return results