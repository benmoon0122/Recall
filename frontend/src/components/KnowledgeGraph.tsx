import { useCallback, useMemo } from "react";
import {
  GraphCanvas,
  type GraphNode as ReagraphNode,
  type GraphEdge as ReagraphEdge,
} from "reagraph";
import type { GraphData, NodeGroup } from "../types";

interface KnowledgeGraphProps {
  data: GraphData;
  onNodeClick?: (nodeId: string) => void;
}

const GROUP_COLORS: Record<NodeGroup, string> = {
  project: "#8b5cf6",
  data: "#34d399",
  infrastructure: "#60a5fa",
  frontend: "#f472b6",
  security: "#fbbf24",
  devops: "#22d3ee",
};

export function KnowledgeGraph({ data, onNodeClick }: KnowledgeGraphProps) {
  const nodes: ReagraphNode[] = useMemo(
    () =>
      data.nodes.map((n) => ({
        id: n.id,
        label: n.label,
        fill: GROUP_COLORS[n.group],
        size: n.group === "project" ? 3 + n.size * 0.18 : 1.5 + n.size * 0.2,
      })),
    [data.nodes]
  );

  const edges: ReagraphEdge[] = useMemo(
    () =>
      data.edges.map((e, i) => ({
        id: `e-${i}`,
        source: e.source,
        target: e.target,
        size: 0.5 + e.weight * 0.15,
      })),
    [data.edges]
  );

  const handleNodeClick = useCallback(
    (node: ReagraphNode) => {
      onNodeClick?.(node.id);
    },
    [onNodeClick]
  );

  return (
    <div className="w-full h-full" style={{ background: "#07050F" }}>
      <GraphCanvas
        nodes={nodes}
        edges={edges}
        layoutType="forceDirected3d"
        cameraMode="rotate"
        onNodeClick={handleNodeClick}
        labelType="all"
        sizingType="attribute"
        theme={{
          canvas: { background: "#07050F" },
          node: {
            fill: "#8b5cf6",
            activeFill: "#a78bfa",
            opacity: 1,
            selectedOpacity: 1,
            inactiveOpacity: 0.3,
            label: {
              color: "#EDEDEF",
              activeColor: "#FFFFFF",
              stroke: "#07050F",
            },
          },
          edge: {
            fill: "#7A8C9E",
            activeFill: "#a78bfa",
            opacity: 0.6,
            selectedOpacity: 1,
            inactiveOpacity: 0.15,
            label: {
              stroke: "#07050F",
              color: "#ACBAC7",
              activeColor: "#a78bfa",
              fontSize: 6,
            },
          },
          ring: {
            fill: "#a78bfa",
            activeFill: "#8b5cf6",
          },
          arrow: {
            fill: "#ffffff08",
            activeFill: "#8b5cf6",
          },
          lasso: {
            border: "1px solid #8b5cf6",
            background: "rgba(139,92,246,0.1)",
          },
          cluster: {
            stroke: "#474B56",
            opacity: 1,
            selectedOpacity: 1,
            inactiveOpacity: 0.1,
            label: { stroke: "#07050F", color: "#ACBAC7" },
          },
        }}
      />
    </div>
  );
}
