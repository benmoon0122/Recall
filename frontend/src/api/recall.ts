import type { SearchResponse, QueryResponse, TimelineResponse } from "../types";

const BASE = "/api";

export async function search(query: string, sourceTypes?: string[]): Promise<SearchResponse> {
  const res = await fetch(`${BASE}/search`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query, source_types: sourceTypes, limit: 20 }),
  });
  return res.json();
}

export async function queryAI(query: string, sourceTypes?: string[]): Promise<QueryResponse> {
  const res = await fetch(`${BASE}/query`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query, source_types: sourceTypes }),
  });
  return res.json();
}

export async function getTimeline(query: string): Promise<TimelineResponse> {
  const res = await fetch(`${BASE}/timeline?query=${encodeURIComponent(query)}`);
  return res.json();
}
