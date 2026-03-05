import { useState, useEffect } from "react";
import { Link, useParams, useSearchParams } from "react-router";
import SpotlightCard from "../components/reactbits/SpotlightCard";
import type { Citation } from "../types";
import { chatMocksById, defaultChatMock } from "../data/chats";

/* ───────────────────────── Helpers ───────────────────────── */

const SOURCE_META: Record<
  string,
  { icon: string; color: string; bg: string; label: string }
> = {
  slack: {
    icon: "tag",
    color: "text-source-slack",
    bg: "bg-source-slack/15",
    label: "Slack",
  },
  gmail: {
    icon: "mail",
    color: "text-source-gmail",
    bg: "bg-source-gmail/15",
    label: "Email",
  },
  meeting: {
    icon: "videocam",
    color: "text-source-meeting",
    bg: "bg-source-meeting/15",
    label: "Meeting",
  },
  code: {
    icon: "code",
    color: "text-source-code",
    bg: "bg-source-code/15",
    label: "Code",
  },
};

function sourceColor(type: string) {
  const map: Record<string, string> = {
    slack: "#f472b6",
    gmail: "#fb7185",
    meeting: "#60a5fa",
    code: "#c084fc",
  };
  return map[type] ?? "rgba(255,255,255,0.55)";
}

function fmtDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

/* ───────────── Render answer with bold + citations ───────────── */

function renderAnswer(text: string, _citations: Citation[]) {
  const paragraphs = text.split("\n\n");

  return paragraphs.map((paragraph, pIdx) => {
    const lines = paragraph.split("\n");

    return (
      <div key={pIdx} className="mb-5">
        {lines.map((line, lIdx) => {
          const elements: React.ReactNode[] = [];
          const tokens = line.split(/(\*\*[^*]+\*\*|\[\d+\])/g);

          let isHeading = false;
          tokens.forEach((token, tIdx) => {
            const boldMatch = token.match(/^\*\*(.+)\*\*$/);
            if (boldMatch) {
              isHeading = true;
              elements.push(
                <strong
                  key={tIdx}
                  className="text-[17px] font-semibold text-text-primary"
                >
                  {boldMatch[1]}
                </strong>
              );
              return;
            }

            const citeMatch = token.match(/^\[(\d+)\]$/);
            if (citeMatch) {
              const num = parseInt(citeMatch[1], 10);
              elements.push(
                <span key={tIdx} className="citation-pill">
                  {num}
                </span>
              );
              return;
            }

            if (token) {
              elements.push(<span key={tIdx}>{token}</span>);
            }
          });

          return (
            <p
              key={lIdx}
              className={
                isHeading
                  ? "text-[17px] font-semibold text-text-primary mt-3"
                  : "text-[15px] md:text-[16px] text-white/80 leading-[1.8]"
              }
            >
              {elements}
            </p>
          );
        })}
      </div>
    );
  });
}

/* ───────────────────────── Component ───────────────────────── */

export function Chat() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [followUpValue, setFollowUpValue] = useState("");
  const [searchPhase, setSearchPhase] = useState(0); // 0 = searching, 1 = done

  // Loading + search progress animation
  useEffect(() => {
    const t1 = setTimeout(() => setSearchPhase(1), 800);
    const t2 = setTimeout(() => setLoading(false), 1500);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  function handleFollowUp(value: string) {
    console.log("Follow-up:", value);
  }

  const mockChat = (id && chatMocksById[id]) || defaultChatMock;
  const query = searchParams.get("q") || mockChat.query;

  function handleCopy() {
    navigator.clipboard.writeText(mockChat.answer);
  }

  const sourceCounts = mockChat.citations.reduce(
    (acc, citation) => {
      if (citation.source_type === "slack") acc.slack += 1;
      if (citation.source_type === "meeting") acc.meeting += 1;
      if (citation.source_type === "gmail") acc.gmail += 1;
      return acc;
    },
    { slack: 0, meeting: 0, gmail: 0 }
  );

  return (
    <div className="flex-1 flex min-w-0 overflow-hidden">
      {/* ───────── Main content area ───────── */}
      <div className="flex-1 overflow-y-auto min-w-0">
        <div className="max-w-[760px] mx-auto px-6 py-10">
          {/* 1. Breadcrumb */}
          <nav className="mb-4">
            <span className="text-[13px] text-text-secondary">
              <Link
                to="/"
                className="hover:text-text-primary transition-colors"
              >
                Threads
              </Link>
              <span className="mx-1.5 text-text-muted">&gt;</span>
              <span className="text-text-muted truncate">
                {query.length > 32 ? query.slice(0, 32) + "..." : query}
              </span>
            </span>
          </nav>

          {/* 2. Title */}
          <h1 className="text-[24px] font-semibold tracking-tight text-text-primary mb-2">
            {query}
          </h1>

          {/* 3. Meta */}
          <p className="text-[12px] text-text-muted mb-5">
            {mockChat.timeLabel} &middot; Searching: All Sources
          </p>

          {/* 4. Source type tags */}
          <div className="flex items-center gap-2 mb-5">
            {[
              { type: "slack", count: sourceCounts.slack, label: "messages" },
              { type: "meeting", count: sourceCounts.meeting, label: "transcript" },
              { type: "gmail", count: sourceCounts.gmail, label: "emails" },
            ].map((s) => {
              const meta = SOURCE_META[s.type];
              return (
                <span
                  key={s.type}
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium ${meta.bg} ${meta.color} border border-transparent`}
                >
                  <span className="material-symbols-outlined text-[14px]">
                    {meta.icon}
                  </span>
                  {s.count} {s.label}
                </span>
              );
            })}
          </div>

          {/* 5. Search progress */}
          <div className="flex items-center gap-2 text-[12px] text-text-secondary mb-10">
            {searchPhase >= 1 ? (
              <>
                <span className="text-status-success text-[14px]">&#10003;</span>
                <span>
                  Searched across {mockChat.sourcesSearched} sources &middot; Found {mockChat.foundResults} results
                </span>
              </>
            ) : (
              <>
                <span className="inline-block w-3 h-3 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                <span className="text-text-muted">
                  Searching across sources...
                </span>
              </>
            )}
          </div>

          {loading ? (
            /* ───────── Loading skeleton ───────── */
            <div className="space-y-6 animate-fade-in">
              {/* Skeleton source cards */}
              <div className="grid grid-cols-3 gap-4">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="h-[130px] bg-white/[0.04] border border-white/[0.06] rounded-xl animate-pulse"
                  />
                ))}
              </div>
              {/* Skeleton answer lines */}
              <div className="space-y-3 mt-4">
                <div className="h-4 bg-white/[0.04] border border-white/[0.06] rounded-xl animate-pulse w-full" />
                <div className="h-4 bg-white/[0.04] border border-white/[0.06] rounded-xl animate-pulse w-5/6" />
                <div className="h-4 bg-white/[0.04] border border-white/[0.06] rounded-xl animate-pulse w-4/6" />
                <div className="h-4 bg-white/[0.04] border border-white/[0.06] rounded-xl animate-pulse w-full" />
                <div className="h-4 bg-white/[0.04] border border-white/[0.06] rounded-xl animate-pulse w-3/4" />
              </div>
            </div>
          ) : (
            <div className="animate-fade-in">
              {/* 6. Source cards strip */}
              <div className="grid grid-cols-3 gap-4 mb-10">
                {mockChat.citations.map((c) => {
                  const meta = SOURCE_META[c.source_type];
                  return (
                    <SpotlightCard
                      key={c.number}
                      className="glass-card rounded-xl p-4 cursor-pointer"
                      spotlightColor={`${sourceColor(c.source_type)}20`}
                    >
                      {/* Numbered badge */}
                      <div className="flex items-center justify-between mb-2.5">
                        <div className="flex items-center gap-2">
                          <span
                            className={`material-symbols-outlined text-[16px] ${meta.color}`}
                          >
                            {meta.icon}
                          </span>
                          <span className="text-[12px] text-text-secondary">
                            {meta.label}
                          </span>
                        </div>
                        <span className="citation-pill">{c.number}</span>
                      </div>
                      <p className="text-[13px] font-medium text-text-primary mb-1.5 truncate">
                        {c.title}
                      </p>
                      <p className="text-[12px] text-text-secondary leading-[1.6] line-clamp-2">
                        {c.snippet}
                      </p>
                    </SpotlightCard>
                  );
                })}
              </div>

              {/* 7. AI answer */}
              <div className="glass-card rounded-xl p-6 mb-8">
                <div className="flex items-center gap-2 mb-4">
                  <span className="material-symbols-outlined text-[18px] text-primary">auto_awesome</span>
                  <h3 className="text-[11px] font-semibold uppercase tracking-wider text-text-muted">AI Analysis</h3>
                </div>
                {renderAnswer(mockChat.answer, mockChat.citations)}
              </div>

              {/* 8. Action buttons */}
              <div className="flex items-center gap-1 mb-10">
                <button
                  type="button"
                  onClick={handleCopy}
                  className="hover:bg-white/[0.06] rounded-lg p-2 text-text-secondary hover:text-text-primary transition-all cursor-pointer"
                  title="Copy"
                >
                  <span className="material-symbols-outlined text-[18px]">
                    content_copy
                  </span>
                </button>
                <button
                  type="button"
                  className="hover:bg-white/[0.06] rounded-lg p-2 text-text-secondary hover:text-text-primary transition-all cursor-pointer"
                  title="Regenerate"
                >
                  <span className="material-symbols-outlined text-[18px]">
                    refresh
                  </span>
                </button>
                <button
                  type="button"
                  className="hover:bg-white/[0.06] rounded-lg p-2 text-text-secondary hover:text-text-primary transition-all cursor-pointer"
                  title="Helpful"
                >
                  <span className="material-symbols-outlined text-[18px]">
                    thumb_up
                  </span>
                </button>
                <button
                  type="button"
                  className="hover:bg-white/[0.06] rounded-lg p-2 text-text-secondary hover:text-text-primary transition-all cursor-pointer"
                  title="Not helpful"
                >
                  <span className="material-symbols-outlined text-[18px]">
                    thumb_down
                  </span>
                </button>
                <button
                  type="button"
                  className="hover:bg-white/[0.06] rounded-lg p-2 text-text-secondary hover:text-text-primary transition-all cursor-pointer"
                  title="Bookmark"
                >
                  <span className="material-symbols-outlined text-[18px]">
                    bookmark
                  </span>
                </button>
              </div>

              {/* 9. Decision Timeline (vertical) */}
              <div className="glass-card rounded-xl p-6 mb-10">
                <h3 className="text-[11px] font-semibold uppercase tracking-wider text-text-muted mb-6">
                  Decision Timeline
                </h3>
                <div className="relative">
                  {mockChat.timeline.map((event, idx) => {
                    const meta = SOURCE_META[event.source_type];
                    const isLast = idx === mockChat.timeline.length - 1;
                    const dotColor = sourceColor(event.source_type);

                    return (
                      <div key={idx} className="flex gap-4 relative">
                        {/* Left: dot + vertical line */}
                        <div className="flex flex-col items-center shrink-0 w-4">
                          <div
                            className="w-3 h-3 rounded-full mt-1 shrink-0 ring-2 ring-[#0c0a1d]"
                            style={{ backgroundColor: dotColor }}
                          />
                          {!isLast && (
                            <div className="w-px flex-1 bg-border mt-1" />
                          )}
                        </div>

                        {/* Right: content */}
                        <div className="pb-7 min-w-0 flex-1">
                          <div className="flex items-center gap-2 mb-1.5">
                            <span className="text-[12px] text-text-muted">
                              {fmtDate(event.timestamp)}
                            </span>
                            <span
                              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium ${meta.bg} ${meta.color}`}
                            >
                              <span className="material-symbols-outlined text-[12px]">
                                {meta.icon}
                              </span>
                              {meta.label}
                            </span>
                          </div>
                          <p className="text-[14px] font-medium text-text-primary mb-1">
                            {event.title}
                          </p>
                          <p className="text-[13px] text-text-secondary leading-[1.6]">
                            {event.snippet}
                          </p>
                          {event.author && (
                            <p className="text-[11px] text-text-muted mt-1.5">
                              &mdash; {event.author}
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* 10. Follow-up pills */}
              <div className="flex flex-wrap gap-2 mb-5">
                {mockChat.followUps.map((label) => (
                  <button
                    key={label}
                    type="button"
                    onClick={() => handleFollowUp(label)}
                    className="bg-white/[0.03] border border-white/[0.08] hover:bg-white/[0.06] hover:border-white/[0.15] hover:text-text-primary rounded-full px-4 py-2 text-text-secondary transition-all cursor-pointer text-[13px]"
                  >
                    {label}
                  </button>
                ))}
              </div>

              {/* 11. Follow-up input */}
              <div className="mt-4 mb-8">
                <div className="glass-input rounded-xl px-4 py-3 flex items-center gap-3">
                  <button
                    type="button"
                    className="text-text-muted hover:text-text-secondary transition-colors cursor-pointer shrink-0"
                  >
                    <span className="material-symbols-outlined text-[20px]">
                      attach_file
                    </span>
                  </button>
                  <input
                    type="text"
                    value={followUpValue}
                    onChange={(e) => setFollowUpValue(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && followUpValue.trim()) {
                        handleFollowUp(followUpValue.trim());
                        setFollowUpValue("");
                      }
                    }}
                    placeholder="Ask a follow-up..."
                    className="flex-1 bg-transparent text-[14px] text-text-primary placeholder:text-text-muted outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (followUpValue.trim()) {
                        handleFollowUp(followUpValue.trim());
                        setFollowUpValue("");
                      }
                    }}
                    className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors cursor-pointer shrink-0 ${
                      followUpValue.trim()
                        ? "bg-primary hover:bg-primary-hover text-white"
                        : "bg-white/[0.06] text-text-muted"
                    }`}
                  >
                    <span className="material-symbols-outlined text-[18px]">
                      arrow_upward
                    </span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ───────── Right sidebar ───────── */}
      <aside className="w-[260px] hidden xl:flex flex-col border-l border-white/[0.05] overflow-y-auto shrink-0 p-5 bg-[rgba(10,8,22,0.5)] backdrop-blur-xl">
        {/* CONTEXT header */}
        <h2 className="text-[11px] font-semibold uppercase tracking-wider text-text-muted mb-6">
          Context
        </h2>

        {/* Related Entities */}
        <div className="glass-card rounded-xl p-4 mb-4">
          <h3 className="text-[11px] font-semibold uppercase tracking-wider text-text-muted mb-3">
            Related Entities
          </h3>
          <div className="space-y-2">
            <div className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-white/[0.06] transition-colors cursor-pointer">
              <div className="w-8 h-8 rounded-lg bg-white/[0.06] flex items-center justify-center">
                <span className="material-symbols-outlined text-[16px] text-[#60A5FA]">
                  dns
                </span>
              </div>
              <div>
                <p className="text-[13px] text-text-primary font-medium">
                  Database Architecture
                </p>
                <p className="text-[11px] text-text-muted">Concept</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-white/[0.06] transition-colors cursor-pointer">
              <div className="w-8 h-8 rounded-lg bg-white/[0.06] flex items-center justify-center">
                <span className="material-symbols-outlined text-[16px] text-[#60A5FA]">
                  people
                </span>
              </div>
              <div>
                <p className="text-[13px] text-text-primary font-medium">
                  Backend Team
                </p>
                <p className="text-[11px] text-text-muted">Group</p>
              </div>
            </div>
          </div>
        </div>

        {/* Top File Matches */}
        <div className="glass-card rounded-xl p-4 mb-4">
          <h3 className="text-[11px] font-semibold uppercase tracking-wider text-text-muted mb-3">
            Top File Matches
          </h3>
          <div className="space-y-1.5">
            <div className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-white/[0.06] transition-colors cursor-pointer">
              <span className="material-symbols-outlined text-[16px] text-text-secondary">
                description
              </span>
              <span className="font-mono text-[13px] text-text-secondary">
                db_migration_plan.md
              </span>
            </div>
            <div className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-white/[0.06] transition-colors cursor-pointer">
              <span className="material-symbols-outlined text-[16px] text-text-secondary">
                code
              </span>
              <span className="font-mono text-[13px] text-text-secondary">
                schema.sql
              </span>
            </div>
          </div>
        </div>

        {/* AI Engine */}
        <div className="glass-card rounded-xl p-4">
          <h3 className="text-[11px] font-semibold uppercase tracking-wider text-text-muted mb-3">
            AI Engine
          </h3>
          <div className="inline-flex items-center gap-2 bg-primary/15 border border-primary/20 rounded-full px-3 py-1.5 w-fit">
            <span className="material-symbols-outlined text-[16px] text-primary">
              auto_awesome
            </span>
            <span className="text-[13px] text-primary font-medium">
              Recall Nova
            </span>
          </div>
        </div>
      </aside>
    </div>
  );
}
