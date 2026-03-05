import { useState } from "react";
import { Link } from "react-router";
import SpotlightCard from "../components/reactbits/SpotlightCard";

/* ── hardcoded demo data ─────────────────────────────────────────────── */

const mockCode = `import { Redis } from "ioredis";
import { Logger } from "./logger";

interface BucketConfig {
  maxTokens: number;
  refillRate: number;   // tokens per second
  windowMs: number;
}

const DEFAULT_CONFIG: BucketConfig = {
  maxTokens: 120,
  refillRate: 10,
  windowMs: 60_000,
};

export class RateLimiter {
  private redis: Redis;
  private logger: Logger;

  constructor(redis: Redis, logger: Logger) {
    this.redis = redis;
    this.logger = logger;
  }

  async checkLimit(
    clientId: string,
    config: BucketConfig = DEFAULT_CONFIG,
  ): Promise<boolean> {
    const key = \`ratelimit:\${clientId}\`;
    try {
      const current = await this.redis.incr(key);
      if (current === 1) {
        await this.redis.expire(key, config.windowMs / 1000);
      }
      return current <= config.maxTokens;
    } catch (err) {
      this.logger.warn("Rate limiter fallback: allowing request", { err });
      return true; // fall-open strategy
    }
  }
}`;

const codeLines = mockCode.split("\n");
const highlightedLines = new Set([12, 13, 14, 15, 16, 17, 18]);

const relatedDiscussions = [
  {
    type: "slack" as const,
    title: "Sarah Chen",
    channel: "#backend",
    date: "Feb 3",
    desc: "Initial discussion about rate limiting approaches",
  },
  {
    type: "meeting" as const,
    title: "Architecture Review",
    channel: null,
    date: "Feb 5",
    desc: "Team decided on token bucket approach",
  },
  {
    type: "gmail" as const,
    title: "CTO Approval",
    channel: null,
    date: "Feb 6",
    desc: "Approved the implementation plan",
  },
];

const experts = [
  { initials: "SC", name: "Sarah Chen", detail: "5 discussions", color: "from-purple-500 to-blue-500" },
  { initials: "JL", name: "Jordan Lee", detail: "3 discussions", color: "from-cyan-500 to-teal-500" },
  { initials: "MP", name: "Mike Petersen", detail: "1 commit", color: "from-orange-500 to-rose-500" },
];

/* ── icon helpers ─────────────────────────────────────────────── */

const DISCUSSION_ICONS: Record<string, { icon: string; color: string }> = {
  slack: { icon: "tag", color: "text-source-slack" },
  meeting: { icon: "videocam", color: "text-source-meeting" },
  gmail: { icon: "mail", color: "text-source-gmail" },
};

/* ── page component ──────────────────────────────────────────────────── */

export function SourceDetail() {
  const [discussionsOpen, setDiscussionsOpen] = useState(false);
  const [followUp, setFollowUp] = useState("");

  const hasText = followUp.trim().length > 0;

  function handleCopyCode() {
    navigator.clipboard.writeText(mockCode);
  }

  function handleFollowUp() {
    if (!hasText) return;
    console.log("Follow-up:", followUp.trim());
    setFollowUp("");
  }

  return (
    <div className="flex min-h-screen">
      {/* ─── Left Panel ─────────────────────────────────────────────── */}
      <div className="flex-1 p-6 overflow-y-auto flex flex-col">
        {/* Breadcrumb */}
        <nav className="text-[13px] text-text-secondary mb-2">
          <Link
            to="/knowledge-base"
            className="hover:text-text-primary transition-colors"
          >
            Knowledge Base
          </Link>
          <span className="mx-1.5 text-text-muted">&gt;</span>
          <span className="text-text-muted">Engineering</span>
        </nav>

        {/* Title */}
        <h1 className="text-[22px] font-semibold text-text-primary mt-3">
          How do we handle API rate limiting?
        </h1>

        {/* Meta */}
        <p className="text-[12px] text-text-muted mt-1.5 flex items-center gap-2">
          Just now &middot;{" "}
          <span className="bg-primary-muted text-primary rounded px-1.5 py-0.5 text-[10px] font-medium">
            Pro Search
          </span>
        </p>

        {/* Analyzed Sources */}
        <div className="flex gap-3 mt-6 mb-8">
          <SpotlightCard
            className="glass-card rounded-lg px-3 py-2 inline-flex items-center gap-2"
            spotlightColor="rgba(168, 85, 247, 0.15)"
          >
            <span className="material-symbols-outlined text-[16px] text-source-code">code</span>
            <span className="text-sm text-text-secondary">gateway-service/limiter</span>
          </SpotlightCard>

          <SpotlightCard
            className="glass-card rounded-lg px-3 py-2 inline-flex items-center gap-2"
            spotlightColor="rgba(224, 30, 90, 0.15)"
          >
            <span className="material-symbols-outlined text-[16px] text-source-slack">tag</span>
            <span className="text-sm text-text-secondary">#engineering-payments</span>
          </SpotlightCard>
        </div>

        {/* AI Analysis */}
        <div className="glass-card rounded-xl p-5 mb-6">
          <div className="flex items-center gap-2 mb-3">
            <span className="material-symbols-outlined text-[16px] text-primary">auto_awesome</span>
            <h3 className="text-[11px] font-semibold uppercase tracking-wider text-text-muted">AI Analysis</h3>
          </div>
          <p className="text-[14px] text-text-secondary leading-relaxed mb-3">
            The rate limiting implementation uses a{" "}
            <strong className="text-text-primary font-semibold">Token Bucket algorithm</strong>{" "}
            backed by Redis for distributed state. The service enforces
            per-client limits with configurable burst capacity.
          </p>
          <p className="text-[14px] text-text-secondary leading-relaxed">
            The implementation is in{" "}
            <code className="font-mono text-[13px] bg-white/[0.06] rounded px-1.5 py-0.5">
              gateway-service/src/limiter.ts
            </code>{" "}
            and handles both synchronous checks and async token replenishment.
          </p>
        </div>

        {/* Key Implementation Details */}
        <div className="glass-card rounded-xl p-5 mb-6">
          <h3 className="text-[11px] font-semibold uppercase tracking-wider text-text-muted mb-4">
            Key Implementation Details
          </h3>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-white/[0.06] flex items-center justify-center shrink-0 mt-0.5">
                <span className="material-symbols-outlined text-[16px] text-text-secondary">storage</span>
              </div>
              <div>
                <p className="text-[14px] text-text-primary font-medium">Storage Layer</p>
                <p className="text-[13px] text-text-secondary mt-0.5">
                  Redis cluster with read replicas for sub-millisecond lookups
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-white/[0.06] flex items-center justify-center shrink-0 mt-0.5">
                <span className="material-symbols-outlined text-[16px] text-text-secondary">shield</span>
              </div>
              <div>
                <p className="text-[14px] text-text-primary font-medium">Fall-Open Strategy</p>
                <p className="text-[13px] text-text-secondary mt-0.5">
                  On Redis failure, requests are allowed through with degraded logging
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Related Discussions (collapsible) */}
        <div className="mb-8">
          <button
            type="button"
            onClick={() => setDiscussionsOpen(!discussionsOpen)}
            className="uppercase text-[11px] text-text-muted tracking-wider font-semibold cursor-pointer select-none flex items-center gap-1.5 mb-4"
          >
            <span className={`material-symbols-outlined text-[16px] text-text-muted transition-transform duration-200 ${discussionsOpen ? "rotate-90" : ""}`}>
              chevron_right
            </span>
            Related Discussions (3)
          </button>

          {discussionsOpen && (
            <div className="space-y-3 pl-1">
              {relatedDiscussions.map((d) => {
                const iconMeta = DISCUSSION_ICONS[d.type];
                return (
                  <div key={d.title} className="glass-card rounded-lg p-3 flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-white/[0.06] flex items-center justify-center shrink-0">
                      <span className={`material-symbols-outlined text-[16px] ${iconMeta.color}`}>
                        {iconMeta.icon}
                      </span>
                    </div>
                    <div>
                      <p className="text-[13px] text-text-primary font-medium">
                        {d.title}
                        {d.channel ? ` \u00B7 ${d.channel}` : ""}
                        {" \u00B7 "}
                        {d.date}
                      </p>
                      <p className="text-[12px] text-text-muted mt-0.5">{d.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Spacer to push follow-up to bottom */}
        <div className="flex-1" />

        {/* Follow-up input */}
        <div className="glass-input rounded-xl px-4 py-3 flex items-center gap-3">
          <button type="button" className="text-text-muted hover:text-text-secondary transition-colors cursor-pointer shrink-0">
            <span className="material-symbols-outlined text-[20px]">attach_file</span>
          </button>
          <input
            type="text"
            value={followUp}
            onChange={(e) => setFollowUp(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleFollowUp();
              }
            }}
            placeholder="Ask a follow-up..."
            className="flex-1 bg-transparent text-text-primary placeholder:text-text-muted outline-none text-sm"
          />
          <button
            type="button"
            onClick={handleFollowUp}
            className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors shrink-0 cursor-pointer ${
              hasText ? "bg-primary hover:bg-primary-hover text-white" : "bg-white/[0.06] text-text-muted"
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">arrow_upward</span>
          </button>
        </div>
      </div>

      {/* ─── Right Panel ────────────────────────────────────────────── */}
      <div className="w-1/2 border-l border-white/[0.06] p-6 overflow-y-auto flex flex-col shrink-0">
        {/* File header */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[16px] text-text-secondary">terminal</span>
            <span className="font-mono text-[13px] text-text-primary">
              gateway-service / src / limiter.ts
            </span>
          </div>
          <span className="text-[11px] text-text-muted bg-white/[0.06] rounded-md px-2 py-0.5">
            TypeScript
          </span>
        </div>

        {/* Code block */}
        <div className="glass-card rounded-xl overflow-hidden mb-8">
          <div className="flex items-center justify-between px-4 py-2.5 border-b border-white/[0.06] bg-white/[0.02]">
            <span className="text-[12px] text-text-muted font-mono">limiter.ts</span>
            <button
              type="button"
              onClick={handleCopyCode}
              className="text-text-muted hover:text-text-primary transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">content_copy</span>
            </button>
          </div>
          <div className="bg-black/30 p-4 overflow-x-auto">
            <table className="w-full border-collapse">
              <tbody>
                {codeLines.map((line, index) => {
                  const lineNum = index + 1;
                  const isHighlighted = highlightedLines.has(lineNum);

                  return (
                    <tr key={lineNum}>
                      <td
                        className={`text-right pr-4 select-none font-mono text-[13px] text-text-muted w-8 align-top ${
                          isHighlighted ? "border-l-2 border-primary" : ""
                        }`}
                      >
                        {lineNum}
                      </td>
                      <td
                        className={`font-mono text-[13px] text-text-primary whitespace-pre ${
                          isHighlighted ? "bg-primary/5" : ""
                        }`}
                      >
                        {line}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Experts */}
        <h3 className="text-[11px] font-semibold uppercase tracking-wider text-text-muted mb-4">
          Experts
        </h3>
        <div className="space-y-3 mb-8">
          {experts.map((e) => (
            <div key={e.name} className="glass-card rounded-xl p-3 flex items-center gap-3">
              <div
                className={`w-9 h-9 rounded-full bg-gradient-to-br ${e.color} flex items-center justify-center text-white text-xs font-bold shrink-0`}
              >
                {e.initials}
              </div>
              <div>
                <p className="text-[14px] text-text-primary font-medium">{e.name}</p>
                <p className="text-[12px] text-text-muted">{e.detail}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Bottom bar */}
        <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-white/[0.06]">
          <button
            type="button"
            onClick={handleCopyCode}
            className="bg-white/[0.04] border border-white/[0.08] hover:bg-white/[0.08] hover:border-white/[0.12] text-text-secondary hover:text-text-primary rounded-lg px-4 py-2 text-sm transition-all cursor-pointer"
          >
            Copy Code
          </button>
          <button
            type="button"
            className="bg-white/[0.04] border border-white/[0.08] hover:bg-white/[0.08] hover:border-white/[0.12] text-text-secondary hover:text-text-primary rounded-lg px-4 py-2 text-sm transition-all cursor-pointer"
          >
            Cite Source
          </button>
        </div>
      </div>
    </div>
  );
}
