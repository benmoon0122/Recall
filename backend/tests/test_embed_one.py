from services.slack_export import parse_slack_export
from services.chunking import chunk_document
from services.bedrock_embed import embed_one

# Load Slack documents
docs = parse_slack_export("slack_export")

# Take first document
doc = docs[0]

# Chunk it
chunks = chunk_document(doc)

# Embed first chunk
vec = embed_one(chunks[0]["text"])

print("embedding length:", len(vec))
print("first 5 values:", vec[:5])