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
  question: { bg: "#1a1040", border: "#7c3aed", text: "#c4b5fd" },
  check: { bg: "#1a1530", border: "#6366f1", text: "#a5b4fc" },
  conclusion: { bg: "#0f1f1a", border: "#10b981", text: "#6ee7b7" },
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
      <div style={{ fontSize: 12, lineHeight: 1.4, color: "#e2e8f0" }}>
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
      labelStyle: { fontSize: 11, fontWeight: 500, fill: "#c4b5fd" },
      labelBgStyle: { fill: "#1a1040", fillOpacity: 0.9 },
      type: "smoothstep",
      style: { strokeWidth: 1.5, stroke: "#6366f1" },
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
        <Background color="#2d2060" gap={20} />
        <Controls showInteractive={false} />
        <MiniMap nodeColor={(n) => NODE_COLORS[(n.data as NodeData).nodeType]?.border ?? "#ccc"} />
      </ReactFlow>
    </div>
  );
}
