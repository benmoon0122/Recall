import { useState, useMemo } from "react";
import { useNavigate } from "react-router";
import { graphData } from "../data/graph";
import type { NodeGroup } from "../types";

const PROJECT_ICONS: Record<string, { icon: string; color: string }> = {
  "aws-migration": { icon: "cloud_upload", color: "#c084fc" },
  "nova-ai": { icon: "auto_awesome", color: "#f472b6" },
  "api-platform": { icon: "api", color: "#60a5fa" },
  "data-lake": { icon: "water", color: "#34d399" },
  "container-platform": { icon: "deployed_code", color: "#22d3ee" },
  "cdn-edge": { icon: "public", color: "#fb7185" },
  "security-compliance": { icon: "shield", color: "#fbbf24" },
};

const GROUP_COLORS: Record<NodeGroup, string> = {
  project: "#8b5cf6",
  data: "#34d399",
  infrastructure: "#60a5fa",
  frontend: "#f472b6",
  security: "#fbbf24",
  devops: "#22d3ee",
};

const GROUP_LABELS: Record<NodeGroup, string> = {
  project: "Project",
  data: "Data",
  infrastructure: "Infra",
  frontend: "Frontend",
  security: "Security",
  devops: "DevOps",
};

const PROJECT_UPDATED: Record<string, string> = {
  "aws-migration": "2h ago",
  "nova-ai": "3h ago",
  "api-platform": "6h ago",
  "data-lake": "1d ago",
  "container-platform": "1d ago",
  "cdn-edge": "3d ago",
  "security-compliance": "5d ago",
};

export function KnowledgeBase() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState("");
  const [expanded, setExpanded] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    graphData.nodes
      .filter((n) => n.group === "project")
      .forEach((n) => {
        initial[n.id] = true;
      });
    return initial;
  });

  const projects = useMemo(() => {
    const projectNodes = graphData.nodes.filter((n) => n.group === "project");
    const techNodes = new Map(
      graphData.nodes
        .filter((n) => n.group !== "project")
        .map((n) => [n.id, n])
    );

    return projectNodes.map((project) => {
      const connectedTech = graphData.edges
        .filter(
          (e) => e.source === project.id || e.target === project.id
        )
        .map((e) => {
          const techId =
            e.source === project.id ? e.target : e.source;
          return { node: techNodes.get(techId)!, weight: e.weight };
        })
        .filter((t) => t.node)
        .sort((a, b) => b.weight - a.weight);

      return { ...project, tech: connectedTech };
    });
  }, []);

  const filtered = useMemo(() => {
    if (!filter) return projects;
    const q = filter.toLowerCase();
    return projects.filter(
      (p) =>
        p.label.toLowerCase().includes(q) ||
        p.tech.some((t) => t.node.label.toLowerCase().includes(q))
    );
  }, [projects, filter]);

  const toggle = (id: string) =>
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="px-6 py-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-[24px] font-heading font-semibold text-text-primary">
              Knowledge Base
            </h1>
            <p className="text-[14px] text-text-secondary mt-1">
              Your team's indexed knowledge
            </p>
          </div>

          {/* Library / Graph toggle */}
          <div className="flex items-center gap-1 rounded-full bg-white/[0.04] border border-white/[0.06] p-1">
            <button
              type="button"
              className="flex items-center gap-1.5 bg-white/[0.1] text-text-primary rounded-full px-3.5 py-1.5 text-sm font-medium cursor-pointer transition-colors"
            >
              <span className="material-symbols-outlined text-[16px]">
                grid_view
              </span>
              Library
            </button>
            <button
              type="button"
              onClick={() => navigate("/knowledge-base/graph")}
              className="flex items-center gap-1.5 text-text-secondary rounded-full px-3.5 py-1.5 text-sm cursor-pointer hover:text-text-primary transition-colors"
            >
              <span className="material-symbols-outlined text-[16px]">
                hub
              </span>
              Graph
            </button>
          </div>
        </div>

        {/* Filter input */}
        <div className="mt-5">
          <div className="glass-input rounded-xl flex items-center">
            <span className="material-symbols-outlined text-[18px] text-text-muted ml-4 pointer-events-none">
              search
            </span>
            <input
              type="text"
              placeholder="Filter projects or topics..."
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="w-full bg-transparent pl-3 pr-4 py-3 text-sm text-text-primary placeholder:text-text-muted outline-none"
            />
          </div>
        </div>
      </div>

      {/* Project sections */}
      <div className="flex-1 overflow-y-auto px-6 pb-6 space-y-3">
        {filtered.map((project) => {
          const icon = PROJECT_ICONS[project.id];
          const isOpen = expanded[project.id] ?? false;

          return (
            <div key={project.id} className="glass-card rounded-xl overflow-hidden">
              {/* Project header — click to expand */}
              <button
                type="button"
                onClick={() => toggle(project.id)}
                className="w-full flex items-center gap-3 px-5 py-4 cursor-pointer hover:bg-white/[0.02] transition-colors"
              >
                <div
                  className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
                  style={{ background: `${icon?.color ?? "#8b5cf6"}15` }}
                >
                  <span
                    className="material-symbols-outlined text-[18px]"
                    style={{ color: icon?.color ?? "#8b5cf6" }}
                  >
                    {icon?.icon ?? "folder"}
                  </span>
                </div>

                <div className="flex-1 text-left min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-[15px] font-semibold text-text-primary truncate">
                      {project.label}
                    </span>
                    <span className="text-[12px] text-text-muted shrink-0">
                      {project.size} sources
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[12px] text-text-tertiary">
                      {project.tech.length} topics
                    </span>
                    <span className="text-[12px] text-text-muted">
                      Updated {PROJECT_UPDATED[project.id] ?? "recently"}
                    </span>
                  </div>
                </div>

                <span
                  className="material-symbols-outlined text-[18px] text-text-muted transition-transform duration-200"
                  style={{
                    transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                  }}
                >
                  expand_more
                </span>
              </button>

              {/* Expanded tech sub-cards */}
              {isOpen && (
                <div className="px-5 pb-4 pt-1">
                  <div className="grid grid-cols-3 gap-2.5">
                    {project.tech.map(({ node, weight }) => (
                      <button
                        key={node.id}
                        type="button"
                        onClick={() =>
                          navigate(
                            `/chat/new?q=${encodeURIComponent(node.label)}`
                          )
                        }
                        className="flex items-center gap-2.5 rounded-lg px-3 py-2.5 bg-white/[0.03] border border-white/[0.04] hover:bg-white/[0.06] hover:border-white/[0.08] transition-all cursor-pointer text-left group"
                      >
                        <span
                          className="w-2 h-2 rounded-full shrink-0"
                          style={{
                            background: GROUP_COLORS[node.group],
                          }}
                        />
                        <div className="min-w-0 flex-1">
                          <span className="text-[13px] text-text-primary group-hover:text-white truncate block">
                            {node.label}
                          </span>
                          <span className="text-[11px] text-text-muted">
                            {GROUP_LABELS[node.group]}
                            <span className="mx-1 opacity-40">
                              ·
                            </span>
                            {weight} refs
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
