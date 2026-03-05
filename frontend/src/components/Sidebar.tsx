import { Link, useLocation } from "react-router";

const navItems = [
  { label: "Threads", path: "/", icon: "forum" },
  { label: "Knowledge Base", path: "/knowledge-base", icon: "library_books" },
  { label: "Sources", path: "/sources", icon: "link" },
  { label: "Settings", path: "/settings", icon: "settings" },
];

const recentItems = [
  { label: "Postgres Rate Limits", path: "/chat/1" },
  { label: "React Perf Audit", path: "/chat/2" },
  { label: "Q3 Planning", path: "/chat/3" },
];

export function Sidebar() {
  const location = useLocation();

  function isActive(path: string) {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  }

  return (
    <aside className="w-[220px] flex-shrink-0 flex flex-col glass-sidebar h-full z-20">
      {/* Logo */}
      <div className="p-4 flex items-center gap-2.5">
        <div className="w-7 h-7 rounded-lg bg-white/[0.06] border border-white/[0.08] flex items-center justify-center">
          <span className="material-symbols-outlined text-[18px] text-white">memory</span>
        </div>
        <span className="text-[15px] font-semibold tracking-tight text-primary">Recall</span>
      </div>

      {/* New Chat button */}
      <div className="px-3 mb-3">
        <Link
          to="/"
          className="flex items-center gap-2.5 w-full px-3 py-2.5 rounded-lg glass-card text-sm text-text-primary font-medium cursor-pointer"
        >
          <span className="material-symbols-outlined text-[18px] text-text-secondary">schedule</span>
          New Chat
          <span className="material-symbols-outlined text-[16px] text-text-muted ml-auto">add</span>
        </Link>
      </div>

      {/* Nav items */}
      <nav className="flex-1 flex flex-col gap-0.5 px-2 pt-1">
        {navItems.map((item) => {
          const active = isActive(item.path);
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-all group ${
                active
                  ? "bg-primary/15 text-primary"
                  : "text-text-secondary hover:bg-white/[0.06] hover:text-text-primary"
              }`}
            >
              <span
                className={`material-symbols-outlined text-[20px] transition-colors ${
                  active ? "text-primary" : "text-text-muted group-hover:text-text-secondary"
                }`}
              >
                {item.icon}
              </span>
              <span className="text-sm font-medium">{item.label}</span>
            </Link>
          );
        })}

        {/* Recent section */}
        <div className="mt-4 pt-4 border-t border-white/[0.06] px-1">
          <p className="text-[11px] font-semibold text-text-muted uppercase tracking-wider mb-2 px-2">
            Recent
          </p>
          <div className="flex flex-col gap-0.5">
            {recentItems.map((item) => {
              const active = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-2.5 px-2 py-1.5 rounded-lg transition-all group ${
                    active
                      ? "bg-primary/15 text-primary"
                      : "text-text-secondary hover:bg-white/[0.06] hover:text-text-primary"
                  }`}
                >
                  <span
                    className={`material-symbols-outlined text-[8px] ${
                      active ? "text-primary" : "text-text-muted group-hover:text-text-secondary"
                    }`}
                  >
                    fiber_manual_record
                  </span>
                  <span className="text-sm font-medium truncate">{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </nav>

      {/* User profile */}
      <div className="p-3 border-t border-white/[0.06]">
        <div className="flex items-center gap-2.5 px-2 py-1.5 rounded-lg hover:bg-white/[0.06] transition-all cursor-pointer">
          <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-violet-500 to-fuchsia-400 flex items-center justify-center flex-shrink-0 ring-2 ring-primary/20">
            <span className="text-xs font-semibold text-white">AC</span>
          </div>
          <div className="flex flex-col min-w-0">
            <p className="text-sm font-medium text-text-primary truncate">Alex Chen</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
