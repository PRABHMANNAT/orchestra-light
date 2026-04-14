export type Project = {
  id: string;
  name: string;
  client: string;
  createdAt: string;
  status: "active" | "archived";
};

export type SourcePackage = {
  id: string;
  projectId: string;
  version: number;
  summary: string;
  actors: string[];
  features: string[];
  constraints: string[];
  integrations: string[];
  knownUnknowns: string[];
  risks: string[];
  contradictions: string[];
  evidenceRefs: string[];
  confidenceSummary: string;
  createdAt: string;
  accepted: boolean;
};

export type ClarifiedBrief = {
  id: string;
  projectId: string;
  version: number;
  targetUsers: string[];
  userRoles: string[];
  primaryJourney: string;
  mvpObjective: string;
  scopeIn: string[];
  scopeOut: string[];
  constraints: string[];
  mustHaveIntegrations: string[];
  approvalConditions: string[];
  unresolvedDecisions: string[];
  risks: string[];
  assumptionSummary: string;
  createdAt: string;
  accepted: boolean;
};

export type DAGNodeType = "flow" | "module" | "rule" | "integration" | "approval" | "risk" | "unresolved";

export type DAGNode = {
  id: string;
  label: string;
  type: DAGNodeType;
  description: string;
  dependencies: string[];
  isCriticalPath: boolean;
  isRisky: boolean;
  isUnresolved: boolean;
};

export type WorkflowDAG = {
  id: string;
  projectId: string;
  version: number;
  nodes: DAGNode[];
  edges: { id: string; from: string; to: string; label?: string; isCritical?: boolean }[];
  criticalPath: string[];
  accepted: boolean;
  createdAt: string;
};

export type MessageChannel = "gmail" | "slack" | "whatsapp";

export type MessageClassification =
  | "clarification_needed"
  | "decision_made"
  | "scope_change"
  | "blocker"
  | "approval_request"
  | "contradiction"
  | "action_item"
  | "risk_signal"
  | "client_concern"
  | "engineering_uncertainty";

export type MessageInsight = {
  id: string;
  classification: MessageClassification;
  mappedProjectArea: string;
  mappedDAGNodeId?: string;
  suggestedAction?: string;
  confidence: number;
  reviewedByHuman: boolean;
};

export type Message = {
  id: string;
  threadId: string;
  sender: string;
  content: string;
  timestamp: string;
  channel: MessageChannel;
  insight?: MessageInsight;
};

export type CommunicationThread = {
  id: string;
  projectId: string;
  channel: MessageChannel;
  subject?: string;
  participants: string[];
  messages: Message[];
  linkedProjectArea?: string;
  linkedDAGNodeId?: string;
  createdAt: string;
  updatedAt: string;
};

export type DecisionRecord = {
  id: string;
  projectId: string;
  whatWasDecided: string;
  decidedBy: string;
  decidedAt: string;
  sourceThreadId: string;
  affectedProjectArea: string;
  affectedDAGNodeId?: string;
  status: "final" | "pending" | "unresolved";
  evidenceRefs: string[];
  createdAt: string;
};

export type ChangeRecord = {
  id: string;
  projectId: string;
  whatChanged: string;
  previousUnderstanding: string;
  newUnderstanding: string;
  requestedBy: string;
  requestedAt: string;
  affectedProjectArea: string;
  affectedDAGNodeId?: string;
  approvalStatus: "approved" | "pending" | "unresolved";
  riskImplication?: string;
  reworkImplication?: string;
  evidenceRefs: string[];
  createdAt: string;
};

export type OutputRole = "pm" | "cto" | "founder" | "client" | "engineer";

export type SummaryBundle = {
  id: string;
  projectId: string;
  role: OutputRole;
  content: string;
  generatedAt: string;
  sourceDecisionIds: string[];
  sourceChangeIds: string[];
  sourceThreadIds: string[];
};
