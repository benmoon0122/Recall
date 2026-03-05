import { useState, type FormEvent, type KeyboardEvent } from "react";
import { useNavigate } from "react-router";
import Aurora from "../components/reactbits/Aurora";
import SplitText from "../components/reactbits/SplitText";
import SpotlightCard from "../components/reactbits/SpotlightCard";
import OrbShader from "../components/OrbShader";
import { useThreads } from "../context/ThreadsContext";
import type { SourceType } from "../types";

const actionPills = [
  { label: "Search AWS Docs", icon: "cloud", query: "What's our CloudFront caching strategy?" },
  { label: "Find Decisions", icon: "gavel", query: "Why did we choose Lambda over ECS for the payment service?" },
  { label: "Trace Architecture", icon: "account_tree", query: "What's our Amazon Nova integration architecture?" },
];

const recentCards: {
  type: SourceType;
  title: string;
  subtitle: string;
  time: string;
  id: string;
  icon: string;
  color: string;
  action: string;
  query: string;
}[] = [
  { type: "slack", title: "Lambda cold start optimization", subtitle: "Discover how the team reduced Lambda cold starts by 60% using SnapStart.", time: "1h ago", id: "src_001", icon: "chat", color: "text-source-slack", action: "View Thread", query: "Why did we choose Lambda over ECS for the payment service?" },
  { type: "meeting", title: "Nova AI Architecture Review", subtitle: "Meeting notes from the Bedrock integration planning session with the ML team.", time: "Yesterday", id: "src_002", icon: "videocam", color: "text-source-meeting", action: "View Thread", query: "What's our Amazon Nova integration architecture?" },
  { type: "gmail", title: "DynamoDB capacity planning", subtitle: "Engineering email thread about single-table design patterns for the payment service.", time: "2d ago", id: "src_003", icon: "mail", color: "text-source-gmail", action: "View Thread", query: "How does our DynamoDB single-table design work?" },
];

export function Home() {
  const navigate = useNavigate();
  const { addThread } = useThreads();
  const [query, setQuery] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);

  function handleSubmit(e?: FormEvent) {
    e?.preventDefault();
    if (!query.trim()) return;
    addThread(query.trim());
    navigate(`/chat/new?q=${encodeURIComponent(query.trim())}`);
  }

  function handleKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  }

  return (
    <div className="flex-1 flex flex-col relative overflow-hidden">
      {/* Aurora WebGL background */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-30">
        <Aurora
          colorStops={["#7c3aed", "#8b5cf6", "#1e1b4b"]}
          amplitude={1.0}
          blend={0.5}
          speed={0.4}
        />
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 -mt-8 relative z-10">
        <div className="max-w-[680px] w-full flex flex-col items-center gap-5">
          {/* Glowing Orb */}
          <OrbShader className="w-[220px] h-[220px] mb-2" />

          {/* Headline */}
          <SplitText
            text="Ready to Create Something New?"
            className="text-[34px] font-heading font-semibold text-[#c084fc] leading-tight tracking-[-0.02em]"
            delay={30}
            duration={0.8}
            ease="power3.out"
            splitType="chars"
            from={{ opacity: 0, y: 40 }}
            to={{ opacity: 1, y: 0 }}
            threshold={0.1}
            rootMargin="-50px"
          />

          {/* Action pills */}
          <div className="flex items-center gap-2 animate-slide-up" style={{ animationDelay: "0.05s" }}>
            {actionPills.map((pill) => (
              <button
                key={pill.label}
                type="button"
                onClick={() => navigate(`/chat/new?q=${encodeURIComponent(pill.query)}`)}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-button text-sm text-text-secondary hover:text-text-primary cursor-pointer"
              >
                {pill.label}
                <span className="material-symbols-outlined text-[16px] text-text-muted">{pill.icon}</span>
              </button>
            ))}
          </div>

          {/* Search input */}
          <form
            onSubmit={handleSubmit}
            className="w-full max-w-[640px] animate-slide-up mt-2"
            style={{ animationDelay: "0.1s" }}
          >
            <div
              className={`glass-input rounded-xl p-4 ${
                searchFocused ? "border-primary/40 shadow-[0_0_0_3px_rgba(139,92,246,0.08)]" : ""
              }`}
            >
              <div className="flex items-start gap-3">
                <span className="material-symbols-outlined text-[20px] text-primary mt-0.5 shrink-0">auto_awesome</span>
                <textarea
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={handleKeyDown}
                  onFocus={() => setSearchFocused(true)}
                  onBlur={() => setSearchFocused(false)}
                  placeholder="Ask Anything..."
                  rows={2}
                  className="flex-1 bg-transparent text-text-primary placeholder:text-text-muted outline-none text-[15px] resize-none leading-relaxed"
                />
              </div>
              {/* Bottom toolbar */}
              <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/[0.04]">
                <div className="flex items-center gap-4">
                  <button type="button" className="inline-flex items-center gap-1.5 text-xs text-text-muted hover:text-text-secondary transition-colors cursor-pointer">
                    <span className="material-symbols-outlined text-[16px]">attach_file</span>
                    Attach
                  </button>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="submit"
                    className={`w-8 h-8 rounded-full flex items-center justify-center transition-all cursor-pointer shrink-0 ${
                      query.trim()
                        ? "bg-gradient-to-br from-primary to-fuchsia-500 text-white shadow-lg shadow-primary/25"
                        : "bg-white/[0.06] text-text-muted"
                    }`}
                  >
                    <span className="material-symbols-outlined text-[18px]">arrow_upward</span>
                  </button>
                </div>
              </div>
            </div>
          </form>

          {/* Feature cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 w-full animate-slide-up mt-1" style={{ animationDelay: "0.15s" }}>
            {recentCards.map((card) => (
              <SpotlightCard
                key={card.id}
                className="glass-card rounded-xl p-5 cursor-pointer"
              >
                <div onClick={() => navigate(`/chat/new?q=${encodeURIComponent(card.query)}`)} className="relative z-10 flex flex-col h-full">
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-10 h-10 rounded-lg bg-white/[0.06] flex items-center justify-center">
                      <span className={`material-symbols-outlined text-[20px] ${card.color}`}>{card.icon}</span>
                    </div>
                    <span className="text-[11px] text-text-muted bg-white/[0.06] rounded-full px-2.5 py-0.5">{card.action}</span>
                  </div>
                  <p className="text-[14px] font-semibold text-text-primary mb-1.5">{card.title}</p>
                  <p className="text-[12px] text-text-secondary leading-relaxed">{card.subtitle}</p>
                </div>
              </SpotlightCard>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
