import { useState, useEffect, useMemo } from "react";
import { useSearchParams, useNavigate } from "react-router";
import { SearchResultCard } from "../components/SearchResultCard";
import type { Source, SourceType } from "../types";

const mockResults: Source[] = [
  {
    id: "src_001",
    source_type: "slack",
    title: "Rate limiting discussion",
    snippet:
      "Been running load tests on DynamoDB and the costs are getting crazy at our scale...",
    author: "Sarah Chen",
    channel_or_subject: "#backend",
    timestamp: "2024-02-03T09:15:00Z",
    score: 0.92,
  },
  {
    id: "src_002",
    source_type: "gmail",
    title: "Database evaluation: Postgres vs DynamoDB",
    snippet:
      "Detailed comparison doc with cost analysis, benchmark results, migration plan...",
    author: "Sarah Chen",
    channel_or_subject: "engineering-leads@company.com",
    timestamp: "2024-02-04T10:00:00Z",
    score: 0.89,
  },
  {
    id: "src_003",
    source_type: "meeting",
    title: "Architecture Review",
    snippet:
      "CTO: OK I'm convinced. Let's go with Postgres. Jordan, can you lead the migration?",
    author: null,
    channel_or_subject: "Architecture Review - Database Migration",
    timestamp: "2024-02-05T14:00:00Z",
    score: 0.85,
  },
  {
    id: "src_004",
    source_type: "slack",
    title: "Migration timeline",
    snippet:
      "Jordan Lee: I've drafted the migration plan. We can start next sprint...",
    author: "Jordan Lee",
    channel_or_subject: "#backend",
    timestamp: "2024-02-06T11:30:00Z",
    score: 0.82,
  },
  {
    id: "src_005",
    source_type: "gmail",
    title: "Re: Database decision - confirmed",
    snippet:
      "After the architecture review, we're going with Postgres. Jordan will lead...",
    author: "David Park (CTO)",
    channel_or_subject: "Re: Database decision",
    timestamp: "2024-02-06T09:00:00Z",
    score: 0.8,
  },
  {
    id: "src_006",
    source_type: "slack",
    title: "Postgres benchmarks",
    snippet:
      "Just finished the benchmark suite. Postgres is 3x faster for our join-heavy queries...",
    author: "Sarah Chen",
    channel_or_subject: "#backend",
    timestamp: "2024-02-07T15:20:00Z",
    score: 0.78,
  },
  {
    id: "src_007",
    source_type: "slack",
    title: "Schema design discussion",
    snippet:
      "Here's my proposed schema for the billing tables. Using JSONB for flexible metadata...",
    author: "Jordan Lee",
    channel_or_subject: "#backend",
    timestamp: "2024-02-08T10:00:00Z",
    score: 0.75,
  },
  {
    id: "src_008",
    source_type: "slack",
    title: "Migration testing",
    snippet:
      "All integration tests passing on the new Postgres setup. Zero data loss in test migration...",
    author: "Mike Petersen",
    channel_or_subject: "#backend",
    timestamp: "2024-02-09T16:45:00Z",
    score: 0.72,
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
