# Zyricon Polish Design Brief

## Reference: Zyricon UI Aesthetic

### Core Design Principles
1. **Dark opaque glass panels** - 70-90% opacity over cosmic background
2. **Generous whitespace** - More padding, more breathing room
3. **Refined glass cards** - Subtle borders (white/[0.06]), smooth hover transitions
4. **Polished pill buttons** - Rounded-full with glass background and icon
5. **Clean typography hierarchy** - Inter font, clear size/weight differences
6. **Consistent component patterns** - Every card, button, input follows same glass language

### Key New Elements
- **TopBar**: Horizontal bar at top of main content area with model selector dropdown + action buttons (Configuration, Export)
- **Sidebar restructure**: "New Chat" button, Features/Workspaces groups, Upgrade card at bottom
- **Refined action pills**: Label + icon on right side, glass-card background
- **Bottom feature cards**: Icon box + action badge + title + description layout

### Glass Classes (already exist, refine usage)
```css
.glass-card    /* Primary card style - 55% opacity, blur-24 */
.glass-input   /* Input fields - 60% opacity, blur-20 */
.glass-sidebar /* Sidebar - 88% opacity, blur-60 */
.glass         /* General panels - 70% opacity, blur-40 */
.glass-raised  /* Elevated elements - 80% opacity, blur-40 */
```

### Color System
- Primary: #8b5cf6 (purple)
- Text primary: rgba(255,255,255,0.95)
- Text secondary: rgba(255,255,255,0.55)
- Text muted: rgba(255,255,255,0.3)
- Borders: rgba(255,255,255,0.06)
- Source Slack: #f472b6, Gmail: #fb7185, Meeting: #60a5fa, Code: #c084fc

## Agent 1: Design System + Layout + Home

### Files to modify:
- `src/index.css` - Add new utility classes
- `src/App.tsx` - Add TopBar to layout
- `src/components/Sidebar.tsx` - Complete redesign
- `src/components/TopBar.tsx` - NEW component
- `src/pages/Home.tsx` - Redesign to match reference

### Changes:

#### index.css additions:
- `.glass-button` - Glass pill button style for action pills and nav
- `.glass-panel` - Slightly lighter glass for content sections
- Refine `.cosmic-orb` for better glow/specular
- Add subtle `text-shadow` utility for headings

#### TopBar.tsx (NEW):
- Sits at top of main content area
- Left: "Recall v1.0" dropdown badge (glass-card, rounded-full)
- Right: "Configuration" button (glass-card, rounded-full, gear icon) + "Export" button (glass-card, rounded-full, upload icon)
- Height ~48px, flex items-center justify-between, px-4

#### Sidebar.tsx redesign:
- Keep 220px width, glass-sidebar
- Top: Logo (same)
- "New Chat" button: glass-card rounded-lg, clock icon + "New Chat", full width
- "Features" section header (uppercase, 11px, text-muted): Chat, Archived, Library
- Divider
- "Workspaces" section header: New Project, Image, Presentation items
- Bottom: "Upgrade to premium" card - glass-card with crown icon, title, description, gradient "Upgrade" button

#### Home.tsx redesign:
- Keep Aurora background + cosmic orb
- Headline: "Ready to Create Something New?" (bigger, bolder)
- Remove subtitle/subheadline
- Action pills: "Search Slack" + tag icon, "Find Decisions" + gavel icon, "Summarize Thread" + summarize icon - glass-card rounded-full, text + icon on right
- Textarea: Same glass-input style but add sparkle icon (auto_awesome) on left of "Ask Anything...", toolbar at bottom (Attach/Settings/Options), right side mic + gradient send button
- Feature cards: 3 glass-card cards with:
  - Top row: icon box (40px, rounded-lg, bg-white/[0.06]) + action badge (right, small pill)
  - Title: bold 14px
  - Description: 12px text-secondary

## Agent 2: Page Polish

### Files to modify:
- `src/pages/Chat.tsx`
- `src/pages/KnowledgeBase.tsx`
- `src/pages/KnowledgeBaseGraph.tsx`
- `src/pages/Sources.tsx`
- `src/pages/Settings.tsx`
- `src/pages/SourceDetail.tsx`
- `src/pages/Search.tsx`

### Design patterns to apply consistently:

#### Cards: Use glass-card class consistently
- Rounded-xl (12px) instead of rounded-lg (8px)
- p-5 or p-6 padding
- Hover: border-white/[0.1], subtle shadow

#### Section headers:
- Uppercase, text-[11px], tracking-wider, text-text-muted, font-semibold
- Use for all section labels

#### Buttons:
- Primary: bg-primary rounded-lg px-4 py-2 text-sm
- Secondary: glass-card rounded-lg px-3 py-1.5 text-sm
- Pill: glass-card rounded-full px-3 py-1.5 text-sm

#### Page headers:
- Title: text-[24px] font-semibold
- Subtitle: text-[14px] text-text-secondary mt-1
- Consistent px-6 py-6 padding

### Per-page changes:

#### Chat.tsx:
- Wrap source cards in a glass panel section
- Refine AI answer text styling - more line-height, better paragraph spacing
- Wrap timeline in a glass-card panel
- Cleaner action buttons with glass hover states
- Right sidebar: glass-card for each section, not just bare elements
- Follow-up input: match Home textarea style (glass-input rounded-xl)

#### KnowledgeBase.tsx:
- Topic cards: glass-card rounded-xl p-5, add subtle gradient icon on left
- Filter input: glass-input rounded-xl
- View toggle: glass-card rounded-full for the container, glass-raised for active

#### KnowledgeBaseGraph.tsx:
- Match KB header styling exactly
- View toggle: same style as KB

#### Sources.tsx:
- Source cards: glass-card rounded-xl p-6
- Stats bar: wrap in glass panel
- Better status badges with glass background
- Add source card: glass-card with dashed border instead of bare dashed

#### Settings.tsx:
- Section containers: glass-card rounded-xl p-6
- Better table styling with glass-card wrapper
- Inputs: glass-input class
- Member cards: glass-card styling

#### SourceDetail.tsx:
- Left panel: Better spacing, glass-card for analyzed sources section
- Code block: glass-card wrapper, better line highlighting
- Experts: glass-card cards for each expert
- Bottom buttons: glass-card rounded-lg

#### Search.tsx:
- Result cards: glass-card rounded-xl
- Filter chips: glass-card rounded-full for each
- AI banner: glass-card with sparkle icon
