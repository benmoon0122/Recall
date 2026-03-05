import type { TopicData } from "../types";

export const topics: TopicData[] = [
  { id: "db-migration", name: "DB Migration", sourceCount: 42, types: ["slack", "gmail", "meeting"], updated: "2h ago" },
  { id: "mobile-app", name: "Mobile App", sourceCount: 31, types: ["slack", "meeting", "code"], updated: "4h ago" },
  { id: "api-gateway", name: "API Gateway", sourceCount: 28, types: ["slack", "gmail", "code"], updated: "1d ago" },
  { id: "design-system", name: "Design System v2", sourceCount: 24, types: ["slack", "meeting"], updated: "1d ago" },
  { id: "observability", name: "Observability Platform", sourceCount: 22, types: ["slack", "gmail", "meeting"], updated: "3d ago" },
  { id: "soc2", name: "SOC 2 Compliance", sourceCount: 19, types: ["gmail", "meeting"], updated: "5d ago" },
  { id: "search-infra", name: "Search Infrastructure", sourceCount: 15, types: ["slack", "code"], updated: "1w ago" },
];
