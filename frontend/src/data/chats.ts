import type { Citation, TimelineEvent } from "../types";

export interface ChatMock {
  id: string;
  title: string;
  query: string;
  timeLabel: string;
  sourcesSearched: number;
  foundResults: number;
  citations: Citation[];
  timeline: TimelineEvent[];
  answer: string;
  followUps: string[];
}

export const chatMocksById: Record<string, ChatMock> = {
  "1": {
    id: "1",
    title: "Postgres Rate Limits",
    query: "Why did we choose Postgres over DynamoDB?",
    timeLabel: "10:12 AM",
    sourcesSearched: 3,
    foundResults: 11,
    citations: [
      {
        number: 1,
        source_type: "slack",
        title: "#backend",
        snippet:
          "Sarah Chen: Been running load tests on DynamoDB and the costs are getting crazy at our scale...",
        author: "Sarah Chen",
        timestamp: "2024-02-03T09:15:00Z",
      },
      {
        number: 2,
        source_type: "meeting",
        title: "Architecture Review",
        snippet:
          "CTO: OK I'm convinced. Let's go with Postgres. Jordan, can you lead?",
        author: null,
        timestamp: "2024-02-05T14:00:00Z",
      },
      {
        number: 3,
        source_type: "gmail",
        title: "Re: Database decision - confirmed: Postgres",
        snippet:
          "After the architecture review, we're going with Postgres. Jordan will lead the migration.",
        author: "David Park (CTO)",
        timestamp: "2024-02-06T09:00:00Z",
      },
    ],
    timeline: [
      {
        timestamp: "2024-02-03T09:15:00Z",
        source_type: "slack",
        title: "Sarah raised DynamoDB concerns",
        snippet:
          "Been running load tests on DynamoDB and the costs are getting crazy at our scale...",
        author: "Sarah Chen",
        channel_or_subject: "#backend",
      },
      {
        timestamp: "2024-02-04T10:00:00Z",
        source_type: "gmail",
        title: "Database evaluation sent to eng-leads",
        snippet:
          "Detailed comparison doc with cost analysis, benchmark results...",
        author: "Sarah Chen",
        channel_or_subject: "Database evaluation: Postgres vs DynamoDB",
      },
      {
        timestamp: "2024-02-05T14:00:00Z",
        source_type: "meeting",
        title: "Architecture Review - team voted Postgres",
        snippet:
          "CTO: OK I'm convinced. Let's go with Postgres. Jordan, can you lead?",
        author: null,
        channel_or_subject: "Architecture Review - Database Migration",
      },
      {
        timestamp: "2024-02-06T09:00:00Z",
        source_type: "gmail",
        title: "CTO confirmed decision",
        snippet:
          "After the architecture review, we're going with Postgres...",
        author: "David Park",
        channel_or_subject: "Re: Database decision - confirmed: Postgres",
      },
      {
        timestamp: "2024-02-10T14:15:00Z",
        source_type: "slack",
        title: "Migration complete",
        snippet:
          "All tests green. Payment service now running on Postgres. Latency down 40%.",
        author: "Jordan Lee",
        channel_or_subject: "#backend",
      },
    ],
    answer: `Based on architectural discussions in February 2024, the team chose PostgreSQL over DynamoDB primarily due to three factors:

**1. Complex Relational Queries**
Our access patterns require complex joins across User, Organization, and Billing entities. DynamoDB would have required maintaining secondary indexes and duplicating data [1].

**2. ACID Compliance for Billing**
Strict transactional integrity was a hard requirement for the new billing service. Postgres provides native support, whereas DynamoDB requires complex application-level logic [2].

**3. Team Expertise**
The engineering team already has deep operational expertise with RDS Postgres, reducing learning curve and operational risk [3].

The decision was finalized in the Architecture Review on Feb 5, with CTO David Park giving final approval via email the following day.`,
    followUps: [
      "What was the cost comparison?",
      "Who led the migration?",
      "What did our team decide about this?",
    ],
  },
  "2": {
    id: "2",
    title: "React Perf Audit",
    query: "What caused the dashboard slowdown after the React 19 upgrade?",
    timeLabel: "4:48 PM",
    sourcesSearched: 4,
    foundResults: 9,
    citations: [
      {
        number: 1,
        source_type: "slack",
        title: "#frontend-performance",
        snippet:
          "CPU profiles show the table re-rendering on every keystroke in the global search input.",
        author: "Priya Shah",
        timestamp: "2025-01-14T18:22:00Z",
      },
      {
        number: 2,
        source_type: "code",
        title: "src/components/DashboardTable.tsx",
        snippet:
          "useMemo dependency includes filters object created inline, causing memo invalidation each render.",
        author: "GitHub",
        timestamp: "2025-01-14T20:11:00Z",
      },
      {
        number: 3,
        source_type: "meeting",
        title: "Frontend Perf Triage",
        snippet:
          "Decision: stabilize filter references and virtualize rows over 200 entries.",
        author: null,
        timestamp: "2025-01-15T17:00:00Z",
      },
    ],
    timeline: [
      {
        timestamp: "2025-01-14T18:22:00Z",
        source_type: "slack",
        title: "Initial slowdown report",
        snippet:
          "Typing in search takes 300-400ms when 5k rows are loaded.",
        author: "Priya Shah",
        channel_or_subject: "#frontend-performance",
      },
      {
        timestamp: "2025-01-14T20:11:00Z",
        source_type: "code",
        title: "Hot path identified in table component",
        snippet:
          "Inline filter object broke memoization and forced full subtree re-render.",
        author: "Perf Bot",
        channel_or_subject: "DashboardTable.tsx",
      },
      {
        timestamp: "2025-01-15T17:00:00Z",
        source_type: "meeting",
        title: "Triage agreed on remediation",
        snippet:
          "Move filter normalization outside render and adopt row virtualization.",
        author: null,
        channel_or_subject: "Frontend Perf Triage",
      },
      {
        timestamp: "2025-01-16T09:30:00Z",
        source_type: "gmail",
        title: "Perf fix rollout approved",
        snippet:
          "Release manager approved hotfix in 2025.01.16.2 for customer-facing dashboard.",
        author: "Marta Rossi",
        channel_or_subject: "Perf rollback + fix plan",
      },
    ],
    answer: `The slowdown came from memoization churn in the dashboard table after the React 19 upgrade.

**1. Invalidated Memo Dependencies**
The filters object was reconstructed on every render, so useMemo and React.memo could not short-circuit updates [2].

**2. Large List Rendering Cost**
With ~5k rows, each keystroke in search triggered a full list render and expensive cell formatting work [1].

**3. Resolution**
The team stabilized filter references, memoized column definitions, and added row virtualization for large datasets [3].

After rollout, median input latency dropped from ~340ms to ~42ms in production.`,
    followUps: [
      "Which component changed the most?",
      "Did we add tests for regressions?",
      "What was the production impact window?",
    ],
  },
  "3": {
    id: "3",
    title: "Q3 Planning",
    query: "What were the final priorities from the Q3 planning thread?",
    timeLabel: "9:03 AM",
    sourcesSearched: 3,
    foundResults: 14,
    citations: [
      {
        number: 1,
        source_type: "meeting",
        title: "Q3 Planning Kickoff",
        snippet:
          "Leadership aligned on reliability, self-serve onboarding, and enterprise analytics as top bets.",
        author: null,
        timestamp: "2025-06-03T16:00:00Z",
      },
      {
        number: 2,
        source_type: "slack",
        title: "#q3-planning",
        snippet:
          "PMs voted to defer custom exports and prioritize audit logs for enterprise deals in pipeline.",
        author: "Nina Patel",
        timestamp: "2025-06-05T21:12:00Z",
      },
      {
        number: 3,
        source_type: "gmail",
        title: "Q3 Roadmap Final",
        snippet:
          "Final list approved by exec staff with budget allocation across three initiatives.",
        author: "Leo Kim",
        timestamp: "2025-06-07T08:45:00Z",
      },
    ],
    timeline: [
      {
        timestamp: "2025-06-03T16:00:00Z",
        source_type: "meeting",
        title: "Kickoff priorities drafted",
        snippet:
          "Reliability and enterprise growth initiatives emerged as clear leaders.",
        author: null,
        channel_or_subject: "Q3 Planning Kickoff",
      },
      {
        timestamp: "2025-06-05T21:12:00Z",
        source_type: "slack",
        title: "Product vote in planning channel",
        snippet:
          "Audit logs moved up due to enterprise customer commitments.",
        author: "Nina Patel",
        channel_or_subject: "#q3-planning",
      },
      {
        timestamp: "2025-06-06T18:30:00Z",
        source_type: "slack",
        title: "Engineering effort estimates shared",
        snippet:
          "Self-serve onboarding was scoped to 2 squads with dependency on auth work.",
        author: "Omar Diaz",
        channel_or_subject: "#eng-leads",
      },
      {
        timestamp: "2025-06-07T08:45:00Z",
        source_type: "gmail",
        title: "Roadmap approved",
        snippet:
          "Exec staff approved roadmap and requested monthly KPI review cadence.",
        author: "Leo Kim",
        channel_or_subject: "Q3 Roadmap Final",
      },
    ],
    answer: `The Q3 planning process converged on three approved priorities:

**1. Platform Reliability**
Improve incident response time and reduce customer-facing outage minutes. This was ranked highest by both support and enterprise sales [1].

**2. Self-Serve Onboarding**
Launch a guided setup flow to reduce time-to-value for SMB accounts and improve activation in the first 7 days [1].

**3. Enterprise Analytics + Audit Logs**
Deliver account-level analytics and audit logging to support ongoing enterprise deals and renewals [2][3].

Lower-priority items like custom exports were explicitly deferred to Q4 unless staffing changes.`,
    followUps: [
      "Which KPIs were attached to each priority?",
      "What was deferred to Q4?",
      "Who owns each workstream?",
    ],
  },
};

export const defaultChatMock = chatMocksById["1"];

export const chatHistoryList = Object.values(chatMocksById).map((chat) => ({
  id: chat.id,
  label: chat.title,
}));
