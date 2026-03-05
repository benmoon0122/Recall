import { useRef, useCallback, useEffect, useState } from "react";
import type { GraphData } from "../types";

interface KnowledgeGraphProps {
  data: GraphData;
  onNodeClick?: (nodeId: string) => void;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ForceGraphComponent = React.ComponentType<any>;

export function KnowledgeGraph({ data, onNodeClick }: KnowledgeGraphProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });
  const [ForceGraph, setForceGraph] = useState<ForceGraphComponent | null>(
    null
  );
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    import("react-force-graph-2d")
      .then((mod) => {
        setForceGraph(() => mod.default);
      })
      .catch(() => {
        setLoadError(true);
      });
  }, []);

  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setDimensions({
          width: entry.contentRect.width,
          height: entry.contentRect.height,
        });
      }
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  const handleNodeClick = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (node: any) => {
      if (onNodeClick && node.id) {
        onNodeClick(String(node.id));
      }
    },
    [onNodeClick]
  );

  const graphData = {
    nodes: data.nodes.map((n) => ({ ...n })),
    links: data.edges.map((e) => ({
      source: e.source,
      target: e.target,
      weight: e.weight,
    })),
  };

  if (loadError) {
    return (
      <div
        ref={containerRef}
        className="w-full h-full bg-bg flex items-center justify-center"
        style={{ backgroundColor: "#0B0B0C" }}
      >
        <div className="text-center">
          <p className="text-text-muted text-sm mb-4">Knowledge Graph</p>
          <div className="flex flex-wrap gap-2 justify-center max-w-md">
            {data.nodes.map((node) => (
              <button
                key={node.id}
                type="button"
                onClick={() => onNodeClick?.(node.id)}
                className="px-3 py-1.5 rounded-full text-sm text-white cursor-pointer hover:opacity-80 transition-opacity"
                style={{
                  backgroundColor: "#5E6AD2",
                  fontSize: `${Math.max(12, node.size * 2)}px`,
                }}
              >
                {node.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!ForceGraph) {
    return (
      <div
        ref={containerRef}
        className="w-full h-full bg-bg flex items-center justify-center"
        style={{ backgroundColor: "#0B0B0C" }}
      >
        <p className="text-text-muted text-sm animate-pulse">
          Loading graph...
        </p>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="w-full h-full"
      style={{ backgroundColor: "#0B0B0C" }}
    >
      <ForceGraph
        width={dimensions.width}
        height={dimensions.height}
        graphData={graphData}
        backgroundColor="#0B0B0C"
        nodeRelSize={4}
        nodeVal={(node: { size?: number }) => node.size ?? 5}
        nodeColor={() => "#5E6AD2"}
        nodeLabel={(node: { label?: string }) => node.label ?? ""}
        nodeCanvasObject={(
          node: { x?: number; y?: number; size?: number; label?: string },
          ctx: CanvasRenderingContext2D,
          globalScale: number
        ) => {
          const x = node.x ?? 0;
          const y = node.y ?? 0;
          const size = (node.size ?? 5) * 1.5;
          const label = node.label ?? "";

          ctx.beginPath();
          ctx.arc(x, y, size, 0, 2 * Math.PI);
          ctx.fillStyle = "#5E6AD2";
          ctx.fill();

          const fontSize = Math.max(10, 12 / globalScale);
          ctx.font = `${fontSize}px Inter, sans-serif`;
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillStyle = "#FFFFFF";
          ctx.fillText(label, x, y);
        }}
        linkColor={() => "#262626"}
        linkWidth={(link: { weight?: number }) =>
          Math.max(1, Math.min(3, link.weight ?? 1))
        }
        onNodeClick={handleNodeClick}
      />
    </div>
  );
}
