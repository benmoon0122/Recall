import type { GraphData } from "../types";

export const graphData: GraphData = {
  nodes: [
    { id: "engineering", label: "Engineering", size: 34 },
    { id: "infra", label: "Infrastructure", size: 18 },
    { id: "product", label: "Product", size: 12 },
    { id: "db-migration", label: "Database Migration", size: 11 },
    { id: "security", label: "Security", size: 8 },
    { id: "frontend", label: "Frontend", size: 6 },
  ],
  edges: [
    { source: "engineering", target: "infra", weight: 12 },
    { source: "engineering", target: "db-migration", weight: 9 },
    { source: "engineering", target: "product", weight: 5 },
    { source: "infra", target: "db-migration", weight: 7 },
    { source: "product", target: "db-migration", weight: 3 },
    { source: "product", target: "frontend", weight: 4 },
    { source: "frontend", target: "security", weight: 2 },
    { source: "engineering", target: "security", weight: 3 },
  ],
};
