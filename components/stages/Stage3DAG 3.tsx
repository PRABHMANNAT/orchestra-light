"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Background,
  Controls,
  type Edge,
  Handle,
  MarkerType,
  MiniMap,
  Position,
  ReactFlow,
  type ReactFlowInstance,
  ReactFlowProvider,
  type Node,
  type NodeProps,
  ConnectionLineType,
  BackgroundVariant
} from "@xyflow/react";
import { Eye, Layers, MousePointer, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { StageShell } from "@/components/layout/StageShell";
import { OrchestraButton } from "@/components/shared/OrchestraButton";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { dagEdges, dagNodes, type DagNodeData } from "@/lib/mockData";
import { cn } from "@/lib/utils";

type ProductFlowchartNodeData = {
  item: DagNodeData;
  included: boolean;
};

type ProductFlowchartNode = Node<ProductFlowchartNodeData, "orchestra">;
type ProductFlowchartEdge = Edge<{ critical: boolean }>;

const criticalEdgeIds = new Set(["e3", "e4", "e6", "e8", "e10"]);

const flowchartLayoutMap: Record<
  DagNodeData["id"],
  { x: number; y: number; sourcePosition: Position; targetPosition: Position }
> = {
  N4: { x: 780, y: 40, sourcePosition: Position.Bottom, targetPosition: Position.Top },
  N1: { x: 780, y: 170, sourcePosition: Position.Bottom, targetPosition: Position.Top },
  N2: { x: 480, y: 255, sourcePosition: Position.Bottom, targetPosition: Position.Top },
  N3: { x: 1080, y: 255, sourcePosition: Position.Bottom, targetPosition: Position.Top },
  N5: { x: 780, y: 380, sourcePosition: Position.Bottom, targetPosition: Position.Top },
  N6: { x: 480, y: 525, sourcePosition: Position.Bottom, targetPosition: Position.Top },
  N7: { x: 780, y: 540, sourcePosition: Position.Bottom, targetPosition: Position.Top },
  N8: { x: 1080, y: 525, sourcePosition: Position.Bottom, targetPosition: Position.Top },
  N9: { x: 780, y: 710, sourcePosition: Position.Bottom, targetPosition: Position.Top },
  N10: { x: 780, y: 900, sourcePosition: Position.Bottom, targetPosition: Position.Top },
  N11: { x: 320, y: 700, sourcePosition: Position.Bottom, targetPosition: Position.Top },
  N12: { x: 1110, y: 720, sourcePosition: Position.Bottom, targetPosition: Position.Top },
  N13: { x: 180, y: 900, sourcePosition: Position.Bottom, targetPosition: Position.Top },
  N14: { x: 1110, y: 980, sourcePosition: Position.Bottom, targetPosition: Position.Top },
  N15: { x: 500, y: 1000, sourcePosition: Position.Bottom, targetPosition: Position.Top },
  N16: { x: 1380, y: 700, sourcePosition: Position.Bottom, targetPosition: Position.Top },
  N17: { x: 310, y: 1080, sourcePosition: Position.Bottom, targetPosition: Position.Top },
  N18: { x: 1380, y: 980, sourcePosition: Position.Bottom, targetPosition: Position.Top }
};

const nodeTypes = {
  orchestra: ProductFlowchartNodeCard
};

function ProductFlowchartNodeCard({ data, selected }: NodeProps<ProductFlowchartNode>) {
  const { item } = data;

  return (
    <div style={{ opacity: item.inMVP ? 1 : 0.76 }}>
      <Handle type="target" position={Position.Top} style={{ opacity: 0 }} />
      <div
        className={cn(
          "min-w-[140px] rounded-xl border border-[#e0e0e0] bg-white/90 px-4 py-3 text-center shadow-sm backdrop-blur-sm",
          selected ? "border-[#111111] shadow-md" : ""
        )}
      >
        <div className="font-mono text-[10px] tracking-widest text-[#999999]">{item.nodeType.toUpperCase()}</div>
        <div className="mt-1 font-sans text-[13px] font-medium text-[#111111]">{item.label}</div>
      </div>
      <Handle type="source" position={Position.Bottom} style={{ opacity: 0 }} />
    </div>
  );
}

export function Stage3ProductFlowchart() {
  const router = useRouter();
  const [showMvpOnly, setShowMvpOnly] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>(
    dagNodes.filter((node) => node.inMVP).map((node) => node.id)
  );
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(dagNodes[0]?.id ?? null);
  const [flowInstance, setFlowInstance] = useState<ReactFlowInstance | null>(null);

  useEffect(() => {
    toast("Product flowchart generated — 18 nodes · 21 edges · critical path identified");
  }, []);

  const visibleNodes = useMemo(
    () => dagNodes.filter((node) => (showMvpOnly ? node.inMVP : true)),
    [showMvpOnly]
  );
  const visibleNodeIds = useMemo(() => new Set(visibleNodes.map((node) => node.id)), [visibleNodes]);

  useEffect(() => {
    if (!visibleNodes.length) return;

    if (!selectedNodeId || !visibleNodeIds.has(selectedNodeId)) {
      setSelectedNodeId(visibleNodes[0]?.id ?? null);
    }
  }, [selectedNodeId, visibleNodeIds, visibleNodes]);

  useEffect(() => {
    if (!flowInstance) return;

    const frame = window.requestAnimationFrame(() => {
      flowInstance.fitView({
        duration: 500,
        includeHiddenNodes: false,
        padding: 0.2
      });
    });

    return () => window.cancelAnimationFrame(frame);
  }, [flowInstance, showMvpOnly]);

  const flowNodes = useMemo<ProductFlowchartNode[]>(
    () =>
      visibleNodes.map((item) => ({
        id: item.id,
        type: "orchestra",
        position: {
          x: flowchartLayoutMap[item.id].x,
          y: flowchartLayoutMap[item.id].y
        },
        sourcePosition: flowchartLayoutMap[item.id].sourcePosition,
        targetPosition: flowchartLayoutMap[item.id].targetPosition,
        draggable: false,
        data: {
          item,
          included: selectedIds.includes(item.id)
        }
      })),
    [selectedIds, visibleNodes]
  );

  const flowEdges = useMemo<ProductFlowchartEdge[]>(
    () =>
      dagEdges
        .filter((edge) => visibleNodeIds.has(edge.source) && visibleNodeIds.has(edge.target))
        .map((edge) => {
          const isCriticalPath = criticalEdgeIds.has(edge.id);

          return {
            id: edge.id,
            type: "default",
            source: edge.source,
            target: edge.target,
            label: edge.label.toUpperCase(),
            style: {
              stroke: isCriticalPath ? "#111111" : "#d1d5db",
              strokeWidth: isCriticalPath ? 2 : 1.5,
              strokeLinecap: "round"
            },
            markerEnd: {
              type: MarkerType.ArrowClosed,
              color: isCriticalPath ? "#111111" : "#d1d5db",
              width: 14,
              height: 14
            },
            labelStyle: {
              fontSize: 8,
              fontFamily: '"DM Mono", monospace',
              fill: "#bbbbbb",
              letterSpacing: "0.05em"
            },
            labelBgStyle: { fill: "transparent" },
            labelBgPadding: [2, 4],
            data: {
              critical: edge.critical
            }
          };
        }),
    [visibleNodeIds]
  );

  const selectedNode = visibleNodes.find((node) => node.id === selectedNodeId) ?? null;
  const dependsOn = dagEdges.filter((edge) => edge.target === selectedNodeId).map((edge) => edge.source);
  const unlocks = dagEdges.filter((edge) => edge.source === selectedNodeId).map((edge) => edge.target);

  const toggleSelection = (id: string) => {
    setSelectedIds((current) => (current.includes(id) ? current.filter((value) => value !== id) : [...current, id]));
  };

  return (
    <StageShell showGrid>
      <div className="mx-auto max-w-7xl space-y-6">
        <SectionHeader title="PRODUCT FLOWCHART" subtitle="Visual map of your delivery workflow" />

        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="rounded-2xl border border-white/80 bg-white/70 p-5 shadow-glass-sm backdrop-blur-lg">
            <div className="mb-4 font-mono text-[10px] uppercase tracking-widest text-[#999999]">
              FLOWCHART SUMMARY
            </div>
            <div className="font-sans text-[15px] font-semibold text-[#111111]">18 nodes · 21 edges</div>
            <div className="mt-1 font-sans text-[13px] text-[#444444]">
              Critical path: N1 → N3 → N5 → N7 → N9 → N10
            </div>
            <div className="mt-2 font-mono text-[10px] uppercase tracking-widest text-[#999999]">
              Bezier connectors · prototype slice selection enabled
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 rounded-full border border-white/70 bg-white/60 p-1 shadow-glass-sm backdrop-blur-md">
            <OrchestraButton
              variant={showMvpOnly ? "primary" : "ghost"}
              icon={Eye}
              onClick={() => setShowMvpOnly(true)}
              className="rounded-full"
            >
              MVP PATH ONLY
            </OrchestraButton>
            <OrchestraButton
              variant={!showMvpOnly ? "primary" : "ghost"}
              icon={Layers}
              onClick={() => setShowMvpOnly(false)}
              className="rounded-full"
            >
              FULL FLOWCHART
            </OrchestraButton>
            <OrchestraButton variant="ghost" icon={MousePointer} className="rounded-full">
              SELECT PROTOTYPE SLICE
            </OrchestraButton>
          </div>
        </div>

        <div className="w-full overflow-hidden rounded-2xl border border-[#e8e8e8] bg-[#f9fafb]" style={{ height: "600px" }}>
          <ReactFlowProvider>
            <div className="relative h-full w-full">
              <ReactFlow
                nodes={flowNodes}
                edges={flowEdges}
                nodeTypes={nodeTypes}
                onInit={setFlowInstance}
                onNodeClick={(_, node) => setSelectedNodeId(node.id)}
                nodesConnectable={false}
                elementsSelectable
                fitView
                fitViewOptions={{ padding: 0.2 }}
                connectionLineType={ConnectionLineType.Bezier}
                defaultEdgeOptions={{
                  type: "default",
                  style: {
                    stroke: "#d1d5db",
                    strokeWidth: 1.5,
                    strokeLinecap: "round"
                  },
                  markerEnd: {
                    type: MarkerType.ArrowClosed,
                    color: "#d1d5db",
                    width: 14,
                    height: 14
                  },
                  animated: false
                }}
                preventScrolling={false}
                zoomOnScroll={false}
                panOnScroll={false}
                panOnDrag={true}
                zoomOnPinch={true}
                minZoom={0.3}
                maxZoom={2}
                proOptions={{ hideAttribution: true }}
              >
                <Background variant={BackgroundVariant.Dots} color="#e5e7eb" gap={20} size={1} />
                <MiniMap
                  pannable
                  className="!bottom-4 !right-4 !top-auto"
                  style={{ background: "rgba(255,255,255,0.92)", border: "1px solid #e8e8e8" }}
                  maskColor="rgba(255,255,255,0.72)"
                  nodeColor={() => "#ffffff"}
                />
                <Controls
                  className="!bottom-4 !left-4 !top-auto"
                  style={{ background: "rgba(255,255,255,0.92)", border: "1px solid #e8e8e8" }}
                />
              </ReactFlow>

              {selectedNode ? (
                <div className="absolute right-0 top-0 z-10 h-full w-[320px] overflow-y-auto border-l border-white/70 bg-white/80 shadow-glass-lg backdrop-blur-2xl">
                  <div className="p-5">
                    <button
                      type="button"
                      onClick={() => setSelectedNodeId(null)}
                      className="ml-auto flex text-[#666666] hover:text-[#111111]"
                    >
                      <X size={14} strokeWidth={1.5} />
                    </button>

                    <div className="border-b border-[#f0f0f0] pb-4">
                      <div className="font-sans text-[24px] font-semibold leading-tight tracking-tight text-[#111111]">
                        {selectedNode.label}
                      </div>
                      <div className="mt-2 inline-flex items-center rounded-full border border-[#e0e0e0] px-2.5 py-1 font-mono text-[10px] uppercase tracking-widest text-[#999999]">
                        {selectedNode.nodeType}
                      </div>
                    </div>

                    <div className="mt-4 grid gap-4">
                      <DetailRow label="NODE ID" value={selectedNode.id} />
                      <div>
                        <div className="mb-1 font-mono text-[10px] uppercase tracking-widest text-[#999999]">PRIORITY</div>
                        <StatusBadge variant={selectedNode.priority.toLowerCase() as "p0" | "p1" | "p2"} />
                      </div>
                      <DetailRow label="TYPE" value={`${selectedNode.nodeType.toUpperCase()} NODE`} />
                      <ChipList title="DEPENDS ON" items={dependsOn} />
                      <ChipList title="UNLOCKS" items={unlocks} />

                      <div className="flex items-center justify-between">
                        <div className="font-mono text-[10px] uppercase tracking-widest text-[#999999]">
                          INCLUDE IN PROTOTYPE SLICE
                        </div>
                        <button
                          type="button"
                          onClick={() => toggleSelection(selectedNode.id)}
                          className={cn(
                            "flex h-6 w-11 items-center rounded-full border px-1 transition-colors",
                            selectedIds.includes(selectedNode.id)
                              ? "border-[#111111] bg-[#111111]"
                              : "border-[#d8d8d8] bg-[#f3f3f3]"
                          )}
                        >
                          <span
                            className={cn(
                              "h-4 w-4 rounded-full bg-white transition-transform",
                              selectedIds.includes(selectedNode.id) ? "translate-x-5" : "translate-x-0"
                            )}
                          />
                        </button>
                      </div>

                      <div>
                        <div className="mb-2 font-mono text-[10px] uppercase tracking-widest text-[#999999]">DEMO VALUE</div>
                        <div className="flex gap-2">
                          {Array.from({ length: 5 }).map((_, index) => (
                            <span
                              key={index}
                              className={cn(
                                "h-2.5 w-2.5 rounded-full border",
                                index < selectedNode.demoValue
                                  ? "border-[#111111] bg-[#111111]"
                                  : "border-[#d9d9d9] bg-transparent"
                              )}
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
                </div>
              ) : null}
            </div>
          </ReactFlowProvider>
        </div>
      </div>
    </StageShell>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="mb-1 font-mono text-[10px] uppercase tracking-widest text-[#999999]">{label}</div>
      <div className="font-sans text-[13px] text-[#111111]">{value}</div>
    </div>
  );
}

function ChipList({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <div className="mb-2 font-mono text-[10px] uppercase tracking-widest text-[#999999]">{title}</div>
      <div className="flex flex-wrap gap-2">
        {items.length ? (
          items.map((item) => (
            <span
              key={item}
              className="rounded-full border border-[#e0e0e0] px-2.5 py-1 font-mono text-[10px] uppercase tracking-widest text-[#555555]"
            >
              {item}
            </span>
          ))
        ) : (
          <span className="font-mono text-[10px] uppercase tracking-widest text-[#999999]">None</span>
        )}
      </div>
    </div>
  );
}
