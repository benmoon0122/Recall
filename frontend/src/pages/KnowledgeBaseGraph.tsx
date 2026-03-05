import { useNavigate } from "react-router";
import { KnowledgeGraph } from "../components/KnowledgeGraph";
import { graphData } from "../data/graph";

export function KnowledgeBaseGraph() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Header row — matches KnowledgeBase exactly */}
      <div className="px-6 py-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-[24px] font-semibold text-text-primary">
              Knowledge Base
            </h1>
            <p className="text-[14px] text-text-secondary mt-1">
              Your team's indexed knowledge
            </p>
          </div>

          {/* View toggle — glass rounded-full, matches KnowledgeBase */}
          <div className="flex items-center gap-1 rounded-full bg-white/[0.04] border border-white/[0.06] p-1">
            <button
              type="button"
              onClick={() => navigate("/knowledge-base")}
              className="flex items-center gap-1.5 text-text-secondary rounded-full px-3.5 py-1.5 text-sm cursor-pointer hover:text-text-primary transition-colors"
            >
              <span className="material-symbols-outlined text-[16px]">grid_view</span>
              Library
            </button>
            <button
              type="button"
              className="flex items-center gap-1.5 bg-white/[0.1] text-text-primary rounded-full px-3.5 py-1.5 text-sm font-medium cursor-pointer transition-colors"
            >
              <span className="material-symbols-outlined text-[16px]">hub</span>
              Graph
            </button>
          </div>
        </div>
      </div>

      {/* Graph fills remaining space — wrapped in glass-card */}
      <div className="flex-1 min-h-0 px-6 pb-6">
        <div className="glass-card rounded-xl overflow-hidden h-full">
          <KnowledgeGraph
            data={graphData}
            onNodeClick={(nodeId) => {
              const node = graphData.nodes.find((n) => n.id === nodeId);
              if (node) {
                navigate(`/chat/new?q=${encodeURIComponent(node.label)}`);
              }
            }}
          />
        </div>
      </div>
    </div>
  );
}
