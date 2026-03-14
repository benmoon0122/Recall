-- Recall: Supabase schema
-- Run this in the Supabase SQL Editor

-- 1. Enable pgvector
CREATE EXTENSION IF NOT EXISTS vector;

-- 2. Documents table
CREATE TABLE IF NOT EXISTS documents (
    id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    org_id      uuid NOT NULL,
    source      text NOT NULL,          -- slack_export | doc | transcript
    title       text,
    raw_text    text,
    metadata    jsonb DEFAULT '{}',
    created_at  timestamptz DEFAULT now()
);

-- 3. Chunks table
CREATE TABLE IF NOT EXISTS chunks (
    id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    org_id          uuid NOT NULL,
    document_id     uuid NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
    chunk_index     int NOT NULL,
    text            text NOT NULL,
    metadata        jsonb DEFAULT '{}',
    created_at      timestamptz DEFAULT now()
);

-- 4. Embeddings table
CREATE TABLE IF NOT EXISTS embeddings (
    chunk_id    uuid PRIMARY KEY REFERENCES chunks(id) ON DELETE CASCADE,
    org_id      uuid NOT NULL,
    embedding   vector(1024),
    model       text DEFAULT 'amazon.nova-2-multimodal-embeddings-v1:0',
    created_at  timestamptz DEFAULT now()
);

-- 5. Jobs table (optional but nice)
CREATE TABLE IF NOT EXISTS jobs (
    id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    org_id      uuid NOT NULL,
    status      text DEFAULT 'pending',   -- pending | running | done | failed
    progress    int DEFAULT 0,
    error       text,
    created_at  timestamptz DEFAULT now()
);

-- 6. Indexes for performance
CREATE INDEX IF NOT EXISTS idx_documents_org ON documents(org_id);
CREATE INDEX IF NOT EXISTS idx_chunks_org ON chunks(org_id);
CREATE INDEX IF NOT EXISTS idx_chunks_document ON chunks(document_id);
CREATE INDEX IF NOT EXISTS idx_embeddings_org ON embeddings(org_id);

-- 7. Vector similarity index (IVFFlat for speed at scale)
-- For small datasets, exact search is fine; this helps when you grow.
CREATE INDEX IF NOT EXISTS idx_embeddings_vector
    ON embeddings USING ivfflat (embedding vector_cosine_ops)
    WITH (lists = 20);
