import type { Citation, TimelineEvent, SourceType } from "../types";

export interface ThreadData {
  id: string;
  keywords: string[];
  query: string;
  citations: Citation[];
  timeline: TimelineEvent[];
  answer: string;
  followUps: string[];
  sourceTags: { type: SourceType; count: number; label: string }[];
  sidebar: {
    entities: { icon: string; iconColor: string; name: string; type: string }[];
    files: { icon: string; name: string }[];
  };
}

export const threads: ThreadData[] = [
  // ── Thread 1: Lambda vs ECS ─────────────────────────────────────────
  {
    id: "lambda-vs-ecs",
    keywords: ["lambda", "ecs", "payment", "serverless", "fargate", "cold start"],
    query: "Why did we choose Lambda over ECS for the payment service?",
    citations: [
      {
        number: 1,
        source_type: "slack",
        title: "Cost analysis: Lambda vs ECS Fargate",
        snippet:
          "After running both workloads in parallel for two weeks, Lambda came in at 40% lower cost for our transaction volume. The per-invocation model maps perfectly to our bursty payment traffic — we're not paying for idle containers during off-peak hours.",
        author: "Priya Sharma",
        timestamp: "Jan 15, 2025",
      },
      {
        number: 2,
        source_type: "meeting",
        title: "Architecture Review — Payment Service Migration",
        snippet:
          "David approved the Lambda approach contingent on SnapStart resolving cold-start latency. Target P99 under 200ms. Marcus will own the implementation with a two-week sprint starting Jan 20.",
        author: "David Park",
        timestamp: "Jan 17, 2025",
      },
      {
        number: 3,
        source_type: "gmail",
        title: "Re: Payment Service Architecture — Final Sign-off",
        snippet:
          "Approved. The cost projections are compelling and SnapStart benchmarks look solid. Let's proceed with Lambda and revisit after 30 days in production. Loop in Aisha for monitoring and alerting setup.",
        author: "David Park",
        timestamp: "Jan 18, 2025",
      },
    ],
    timeline: [
      {
        timestamp: "Jan 15, 2025",
        source_type: "slack",
        title: "Cost analysis shared in #aws-architecture",
        snippet:
          "Priya posted a detailed cost comparison showing Lambda at $1,840/mo vs ECS Fargate at $3,100/mo for projected 50k daily transactions.",
        author: "Priya Sharma",
        channel_or_subject: "#aws-architecture",
      },
      {
        timestamp: "Jan 16, 2025",
        source_type: "slack",
        title: "SnapStart cold-start benchmarks",
        snippet:
          "Marcus shared SnapStart benchmark results: P99 cold start dropped from 3.2s to 145ms with tiered compilation. Java 21 runtime with SnapStart enabled.",
        author: "Marcus Chen",
        channel_or_subject: "#aws-architecture",
      },
      {
        timestamp: "Jan 17, 2025",
        source_type: "meeting",
        title: "Architecture Review — Payment Service",
        snippet:
          "Team unanimously agreed on Lambda. David set a hard P99 target of 200ms. Sprint planning scheduled for Monday.",
        author: null,
        channel_or_subject: "Architecture Review Weekly",
      },
      {
        timestamp: "Jan 18, 2025",
        source_type: "gmail",
        title: "Final sign-off from CTO",
        snippet:
          "David sent formal approval via email with a 30-day production review checkpoint. Monitoring requirements outlined.",
        author: "David Park",
        channel_or_subject: "Re: Payment Service Architecture",
      },
      {
        timestamp: "Jan 25, 2025",
        source_type: "slack",
        title: "Payment Lambda deployed to staging",
        snippet:
          "First staging deployment successful. P99 at 145ms, handling 50k synthetic transactions. Zero errors on the load test run. Proceeding to prod next week.",
        author: "Marcus Chen",
        channel_or_subject: "#deployments",
      },
    ],
    answer:
      "**The decision came down to cost efficiency and cold-start mitigation.**\n\nPriya Sharma ran a two-week parallel workload analysis and found that Lambda was **40% cheaper** than ECS Fargate for our payment traffic patterns [1]. Our transaction volume is bursty — peaks during business hours and near-zero overnight — which made the per-invocation pricing model significantly more cost-effective than paying for always-on containers.\n\n**Cold starts were the main concern, and SnapStart solved it.** Marcus benchmarked Java 21 with SnapStart and brought P99 cold-start latency from 3.2 seconds down to **145ms**, well under David's 200ms threshold [2]. This eliminated the primary argument for ECS.\n\n**CTO David Park approved the approach** with a 30-day production review checkpoint [3]. Marcus led the implementation sprint from Jan 20-25, and the service is now handling **50,000 transactions per day** in production with consistent P99 at 145ms.\n\nThe team also factored in operational simplicity — no cluster management, no capacity planning, and native integration with EventBridge for our async payment workflows.",
    followUps: [
      "What were the SnapStart configuration details?",
      "How does the payment Lambda handle retries and dead-letter queues?",
      "What does the 30-day production review look like?",
    ],
    sourceTags: [
      { type: "slack", count: 8, label: "Slack messages" },
      { type: "meeting", count: 2, label: "Meetings" },
      { type: "gmail", count: 3, label: "Emails" },
    ],
    sidebar: {
      entities: [
        { icon: "bolt", iconColor: "#facc15", name: "Serverless Architecture", type: "Concept" },
        { icon: "people", iconColor: "#60a5fa", name: "AWS Platform Team", type: "Group" },
      ],
      files: [
        { icon: "code", name: "payment-lambda/handler.ts" },
        { icon: "code", name: "infra/cdk/payment-stack.ts" },
      ],
    },
  },

  // ── Thread 2: DynamoDB Single-Table Design ──────────────────────────
  {
    id: "dynamodb-design",
    keywords: ["dynamodb", "single-table", "nosql", "table", "database", "partition"],
    query: "How does our DynamoDB single-table design work?",
    citations: [
      {
        number: 1,
        source_type: "slack",
        title: "Single-table design proposal for payment service",
        snippet:
          "Proposing a single-table design with composite keys: PK = ENTITY#<type>, SK = <id>#<sort>. Three GSIs for access patterns — by customer, by date range, and by status. This keeps all payment data colocated for transactional reads.",
        author: "Marcus Chen",
        timestamp: "Jan 20, 2025",
      },
      {
        number: 2,
        source_type: "meeting",
        title: "Data Modeling Review — DynamoDB Design",
        snippet:
          "Marcus walked through the entity chart. Team raised concerns about GSI fan-out on the status index. Agreed to add a sparse GSI for pending transactions only to limit write amplification.",
        author: null,
        timestamp: "Jan 22, 2025",
      },
      {
        number: 3,
        source_type: "code",
        title: "PR #247: Implement single-table DynamoDB schema",
        snippet:
          "Added DynamoDB table definition with PK/SK, three GSIs (CustomerIndex, DateRangeIndex, StatusIndex). Includes batch write helpers, transaction support, and pagination utilities.",
        author: "Marcus Chen",
        timestamp: "Jan 26, 2025",
      },
    ],
    timeline: [
      {
        timestamp: "Jan 20, 2025",
        source_type: "slack",
        title: "Single-table design proposal shared",
        snippet:
          "Marcus posted the entity relationship diagram and access pattern matrix in #backend-eng. Received immediate feedback from Priya on partition key distribution.",
        author: "Marcus Chen",
        channel_or_subject: "#backend-eng",
      },
      {
        timestamp: "Jan 22, 2025",
        source_type: "meeting",
        title: "Data Modeling Review session",
        snippet:
          "45-minute deep dive on the schema. Debated single-table vs multi-table. Consensus: single-table wins for transactional consistency and reduced round-trips.",
        author: null,
        channel_or_subject: "Data Modeling Review",
      },
      {
        timestamp: "Jan 23, 2025",
        source_type: "slack",
        title: "Benchmark results: 3ms reads at scale",
        snippet:
          "Priya ran load tests against the prototype — consistent 3ms reads at 10k RPS with uniform partition distribution. Write latency at 5ms. No hot partitions detected.",
        author: "Priya Sharma",
        channel_or_subject: "#backend-eng",
      },
      {
        timestamp: "Jan 26, 2025",
        source_type: "code",
        title: "PR #247 merged",
        snippet:
          "Single-table schema implementation merged after two rounds of review. Includes full test coverage for all six access patterns.",
        author: "Marcus Chen",
        channel_or_subject: "payment-service repo",
      },
      {
        timestamp: "Jan 28, 2025",
        source_type: "slack",
        title: "Auto-scaling configured",
        snippet:
          "Aisha set up DynamoDB auto-scaling with target utilization at 70%. Read capacity 100-10,000 RCU, write capacity 50-5,000 WCU. CloudWatch alarms for throttling events.",
        author: "Aisha Patel",
        channel_or_subject: "#aws-infrastructure",
      },
    ],
    answer:
      "**Our DynamoDB single-table design uses composite keys with three GSIs to serve all payment access patterns.**\n\nMarcus Chen designed the schema with a **PK/SK composite key pattern**: `PK = ENTITY#<type>` and `SK = <id>#<sort>` [1]. This colocates related payment data — transactions, line items, and audit logs — in the same partition for efficient transactional reads.\n\n**Three Global Secondary Indexes** handle our query patterns: CustomerIndex (lookup by customer ID), DateRangeIndex (time-range queries for reporting), and a sparse StatusIndex for pending transactions only [2]. The sparse GSI was a key optimization to avoid write amplification on high-cardinality status updates.\n\n**Performance benchmarks are strong.** Priya's load tests showed consistent **3ms read latency at 10,000 RPS** with uniform partition distribution. Write latency sits at 5ms with no hot partitions detected.\n\nThe implementation in **PR #247** includes batch write helpers, DynamoDB transaction support, and cursor-based pagination utilities [3]. Aisha configured auto-scaling with target utilization at 70%, scaling read capacity from 100 to 10,000 RCUs based on demand.",
    followUps: [
      "What are the six access patterns the schema supports?",
      "How do we handle DynamoDB migrations and schema evolution?",
      "What's the backup and point-in-time recovery strategy?",
    ],
    sourceTags: [
      { type: "slack", count: 6, label: "Slack messages" },
      { type: "meeting", count: 1, label: "Meetings" },
      { type: "code", count: 2, label: "Code changes" },
    ],
    sidebar: {
      entities: [
        { icon: "storage", iconColor: "#fb923c", name: "Data Modeling", type: "Concept" },
        { icon: "people", iconColor: "#4ade80", name: "Backend Team", type: "Group" },
      ],
      files: [
        { icon: "code", name: "payment-lambda/src/db.ts" },
        { icon: "code", name: "infra/cdk/dynamodb-stack.ts" },
      ],
    },
  },

  // ── Thread 3: Nova AI / Bedrock Integration ─────────────────────────
  {
    id: "nova-bedrock",
    keywords: ["nova", "bedrock", "ai", "embedding", "llm", "machine learning", "rag"],
    query: "What's our Amazon Nova integration architecture?",
    citations: [
      {
        number: 1,
        source_type: "slack",
        title: "Bedrock RAG pipeline architecture proposal",
        snippet:
          "Here's the proposed pipeline: S3 upload triggers Lambda, which chunks documents and calls Bedrock with Nova Embed for vector embeddings. Stored in OpenSearch Serverless with HNSW indexing. Query path uses Nova Pro for generation with retrieved context.",
        author: "Ryan Torres",
        timestamp: "Feb 1, 2025",
      },
      {
        number: 2,
        source_type: "meeting",
        title: "AI/ML Architecture Review — Bedrock Integration",
        snippet:
          "Ryan presented the RAG pipeline. Team discussed model selection — Nova Pro vs Claude for generation. Decision: Nova Pro for cost-sensitive workloads (80% of queries), Claude for complex reasoning tasks. Hybrid routing based on query complexity scoring.",
        author: null,
        timestamp: "Feb 5, 2025",
      },
      {
        number: 3,
        source_type: "gmail",
        title: "Bedrock Integration — Architecture Document v2",
        snippet:
          "Attached is the updated architecture doc with the hybrid model routing strategy. Nova Embed dimensions set to 1024 for optimal recall/performance balance. Estimated cost: $0.0004 per query at current volume. Knowledge base sync runs every 6 hours.",
        author: "Ryan Torres",
        timestamp: "Feb 8, 2025",
      },
    ],
    timeline: [
      {
        timestamp: "Feb 1, 2025",
        source_type: "slack",
        title: "RAG pipeline proposal shared in #ml-platform",
        snippet:
          "Ryan posted the initial architecture diagram showing the S3 → Lambda → Bedrock document processing pipeline with Nova Embed for vectorization.",
        author: "Ryan Torres",
        channel_or_subject: "#ml-platform",
      },
      {
        timestamp: "Feb 3, 2025",
        source_type: "slack",
        title: "Embedding model benchmark results",
        snippet:
          "Compared Nova Embed vs Titan Embed vs Cohere. Nova Embed won on latency (12ms avg) and cost. Recall@10 at 94.2% on our internal test set with 1024 dimensions.",
        author: "Ryan Torres",
        channel_or_subject: "#ml-platform",
      },
      {
        timestamp: "Feb 5, 2025",
        source_type: "meeting",
        title: "AI/ML Architecture Review",
        snippet:
          "Team approved hybrid model routing: Nova Pro for 80% of queries, Claude for complex reasoning. Query complexity classifier uses a lightweight logistic regression model.",
        author: null,
        channel_or_subject: "AI/ML Architecture Review",
      },
      {
        timestamp: "Feb 8, 2025",
        source_type: "gmail",
        title: "Architecture doc v2 distributed",
        snippet:
          "Ryan sent the finalized architecture document to all stakeholders. Includes cost projections, latency SLAs, and the knowledge base sync schedule.",
        author: "Ryan Torres",
        channel_or_subject: "Bedrock Integration — Architecture Document v2",
      },
      {
        timestamp: "Feb 12, 2025",
        source_type: "slack",
        title: "RAG pipeline deployed to staging",
        snippet:
          "Pipeline live in staging. End-to-end query latency at 1.8s (embed 12ms, retrieve 45ms, generate 1.7s). Knowledge base indexed 14k documents from S3. Accuracy looking good on eval set.",
        author: "Ryan Torres",
        channel_or_subject: "#ml-platform",
      },
    ],
    answer:
      "**Our Amazon Nova integration uses a RAG pipeline built on Bedrock with hybrid model routing.**\n\nRyan Torres designed the document processing pipeline: **S3 uploads trigger a Lambda function** that chunks documents and generates vector embeddings using **Nova Embed** (1024 dimensions). Vectors are stored in OpenSearch Serverless with HNSW indexing for fast approximate nearest-neighbor search [1].\n\n**The query path uses a hybrid model strategy.** A lightweight complexity classifier routes 80% of queries to **Nova Pro** for cost-efficient generation, while complex reasoning tasks go to Claude [2]. This keeps per-query cost at approximately **$0.0004** while maintaining quality for harder questions.\n\n**Embedding benchmarks drove the model choice.** Ryan compared Nova Embed against Titan Embed and Cohere — Nova won on latency (12ms average) and achieved 94.2% Recall@10 on our internal test set. The knowledge base syncs from S3 every 6 hours and currently indexes **14,000 documents** [3].\n\nEnd-to-end query latency in staging is **1.8 seconds** — 12ms for embedding, 45ms for retrieval, and 1.7s for generation. The pipeline runs entirely serverless with no provisioned infrastructure.",
    followUps: [
      "How does the query complexity classifier work?",
      "What's the document chunking strategy for the knowledge base?",
      "How do we evaluate RAG accuracy over time?",
    ],
    sourceTags: [
      { type: "slack", count: 7, label: "Slack messages" },
      { type: "meeting", count: 1, label: "Meetings" },
      { type: "gmail", count: 2, label: "Emails" },
    ],
    sidebar: {
      entities: [
        { icon: "psychology", iconColor: "#c084fc", name: "AI/ML Pipeline", type: "Concept" },
        { icon: "people", iconColor: "#f472b6", name: "ML Platform Team", type: "Group" },
      ],
      files: [
        { icon: "code", name: "ml-pipeline/src/embeddings.py" },
        { icon: "code", name: "infra/cdk/bedrock-stack.ts" },
      ],
    },
  },

  // ── Thread 4: CDK Infrastructure Pipeline ───────────────────────────
  {
    id: "cdk-pipeline",
    keywords: ["cdk", "infrastructure", "pipeline", "deployment", "iac", "cloudformation", "ci/cd"],
    query: "How did we set up the CDK deployment pipeline?",
    citations: [
      {
        number: 1,
        source_type: "slack",
        title: "CDK Pipelines migration plan",
        snippet:
          "Proposing we migrate from Terraform to CDK Pipelines. Three stages: Dev (auto-deploy on merge), Staging (integration tests gate), Prod (manual approval + canary). CodePipeline orchestrates, CodeBuild for synth and deploy. Drift detection via CloudFormation hooks.",
        author: "Aisha Patel",
        timestamp: "Dec 10, 2024",
      },
      {
        number: 2,
        source_type: "meeting",
        title: "Infrastructure Review — CDK Pipeline Proposal",
        snippet:
          "Aisha presented the three-stage pipeline. Team agreed on the approval gate strategy. David asked for rollback automation — Aisha will add CloudWatch alarm-triggered rollback in the prod stage. Migration timeline: 2 weeks.",
        author: null,
        timestamp: "Dec 12, 2024",
      },
      {
        number: 3,
        source_type: "gmail",
        title: "Terraform to CDK Migration Plan — Final",
        snippet:
          "Attached is the migration checklist. 23 Terraform resources mapped to CDK constructs. Import strategy: use cdk import for stateful resources (DynamoDB, S3), recreate stateless resources. Zero-downtime migration with parallel stacks during transition.",
        author: "Aisha Patel",
        timestamp: "Dec 14, 2024",
      },
    ],
    timeline: [
      {
        timestamp: "Dec 10, 2024",
        source_type: "slack",
        title: "CDK migration plan posted in #aws-infrastructure",
        snippet:
          "Aisha shared the migration RFC with architecture diagrams for the three-stage pipeline. Immediate positive feedback from Marcus on the self-mutating pipeline pattern.",
        author: "Aisha Patel",
        channel_or_subject: "#aws-infrastructure",
      },
      {
        timestamp: "Dec 12, 2024",
        source_type: "meeting",
        title: "Infrastructure Review meeting",
        snippet:
          "Full team review of the CDK pipeline. Approved with the addition of CloudWatch alarm-triggered rollback. David emphasized the need for drift detection.",
        author: null,
        channel_or_subject: "Infrastructure Review Weekly",
      },
      {
        timestamp: "Dec 14, 2024",
        source_type: "gmail",
        title: "Migration plan distributed",
        snippet:
          "Aisha sent the finalized migration checklist to all team leads. 23 resources to migrate, estimated 2-week timeline with a parallel stack approach.",
        author: "Aisha Patel",
        channel_or_subject: "Terraform to CDK Migration Plan",
      },
      {
        timestamp: "Dec 18, 2024",
        source_type: "slack",
        title: "Pipeline deployed to dev account",
        snippet:
          "Self-mutating CDK pipeline running in dev. First successful deploy: synth in 45s, deploy in 2m 10s. Drift detection hook catching test mutations correctly.",
        author: "Aisha Patel",
        channel_or_subject: "#aws-infrastructure",
      },
      {
        timestamp: "Dec 22, 2024",
        source_type: "slack",
        title: "Full pipeline live across all environments",
        snippet:
          "Migration complete. All three stages operational. Deployment failures down 70% compared to the Terraform setup. Average deploy time: Dev 3m, Staging 8m (with tests), Prod 12m (with approval).",
        author: "Aisha Patel",
        channel_or_subject: "#deployments",
      },
    ],
    answer:
      "**We migrated from Terraform to a three-stage CDK Pipelines setup with self-mutation and automated rollback.**\n\nAisha Patel designed the pipeline with three stages: **Dev** (auto-deploy on every merge to main), **Staging** (gated by integration test suite), and **Prod** (manual approval plus canary deployment) [1]. The pipeline is self-mutating — changes to the pipeline definition itself are applied automatically on the next run.\n\n**CodePipeline orchestrates the flow** with CodeBuild handling CDK synthesis and deployment. CloudFormation drift detection runs as a post-deploy hook, catching any manual changes to infrastructure. David requested **CloudWatch alarm-triggered rollback** in the prod stage, which automatically reverts if error rates spike within 10 minutes of deployment [2].\n\n**The Terraform migration** mapped 23 resources to CDK constructs. Stateful resources (DynamoDB tables, S3 buckets) were imported via `cdk import`, while stateless resources were recreated with parallel stacks for zero downtime [3].\n\nResults have been strong: **70% fewer deployment failures**, and average deploy times of 3 minutes (Dev), 8 minutes (Staging), and 12 minutes (Prod including approval gate).",
    followUps: [
      "How does the CloudWatch alarm-triggered rollback work?",
      "What integration tests run in the staging gate?",
      "How do we handle CDK construct library updates?",
    ],
    sourceTags: [
      { type: "slack", count: 9, label: "Slack messages" },
      { type: "meeting", count: 1, label: "Meetings" },
      { type: "gmail", count: 2, label: "Emails" },
    ],
    sidebar: {
      entities: [
        { icon: "layers", iconColor: "#22d3ee", name: "Infrastructure as Code", type: "Concept" },
        { icon: "people", iconColor: "#f87171", name: "DevOps Team", type: "Group" },
      ],
      files: [
        { icon: "code", name: "infra/cdk/pipeline-stack.ts" },
        { icon: "code", name: "infra/cdk/app.ts" },
      ],
    },
  },

  // ── Thread 5: S3 Data Lake ──────────────────────────────────────────
  {
    id: "s3-data-lake",
    keywords: ["s3", "data lake", "athena", "glue", "analytics", "parquet", "etl"],
    query: "What's the architecture for our S3 data lake?",
    citations: [
      {
        number: 1,
        source_type: "slack",
        title: "S3 data lake architecture proposal",
        snippet:
          "Three-tier S3 layout: Raw (JSON/CSV landing zone), Processed (Glue ETL to Parquet, partitioned by date), Analytics (aggregated datasets for dashboards). Glue crawlers auto-discover schemas. Athena for ad-hoc queries over Processed and Analytics tiers.",
        author: "Priya Sharma",
        timestamp: "Nov 15, 2024",
      },
      {
        number: 2,
        source_type: "meeting",
        title: "Data Platform Review — S3 Data Lake",
        snippet:
          "Priya presented the three-tier architecture. Team discussed partitioning strategy — agreed on year/month/day for time-series data and entity-type partitioning for reference data. Ryan requested a dedicated ML feature store prefix in the Analytics tier.",
        author: null,
        timestamp: "Nov 18, 2024",
      },
      {
        number: 3,
        source_type: "gmail",
        title: "Data Lake Cost Analysis — Redshift vs S3+Athena",
        snippet:
          "Final cost comparison: Current Redshift cluster at $4,200/mo. Projected S3 + Glue + Athena cost: $630/mo for equivalent workloads. That's an 85% reduction. Athena query costs scale with data scanned, and Parquet columnar format minimizes scan volume.",
        author: "Priya Sharma",
        timestamp: "Nov 20, 2024",
      },
    ],
    timeline: [
      {
        timestamp: "Nov 15, 2024",
        source_type: "slack",
        title: "Data lake proposal shared in #data-platform",
        snippet:
          "Priya posted the three-tier S3 architecture with detailed bucket naming conventions, lifecycle policies, and IAM access patterns.",
        author: "Priya Sharma",
        channel_or_subject: "#data-platform",
      },
      {
        timestamp: "Nov 18, 2024",
        source_type: "meeting",
        title: "Data Platform Review meeting",
        snippet:
          "Full team review of the data lake design. Approved with additions: ML feature store prefix and cross-account access via Lake Formation.",
        author: null,
        channel_or_subject: "Data Platform Review",
      },
      {
        timestamp: "Nov 20, 2024",
        source_type: "gmail",
        title: "Cost analysis distributed to leadership",
        snippet:
          "Priya sent the Redshift vs S3+Athena cost comparison to David and the finance team. 85% cost reduction projection received immediate approval.",
        author: "Priya Sharma",
        channel_or_subject: "Data Lake Cost Analysis",
      },
      {
        timestamp: "Nov 28, 2024",
        source_type: "slack",
        title: "Glue ETL jobs deployed",
        snippet:
          "First ETL pipeline running: Raw JSON to Parquet conversion with schema validation. Processing 2.3M records/day. Average job duration: 4 minutes. Data available in Athena within 15 minutes of ingestion.",
        author: "Priya Sharma",
        channel_or_subject: "#data-platform",
      },
      {
        timestamp: "Dec 5, 2024",
        source_type: "slack",
        title: "Redshift decommission complete",
        snippet:
          "Old Redshift cluster terminated. All 47 analytics queries migrated to Athena. Dashboard latency comparable — P50 at 2.1s for complex aggregations. Monthly savings confirmed at $3,570.",
        author: "Priya Sharma",
        channel_or_subject: "#data-platform",
      },
    ],
    answer:
      "**Our S3 data lake follows a three-tier architecture with Glue ETL and Athena for serverless analytics.**\n\nPriya Sharma designed the layout with three S3 tiers: **Raw** (JSON/CSV landing zone from upstream sources), **Processed** (Glue ETL transforms to Parquet with date partitioning), and **Analytics** (pre-aggregated datasets for dashboards and an ML feature store prefix) [1]. Glue crawlers automatically discover schemas and update the Data Catalog.\n\n**Partitioning follows two strategies**: year/month/day for time-series data and entity-type partitioning for reference data. Ryan's ML team got a dedicated feature store prefix in the Analytics tier for training pipelines [2].\n\n**The cost impact has been dramatic.** Migrating from Redshift ($4,200/mo) to S3 + Glue + Athena ($630/mo) delivered an **85% cost reduction** [3]. Parquet columnar format minimizes the data Athena scans per query, keeping per-query costs low.\n\nThe Glue ETL pipeline processes **2.3 million records per day** with an average job duration of 4 minutes. Data is queryable in Athena within 15 minutes of ingestion. All 47 legacy Redshift queries have been migrated with comparable dashboard latency.",
    followUps: [
      "How do the Glue ETL jobs handle schema evolution?",
      "What Lake Formation permissions are configured for cross-account access?",
      "How does the ML feature store integrate with SageMaker?",
    ],
    sourceTags: [
      { type: "slack", count: 7, label: "Slack messages" },
      { type: "meeting", count: 1, label: "Meetings" },
      { type: "gmail", count: 2, label: "Emails" },
    ],
    sidebar: {
      entities: [
        { icon: "database", iconColor: "#34d399", name: "Data Architecture", type: "Concept" },
        { icon: "people", iconColor: "#fbbf24", name: "Data Platform Team", type: "Group" },
      ],
      files: [
        { icon: "code", name: "data-lake/glue/etl-job.py" },
        { icon: "code", name: "infra/cdk/data-lake-stack.ts" },
      ],
    },
  },

  // ── Thread 6: Cognito Authentication ────────────────────────────────
  {
    id: "cognito-auth",
    keywords: ["cognito", "auth", "authentication", "identity", "oauth", "sso", "login", "jwt"],
    query: "How does our Cognito authentication flow work?",
    citations: [
      {
        number: 1,
        source_type: "slack",
        title: "Cognito auth architecture — OAuth 2.0 + PKCE",
        snippet:
          "Auth flow: OAuth 2.0 Authorization Code with PKCE (no client secret in the browser). Cognito User Pool handles registration/login, Identity Pool for AWS credential vending. Social providers: Google and GitHub via OIDC federation. Custom post-auth Lambda trigger for role mapping.",
        author: "Marcus Chen",
        timestamp: "Jan 5, 2025",
      },
      {
        number: 2,
        source_type: "code",
        title: "PR #198: Implement Cognito auth with PKCE flow",
        snippet:
          "Added CognitoStack with User Pool, Identity Pool, and App Client (PKCE-only). Post-authentication Lambda trigger enriches JWT claims with team/role data from DynamoDB. API Gateway JWT authorizer validates tokens with zero cold-start overhead.",
        author: "Marcus Chen",
        timestamp: "Jan 10, 2025",
      },
      {
        number: 3,
        source_type: "gmail",
        title: "SOC 2 Security Audit — Authentication Review",
        snippet:
          "Auth implementation passes SOC 2 requirements. MFA enforcement via Cognito (TOTP + SMS), token rotation on refresh, and session duration capped at 1 hour. One finding: add IP-based rate limiting on the login endpoint. Remediation due by Feb 1.",
        author: "Priya Sharma",
        timestamp: "Jan 14, 2025",
      },
    ],
    timeline: [
      {
        timestamp: "Jan 5, 2025",
        source_type: "slack",
        title: "Auth architecture shared in #security",
        snippet:
          "Marcus posted the Cognito auth flow diagram with PKCE, social login providers, and the JWT claim enrichment strategy via Lambda triggers.",
        author: "Marcus Chen",
        channel_or_subject: "#security",
      },
      {
        timestamp: "Jan 7, 2025",
        source_type: "slack",
        title: "Social login integration tested",
        snippet:
          "Google and GitHub OIDC federation working in dev. Attribute mapping pulls email, name, and profile picture. Identity Pool maps federated identities to IAM roles based on group membership.",
        author: "Marcus Chen",
        channel_or_subject: "#security",
      },
      {
        timestamp: "Jan 10, 2025",
        source_type: "code",
        title: "PR #198 merged",
        snippet:
          "Full Cognito stack merged: User Pool with MFA, Identity Pool, PKCE app client, post-auth Lambda, and API Gateway JWT authorizer. Includes integration tests for all auth flows.",
        author: "Marcus Chen",
        channel_or_subject: "auth-service repo",
      },
      {
        timestamp: "Jan 12, 2025",
        source_type: "meeting",
        title: "Security review — Auth implementation",
        snippet:
          "Security team reviewed the Cognito implementation. Approved with minor findings: add WAF rate limiting on auth endpoints and ensure refresh token rotation is enabled.",
        author: null,
        channel_or_subject: "Security Review Weekly",
      },
      {
        timestamp: "Jan 15, 2025",
        source_type: "gmail",
        title: "SOC 2 audit results received",
        snippet:
          "External auditor confirmed compliance. One remediation item: IP-based rate limiting on login. Aisha will add WAF rules by Feb 1 deadline.",
        author: "Priya Sharma",
        channel_or_subject: "SOC 2 Security Audit — Authentication Review",
      },
    ],
    answer:
      "**Our authentication uses Cognito with OAuth 2.0 Authorization Code + PKCE for secure browser-based auth.**\n\nMarcus Chen implemented the flow with a **Cognito User Pool** for registration and login, and an **Identity Pool** for vending temporary AWS credentials [1]. The app client is PKCE-only — no client secret stored in the browser. Social login supports **Google and GitHub** via OIDC federation, with attribute mapping for email, name, and profile picture.\n\n**A custom post-authentication Lambda trigger** enriches JWT claims with team and role data from DynamoDB. The API Gateway validates JWTs using a native authorizer with zero cold-start overhead [2]. This means every API call carries the user's permissions without a separate authorization lookup.\n\n**Security posture is SOC 2 compliant.** MFA is enforced via TOTP and SMS, tokens rotate on refresh, and session duration is capped at **1 hour** [3]. The external audit had one finding — IP-based rate limiting on login — which Aisha is remediating with WAF rules.\n\nThe Identity Pool maps federated identities to IAM roles based on Cognito group membership, enabling fine-grained access control to AWS resources per team.",
    followUps: [
      "How does the post-auth Lambda enrich JWT claims?",
      "What IAM roles map to which Cognito groups?",
      "How is the WAF rate limiting configured for auth endpoints?",
    ],
    sourceTags: [
      { type: "slack", count: 5, label: "Slack messages" },
      { type: "code", count: 2, label: "Code changes" },
      { type: "gmail", count: 2, label: "Emails" },
      { type: "meeting", count: 1, label: "Meetings" },
    ],
    sidebar: {
      entities: [
        { icon: "shield", iconColor: "#60a5fa", name: "Identity & Access", type: "Concept" },
        { icon: "people", iconColor: "#a78bfa", name: "Security Team", type: "Group" },
      ],
      files: [
        { icon: "code", name: "auth-service/src/cognito.ts" },
        { icon: "code", name: "infra/cdk/auth-stack.ts" },
      ],
    },
  },

  // ── Thread 7: CloudFront CDN Strategy ───────────────────────────────
  {
    id: "cloudfront-cdn",
    keywords: ["cloudfront", "cdn", "edge", "caching", "lambda@edge", "cache", "latency", "static"],
    query: "What's our CloudFront caching strategy?",
    citations: [
      {
        number: 1,
        source_type: "slack",
        title: "CloudFront multi-origin setup with Lambda@Edge",
        snippet:
          "Proposed architecture: CloudFront with two origins — S3 for static assets (immutable cache, 1 year TTL) and ALB for API (no-cache or short TTL per endpoint). Lambda@Edge handles dynamic routing: URL rewriting for SPA, A/B testing headers, and geo-based content selection.",
        author: "Aisha Patel",
        timestamp: "Dec 1, 2024",
      },
      {
        number: 2,
        source_type: "meeting",
        title: "Performance Review — CDN Strategy",
        snippet:
          "Aisha presented cache hit ratio metrics from the staging rollout: 92% overall, 99.8% for static assets, 78% for API responses with short TTLs. P50 latency dropped from 340ms to 45ms globally. Team approved the production rollout.",
        author: null,
        timestamp: "Dec 8, 2024",
      },
      {
        number: 3,
        source_type: "gmail",
        title: "CDN Performance Metrics — Week 1 Production Report",
        snippet:
          "First week in production: 92.3% cache hit ratio sustained, P50 at 45ms (down from 340ms), P99 at 120ms. Bandwidth costs reduced 60% due to compression and cache offload. Lambda@Edge execution adds < 5ms overhead. Zero origin errors during the 3am traffic spike on Tuesday.",
        author: "Aisha Patel",
        timestamp: "Dec 15, 2024",
      },
    ],
    timeline: [
      {
        timestamp: "Dec 1, 2024",
        source_type: "slack",
        title: "CDN architecture proposal in #aws-infrastructure",
        snippet:
          "Aisha shared the multi-origin CloudFront design with Lambda@Edge for dynamic routing, cache policies per content type, and compression settings.",
        author: "Aisha Patel",
        channel_or_subject: "#aws-infrastructure",
      },
      {
        timestamp: "Dec 4, 2024",
        source_type: "slack",
        title: "Cache policy configuration details",
        snippet:
          "Three cache policies defined: StaticAssets (1y TTL, immutable), APIResponses (60s TTL, vary by auth header), HTMLPages (5m TTL, stale-while-revalidate). Brotli compression enabled for text/* and application/json.",
        author: "Aisha Patel",
        channel_or_subject: "#aws-infrastructure",
      },
      {
        timestamp: "Dec 6, 2024",
        source_type: "code",
        title: "Lambda@Edge router deployed to staging",
        snippet:
          "Lambda@Edge function handles SPA fallback routing, A/B test header injection, and geographic routing for region-specific content. Execution time under 5ms at P99.",
        author: "Aisha Patel",
        channel_or_subject: "infra repo",
      },
      {
        timestamp: "Dec 8, 2024",
        source_type: "meeting",
        title: "Performance Review meeting",
        snippet:
          "Staging metrics exceeded targets: 92% cache hit ratio, P50 at 45ms. Team approved immediate production rollout. David highlighted the bandwidth cost savings.",
        author: null,
        channel_or_subject: "Performance Review Weekly",
      },
      {
        timestamp: "Dec 15, 2024",
        source_type: "gmail",
        title: "Week 1 production metrics report",
        snippet:
          "Aisha distributed the first production performance report. All metrics sustained or improved from staging. Bandwidth costs down 60%. Zero downtime incidents.",
        author: "Aisha Patel",
        channel_or_subject: "CDN Performance Metrics Report",
      },
    ],
    answer:
      "**Our CloudFront strategy uses a multi-origin setup with Lambda@Edge for dynamic routing and content-type-specific cache policies.**\n\nAisha Patel designed the architecture with **two origins**: S3 for static assets (immutable cache, 1-year TTL) and ALB for API responses (short TTLs varying by endpoint) [1]. Lambda@Edge handles SPA URL rewriting, A/B testing header injection, and geo-based content selection — all with under 5ms execution overhead.\n\n**Three cache policies optimize for different content types**: StaticAssets (1-year TTL, immutable), APIResponses (60-second TTL, vary by authorization header), and HTMLPages (5-minute TTL with stale-while-revalidate). Brotli compression is enabled for text and JSON content.\n\n**Performance improvements have been dramatic.** The **92% cache hit ratio** (99.8% for static assets) dropped P50 latency from **340ms to 45ms** globally [2]. Bandwidth costs fell **60%** due to edge caching and compression [3]. P99 sits at 120ms.\n\nThe CDN handled a 3am traffic spike in the first production week with zero origin errors, confirming the architecture's resilience under load.",
    followUps: [
      "How does the A/B testing header injection work at the edge?",
      "What's the cache invalidation strategy for deployments?",
      "How do we monitor cache hit ratios per path pattern?",
    ],
    sourceTags: [
      { type: "slack", count: 6, label: "Slack messages" },
      { type: "meeting", count: 1, label: "Meetings" },
      { type: "gmail", count: 2, label: "Emails" },
      { type: "code", count: 1, label: "Code changes" },
    ],
    sidebar: {
      entities: [
        { icon: "public", iconColor: "#2dd4bf", name: "Edge Computing", type: "Concept" },
        { icon: "people", iconColor: "#38bdf8", name: "Platform Team", type: "Group" },
      ],
      files: [
        { icon: "code", name: "edge/lambda-at-edge/router.ts" },
        { icon: "code", name: "infra/cdk/cdn-stack.ts" },
      ],
    },
  },
];

export function findThread(query: string): ThreadData | null {
  const q = query.toLowerCase();
  let best: ThreadData | null = null;
  let bestScore = 0;
  for (const thread of threads) {
    const score = thread.keywords.filter((kw) => q.includes(kw)).length;
    if (score > bestScore) {
      bestScore = score;
      best = thread;
    }
  }
  return best;
}
