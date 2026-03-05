import type { TopicData } from "../types";

export const topics: TopicData[] = [
  { id: "engineering", name: "Engineering", sourceCount: 34, types: ["slack", "gmail", "meeting"], updated: "2h ago" },
  { id: "infra", name: "Infrastructure", sourceCount: 18, types: ["slack", "gmail"], updated: "1d ago" },
  { id: "product", name: "Product", sourceCount: 12, types: ["slack", "meeting"], updated: "3d ago" },
  { id: "db-migration", name: "Database Migration", sourceCount: 11, types: ["slack", "gmail", "meeting"], updated: "5d ago" },
  { id: "security", name: "Security", sourceCount: 8, types: ["slack"], updated: "1w ago" },
  { id: "frontend", name: "Frontend", sourceCount: 6, types: ["slack", "meeting"], updated: "2w ago" },
];
