"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Background,
  BackgroundVariant,
  Controls,
  type Edge,
  Handle,
  MarkerType,
  MiniMap,
  Position,
  ReactFlow,
  type Node,
  type NodeProps,
  ReactFlowProvider
} from "@xyflow/react";
import { Eye, Layers, MousePointer, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { StageShell } from "@/components/layout/StageShell";
import { OrchestraButton } from "@/components/shared/OrchestraButton";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { dagEdges, dagNodes, type DagNodeData } from "@/lib/mockData";

type FlowNodeData = {
  item: DagNodeData;
  included: boolean;
};

type FlowNode = Node<FlowNodeData, "orchestra">;

const nodeToneMap: Record<DagNodeData["nodeType"], { border: string; bg: string; label: string }> = {
  capability: { border: "rgba(0,212,255,0.35)", bg: "rgba(0,212,255,0.04)", label: "#00d4ff" },
  screen: { border: "rgba(255,255,255,0.14)", bg: "rgba(255,255,255,0.02)", label: "#888888" },
  integration: { border: "rgba(245,158,11,0.35)", bg: "rgba(245,158,11,0.04)", label: "#f59e0b" },
  data: { border: "rgba(139,92,246,0.35)", bg: "rgba(139,92,246,0.04)", label: "#8b5cf6" },
  rule: { border: "rgba(239,68,68,0.35)", bg: "rgba(239,68,68,0.04)", label: "#ef4444" },
  decision: { border: "rgba(245,158,11,0.42)", bg: "rgba(245,158,11,0.06)", label: "#f59e0b" },
  flow: { border: "rgba(255,255,255,0.16)", bg: "rgba(255,255,255,0.03)", label: "#aaaaaa" },
  async: { border: "rgba(59,130,246,0.35)", bg: "rgba(59,130,246,0.04)", label: "#3b82f6" }
};

const nodeTypeStyle = Object.fromEntries(
  Object.entries(nodeToneMap).map(([key, value]) => [
    key,
    {
      chipStyle: {
        borderColor: value.border,
        color: value.label,
        background: value.bg
      },
      dotStyle: {
        background: value.label
      }
    }
  ])
) as Record<DagNodeData["nodeType"], { chipStyle: React.CSSProperties; dotStyle: React.CSSProperties }>;

function OrchestraDagNode({ data, selected }: NodeProps<FlowNode>) {
  const { item, included } = data;
  const tone = nodeToneMap[item.nodeType];
  const isDecision = item.nodeType === "decision";

  return (
    <div
      className={isDecision ? "rotate-45" : ""}
      style={{
        opacity: item.inMVP ? 1 : 0.3,
        boxShadow: item.inMVP ? "0 0 12px rgba(0,212,255,0.14)" : "none"
      }}
    >
      <Handle type="target" position={Position.Left} style={{ opacity: 0 }} />
      <div
        style={{ borderColor: tone.border, background: tone.bg }}
        className={`relative w-[160px] border px-3 py-2.5 ${selected ? "shadow-cyan-glow" : ""}`}
      >
        <div className={isDecision ? "-rotate-45" : ""}>
          <div className="font-mono text-[9px] uppercase tracking-[0.1em]" style={{ color: tone.label }}>
            {item.nodeType}
          </div>
          <div className="mt-1 font-ui text-[11px] font-semibold leading-snug text-white">{item.label}</div>
          <div className="mt-2 flex items-center justify-between">
            <StatusBadge variant={item.priority.toLowerCase() as "p0" | "p1" | "p2"} />
            <div className="font-mono text-[9px] text-text-muted">{item.id}</div>
          </div>
        </div>
        {included ? (
          <span className="absolute bottom-2 left-2 h-1.5 w-1.5 bg-accent-cyan" style={{ borderRadius: 999 }} />
        ) : null}
      </div>
      <Handle type="source" position={Position.Right} style={{ opacity: 0 }} />
    </div>
  );
}

export function Stage3DAG() {
  const router = useRouter();
  const [showMvpOnly, setShowMvpOnly] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>(dagNodes.filter((node) => node.inMVP).map((node) => node.id));
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(dagNodes[0]?.id ?? null);

  useEffect(() => {
    toast("DAG generated — 18 nodes · 21 edges · critical path identified");
  }, []);

  const visibleNodes = useMemo(() => {
    return dagNodes.filter((node) => (showMvpOnly ? node.inMVP : true));
  }, [showMvpOnly]);

  const visibleNodeIds = useMemo(() => new Set(visibleNodes.map((node) => node.id)), [visibleNodes]);

  const flowNodes = useMemo<FlowNode[]>(
    () =>
      visibleNodes.map((item) => ({
        id: item.id,
        type: "orchestra",
        position: item.position,
        data: {
          item,
          included: selectedIds.includes(item.id)
        }
      })),
    [selectedIds, visibleNodes]
  );

  const flowEdges = useMemo<Edge[]>(
    () =>
      dagEdges
        .filter((edge) => visibleNodeIds.has(edge.source) && visibleNodeIds.has(edge.target))
        .map((edge) => ({
          id: edge.id,
          source: edge.source,
          target: edge.target,
          label: edge.label,
          style: {
            stroke: edge.critical ? "#00d4ff" : "#2a2a2a",
            strokeWidth: edge.critical ? 2 : 1,
            strokeDasharray: edge.critical ? undefined : "4 3"
          },
          markerEnd: {
            type: MarkerType.ArrowClosed,
            color: edge.critical ? "#00d4ff" : "#2a2a2a"
          },
          labelStyle: {
            fill: "#4a4a4a",
            fontFamily: "var(--font-mono)",
            fontSize: 9,
            textTransform: "uppercase"
          },
          labelBgPadding: [6, 3],
          labelBgBorderRadius: 2,
          labelBgStyle: {
            fill: "#0a0a0a",
            stroke: "#1e1e1e",
            strokeWidth: 1
          }
        })),
    [visibleNodeIds]
  );

  const selectedNode = dagNodes.find((node) => node.id === selectedNodeId) ?? null;
  const dependsOn = dagEdges.filter((edge) => edge.target === selectedNodeId).map((edge) => edge.source);
  const unlocks = dagEdges.filter((edge) => edge.source === selectedNodeId).map((edge) => edge.target);

  const toggleSelection = (id: string) => {
    setSelectedIds((current) => (current.includes(id) ? current.filter((value) => value !== id) : [...current, id]));
  };

  return (
    <StageShell showGrid className="overflow-hidden">
      <div className="flex h-full flex-col gap-6">
        <SectionHeader title="WORKFLOW DAG" subtitle="Critical path, dependency intelligence, and prototype slice selection" />
        <div className="flex items-center justify-between">
          <div>
            <div className="font-display text-[16px] tracking-[0.14em] text-text-muted">WORKFLOW DAG — ITERATION 1</div>
            <div className="font-mono text-[10px] uppercase tracking-[0.12em] text-accent-cyan">
              18 NODES · 21 EDGES · CRITICAL PATH: N1→N3→N5→N7→N9→N10
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <OrchestraButton variant="ghost" icon={Eye} onClick={() => setShowMvpOnly(true)}>
              MVP PATH ONLY
            </OrchestraButton>
            <OrchestraButton variant="ghost" icon={Layers} onClick={() => setShowMvpOnly(false)}>
              FULL GRAPH
            </OrchestraButton>
            <OrchestraButton variant="primary" icon={MousePointer}>
              SELECT PROTOTYPE SLICE
            </OrchestraButton>
          </div>
        </div>

        <div className="relative min-h-[700px] flex-1 overflow-hidden border border-border bg-[#000000]">
          <ReactFlowProvider>
            <ReactFlow
              nodes={flowNodes}
              edges={flowEdges}
              nodeTypes={{ orchestra: OrchestraDagNode }}
              fitView
              fitViewOptions={{ padding: 0.15 }}
              proOptions={{ hideAttribution: true }}
              style={{ background: "#000000" }}
              onNodeClick={(_, node) => setSelectedNodeId(node.id)}
            >
              <Background variant={BackgroundVariant.Dots} color="#1a1a1a" gap={28} size={1} />
              <MiniMap
                style={{ background: "#080808", border: "1px solid #1e1e1e" }}
                maskColor="rgba(0,0,0,0.7)"
                pannable
              />
              <Controls style={{ background: "#080808", border: "1px solid #1e1e1e" }} />
            </ReactFlow>
          </ReactFlowProvider>

          {selectedNode ? (
            <div className="absolute right-0 top-0 h-full w-[280px] border-l border-border bg-bg-1 p-5">
              <button type="button" onClick={() => setSelectedNodeId(null)} className="ml-auto flex text-text-muted">
                <X size={14} strokeWidth={1.5} />
              </button>
              <div className="relative mb-4 border-b border-[#1e1e1e] pb-4">
                <div className="font-display text-[28px] leading-tight text-white">{selectedNode.label}</div>
                <div
                  className="mt-2 inline-flex items-center gap-1.5 border px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.1em]"
                  style={nodeTypeStyle[selectedNode.nodeType].chipStyle}
                >
                  <div className="h-1.5 w-1.5" style={{ ...nodeTypeStyle[selectedNode.nodeType].dotStyle, borderRadius: 999 }} />
                  {selectedNode.nodeType} NODE
                </div>
              </div>
              <div className="mt-4 grid gap-3">
                <DetailRow label="NODE ID" value={selectedNode.id} accent />
                <div>
                  <div className="mb-1 font-mono text-[10px] uppercase tracking-[0.12em] text-text-muted">PRIORITY</div>
                  <StatusBadge variant={selectedNode.priority.toLowerCase() as "p0" | "p1" | "p2"} />
                </div>
                <DetailRow label="TYPE" value={`${selectedNode.nodeType.toUpperCase()} NODE`} />
                <ChipList title="DEPENDS ON" items={dependsOn} />
                <ChipList title="UNLOCKS" items={unlocks} />
                <div className="mt-2 flex items-center justify-between">
                  <div className="font-mono text-[10px] uppercase tracking-[0.12em] text-text-muted">
                    INCLUDE IN PROTOTYPE SLICE
                  </div>
                  <button
                    type="button"
                    onClick={() => toggleSelection(selectedNode.id)}
                    className={`flex h-6 w-11 items-center border px-1 ${
                      selectedIds.includes(selectedNode.id) ? "border-accent-cyan bg-accent-cyan" : "border-border bg-bg-4"
                    }`}
                  >
                    <span
                      className={`h-3.5 w-3.5 bg-black ${
                        selectedIds.includes(selectedNode.id) ? "ml-auto" : ""
                      }`}
                    />
                  </button>
                </div>
                <div>
                  <div className="mb-1 font-mono text-[10px] uppercase tracking-[0.12em] text-text-muted">DEMO VALUE</div>
                  <div className="flex gap-2">
                    {Array.from({ length: 5 }).map((_, index) => (
                      <span
                        key={index}
                        className={`h-2.5 w-2.5 border ${index < selectedNode.demoValue ? "border-accent-cyan bg-accent-cyan" : "border-border bg-transparent"}`}
                        style={{ borderRadius: 999 }}
                      />
                    ))}
                  </div>
                </div>
              </div>
              <div className="mt-6">
                <OrchestraButton fullWidth variant="primary" onClick={() => router.push("/pm/4-prototype")}>
                  GENERATE PROTOTYPE FROM SLICE →
                </OrchestraButton>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </StageShell>
  );
}

function DetailRow({ label, value, accent = false }: { label: string; value: string; accent?: boolean }) {
  return (
    <div>
      <div className="mb-1 font-mono text-[10px] uppercase tracking-[0.12em] text-text-muted">{label}</div>
      <div className={`font-mono text-[11px] uppercase tracking-[0.08em] ${accent ? "text-accent-cyan" : "text-text-secondary"}`}>{value}</div>
    </div>
  );
}

function ChipList({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <div className="mb-2 font-mono text-[10px] uppercase tracking-[0.12em] text-text-muted">{title}</div>
      <div className="flex flex-wrap gap-2">
        {items.length ? (
          items.map((item) => (
            <span key={item} className="border border-[#2a2a2a] px-2 py-1 font-mono text-[10px] uppercase tracking-[0.1em] text-text-secondary">
              {item}
            </span>
          ))
        ) : (
          <span className="font-mono text-[10px] uppercase tracking-[0.1em] text-text-muted">None</span>
        )}
      </div>
    </div>
  );
}
