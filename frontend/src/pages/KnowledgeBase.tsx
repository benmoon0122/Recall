import { useState } from "react";
import { useNavigate } from "react-router";
import SpotlightCard from "../components/reactbits/SpotlightCard";

type SourceType = "slack" | "gmail" | "meeting";

interface Topic {
  name: string;
  sources: number;
  types: SourceType[];
  updated: string;
  emoji: string;
}

const SOURCE_ICON: Record<SourceType, { icon: string; colorClass: string; dotColor: string }> = {
  slack: { icon: "chat", colorClass: "text-source-slack", dotColor: "bg-source-slack" },
  gmail: { icon: "mail", colorClass: "text-source-gmail", dotColor: "bg-source-gmail" },
  meeting: { icon: "videocam", colorClass: "text-source-meeting", dotColor: "bg-source-meeting" },
};

const TOPICS: Topic[] = [
  { name: "Engineering", sources: 34, types: ["slack", "gmail", "meeting"], updated: "2h ago", emoji: "eng" },
  { name: "Infrastructure", sources: 18, types: ["slack", "gmail"], updated: "1d ago", emoji: "infra" },
  { name: "Product", sources: 12, types: ["slack", "meeting"], updated: "3d ago", emoji: "product" },
  { name: "Database Migration", sources: 11, types: ["slack", "gmail", "meeting"], updated: "5d ago", emoji: "db" },
  { name: "Security", sources: 8, types: ["slack"], updated: "1w ago", emoji: "security" },
  { name: "Frontend", sources: 6, types: ["slack", "meeting"], updated: "2w ago", emoji: "frontend" },
];

const TOPIC_ICONS: Record<string, { icon: string; color: string }> = {
  eng: { icon: "engineering", color: "text-[#60A5FA]" },
  infra: { icon: "cloud", color: "text-[#34D399]" },
  product: { icon: "widgets", color: "text-[#FBBF24]" },
  db: { icon: "storage", color: "text-[#c084fc]" },
  security: { icon: "shield", color: "text-[#fb7185]" },
  frontend: { icon: "web", color: "text-[#f472b6]" },
};

export function KnowledgeBase() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState("");

  const filtered = TOPICS.filter((t) =>
    t.name.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="px-6 py-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-[24px] font-semibold text-text-primary">
              Knowledge Base
            </h1>
            <p className="text-[14px] text-text-secondary mt-1">
              Your team's indexed knowledge
            </p>
          </div>

          {/* Library / Graph toggle */}
          <div className="flex items-center gap-1 rounded-full bg-white/[0.04] border border-white/[0.06] p-1">
            <button
              type="button"
              className="flex items-center gap-1.5 bg-white/[0.1] text-text-primary rounded-full px-3.5 py-1.5 text-sm font-medium cursor-pointer transition-colors"
            >
              <span className="material-symbols-outlined text-[16px]">grid_view</span>
              Library
            </button>
            <button
              type="button"
              onClick={() => navigate("/knowledge-base/graph")}
              className="flex items-center gap-1.5 text-text-secondary rounded-full px-3.5 py-1.5 text-sm cursor-pointer hover:text-text-primary transition-colors"
            >
              <span className="material-symbols-outlined text-[16px]">hub</span>
              Graph
            </button>
          </div>
        </div>

        {/* Filter input */}
        <div className="mt-5">
          <div className="glass-input rounded-xl flex items-center">
            <span className="material-symbols-outlined text-[18px] text-text-muted ml-4 pointer-events-none">
              search
            </span>
            <input
              type="text"
              placeholder="Filter topics..."
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="w-full bg-transparent pl-3 pr-4 py-3 text-sm text-text-primary placeholder:text-text-muted outline-none"
            />
          </div>
        </div>
      </div>

      {/* Topic cards grid */}
      <div className="px-6 pb-6 grid grid-cols-3 gap-5 overflow-y-auto">
        {filtered.map((topic) => {
          const topicIcon = TOPIC_ICONS[topic.emoji];
          return (
            <SpotlightCard
              key={topic.name}
              className="glass-card rounded-xl cursor-pointer"
            >
              <div
                className="p-5 flex flex-col gap-3"
                onClick={() =>
                  navigate(`/chat/new?q=${encodeURIComponent(topic.name)}`)
                }
              >
                {/* Row 1: Icon badge + Topic name */}
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-white/[0.06] flex items-center justify-center shrink-0">
                    <span className={`material-symbols-outlined text-[18px] ${topicIcon.color}`}>
                      {topicIcon.icon}
                    </span>
                  </div>
                  <span className="text-[16px] font-semibold text-text-primary">
                    {topic.name}
                  </span>
                </div>

                {/* Row 2: Source count */}
                <span className="text-[13px] text-text-secondary">
                  {topic.sources} sources
                </span>

                {/* Row 3: Source type icons with colored dots */}
                <div className="flex items-center gap-3">
                  {topic.types.map((type) => {
                    const { icon, colorClass, dotColor } = SOURCE_ICON[type];
                    return (
                      <div key={type} className="flex items-center gap-1.5">
                        <span className={`w-1.5 h-1.5 rounded-full ${dotColor}`} />
                        <span
                          className={`material-symbols-outlined text-[16px] ${colorClass}`}
                        >
                          {icon}
                        </span>
                      </div>
                    );
                  })}
                </div>

                {/* Row 4: Updated timestamp */}
                <span className="text-[12px] text-text-muted">
                  Updated {topic.updated}
                </span>
              </div>
            </SpotlightCard>
          );
        })}
      </div>
    </div>
  );
}
