# Recall Frontend Spec

**Last Updated:** 2026-03-04
**Stack:** Vite 6 + React 19 + TypeScript + Tailwind CSS v4
**Router:** react-router v7 (import from `react-router`, NOT `react-router-dom`)
**Screens:** 6 (Home, Chat, Knowledge Base, Source Detail, Sources, Settings)
**Reference Prototypes:** `outputs/prototypes/recall-deep-trace/`

---

## 0. Project Setup

### Scaffold

```bash
npm create vite@latest recall-frontend -- --template react-ts
cd recall-frontend
npm install react-router tailwindcss @tailwindcss/vite react-markdown react-force-graph-2d
```

### `vite.config.ts`

```ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      "/api": "http://localhost:8000", // FastAPI backend
    },
  },
});
```

### Key Version Notes

| Package | Version | Breaking Change to Watch |
|---------|---------|------------------------|
| Tailwind CSS | v4+ | No `tailwind.config.ts`. All theming in CSS via `@theme`. `@import "tailwindcss"` replaces `@tailwind base/components/utilities`. |
| react-router | v7+ | Package is `react-router`, NOT `react-router-dom`. All imports from `react-router`. |
| react-markdown | v10+ | ESM only. Import as `import Markdown from "react-markdown"`. |
| react-force-graph-2d | v1.29+ | Check React 19 compatibility. If issues, fallback to raw `d3-force` + canvas. |

---

## 1. Design Tokens

One Tailwind config. No per-screen overrides.

### Colors

**Tailwind v4 uses CSS-based theming, not JS config files.** Define all tokens in `src/index.css` using `@theme`:

```css
@import "tailwindcss";

@theme {
  /* Primary */
  --color-primary: #5E6AD2;
  --color-primary-hover: #6F7BF7;
  --color-primary-muted: oklch(0.55 0.15 277 / 0.2);

  /* Backgrounds */
  --color-bg: #0B0B0C;
  --color-surface: #141416;
  --color-surface-raised: #1A1A1C;
  --color-panel: #121214;

  /* Borders */
  --color-border: #262626;
  --color-border-hover: #3F3F46;

  /* Text */
  --color-text-primary: #EDEDEF;
  --color-text-secondary: #8A8A8A;
  --color-text-tertiary: #71717A;
  --color-text-muted: #52525B;

  /* Source types */
  --color-source-slack: #E01E5A;
  --color-source-gmail: #EA4335;
  --color-source-meeting: #4285F4;
  --color-source-code: #A855F7;

  /* Status */
  --color-status-success: #34D399;
  --color-status-warning: #FBBF24;
  --color-status-error: #EF4444;

  /* Fonts */
  --font-sans: "Inter", sans-serif;
  --font-mono: "JetBrains Mono", monospace;
}
```

This generates utilities like `bg-primary`, `text-text-secondary`, `border-border`, `bg-source-slack`, etc. No `tailwind.config.ts` needed.

**Note:** In Tailwind v4, `--color-*: initial;` would remove all default colors. Do NOT use this - we want the defaults available as fallbacks alongside our custom tokens.

### Typography

| Use | Font | Weight | Size |
|-----|------|--------|------|
| All UI text | Inter | 400/500/600 | 12-18px |
| Code, citations, shortcuts | JetBrains Mono | 400 | 12-14px |
| Page titles | Inter | 600 | 24px |
| Section headers | Inter | 600 | 14px, uppercase, tracking-wide |
| Body text | Inter | 400 | 14px |
| Muted/meta text | Inter | 400 | 12px |

### Spacing & Radius

| Token | Value |
|-------|-------|
| Border radius (cards, inputs) | 8px (`rounded-lg`) |
| Border radius (pills, badges) | 9999px (`rounded-full`) |
| Sidebar width | 220px |
| Right sidebar width | 260px |
| Page padding | 24px |
| Card padding | 16px |
| Card gap | 12px |

### Scrollbar

```css
::-webkit-scrollbar { width: 6px; }
::-webkit-scrollbar-thumb { background: #3F3F46; border-radius: 3px; }
::-webkit-scrollbar-track { background: transparent; }
```

---

## 2. Shared Components

Build these first. Every screen uses them.

### `<Logo />`

```
Icon: memory (Material Symbols)
Container: 28x28px rounded-lg, bg-[#1A1A1A], border border-[#262626]
Icon size: 18px
Icon color: white
Text: "Recall" 15px font-semibold tracking-tight
```

Lives in the sidebar only. Never duplicated in headers.

### `<Sidebar />`

Fixed left, 220px wide, `bg-surface`, `border-r border-border`.

```
[Logo: Recall]
---
Threads            (icon: message-square)
Knowledge Base     (icon: library)
Sources            (icon: plug/link)
---
RECENT (section header, uppercase, 11px, text-muted)
  Postgres Rate Limits        (icon: dot)
  React Perf Audit            (icon: dot)
  Q3 Planning                 (icon: dot)
---
Settings           (icon: settings)
---
[Avatar: Alex Chen] (36px gradient circle, "AC" initials)
```

Four nav items. No Projects.

Active state: `bg-primary-muted`, `text-primary`, left 2px border accent.
Hover state: `bg-surface-raised`.
Same structure on every screen. No variations.

### `<SourceIcon />`

Returns the correct icon + color for each source type:

| Source | Icon Shape | Color | Label |
|--------|-----------|-------|-------|
| Slack | Chat bubble | `source.slack` (#E01E5A) | "Slack" |
| Gmail | Envelope | `source.gmail` (#EA4335) | "Gmail" |
| Meeting | Video camera | `source.meeting` (#4285F4) | "Meeting" |
| Code | Terminal | `source.code` (#A855F7) | "Code" |

Always uses distinct shape + color. Never color alone (accessibility).

Props: `type: "slack" | "gmail" | "meeting" | "code"`, `size?: "sm" | "md"`.

### `<SourceCard />`

Used on Home (recent context) and Search (source cards above answer).

```
Container: bg-panel, border border-border, rounded-lg, p-4
Layout:
  [SourceIcon]  [Title]                    [Badge #]
                [Snippet - 2 lines, text-secondary, truncate]
                [Timestamp - text-muted, 12px]
```

Props: `type`, `title`, `snippet`, `timestamp`, `badge?: number`.

### `<FollowUpInput />`

Used on Search, Source Detail, and Chat.

```
Container: bg-surface, border border-border, rounded-lg, px-4 py-3
Layout:
  [Attach icon (paperclip)]  [Input: "Ask a follow-up..."]  [Send icon (arrow-up)]
```

Send icon gets `bg-primary` when input has text, `bg-surface-raised` when empty.

### `<FollowUpPill />`

Clickable suggestion pill. Used below answers.

```
Container: border border-border, rounded-full, px-3 py-1.5
Text: 13px, text-secondary
Hover: border-border-hover, text-primary
```

Props: `label: string`, `onClick: () => void`.

### `<CitationBadge />`

Inline citation in AI answers. Superscript numbered pill.

```
Container: bg-primary-muted, rounded-full, px-1.5 py-0.5
Text: 11px, font-mono, text-primary
Hover: bg-primary, text-white (shows tooltip with source snippet)
```

Props: `number: number`, `source: SourceData`.

---

## 3. Routes

```
/                       → Home
/chat/:id               → Chat (AI-powered Q&A)
/chat/new?q={query}     → Chat (new thread from search)
/knowledge-base         → Knowledge Base (library view, default)
/knowledge-base/graph   → Knowledge Base (graph view)
/source/:id             → Source Detail
/sources                → Sources (data connections, sync status)
/settings               → Settings (account, preferences)
```

Use `react-router` v7 (NOT `react-router-dom` - it's been consolidated). All imports come from `react-router`:

```tsx
import { createBrowserRouter, RouterProvider, Link, Outlet, useNavigate } from "react-router";
```

---

## 4. Screen Specs

### Screen 1: Home

**Route:** `/`
**Layout:** Sidebar + centered content (max-width 640px)
**API calls:** None (static)
**Reference:** `recall-deep-trace/01-void-home-screen.png`

```
┌──────────┬─────────────────────────────────────┐
│          │                                     │
│          │     Search across your universe.    │
│ Sidebar  │  Your team's memory, searchable     │
│          │         in seconds.                 │
│          │                                     │
│          │  ┌─────────────────────────────┐    │
│          │  │ Why did we choose Post...⌘K │    │
│          │  └─────────────────────────────┘    │
│          │  [All] [Slack] [Gmail] [Meetings]   │
│          │                                     │
│          │  ┌──────┐ ┌──────┐ ┌──────┐        │
│          │  │Slack │ │Meet  │ │Gmail │        │
│          │  │Rate  │ │Arch  │ │Re:DB │        │
│          │  │limit │ │Revw  │ │migr  │        │
│          │  └──────┘ └──────┘ └──────┘        │
│          │                                     │
└──────────┴─────────────────────────────────────┘
```

**Elements:**

| Element | Details |
|---------|---------|
| Headline | "Search across your universe." 32px, font-semibold, text-primary |
| Subheadline | "Your team's memory, searchable in seconds." 16px, text-secondary |
| Search bar | `<SearchBar />` - full width (max 560px), centered. Placeholder: "Why did we choose Postgres over DynamoDB?" Right side: `⌘K` badge in mono. On submit: navigate to `/chat/new?q={query}`. |
| Filter chips | Row of 4: All (selected/white), Slack (pink), Gmail (red), Meetings (blue). Each uses `<SourceIcon size="sm" />` + label. Selected state: `bg-surface-raised`, `text-primary`. Passed as source filter to Chat. |
| Recent cards | 3x `<SourceCard />` in a row. Hardcoded data: (1) Slack / "Rate limiting discussion" / "#backend" / "2h ago", (2) Meeting / "Architecture Review" / "3 participants" / "Yesterday", (3) Gmail / "Re: Database migration plan" / "From: CTO" / "3d ago". Cards are clickable (navigate to `/source/{id}`). |

**States:**

| State | Behavior |
|-------|----------|
| Default | As described above. |
| Search focused | Border goes `border-primary`. Filter chips remain visible. |
| Search submitted | Navigate to `/chat/new?q={query}` |

---

### Screen 2: Knowledge Base

**Route:** `/knowledge-base` (library view) or `/knowledge-base/graph` (graph view)
**Layout:** Sidebar + main content (full width)
**API calls:** None for hackathon (hardcoded demo data)
**Purpose:** Browsable library of all indexed content, organized by topic. Two views: a list/library view and a graph view showing how topics connect. This is the "your team's brain, visualized" screen.

#### Library View (`/knowledge-base`)

```
┌──────────┬──────────────────────────────────────────┐
│          │ Knowledge Base        [Library] [Graph]   │
│          │ Your team's indexed knowledge             │
│          │                                           │
│          │ ┌─────────────────────────────────────┐   │
│          │ │ 🔍 Filter topics...                 │   │
│ Side-    │ └─────────────────────────────────────┘   │
│ bar      │                                           │
│          │ ┌──────────┐┌──────────┐┌──────────┐     │
│          │ │Engineering││Infra     ││Product   │     │
│          │ │           ││          ││          │     │
│          │ │ 34 sources││ 18 srcs  ││ 12 srcs  │     │
│          │ │ 💬📧🎥    ││ 💬📧     ││ 💬🎥     │     │
│          │ │ Updated 2h││ Upd 1d   ││ Upd 3d   │     │
│          │ └──────────┘└──────────┘└──────────┘     │
│          │                                           │
│          │ ┌──────────┐┌──────────┐┌──────────┐     │
│          │ │Database  ││Security  ││Frontend  │     │
│          │ │Migration ││          ││          │     │
│          │ │ 11 srcs  ││ 8 srcs   ││ 6 srcs   │     │
│          │ │ 💬📧🎥    ││ 💬       ││ 💬🎥     │     │
│          │ │ Upd 5d   ││ Upd 1w   ││ Upd 2w   │     │
│          │ └──────────┘└──────────┘└──────────┘     │
└──────────┴──────────────────────────────────────────┘
```

**Elements:**

| Element | Details |
|---------|---------|
| Page title | "Knowledge Base" 24px, font-semibold. |
| Description | "Your team's indexed knowledge" 14px, text-secondary. |
| View toggle | Top right. Two buttons: "Library" (active) and "Graph". Active: `bg-surface-raised`, `text-primary`. Inactive: `text-secondary`. Rounded pill group. |
| Filter input | Full-width search/filter. "Filter topics..." placeholder. Filters the topic cards below as you type. |
| Topic cards | 3-column grid. Each card is a topic cluster. |

**Topic card spec:**

```
Container: bg-panel, border border-border, rounded-lg, p-5
Hover: border-border-hover (clickable, navigates to topic detail)

Layout:
  Row 1: Topic name (16px, font-semibold, text-primary)
  Row 2: Source count ("34 sources" 13px, text-secondary)
  Row 3: Source type icons (small row of SourceIcons showing which types are in this topic)
  Row 4: "Updated 2h ago" (12px, text-muted)
```

Clicking a topic card navigates to a Chat thread pre-filtered to that topic (e.g., `/chat/new?q=Engineering`).

**Hardcoded topics for demo:**

| Topic | Sources | Types | Updated |
|-------|---------|-------|---------|
| Engineering | 34 | Slack, Gmail, Meeting | 2h ago |
| Infrastructure | 18 | Slack, Gmail | 1d ago |
| Product | 12 | Slack, Meeting | 3d ago |
| Database Migration | 11 | Slack, Gmail, Meeting | 5d ago |
| Security | 8 | Slack | 1w ago |
| Frontend | 6 | Slack, Meeting | 2w ago |

#### Graph View (`/knowledge-base/graph`)

```
┌──────────┬──────────────────────────────────────────┐
│          │ Knowledge Base        [Library] [Graph]   │
│          │                                           │
│          │              ┌──────┐                     │
│          │         ╱────│Infra │────╲                │
│          │        ╱     └──────┘     ╲               │
│ Side-    │  ┌─────┐                ┌──────┐         │
│ bar      │  │Engi-│────────────────│  DB  │         │
│          │  │neer │                │Migra-│         │
│          │  │ing  │╲               │tion  │         │
│          │  └─────┘ ╲              └──────┘         │
│          │           ╲          ╱                    │
│          │        ┌───────┐  ╱                      │
│          │        │Product│╱                        │
│          │        └───────┘                         │
│          │             ╲                             │
│          │          ┌────────┐   ┌────────┐         │
│          │          │Frontend│───│Security│         │
│          │          └────────┘   └────────┘         │
│          │                                           │
└──────────┴──────────────────────────────────────────┘
```

**Elements:**

| Element | Details |
|---------|---------|
| View toggle | Same as library view, "Graph" is now active. |
| Graph canvas | Full content area. Use a lightweight graph library (e.g., `react-force-graph-2d` or `d3-force`). |
| Nodes | Circles representing topic clusters. Size proportional to source count. Color: `primary` (#5E6AD2). Label: topic name (13px, text-primary, white). |
| Edges | Lines connecting topics that share sources or people. Thicker line = more shared connections. Color: `border` (#262626), hover: `border-hover`. |
| Hover behavior | Hovering a node: highlights connected edges, dims unconnected nodes. Shows tooltip: topic name + source count + source types. |
| Click behavior | Clicking a node navigates to the topic detail (same as clicking a topic card in library view). |
| Zoom/pan | Mouse scroll to zoom, click-drag to pan. Pinch zoom on trackpad. |

**Hardcoded graph data for demo:**

```json
{
  "nodes": [
    { "id": "engineering", "label": "Engineering", "size": 34 },
    { "id": "infra", "label": "Infrastructure", "size": 18 },
    { "id": "product", "label": "Product", "size": 12 },
    { "id": "db-migration", "label": "Database Migration", "size": 11 },
    { "id": "security", "label": "Security", "size": 8 },
    { "id": "frontend", "label": "Frontend", "size": 6 }
  ],
  "edges": [
    { "source": "engineering", "target": "infra", "weight": 12 },
    { "source": "engineering", "target": "db-migration", "weight": 9 },
    { "source": "engineering", "target": "product", "weight": 5 },
    { "source": "infra", "target": "db-migration", "weight": 7 },
    { "source": "product", "target": "db-migration", "weight": 3 },
    { "source": "product", "target": "frontend", "weight": 4 },
    { "source": "frontend", "target": "security", "weight": 2 },
    { "source": "engineering", "target": "security", "weight": 3 }
  ]
}
```

**Graph styling:**

```
Background: bg (same as page background, #0B0B0C)
Node fill: primary (#5E6AD2)
Node stroke: primary-hover (#6F7BF7)
Node label: text-primary (#EDEDEF), 12px Inter
Edge stroke: border (#262626), 1-3px based on weight
Edge hover: border-hover (#3F3F46)
Active node: glow effect (box-shadow: 0 0 20px rgba(94, 106, 210, 0.4))
Dimmed nodes: opacity 0.3
```

---

### Screen 4: Source Detail

**Route:** `/source/:id`
**Layout:** Sidebar + split view (50/50)
**API calls:** None for hackathon (hardcoded demo data)
**Purpose:** Deep dive into a single source. Shows the original content alongside AI analysis and cross-tool connections.
**Reference:** `recall-deep-trace/06-deep-dive-v2.png`

```
┌────────┬──────────────────────┬─────────────────────┐
│        │ KB > Engineering     │ gateway-svc/limiter.ts│
│        │                      │                      │
│        │ How do we handle     │  1  import { Redis } │
│        │ API rate limiting?   │  2  import { Logger }│
│        │                      │  3  export class...  │
│ Side-  │ ANALYZED SOURCES     │  ...                 │
│ bar    │ ┌────┐ ┌────┐       │ 12 ▎ async check...  │
│        │ │Src1│ │Src2│       │ 13 ▎  const key...   │
│        │ └────┘ └────┘       │ 14 ▎  try {          │
│        │                      │ 15 ▎   const curr   │
│        │ AI analysis text...  │ 16 ▎   if (curr===1)│
│        │                      │ 17 ▎    await...    │
│        │ KEY IMPLEMENTATION   │ 18 ▎  }             │
│        │ Storage Layer        │  ...                 │
│        │ Fall-Open Strategy   │                      │
│        │                      │                      │
│        │ ▶ RELATED DISCUSS(3) │ EXPERTS              │
│        │                      │ ● Sarah Chen    5    │
│        │ ┌──────────────────┐ │ ● Jordan Lee    3    │
│        │ │Ask a follow-up...│ │ ● Mike Petersen 1    │
│        │ └──────────────────┘ │                      │
│        │                      │ [Copy Code][Cite Src]│
└────────┴──────────────────────┴──────────────────────┘
```

**Left panel:**

| Element | Details |
|---------|---------|
| Breadcrumb | "Knowledge Base > Engineering". 13px, text-secondary. "Knowledge Base" is a link back to `/`. |
| Title | The question this source answers. 20px, font-semibold. |
| Meta | "Just now · Pro Search" badge. 12px, text-muted. |
| Analyzed Sources | 2x compact source cards (gateway-service/limiter, #engineering-payments). `bg-panel`, border, inline. |
| AI analysis | Rendered markdown. Describes what the code does. Bold key terms ("Token Bucket algorithm"). |
| Key Implementation Details | Section with file path in monospace (`gateway-service/limiter.ts`), limits, response codes. |
| Storage Layer | Icon + description (Redis cluster details). |
| Fall-Open Strategy | Icon + description (failure behavior). |
| Related Discussions | Collapsible (`<details>`). Header: "RELATED DISCUSSIONS (3)" with chevron. Collapsed by default. Expanded shows 3 items: Slack (Sarah Chen, #backend, Feb 3), Meeting (Architecture Review, Feb 5), Gmail (CTO Approval, Feb 6). Each item: `<SourceIcon />` + author/source + date + one-line snippet. |
| Follow-up input | `<FollowUpInput />` at bottom of left panel. |

**Right panel:**

| Element | Details |
|---------|---------|
| File header | `terminal` icon + "gateway-service / src / limiter.ts". Right side: "TypeScript" language badge (small pill). |
| Code block | Syntax-highlighted TypeScript. JetBrains Mono 13px. Line numbers in left gutter, `text-muted` (#5C6370), right-aligned. Lines 12-18: left 2px border in `primary` (#5E6AD2) to indicate referenced lines. Auto-scroll to highlighted lines on load. |
| Experts | Section below code. "EXPERTS" header. 3 rows: avatar circle + name + discussion count in text-muted. Sarah Chen (5 discussions), Jordan Lee (3 discussions), Mike Petersen (1 commit). |
| Bottom bar | Full width. Left: empty. Right: "Copy Code" button (secondary style) + "Cite Source" button (secondary style). |

---

### Screen 3: Chat (Hero Screen)

**Route:** `/chat/:id` (existing thread) or `/chat/new?q={query}` (new thread)
**Layout:** Sidebar + main content (max-width 760px, centered) + right sidebar (260px)
**API calls:** `POST /api/query`, `GET /api/timeline`
**Purpose:** The AI experience. Ask a question in natural language, get a synthesized answer with source citations, decision timeline, and follow-ups. This is the "wow" screen for the demo.
**Reference:** `recall-deep-trace/08-cluster-search-v2.png` (answer layout), `recall-deep-trace/04-thread-conversation-flow.png` (thread behavior)

```
┌────────┬──────────────────────────────┬──────────┐
│        │ Threads > Why did we choose..│ CONTEXT  │
│        │                              │          │
│        │ Why did we choose Postgres   │ Related  │
│        │ over DynamoDB?               │ Entities │
│        │ ⏱ 10:12 AM · All Sources    │          │
│ Side-  │                              │ Top File │
│ bar    │ [Slack 8] [Meeting 1] [Gmail]│ Matches  │
│        │                              │          │
│        │ ✓ Searched 3 sources · 11    │ AI       │
│        │                              │ Engine   │
│        │ ┌──────┐┌──────┐┌──────┐    │ Recall   │
│        │ │Src 1 ││Src 2 ││Src 3 │    │ Nova     │
│        │ └──────┘└──────┘└──────┘    │          │
│        │                              │          │
│        │ AI answer with [1] [2] [3]  │          │
│        │ citations inline...          │          │
│        │                              │          │
│        │ [Copy][Regen][👍][👎][🔖]    │          │
│        │                              │          │
│        │ DECISION TIMELINE            │          │
│        │ ● Feb 3 [Slack] Sarah...     │          │
│        │ │                            │          │
│        │ ● Feb 5 [Meeting] Arch...    │          │
│        │ │                            │          │
│        │ ● Feb 6 [Email] CTO...      │          │
│        │                              │          │
│        │ [pill] [pill] [pill]         │          │
│        │ ┌──────────────────────┐    │          │
│        │ │ Ask a follow-up...   │    │          │
│        │ └──────────────────────┘    │          │
└────────┴──────────────────────────────┴──────────┘
```

**Elements (top to bottom):**

| Element | Details |
|---------|---------|
| Breadcrumb | "Threads > [thread title]..." 13px, text-secondary. |
| Title | The user's question as a heading. 22px, font-semibold. |
| Meta | "10:12 AM · Searching: All Sources" 12px, text-muted. |
| Source type tags | Below title. Pills showing source breakdown: `<SourceIcon size="sm" />` + count. "8 messages" / "1 transcript" / "2 emails". Appears ABOVE the answer (sources-first). |
| Search progress | Single line: "✓ Searched across 3 sources · Found 11 results". Green checkmark, 12px, `text-secondary`. |
| Source cards strip | Row of 3x `<SourceCard />` with numbered badges (1, 2, 3). If 4+ sources: show 3 cards + "See all N sources" text link. If 1-2: show 1-2 cards, don't stretch. |
| AI answer | Markdown rendered. 14px body text. Inline `<CitationBadge />` for [1] [2] [3]. Render with react-markdown. May include comparison cards (2-column grid, `bg-panel`, border) when comparing two things. |
| Action buttons | Row: Copy (icon), Regenerate (icon), Thumbs up (icon), Thumbs down (icon), Bookmark (icon). All: text-secondary, hover text-primary. 16px icons. Gap 8px. |
| Decision Timeline | Section header "DECISION TIMELINE" (uppercase, 11px, text-muted). Vertical timeline: left colored dot (source color), vertical line connecting dots, right side: date + source type + title + snippet. Data from `GET /api/timeline`. |
| Follow-up pills | 3x `<FollowUpPill />`: "What was the cost comparison?" / "Who led the migration?" / "What did our team decide about this?" Clicking sends as a follow-up. |
| Follow-up input | `<FollowUpInput />`. On submit: append new Q&A block below. |

**Right sidebar:**

| Section | Details |
|---------|---------|
| CONTEXT header | Uppercase, 11px, text-muted |
| Related Entities | Cards with icon + name. "Database Architecture - Concept", "Backend Team - Group". |
| Top File Matches | Monospace file paths. `db_migration_plan.md`, `schema.sql`. Clickable (navigate to Source Detail). |
| AI Engine | "Recall Nova" badge. `bg-primary-muted`, `text-primary`. |

**Multi-turn behavior:**
- Each follow-up appends a new question + answer block below the previous
- Each answer block has its own source pills, action buttons, timeline
- Scroll to newest answer on submit
- For hackathon: 1-2 exchanges is enough

**States:**

| State | Behavior |
|-------|----------|
| Loading | Search progress lines animate in sequence (500ms each). Skeleton source cards pulse. Answer streams in token-by-token (or fades in). |
| Loaded | Full content as described. |
| Partial failure | Progress line: "✓ Searched 2 sources · Found 9 results · Gmail unavailable (retry)". Answer still generates from available sources. |
| Empty | "No results found. Try rephrasing your question." |

---

### Screen 5: Sources

**Route:** `/sources`
**Layout:** Sidebar + main content (no right sidebar)
**API calls:** `GET /api/sources`
**Reference:** `recall-deep-trace/07-knowledge-base-v2.png`
**Purpose:** Data connections and sync management. Connect tools, see what's indexed, monitor sync progress.

```
┌──────────┬──────────────────────────────────────────┐
│          │ Settings              [Connect New Source]│
│          │ Manage your connected data sources        │
│          │                                           │
│          │ 97,756 Total  │ 3 Connected │ 2m ago Last│
│ Side-    │ Items Indexed │ Sources     │ Sync       │
│ bar      │                                           │
│          │ Only you can search your connected accts  │
│          │                                           │
│          │ ┌──────────┐┌──────────┐┌──────────┐     │
│          │ │ Slack    ││ Gmail    ││ Meeting  │     │
│          │ │●Connected││●Connected││◐Syncing  │     │
│          │ │          ││          ││          │     │
│          │ │ 85.2k   ││ 12.5k   ││ 218      │     │
│          │ │ msgs    ││ emails  ││ trans    │     │
│          │ │          ││          ││ Nova...  │     │
│          │ │ 5m ago  ││ 10m ago ││ ████░ 72%│     │
│          │ │ ⚙Manage ││ ⚙Manage ││ ✕Cancel  │     │
│          │ └──────────┘└──────────┘└──────────┘     │
│          │                                           │
│          │ ┌──────────┐                              │
│          │ │    +     │                              │
│          │ │ Add New  │                              │
│          │ │ Source   │                              │
│          │ └──────────┘                              │
└──────────┴──────────────────────────────────────────┘
```

**Elements:**

| Element | Details |
|---------|---------|
| Page title | "Sources" 24px, font-semibold. |
| Description | "Manage your connected data sources and sync status." 14px, text-secondary. |
| Connect button | Top right. "Connect New Source" primary button. `bg-primary`, white text, rounded-lg, px-4 py-2. |
| Stats row | 3 inline stats. Each: large number (24px, font-semibold, text-primary) + label below (12px, text-secondary). "97,756 Total Items Indexed" / "3 Connected Sources" / "2m ago Last Sync". |
| Privacy line | Below stats. Lock icon + "Only you can search your connected accounts." 13px, text-muted. |
| Source cards | 3-column grid of source cards (details below). |
| Add New Source | Dashed border card (`border-dashed border-border`). "+" icon centered (32px, text-muted). "Add New Source" 14px. "Connect Notion, Jira, Linear, and more" 12px, text-muted. |

**Source card spec (each card):**

```
Container: bg-panel, border border-border, rounded-lg, p-5
Width: Equal thirds of grid

Layout:
  Row 1: [Source logo/icon]  [Source name]  [Status badge]
         Logo: 32px. Name: 15px semibold.
         Badge: green "Connected" or amber "Syncing..."

  Row 2: [Stat 1]  [Stat 2]
         Label (12px, text-muted) + Value (18px, semibold)
         Slack: "Messages: 85,200" + "Channels: 47"
         Gmail: "Emails: 12,500" + "Categories: 8"
         Meeting: "Transcripts: 218" + (no second stat)

  Row 3: [Last Sync time]
         "Last Sync: 5m ago" in status.success (green) + "Fresh" label
         OR sync progress (Meeting card only)

  Row 4: [Footer action]
         Connected cards: "Auto-sync enabled" text-muted + "Manage" link
         Syncing card: progress bar + "Cancel" in status.error
```

**Meeting Transcripts card (syncing state):**

```
Status badge: amber "Syncing..." (bg-warning/20, text-warning)
Progress text: "Step 2/2: Embedding with Nova..." 12px
Progress subtext: "156 of 218 transcripts" 12px, text-muted
Progress bar: bg-surface-raised track, bg-primary fill at 72%
Cancel button: "Cancel" text in status.error. No confirmation (hackathon).
```

**Freshness color coding:**

| Last Sync | Color | Label |
|-----------|-------|-------|
| < 10 min | status.success (green) | "Fresh" |
| 10-60 min | text-secondary | (no label) |
| > 60 min | status.warning (amber) | "Stale" |
| Syncing | status.warning (amber) | "Syncing..." |

---

## 5. Navigation & Interactions

### Global Navigation

| Action | Behavior |
|--------|----------|
| Click sidebar "Threads" | Navigate to `/chat` (list of past threads, or just Home for hackathon) |
| Click sidebar "Knowledge Base" | Navigate to `/knowledge-base` (library view) |
| Click sidebar "Sources" | Navigate to `/sources` |
| Click sidebar "Settings" | Navigate to `/settings` |
| Click sidebar recent item | Navigate to `/chat/{id}` (opens that thread) |
| Press `⌘K` anywhere | Focus the search bar (Home) or open a search modal (other screens) |

### Chat Flow

| Action | Behavior |
|--------|----------|
| Submit question on Home | Navigate to `/chat/new?q={query}`, auto-runs the query |
| Click source card | Navigate to `/source/{id}` |
| Click citation badge | Scroll to source card OR show tooltip with source snippet |
| Click follow-up pill | Append as new question in thread |
| Submit follow-up | Append new Q&A block. Scroll to new answer. Loading state while fetching. |
| Click "Copy" | Copy answer text to clipboard. |
| Click "Regenerate" | Re-run the query. Replace current answer with new one. |
| Click bookmark | Toggle saved state. Icon fills in. (No backend for hackathon.) |
| Click file match in right sidebar | Navigate to `/source/{id}` |

### Knowledge Base Flow

| Action | Behavior |
|--------|----------|
| Click "Library" / "Graph" toggle | Switch between `/knowledge-base` and `/knowledge-base/graph` |
| Click topic card (library) | Navigate to `/chat/new?q={topic name}` |
| Click graph node | Navigate to `/chat/new?q={topic name}` |
| Type in filter input | Filter topic cards by name |

### Source Detail Flow

| Action | Behavior |
|--------|----------|
| Click breadcrumb "Knowledge Base" | Navigate to `/knowledge-base` |
| Click Related Discussion item | Navigate to `/source/{id}` (or open external link) |
| Click Expert name | No action (hackathon). Future: open profile or start thread. |
| Click "Copy Code" | Copy code block to clipboard. Button text changes to "Copied!" for 2s. |
| Click "Cite Source" | Copy formatted citation to clipboard (title + URL + date). |

---

## 6. Loading & Error States

### Search Loading

```
1. Immediately show: query title, tabs, empty content area
2. Animate search progress (500ms per line):
   "Searching Slack..."           → "✓ Searched Slack · Found 8 messages"
   "Checking Gmail..."            → "✓ Checked Gmail · Found 3 emails"
   "Analyzing meeting transcripts..." → "✓ Analyzed meetings · Found 1 transcript"
3. Show skeleton source cards (3 gray rectangles pulsing)
4. Stream AI answer (or fade in when complete)
5. Fade in decision timeline
6. Fade in follow-up pills
```

### Search Error (Partial Failure)

```
Progress line: "✓ Searched across 2 sources · Found 9 results · Gmail unavailable (retry)"
"retry" is a clickable link that re-queries Gmail only.
Answer still generates from available sources.
```

### Search Error (Full Failure)

```
Center content: error icon (alert-circle)
"Something went wrong. Try again."
[Retry button - primary style]
```

### Settings Loading

```
Stats row: skeleton pulse (3 gray bars)
Source cards: skeleton pulse (3 gray card shapes)
```

---

## 7. Responsive Behavior

Desktop only for the hackathon. Minimum viewport: 1280px wide.

| Viewport | Behavior |
|----------|----------|
| >= 1280px | Full layout (sidebar + content + right sidebar on Search) |
| < 1280px | Not supported. No mobile, no tablet. |

---

## 8. File Structure

```
recall-frontend/
├── index.html
├── vite.config.ts              # Vite + @tailwindcss/vite plugin (no tailwind.config needed)
├── src/
│   ├── main.tsx
│   ├── App.tsx                    # Router setup
│   ├── index.css                  # Global styles, scrollbar, fonts
│   ├── api/
│   │   └── recall.ts              # API client (fetch wrappers)
│   ├── components/
│   │   ├── Logo.tsx
│   │   ├── Sidebar.tsx
│   │   ├── SourceIcon.tsx
│   │   ├── SourceCard.tsx
│   │   ├── SearchBar.tsx
│   │   ├── FollowUpInput.tsx
│   │   ├── FollowUpPill.tsx
│   │   ├── CitationBadge.tsx
│   │   ├── FilterChip.tsx
│   │   ├── Timeline.tsx
│   │   ├── CodePanel.tsx
│   │   ├── TopicCard.tsx          # Knowledge Base topic card
│   │   ├── KnowledgeGraph.tsx     # Force-directed graph component
│   │   └── SkeletonLoader.tsx
│   ├── pages/
│   │   ├── Home.tsx
│   │   ├── Chat.tsx               # AI-powered Q&A threads
│   │   ├── KnowledgeBase.tsx      # Library view
│   │   ├── KnowledgeBaseGraph.tsx # Graph view
│   │   ├── SourceDetail.tsx
│   │   ├── Sources.tsx            # Data connections + sync status
│   │   └── Settings.tsx           # Account preferences (lightweight)
│   ├── data/
│   │   ├── topics.ts              # Hardcoded topic clusters
│   │   └── graph.ts               # Hardcoded graph nodes + edges
│   └── types/
│       └── index.ts               # Shared TypeScript types
└── package.json
```

---

## 9. API Contract

What the frontend expects from the backend.

### `POST /api/query`

**Purpose:** AI-powered Q&A. Runs vector search (Nova) then generates a cited answer (Claude).

**Request:**
```json
{
  "query": "Why did we choose Postgres over DynamoDB?",
  "source_types": ["slack", "gmail", "meeting"]
}
```

**Response:**
```json
{
  "answer": "Based on architectural discussions in November 2023, the team chose PostgreSQL over DynamoDB primarily due to complex relational querying requirements and ACID compliance needs. [1] [2] [3]",
  "citations": [
    {
      "number": 1,
      "source_type": "slack",
      "title": "#backend",
      "snippet": "Sarah Chen: Been running load tests on DynamoDB and the costs are getting crazy...",
      "author": "Sarah Chen",
      "timestamp": "2024-02-03T09:15:00Z"
    },
    {
      "number": 2,
      "source_type": "meeting",
      "title": "Architecture Review",
      "snippet": "CTO: OK I'm convinced. Let's go with Postgres...",
      "author": null,
      "timestamp": "2024-02-05T14:00:00Z"
    },
    {
      "number": 3,
      "source_type": "gmail",
      "title": "Re: Database decision - confirmed: Postgres",
      "snippet": "After the architecture review, we're going with Postgres...",
      "author": "David Park (CTO)",
      "timestamp": "2024-02-06T09:00:00Z"
    }
  ],
  "sources_searched": {
    "slack": 8,
    "gmail": 3,
    "meeting": 1
  }
}
```

### `GET /api/timeline?query={query}`

**Response:**
```json
{
  "events": [
    {
      "timestamp": "2024-02-03T09:15:00Z",
      "source_type": "slack",
      "title": "Sarah raised DynamoDB concerns",
      "snippet": "Been running load tests on DynamoDB and the costs are getting crazy at our scale...",
      "author": "Sarah Chen",
      "channel_or_subject": "#backend"
    },
    {
      "timestamp": "2024-02-04T10:00:00Z",
      "source_type": "gmail",
      "title": "Database evaluation sent to eng-leads",
      "snippet": "Detailed comparison doc with cost analysis, benchmark results...",
      "author": "Sarah Chen",
      "channel_or_subject": "Database evaluation: Postgres vs DynamoDB"
    },
    {
      "timestamp": "2024-02-05T14:00:00Z",
      "source_type": "meeting",
      "title": "Architecture Review - team voted Postgres",
      "snippet": "CTO: OK I'm convinced. Let's go with Postgres. Jordan, can you lead?",
      "author": null,
      "channel_or_subject": "Architecture Review - Database Migration"
    },
    {
      "timestamp": "2024-02-06T09:00:00Z",
      "source_type": "gmail",
      "title": "CTO confirmed decision",
      "snippet": "After the architecture review, we're going with Postgres...",
      "author": "David Park",
      "channel_or_subject": "Re: Database decision - confirmed: Postgres"
    },
    {
      "timestamp": "2024-02-10T14:15:00Z",
      "source_type": "slack",
      "title": "Migration complete",
      "snippet": "All tests green. Payment service now running on Postgres. Latency down 40%.",
      "author": "Jordan Lee",
      "channel_or_subject": "#backend"
    }
  ]
}
```

### `GET /api/sources`

**Response:**
```json
{
  "sources": [
    {
      "type": "slack",
      "status": "connected",
      "stats": { "messages": 85200, "channels": 47 },
      "last_sync": "2024-02-10T14:30:00Z",
      "freshness": "fresh"
    },
    {
      "type": "gmail",
      "status": "connected",
      "stats": { "emails": 12500, "categories": 8 },
      "last_sync": "2024-02-10T14:25:00Z",
      "freshness": "fresh"
    },
    {
      "type": "meeting",
      "status": "syncing",
      "stats": { "transcripts": 218 },
      "last_sync": null,
      "freshness": "syncing",
      "sync_progress": {
        "step": "Embedding with Nova",
        "current": 156,
        "total": 218,
        "percent": 72
      }
    }
  ],
  "total_items": 97756
}
```

### `GET /api/health`

**Response:**
```json
{
  "status": "ok",
  "version": "0.1.0"
}
```

---

## 10. Build Priority

For the Thursday demo:

| Priority | What | Time Estimate |
|----------|------|---------------|
| 1 | Design tokens + shared components | 2-3 hours |
| 2 | Chat screen (hero, AI experience) | 3-4 hours |
| 3 | Home screen | 1-2 hours |
| 4 | Knowledge Base - library view (hardcoded) | 2-3 hours |
| 5 | Sources screen | 1-2 hours |
| 6 | Knowledge Base - graph view (hardcoded) | 2-3 hours |
| 7 | Source Detail (hardcoded) | 2-3 hours |
| 8 | Settings screen | 1 hour |

**If running out of time:** Cut in reverse order. Source Detail goes first. Then graph view. Keep Chat + Home + KB library + Sources + Settings.

**Absolute minimum:** Chat screen with working API + Home to enter queries. That IS the demo.

## 11. Screen Summary

| Screen | Purpose | Data Source | Demo Priority |
|--------|---------|-------------|---------------|
| Home | Entry point. Ask a question. | Static | Medium |
| Chat | AI answer + citations + timeline | `POST /api/query` + `GET /api/timeline` | **Highest** |
| Knowledge Base (library) | Browse topics | Hardcoded | Medium |
| Knowledge Base (graph) | Visualize topic connections | Hardcoded | Low |
| Sources | Connect tools, sync status, Nova showcase | `GET /api/sources` | Medium |
| Source Detail | Deep dive into one source | Hardcoded | Low |
| Settings | Account preferences | None (static) | Low |
