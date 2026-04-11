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
  ReactFlowProvider,
  type Node,
  type NodeProps
} from "@xyflow/react";
import { AnimatePresence, animate, motion } from "framer-motion";
import { X } from "lucide-react";
import { useParams, useRouter } from "next/navigation";

import { StageShell } from "@/components/layout/StageShell";
import { OrchestraButton } from "@/components/shared/OrchestraButton";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { StatusBadge } from "@/components/shared/StatusBadge";
import {
  COUNT_UP_DURATION,
  EASE_EXPO,
  drawerSlide,
  fadeSlideUp,
  fadeSlideUpFast,
  pageContainer,
  staggerContainer
} from "@/lib/animations";
import { executionEpics, getTruthDocumentById } from "@/lib/mockData";
import { getIntelRoute, getStageRoute } from "@/lib/stageConfig";

type NodeState = "feature" | "mvp" | "changed" | "stale" | "blocker";

interface FlowMapNode {
  id: string;
  displayId: string;
  title: string;
  priority: "p0" | "p1" | "p2" | "p3";
  state: NodeState;
  typeLabel: string;
  sourceDocId: string;
  position: { x: number; y: number };
  tasks: string[];
  includeInMvp: boolean;
}

type FlowNodeData = {
  node: FlowMapNode;
};

type FlowNode = Node<FlowNodeData, "nodeCard">;

const baseNodes: FlowMapNode[] = [
  {
    id: "N1",
    displayId: "N-01",
    title: "Creator Identity Layer",
    priority: "p0",
    state: "mvp",
    typeLabel: "MVP",
    sourceDocId: "tr5",
    position: { x: 50, y: 200 },
    tasks: ["E1-T1 Creator signup + profile setup", "E1-T3 Creator tier system"],
    includeInMvp: true
  },
  {
    id: "N2",
    displayId: "N-02",
    title: "Creator Signup",
    priority: "p1",
    state: "feature",
    typeLabel: "FEATURE",
    sourceDocId: "tr1",
    position: { x: 320, y: 80 },
    tasks: ["E1-T1 Creator signup + profile setup"],
    includeInMvp: true
  },
  {
    id: "N9",
    displayId: "N-03",
    title: "Publish Dashboard",
    priority: "p1",
    state: "feature",
    typeLabel: "FEATURE",
    sourceDocId: "tr3",
    position: { x: 320, y: 300 },
    tasks: ["E2-T1 Asset listing UI", "E2-T4 Asset versioning and update flow"],
    includeInMvp: true
  },
  {
    id: "N13",
    displayId: "N-04",
    title: "Stripe Payout Engine",
    priority: "p0",
    state: "blocker",
    typeLabel: "BLOCKER",
    sourceDocId: "tr2",
    position: { x: 590, y: 150 },
    tasks: ["E3-T1 Stripe Connect integration for creator payouts"],
    includeInMvp: false
  },
  {
    id: "N10",
    displayId: "N-05",
    title: "Discovery Feed",
    priority: "p1",
    state: "changed",
    typeLabel: "CHANGED",
    sourceDocId: "tr4",
    position: { x: 590, y: 350 },
    tasks: ["E5-T2 Tag-based discovery feed", "E5-T4 Trending this week algorithm"],
    includeInMvp: true
  },
  {
    id: "N16",
    displayId: "N-06",
    title: "Creator Analytics",
    priority: "p2",
    state: "stale",
    typeLabel: "STALE",
    sourceDocId: "tr3",
    position: { x: 860, y: 200 },
    tasks: ["E4-T2 Revenue analytics per asset", "E4-T3 Creator leaderboard"],
    includeInMvp: false
  }
];

const rbacNode: FlowMapNode = {
  id: "RBAC",
  displayId: "N-07",
  title: "RBAC Permission Engine",
  priority: "p1",
  state: "changed",
  typeLabel: "NEW · from Socrates",
  sourceDocId: "tr5",
  position: { x: 50, y: 450 },
  tasks: ["RBAC permission matrix", "Role-aware payout permissions", "Admin override logs"],
  includeInMvp: false
};

const baseEdges: Edge[] = [
  { id: "e-1", source: "N1", target: "N2" },
  { id: "e-2", source: "N2", target: "N9" },
  { id: "e-3", source: "N9", target: "N13" },
  { id: "e-4", source: "N9", target: "N10" },
  { id: "e-5", source: "N13", target: "N16" },
  { id: "e-6", source: "N10", target: "N16" }
];

function stateMeta(state: NodeState) {
  switch (state) {
    case "mvp":
      return {
        border: "rgba(0,229,204,0.3)",
        dot: "var(--cyan)",
        glow: "0 0 20px rgba(0,229,204,0.1)",
        chipClass: "glass-cyan text-[var(--cyan)]"
      };
    case "changed":
      return {
        border: "rgba(251,191,36,0.35)",
        dot: "var(--amber)",
        glow: "0 0 16px rgba(251,191,36,0.08)",
        chipClass: "glass-amber text-[var(--amber)]"
      };
    case "blocker":
      return {
        border: "rgba(251,113,133,0.3)",
        dot: "var(--rose)",
        glow: "0 0 16px rgba(251,113,133,0.08)",
        chipClass: "glass-rose text-[var(--rose)]"
      };
    case "stale":
      return {
        border: "rgba(255,255,255,0.08)",
        dot: "rgba(255,255,255,0.35)",
        glow: "none",
        chipClass: "glass-sm text-[var(--text-muted)]"
      };
    default:
      return {
        border: "rgba(96,165,250,0.25)",
        dot: "var(--blue)",
        glow: "0 0 16px rgba(96,165,250,0.07)",
        chipClass: "glass-blue text-[var(--blue)]"
      };
  }
}

function NodeCard({ data, selected }: NodeProps<FlowNode>) {
  const meta = stateMeta(data.node.state);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.84 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.35, ease: EASE_EXPO }}
    >
      <Handle type="target" position={Position.Left} style={{ background: meta.dot, width: 8, height: 8, border: "1px solid rgba(0,0,0,0.5)" }} />
      <div
        className="glass-sm rounded-xl px-4 py-4"
        style={{
          minWidth: 200,
          minHeight: 80,
          border: `1px solid ${selected ? "var(--amber)" : meta.border}`,
          boxShadow: selected ? "0 0 0 1px rgba(251,191,36,0.18), 0 12px 32px rgba(0,0,0,0.45)" : meta.glow,
          opacity: data.node.state === "stale" ? 0.6 : 1
        }}
      >
        <div className="flex items-center justify-between">
          <div className="font-mono text-[9px] tracking-[0.12em] text-[var(--text-muted)]">{data.node.displayId}</div>
          <span className="h-[6px] w-[6px] rounded-full" style={{ background: meta.dot }} />
        </div>
        <div className="mt-1.5 font-ui text-[13px] font-medium leading-tight text-[var(--text-primary)]">{data.node.title}</div>
        <div className="mt-3 flex items-center gap-2">
          <StatusBadge variant={data.node.priority} />
          <span className={`rounded-[3px] px-2 py-0.5 font-mono text-[8px] tracking-[0.12em] ${meta.chipClass}`}>
            {data.node.typeLabel}
          </span>
        </div>
      </div>
      <Handle type="source" position={Position.Right} style={{ background: meta.dot, width: 8, height: 8, border: "1px solid rgba(0,0,0,0.5)" }} />
    </motion.div>
  );
}

const nodeTypes = { nodeCard: NodeCard };

function SummaryMetric({ label, value, color }: { label: string; value: number; color: string }) {
  const [displayed, setDisplayed] = useState(0);

  useEffect(() => {
    const controls = animate(0, value, {
      duration: COUNT_UP_DURATION,
      ease: EASE_EXPO,
      onUpdate: (latest) => setDisplayed(Math.round(latest))
    });
    return () => controls.stop();
  }, [value]);

  return (
    <div>
      <div className="font-mono text-[9px] tracking-[0.14em] text-[var(--text-muted)]">{label}</div>
      <div className="mt-3 font-display text-[34px] leading-none" style={{ color }}>
        {displayed}
      </div>
    </div>
  );
}

export function Stage3ProductFlowchart() {
  const router = useRouter();
  const params = useParams<{ projectId: string }>();
  const projectId = typeof params?.projectId === "string" ? params.projectId : "p1";
  const [mvpOnly, setMvpOnly] = useState(false);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>("N1");
  const [showRbacNode, setShowRbacNode] = useState(false);
  const [mvpState, setMvpState] = useState<Record<string, boolean>>(() =>
    Object.fromEntries([...baseNodes, rbacNode].map((node) => [node.id, node.includeInMvp]))
  );

  useEffect(() => {
    const timer = window.setTimeout(() => setShowRbacNode(true), 3000);
    const handleRbac = () => setShowRbacNode(true);
    window.addEventListener("orchestra-rbac-added", handleRbac);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("orchestra-rbac-added", handleRbac);
    };
  }, []);

  const allNodes = useMemo(() => (showRbacNode ? [...baseNodes, rbacNode] : baseNodes), [showRbacNode]);

  const visibleNodes = useMemo(
    () => allNodes.filter((node) => (mvpOnly ? mvpState[node.id] : true)),
    [allNodes, mvpOnly, mvpState]
  );

  useEffect(() => {
    if (selectedNodeId === null) return;
    if (!visibleNodes.some((node) => node.id === selectedNodeId)) {
      setSelectedNodeId(visibleNodes[0]?.id ?? "");
    }
  }, [visibleNodes, selectedNodeId]);

  const flowNodes = useMemo<FlowNode[]>(
    () =>
      visibleNodes.map((node) => ({
        id: node.id,
        type: "nodeCard",
        position: node.position,
        draggable: true,
        data: { node }
      })),
    [visibleNodes]
  );

  const visibleNodeIds = new Set(visibleNodes.map((node) => node.id));

  const flowEdges = useMemo<Edge[]>(() => {
    const edges = [...baseEdges];
    if (showRbacNode) {
      edges.push({ id: "e-rbac", source: "N1", target: "RBAC" });
    }

    return edges
      .filter((edge) => visibleNodeIds.has(edge.source) && visibleNodeIds.has(edge.target))
      .map((edge) => {
        const critical = edge.target === "N13" || edge.source === "N13" || edge.target === "RBAC";
        return {
          ...edge,
          type: "smoothstep",
          animated: false,
          style: {
            stroke: critical ? "var(--amber)" : "rgba(255,255,255,0.15)",
            strokeWidth: critical ? 2 : 1.5
          },
          markerEnd: {
            type: MarkerType.ArrowClosed,
            color: critical ? "#fbbf24" : "rgba(255,255,255,0.28)"
          }
        };
      });
  }, [showRbacNode, visibleNodeIds]);

  const selectedNode = allNodes.find((node) => node.id === selectedNodeId) ?? null;
  const sourceDoc = selectedNode ? getTruthDocumentById(selectedNode.sourceDocId) : null;
  const linkedExecutionTasks = useMemo(() => {
    if (!selectedNode) return [];
    return executionEpics.flatMap((epic) =>
      epic.tasks
        .filter((task) => task.dag.includes(selectedNode.id))
        .map((task) => `${task.id} ${task.title}`)
    );
  }, [selectedNode]);

  const metrics = {
    total: allNodes.length,
    mvp: allNodes.filter((node) => mvpState[node.id]).length,
    changed: allNodes.filter((node) => node.state === "changed").length,
    blockers: allNodes.filter((node) => node.state === "blocker").length
  };

  return (
    <StageShell showGrid>
      <motion.div variants={pageContainer} initial="hidden" animate="show" className="mx-auto max-w-7xl space-y-6 px-8 py-8">
        <SectionHeader
          label="Step 3"
          title="HOW DOES IT FIT TOGETHER?"
          subtitle="The whole product on one screen."
          accentColor="var(--cyan)"
        />

        <motion.div variants={fadeSlideUp} className="glass glass-noise rounded-xl px-6 py-5">
          <div className="grid gap-4 md:grid-cols-4">
            <SummaryMetric label="VISIBLE NODES" value={metrics.total} color="var(--blue)" />
            <SummaryMetric label="IN MVP" value={metrics.mvp} color="var(--cyan)" />
            <SummaryMetric label="CHANGED" value={metrics.changed} color="var(--amber)" />
            <SummaryMetric label="BLOCKERS" value={metrics.blockers} color="var(--rose)" />
          </div>
        </motion.div>

        <motion.div variants={staggerContainer(0.04, 0.02)} initial="hidden" animate="show" className="flex flex-wrap gap-3">
          <motion.button
            variants={fadeSlideUpFast}
            type="button"
            onClick={() => setMvpOnly(false)}
            className={mvpOnly ? "glass-sm rounded-md px-4 py-2 font-ui text-[12px] text-[var(--text-secondary)]" : "glass-blue rounded-md px-4 py-2 font-ui text-[12px] text-[var(--blue)]"}
          >
            All nodes
          </motion.button>
          <motion.button
            variants={fadeSlideUpFast}
            type="button"
            onClick={() => setMvpOnly(true)}
            className={mvpOnly ? "glass-cyan rounded-md px-4 py-2 font-ui text-[12px] text-[var(--cyan)]" : "glass-sm rounded-md px-4 py-2 font-ui text-[12px] text-[var(--text-secondary)]"}
          >
            MVP only
          </motion.button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: EASE_EXPO, delay: 0.1 }}
          className="glass relative overflow-hidden rounded-xl"
          style={{ height: 620, background: "radial-gradient(circle at top left, rgba(96,165,250,0.05) 0%, rgba(0,0,0,0) 30%), #080808" }}
        >
          <ReactFlowProvider>
            <ReactFlow
              nodes={flowNodes}
              edges={flowEdges}
              nodeTypes={nodeTypes}
              fitView
              fitViewOptions={{ padding: 0.2 }}
              nodesDraggable
              zoomOnScroll={false}
              panOnScroll={false}
              panOnDrag
              minZoom={0.3}
              maxZoom={2}
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
                  return current ? stateMeta(current.state).dot : "rgba(255,255,255,0.25)";
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
                  className="glass-heavy glass-noise absolute right-4 top-4 bottom-4 z-20 flex w-72 flex-col overflow-y-auto rounded-xl"
                >
                  <div className="border-b border-[rgba(255,255,255,0.05)] px-5 py-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className={`rounded-[3px] px-2 py-0.5 font-mono text-[8px] tracking-[0.12em] ${stateMeta(selectedNode.state).chipClass}`}>
                            {selectedNode.typeLabel}
                          </span>
                          <span className="font-mono text-[9px] tracking-[0.12em] text-[var(--text-muted)]">{selectedNode.displayId}</span>
                        </div>
                        <div className="mt-3 font-display text-[28px] leading-none text-[var(--text-primary)]">{selectedNode.title}</div>
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
                    <motion.div variants={fadeSlideUpFast} className="flex items-center gap-2">
                      <StatusBadge variant={selectedNode.priority} />
                      <StatusBadge variant={selectedNode.state === "blocker" ? "blocked" : selectedNode.state === "stale" ? "stale" : selectedNode.state === "changed" ? "revised" : selectedNode.includeInMvp ? "in-progress" : "todo"} />
                    </motion.div>

                    <motion.div variants={fadeSlideUpFast}>
                      <div className="mb-2 font-mono text-[9px] tracking-[0.12em] text-[var(--text-muted)]">LINKED TASKS</div>
                      <div className="space-y-2">
                        {(linkedExecutionTasks.length ? linkedExecutionTasks : selectedNode.tasks).map((task) => (
                          <div key={task} className="glass-sm rounded-lg px-3 py-2 font-ui text-[12px] text-[var(--text-secondary)]">
                            {task}
                          </div>
                        ))}
                      </div>
                    </motion.div>

                    <motion.div variants={fadeSlideUpFast}>
                      <div className="mb-2 font-mono text-[9px] tracking-[0.12em] text-[var(--text-muted)]">SOURCE</div>
                      <div className="glass-violet rounded-lg px-3 py-2 font-mono text-[10px] tracking-[0.08em] text-[var(--violet)]">
                        {sourceDoc?.title ?? "Tempest AI architecture context"}
                      </div>
                    </motion.div>

                    <motion.div variants={fadeSlideUpFast} className="flex items-center justify-between rounded-lg border border-[rgba(255,255,255,0.06)] px-3 py-3">
                      <div className="font-ui text-[12px] text-[var(--text-secondary)]">Include in MVP</div>
                      <button
                        type="button"
                        onClick={() => setMvpState((current) => ({ ...current, [selectedNode.id]: !current[selectedNode.id] }))}
                        className="relative h-6 w-11 rounded-full border border-[rgba(255,255,255,0.12)] transition-colors"
                        style={{ background: mvpState[selectedNode.id] ? "rgba(0,229,204,0.14)" : "rgba(255,255,255,0.04)" }}
                      >
                        <motion.span
                          layout
                          transition={{ type: "spring", stiffness: 320, damping: 28 }}
                          className="absolute top-[3px] h-4 w-4 rounded-full"
                          style={{
                            left: mvpState[selectedNode.id] ? 22 : 3,
                            background: mvpState[selectedNode.id] ? "var(--cyan)" : "rgba(255,255,255,0.24)"
                          }}
                        />
                      </button>
                    </motion.div>
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

        <motion.div variants={fadeSlideUp} className="flex items-center justify-between gap-4">
          <div className="font-ui text-[13px] text-[var(--text-secondary)]">
            Drag the nodes. Click one to see where it came from and what it changes.
          </div>
          <OrchestraButton variant="primary" onClick={() => router.push(getStageRoute(projectId, "4-prototype"))}>
            Build Prototype
          </OrchestraButton>
        </motion.div>
      </motion.div>
    </StageShell>
  );
}
