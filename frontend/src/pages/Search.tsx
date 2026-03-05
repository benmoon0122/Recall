import { useState, useEffect, useMemo } from "react";
import { useSearchParams, useNavigate } from "react-router";
import { SearchResultCard } from "../components/SearchResultCard";
import type { Source, SourceType } from "../types";

const mockResults: Source[] = [
  {
    id: "src_001",
    source_type: "slack",
    title: "Lambda vs ECS cost analysis",
    snippet:
      "Priya Sharma: I ran the numbers — Lambda is 40% cheaper at 2M requests/day with built-in auto-scaling...",
    author: "Priya Sharma",
    channel_or_subject: "#aws-architecture",
    timestamp: "2025-01-15T10:30:00Z",
    score: 0.95,
  },
  {
    id: "src_002",
    source_type: "gmail",
    title: "Payment service: Lambda vs ECS comparison",
    snippet:
      "Full cost breakdown attached. Lambda $2,400/mo vs Fargate $4,100/mo at projected volume...",
    author: "Priya Sharma",
    channel_or_subject: "eng-leads@company.com",
    timestamp: "2025-01-16T11:00:00Z",
    score: 0.91,
  },
  {
    id: "src_003",
    source_type: "meeting",
    title: "AWS Architecture Review",
    snippet:
      "CTO: The cold start numbers look acceptable with SnapStart. Let's go serverless — Lambda plus API Gateway.",
    author: null,
    channel_or_subject: "Architecture Review — Payment Service",
    timestamp: "2025-01-17T14:00:00Z",
    score: 0.88,
  },
  {
    id: "src_004",
    source_type: "slack",
    title: "SnapStart benchmarks",
    snippet:
      "Marcus Chen: Just finished benchmarking Lambda SnapStart — cold starts down from 2.1s to 180ms. P99 at 145ms.",
    author: "Marcus Chen",
    channel_or_subject: "#aws-architecture",
    timestamp: "2025-01-18T15:20:00Z",
    score: 0.85,
  },
  {
    id: "src_005",
    source_type: "gmail",
    title: "Re: Payment service architecture — approved",
    snippet:
      "We're going serverless with Lambda + API Gateway. Marcus will lead the implementation...",
    author: "David Park (CTO)",
    channel_or_subject: "Re: Payment service architecture",
    timestamp: "2025-01-18T09:00:00Z",
    score: 0.82,
  },
  {
    id: "src_006",
    source_type: "slack",
    title: "CDK stack for payment Lambda",
    snippet:
      "Aisha Patel: Here's the CDK stack for the payment service — API Gateway + Lambda + DynamoDB table...",
    author: "Aisha Patel",
    channel_or_subject: "#aws-infrastructure",
    timestamp: "2025-01-20T10:00:00Z",
    score: 0.79,
  },
  {
    id: "src_007",
    source_type: "slack",
    title: "DynamoDB single-table design",
    snippet:
      "Marcus Chen: Using single-table design for the payment records. GSI for status queries, TTL for archival...",
    author: "Marcus Chen",
    channel_or_subject: "#aws-architecture",
    timestamp: "2025-01-22T11:30:00Z",
    score: 0.76,
  },
  {
    id: "src_008",
    source_type: "slack",
    title: "Payment Lambda production metrics",
    snippet:
      "All integration tests green. Payment Lambda processing 50k txns/day. P99 latency 145ms, zero cold start issues.",
    author: "Marcus Chen",
    channel_or_subject: "#aws-architecture",
    timestamp: "2025-01-25T15:30:00Z",
    score: 0.73,
  },
];

const SOURCE_META: Record<string, { icon: string; label: string; color: string }> = {
  slack: { icon: "tag", label: "Slack", color: "text-source-slack" },
  gmail: { icon: "mail", label: "Gmail", color: "text-source-gmail" },
  meeting: { icon: "videocam", label: "Meetings", color: "text-source-meeting" },
};

export function Search() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const query = searchParams.get("q") ?? "";

  const [loading, setLoading] = useState(true);
  const [results, setResults] = useState<Source[]>([]);
  const [activeFilter, setActiveFilter] = useState<SourceType | "all">("all");

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      setResults(mockResults);
      setLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, [query]);

  const counts = useMemo(() => {
    const map: Partial<Record<SourceType, number>> = {};
    for (const r of results) {
      map[r.source_type] = (map[r.source_type] ?? 0) + 1;
    }
    return map;
  }, [results]);

  const filteredResults = useMemo(() => {
    if (activeFilter === "all") return results;
    return results.filter((r) => r.source_type === activeFilter);
  }, [results, activeFilter]);

  const total = results.length;

  const sourceTypes: { label: string; type: SourceType }[] = [
    { label: "Slack", type: "slack" },
    { label: "Gmail", type: "gmail" },
    { label: "Meetings", type: "meeting" },
  ];

  if (loading) {
    return (
      <div className="p-6 space-y-4">
        <p className="text-[14px] text-text-secondary">Searching...</p>
        <div className="flex flex-col gap-3">
          {Array.from({ length: 3 }, (_, i) => (
            <div
              key={i}
              className="bg-white/[0.04] border border-white/[0.06] rounded-xl h-28 animate-pulse"
            />
          ))}
        </div>
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <div className="p-6">
        <p className="text-[14px] text-text-secondary">
          No results found for &apos;{query}&apos;. Try different keywords.
        </p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Results count */}
      <p className="text-[15px] text-text-secondary">
        {total} results for <span className="text-text-primary font-medium">&apos;{query}&apos;</span>
      </p>

      {/* Source filter chips — glass pill style */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => setActiveFilter("all")}
          className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-sm cursor-pointer transition-all ${
            activeFilter === "all"
              ? "bg-white/[0.1] text-text-primary border border-white/[0.12] font-medium"
              : "bg-white/[0.04] border border-white/[0.08] text-text-secondary hover:bg-white/[0.08] hover:border-white/[0.12] hover:text-text-primary"
          }`}
        >
          All ({total})
        </button>
        {sourceTypes.map((st) => {
          const count = counts[st.type];
          if (!count) return null;
          const meta = SOURCE_META[st.type];
          return (
            <button
              key={st.type}
              type="button"
              onClick={() => setActiveFilter(st.type)}
              className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-sm cursor-pointer transition-all ${
                activeFilter === st.type
                  ? "bg-white/[0.1] text-text-primary border border-white/[0.12] font-medium"
                  : "bg-white/[0.04] border border-white/[0.08] text-text-secondary hover:bg-white/[0.08] hover:border-white/[0.12] hover:text-text-primary"
              }`}
            >
              <span className={`material-symbols-outlined text-[14px] ${meta.color}`}>{meta.icon}</span>
              {st.label}
              <span className="text-text-muted">{count}</span>
            </button>
          );
        })}
      </div>

      {/* Result cards — wrapped in glass-card */}
      <div className="space-y-3">
        {filteredResults.map((source) => (
          <div key={source.id} className="glass-card rounded-xl">
            <SearchResultCard
              source={source}
              onClick={() => navigate(`/source/${source.id}`)}
            />
          </div>
        ))}
      </div>

      {/* Ask AI banner */}
      <div
        className="glass-card rounded-xl p-5 cursor-pointer group"
        onClick={() => navigate(`/chat/new?q=${encodeURIComponent(query)}`)}
      >
        <div className="flex items-center gap-3">
          <span className="material-symbols-outlined text-[20px] text-primary">auto_awesome</span>
          <div>
            <p className="text-[14px] text-text-primary font-medium group-hover:text-primary transition-colors">
              Ask Recall AI about this topic
            </p>
            <p className="text-[12px] text-text-muted mt-0.5">
              Get an AI-powered summary with citations from your sources
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
