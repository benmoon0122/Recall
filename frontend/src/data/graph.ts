import type { GraphData } from "../types";

export const graphData: GraphData = {
  nodes: [
    // ── Projects (hubs) ──────────────────────────────────────────────
    { id: "aws-migration", label: "AWS Migration", size: 48, group: "project" },
    { id: "nova-ai", label: "Nova AI Integration", size: 38, group: "project" },
    { id: "api-platform", label: "API Platform", size: 32, group: "project" },
    { id: "data-lake", label: "Data Lake Pipeline", size: 26, group: "project" },
    { id: "container-platform", label: "Container Platform", size: 24, group: "project" },
    { id: "cdn-edge", label: "CDN & Edge", size: 18, group: "project" },
    { id: "security-compliance", label: "Security & Compliance", size: 20, group: "project" },

    // ── Data / Databases ─────────────────────────────────────────────
    { id: "dynamodb", label: "DynamoDB", size: 8, group: "data" },
    { id: "rds-aurora", label: "RDS Aurora", size: 7, group: "data" },
    { id: "s3", label: "S3", size: 9, group: "data" },
    { id: "elasticache", label: "ElastiCache", size: 5, group: "data" },
    { id: "athena", label: "Athena", size: 5, group: "data" },
    { id: "glue", label: "Glue", size: 4, group: "data" },

    // ── Infrastructure ───────────────────────────────────────────────
    { id: "lambda", label: "Lambda", size: 9, group: "infrastructure" },
    { id: "ecs-fargate", label: "ECS/Fargate", size: 7, group: "infrastructure" },
    { id: "cloudfront", label: "CloudFront", size: 6, group: "infrastructure" },
    { id: "api-gateway", label: "API Gateway", size: 8, group: "infrastructure" },
    { id: "eventbridge", label: "EventBridge", size: 5, group: "infrastructure" },
    { id: "step-functions", label: "Step Functions", size: 5, group: "infrastructure" },
    { id: "cdk", label: "CDK", size: 6, group: "infrastructure" },
    { id: "codepipeline", label: "CodePipeline", size: 5, group: "infrastructure" },

    // ── Frontend ─────────────────────────────────────────────────────
    { id: "react", label: "React", size: 7, group: "frontend" },
    { id: "typescript", label: "TypeScript", size: 8, group: "frontend" },
    { id: "nextjs", label: "Next.js", size: 5, group: "frontend" },

    // ── Security ─────────────────────────────────────────────────────
    { id: "cognito", label: "Cognito", size: 6, group: "security" },
    { id: "iam", label: "IAM", size: 5, group: "security" },
    { id: "kms", label: "KMS", size: 4, group: "security" },
    { id: "guardduty", label: "GuardDuty", size: 4, group: "security" },

    // ── DevOps ───────────────────────────────────────────────────────
    { id: "cloudwatch", label: "CloudWatch", size: 6, group: "devops" },
    { id: "sqs-sns", label: "SQS/SNS", size: 5, group: "devops" },
    { id: "docker", label: "Docker", size: 5, group: "devops" },
    { id: "bedrock", label: "Bedrock/Nova", size: 7, group: "devops" },
  ],
  edges: [
    // ── AWS Migration ──────────────────────────────────────────────
    { source: "aws-migration", target: "ecs-fargate", weight: 9 },
    { source: "aws-migration", target: "rds-aurora", weight: 8 },
    { source: "aws-migration", target: "dynamodb", weight: 7 },
    { source: "aws-migration", target: "cdk", weight: 6 },
    { source: "aws-migration", target: "codepipeline", weight: 5 },
    { source: "aws-migration", target: "cloudwatch", weight: 4 },
    { source: "aws-migration", target: "iam", weight: 5 },
    { source: "aws-migration", target: "docker", weight: 6 },

    // ── Nova AI Integration ────────────────────────────────────────
    { source: "nova-ai", target: "bedrock", weight: 10 },
    { source: "nova-ai", target: "lambda", weight: 8 },
    { source: "nova-ai", target: "s3", weight: 7 },
    { source: "nova-ai", target: "step-functions", weight: 6 },
    { source: "nova-ai", target: "dynamodb", weight: 5 },
    { source: "nova-ai", target: "sqs-sns", weight: 4 },
    { source: "nova-ai", target: "cognito", weight: 3 },

    // ── API Platform ───────────────────────────────────────────────
    { source: "api-platform", target: "lambda", weight: 9 },
    { source: "api-platform", target: "api-gateway", weight: 10 },
    { source: "api-platform", target: "dynamodb", weight: 7 },
    { source: "api-platform", target: "cognito", weight: 6 },
    { source: "api-platform", target: "elasticache", weight: 5 },
    { source: "api-platform", target: "typescript", weight: 5 },
    { source: "api-platform", target: "cloudwatch", weight: 4 },
    { source: "api-platform", target: "eventbridge", weight: 4 },

    // ── Data Lake Pipeline ─────────────────────────────────────────
    { source: "data-lake", target: "s3", weight: 10 },
    { source: "data-lake", target: "athena", weight: 9 },
    { source: "data-lake", target: "glue", weight: 8 },
    { source: "data-lake", target: "lambda", weight: 5 },
    { source: "data-lake", target: "eventbridge", weight: 4 },
    { source: "data-lake", target: "kms", weight: 3 },

    // ── Container Platform ─────────────────────────────────────────
    { source: "container-platform", target: "ecs-fargate", weight: 10 },
    { source: "container-platform", target: "docker", weight: 9 },
    { source: "container-platform", target: "codepipeline", weight: 7 },
    { source: "container-platform", target: "cloudwatch", weight: 5 },
    { source: "container-platform", target: "cdk", weight: 6 },
    { source: "container-platform", target: "sqs-sns", weight: 4 },

    // ── CDN & Edge ─────────────────────────────────────────────────
    { source: "cdn-edge", target: "cloudfront", weight: 10 },
    { source: "cdn-edge", target: "lambda", weight: 7 },
    { source: "cdn-edge", target: "s3", weight: 6 },
    { source: "cdn-edge", target: "react", weight: 5 },
    { source: "cdn-edge", target: "nextjs", weight: 5 },

    // ── Security & Compliance ──────────────────────────────────────
    { source: "security-compliance", target: "iam", weight: 9 },
    { source: "security-compliance", target: "kms", weight: 8 },
    { source: "security-compliance", target: "guardduty", weight: 7 },
    { source: "security-compliance", target: "cognito", weight: 6 },
    { source: "security-compliance", target: "cloudwatch", weight: 4 },
    { source: "security-compliance", target: "cdk", weight: 3 },

    // ── Cross-technology connections ──────────────────────────────
    { source: "lambda", target: "api-gateway", weight: 7 },
    { source: "cdk", target: "cloudfront", weight: 4 },
    { source: "sqs-sns", target: "eventbridge", weight: 5 },
    { source: "lambda", target: "dynamodb", weight: 5 },
    { source: "ecs-fargate", target: "docker", weight: 6 },
    { source: "react", target: "typescript", weight: 5 },
    { source: "cognito", target: "iam", weight: 4 },
    { source: "cloudwatch", target: "sqs-sns", weight: 3 },
    { source: "rds-aurora", target: "elasticache", weight: 3 },
    { source: "nextjs", target: "typescript", weight: 4 },
    { source: "step-functions", target: "lambda", weight: 5 },
  ],
};
