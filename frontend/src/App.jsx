import './App.css'
import recallIcon from './assets/RecallIcon.svg'
import slackCardIcon from './assets/SlackCard.svg'
import meetingCardIcon from './assets/MeetingCard.svg'
import gmailCardIcon from './assets/GmailCard.svg'
import toAskArrowIcon from './assets/ToAskArrow.svg'
import threadsIcon from './assets/threads.svg'
import knowledgeBaseIcon from './assets/knowledge_base.svg'
import projectsIcon from './assets/projects.svg'
import settingsIcon from './assets/settings.svg'
import slackLogo from './assets/slack.png'
import gmailLogo from './assets/gmail.svg'
import meetingsLogo from './assets/meetings.svg'
import notionLogo from './assets/notion.png'
import dbIcon from './assets/DB.svg'
import linkIcon from './assets/link.svg'
import lockIcon from './assets/lock.svg'
import cancelIcon from './assets/cancel.svg'
import { useEffect, useRef, useState } from 'react'

function Icon({ children }) {
  return <span className="icon">{children}</span>
}

function App() {
  const [activeButton, setActiveButton] = useState('menu-threads')
  const [activeChip, setActiveChip] = useState('chip-all')
  const [page, setPage] = useState('home')
  const [query, setQuery] = useState('Why did we choose Postgres over DynamoDB?')
  const [resultTab, setResultTab] = useState('answer')
  const [isManageOpen, setIsManageOpen] = useState(false)
  const [autoConnect, setAutoConnect] = useState(true)
  const [longMemory, setLongMemory] = useState(false)

  const [chats, setChats] = useState([
    {
      id: 'chat-postgres',
      title: 'Why did we choose Postgres over DynamoDB?',
      tags: ['#engineering', 'Architecture Review'],
      resultCount: 11,
      summary:
        'Based on architecture discussions in November 2023, the team chose PostgreSQL for primary transactional workloads due to relational access patterns and operational fit.',
      sections: [
        {
          heading: '1. Complex Relational Queries',
          body: 'Billing, organization, and user data required multi-table joins. Modeling those relationships in DynamoDB would increase complexity and duplicate data management.',
        },
        {
          heading: '2. ACID Compliance for Billing',
          body: 'Strict transactional integrity was required for billing flows. Postgres provided native transactional guarantees with simpler application logic.',
        },
        {
          heading: '3. Team Expertise',
          body: 'The team already had deep production experience with RDS Postgres, reducing migration risk and shortening implementation time.',
        },
      ],
      sources: [
        {
          id: 'src-slack-1',
          title: 'Slack · #engineering · Nov 12, 2023',
          excerpt:
            'Joins across billing and org data are cleaner in Postgres. DynamoDB indexes would be harder to maintain for current access patterns.',
        },
        {
          id: 'src-meeting-1',
          title: 'Architecture Review · Meeting Transcript',
          excerpt:
            'Decision captured: Postgres as system of record for transaction-heavy paths, with DynamoDB reserved for selected key-value scenarios.',
        },
        {
          id: 'src-gmail-1',
          title: 'Gmail · Database migration plan',
          excerpt:
            'SQL flexibility and transactional guarantees were ranked highest for phase one launch; operational familiarity also lowered risk.',
        },
      ],
    },
    {
      id: 'chat-latency',
      title: 'What caused the recent API latency spike?',
      tags: ['#incident', 'Perf Review'],
      resultCount: 9,
      summary:
        'The spike came from cache churn during a deployment window, amplified by connection pool saturation on the read replica.',
      sections: [
        {
          heading: '1. Cache Invalidation Burst',
          body: 'A broad invalidation pattern increased cache misses, causing a sudden jump in origin reads for hot endpoints.',
        },
        {
          heading: '2. Replica Pool Saturation',
          body: 'Read-heavy traffic exhausted available DB connections on the replica, increasing queue times and tail latency.',
        },
        {
          heading: '3. Mitigation',
          body: 'We narrowed invalidation scope, raised replica pool limits, and added request coalescing on hot cache keys.',
        },
      ],
      sources: [
        {
          id: 'src-inc-1',
          title: 'Incident Channel · #api-prod',
          excerpt: 'p95 climbed from 240ms to 1.4s after deploy; cache hit rate dropped from 93% to 61% for /v1/feed.',
        },
        {
          id: 'src-metric-1',
          title: 'Dashboard Notes · Latency Review',
          excerpt: 'Replica connections were pegged at limit for 18 minutes; queue wait contributed most to p99.',
        },
        {
          id: 'src-retro-1',
          title: 'Postmortem Draft',
          excerpt: 'Primary trigger was invalidation fan-out, secondary trigger was insufficient read capacity headroom.',
        },
        {
          id: 'src-retro-2',
          title: 'Pager Timeline',
          excerpt: 'Temporary mitigation restored latency by rebalancing cache and reducing burst fan-out.',
        },
      ],
    },
    {
      id: 'chat-q3',
      title: 'Summarize Q3 planning tradeoffs',
      tags: ['#planning', 'Q3'],
      resultCount: 7,
      summary:
        'Q3 planning prioritized reliability and migration debt over net-new feature surface, with a smaller allocation to growth experiments.',
      sections: [
        {
          heading: '1. Reliability vs Feature Velocity',
          body: 'More engineering weeks were shifted to reliability initiatives, reducing capacity for broad feature expansion.',
        },
        {
          heading: '2. Migration Debt Paydown',
          body: 'Platform migration tasks were pulled forward to de-risk Q4 dependencies and unblock multi-region readiness.',
        },
        {
          heading: '3. Controlled Experiments',
          body: 'Growth work was scoped as narrow experiments with strict success criteria instead of full launches.',
        },
      ],
      sources: [
        {
          id: 'src-plan-1',
          title: 'Q3 Roadmap Doc',
          excerpt: 'Reliability received 42% of capacity; net-new features reduced to 28% to protect launch stability.',
        },
        {
          id: 'src-plan-2',
          title: 'Leadership Notes · Planning',
          excerpt: 'Migration debt was considered a prerequisite for Q4 enterprise commitments.',
        },
        {
          id: 'src-plan-3',
          title: 'FigJam · Allocation Workshop',
          excerpt: 'Experiment budget remains, but each experiment has hard stop criteria and owner accountability.',
        },
      ],
    },
    {
      id: 'chat-rate-limit',
      title: 'How should we structure rate-limit tiers?',
      tags: ['#api', 'Policy'],
      resultCount: 8,
      summary:
        'A tiered model based on request class and burst profile provides fair usage while protecting shared infrastructure.',
      sections: [
        {
          heading: '1. Tier by Workload Type',
          body: 'Separate interactive reads, bulk exports, and write-heavy operations so limits reflect actual system cost.',
        },
        {
          heading: '2. Burst + Sustained Controls',
          body: 'Use token bucket for bursts and rolling-window caps for sustained behavior to reduce abuse and noisy neighbors.',
        },
        {
          heading: '3. Upgrade Path',
          body: 'Expose clear upgrade tiers and headers so customers understand limits and can predict throttling behavior.',
        },
      ],
      sources: [
        {
          id: 'src-rl-1',
          title: 'API Governance RFC',
          excerpt: 'Proposed three tiers with separate read/write budgets and endpoint-specific multipliers.',
        },
        {
          id: 'src-rl-2',
          title: 'Support Escalations · Top Accounts',
          excerpt: 'Most throttling incidents came from bulk jobs scheduled at top-of-hour.',
        },
        {
          id: 'src-rl-3',
          title: 'Benchmark Notes',
          excerpt: 'Burst limits handled normal UX traffic while sustained caps protected backend saturation points.',
        },
        {
          id: 'src-rl-4',
          title: 'Customer Advisory Thread',
          excerpt: 'Clear response headers reduced confusion and improved upgrade conversions.',
        },
      ],
    },
  ])
  const [recentItems, setRecentItems] = useState([
    { id: 'chat-latency' },
    { id: 'chat-q3' },
    { id: 'chat-rate-limit' },
  ])
  const [activeChatId, setActiveChatId] = useState('chat-postgres')

  const primaryNav = [
    { id: 'menu-threads', label: 'Threads', icon: threadsIcon },
    { id: 'menu-kb', label: 'Knowledge Base', icon: knowledgeBaseIcon },
    { id: 'menu-projects', label: 'Projects', icon: projectsIcon },
    { id: 'menu-settings', label: 'Source Management', icon: settingsIcon },
  ]

  const chips = [
    { id: 'chip-all', label: 'All' },
    { id: 'chip-slack', label: 'Slack' },
    { id: 'chip-gmail', label: 'Gmail' },
    { id: 'chip-meetings', label: 'Meetings' },
  ]

  const sourceCards = [
    { id: 'card-slack', type: 'Slack', title: 'Rate limiting discussion', icon: slackCardIcon },
    {
      id: 'card-meeting',
      type: 'Meeting',
      title: 'Architecture Review',
      withPreview: true,
      icon: meetingCardIcon,
    },
    { id: 'card-gmail', type: 'Gmail', title: 'Database migration plan', icon: gmailCardIcon },
  ]

  const sourceCatalog = {
    slack: {
      key: 'slack',
      name: 'Slack',
      subtitle: 'Communication',
      logo: slackLogo,
      primaryLabel: 'Messages',
      primaryValue: '85.2k',
      itemCount: 85200,
      secondaryLabel: 'Last Sync',
      secondaryValue: '5m ago',
    },
    gmail: {
      key: 'gmail',
      name: 'Gmail',
      subtitle: 'Email',
      logo: gmailLogo,
      primaryLabel: 'Emails',
      primaryValue: '12.5k',
      itemCount: 12500,
      secondaryLabel: 'Last Sync',
      secondaryValue: '10m ago',
    },
    meeting: {
      key: 'meeting',
      name: 'Meeting Transcripts',
      subtitle: 'Audio & Video',
      logo: meetingsLogo,
      primaryLabel: 'Transcripts',
      primaryValue: '218',
      itemCount: 218,
      secondaryLabel: 'Last Sync',
      secondaryValue: 'Now',
      meetingStyle: true,
    },
    notion: {
      key: 'notion',
      name: 'Notion',
      subtitle: 'Docs & Wiki',
      logo: notionLogo,
      primaryLabel: 'Pages',
      primaryValue: '4.9k',
      itemCount: 4900,
      secondaryLabel: 'Last Sync',
      secondaryValue: '3m ago',
    },
  }

  const [services, setServices] = useState([
    { id: 'svc-slack', type: 'slack', status: 'connected' },
    { id: 'svc-gmail', type: 'gmail', status: 'connected' },
    { id: 'svc-meeting', type: 'meeting', status: 'connected' },
  ])
  const loadTimers = useRef({})

  const chatContextById = {
    'chat-postgres': {
      relatedEntities: [
        { name: 'Database Architecture', type: 'Concept' },
        { name: 'Backend Team', type: 'Team' },
      ],
      topFileMatches: ['db_migration_plan.md', 'schema.sql'],
    },
    'chat-latency': {
      relatedEntities: [
        { name: 'API Platform', type: 'System' },
        { name: 'SRE On-call', type: 'Team' },
      ],
      topFileMatches: ['incident_2026_02_14.md', 'latency_dashboard_notes.md'],
    },
    'chat-q3': {
      relatedEntities: [
        { name: 'Q3 Roadmap', type: 'Plan' },
        { name: 'Exec Staff', type: 'Stakeholder Group' },
      ],
      topFileMatches: ['q3_allocation_plan.md', 'planning_workshop_notes.md'],
    },
    'chat-rate-limit': {
      relatedEntities: [
        { name: 'API Governance', type: 'Policy' },
        { name: 'Customer Success', type: 'Team' },
      ],
      topFileMatches: ['rate_limit_rfc.md', 'tier_headers_spec.md'],
    },
  }

  const activeChat =
    chats.find((chat) => chat.id === activeChatId) ??
    chats[0] ?? {
      id: 'empty',
      title: 'No chats yet',
      tags: [],
      resultCount: 0,
      summary: 'Create a search to generate a result thread.',
      sections: [],
      sources: [],
      relatedEntities: [],
      topFileMatches: [],
    }
  const activeChatContext = chatContextById[activeChat.id] ?? {
    relatedEntities: activeChat.relatedEntities ?? [
      { name: 'Search Session', type: 'Session' },
      { name: 'Engineering Notes', type: 'Collection' },
    ],
    topFileMatches: activeChat.topFileMatches ?? ['search_context.md', 'decision_log.md'],
  }

  const handlePrimaryNav = (itemId) => {
    setActiveButton(itemId)
    if (itemId === 'menu-threads') setPage('home')
    if (itemId === 'menu-kb') setPage('placeholder')
    if (itemId === 'menu-settings') setPage('service')
    if (itemId === 'menu-projects') setPage('projects')
  }

  const buildChatFromQuery = (input) => {
    const sourceCount = 2 + (input.length % 4)
    const resultCount = 6 + (input.length % 12)
    const sources = Array.from({ length: sourceCount }).map((_, index) => ({
      id: `src-${Date.now()}-${index}`,
      title:
        index % 3 === 0
          ? 'Slack · Team discussion'
          : index % 3 === 1
            ? 'Meeting transcript · Architecture review'
            : 'Project doc · Planning notes',
      excerpt:
        index % 3 === 0
          ? 'Engineers compared options and highlighted implementation risk, effort, and migration concerns.'
          : index % 3 === 1
            ? 'Review notes emphasized reliability and operational simplicity as primary decision constraints.'
            : 'Planning tradeoffs were documented with scoped alternatives and expected downstream impact.',
    }))

    return {
      id: `chat-${Date.now()}`,
      title: input,
      tags: ['#new', 'Quick Search'],
      resultCount,
      summary: `Summary for "${input}": current discussion points emphasize architectural fit, execution risk, and maintainability tradeoffs based on recent team context.`,
      sections: [
        {
          heading: '1. Context Snapshot',
          body: 'Recent notes show this topic appears across planning, implementation, and reliability conversations.',
        },
        {
          heading: '2. Decision Factors',
          body: 'The strongest drivers are delivery risk, operating cost, and future maintainability.',
        },
        {
          heading: '3. Next Step',
          body: 'Confirm assumptions with owners and capture the final decision path in a shared design note.',
        },
      ],
      relatedEntities: [
        { name: 'Search Session', type: 'Session' },
        { name: `Topic: ${input.slice(0, 24)}`, type: 'Topic' },
      ],
      topFileMatches: [
        `${input.toLowerCase().replace(/[^a-z0-9]+/g, '_').slice(0, 18) || 'query'}_notes.md`,
        'decision_log.md',
      ],
      sources,
    }
  }

  const handleSearchSubmit = (event) => {
    event.preventDefault()
    const normalizedQuery = query.trim()
    if (!normalizedQuery) return

    const existingChat = chats.find(
      (chat) => chat.title.toLowerCase() === normalizedQuery.toLowerCase(),
    )
    const nextChat = existingChat ?? buildChatFromQuery(normalizedQuery)

    if (!existingChat) {
      setChats((prev) => [nextChat, ...prev])
    }

    setRecentItems((prev) => {
      const withoutDuplicate = prev.filter((item) => item.id !== nextChat.id)
      return [{ id: nextChat.id }, ...withoutDuplicate].slice(0, 8)
    })

    setActiveChatId(nextChat.id)
    setQuery('')
    setPage('result')
    setResultTab('answer')
    setActiveButton('menu-threads')
  }

  const handleDeleteChat = (chatId) => {
    const updatedChats = chats.filter((chat) => chat.id !== chatId)
    setChats(updatedChats)
    setRecentItems((prev) => prev.filter((item) => item.id !== chatId))
    if (activeChatId === chatId) {
      setActiveChatId(updatedChats[0]?.id ?? null)
    }
  }

  const clearLoadTimer = (serviceId) => {
    if (loadTimers.current[serviceId]) {
      clearTimeout(loadTimers.current[serviceId])
      delete loadTimers.current[serviceId]
    }
  }

  const removeService = (serviceId) => {
    clearLoadTimer(serviceId)
    setServices((prev) => prev.filter((service) => service.id !== serviceId))
  }

  const addService = (serviceType) => {
    if (services.some((service) => service.type === serviceType)) return

    const serviceId = `svc-${serviceType}-${Date.now()}`
    setServices((prev) => [...prev, { id: serviceId, type: serviceType, status: 'loading' }])

    loadTimers.current[serviceId] = setTimeout(() => {
      setServices((prev) =>
        prev.map((service) =>
          service.id === serviceId ? { ...service, status: 'connected' } : service,
        ),
      )
      clearLoadTimer(serviceId)
    }, 2600)
  }

  useEffect(
    () => () => {
      Object.values(loadTimers.current).forEach((timer) => clearTimeout(timer))
    },
    [],
  )

  useEffect(() => {
    if (!isManageOpen) return

    const onKeyDown = (event) => {
      if (event.key === 'Escape') setIsManageOpen(false)
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [isManageOpen])

  const connectedCount = services.filter((service) => service.status === 'connected').length
  const totalItems = services
    .filter((service) => service.status === 'connected')
    .reduce((sum, service) => sum + (sourceCatalog[service.type]?.itemCount ?? 0), 0)
  const missingServiceTypes = Object.keys(sourceCatalog).filter(
    (type) => !services.some((service) => service.type === type),
  )

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand-row">
          <img className="brand-icon" src={recallIcon} alt="Recall" />
          <span>Recall</span>
        </div>

        <nav className="menu-list">
          {primaryNav.map((item) => (
            <button
              className={`menu-item ${activeButton === item.id ? 'active' : ''}`}
              key={item.id}
              onClick={() => handlePrimaryNav(item.id)}
              type="button"
            >
              <Icon>
                <img className="menu-icon" src={item.icon} alt="" />
              </Icon>
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="recent-wrap">
          <p className="recent-title">RECENT</p>
          {recentItems.map((item) => (
            <div className="recent-row" key={item.id}>
              <button
                className={`recent-item ${activeButton === item.id ? 'active' : ''}`}
                onClick={() => {
                  setActiveButton(item.id)
                  setActiveChatId(item.id)
                  setPage('result')
                  setResultTab('answer')
                }}
                type="button"
              >
                <Icon>
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M12 7v5l3 2" />
                    <path d="M12 3a9 9 0 1 1-8.2 5.2" />
                  </svg>
                </Icon>
                <span>{chats.find((chat) => chat.id === item.id)?.title ?? 'Untitled chat'}</span>
              </button>
              <button
                aria-label="Delete chat"
                className="recent-delete"
                onClick={() => handleDeleteChat(item.id)}
                type="button"
              >
                ×
              </button>
            </div>
          ))}
        </div>

        <div className="user-row">
          <div className="avatar">AC</div>
          <span>Alex Chen</span>
        </div>
      </aside>

      <main className="main-content">
        <div className="page-transition" key={`${page}-${activeButton}`}>
          {page === 'home' ? (
            <>
              <div className="content-inner">
                <h1>Search across your universe.</h1>
                <p className="subhead">
                  Connect your engineering context. Ask complex questions. Get cited answers instantly.
                </p>

                <section className="search-shell">
                  <form className="search-top" onSubmit={handleSearchSubmit}>
                    <Icon>
                      <svg viewBox="0 0 24 24" aria-hidden="true">
                        <circle cx="11" cy="11" r="6" />
                        <path d="m20 20-3.5-3.5" />
                      </svg>
                    </Icon>
                    <input
                      className="search-input"
                      value={query}
                      onChange={(event) => setQuery(event.target.value)}
                      placeholder="Ask a question..."
                      type="text"
                    />
                    <button className="kbd" type="submit">
                      Enter
                    </button>
                  </form>
                  <div className="search-bottom">
                    <span className="searching-label">Searching in:</span>
                    {chips.map((chip) => (
                      <button
                        className={`chip ${activeChip === chip.id ? 'chip-active' : ''}`}
                        key={chip.id}
                        onClick={() => setActiveChip(chip.id)}
                        type="button"
                      >
                        {chip.label}
                      </button>
                    ))}
                    <span className="ask-hint">
                      <img className="ask-hint-icon" src={toAskArrowIcon} alt="" />
                      <span>to ask</span>
                    </span>
                  </div>
                </section>

                <section className="source-grid">
                  {sourceCards.map((card) => (
                    <button
                      key={card.id}
                      className={`source-card ${activeButton === card.id ? 'active' : ''}`}
                      onClick={() => setActiveButton(card.id)}
                      type="button"
                    >
                      <span className="source-label">
                        <img className="source-label-icon" src={card.icon} alt="" />
                        {card.type}
                      </span>
                      <div className="source-content">
                        {card.withPreview && <div className="preview-block" />}
                        <p>{card.title}</p>
                      </div>
                    </button>
                  ))}
                </section>
              </div>

              <footer className="footer-row">
                <div className="footer-left">
                  <span className="status-dot" />
                  <span className="status-text">SYSTEMS OPERATIONAL</span>
                  <button
                    className={`footer-link ${activeButton === 'footer-help' ? 'active' : ''}`}
                    onClick={() => setActiveButton('footer-help')}
                    type="button"
                  >
                    Help
                  </button>
                  <button
                    className={`footer-link ${activeButton === 'footer-privacy' ? 'active' : ''}`}
                    onClick={() => setActiveButton('footer-privacy')}
                    type="button"
                  >
                    Privacy
                  </button>
                </div>
                <div className="footer-right">
                  <span>Tab navigate sources</span>
                  <span>↑ ↓ navigate history</span>
                </div>
              </footer>
            </>
          ) : page === 'result' ? (
            <div className="result-layout">
              <section className="result-main">
                <header className="result-toolbar">
                  <button
                    className={`result-tab ${resultTab === 'answer' ? 'active' : ''}`}
                    onClick={() => setResultTab('answer')}
                    type="button"
                  >
                    Answer
                  </button>
                  <button
                    className={`result-tab ${resultTab === 'sources' ? 'active' : ''}`}
                    onClick={() => setResultTab('sources')}
                    type="button"
                  >
                    Sources ({activeChat.sources.length})
                  </button>
                </header>

                <article className="result-content">
                  {resultTab === 'answer' ? (
                    <>
                      <h2>{activeChat.title}</h2>
                      <div className="result-tags">
                        {activeChat.tags.map((tag, index) => (
                          <span
                            className={`result-tag ${index === 0 ? 'result-tag-primary' : ''}`}
                            key={`${activeChat.id}-${tag}`}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>

                      <p className="result-meta">
                        Searched across {activeChat.sources.length} sources · Found {activeChat.resultCount}{' '}
                        results
                      </p>

                      <p>{activeChat.summary}</p>

                      {activeChat.sections.map((section) => (
                        <div key={`${activeChat.id}-${section.heading}`}>
                          <h3>{section.heading}</h3>
                          <p>{section.body}</p>
                        </div>
                      ))}
                    </>
                  ) : (
                    <>
                      <h2>Sources for: {activeChat.title}</h2>
                      <p className="result-meta">
                        {activeChat.sources.length} matched excerpts across related sources
                      </p>
                      <div className="sources-list">
                        {activeChat.sources.map((source) => (
                          <article className="source-item" key={source.id}>
                            <p className="source-item-title">{source.title}</p>
                            <p>{source.excerpt}</p>
                          </article>
                        ))}
                      </div>
                    </>
                  )}
                </article>
              </section>

              <aside className="result-context">
                <section>
                  <p className="context-title">CONTEXT</p>
                </section>

                <section>
                  <p className="context-title">RELATED ENTITIES</p>
                  {activeChatContext.relatedEntities.map((entity) => (
                    <button className="context-item" key={`${activeChat.id}-${entity.name}`} type="button">
                      <span>{entity.name}</span>
                      <small>{entity.type}</small>
                    </button>
                  ))}
                </section>

                <section>
                  <p className="context-title">TOP FILE MATCHES</p>
                  {activeChatContext.topFileMatches.map((file) => (
                    <button className="context-link" key={`${activeChat.id}-${file}`} type="button">
                      {file}
                    </button>
                  ))}
                </section>
              </aside>
            </div>
          ) : page === 'service' ? (
            <div className="service-page">
              <header className="service-header">
                <div>
                  <h2 className="service-title">Source Management</h2>
                  <p className="service-subtitle">Manage your connected data sources and sync status</p>
                  <div className="service-stats">
                    <span>
                      <img src={dbIcon} alt="" />
                      {totalItems.toLocaleString()} Total Items
                    </span>
                    <span>
                      <span className="service-dot" />
                      {connectedCount} Connected
                    </span>
                    <span>2m ago Last Sync</span>
                  </div>
                </div>
                <div className="service-actions">
                  <button className="connect-btn" type="button">
                    <img src={linkIcon} alt="" />
                    Connect New Source
                  </button>
                  <p className="service-note">
                    <img src={lockIcon} alt="" />
                    Only you can search your connected accounts
                  </p>
                </div>
              </header>

              <section className="service-grid">
                {services.map((service) => {
                  const meta = sourceCatalog[service.type]
                  if (!meta) return null

                  return (
                    <article className="integration-card" key={service.id}>
                      <div className="integration-head">
                        <div className="integration-id">
                          <img
                            className={`integration-logo ${meta.meetingStyle ? 'meeting-logo' : ''}`}
                            src={meta.logo}
                            alt=""
                          />
                          <div>
                            <h3>{meta.name}</h3>
                            <p>{meta.subtitle}</p>
                          </div>
                        </div>
                        <div className="integration-head-actions">
                          <span className={service.status === 'loading' ? 'badge-syncing' : 'badge-connected'}>
                            {service.status === 'loading' ? 'Syncing...' : 'Connected'}
                          </span>
                          <button className="remove-btn" onClick={() => removeService(service.id)} type="button">
                            Remove
                          </button>
                        </div>
                      </div>
                      <div className="integration-metrics">
                        <div>
                          <p>{meta.primaryLabel}</p>
                          <strong>{meta.primaryValue}</strong>
                        </div>
                        <div>
                          <p>{meta.secondaryLabel}</p>
                          <strong>{meta.secondaryValue}</strong>
                        </div>
                      </div>

                      {service.status === 'loading' ? (
                        <div className="sync-progress">
                          <p>Connecting source... This may take a moment.</p>
                          <div className="sync-row">
                            <span>Sync in progress</span>
                            <div className="sync-track">
                              <div className="sync-value" />
                            </div>
                            <button className="cancel-btn" onClick={() => removeService(service.id)} type="button">
                              <img src={cancelIcon} alt="" />
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="integration-footer">
                          <span>Auto-sync {autoConnect ? 'enabled' : 'disabled'}</span>
                          <button className="manage-btn" onClick={() => setIsManageOpen(true)} type="button">
                            <img src={settingsIcon} alt="" />
                            Manage
                          </button>
                        </div>
                      )}
                    </article>
                  )
                })}

                <article className="add-card">
                  <button
                    className="plus-icon"
                    onClick={() => {
                      const next = missingServiceTypes[0]
                      if (next) addService(next)
                    }}
                    type="button"
                  >
                    +
                  </button>
                  <h3>Add New Source</h3>
                  <p>Connect Notion, Jira, Linear, and more to expand your knowledge base.</p>
                  <div className="add-options">
                    {missingServiceTypes.length === 0 ? (
                      <span className="add-all-added">All sources added</span>
                    ) : (
                      missingServiceTypes.map((type) => (
                        <button className="add-source-btn" key={type} onClick={() => addService(type)} type="button">
                          Add {sourceCatalog[type].name}
                        </button>
                      ))
                    )}
                  </div>
                </article>
              </section>
            </div>
          ) : (
            <div className="placeholder-page">
              <h2>{activeButton === 'menu-kb' ? 'Knowledge Base' : 'Projects'}</h2>
              <p>
                {activeButton === 'menu-kb'
                  ? 'This page is ready for your knowledge base design.'
                  : 'This page is ready for your next design screen.'}
              </p>
            </div>
          )}
        </div>
      </main>

      {isManageOpen && (
        <div
          aria-hidden="true"
          className="modal-backdrop"
          onClick={() => setIsManageOpen(false)}
          role="presentation"
        >
          <section
            aria-label="Source settings"
            className="manage-modal"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              aria-label="Close settings"
              className="modal-close"
              onClick={() => setIsManageOpen(false)}
              type="button"
            >
              ×
            </button>
            <h3>Source Settings</h3>

            <div className="switch-row">
              <div>
                <p className="switch-title">Auto connect</p>
                <p className="switch-subtext">Off means manual connect.</p>
              </div>
              <button
                aria-pressed={autoConnect}
                className={`toggle ${autoConnect ? 'on' : ''}`}
                onClick={() => setAutoConnect((value) => !value)}
                type="button"
              >
                <span />
              </button>
            </div>

            <div className="switch-row">
              <div>
                <p className="switch-title">Remember 30 days</p>
                <p className="switch-subtext">Off means remember 7 days.</p>
              </div>
              <button
                aria-pressed={longMemory}
                className={`toggle ${longMemory ? 'on' : ''}`}
                onClick={() => setLongMemory((value) => !value)}
                type="button"
              >
                <span />
              </button>
            </div>

            <div className="manual-sync-wrap">
              <button className={`manual-sync-btn ${autoConnect ? 'locked' : ''}`} disabled={autoConnect} type="button">
                {autoConnect && <img src={lockIcon} alt="" />}
                Sync manually
              </button>
              <p className="switch-subtext">
                {autoConnect ? 'Turn off Auto connect to enable manual sync.' : 'Manual sync is enabled.'}
              </p>
            </div>
          </section>
        </div>
      )}
    </div>
  )
}

export default App
