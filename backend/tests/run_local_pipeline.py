from services.slack_export import parse_slack_export
from services.chunking import chunk_document
from services.bedrock_embed import embed_many_texts, embed_one
from services.local_store import save_local_index, load_local_index
from services.local_retrieval import retrieve_top_k_local
from services.nova_extract import extract_decisions

INDEX_PATH = "local_index.json"

docs = parse_slack_export("slack_export")
all_chunks = []
for d in docs:
    all_chunks.extend(chunk_document(d))

print("docs:", len(docs))
print("chunks:", len(all_chunks))

# Embed all chunks (index)
chunk_texts = [c["text"] for c in all_chunks]
chunk_vecs = embed_many_texts(chunk_texts, purpose="GENERIC_INDEX", dim=1024)

save_local_index(INDEX_PATH, all_chunks, chunk_vecs)
index = load_local_index(INDEX_PATH)

question = "What decisions were made and who owns them?"
qvec = embed_one(question, purpose="TEXT_RETRIEVAL", dim=1024)

top = retrieve_top_k_local(index, qvec, k=10)
print("top chunks:", len(top))
print("top chunk preview:", top[0]["text"][:200])

result = extract_decisions(question, top)
print("\nEXTRACTED JSON:\n", result)