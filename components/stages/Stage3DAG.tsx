"use client";

import { useMemo, useState } from "react";
import type React from "react";
import {
  Background,
  BackgroundVariant,
  Controls,
  Handle,
  MarkerType,
  MiniMap,
  Position,
  ReactFlow,
  ReactFlowProvider,
  type Edge,
  type Node,
  type NodeProps
} from "@xyflow/react";
import { AnimatePresence, motion } from "framer-motion";
import { Lock, X } from "lucide-react";
import { useRouter } from "next/navigation";

import { StageShell } from "@/components/layout/StageShell";
import { OrchestraButton } from "@/components/shared/OrchestraButton";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Badge } from "@/components/ui/badge";
import {
  EASE_EXPO,
  cardHover,
  drawerSlide,
  fadeSlideUp,
  fadeSlideUpFast,
  livePulse,
  pageContainer,
  staggerContainer
} from "@/lib/animations";
import { mockChanges, mockDecisions, mockThreads, mockWorkflowDAG } from "@/lib/mockData";
import { getIntelRoute } from "@/lib/stageConfig";
import type { DAGNode, DAGNodeType } from "@/lib/types";

type FlowNodeData = {
  node: DAGNode;
  displayId: string;
};

type FlowNode = Node<FlowNodeData, "nodeCard">;

const nodePositions: Record<string, { x: number; y: number }> = {
  "node-payments": { x: 60, y: 220 },
  "node-buyer-ordering": { x: 330, y: 120 },
  "node-florist-dashboard": { x: 610, y: 120 },
  "node-driver-assign": { x: 890, y: 220 },
  "node-admin-panel": { x: 1160, y: 110 },
  "node-notifications": { x: 330, y: 360 },
  "node-subscription": { x: 610, y: 380 },
  "node-driver-api-risk": { x: 890, y: 420 }
};

function nodeMeta(type: DAGNodeType, node: DAGNode) {
  if (node.isUnresolved || type === "unresolved") {
    return {
      color: "var(--amber)",
      border: "var(--amber-border)",
      bg: "var(--amber-dim)",
      label: "UNRESOLVED",
      badge: "in-review" as const,
      dashed: true,
      pulse: true
    };
  }

  if (node.isRisky || type === "risk") {
    return {
      color: "var(--amber)",
      border: "var(--amber-border)",
      bg: "var(--amber-dim)",
      label: "RISK",
      badge: "p1" as const,
      dashed: false,
      pulse: true
    };
  }

  if (type === "integration") {
    return {
      color: "var(--blue)",
      border: "var(--blue-border)",
      bg: "var(--blue-dim)",
      label: "INTEGRATION",
      badge: "new" as const,
      dashed: false,
      pulse: false
    };
  }

  if (type === "approval") {
    return {
      color: "var(--violet)",
      border: "var(--violet-border)",
      bg: "var(--violet-dim)",
      label: "APPROVAL",
      badge: "revised" as const,
      dashed: false,
      pulse: false
    };
  }

  return {
    color: node.isCriticalPath ? "var(--cyan)" : "var(--text-muted)",
    border: node.isCriticalPath ? "var(--cyan-border)" : "rgba(255,255,255,0.08)",
    bg: node.isCriticalPath ? "var(--cyan-dim)" : "rgba(255,255,255,0.02)",
    label: type.toUpperCase(),
    badge: node.isCriticalPath ? ("in-progress" as const) : ("todo" as const),
    dashed: false,
    pulse: false
  };
}

function NodeCard({ data, selected }: NodeProps<FlowNode>) {
  const meta = nodeMeta(data.node.type, data.node);

  return (
    <motion.div initial={{ opacity: 0, scale: 0.86 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.35, ease: EASE_EXPO }}>
      <Handle type="target" position={Position.Left} style={{ background: meta.color, width: 8, height: 8, border: "1px solid rgba(0,0,0,0.5)" }} />
      <motion.div initial="rest" animate="rest" whileHover="hover" variants={cardHover}>
        <div
          className="glass-sm rounded-xl px-4 py-4"
          style={{
            minWidth: 214,
            minHeight: 92,
            border: `${selected ? "1px" : "1px"} ${meta.dashed ? "dashed" : "solid"} ${selected ? "var(--cyan)" : meta.border}`,
            background: meta.bg,
            boxShadow: selected ? "0 0 0 1px rgba(0,229,204,0.18), 0 12px 32px rgba(0,0,0,0.45)" : "0 0 20px rgba(0,0,0,0.2)"
          }}
        >
          <div className="flex items-center justify-between">
            <div className="font-mono text-[9px] tracking-[0.12em] text-[var(--text-muted)]">{data.displayId}</div>
            {meta.pulse ? (
              <motion.span variants={livePulse} initial="hidden" animate="show" className="h-[6px] w-[6px] rounded-full" style={{ background: meta.color }} />
            ) : (
              <span className="h-[6px] w-[6px] rounded-full" style={{ background: meta.color }} />
            )}
          </div>
          <div className="mt-2 font-ui text-[13px] font-medium leading-tight text-[var(--text-primary)]">{data.node.label}</div>
          <div className="mt-3 flex items-center gap-2">
            <StatusBadge variant={meta.badge}>{meta.label}</StatusBadge>
            {data.node.isCriticalPath ? <Badge variant="cyan">CRITICAL</Badge> : null}
          </div>
        </div>
      </motion.div>
      <Handle type="source" position={Position.Right} style={{ background: meta.color, width: 8, height: 8, border: "1px solid rgba(0,0,0,0.5)" }} />
    </motion.div>
  );
}

const nodeTypes = { nodeCard: NodeCard };

function DetailGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <motion.div variants={fadeSlideUpFast}>
      <div className="mb-2 font-mono text-[9px] uppercase tracking-[0.14em] text-[var(--text-muted)]">{title}</div>
      <div className="space-y-2">{children}</div>
    </motion.div>
  );
}

export function Stage3ProductFlowchart({ projectId = "bloomfast" }: { projectId?: string }) {
  const router = useRouter();
  const [accepted, setAccepted] = useState(mockWorkflowDAG.accepted);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(mockWorkflowDAG.nodes[0]?.id ?? null);
  const selectedNode = mockWorkflowDAG.nodes.find((node) => node.id === selectedNodeId) ?? null;

  const flowNodes = useMemo<FlowNode[]>(
    () =>
      mockWorkflowDAG.nodes.map((node, index) => ({
        id: node.id,
        type: "nodeCard",
        position: nodePositions[node.id] ?? { x: index * 260, y: 180 },
        draggable: true,
        data: { node, displayId: `N-${String(index + 1).padStart(2, "0")}` }
      })),
    []
  );

  const flowEdges = useMemo<Edge[]>(
    () =>
      mockWorkflowDAG.edges.map((edge) => ({
        id: edge.id,
        source: edge.from,
        target: edge.to,
        label: edge.label,
        type: "smoothstep",
        animated: Boolean(edge.isCritical),
        style: {
          stroke: edge.isCritical ? "var(--amber)" : "rgba(0,229,204,0.22)",
          strokeWidth: edge.isCritical ? 2 : 1.5
        },
        labelStyle: {
          fill: "var(--text-muted)",
          fontFamily: "var(--font-mono)",
          fontSize: 9
        },
        markerEnd: {
          type: MarkerType.ArrowClosed,
          color: edge.isCritical ? "#fbbf24" : "rgba(0,229,204,0.42)"
        }
      })),
    []
  );

  const linkedThreads = selectedNode ? mockThreads.filter((thread) => thread.linkedDAGNodeId === selectedNode.id) : [];
  const linkedDecisions = selectedNode ? mockDecisions.filter((decision) => decision.affectedDAGNodeId === selectedNode.id) : [];
  const linkedChanges = selectedNode ? mockChanges.filter((change) => change.affectedDAGNodeId === selectedNode.id) : [];

  const metrics = {
    total: mockWorkflowDAG.nodes.length,
    critical: mockWorkflowDAG.criticalPath.length,
    risky: mockWorkflowDAG.nodes.filter((node) => node.isRisky).length,
    unresolved: mockWorkflowDAG.nodes.filter((node) => node.isUnresolved).length
  };

  return (
    <StageShell showGrid>
      <motion.div variants={pageContainer} initial="hidden" animate="show" className="mx-auto max-w-7xl space-y-6 px-8 py-8">
        <SectionHeader
          label="DAG"
          title="WORKFLOW DAG"
          subtitle="BloomFast product structure mapped against messages, decisions, and live change requests."
          accentColor="var(--cyan)"
        />

        <motion.div variants={fadeSlideUp} className="flex flex-wrap items-center justify-between gap-4">
          <div className="grid flex-1 gap-3 md:grid-cols-4">
            {[
              ["NODES", metrics.total, "var(--cyan)"],
              ["CRITICAL PATH", metrics.critical, "var(--amber)"],
              ["RISK AREAS", metrics.risky, "var(--amber)"],
              ["UNRESOLVED", metrics.unresolved, "var(--rose)"]
            ].map(([label, value, color]) => (
              <motion.div key={label} initial="rest" animate="rest" whileHover="hover" variants={cardHover} className="glass rounded-xl px-4 py-4">
                <div className="font-mono text-[9px] tracking-[0.15em] text-[var(--text-muted)]">{label}</div>
                <div className="mt-2 font-display text-[38px] leading-none" style={{ color: String(color) }}>
                  {value}
                </div>
              </motion.div>
            ))}
          </div>
          {accepted ? (
            <div className="flex items-center gap-2">
              <StatusBadge variant="done">DAG ACCEPTED</StatusBadge>
              <span className="inline-flex items-center gap-1 font-mono text-[10px] tracking-[0.12em] text-[var(--emerald)]">
                <Lock size={12} />
                V{mockWorkflowDAG.version}
              </span>
            </div>
          ) : (
            <OrchestraButton variant="primary" onClick={() => setAccepted(true)}>
              Accept DAG
            </OrchestraButton>
          )}
        </motion.div>

        <motion.div
          variants={fadeSlideUp}
          className="glass relative overflow-hidden rounded-xl"
          style={{ height: 660, background: "radial-gradient(circle at top left, rgba(0,229,204,0.05) 0%, rgba(0,0,0,0) 32%), #080808" }}
        >
          <ReactFlowProvider>
            <ReactFlow
              nodes={flowNodes}
              edges={flowEdges}
              nodeTypes={nodeTypes}
              fitView
              fitViewOptions={{ padding: 0.18 }}
              nodesDraggable
              zoomOnScroll={false}
              panOnScroll={false}
              panOnDrag
              minZoom={0.35}
              maxZoom={1.6}
              onNodeClick={(_, node) => setSelectedNodeId(node.id)}
              nodesConnectable={false}
              proOptions={{ hideAttribution: true }}
            >
              <Background variant={BackgroundVariant.Dots} color="rgba(255,255,255,0.06)" gap={28} size={1.1} />
              <MiniMap
                pannable
                style={{ background: "rgba(8,8,8,0.92)", border: "1px solid rgba(255,255,255,0.08)" }}
                nodeColor={(node) => {
                  const current = (node.data as FlowNodeData)?.node;
                  return current ? nodeMeta(current.type, current).color : "rgba(255,255,255,0.25)";
                }}
                className="!bottom-4 !right-4 !top-auto"
              />
              <Controls className="!bottom-4 !left-4 !top-auto" />
            </ReactFlow>

            <AnimatePresence>
              {selectedNode ? (
                <motion.aside
                  key={selectedNode.id}
                  variants={drawerSlide}
                  initial="hidden"
                  animate="show"
                  exit="exit"
                  className="glass-heavy glass-noise absolute bottom-4 right-4 top-4 z-20 flex w-[340px] flex-col overflow-y-auto rounded-xl"
                >
                  <div className="border-b border-[rgba(255,255,255,0.05)] px-5 py-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <Badge variant={selectedNode.isUnresolved ? "amber" : selectedNode.isRisky ? "amber" : "cyan"}>
                            {selectedNode.type}
                          </Badge>
                          {selectedNode.isCriticalPath ? <StatusBadge variant="in-progress">CRITICAL</StatusBadge> : null}
                        </div>
                        <div className="mt-3 font-display text-[30px] leading-none text-[var(--text-primary)]">{selectedNode.label}</div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setSelectedNodeId(null)}
                        className="text-[var(--text-muted)] transition-colors hover:text-[var(--text-primary)]"
                      >
                        <X size={14} strokeWidth={1.5} />
                      </button>
                    </div>
                  </div>

                  <motion.div variants={staggerContainer(0.05, 0.04)} initial="hidden" animate="show" className="flex-1 space-y-4 px-5 py-4">
                    <DetailGroup title="Description">
                      <div className="glass-sm rounded-lg px-3 py-3 font-ui text-[12px] leading-6 text-[var(--text-secondary)]">
                        {selectedNode.description}
                      </div>
                    </DetailGroup>

                    <DetailGroup title="Linked Messages">
                      {linkedThreads.length > 0 ? (
                        linkedThreads.map((thread) => (
                          <div key={thread.id} className="glass-blue rounded-lg px-3 py-3">
                            <div className="font-ui text-[12px] text-[var(--text-primary)]">{thread.subject}</div>
                            <div className="mt-1 font-mono text-[9px] text-[var(--text-muted)]">{thread.channel.toUpperCase()} · {thread.updatedAt}</div>
                          </div>
                        ))
                      ) : (
                        <div className="font-ui text-[12px] text-[var(--text-muted)]">No linked messages yet.</div>
                      )}
                    </DetailGroup>

                    <DetailGroup title="Decisions">
                      {linkedDecisions.length > 0 ? (
                        linkedDecisions.map((decision) => (
                          <div key={decision.id} className="glass-emerald rounded-lg px-3 py-3">
                            <div className="font-ui text-[12px] leading-5 text-[var(--text-primary)]">{decision.whatWasDecided}</div>
                            <div className="mt-2">
                              <StatusBadge variant={decision.status === "final" ? "done" : decision.status === "pending" ? "in-review" : "blocked"}>
                                {decision.status}
                              </StatusBadge>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="font-ui text-[12px] text-[var(--text-muted)]">No decisions recorded.</div>
                      )}
                    </DetailGroup>

                    <DetailGroup title="Pending Changes">
                      {linkedChanges.length > 0 ? (
                        linkedChanges.map((change) => (
                          <div key={change.id} className="glass-amber rounded-lg px-3 py-3">
                            <div className="font-ui text-[12px] leading-5 text-[var(--text-primary)]">{change.whatChanged}</div>
                            <div className="mt-2">
                              <StatusBadge variant={change.approvalStatus === "approved" ? "done" : change.approvalStatus === "pending" ? "in-review" : "blocked"}>
                                {change.approvalStatus}
                              </StatusBadge>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="font-ui text-[12px] text-[var(--text-muted)]">No pending changes.</div>
                      )}
                    </DetailGroup>
                  </motion.div>

                  <div className="border-t border-[rgba(255,255,255,0.05)] px-5 py-4">
                    <OrchestraButton variant="secondary" size="sm" fullWidth onClick={() => router.push(getIntelRoute(projectId))}>
                      Ask Socrates about this
                    </OrchestraButton>
                  </div>
                </motion.aside>
              ) : null}
            </AnimatePresence>
          </ReactFlowProvider>
        </motion.div>
      </motion.div>
    </StageShell>
  );
}
