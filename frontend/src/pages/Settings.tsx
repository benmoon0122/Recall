export function Settings() {
  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-6 border-b border-white/[0.06]">
        <div>
          <h1 className="text-[24px] font-heading font-semibold text-text-primary">Settings</h1>
          <p className="text-[14px] text-text-secondary mt-1">
            Manage your account preferences, API keys, and workspace
          </p>
        </div>
        <button className="bg-gradient-to-r from-primary to-[#7B88E3] text-white rounded-xl px-5 py-2.5 text-sm font-semibold shadow-lg shadow-primary/20 hover:opacity-90 transition-opacity cursor-pointer">
          Save Changes
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-4xl mx-auto space-y-10">
          {/* Profile Details */}
          <section>
            <h2 className="text-[18px] font-semibold text-text-primary mb-5">
              Profile Details
            </h2>
            <div className="glass-card rounded-xl p-6">
              {/* Avatar row */}
              <div className="flex items-center gap-5 mb-6">
                <div className="relative group">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-violet-500 to-fuchsia-400 flex items-center justify-center text-2xl font-bold text-white ring-2 ring-primary/20">
                    AC
                  </div>
                  <div className="absolute inset-0 rounded-full bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                    <span className="material-symbols-outlined text-[18px] text-white">edit</span>
                  </div>
                </div>
                <div>
                  <button className="bg-white/[0.04] border border-white/[0.08] hover:bg-white/[0.08] hover:border-white/[0.12] text-text-primary text-sm rounded-lg px-4 py-2 transition-all cursor-pointer">
                    Upload Avatar
                  </button>
                  <p className="text-[12px] text-text-muted mt-1.5">
                    JPG, GIF or PNG. Max size of 800K
                  </p>
                </div>
              </div>

              {/* Name + Email */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[13px] text-text-secondary mb-2">Full Name</label>
                  <div className="glass-input rounded-lg">
                    <input
                      type="text"
                      defaultValue="Alex Chen"
                      className="w-full bg-transparent px-3 py-2.5 text-sm text-text-primary placeholder:text-text-muted outline-none"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[13px] text-text-secondary mb-2">Email Address</label>
                  <div className="glass-input rounded-lg">
                    <input
                      type="email"
                      defaultValue="alex@recall.ai"
                      className="w-full bg-transparent px-3 py-2.5 text-sm text-text-primary placeholder:text-text-muted outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* API Keys */}
          <section>
            <h2 className="text-[18px] font-semibold text-text-primary mb-5">
              API Keys
            </h2>
            <div className="glass-card rounded-xl p-6">
              <div className="flex items-center justify-between mb-5">
                <p className="text-[13px] text-text-secondary">
                  Manage API keys for programmatic access to your workspace.
                </p>
                <button className="flex items-center gap-1.5 text-sm text-primary hover:text-primary-hover transition-colors cursor-pointer font-medium">
                  <span className="material-symbols-outlined text-[18px]">add</span>
                  Create new key
                </button>
              </div>

              {/* Table */}
              <div className="glass-card rounded-xl overflow-hidden">
                {/* Header */}
                <div className="grid grid-cols-[1fr_1fr_1fr_40px] bg-white/[0.04] px-5 py-3">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-text-muted">Name</span>
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-text-muted">Key</span>
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-text-muted">Created</span>
                  <span />
                </div>

                {/* Row 1 */}
                <div className="grid grid-cols-[1fr_1fr_1fr_40px] items-center px-5 py-3.5 border-t border-white/[0.05]">
                  <span className="text-[14px] text-text-primary font-medium">Production</span>
                  <span className="text-[13px] text-text-secondary font-mono">rc_live_8f92...a341</span>
                  <span className="text-[13px] text-text-secondary">Oct 12, 2023</span>
                  <button className="flex items-center justify-center text-text-muted hover:text-text-primary transition-colors cursor-pointer">
                    <span className="material-symbols-outlined text-[18px]">more_vert</span>
                  </button>
                </div>

                {/* Row 2 */}
                <div className="grid grid-cols-[1fr_1fr_1fr_40px] items-center px-5 py-3.5 border-t border-white/[0.05]">
                  <span className="text-[14px] text-text-primary font-medium">Development</span>
                  <span className="text-[13px] text-text-secondary font-mono">rc_test_2b14...c990</span>
                  <span className="text-[13px] text-text-secondary">Nov 05, 2023</span>
                  <button className="flex items-center justify-center text-text-muted hover:text-text-primary transition-colors cursor-pointer">
                    <span className="material-symbols-outlined text-[18px]">more_vert</span>
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* Workspace Members */}
          <section>
            <h2 className="text-[18px] font-semibold text-text-primary mb-5">
              Workspace Members
            </h2>
            <div className="glass-card rounded-xl p-6">
              <div className="flex items-center justify-between mb-5">
                <p className="text-[13px] text-text-secondary">
                  Manage who has access to this workspace.
                </p>
                <button className="flex items-center gap-1.5 text-sm text-primary hover:text-primary-hover transition-colors cursor-pointer font-medium">
                  <span className="material-symbols-outlined text-[18px]">person_add</span>
                  Invite member
                </button>
              </div>

              <div className="space-y-3">
                {/* Member 1 - Alex Chen */}
                <div className="glass-card rounded-xl p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-violet-500 to-fuchsia-400 flex items-center justify-center text-xs font-semibold text-white">
                      AC
                    </div>
                    <div>
                      <div className="text-[14px] font-medium text-text-primary">Alex Chen</div>
                      <div className="text-[12px] text-text-muted">alex@recall.ai</div>
                    </div>
                  </div>
                  <span className="text-[11px] text-text-muted bg-white/[0.06] rounded-md px-2 py-0.5 font-medium">
                    Admin
                  </span>
                </div>

                {/* Member 2 - Sarah Jenkins */}
                <div className="glass-card rounded-xl p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-white/[0.06] flex items-center justify-center text-xs font-semibold text-text-secondary">
                      SJ
                    </div>
                    <div>
                      <div className="text-[14px] font-medium text-text-primary">Sarah Jenkins</div>
                      <div className="text-[12px] text-text-muted">sarah@recall.ai</div>
                    </div>
                  </div>
                  <button className="flex items-center gap-1 text-[11px] font-medium text-text-secondary bg-white/[0.06] rounded-md px-2 py-0.5 hover:bg-white/[0.1] transition-colors cursor-pointer">
                    Member
                    <span className="material-symbols-outlined text-[16px]">expand_more</span>
                  </button>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
