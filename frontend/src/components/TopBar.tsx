export function TopBar() {
  return (
    <div className="flex items-center justify-between px-4 py-2.5 border-b border-white/[0.05] bg-surface backdrop-blur-xl shrink-0">
      {/* Left: Model selector */}
      <button type="button" className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass-button text-sm text-text-primary cursor-pointer">
        Recall v1.0
        <span className="material-symbols-outlined text-[16px] text-text-muted">expand_more</span>
      </button>

      {/* Right: Action buttons */}
      <div className="flex items-center gap-2">
        <button type="button" className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass-button text-sm text-text-secondary hover:text-text-primary cursor-pointer">
          Configuration
          <span className="material-symbols-outlined text-[16px]">settings</span>
        </button>
        <button type="button" className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass-button text-sm text-text-secondary hover:text-text-primary cursor-pointer">
          Export
          <span className="material-symbols-outlined text-[16px]">upload</span>
        </button>
      </div>
    </div>
  );
}
