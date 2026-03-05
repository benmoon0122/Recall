import { useEffect, useMemo, useRef, useState } from "react";

type SourceStatus = "connected" | "syncing";

interface SourceService {
  id: string;
  name: string;
  category: string;
  icon: string;
  colorClass: string;
  metricLabel: string;
  items: number;
  lastSync: string;
  status: SourceStatus;
  syncProgress: number;
  syncStep: string;
  autoSync: boolean;
  remember30Days: boolean;
}

const INITIAL_SOURCES: SourceService[] = [
  {
    id: "slack",
    name: "Slack",
    category: "Communication",
    icon: "tag",
    colorClass: "text-source-slack",
    metricLabel: "Messages",
    items: 85200,
    lastSync: "5m ago",
    status: "connected",
    syncProgress: 100,
    syncStep: "",
    autoSync: true,
    remember30Days: false,
  },
  {
    id: "gmail",
    name: "Gmail",
    category: "Email",
    icon: "mail",
    colorClass: "text-source-gmail",
    metricLabel: "Emails",
    items: 12500,
    lastSync: "10m ago",
    status: "connected",
    syncProgress: 100,
    syncStep: "",
    autoSync: true,
    remember30Days: false,
  },
  {
    id: "meeting",
    name: "Meeting Transcripts",
    category: "Audio & Video",
    icon: "videocam",
    colorClass: "text-source-meeting",
    metricLabel: "Transcripts",
    items: 218,
    lastSync: "Now",
    status: "connected",
    syncProgress: 100,
    syncStep: "",
    autoSync: true,
    remember30Days: false,
  },
];

const AVAILABLE_SOURCES: SourceService[] = [
  {
    id: "slack",
    name: "Slack",
    category: "Communication",
    icon: "tag",
    colorClass: "text-source-slack",
    metricLabel: "Messages",
    items: 85200,
    lastSync: "Never",
    status: "connected",
    syncProgress: 100,
    syncStep: "",
    autoSync: true,
    remember30Days: false,
  },
  {
    id: "gmail",
    name: "Gmail",
    category: "Email",
    icon: "mail",
    colorClass: "text-source-gmail",
    metricLabel: "Emails",
    items: 12500,
    lastSync: "Never",
    status: "connected",
    syncProgress: 100,
    syncStep: "",
    autoSync: true,
    remember30Days: false,
  },
  {
    id: "meeting",
    name: "Meeting Transcripts",
    category: "Audio & Video",
    icon: "videocam",
    colorClass: "text-source-meeting",
    metricLabel: "Transcripts",
    items: 218,
    lastSync: "Never",
    status: "connected",
    syncProgress: 100,
    syncStep: "",
    autoSync: true,
    remember30Days: false,
  },
  {
    id: "notion",
    name: "Notion",
    category: "Docs",
    icon: "description",
    colorClass: "text-primary",
    metricLabel: "Pages",
    items: 1320,
    lastSync: "Never",
    status: "connected",
    syncProgress: 100,
    syncStep: "",
    autoSync: true,
    remember30Days: false,
  },
  {
    id: "jira",
    name: "Jira",
    category: "Issues",
    icon: "assignment",
    colorClass: "text-primary",
    metricLabel: "Tickets",
    items: 4800,
    lastSync: "Never",
    status: "connected",
    syncProgress: 100,
    syncStep: "",
    autoSync: true,
    remember30Days: false,
  },
  {
    id: "linear",
    name: "Linear",
    category: "Projects",
    icon: "timeline",
    colorClass: "text-primary",
    metricLabel: "Tasks",
    items: 2700,
    lastSync: "Never",
    status: "connected",
    syncProgress: 100,
    syncStep: "",
    autoSync: true,
    remember30Days: false,
  },
];

const SOURCES_STORAGE_KEY = "recall.sources.state.v1";

function compactNumber(value: number) {
  return new Intl.NumberFormat("en-US", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);
}

export function Sources() {
  const [sources, setSources] = useState<SourceService[]>(() => {
    try {
      const raw = localStorage.getItem(SOURCES_STORAGE_KEY);
      if (!raw) return INITIAL_SOURCES;
      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) return INITIAL_SOURCES;
      return parsed as SourceService[];
    } catch {
      return INITIAL_SOURCES;
    }
  });
  const [activeSourceId, setActiveSourceId] = useState<string | null>(null);
  const [addPickerOpen, setAddPickerOpen] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [addLoadingSourceId, setAddLoadingSourceId] = useState<string | null>(null);
  const [manualSyncLoading, setManualSyncLoading] = useState(false);
  const syncTimersRef = useRef<Record<string, number[]>>({});

  const activeSource = sources.find((source) => source.id === activeSourceId) ?? null;

  const totalItems = useMemo(
    () => sources.reduce((sum, source) => sum + source.items, 0),
    [sources]
  );
  const connectedCount = sources.length;
  const lastSyncLabel = sources.find((source) => source.lastSync === "Just now")
    ? "Just now"
    : (sources[0]?.lastSync ?? "-");
  const connectableSources = AVAILABLE_SOURCES.filter(
    (candidate) => !sources.some((source) => source.id === candidate.id)
  );

  useEffect(() => {
    const timer = setTimeout(() => setPageLoading(false), 700);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    localStorage.setItem(SOURCES_STORAGE_KEY, JSON.stringify(sources));
  }, [sources]);

  useEffect(() => {
    return () => {
      Object.values(syncTimersRef.current).forEach((timers) => {
        timers.forEach((timer) => clearTimeout(timer));
      });
      syncTimersRef.current = {};
    };
  }, []);

  useEffect(() => {
    if (!activeSourceId && !addPickerOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setActiveSourceId(null);
        setAddPickerOpen(false);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [activeSourceId, addPickerOpen]);

  function updateSource(sourceId: string, patch: Partial<SourceService>) {
    setSources((prev) =>
      prev.map((source) =>
        source.id === sourceId ? { ...source, ...patch } : source
      )
    );
  }

  function clearSourceTimers(sourceId: string) {
    const timers = syncTimersRef.current[sourceId] ?? [];
    timers.forEach((timer) => clearTimeout(timer));
    delete syncTimersRef.current[sourceId];
  }

  function startSourceSync(sourceId: string, onDone?: () => void, preserveProgress = false) {
    clearSourceTimers(sourceId);
    const current = sources.find((source) => source.id === sourceId);
    const startProgress = preserveProgress ? (current?.syncProgress ?? 35) : 35;

    if (!preserveProgress) {
      updateSource(sourceId, {
        status: "syncing",
        syncProgress: 35,
        syncStep: "Step 1/2: Pulling data...",
        lastSync: "Now",
      });
    }

    const timers: number[] = [];

    if (startProgress < 80) {
      const stepTimer = window.setTimeout(() => {
        updateSource(sourceId, {
          status: "syncing",
          syncProgress: 80,
          syncStep: "Step 2/2: Embedding with Nova...",
        });
      }, preserveProgress ? 400 : 650);
      timers.push(stepTimer);
    }

    const doneTimer = window.setTimeout(() => {
      updateSource(sourceId, {
        status: "connected",
        syncProgress: 100,
        syncStep: "",
        lastSync: "Just now",
      });
      clearSourceTimers(sourceId);
      onDone?.();
    }, startProgress < 80 ? (preserveProgress ? 1100 : 1500) : 500);
    timers.push(doneTimer);

    syncTimersRef.current[sourceId] = timers;
  }

  function openManageModal(sourceId: string) {
    setActiveSourceId(sourceId);
  }

  function closeManageModal() {
    setActiveSourceId(null);
    setManualSyncLoading(false);
  }

  function openAddPicker() {
    if (!connectableSources.length || addLoadingSourceId) return;
    setAddPickerOpen(true);
  }

  function addSourceById(sourceId: string) {
    if (addLoadingSourceId) return;
    const nextSource = connectableSources.find((source) => source.id === sourceId);
    if (!nextSource) return;
    setAddLoadingSourceId(sourceId);
    setTimeout(() => {
      setSources((prev) => [
        ...prev,
        {
          ...nextSource,
          status: "syncing",
          syncProgress: 35,
          syncStep: "Step 1/2: Pulling data...",
          lastSync: "Now",
        },
      ]);
      startSourceSync(nextSource.id);
      setAddLoadingSourceId(null);
      setAddPickerOpen(false);
    }, 700);
  }

  function removeSource(sourceId: string) {
    clearSourceTimers(sourceId);
    setSources((prev) => prev.filter((source) => source.id !== sourceId));
    closeManageModal();
  }

  function runManualSync() {
    if (!activeSource || activeSource.autoSync || manualSyncLoading) return;
    setManualSyncLoading(true);
    startSourceSync(activeSource.id, () => {
      setManualSyncLoading(false);
    });
  }

  function cancelSync(sourceId: string) {
    clearSourceTimers(sourceId);
    updateSource(sourceId, {
      status: "connected",
      syncProgress: 100,
      syncStep: "",
      lastSync: "Just now",
    });
    if (activeSourceId === sourceId) {
      setManualSyncLoading(false);
    }
  }

  useEffect(() => {
    sources.forEach((source) => {
      if (
        source.status === "syncing" &&
        !(syncTimersRef.current[source.id] && syncTimersRef.current[source.id].length)
      ) {
        startSourceSync(source.id, undefined, true);
      }
    });
  }, [sources]);

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden relative">
      <div className="px-6 py-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-[24px] font-semibold text-text-primary">Sources</h1>
            <p className="text-[14px] text-text-secondary mt-1">
              Manage your connected data sources and sync status
            </p>
          </div>
          <button
            type="button"
            onClick={openAddPicker}
            disabled={!connectableSources.length || !!addLoadingSourceId}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
              !connectableSources.length || addLoadingSourceId
                ? "bg-white/[0.08] text-text-muted cursor-not-allowed"
                : "bg-primary hover:bg-primary-hover text-white cursor-pointer"
            }`}
          >
            {addLoadingSourceId ? (
              <span className="inline-block w-4 h-4 border-2 border-white/80 border-t-transparent rounded-full animate-spin" />
            ) : (
              <span className="material-symbols-outlined text-[18px]">add_link</span>
            )}
            {connectableSources.length ? "Connect New Source" : "All Sources Connected"}
          </button>
        </div>

        <div className="glass-card rounded-xl p-5 mt-5">
          <div className="flex items-center gap-8">
            <div>
              <p className="text-[24px] font-semibold text-text-primary leading-tight">
                {compactNumber(totalItems)}
              </p>
              <p className="text-[12px] text-text-secondary mt-0.5">Total Items Indexed</p>
            </div>
            <div className="w-px h-8 bg-white/[0.08]" />
            <div>
              <p className="text-[24px] font-semibold text-text-primary leading-tight">
                {connectedCount}
              </p>
              <p className="text-[12px] text-text-secondary mt-0.5">Connected Sources</p>
            </div>
            <div className="w-px h-8 bg-white/[0.08]" />
            <div>
              <p className="text-[24px] font-semibold text-text-primary leading-tight">{lastSyncLabel}</p>
              <p className="text-[12px] text-text-secondary mt-0.5">Last Sync</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1.5 mt-4 text-[13px] text-text-muted">
          <span className="material-symbols-outlined text-[16px]">lock</span>
          Only you can search your connected accounts.
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        {pageLoading ? (
          <div className="grid grid-cols-3 gap-5">
            {[1, 2, 3].map((id) => (
              <div
                key={id}
                className="h-[305px] rounded-xl bg-white/[0.04] border border-white/[0.06] animate-pulse"
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-5">
            {sources.map((source) => (
              <div key={source.id} className="glass-card rounded-xl p-6 flex flex-col">
                <div className="flex items-start justify-between mb-5">
                  <div className="w-12 h-12 rounded-lg bg-white/[0.04] border border-white/[0.06] flex items-center justify-center">
                    <span className={`material-symbols-outlined text-[24px] ${source.colorClass}`}>
                      {source.icon}
                    </span>
                  </div>
                  {source.status === "connected" ? (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-500/10 backdrop-blur-sm border border-emerald-500/20 text-emerald-400">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                      Connected
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-500/10 backdrop-blur-sm border border-amber-500/20 text-amber-400">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                      Syncing...
                    </span>
                  )}
                </div>

                <h3 className="text-[16px] font-semibold text-text-primary">{source.name}</h3>
                <p className="text-[13px] text-text-secondary mt-0.5 mb-5">{source.category}</p>

                <div className="grid grid-cols-2 gap-3 mb-5">
                  <div className="bg-white/[0.03] border border-white/[0.05] rounded-lg px-3 py-2.5">
                    <p className="text-[11px] text-text-muted">{source.metricLabel}</p>
                    <p className="text-[14px] font-semibold text-text-primary mt-0.5">
                      {compactNumber(source.items)}
                    </p>
                  </div>
                  <div className="bg-white/[0.03] border border-white/[0.05] rounded-lg px-3 py-2.5">
                    <p className="text-[11px] text-text-muted">Last Sync</p>
                    <p className="text-[14px] font-semibold text-text-primary mt-0.5">{source.lastSync}</p>
                  </div>
                </div>

                {source.status === "syncing" && (
                  <>
                    <div className="mb-3">
                      <div className="h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary rounded-full transition-all"
                          style={{ width: `${source.syncProgress}%` }}
                        />
                      </div>
                    </div>
                    <p className="text-[12px] text-text-muted mb-3">{source.syncStep}</p>
                  </>
                )}

                <div className="mt-auto flex items-center justify-between pt-4 border-t border-white/[0.06]">
                  <span className="text-[12px] text-text-muted">
                    {source.status === "syncing"
                      ? `Sync in progress: ${source.syncProgress}%`
                      : source.autoSync
                        ? "Auto-sync enabled"
                        : "Auto-sync disabled"}
                  </span>
                  {source.status === "syncing" ? (
                    <button
                      type="button"
                      onClick={() => cancelSync(source.id)}
                      className="text-[13px] text-red-400 hover:text-red-300 transition-colors cursor-pointer"
                    >
                      Cancel
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => openManageModal(source.id)}
                      className="flex items-center gap-1.5 text-[13px] text-text-secondary hover:text-text-primary transition-colors cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[16px]">settings</span>
                      Manage
                    </button>
                  )}
                </div>
              </div>
            ))}

            <button
              type="button"
              onClick={openAddPicker}
              disabled={!connectableSources.length || !!addLoadingSourceId}
              className={`glass-card rounded-xl border-dashed min-h-[280px] flex flex-col items-center justify-center text-center p-6 group hover:border-primary/30 ${
                !connectableSources.length || addLoadingSourceId
                  ? "cursor-not-allowed opacity-70"
                  : "cursor-pointer"
              }`}
            >
              <div className="w-16 h-16 rounded-full bg-white/[0.04] border border-white/[0.06] flex items-center justify-center mb-4 group-hover:border-primary/30 group-hover:bg-primary/5 transition-all">
                {addLoadingSourceId ? (
                  <span className="inline-block w-6 h-6 border-2 border-text-secondary border-t-transparent rounded-full animate-spin" />
                ) : (
                  <span className="material-symbols-outlined text-[28px] text-text-muted group-hover:text-primary transition-colors">
                    add
                  </span>
                )}
              </div>
              <h3 className="text-[16px] font-semibold text-text-primary mb-1">
                {connectableSources.length ? "Add New Source" : "No More Sources"}
              </h3>
              <p className="text-[13px] text-text-secondary max-w-[240px]">
                {connectableSources.length
                  ? "Choose which service to connect."
                  : "You have connected every available mock service."}
              </p>
            </button>
          </div>
        )}
      </div>

      {addPickerOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/48 backdrop-blur-[1.5px] flex items-center justify-center px-4"
          onClick={() => setAddPickerOpen(false)}
        >
          <div
            className="w-full max-w-[520px] rounded-2xl border border-[#5a4a86]/55 bg-gradient-to-b from-[#120a26]/96 via-[#1a1033]/96 to-[#140b2a]/96 shadow-[0_10px_60px_rgba(0,0,0,0.55)] p-5"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between mb-4">
              <h3 className="text-[22px] font-semibold text-text-primary">Add Service</h3>
              <button
                type="button"
                onClick={() => setAddPickerOpen(false)}
                className="w-8 h-8 rounded-full bg-white/[0.08] hover:bg-white/[0.14] text-text-secondary hover:text-text-primary transition-colors cursor-pointer flex items-center justify-center"
                aria-label="Close add service"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            <div className="space-y-2">
              {connectableSources.length ? (
                connectableSources.map((source) => (
                  <button
                    key={source.id}
                    type="button"
                    onClick={() => addSourceById(source.id)}
                    disabled={!!addLoadingSourceId}
                    className="w-full rounded-xl border border-[#56447d]/55 bg-gradient-to-b from-[#1a1232]/92 to-[#150f2b]/92 px-3.5 py-3 flex items-center justify-between hover:border-primary/45 transition-colors cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    <div className="flex items-center gap-3">
                      <span className={`material-symbols-outlined text-[20px] ${source.colorClass}`}>
                        {source.icon}
                      </span>
                      <div className="text-left">
                        <p className="text-[14px] font-semibold text-text-primary">{source.name}</p>
                        <p className="text-[12px] text-text-secondary">{source.category}</p>
                      </div>
                    </div>
                    {addLoadingSourceId === source.id ? (
                      <span className="inline-block w-4 h-4 border-2 border-text-secondary border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <span className="text-[13px] text-text-secondary">Connect</span>
                    )}
                  </button>
                ))
              ) : (
                <p className="text-[13px] text-text-secondary">All available services are already connected.</p>
              )}
            </div>
          </div>
        </div>
      )}

      {activeSource && (
        <div
          className="fixed inset-0 z-50 bg-black/48 backdrop-blur-[1.5px] flex items-center justify-center px-4"
          onClick={closeManageModal}
        >
          <div
            className="w-full max-w-[450px] rounded-2xl border border-[#5a4a86]/55 bg-gradient-to-b from-[#120a26]/96 via-[#1a1033]/96 to-[#140b2a]/96 shadow-[0_10px_60px_rgba(0,0,0,0.55)] p-5"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between mb-4">
              <h3 className="text-[32px] text-text-primary sr-only">{activeSource.name}</h3>
              <h3 className="text-[22px] font-semibold text-text-primary">Source Settings</h3>
              <button
                type="button"
                onClick={closeManageModal}
                className="w-8 h-8 rounded-full bg-white/[0.08] hover:bg-white/[0.14] text-text-secondary hover:text-text-primary transition-colors cursor-pointer flex items-center justify-center"
                aria-label="Close source settings"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            <p className="text-[13px] text-text-secondary mb-3">{activeSource.name}</p>

            <div className="space-y-2.5">
              <div className="rounded-xl border border-[#56447d]/55 bg-gradient-to-b from-[#1a1232]/92 to-[#150f2b]/92 px-3.5 py-3 flex items-center justify-between">
                <div>
                  <p className="text-[16px] font-semibold text-text-primary leading-tight">Auto connect</p>
                  <p className="text-[13px] text-text-secondary mt-1">Off means manual connect.</p>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    updateSource(activeSource.id, { autoSync: !activeSource.autoSync })
                  }
                  className={`w-12 h-7 rounded-full transition-colors relative border ${
                    activeSource.autoSync
                      ? "bg-[#2b6dd1] border-[#4c8cf0]"
                      : "bg-white/[0.12] border-white/[0.16]"
                  }`}
                  aria-pressed={activeSource.autoSync}
                  aria-label="Toggle auto connect"
                >
                  <span
                    className={`absolute top-0.5 w-6 h-6 rounded-full bg-white transition-all ${
                      activeSource.autoSync ? "left-[22px]" : "left-0.5"
                    }`}
                  />
                </button>
              </div>

              <div className="rounded-xl border border-[#56447d]/55 bg-gradient-to-b from-[#1a1232]/92 to-[#150f2b]/92 px-3.5 py-3 flex items-center justify-between">
                <div>
                  <p className="text-[16px] font-semibold text-text-primary leading-tight">Remember 30 days</p>
                  <p className="text-[13px] text-text-secondary mt-1">Off means remember 7 days.</p>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    updateSource(activeSource.id, {
                      remember30Days: !activeSource.remember30Days,
                    })
                  }
                  className={`w-12 h-7 rounded-full transition-colors relative border ${
                    activeSource.remember30Days
                      ? "bg-[#2b6dd1] border-[#4c8cf0]"
                      : "bg-white/[0.12] border-white/[0.16]"
                  }`}
                  aria-pressed={activeSource.remember30Days}
                  aria-label="Toggle remember duration"
                >
                  <span
                    className={`absolute top-0.5 w-6 h-6 rounded-full bg-white transition-all ${
                      activeSource.remember30Days ? "left-[22px]" : "left-0.5"
                    }`}
                  />
                </button>
              </div>
            </div>

            <button
              type="button"
              onClick={runManualSync}
              disabled={activeSource.autoSync || manualSyncLoading}
              className={`w-full mt-3 rounded-xl border px-3.5 py-2.5 flex items-center justify-center gap-2 ${
                activeSource.autoSync || manualSyncLoading
                  ? "border-white/[0.1] bg-white/[0.06] text-text-muted cursor-not-allowed"
                  : "border-primary/40 bg-primary/15 text-text-primary hover:bg-primary/20 cursor-pointer"
              }`}
            >
              {manualSyncLoading ? (
                <span className="inline-block w-4 h-4 border-2 border-text-secondary border-t-transparent rounded-full animate-spin" />
              ) : (
                <span className="material-symbols-outlined text-[16px]">lock</span>
              )}
              <span className="text-[16px] font-semibold">
                {manualSyncLoading ? "Syncing..." : "Sync manually"}
              </span>
            </button>

            <button
              type="button"
              onClick={() => removeSource(activeSource.id)}
              className="w-full mt-2 rounded-xl border border-red-500/35 bg-red-500/10 hover:bg-red-500/15 text-red-300 px-3.5 py-2.5 text-[15px] font-medium transition-colors cursor-pointer"
            >
              Remove Service
            </button>

            <p className="text-[13px] text-text-secondary mt-2">
              Turn off Auto connect to enable manual sync.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
