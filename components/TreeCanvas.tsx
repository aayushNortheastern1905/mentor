"use client";

import { useCallback, useMemo } from "react";
import {
  ReactFlow,
  Node,
  Edge,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  Handle,
  Position,
  NodeProps,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import type { TreeNode } from "@/lib/types";

interface NodeData {
  text: string;
  nodeType: "question" | "check" | "conclusion";
  selected?: boolean;
  [key: string]: unknown;
}

const NODE_COLORS = {
  question: { bg: "#eff6ff", border: "#93c5fd", text: "#1e40af" },
  check: { bg: "#fffbeb", border: "#fcd34d", text: "#92400e" },
  conclusion: { bg: "#f0fdf4", border: "#86efac", text: "#14532d" },
};

function MentorNode({ data, selected }: NodeProps) {
  const nodeData = data as NodeData;
  const colors = NODE_COLORS[nodeData.nodeType];
  return (
    <div
      style={{
        background: colors.bg,
        borderColor: selected ? "#6366f1" : colors.border,
        borderWidth: selected ? 2 : 1,
        borderStyle: "solid",
        borderRadius: 10,
        padding: "10px 14px",
        maxWidth: 220,
        minWidth: 140,
        boxShadow: selected ? "0 0 0 3px #e0e7ff" : "0 1px 3px rgba(0,0,0,0.08)",
        cursor: "pointer",
      }}
    >
      <Handle type="target" position={Position.Top} style={{ opacity: 0.4 }} />
      <div
        style={{
          fontSize: 9,
          fontWeight: 600,
          textTransform: "uppercase",
          letterSpacing: "0.05em",
          color: colors.text,
          marginBottom: 4,
        }}
      >
        {nodeData.nodeType}
      </div>
      <div style={{ fontSize: 12, lineHeight: 1.4, color: "#1f2937" }}>
        {nodeData.text.length > 120
          ? nodeData.text.slice(0, 117) + "…"
          : nodeData.text}
      </div>
      <Handle type="source" position={Position.Bottom} style={{ opacity: 0.4 }} />
    </div>
  );
}

const nodeTypes = { mentor: MentorNode };

function treeToFlow(
  node: TreeNode,
  x = 0,
  y = 0,
  nodes: Node[] = [],
  edges: Edge[] = [],
  xSpacing = 260,
  ySpacing = 140
): { nodes: Node[]; edges: Edge[]; width: number } {
  const childCount = node.children.length;
  const totalWidth = Math.max(childCount * xSpacing, xSpacing);
  const startX = x - totalWidth / 2 + xSpacing / 2;

  nodes.push({
    id: node.id,
    type: "mentor",
    position: { x: x - 110, y },
    data: { text: node.text, nodeType: node.type },
  });

  node.children.forEach((branch, i) => {
    const childX = startX + i * xSpacing;
    edges.push({
      id: `e-${node.id}-${branch.node.id}`,
      source: node.id,
      target: branch.node.id,
      label: branch.label,
      labelStyle: { fontSize: 11, fontWeight: 500 },
      labelBgStyle: { fill: "#fff", fillOpacity: 0.85 },
      type: "smoothstep",
      style: { strokeWidth: 1.5, stroke: "#94a3b8" },
    });
    treeToFlow(branch.node, childX, y + ySpacing, nodes, edges, xSpacing, ySpacing);
  });

  return { nodes, edges, width: totalWidth };
}

interface Props {
  root: TreeNode;
  selectedId?: string;
  onSelectNode?: (id: string) => void;
}

export function TreeCanvas({ root, selectedId, onSelectNode }: Props) {
  const { nodes: initNodes, edges: initEdges } = useMemo(
    () => treeToFlow(root, 0, 0),
    [root]
  );

  const nodesWithSelection = useMemo(
    () =>
      initNodes.map((n) => ({
        ...n,
        data: { ...n.data, selected: n.id === selectedId },
        selected: n.id === selectedId,
      })),
    [initNodes, selectedId]
  );

  const [nodes, , onNodesChange] = useNodesState(nodesWithSelection);
  const [edges, , onEdgesChange] = useEdgesState(initEdges);

  const handleNodeClick = useCallback(
    (_: React.MouseEvent, node: Node) => {
      onSelectNode?.(node.id);
    },
    [onSelectNode]
  );

  return (
    <div style={{ width: "100%", height: "100%" }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={handleNodeClick}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{ padding: 0.2 }}
        minZoom={0.3}
        maxZoom={2}
        proOptions={{ hideAttribution: true }}
      >
        <Background color="#e2e8f0" gap={20} />
        <Controls showInteractive={false} />
        <MiniMap nodeColor={(n) => NODE_COLORS[(n.data as NodeData).nodeType]?.border ?? "#ccc"} />
      </ReactFlow>
    </div>
  );
}
