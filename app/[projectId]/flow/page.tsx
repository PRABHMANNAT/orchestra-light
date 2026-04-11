"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Background,
  BackgroundVariant,
  Controls,
  Handle,
  MarkerType,
  MiniMap,
  Position,
  ReactFlow,
  type Edge,
  type Node,
  type NodeProps,
  type ReactFlowInstance
} from "@xyflow/react";
import { AnimatePresence, motion } from "framer-motion";
import { GitBranch, Sparkles, X } from "lucide-react";
import { useParams, useRouter } from "next/navigation";

import { StageShell } from "@/components/layout/StageShell";
import { OrchestraButton } from "@/components/shared/OrchestraButton";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { StatusBadge } from "@/components/shared/StatusBadge";
import {
  drawerSlide,
  EASE_EXPO,
  fadeSlideUp,
  fadeSlideUpFast,
  pageContainer,
  staggerContainer
} from "@/lib/animations";
import { getTruthDocumentById } from "@/lib/mockData";

type NodeState = "feature" | "mvp" | "changed" | "stale" | "blocker";
type NodePriority = "p0" | "p1" | "p2" | "p3";

type PendingNodeRecord = {
  id: string;
  title: string;
  type: "changed";
  source: "inbox";
};

type FlowNodeRecord = {
  id: string;
  displayId: string;
  title: string;
  priority: NodePriority;
  state: NodeState;
  typeLabel: string;
  sourceDocId?: string;
  sourceLabel?: string;
  position: { x: number; y: number };
  tasks: string[];
  includeInMvp: boolean;
  isNew?: boolean;
  source?: string;
};

type FlowCanvasNode = Node<FlowNodeRecord, "nodeCard">;

const baseFlowNodes: FlowNodeRecord[] = [
  {
    id: "N1",
    displayId: "N-01",
    title: "Creator Identity Layer",
    priority: "p0",
    state: "mvp",
    typeLabel: "MVP",
    sourceDocId: "tr5",
    position: { x: 50, y: 200 },
    tasks: ["Creator signup + profile setup", "Role-aware creator permissions"],
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
    tasks: ["Email verification", "Profile completion states"],
    includeInMvp: true
  },
  {
    id: "N3",
    displayId: "N-03",
    title: "Publish Dashboard",
    priority: "p1",
    state: "feature",
    typeLabel: "FEATURE",
    sourceDocId: "tr3",
    position: { x: 320, y: 300 },
    tasks: ["Asset upload flow", "Listing editor and preview"],
    includeInMvp: true
  },
  {
    id: "N4",
    displayId: "N-04",
    title: "Stripe Payout Engine",
    priority: "p0",
    state: "blocker",
    typeLabel: "BLOCKER",
    sourceDocId: "tr2",
    position: { x: 590, y: 150 },
    tasks: ["Stripe Connect onboarding", "Payout account verification"],
    includeInMvp: false
  },
  {
    id: "N5",
    displayId: "N-05",
    title: "Discovery Feed",
    priority: "p1",
    state: "changed",
    typeLabel: "CHANGED",
    sourceDocId: "tr4",
    position: { x: 590, y: 350 },
    tasks: ["Tag-based discovery", "Featured placement rules"],
    includeInMvp: true
  },
  {
    id: "N6",
    displayId: "N-06",
    title: "Creator Analytics",
    priority: "p2",
    state: "stale",
    typeLabel: "STALE",
    sourceDocId: "tr3",
    position: { x: 860, y: 200 },
    tasks: ["Weekly earnings comparison", "Per-asset revenue breakdown"],
    includeInMvp: false
  }
];

const baseFlowEdges: Edge[] = [
  { id: "e-1", source: "N1", target: "N2" },
  { id: "e-2", source: "N2", target: "N3" },
  { id: "e-3", source: "N3", target: "N4" },
  { id: "e-4", source: "N3", target: "N5" },
  { id: "e-5", source: "N4", target: "N6" },
  { id: "e-6", source: "N5", target: "N6" }
].map((edge) => {
  const critical = edge.source === "N4" || edge.target === "N4";
  return {
    ...edge,
    type: "smoothstep",
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

function stateMeta(state: NodeState, isNew = false) {
  if (isNew) {
    return {
      border: "rgba(251,191,36,0.35)",
      dot: "var(--amber)",
      glow: "0 0 18px rgba(251,191,36,0.08)",
      chipClass: "glass-amber text-[var(--amber)]"
    };
  }

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
        chipClass: "glass-sm text-[var(--text-muted)] line-through"
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

function NodeCard({ data, selected }: NodeProps<FlowCanvasNode>) {
  const meta = stateMeta(data.state, data.isNew);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.84 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.35, ease: EASE_EXPO }}
    >
      <Handle
        type="target"
        position={Position.Left}
        style={{
          width: 8,
          height: 8,
          background: meta.dot,
          border: "1px solid rgba(0,0,0,0.5)"
        }}
      />
      <div
        className="glass-sm rounded-xl px-4 py-4"
        style={{
          minWidth: 200,
          minHeight: 80,
          background: data.isNew ? "rgba(251,191,36,0.03)" : undefined,
          border: `1px solid ${selected ? "rgba(251,191,36,0.45)" : meta.border}`,
          boxShadow: selected
            ? "0 0 0 1px rgba(251,191,36,0.18), 0 12px 32px rgba(0,0,0,0.45)"
            : meta.glow,
          opacity: data.state === "stale" && !data.isNew ? 0.6 : 1
        }}
      >
        <div className="flex items-center justify-between">
          <div className="font-mono text-[9px] tracking-[0.12em] text-[var(--text-muted)]">
            {data.displayId}
          </div>
          <span
            className="h-[6px] w-[6px] rounded-full"
            style={{
              background: meta.dot,
              boxShadow: data.isNew ? "0 0 8px rgba(251,191,36,0.55)" : "none"
            }}
          />
        </div>
        <div className="mt-1.5 font-ui text-[13px] font-medium leading-tight text-[var(--text-primary)]">
          {data.title}
        </div>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <StatusBadge variant={data.priority} />
          {data.isNew ? (
            <span className="glass-violet rounded-[3px] border border-[rgba(167,139,250,0.3)] px-1.5 py-0.5 font-mono text-[8px] tracking-[0.12em] text-[var(--violet)]">
              NEW · from {data.source ?? "inbox"}
            </span>
          ) : (
            <span className={`rounded-[3px] px-2 py-0.5 font-mono text-[8px] tracking-[0.12em] ${meta.chipClass}`}>
              {data.typeLabel}
            </span>
          )}
        </div>
      </div>
      <Handle
        type="source"
        position={Position.Right}
        style={{
          width: 8,
          height: 8,
          background: meta.dot,
          border: "1px solid rgba(0,0,0,0.5)"
        }}
      />
    </motion.div>
  );
}

const nodeTypes = { nodeCard: NodeCard };

function toCanvasNode(node: FlowNodeRecord): FlowCanvasNode {
  return {
    id: node.id,
    type: "nodeCard",
    position: node.position,
    draggable: true,
    data: node
  };
}

export default function FlowPage() {
  const params = useParams<{ projectId: string }>();
  const router = useRouter();
  const projectId = typeof params?.projectId === "string" ? params.projectId : "p1";
  const [nodes, setNodes] = useState<FlowCanvasNode[]>(() => baseFlowNodes.map(toCanvasNode));
  const [edges] = useState<Edge[]>(baseFlowEdges);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(baseFlowNodes[0]?.id ?? null);
  const [flowInstance, setFlowInstance] = useState<ReactFlowInstance<FlowCanvasNode, Edge> | null>(null);

  useEffect(() => {
    if (!flowInstance || typeof window === "undefined") return;

    const pendingRaw = window.localStorage.getItem("orchestra_pending_nodes");
    if (!pendingRaw) return;

    let pending: PendingNodeRecord[] = [];
    try {
      const parsed = JSON.parse(pendingRaw) as PendingNodeRecord[];
      pending = Array.isArray(parsed) ? parsed : [];
    } catch {
      pending = [];
    }

    if (pending.length === 0) {
      window.localStorage.removeItem("orchestra_pending_nodes");
      return;
    }

    setNodes((previous) => {
      const existingIds = new Set(previous.map((node) => node.id));
      const nextIndex = previous.length + 1;
      const incoming = pending
        .filter((item) => !existingIds.has(item.id))
        .map((item, index) =>
          toCanvasNode({
            id: item.id,
            displayId: `N-${String(nextIndex + index).padStart(2, "0")}`,
            title: item.title,
            priority: "p1",
            state: "changed",
            typeLabel: "CHANGED",
            sourceDocId: "tr4",
            sourceLabel: "Inbox conversion",
            position: { x: 200, y: 500 + index * 180 },
            tasks: ["New task added to the queue", "Review scope impact before commit"],
            includeInMvp: false,
            isNew: true,
            source: item.source
          })
        );

      if (incoming.length > 0) {
        setSelectedNodeId(incoming[0].id);
      }

      return [...previous, ...incoming];
    });

    window.setTimeout(() => {
      flowInstance.fitView({ padding: 0.2, duration: 600 });
    }, 300);

    window.localStorage.removeItem("orchestra_pending_nodes");
  }, [flowInstance]);

  const selectedNode = useMemo(
    () => nodes.find((node) => node.id === selectedNodeId) ?? null,
    [nodes, selectedNodeId]
  );

  const handleNodeClick = (_event: React.MouseEvent, node: FlowCanvasNode) => {
    setSelectedNodeId(node.id);
    if (!node.data.isNew) return;

    setNodes((current) =>
      current.map((entry) =>
        entry.id === node.id
          ? {
              ...entry,
              data: {
                ...entry.data,
                isNew: false
              }
            }
          : entry
      )
    );
  };

  const toggleMvp = (nodeId: string) => {
    setNodes((current) =>
      current.map((entry) =>
        entry.id === nodeId
          ? {
              ...entry,
              data: {
                ...entry.data,
                includeInMvp: !entry.data.includeInMvp
              }
            }
          : entry
      )
    );
  };

  const handleAskSocrates = () => {
    if (!selectedNode || typeof window === "undefined") return;
    window.localStorage.setItem(
      "orchestra_socrates_prompt",
      `Analyse this flow node and its impact: ${selectedNode.data.title}`
    );
    router.push(`/pm/${projectId}/intel`);
  };

  const sourceDocument =
    selectedNode?.data.sourceDocId ? getTruthDocumentById(selectedNode.data.sourceDocId) : null;

  return (
    <StageShell showGrid>
      <motion.div variants={pageContainer} initial="hidden" animate="show" className="mx-auto max-w-[1600px] px-8 py-8">
        <SectionHeader
          label="flow"
          title="HOW DOES IT FIT TOGETHER?"
          subtitle="See the product map update as client requests turn into work."
          accentColor="var(--cyan)"
        />

        <motion.div
          variants={fadeSlideUp}
          className="glass relative overflow-hidden rounded-xl"
          style={{
            height: "calc(100vh - 220px)",
            minHeight: 620,
            background:
              "radial-gradient(circle at top left, rgba(96,165,250,0.04) 0%, rgba(0,0,0,0) 32%), #080808"
          }}
        >
          <ReactFlow
            nodes={nodes}
            edges={edges}
            nodeTypes={nodeTypes}
            fitView
            fitViewOptions={{ padding: 0.2 }}
            nodesDraggable
            zoomOnScroll={false}
            panOnScroll={false}
            panOnDrag
            minZoom={0.3}
            maxZoom={2}
            nodesConnectable={false}
            onNodeClick={handleNodeClick}
            onInit={(instance) => setFlowInstance(instance)}
            proOptions={{ hideAttribution: true }}
          >
            <Background
              variant={BackgroundVariant.Dots}
              color="rgba(255,255,255,0.06)"
              gap={28}
              size={1.1}
            />
            <MiniMap
              pannable
              style={{
                background: "rgba(8,8,8,0.92)",
                border: "1px solid rgba(255,255,255,0.08)"
              }}
              nodeColor={(node) => {
                const payload = node.data as FlowNodeRecord | undefined;
                return payload ? stateMeta(payload.state, payload.isNew).dot : "rgba(255,255,255,0.25)";
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
                className="glass-heavy glass-noise absolute bottom-4 right-4 top-4 z-20 flex w-72 flex-col overflow-y-auto rounded-xl"
              >
                <div className="border-b border-[rgba(255,255,255,0.05)] px-5 py-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span
                          className={`rounded-[3px] px-2 py-0.5 font-mono text-[8px] tracking-[0.12em] ${stateMeta(selectedNode.data.state, selectedNode.data.isNew).chipClass}`}
                        >
                          {selectedNode.data.isNew ? "UPDATED" : selectedNode.data.typeLabel}
                        </span>
                        <span className="font-mono text-[9px] tracking-[0.12em] text-[var(--text-muted)]">
                          {selectedNode.data.displayId}
                        </span>
                      </div>
                      <div className="mt-3 font-display text-[28px] leading-none text-[var(--text-primary)]">
                        {selectedNode.data.title}
                      </div>
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

                <motion.div
                  variants={staggerContainer(0.05, 0.04)}
                  initial="hidden"
                  animate="show"
                  className="flex-1 space-y-4 px-5 py-4"
                >
                  <motion.div variants={fadeSlideUpFast} className="flex items-center gap-2">
                    <StatusBadge variant={selectedNode.data.priority} />
                    <StatusBadge
                      variant={
                        selectedNode.data.state === "blocker"
                          ? "blocked"
                          : selectedNode.data.state === "stale"
                            ? "stale"
                            : selectedNode.data.state === "changed"
                              ? "revised"
                              : selectedNode.data.includeInMvp
                                ? "in-progress"
                                : "todo"
                      }
                    />
                  </motion.div>

                  <motion.div variants={fadeSlideUpFast}>
                    <div className="mb-2 font-mono text-[9px] tracking-[0.12em] text-[var(--text-muted)]">
                      LINKED TASKS
                    </div>
                    <div className="space-y-2">
                      {selectedNode.data.tasks.map((task) => (
                        <div
                          key={task}
                          className="glass-sm rounded-lg px-3 py-2 font-ui text-[12px] text-[var(--text-secondary)]"
                        >
                          {task}
                        </div>
                      ))}
                    </div>
                  </motion.div>

                  <motion.div variants={fadeSlideUpFast}>
                    <div className="mb-2 font-mono text-[9px] tracking-[0.12em] text-[var(--text-muted)]">
                      SOURCE
                    </div>
                    <div className="glass-violet rounded-lg px-3 py-2 font-mono text-[10px] tracking-[0.08em] text-[var(--violet)]">
                      {selectedNode.data.sourceLabel ?? sourceDocument?.title ?? "Inbox conversion"}
                    </div>
                  </motion.div>

                  <motion.div
                    variants={fadeSlideUpFast}
                    className="flex items-center justify-between rounded-lg border border-[rgba(255,255,255,0.06)] px-3 py-3"
                  >
                    <div className="font-ui text-[12px] text-[var(--text-secondary)]">Include in MVP</div>
                    <button
                      type="button"
                      onClick={() => toggleMvp(selectedNode.id)}
                      className="relative h-6 w-11 rounded-full border border-[rgba(255,255,255,0.12)] transition-colors"
                      style={{
                        background: selectedNode.data.includeInMvp
                          ? "rgba(0,229,204,0.14)"
                          : "rgba(255,255,255,0.04)"
                      }}
                    >
                      <motion.span
                        layout
                        transition={{ type: "spring", stiffness: 320, damping: 28 }}
                        className="absolute top-[3px] h-4 w-4 rounded-full"
                        style={{
                          left: selectedNode.data.includeInMvp ? 22 : 3,
                          background: selectedNode.data.includeInMvp
                            ? "var(--cyan)"
                            : "rgba(255,255,255,0.24)"
                        }}
                      />
                    </button>
                  </motion.div>

                  {selectedNode.data.isNew ? (
                    <motion.div variants={fadeSlideUpFast} className="glass-amber rounded-lg px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Sparkles size={12} strokeWidth={1.5} className="text-[var(--amber)]" />
                        <span className="font-mono text-[9px] tracking-[0.12em] text-[var(--amber)]">
                          NEW FROM INBOX
                        </span>
                      </div>
                      <div className="mt-2 font-ui text-[12px] leading-[1.5] text-[var(--text-secondary)]">
                        This node was created from a client message and added to the flow map for review.
                      </div>
                    </motion.div>
                  ) : null}
                </motion.div>

                <div className="border-t border-[rgba(255,255,255,0.05)] px-5 py-4">
                  <OrchestraButton variant="secondary" size="sm" fullWidth onClick={handleAskSocrates}>
                    Ask Socrates about this
                  </OrchestraButton>
                </div>
              </motion.aside>
            ) : null}
          </AnimatePresence>
        </motion.div>

        <motion.div variants={fadeSlideUp} className="mt-6 flex items-center justify-between gap-4">
          <div className="font-ui text-[13px] text-[var(--text-secondary)]">
            Click a node to see what changed, where it came from, and whether it belongs in MVP.
          </div>
          <OrchestraButton variant="secondary" size="sm" icon={GitBranch} onClick={handleAskSocrates}>
            Ask Socrates about Flow
          </OrchestraButton>
        </motion.div>
      </motion.div>
    </StageShell>
  );
}
