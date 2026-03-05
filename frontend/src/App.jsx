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
import dbIcon from './assets/DB.svg'
import linkIcon from './assets/link.svg'
import lockIcon from './assets/lock.svg'
import cancelIcon from './assets/cancel.svg'
import { useState } from 'react'

function Icon({ children }) {
  return <span className="icon">{children}</span>
}

function App() {
  const [activeButton, setActiveButton] = useState('menu-threads')
  const [activeChip, setActiveChip] = useState('chip-all')
  const [page, setPage] = useState('home')
  const [query, setQuery] = useState('Why did we choose Postgres over DynamoDB?')
  const [isManageOpen, setIsManageOpen] = useState(false)
  const [autoConnect, setAutoConnect] = useState(true)
  const [longMemory, setLongMemory] = useState(false)

  const primaryNav = [
    { id: 'menu-threads', label: 'Threads', icon: threadsIcon },
    { id: 'menu-kb', label: 'Knowledge Base', icon: knowledgeBaseIcon },
    { id: 'menu-projects', label: 'Projects', icon: projectsIcon },
    { id: 'menu-settings', label: 'Service Management', icon: settingsIcon },
  ]

  const recentItems = [
    { id: 'recent-architecture', label: 'Architecture Review' },
    { id: 'recent-api', label: 'API Documentation' },
    { id: 'recent-q3', label: 'Q3 Planning' },
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

  const handlePrimaryNav = (itemId) => {
    setActiveButton(itemId)
    if (itemId === 'menu-threads') setPage('home')
    if (itemId === 'menu-kb') setPage('placeholder')
    if (itemId === 'menu-settings') setPage('service')
    if (itemId === 'menu-projects') setPage('projects')
  }

  const handleSearchSubmit = (event) => {
    event.preventDefault()
    setPage('result')
    setActiveButton('menu-threads')
  }

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
            <button
              className={`recent-item ${activeButton === item.id ? 'active' : ''}`}
              key={item.id}
              onClick={() => setActiveButton(item.id)}
              type="button"
            >
              <Icon>
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M12 7v5l3 2" />
                  <path d="M12 3a9 9 0 1 1-8.2 5.2" />
                </svg>
              </Icon>
              <span>{item.label}</span>
            </button>
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
                <button className="result-tab active" type="button">
                  Answer
                </button>
                <button className="result-tab" type="button">
                  Sources (11)
                </button>
              </header>

              <article className="result-content">
                <h2>{query}</h2>
                <div className="result-tags">
                  <span className="result-tag result-tag-primary">#engineering</span>
                  <span className="result-tag">Architecture Review</span>
                </div>

                <p className="result-meta">Searched across 3 sources · Found 11 results</p>

                <p>
                  Based on architectural discussions in November 2023, the team chose PostgreSQL over
                  DynamoDB for our primary datastore primarily due to complex relational querying
                  requirements and ACID compliance needs.
                </p>

                <h3>1. Complex Relational Queries</h3>
                <p>
                  Our access patterns require complex joins across User, Organization, and Billing
                  entities. DynamoDB would have required maintaining secondary indexes and duplicating
                  data, increasing application complexity.
                </p>

                <h3>2. ACID Compliance for Billing</h3>
                <p>
                  Strict transactional integrity was a hard requirement for the new billing service.
                  Postgres provides native support for this, whereas implementing similar guarantees in
                  DynamoDB requires complex application-level logic.
                </p>

                <h3>3. Team Expertise</h3>
                <p>
                  The engineering team already has deep operational expertise with RDS Postgres,
                  reducing the learning curve and operational risk compared to adopting DynamoDB at
                  scale.
                </p>
              </article>
            </section>

            <aside className="result-context">
              <section>
                <p className="context-title">CONTEXT</p>
              </section>

              <section>
                <p className="context-title">RELATED ENTITIES</p>
                <button className="context-item" type="button">
                  <span>Database Architecture</span>
                  <small>Concept</small>
                </button>
                <button className="context-item" type="button">
                  <span>Backend Team</span>
                  <small>Team</small>
                </button>
              </section>

              <section>
                <p className="context-title">TOP FILE MATCHES</p>
                <button className="context-link" type="button">
                  db_migration_plan.md
                </button>
                <button className="context-link" type="button">
                  schema.sql
                </button>
              </section>
            </aside>
          </div>
          ) : page === 'service' ? (
          <div className="service-page">
            <header className="service-header">
              <div>
                <h2 className="service-title">Service Management</h2>
                <p className="service-subtitle">
                  Manage your connected data sources and sync status
                </p>
                <div className="service-stats">
                  <span>
                    <img src={dbIcon} alt="" />
                    97,756 Total Items
                  </span>
                  <span>
                    <span className="service-dot" />3 Connected
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
              <article className="integration-card">
                <div className="integration-head">
                  <div className="integration-id">
                    <img className="integration-logo" src={slackLogo} alt="" />
                    <div>
                      <h3>Slack</h3>
                      <p>Communication</p>
                    </div>
                  </div>
                  <span className="badge-connected">Connected</span>
                </div>
                <div className="integration-metrics">
                  <div>
                    <p>Messages</p>
                    <strong>85.2k</strong>
                  </div>
                  <div>
                    <p>Last Sync</p>
                    <strong>5m ago</strong>
                  </div>
                </div>
                <div className="integration-footer">
                  <span>Auto-sync enabled</span>
                  <button className="manage-btn" onClick={() => setIsManageOpen(true)} type="button">
                    <img src={settingsIcon} alt="" />
                    Manage
                  </button>
                </div>
              </article>

              <article className="integration-card">
                <div className="integration-head">
                  <div className="integration-id">
                    <img className="integration-logo" src={gmailLogo} alt="" />
                    <div>
                      <h3>Gmail</h3>
                      <p>Email</p>
                    </div>
                  </div>
                  <span className="badge-connected">Connected</span>
                </div>
                <div className="integration-metrics">
                  <div>
                    <p>Emails</p>
                    <strong>12.5k</strong>
                  </div>
                  <div>
                    <p>Last Sync</p>
                    <strong>10m ago</strong>
                  </div>
                </div>
                <div className="integration-footer">
                  <span>Auto-sync enabled</span>
                  <button className="manage-btn" onClick={() => setIsManageOpen(true)} type="button">
                    <img src={settingsIcon} alt="" />
                    Manage
                  </button>
                </div>
              </article>

              <article className="integration-card">
                <div className="integration-head">
                  <div className="integration-id">
                    <img className="integration-logo meeting-logo" src={meetingsLogo} alt="" />
                    <div>
                      <h3>Meeting Transcripts</h3>
                      <p>Audio &amp; Video</p>
                    </div>
                  </div>
                  <span className="badge-syncing">Syncing...</span>
                </div>
                <div className="integration-metrics">
                  <div>
                    <p>Transcripts</p>
                    <strong>218</strong>
                  </div>
                  <div>
                    <p>Last Sync</p>
                    <strong>Now</strong>
                  </div>
                </div>
                <div className="sync-progress">
                  <p>Step 2/2: Embedding with Nova... 156 of 218 transcripts</p>
                  <div className="sync-row">
                    <span>Sync in progress: 72%</span>
                    <div className="sync-track">
                      <div className="sync-value" />
                    </div>
                    <button className="cancel-btn" type="button">
                      <img src={cancelIcon} alt="" />
                      Cancel
                    </button>
                  </div>
                </div>
              </article>

              <article className="add-card">
                <button className="plus-icon" type="button">
                  +
                </button>
                <h3>Add New Source</h3>
                <p>Connect Notion, Jira, Linear, and more to expand your knowledge base.</p>
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
          </section>
        </div>
      )}
    </div>
  )
}

export default App
