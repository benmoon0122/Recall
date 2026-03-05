from services.slack_export import parse_slack_export
from services.chunking import chunk_document

docs = parse_slack_export("slack_export")

print("docs:", len(docs))

doc = docs[0]

chunks = chunk_document(doc)

print("chunks:", len(chunks))

print("\n--- FIRST CHUNK ---\n")
print(chunks[0]["text"])