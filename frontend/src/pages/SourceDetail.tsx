import { useState } from "react";
import { Link } from "react-router";
import SpotlightCard from "../components/reactbits/SpotlightCard";

/* ── hardcoded demo data ─────────────────────────────────────────────── */

const mockCode = `import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

interface PaymentRequest {
  orderId: string;
  amount: number;
  currency: string;
  customerId: string;
}

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  const payment: PaymentRequest = JSON.parse(event.body ?? "{}");

  const item = {
    PK: \`ORDER#\${payment.orderId}\`,
    SK: \`PAYMENT#\${Date.now()}\`,
    amount: payment.amount,
    currency: payment.currency,
    customerId: payment.customerId,
    status: "PENDING",
    createdAt: new Date().toISOString(),
    ttl: Math.floor(Date.now() / 1000) + 90 * 86400,
  };

  await docClient.send(
    new PutCommand({
      TableName: process.env.PAYMENTS_TABLE!,
      Item: item,
      ConditionExpression: "attribute_not_exists(PK)",
    })
  );

  return {
    statusCode: 201,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ paymentId: item.SK, status: item.status }),
  };
}`;

const codeLines = mockCode.split("\n");
const highlightedLines = new Set([22, 23, 24, 25, 26, 27, 28, 29, 30]);

const relatedDiscussions = [
  {
    type: "slack" as const,
    title: "Priya Sharma",
    channel: "#aws-architecture",
    date: "Jan 15",
    desc: "Lambda vs ECS cost analysis and cold start benchmarks",
  },
  {
    type: "meeting" as const,
    title: "AWS Architecture Review",
    channel: null,
    date: "Jan 17",
    desc: "Team decided on Lambda + API Gateway + DynamoDB",
  },
  {
    type: "gmail" as const,
    title: "CTO Approval",
    channel: null,
    date: "Jan 18",
    desc: "Approved serverless architecture for payment service",
  },
];

const experts = [
  { initials: "PS", name: "Priya Sharma", detail: "8 discussions", color: "from-purple-500 to-blue-500" },
  { initials: "MC", name: "Marcus Chen", detail: "6 discussions", color: "from-cyan-500 to-teal-500" },
  { initials: "AP", name: "Aisha Patel", detail: "3 commits", color: "from-orange-500 to-rose-500" },
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
          <span className="text-text-muted">API Platform</span>
        </nav>

        {/* Title */}
        <h1 className="text-[22px] font-heading font-semibold text-text-primary mt-3">
          How does the payment Lambda handler work?
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
            <span className="text-sm text-text-secondary">payment-lambda/handler</span>
          </SpotlightCard>

          <SpotlightCard
            className="glass-card rounded-lg px-3 py-2 inline-flex items-center gap-2"
            spotlightColor="rgba(224, 30, 90, 0.15)"
          >
            <span className="material-symbols-outlined text-[16px] text-source-slack">tag</span>
            <span className="text-sm text-text-secondary">#aws-architecture</span>
          </SpotlightCard>
        </div>

        {/* AI Analysis */}
        <div className="glass-card rounded-xl p-5 mb-6">
          <div className="flex items-center gap-2 mb-3">
            <span className="material-symbols-outlined text-[16px] text-primary">auto_awesome</span>
            <h3 className="text-[11px] font-semibold uppercase tracking-wider text-text-muted">AI Analysis</h3>
          </div>
          <p className="text-[14px] text-text-secondary leading-relaxed mb-3">
            The payment service uses an{" "}
            <strong className="text-text-primary font-semibold">AWS Lambda handler</strong>{" "}
            with API Gateway integration, writing transaction records to DynamoDB using the single-table design pattern.
          </p>
          <p className="text-[14px] text-text-secondary leading-relaxed">
            The implementation is in{" "}
            <code className="font-mono text-[13px] bg-white/[0.06] rounded px-1.5 py-0.5">
              payment-lambda/src/handler.ts
            </code>{" "}
            and processes payment requests with idempotent writes using DynamoDB conditional expressions.
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
                  DynamoDB single-table design with GSI for status queries and TTL for automatic archival
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-white/[0.06] flex items-center justify-center shrink-0 mt-0.5">
                <span className="material-symbols-outlined text-[16px] text-text-secondary">shield</span>
              </div>
              <div>
                <p className="text-[14px] text-text-primary font-medium">Idempotent Writes</p>
                <p className="text-[13px] text-text-secondary mt-0.5">
                  Uses DynamoDB ConditionExpression to prevent duplicate payment processing
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
              payment-lambda / src / handler.ts
            </span>
          </div>
          <span className="text-[11px] text-text-muted bg-white/[0.06] rounded-md px-2 py-0.5">
            TypeScript
          </span>
        </div>

        {/* Code block */}
        <div className="glass-card rounded-xl overflow-hidden mb-8">
          <div className="flex items-center justify-between px-4 py-2.5 border-b border-white/[0.06] bg-white/[0.02]">
            <span className="text-[12px] text-text-muted font-mono">handler.ts</span>
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
