import { useState, type FormEvent, type KeyboardEvent } from "react";
import { useNavigate } from "react-router";
import Aurora from "../components/reactbits/Aurora";
import BlurText from "../components/reactbits/BlurText";
import SpotlightCard from "../components/reactbits/SpotlightCard";
import type { SourceType } from "../types";

const actionPills = [
  { label: "Search Slack", icon: "tag" },
  { label: "Find Decisions", icon: "gavel" },
  { label: "Summarize Thread", icon: "summarize" },
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
}[] = [
  { type: "slack", title: "Rate limiting discussion", subtitle: "Search across Slack threads and find key decisions instantly.", time: "2h ago", id: "src_001", icon: "chat", color: "text-source-slack", action: "Search Slack" },
  { type: "meeting", title: "Architecture Review", subtitle: "Turn meeting transcripts into structured notes and action items.", time: "Yesterday", id: "src_002", icon: "videocam", color: "text-source-meeting", action: "View Notes" },
  { type: "gmail", title: "Database migration plan", subtitle: "Surface critical email threads and extract decisions automatically.", time: "3d ago", id: "src_003", icon: "mail", color: "text-source-gmail", action: "Find Emails" },
];

export function Home() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);

  function handleSubmit(e?: FormEvent) {
    e?.preventDefault();
    if (!query.trim()) return;
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
          {/* 3D Cosmic Orb */}
          <div className="cosmic-orb mb-2" />

          {/* Headline */}
          <BlurText
            text="Ready to Create Something New?"
            className="text-[36px] font-bold text-text-primary text-center leading-tight"
            animateBy="words"
            delay={80}
          />

          {/* Action pills */}
          <div className="flex items-center gap-2 animate-slide-up" style={{ animationDelay: "0.05s" }}>
            {actionPills.map((pill) => (
              <button
                key={pill.label}
                type="button"
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
                  <button type="button" className="inline-flex items-center gap-1.5 text-xs text-text-muted hover:text-text-secondary transition-colors cursor-pointer">
                    <span className="material-symbols-outlined text-[16px]">tune</span>
                    Settings
                  </button>
                  <button type="button" className="inline-flex items-center gap-1.5 text-xs text-text-muted hover:text-text-secondary transition-colors cursor-pointer">
                    <span className="material-symbols-outlined text-[16px]">grid_view</span>
                    Options
                  </button>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    className="w-8 h-8 rounded-full flex items-center justify-center glass-button text-text-muted cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[18px]">mic</span>
                  </button>
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
                <div onClick={() => navigate(`/source/${card.id}`)} className="relative z-10 flex flex-col h-full">
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
