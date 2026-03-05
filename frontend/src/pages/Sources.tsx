export function Sources() {
  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="px-6 py-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-[24px] font-heading font-semibold text-text-primary">
              Sources
            </h1>
            <p className="text-[14px] text-text-secondary mt-1">
              Manage your connected data sources and sync status
            </p>
          </div>
          <button
            type="button"
            className="flex items-center gap-2 bg-primary hover:bg-primary-hover text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">
              add_link
            </span>
            Connect New Source
          </button>
        </div>

        {/* Stats bar */}
        <div className="glass-card rounded-xl p-5 mt-5">
          <div className="flex items-center gap-8">
            <div>
              <p className="text-[24px] font-heading font-semibold text-text-primary leading-tight">134,216</p>
              <p className="text-[12px] text-text-secondary mt-0.5">Total Items Indexed</p>
            </div>
            <div className="w-px h-8 bg-white/[0.08]" />
            <div>
              <p className="text-[24px] font-heading font-semibold text-text-primary leading-tight">5</p>
              <p className="text-[12px] text-text-secondary mt-0.5">Connected Sources</p>
            </div>
            <div className="w-px h-8 bg-white/[0.08]" />
            <div>
              <p className="text-[24px] font-heading font-semibold text-text-primary leading-tight">2m ago</p>
              <p className="text-[12px] text-text-secondary mt-0.5">Last Sync</p>
            </div>
          </div>
        </div>

        {/* Privacy line */}
        <div className="flex items-center gap-1.5 mt-4 text-[13px] text-text-muted">
          <span className="material-symbols-outlined text-[16px]">lock</span>
          Only you can search your connected accounts.
        </div>
      </div>

      {/* Content Grid */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="grid grid-cols-3 gap-5">
          {/* Slack Card */}
          <div className="glass-card rounded-xl p-6 flex flex-col">
            <div className="flex items-start justify-between mb-5">
              <div className="w-12 h-12 rounded-lg bg-white/[0.04] border border-white/[0.06] flex items-center justify-center">
                <span className="material-symbols-outlined text-[24px] text-source-slack">
                  tag
                </span>
              </div>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-500/10 backdrop-blur-sm border border-emerald-500/20 text-emerald-400">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                Connected
              </span>
            </div>

            <h3 className="text-[16px] font-semibold text-text-primary">Slack</h3>
            <p className="text-[13px] text-text-secondary mt-0.5 mb-5">
              Communication
            </p>

            <div className="grid grid-cols-2 gap-3 mb-5">
              <div className="bg-white/[0.03] border border-white/[0.05] rounded-lg px-3 py-2.5">
                <p className="text-[11px] text-text-muted">Messages</p>
                <p className="text-[14px] font-semibold text-text-primary mt-0.5">
                  85.2k
                </p>
              </div>
              <div className="bg-white/[0.03] border border-white/[0.05] rounded-lg px-3 py-2.5">
                <p className="text-[11px] text-text-muted">Last Sync</p>
                <p className="text-[14px] font-semibold text-text-primary mt-0.5">
                  2m ago
                </p>
              </div>
            </div>

            <div className="mt-auto flex items-center justify-between pt-4 border-t border-white/[0.06]">
              <span className="text-[12px] text-text-muted">
                Auto-sync enabled
              </span>
              <button
                type="button"
                className="flex items-center gap-1.5 text-[13px] text-text-secondary hover:text-text-primary transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-[16px]">
                  settings
                </span>
                Manage
              </button>
            </div>
          </div>

          {/* Gmail Card */}
          <div className="glass-card rounded-xl p-6 flex flex-col">
            <div className="flex items-start justify-between mb-5">
              <div className="w-12 h-12 rounded-lg bg-white/[0.04] border border-white/[0.06] flex items-center justify-center">
                <span className="material-symbols-outlined text-[24px] text-source-gmail">
                  mail
                </span>
              </div>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-500/10 backdrop-blur-sm border border-emerald-500/20 text-emerald-400">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                Connected
              </span>
            </div>

            <h3 className="text-[16px] font-semibold text-text-primary">Gmail</h3>
            <p className="text-[13px] text-text-secondary mt-0.5 mb-5">Email</p>

            <div className="grid grid-cols-2 gap-3 mb-5">
              <div className="bg-white/[0.03] border border-white/[0.05] rounded-lg px-3 py-2.5">
                <p className="text-[11px] text-text-muted">Emails</p>
                <p className="text-[14px] font-semibold text-text-primary mt-0.5">
                  12.5k
                </p>
              </div>
              <div className="bg-white/[0.03] border border-white/[0.05] rounded-lg px-3 py-2.5">
                <p className="text-[11px] text-text-muted">Last Sync</p>
                <p className="text-[14px] font-semibold text-text-primary mt-0.5">
                  8m ago
                </p>
              </div>
            </div>

            <div className="mt-auto flex items-center justify-between pt-4 border-t border-white/[0.06]">
              <span className="text-[12px] text-text-muted">
                Auto-sync enabled
              </span>
              <button
                type="button"
                className="flex items-center gap-1.5 text-[13px] text-text-secondary hover:text-text-primary transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-[16px]">
                  settings
                </span>
                Manage
              </button>
            </div>
          </div>

          {/* Meeting Notes Card (Syncing) */}
          <div className="glass-card rounded-xl p-6 flex flex-col">
            <div className="flex items-start justify-between mb-5">
              <div className="w-12 h-12 rounded-lg bg-white/[0.04] border border-white/[0.06] flex items-center justify-center">
                <span className="material-symbols-outlined text-[24px] text-source-meeting">
                  videocam
                </span>
              </div>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-500/10 backdrop-blur-sm border border-amber-500/20 text-amber-400">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                Syncing...
              </span>
            </div>

            <h3 className="text-[16px] font-semibold text-text-primary">
              Meeting Notes
            </h3>
            <p className="text-[13px] text-text-secondary mt-0.5 mb-5">
              Audio & Video
            </p>

            <div className="grid grid-cols-2 gap-3 mb-5">
              <div className="bg-white/[0.03] border border-white/[0.05] rounded-lg px-3 py-2.5">
                <p className="text-[11px] text-text-muted">Transcripts</p>
                <p className="text-[14px] font-semibold text-text-primary mt-0.5">
                  418
                </p>
              </div>
              <div className="bg-white/[0.03] border border-white/[0.05] rounded-lg px-3 py-2.5">
                <p className="text-[11px] text-text-muted">Last Sync</p>
                <p className="text-[14px] font-semibold text-text-primary mt-0.5">
                  Now
                </p>
              </div>
            </div>

            {/* Progress bar */}
            <div className="mb-3">
              <div className="h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary rounded-full transition-all"
                  style={{ width: "72%" }}
                />
              </div>
            </div>

            <p className="text-[12px] text-text-muted mb-3">
              Step 2/2: Embedding with Nova...
            </p>

            <div className="mt-auto flex items-center justify-between pt-4 border-t border-white/[0.06]">
              <span className="text-[12px] text-text-secondary">
                Sync in progress: 72%
              </span>
              <button
                type="button"
                className="text-[13px] text-red-400 hover:text-red-300 transition-colors cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>

          {/* GitHub Card */}
          <div className="glass-card rounded-xl p-6 flex flex-col">
            <div className="flex items-start justify-between mb-5">
              <div className="w-12 h-12 rounded-lg bg-white/[0.04] border border-white/[0.06] flex items-center justify-center">
                <span className="material-symbols-outlined text-[24px] text-source-code">
                  code
                </span>
              </div>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-500/10 backdrop-blur-sm border border-emerald-500/20 text-emerald-400">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                Connected
              </span>
            </div>

            <h3 className="text-[16px] font-semibold text-text-primary">GitHub</h3>
            <p className="text-[13px] text-text-secondary mt-0.5 mb-5">
              Source Control
            </p>

            <div className="grid grid-cols-2 gap-3 mb-5">
              <div className="bg-white/[0.03] border border-white/[0.05] rounded-lg px-3 py-2.5">
                <p className="text-[11px] text-text-muted">Commits</p>
                <p className="text-[14px] font-semibold text-text-primary mt-0.5">
                  34.2k
                </p>
              </div>
              <div className="bg-white/[0.03] border border-white/[0.05] rounded-lg px-3 py-2.5">
                <p className="text-[11px] text-text-muted">Last Sync</p>
                <p className="text-[14px] font-semibold text-text-primary mt-0.5">
                  5m ago
                </p>
              </div>
            </div>

            <div className="mt-auto flex items-center justify-between pt-4 border-t border-white/[0.06]">
              <span className="text-[12px] text-text-muted">
                Auto-sync enabled
              </span>
              <button
                type="button"
                className="flex items-center gap-1.5 text-[13px] text-text-secondary hover:text-text-primary transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-[16px]">
                  settings
                </span>
                Manage
              </button>
            </div>
          </div>

          {/* Amazon S3 Documents Card */}
          <div className="glass-card rounded-xl p-6 flex flex-col">
            <div className="flex items-start justify-between mb-5">
              <div className="w-12 h-12 rounded-lg bg-white/[0.04] border border-white/[0.06] flex items-center justify-center">
                <span className="material-symbols-outlined text-[24px] text-[#22d3ee]">
                  cloud
                </span>
              </div>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-500/10 backdrop-blur-sm border border-emerald-500/20 text-emerald-400">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                Connected
              </span>
            </div>

            <h3 className="text-[16px] font-semibold text-text-primary">Amazon S3</h3>
            <p className="text-[13px] text-text-secondary mt-0.5 mb-5">
              Documents & Files
            </p>

            <div className="grid grid-cols-2 gap-3 mb-5">
              <div className="bg-white/[0.03] border border-white/[0.05] rounded-lg px-3 py-2.5">
                <p className="text-[11px] text-text-muted">Documents</p>
                <p className="text-[14px] font-semibold text-text-primary mt-0.5">
                  1.8k
                </p>
              </div>
              <div className="bg-white/[0.03] border border-white/[0.05] rounded-lg px-3 py-2.5">
                <p className="text-[11px] text-text-muted">Last Sync</p>
                <p className="text-[14px] font-semibold text-text-primary mt-0.5">
                  1m ago
                </p>
              </div>
            </div>

            <div className="mt-auto flex items-center justify-between pt-4 border-t border-white/[0.06]">
              <span className="text-[12px] text-text-muted">
                Auto-sync enabled
              </span>
              <button
                type="button"
                className="flex items-center gap-1.5 text-[13px] text-text-secondary hover:text-text-primary transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-[16px]">
                  settings
                </span>
                Manage
              </button>
            </div>
          </div>

          {/* Add New Source Card */}
          <div className="glass-card rounded-xl border-dashed min-h-[280px] flex flex-col items-center justify-center text-center p-6 cursor-pointer group hover:border-primary/30">
            <div className="w-16 h-16 rounded-full bg-white/[0.04] border border-white/[0.06] flex items-center justify-center mb-4 group-hover:border-primary/30 group-hover:bg-primary/5 transition-all">
              <span className="material-symbols-outlined text-[28px] text-text-muted group-hover:text-primary transition-colors">
                add
              </span>
            </div>
            <h3 className="text-[16px] font-semibold text-text-primary mb-1">
              Add New Source
            </h3>
            <p className="text-[13px] text-text-secondary max-w-[240px]">
              Connect Confluence, Jira, Notion, and more
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
