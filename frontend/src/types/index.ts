export type SourceType = "slack" | "gmail" | "meeting" | "code";

export interface Source {
  id: string;
  source_type: SourceType;
  title: string;
  snippet: string;
  author: string | null;
  channel_or_subject: string;
  timestamp: string;
  score?: number;
}

export interface Citation {
  number: number;
  source_type: SourceType;
  title: string;
  snippet: string;
  author: string | null;
  timestamp: string;
}

export interface SearchResponse {
  results: Source[];
  total: number;
  counts: Partial<Record<SourceType, number>>;
}

export interface QueryResponse {
  answer: string;
  citations: Citation[];
  sources_searched: Partial<Record<SourceType, number>>;
}

export interface TimelineEvent {
  timestamp: string;
  source_type: SourceType;
  title: string;
  snippet: string;
  author: string | null;
  channel_or_subject: string;
}

export interface TimelineResponse {
  events: TimelineEvent[];
}

export interface TopicData {
  id: string;
  name: string;
  sourceCount: number;
  types: SourceType[];
  updated: string;
}

export type NodeGroup = "project" | "data" | "infrastructure" | "frontend" | "security" | "devops";

export interface GraphNode {
  id: string;
  label: string;
  size: number;
  group: NodeGroup;
}

export interface GraphEdge {
  source: string;
  target: string;
  weight: number;
}

export interface GraphData {
  nodes: GraphNode[];
  edges: GraphEdge[];
}
