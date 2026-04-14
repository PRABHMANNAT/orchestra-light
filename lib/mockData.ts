import type {
  ChangeRecord,
  ClarifiedBrief,
  CommunicationThread,
  DecisionRecord,
  Project,
  SourcePackage,
  SummaryBundle,
  WorkflowDAG
} from "@/lib/types";

export interface TerminalLine {
  text: string;
  delay: number;
}

export interface ClarificationQuestionSpec {
  id: string;
  q: string;
  options: string[];
  answer: string;
  briefField: string;
  briefValue: string;
}

export interface DagNodeData {
  id: string;
  label: string;
  nodeType: "screen" | "capability" | "integration" | "data" | "flow" | "rule" | "decision" | "async";
  priority: "P0" | "P1" | "P2" | "P3";
  inMVP: boolean;
  description: string;
  owner: string;
  demoValue: number;
  position: { x: number; y: number };
}

export interface DagEdgeData {
  id: string;
  source: string;
  target: string;
  label: string;
  critical: boolean;
}

export interface ExecutionTask {
  id: string;
  title: string;
  dag: string[];
  priority: "P0" | "P1" | "P2" | "P3";
  dependencies: string[];
  acceptance: string[];
  assignee: string;
  status: "todo" | "in-progress" | "in-review" | "done";
}

export interface ExecutionEpic {
  id: string;
  title: string;
  priority: "P0" | "P1" | "P2";
  tasks: ExecutionTask[];
}

export const projectMeta = {
  version: "BloomFast MVP",
  project: "BloomFast — Uber for flowers MVP",
  client: "Jack · BloomFast",
  activeWindow: "Project brain active",
  health: "2 unresolved changes"
};

export const roleCardContent = [
  {
    role: "pm" as const,
    title: "Manager Workspace",
    name: "Sarah Chen",
    access: "Full BloomFast project brain access"
  }
];

export const mockProject: Project = {
  id: "bloomfast",
  name: "BloomFast MVP",
  client: "BloomFast",
  createdAt: "2026-04-10T09:00:00Z",
  status: "active"
};

export const mockSourcePackage: SourcePackage = {
  id: "sp-001",
  projectId: "bloomfast",
  version: 1,
  summary:
    "BloomFast is an on-demand flower delivery marketplace connecting buyers to local florists. Client wants an MVP with buyer-facing ordering, florist-facing order management, and driver assignment.",
  actors: ["Buyer", "Florist", "Delivery Driver", "Platform Admin"],
  features: [
    "Buyer browses and orders from local florists",
    "Florist receives and confirms orders",
    "Driver is assigned and tracks delivery",
    "Pro subscription tier with better revenue share for florists",
    "Manager approval before driver assignment"
  ],
  constraints: ["MVP in 8 weeks", "No in-house delivery fleet - driver network is third-party"],
  integrations: ["Stripe for payments", "Google Maps for delivery tracking", "WhatsApp Business for florist notifications"],
  knownUnknowns: ["How driver assignment logic works in detail", "Whether Pro subscription is MVP or post-MVP"],
  risks: ["Driver availability dependency on third-party", "Revenue share model not fully defined"],
  contradictions: ["Client mentioned Pro subscription in one call but said MVP should be free-tier only in another"],
  evidenceRefs: ["BloomFast_PRD_v2.pdf", "Discovery call notes 12 March", "WhatsApp thread with Jack 14 April"],
  confidenceSummary:
    "High confidence on core buyer/florist flows. Low confidence on subscription model and driver assignment approval.",
  createdAt: "2026-04-10T09:00:00Z",
  accepted: true
};

export const mockClarifiedBrief: ClarifiedBrief = {
  id: "cb-001",
  projectId: "bloomfast",
  version: 1,
  targetUsers: ["Buyers ordering flowers online", "Florists managing orders"],
  userRoles: ["Buyer", "Florist", "Driver", "Admin"],
  primaryJourney: "Buyer places order -> Florist confirms -> Driver is assigned and delivers -> Buyer receives",
  mvpObjective: "Working end-to-end order flow for buyers and florists. No Pro subscription in MVP.",
  scopeIn: [
    "Order placement and confirmation",
    "Florist order management dashboard",
    "Basic driver assignment",
    "Stripe payment integration",
    "Order tracking page"
  ],
  scopeOut: ["Pro subscription tier", "Manager approval gate before assignment", "In-house driver fleet", "Advanced analytics"],
  constraints: ["8-week delivery window", "React Native for mobile (iOS first)", "Supabase backend"],
  mustHaveIntegrations: ["Stripe", "Google Maps"],
  approvalConditions: ["Client must sign off on scope-out list before build begins"],
  unresolvedDecisions: ["Pro subscription: post-MVP or phase 2?", "Driver assignment: auto-assign or manual florist choice?"],
  risks: ["Scope creep on subscription feature", "Driver API dependency unclear"],
  assumptionSummary:
    "We are assuming no manager approval gate in MVP. Pro subscription is deferred. Driver assignment is auto-assign based on proximity.",
  createdAt: "2026-04-11T10:30:00Z",
  accepted: true
};

export const mockWorkflowDAG: WorkflowDAG = {
  id: "dag-001",
  projectId: "bloomfast",
  version: 1,
  nodes: [
    {
      id: "node-buyer-ordering",
      label: "Buyer Ordering Flow",
      type: "flow",
      description: "Buyer browses local florists, selects a bouquet, pays, and receives tracking.",
      dependencies: ["node-payments", "node-florist-dashboard"],
      isCriticalPath: true,
      isRisky: false,
      isUnresolved: false
    },
    {
      id: "node-florist-dashboard",
      label: "Florist Dashboard",
      type: "module",
      description: "Florists receive, confirm, and prepare orders before driver assignment.",
      dependencies: ["node-notifications"],
      isCriticalPath: true,
      isRisky: false,
      isUnresolved: false
    },
    {
      id: "node-driver-assign",
      label: "Driver Assignment",
      type: "flow",
      description: "Auto-assign the nearest available third-party driver after florist confirmation.",
      dependencies: ["node-florist-dashboard", "node-admin-panel"],
      isCriticalPath: true,
      isRisky: true,
      isUnresolved: false
    },
    {
      id: "node-payments",
      label: "Payment Integration",
      type: "integration",
      description: "Stripe payment capture for card and Apple Pay at checkout.",
      dependencies: [],
      isCriticalPath: true,
      isRisky: false,
      isUnresolved: false
    },
    {
      id: "node-subscription",
      label: "Subscription Model",
      type: "unresolved",
      description: "Pro florist subscription with alternate revenue share. Scoped out of MVP but re-requested.",
      dependencies: ["node-payments", "node-florist-dashboard"],
      isCriticalPath: false,
      isRisky: true,
      isUnresolved: true
    },
    {
      id: "node-admin-panel",
      label: "Admin Panel",
      type: "approval",
      description: "Platform admin view for order exceptions, manual overrides, and support.",
      dependencies: ["node-driver-assign"],
      isCriticalPath: false,
      isRisky: false,
      isUnresolved: false
    },
    {
      id: "node-notifications",
      label: "Notifications",
      type: "integration",
      description: "WhatsApp Business notifications for florists and delivery status updates.",
      dependencies: [],
      isCriticalPath: false,
      isRisky: false,
      isUnresolved: false
    },
    {
      id: "node-driver-api-risk",
      label: "Third-party Driver API",
      type: "risk",
      description: "Driver availability and API contract are not fully validated.",
      dependencies: ["node-driver-assign"],
      isCriticalPath: true,
      isRisky: true,
      isUnresolved: true
    }
  ],
  edges: [
    { id: "edge-001", from: "node-payments", to: "node-buyer-ordering", label: "checkout", isCritical: true },
    { id: "edge-002", from: "node-buyer-ordering", to: "node-florist-dashboard", label: "creates order", isCritical: true },
    { id: "edge-003", from: "node-florist-dashboard", to: "node-driver-assign", label: "confirms", isCritical: true },
    { id: "edge-004", from: "node-notifications", to: "node-florist-dashboard", label: "alerts florist" },
    { id: "edge-005", from: "node-driver-assign", to: "node-admin-panel", label: "exceptions" },
    { id: "edge-006", from: "node-payments", to: "node-subscription", label: "billing" },
    { id: "edge-007", from: "node-driver-api-risk", to: "node-driver-assign", label: "availability", isCritical: true }
  ],
  criticalPath: ["node-payments", "node-buyer-ordering", "node-florist-dashboard", "node-driver-assign"],
  accepted: true,
  createdAt: "2026-04-11T12:00:00Z"
};

export const mockThreads: CommunicationThread[] = [
  {
    id: "thread-001",
    projectId: "bloomfast",
    channel: "whatsapp",
    subject: "Manager approval before assignment",
    participants: ["Jack (BloomFast)", "Sarah (Tempest PM)"],
    messages: [
      {
        id: "msg-001",
        threadId: "thread-001",
        sender: "Jack (BloomFast)",
        content:
          "Hey Sarah - one thing we forgot to mention. We need manager approval before any driver gets assigned to an order. The florist manager has to sign off first.",
        timestamp: "2026-04-14T09:15:00Z",
        channel: "whatsapp",
        insight: {
          id: "ins-001",
          classification: "scope_change",
          mappedProjectArea: "Driver Assignment Flow",
          mappedDAGNodeId: "node-driver-assign",
          suggestedAction: "Assess impact on assignment flow and MVP timeline. Flag as scope change candidate.",
          confidence: 0.91,
          reviewedByHuman: false
        }
      }
    ],
    linkedProjectArea: "Driver Assignment Flow",
    linkedDAGNodeId: "node-driver-assign",
    createdAt: "2026-04-14T09:15:00Z",
    updatedAt: "2026-04-14T09:15:00Z"
  },
  {
    id: "thread-002",
    projectId: "bloomfast",
    channel: "slack",
    subject: "Pro subscription revenue share",
    participants: ["Jack (BloomFast)", "Sarah (Tempest PM)", "Dev Team"],
    messages: [
      {
        id: "msg-002",
        threadId: "thread-002",
        sender: "Jack (BloomFast)",
        content:
          "Can we add a Pro subscription for florists with better revenue share? Like 85% instead of 70%? I think it would really help retention.",
        timestamp: "2026-04-14T11:40:00Z",
        channel: "slack",
        insight: {
          id: "ins-002",
          classification: "scope_change",
          mappedProjectArea: "Subscription Model",
          mappedDAGNodeId: "node-subscription",
          suggestedAction:
            "This contradicts the agreed scope-out of Pro subscription. Flag contradiction and request client confirmation.",
          confidence: 0.96,
          reviewedByHuman: false
        }
      },
      {
        id: "msg-003",
        threadId: "thread-002",
        sender: "Sarah (Tempest PM)",
        content: "Jack, we scoped this out of MVP in our brief - do you want to revisit that decision or keep it post-MVP?",
        timestamp: "2026-04-14T11:55:00Z",
        channel: "slack"
      }
    ],
    linkedProjectArea: "Subscription Model",
    linkedDAGNodeId: "node-subscription",
    createdAt: "2026-04-14T11:40:00Z",
    updatedAt: "2026-04-14T11:55:00Z"
  },
  {
    id: "thread-003",
    projectId: "bloomfast",
    channel: "gmail",
    subject: "RE: BloomFast MVP - Payment flow clarification",
    participants: ["jack@bloomfast.com", "sarah@tempest.ai"],
    messages: [
      {
        id: "msg-004",
        threadId: "thread-003",
        sender: "jack@bloomfast.com",
        content:
          "Hi Sarah, just to confirm - the Stripe integration should support both card and Apple Pay at launch. We had a few users mention Apple Pay specifically.",
        timestamp: "2026-04-13T14:20:00Z",
        channel: "gmail",
        insight: {
          id: "ins-003",
          classification: "clarification_needed",
          mappedProjectArea: "Payment Integration",
          mappedDAGNodeId: "node-payments",
          suggestedAction: "Confirm Apple Pay support scope with engineering. Update integrations in Clarified Brief if confirmed.",
          confidence: 0.84,
          reviewedByHuman: true
        }
      }
    ],
    linkedProjectArea: "Payment Integration",
    linkedDAGNodeId: "node-payments",
    createdAt: "2026-04-13T14:20:00Z",
    updatedAt: "2026-04-13T14:20:00Z"
  }
];

export const mockDecisions: DecisionRecord[] = [
  {
    id: "dec-001",
    projectId: "bloomfast",
    whatWasDecided: "Pro subscription is deferred to post-MVP. MVP uses flat 70% revenue share for all florists.",
    decidedBy: "Sarah (PM) + Jack (Client)",
    decidedAt: "2026-04-11T10:30:00Z",
    sourceThreadId: "thread-002",
    affectedProjectArea: "Subscription Model",
    affectedDAGNodeId: "node-subscription",
    status: "final",
    evidenceRefs: ["Clarified Brief v1", "Discovery call 11 April"],
    createdAt: "2026-04-11T10:30:00Z"
  },
  {
    id: "dec-002",
    projectId: "bloomfast",
    whatWasDecided: "Driver assignment is auto-assign based on proximity, not manual florist choice.",
    decidedBy: "Sarah (PM)",
    decidedAt: "2026-04-11T11:00:00Z",
    sourceThreadId: "thread-001",
    affectedProjectArea: "Driver Assignment Flow",
    affectedDAGNodeId: "node-driver-assign",
    status: "pending",
    evidenceRefs: ["Clarified Brief v1"],
    createdAt: "2026-04-11T11:00:00Z"
  }
];

export const mockChanges: ChangeRecord[] = [
  {
    id: "chg-001",
    projectId: "bloomfast",
    whatChanged: "Client requesting manager approval gate before driver assignment",
    previousUnderstanding: "Auto-assign based on proximity, no approval required",
    newUnderstanding: "Florist manager must approve before driver is assigned to any order",
    requestedBy: "Jack (BloomFast)",
    requestedAt: "2026-04-14T09:15:00Z",
    affectedProjectArea: "Driver Assignment Flow",
    affectedDAGNodeId: "node-driver-assign",
    approvalStatus: "pending",
    riskImplication: "Adds a manual approval step to a flow currently designed as automated. Could affect order speed SLA.",
    reworkImplication: "Assignment flow, permissions model, and florist dashboard need rework if approved.",
    evidenceRefs: ["thread-001"],
    createdAt: "2026-04-14T09:30:00Z"
  },
  {
    id: "chg-002",
    projectId: "bloomfast",
    whatChanged: "Client re-requesting Pro subscription feature that was scoped out",
    previousUnderstanding: "Pro subscription deferred to post-MVP, agreed in Clarified Brief v1",
    newUnderstanding: "Client wants Pro subscription (85% revenue share) included in MVP",
    requestedBy: "Jack (BloomFast)",
    requestedAt: "2026-04-14T11:40:00Z",
    affectedProjectArea: "Subscription Model",
    affectedDAGNodeId: "node-subscription",
    approvalStatus: "unresolved",
    riskImplication: "Directly contradicts Clarified Brief v1. Could extend MVP timeline by 2-3 weeks.",
    reworkImplication: "Billing, florist dashboard, and revenue reporting all require new work.",
    evidenceRefs: ["thread-002", "cb-001"],
    createdAt: "2026-04-14T11:45:00Z"
  }
];

export const mockSummaryBundles: SummaryBundle[] = [
  {
    id: "sum-pm-001",
    projectId: "bloomfast",
    role: "pm",
    content:
      "BloomFast has two live scope questions: manager approval before driver assignment and the re-requested Pro subscription. The brief remains accepted, but both requests need explicit human review before the MVP plan changes.",
    generatedAt: "2026-04-14T12:00:00Z",
    sourceDecisionIds: ["dec-001", "dec-002"],
    sourceChangeIds: ["chg-001", "chg-002"],
    sourceThreadIds: ["thread-001", "thread-002", "thread-003"]
  },
  {
    id: "sum-engineer-001",
    projectId: "bloomfast",
    role: "engineer",
    content:
      "Build the accepted MVP flow: buyer order, florist confirmation, auto driver assignment, Stripe payments, Google Maps tracking. Do not implement Pro subscription or manager approval unless approved.",
    generatedAt: "2026-04-14T12:05:00Z",
    sourceDecisionIds: ["dec-001", "dec-002"],
    sourceChangeIds: [],
    sourceThreadIds: ["thread-003"]
  }
];

export const intakeUploadFile = {
  name: "BloomFast_PRD_v2.pdf",
  size: "2.4 MB"
};

export const intakeCards = [
  {
    step: "01",
    title: "Orchestra reads it",
    description: "Parses Jack's brief, PRD, and Slack context into a single structured intake."
  },
  {
    step: "02",
    title: "Extracts requirements",
    description: "Pulls the monetisation, marketplace, payout, and discovery requirements into delivery themes."
  },
  {
    step: "03",
    title: "Asks the right questions",
    description: "Surfaces the hidden decisions Jack has not fully articulated before the agency starts build."
  }
];

export const intakeAnalysisLines: TerminalLine[] = [
  { text: "reading Jack's creator marketplace brief ........ done", delay: 240 },
  { text: "extracting platform, payout, and discovery signals ... done", delay: 220 },
  { text: "mapping founder pain points to delivery stages ....... done", delay: 220 },
  { text: "flagging open decisions for Sarah Chen ............... done", delay: 220 },
  { text: "Tempest AI intake ready for clarification ............ done", delay: 220 }
];

export const clarificationQuestions: ClarificationQuestionSpec[] = [
  {
    id: "q1",
    q: "Who is the primary user Creator Marketplace V1 must serve?",
    options: ["Game creators (supply side)", "Players (demand side)", "Both equally", "Internal team first"],
    answer: "Game creators (supply side)",
    briefField: "PRIMARY USER",
    briefValue: "Game creators publishing browser-native RPG and adventure content through Tempest AI."
  },
  {
    id: "q2",
    q: "Which single flow must the prototype demonstrate end-to-end?",
    options: [
      "Creator signup → asset upload → publish",
      "Player browse → purchase → play",
      "Payout flow → dashboard",
      "Admin moderation flow"
    ],
    answer: "Creator signup → asset upload → publish",
    briefField: "CORE JOURNEY",
    briefValue: "Creator signup → asset upload → publish is the flow Jack needs to feel launch-ready."
  },
  {
    id: "q3",
    q: "What's the minimum for Jack to say 'yes, this is the right direction'?",
    options: [
      "Onboarding + marketplace UI only",
      "Full monetisation flow",
      "Analytics dashboard",
      "Everything in V1"
    ],
    answer: "Onboarding + marketplace UI only",
    briefField: "MVP PROOF POINT",
    briefValue: "The prototype only needs onboarding and marketplace UX to earn sign-off before build expands."
  },
  {
    id: "q4",
    q: "Which integrations are V1 vs deferred?",
    options: ["Stripe now, analytics later", "Analytics now, Stripe later", "Both in V1", "Neither in V1"],
    answer: "Stripe now, analytics later",
    briefField: "INTEGRATIONS (V1)",
    briefValue: "Stripe Connect ships in V1. Advanced analytics ingestion and recommendations are deferred."
  },
  {
    id: "q5",
    q: "What is fixed vs flexible?",
    options: ["Timeline fixed, scope flexible", "Scope fixed, timeline flexible", "Both fixed", "Both flexible"],
    answer: "Timeline fixed, scope flexible",
    briefField: "CONSTRAINTS",
    briefValue: "The 6-week delivery window is fixed. Edge-case monetisation scope can flex around the deadline."
  },
  {
    id: "q6",
    q: "Who signs off on prototype — Jack only, dev lead only, or both?",
    options: ["Jack only", "Dev lead only", "Both required", "Product committee"],
    answer: "Jack only",
    briefField: "SIGN-OFF REQUIRED",
    briefValue: "Jack is the sole approver for the prototype slice and phase-one scope."
  }
];

export const clarifiedBriefRows = clarificationQuestions.map((item) => ({
  label: item.briefField,
  value: item.briefValue
}));

export const clarifiedBrief = {
  title: "Clarified Brief — v1.0",
  generatedAt: "08 APR 2026 · 09:24",
  rows: clarifiedBriefRows
};

export const dagNodes: DagNodeData[] = [
  {
    id: "N1",
    label: "Creator Identity Layer",
    nodeType: "capability",
    priority: "P0",
    inMVP: true,
    description: "The account foundation every creator workflow depends on.",
    owner: "Mike Torres",
    demoValue: 5,
    position: { x: 520, y: 80 }
  },
  {
    id: "N2",
    label: "Creator Signup",
    nodeType: "screen",
    priority: "P1",
    inMVP: true,
    description: "First-touch creator signup flow used in the prototype.",
    owner: "Priya Kapoor",
    demoValue: 5,
    position: { x: 240, y: 210 }
  },
  {
    id: "N3",
    label: "Profile Setup",
    nodeType: "screen",
    priority: "P1",
    inMVP: true,
    description: "Studio info, creator type, and linked game metadata.",
    owner: "Mike Torres",
    demoValue: 5,
    position: { x: 520, y: 210 }
  },
  {
    id: "N4",
    label: "Auth Provider",
    nodeType: "integration",
    priority: "P0",
    inMVP: true,
    description: "Tempest's auth boundary and session handling.",
    owner: "Platform",
    demoValue: 4,
    position: { x: 800, y: 80 }
  },
  {
    id: "N5",
    label: "Portfolio Upload",
    nodeType: "flow",
    priority: "P1",
    inMVP: true,
    description: "Upload showcase assets and connect creator games.",
    owner: "Priya Kapoor",
    demoValue: 5,
    position: { x: 800, y: 210 }
  },
  {
    id: "N6",
    label: "Creator Profile Record",
    nodeType: "data",
    priority: "P1",
    inMVP: true,
    description: "Persistent creator data model powering the dashboard.",
    owner: "Data Team",
    demoValue: 4,
    position: { x: 1080, y: 210 }
  },
  {
    id: "N7",
    label: "Listing Composer",
    nodeType: "screen",
    priority: "P0",
    inMVP: true,
    description: "Create marketplace listings with previews, pricing, and tags.",
    owner: "Mike Torres",
    demoValue: 5,
    position: { x: 1360, y: 210 }
  },
  {
    id: "N8",
    label: "Creator Tier Rules",
    nodeType: "rule",
    priority: "P1",
    inMVP: true,
    description: "Free / Pro / Studio logic that now influences monetisation scope.",
    owner: "Sarah Chen",
    demoValue: 4,
    position: { x: 1360, y: 360 }
  },
  {
    id: "N9",
    label: "Publish Dashboard",
    nodeType: "screen",
    priority: "P0",
    inMVP: true,
    description: "Launch panel for getting assets live in the creator marketplace.",
    owner: "Priya Kapoor",
    demoValue: 5,
    position: { x: 1640, y: 210 }
  },
  {
    id: "N10",
    label: "Marketplace Feed",
    nodeType: "screen",
    priority: "P1",
    inMVP: true,
    description: "Public-facing feed showing featured and newly published content.",
    owner: "Growth",
    demoValue: 4,
    position: { x: 1640, y: 420 }
  },
  {
    id: "N11",
    label: "Onboarding Email Sequence",
    nodeType: "async",
    priority: "P3",
    inMVP: false,
    description: "Lifecycle email nudges after signup.",
    owner: "Growth",
    demoValue: 2,
    position: { x: 240, y: 420 }
  },
  {
    id: "N12",
    label: "Revenue Split Engine",
    nodeType: "decision",
    priority: "P1",
    inMVP: false,
    description: "Applies default 70/30 split and upcoming Pro adjustments.",
    owner: "Sarah Chen",
    demoValue: 4,
    position: { x: 800, y: 420 }
  },
  {
    id: "N13",
    label: "Stripe Connect",
    nodeType: "integration",
    priority: "P0",
    inMVP: false,
    description: "Payout plumbing for creator withdrawals.",
    owner: "Jack",
    demoValue: 4,
    position: { x: 1080, y: 420 }
  },
  {
    id: "N14",
    label: "Payout Dashboard",
    nodeType: "screen",
    priority: "P1",
    inMVP: false,
    description: "Shows available balance, payout history, and verification state.",
    owner: "Mike Torres",
    demoValue: 3,
    position: { x: 1360, y: 560 }
  },
  {
    id: "N15",
    label: "Analytics Capture",
    nodeType: "data",
    priority: "P2",
    inMVP: false,
    description: "Gameplay and revenue event ingestion for creator analytics.",
    owner: "Data Team",
    demoValue: 3,
    position: { x: 520, y: 560 }
  },
  {
    id: "N16",
    label: "Creator Analytics",
    nodeType: "screen",
    priority: "P2",
    inMVP: false,
    description: "Per-asset revenue and play count dashboard.",
    owner: "Priya Kapoor",
    demoValue: 3,
    position: { x: 800, y: 560 }
  },
  {
    id: "N17",
    label: "Discovery Ranking",
    nodeType: "flow",
    priority: "P1",
    inMVP: false,
    description: "Determines what gets featured, trending, and promoted.",
    owner: "Growth",
    demoValue: 3,
    position: { x: 1080, y: 560 }
  },
  {
    id: "N18",
    label: "AI Recommendations",
    nodeType: "capability",
    priority: "P2",
    inMVP: false,
    description: "Personalised recommendations using player behaviour after beta launch.",
    owner: "Engineering",
    demoValue: 2,
    position: { x: 1640, y: 560 }
  }
];

export const dagEdges: DagEdgeData[] = [
  { id: "e1", source: "N4", target: "N1", label: "auth", critical: true },
  { id: "e2", source: "N1", target: "N2", label: "starts", critical: true },
  { id: "e3", source: "N2", target: "N3", label: "unlocks", critical: true },
  { id: "e4", source: "N3", target: "N5", label: "requires", critical: true },
  { id: "e5", source: "N5", target: "N6", label: "writes", critical: false },
  { id: "e6", source: "N6", target: "N7", label: "hydrates", critical: true },
  { id: "e7", source: "N8", target: "N7", label: "constrains", critical: false },
  { id: "e8", source: "N7", target: "N9", label: "publishes", critical: true },
  { id: "e9", source: "N9", target: "N10", label: "feeds", critical: true },
  { id: "e10", source: "N11", target: "N3", label: "follows", critical: false },
  { id: "e11", source: "N9", target: "N12", label: "triggers", critical: false },
  { id: "e12", source: "N12", target: "N13", label: "settles", critical: false },
  { id: "e13", source: "N13", target: "N14", label: "shows in", critical: false },
  { id: "e14", source: "N10", target: "N17", label: "ranks", critical: false },
  { id: "e15", source: "N15", target: "N16", label: "powers", critical: false },
  { id: "e16", source: "N10", target: "N15", label: "emits", critical: false },
  { id: "e17", source: "N15", target: "N18", label: "trains", critical: false },
  { id: "e18", source: "N8", target: "N17", label: "reshapes", critical: false },
  { id: "e19", source: "N12", target: "N17", label: "influences", critical: false },
  { id: "e20", source: "N17", target: "N10", label: "reorders", critical: false },
  { id: "e21", source: "N5", target: "N7", label: "feeds", critical: true }
];

export const prototypeScreens = [
  { id: "signup", label: "Creator Signup", shortLabel: "01", url: "app.tempest.ai/creator/signup", route: "creator-signup" },
  { id: "portfolio", label: "Portfolio Upload", shortLabel: "02", url: "app.tempest.ai/creator/portfolio", route: "portfolio-upload" },
  { id: "marketplace", label: "Asset Marketplace", shortLabel: "03", url: "app.tempest.ai/creator/marketplace", route: "asset-marketplace" },
  { id: "revenue", label: "Revenue Dashboard", shortLabel: "04", url: "app.tempest.ai/creator/revenue", route: "revenue-dashboard" },
  { id: "discovery", label: "Discovery Feed", shortLabel: "05", url: "app.tempest.ai/discovery", route: "discovery-feed" }
] as const;

export const prototypeScope = {
  included: [
    "Creator signup and studio profile setup",
    "Portfolio upload with linked games",
    "Asset listing UI with preview and publish state",
    "Marketplace feed with tags and featured slots"
  ],
  mocked: [
    "Stripe onboarding state",
    "Revenue dashboard balances",
    "Featured placement rules",
    "Creator analytics cards"
  ],
  deferred: ["AI recommendations", "Creator subscription upgrades", "Weekly digest email", "Mobile creator tools"]
};

export const prototypeNodeChips = ["N2", "N3", "N5", "N7", "N9", "N10"];

export const approvalApprovers = [
  { name: "Sarah Chen", role: "Project Manager", status: "REVIEWED ✓" },
  { name: "Jack", role: "Founder · Tempest AI", status: "Waiting for you, Jack." }
];

export const scopeSummary = {
  inScope: [
    "Creator signup + profile setup",
    "Portfolio upload + game linking",
    "Asset listing UI with tags and previews",
    "Search and filter system",
    "Featured games carousel",
    "Revenue split engine foundation"
  ],
  outOfScope: [
    "AI recommendation engine",
    "Weekly creator digest email",
    "Mobile creator app",
    "Full subscription billing automation"
  ]
};

export const executionEpics: ExecutionEpic[] = [
  {
    id: "E1",
    title: "Creator Onboarding Flow",
    priority: "P1",
    tasks: [
      {
        id: "E1-T1",
        title: "Creator signup + profile setup",
        dag: ["N2", "N3"],
        priority: "P1",
        dependencies: [],
        acceptance: ["Signup validates email and studio name", "Profile setup persists creator tier", "Success state routes to portfolio flow"],
        assignee: "Mike Torres",
        status: "done"
      },
      {
        id: "E1-T2",
        title: "Portfolio upload + game linking",
        dag: ["N5", "N6"],
        priority: "P2",
        dependencies: ["E1-T1"],
        acceptance: ["Creators upload showcase assets", "Linked games show on profile", "Uploads retry cleanly on bad connections"],
        assignee: "Priya Kapoor",
        status: "in-review"
      },
      {
        id: "E1-T3",
        title: "Creator tier system (Free / Pro / Studio)",
        dag: ["N8"],
        priority: "P1",
        dependencies: ["E1-T1"],
        acceptance: ["Tier copy is visible during onboarding", "Limits map to upload permissions", "Tier state persists on account"],
        assignee: "Sarah Chen",
        status: "in-progress"
      },
      {
        id: "E1-T4",
        title: "Onboarding email sequence integration",
        dag: ["N11"],
        priority: "P3",
        dependencies: ["E1-T1"],
        acceptance: ["Welcome email fires after signup", "Follow-up content references publish milestone", "Templates are editable without code changes"],
        assignee: "Growth",
        status: "todo"
      }
    ]
  },
  {
    id: "E2",
    title: "Asset Marketplace",
    priority: "P0",
    tasks: [
      {
        id: "E2-T1",
        title: "Asset listing UI with tags and previews",
        dag: ["N7", "N9"],
        priority: "P1",
        dependencies: ["E1-T2"],
        acceptance: ["Listing form supports tags and preview media", "Preview matches live marketplace card", "Draft state saves automatically"],
        assignee: "Mike Torres",
        status: "in-review"
      },
      {
        id: "E2-T2",
        title: "Asset upload pipeline + CDN integration",
        dag: ["N5", "N7"],
        priority: "P0",
        dependencies: ["E1-T2"],
        acceptance: ["Uploads return CDN URL payloads", "Asset preview renders fast in browser", "Failed uploads can resume"],
        assignee: "Priya Kapoor",
        status: "in-progress"
      },
      {
        id: "E2-T3",
        title: "Search and filter system",
        dag: ["N10", "N17"],
        priority: "P1",
        dependencies: ["E2-T1"],
        acceptance: ["Players filter by tag, genre, and format", "Search returns relevant marketplace items", "Filter state persists in feed"],
        assignee: "Growth",
        status: "todo"
      },
      {
        id: "E2-T4",
        title: "Asset versioning and update flow",
        dag: ["N7", "N9"],
        priority: "P2",
        dependencies: ["E2-T1"],
        acceptance: ["Creators can publish revisions", "Previous version remains recoverable", "Version badge is visible in dashboard"],
        assignee: "Priya Kapoor",
        status: "todo"
      }
    ]
  },
  {
    id: "E3",
    title: "Revenue & Payouts",
    priority: "P0",
    tasks: [
      {
        id: "E3-T1",
        title: "Stripe Connect integration for creator payouts",
        dag: ["N12", "N13"],
        priority: "P0",
        dependencies: ["E2-T1"],
        acceptance: ["Creator onboarding opens Stripe verification", "Verification state returns to the dashboard", "Tempest test payouts complete end-to-end"],
        assignee: "Mike Torres",
        status: "in-progress"
      },
      {
        id: "E3-T2",
        title: "Revenue split engine (70/30 default)",
        dag: ["N12"],
        priority: "P1",
        dependencies: ["E3-T1"],
        acceptance: ["Default split stores against creator account", "Split updates map to payout preview", "Future Pro override is extensible"],
        assignee: "Sarah Chen",
        status: "todo"
      },
      {
        id: "E3-T3",
        title: "Payout dashboard for creators",
        dag: ["N14"],
        priority: "P1",
        dependencies: ["E3-T1"],
        acceptance: ["Current balance, history, and verification state display clearly", "Creators see payout timing expectations", "Empty state matches Tempest tone"],
        assignee: "Priya Kapoor",
        status: "todo"
      },
      {
        id: "E3-T4",
        title: "Tax form collection",
        dag: ["N13"],
        priority: "P3",
        dependencies: ["E3-T1"],
        acceptance: ["Tax form prompt is visible when required", "Creators can upload missing tax docs", "Completion status feeds payout readiness"],
        assignee: "Finance Ops",
        status: "todo"
      }
    ]
  },
  {
    id: "E4",
    title: "Creator Analytics",
    priority: "P1",
    tasks: [
      {
        id: "E4-T1",
        title: "Game play count + session tracking",
        dag: ["N15"],
        priority: "P1",
        dependencies: ["E2-T1"],
        acceptance: ["Play count events fire on sessions", "Session length is captured", "Data quality checks flag malformed events"],
        assignee: "Data Team",
        status: "in-progress"
      },
      {
        id: "E4-T2",
        title: "Revenue analytics per asset",
        dag: ["N16"],
        priority: "P1",
        dependencies: ["E4-T1", "E3-T2"],
        acceptance: ["Revenue chart breaks down by asset", "Filters support date ranges", "Creator sees clear payout implications"],
        assignee: "Priya Kapoor",
        status: "todo"
      },
      {
        id: "E4-T3",
        title: "Creator leaderboard",
        dag: ["N16", "N17"],
        priority: "P2",
        dependencies: ["E4-T1"],
        acceptance: ["Leaderboard ranks creators fairly", "Featured logic can consume leaderboard signals", "Tie-breaking rules are defined"],
        assignee: "Growth",
        status: "todo"
      },
      {
        id: "E4-T4",
        title: "Weekly creator digest email",
        dag: ["N11", "N16"],
        priority: "P3",
        dependencies: ["E4-T2"],
        acceptance: ["Digest content pulls from analytics source of truth", "Email renders correctly in key clients", "Creators can opt out cleanly"],
        assignee: "Growth",
        status: "todo"
      }
    ]
  },
  {
    id: "E5",
    title: "Game Discovery",
    priority: "P1",
    tasks: [
      {
        id: "E5-T1",
        title: "Featured games carousel",
        dag: ["N10", "N17"],
        priority: "P1",
        dependencies: ["E2-T1"],
        acceptance: ["Featured cards display key marketplace metadata", "Editorial picks are easy to manage", "Carousel works on desktop and tablet"],
        assignee: "Priya Kapoor",
        status: "done"
      },
      {
        id: "E5-T2",
        title: "Tag-based discovery feed",
        dag: ["N10", "N17"],
        priority: "P1",
        dependencies: ["E2-T3"],
        acceptance: ["Discovery feed groups games by meaningful tags", "Sorting feels relevant for launch inventory", "Performance is acceptable for beta traffic"],
        assignee: "Growth",
        status: "in-progress"
      },
      {
        id: "E5-T3",
        title: "AI-recommended games per player",
        dag: ["N18"],
        priority: "P2",
        dependencies: ["E4-T1"],
        acceptance: ["Recommendation logic has enough data to test relevance", "Fallback states exist when data is sparse", "Model assumptions are documented"],
        assignee: "Engineering",
        status: "todo"
      },
      {
        id: "E5-T4",
        title: "Trending this week algorithm",
        dag: ["N17"],
        priority: "P2",
        dependencies: ["E4-T1"],
        acceptance: ["Trending logic weighs newness and engagement", "Abuse and spam cases are documented", "Ranking output feeds discovery cards"],
        assignee: "Growth",
        status: "todo"
      }
    ]
  }
];

export const boardSyncChecklist = [
  "5 epics ready",
  "20 tasks structured",
  "47 subtasks mapped",
  "Sprint 3 boundaries locked"
];

export const boardSyncLines: TerminalLine[] = [
  { text: "5 epics created.", delay: 180 },
  { text: "20 tasks distributed across Mike and Priya.", delay: 170 },
  { text: "Sprint 3 boundaries set.", delay: 170 },
  { text: "Board is live. ✓", delay: 170 }
];

export const changeSyncLines: TerminalLine[] = [
  { text: "Jack added a subscription model.", delay: 180 },
  { text: "3 epics are affected.", delay: 180 },
  { text: "+12 tasks. +2 weeks.", delay: 180 },
  { text: "Still under budget.", delay: 180 }
];

export const changeApplyLines: TerminalLine[] = [
  { text: "Plan updated.", delay: 180 },
  { text: "Sprint 3 adjusted.", delay: 180 },
  { text: "Mike knows.", delay: 180 },
  { text: "New delivery: Week 8. ✓", delay: 180 }
];

export const changePanels = {
  dag: [
    "Insert Creator Tier Rules ahead of Revenue Split Engine so Pro eligibility is explicit.",
    "Discovery ranking now depends on creator tier and premium placement metadata.",
    "Stripe payout assumptions stay intact, but payout preview now needs tier-aware messaging."
  ],
  tasks: [
    "+ Create Pro plan entitlement model",
    "+ Add 80/20 split override logic",
    "+ Add premium placement admin controls",
    "+ Rewrite discovery ranking assumptions",
    "± Refactor payout dashboard copy",
    "± Update creator onboarding messaging"
  ],
  delivery: [
    "Original delivery window: 6 weeks",
    "Reforecasted delivery window: 8 weeks",
    "Affected epics: Asset Marketplace, Revenue & Payouts, Game Discovery"
  ]
};

export const towerMetrics = {
  health: 74,
  onTrack: 8,
  blocked: 2,
  atRisk: 3,
  overallCompletion: 61
};

export const blockerCards = [
  {
    title: "Stripe Connect verification",
    description: "Jack still needs to submit Tempest AI's ABN and banking details before payout testing can clear.",
    owner: "Jack",
    meta: "OWNER · JACK · FOLLOW UP TODAY"
  },
  {
    title: "AI model dataset",
    description: "The recommendation engine does not have enough player data until the beta launch creates real usage volume.",
    owner: "Engineering",
    meta: "OWNER · ENGINEERING · DEFER TO V2"
  }
];

export const dependencyRiskMatrix = [
  { id: "N8", label: "Tier Rules", tone: "stable" },
  { id: "N12", label: "Revenue Split", tone: "watch" },
  { id: "N13", label: "Stripe Connect", tone: "blocked" },
  { id: "N16", label: "Analytics", tone: "watch" },
  { id: "N17", label: "Discovery", tone: "watch" },
  { id: "N18", label: "Recommendations", tone: "deferred" }
];

export const stakeholderTabs = {
  pm: {
    heading: "Manager Delivery Report",
    subheading: "Tempest AI · Creator Marketplace V1 · Sprint 3",
    sections: [
      {
        title: "STANDUP SIGNALS",
        content:
          "Creator onboarding is in shape for Friday. Stripe verification is the only founder-owned blocker still affecting revenue testing."
      },
      {
        title: "SCOPE WATCH",
        content:
          "Jack's Pro creator subscription request is now logged as a change sync. The plan shows +12 tasks and +2 weeks if pulled into V1."
      },
      {
        title: "NEXT ACTIONS",
        content:
          "Follow up on ABN submission, lock marketplace tag taxonomy, and confirm whether discovery premium placement belongs in the current sprint."
      }
    ]
  },
  cto: {
    heading: "CTO Technical Brief",
    subheading: "Architecture, blockers, and implementation status",
    sections: [
      {
        title: "TECHNICAL SIGNALS",
        content:
          "Core onboarding and marketplace shell are stable. Revenue and recommendation dependencies remain the main risk pockets."
      }
    ]
  },
  exec: {
    heading: "Executive Summary",
    subheading: "Jack-facing delivery summary for the current sprint",
    sections: [
      {
        title: "STATUS",
        content:
          "Creator Marketplace V1 is 61% complete and still pointed at an 8-week path if the subscription change is pulled in."
      },
      {
        title: "RISK",
        content:
          "The primary external dependency is Stripe Connect verification. The primary product uncertainty is how premium placement should affect discovery."
      },
      {
        title: "IMPACT",
        content:
          "Prototype confidence is high, agency execution is structured, and the founder-visible risk is now concentrated in monetisation details."
      }
    ]
  },
  client: {
    heading: "Jack, here's where we are.",
    subheading: "Creator Marketplace V1 · 08 APR 2026",
    sections: [
      {
        title: "WHAT MOVED THIS WEEK",
        content:
          "Creator signup, profile setup, and listing composition are now visually locked. The agency team is focusing on marketplace publish flow and payout readiness."
      },
      {
        title: "WHAT NEEDS YOUR INPUT",
        content:
          "We need your Stripe verification details and a final call on whether premium creator placement belongs in V1 or should wait for V2."
      },
      {
        title: "WHAT HAPPENS NEXT",
        content:
          "Once the payout blocker clears, the next founder-visible milestone is a working creator dashboard showing publish state and payout status."
      }
    ]
  }
} as const;

export const weekUpdates = [
  {
    label: "Week 2",
    summary: "The agency locked the creator onboarding concept and clarified the founder approval flow."
  },
  {
    label: "Week 3",
    summary: "Marketplace listing UI is now stable, search scope is defined, and Stripe setup became the primary blocker."
  },
  {
    label: "Week 4",
    summary: "Execution shifted from pure UX into monetisation plumbing. Jack's Pro subscription request created a scoped plan change."
  }
];

export const handoverCards = {
  manager: [
    {
      title: "DELIVERABLES",
      items: [
        "Creator marketplace live in Tempest AI",
        "Stripe payout flow enabled for creators",
        "Dashboard for publish state and payout readiness",
        "847 beta creators onboarded in launch cohort"
      ]
    },
    {
      title: "DOCUMENTATION",
      items: ["API docs", "Creator onboarding guide", "Revenue split spec", "Discovery feed moderation notes"]
    },
    {
      title: "NEXT STEPS",
      items: ["V2 planning", "AI recommendations", "Mobile creator tools", "Subscription upsell validation"]
    }
  ],
  client: [
    {
      title: "LIVE DELIVERABLES",
      items: ["Creator marketplace live", "Payout onboarding active", "Publish dashboard deployed"]
    },
    {
      title: "PLAYBOOKS",
      items: ["Creator onboarding guide", "Ops escalation sheet", "Revenue split policy"]
    },
    {
      title: "NEXT STEPS",
      items: ["Plan V2 roadmap", "Validate premium creator tier", "Review discovery ranking"]
    }
  ]
};

export const clientComments = [
  {
    screen: "Creator Signup",
    body: "The signup value prop feels right. I want creators to immediately understand Tempest is about publishing and monetising, not just hosting assets.",
    author: "Jack",
    timestamp: "08 APR 2026 · 09:12"
  },
  {
    screen: "Asset Marketplace",
    body: "The listing composer is close. I’d like one more cue that premium creators can earn priority placement later.",
    author: "Jack",
    timestamp: "08 APR 2026 · 09:16"
  },
  {
    screen: "Revenue Dashboard",
    body: "Keep the payout view simple for V1. Verification status and expected payout timing matter more than deep finance controls.",
    author: "Jack",
    timestamp: "08 APR 2026 · 09:18"
  }
];

export const devSummary = ["Sprint 3 active", "8 tasks on track", "2 blockers", "1 change request live"];

export const devInProgress = [
  {
    id: "E2-T2",
    title: "Asset upload pipeline + CDN integration",
    summary: "Priya is finishing upload orchestration and preview processing for creator submissions.",
    epic: "Asset Marketplace",
    status: "in-progress" as const,
    owner: "Priya Kapoor"
  },
  {
    id: "E3-T1",
    title: "Stripe Connect integration for creator payouts",
    summary: "Mike is blocked on verification credentials from Jack but the dashboard wiring is ready.",
    epic: "Revenue & Payouts",
    status: "blocked" as const,
    owner: "Mike Torres"
  }
];

export const devTodo = [
  {
    id: "E2-T3",
    title: "Search and filter system",
    note: "Ready once tag taxonomy gets final sign-off from Sarah.",
    status: "revised" as const
  },
  {
    id: "E5-T3",
    title: "AI-recommended games per player",
    note: "Deferred until Tempest beta produces enough real player data.",
    status: "deferred" as const
  }
];

export const sprintBoard = {
  todo: [
    { id: "E2-T3", title: "Search and filter system", dag: "N17", epic: "Asset Marketplace", priority: "p1" },
    { id: "E3-T2", title: "Revenue split engine", dag: "N12", epic: "Revenue & Payouts", priority: "p1" }
  ],
  inProgress: [
    { id: "E2-T2", title: "Asset upload pipeline", dag: "N5", epic: "Asset Marketplace", priority: "p0" },
    { id: "E3-T1", title: "Stripe Connect integration", dag: "N13", epic: "Revenue & Payouts", priority: "p0" }
  ],
  inReview: [
    { id: "E1-T2", title: "Portfolio upload + game linking", dag: "N5", epic: "Creator Onboarding", priority: "p2" },
    { id: "E2-T1", title: "Listing UI with previews", dag: "N9", epic: "Asset Marketplace", priority: "p1" }
  ],
  done: [
    { id: "E1-T1", title: "Creator signup + profile setup", dag: "N2", epic: "Creator Onboarding", priority: "p1" },
    { id: "E5-T1", title: "Featured games carousel", dag: "N10", epic: "Game Discovery", priority: "p1" }
  ]
};

export const dashboardStats = [
  { label: "LIVE LISTINGS", value: "184" },
  { label: "PENDING REVIEWS", value: "09" },
  { label: "EST. PAYOUT", value: "$4.2K" }
];

export const detailTimeline = [
  { label: "Asset uploaded", meta: "09:02" },
  { label: "Preview generated", meta: "09:04" },
  { label: "Awaiting publish", meta: "09:09" }
];

export const reportsBars = [
  { label: "Marketplace revenue", value: 74 },
  { label: "Creator retention", value: 58 },
  { label: "Discovery engagement", value: 61 }
];

export const reportsCategories = ["RPG", "Adventure", "Narrative", "Puzzle"];

export const requestTableRows = [
  { title: "Forest pack", status: "READY", owner: "Jack" },
  { title: "Dungeon tiles", status: "REVIEW", owner: "Sarah" },
  { title: "Dialogue kit", status: "LIVE", owner: "Mike" }
];

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  avatar: string;
  color: "cyan" | "violet" | "blue" | "emerald" | "amber" | "rose";
  utilization: number;
  projects: string[];
  hourlyRate: number;
}

export interface ProjectRecord {
  id: string;
  name: string;
  client: string;
  clientInitials: string;
  clientColor: "blue" | "violet" | "amber";
  status: "active" | "at-risk";
  health: number;
  completion: number;
  budget: number;
  spent: number;
  sprint: string;
  dueDate: string;
  team: string[];
  weeklyVelocity: number[];
  burnData: number[];
  description: string;
  riskLevel: "low" | "medium" | "high";
  stageSlug: "brain" | "changes";
}

export interface TruthDocumentRecord {
  id: string;
  projectId: string;
  type: "client-spec" | "recording" | "document" | "slack-export";
  title: string;
  source: string;
  date: string;
  status: "processed" | "processing";
  extractedRequirements: number;
  icon: "FileText" | "Mic" | "Layers" | "Hash" | "Code2";
  summary: string;
  tags: string[];
}

export interface TruthRequirementRecord {
  id: string;
  docId: string;
  text: string;
  sourceRef: string;
  priority: "P0" | "P1" | "P2" | "P3";
  assignee: string;
  status: "todo" | "in-progress" | "in-review" | "done";
}

export interface ExtractedTaskRecord {
  id: string;
  source: string;
  task: string;
  priority: "P0" | "P1" | "P2" | "P3";
  assignee: string;
  estimatedHours?: number;
  status: "TODO" | "IN_PROGRESS" | "IN_REVIEW" | "DONE";
}

export interface AiTaskQueueItem extends ExtractedTaskRecord {
  sourceType?: string;
}

export interface CommsMessageRecord {
  sender: string;
  time: string;
  text: string;
  platform: "slack" | "whatsapp" | "email" | "discord";
}

export interface CommsThreadRecord {
  id: string;
  projectId: string;
  platform: "slack" | "whatsapp" | "email" | "discord";
  platformColor: "violet" | "emerald" | "blue";
  channel: string;
  preview: string;
  timestamp: string;
  unread: boolean;
  actionable: boolean;
  extractedAction: string;
  socratesAnalysis?: {
    affectedFlows: number;
    milestonesShift: number;
    tasksOutdated: number;
    newTasksNeeded: number;
    timeline: string;
    budget: string;
    breaksMvp: string;
    draftReply: string;
  };
  participants: string[];
  summaryBullets: string[];
  messages: CommsMessageRecord[];
}

export interface ProjectFinancialRecord {
  budget: number;
  spent: number;
  remaining: number;
  projected: number;
  margin: number;
  invoiced: number;
  outstanding: number;
  weeklyBurn: number[];
  budgetAllocation: Array<{ category: string; allocated: number; spent: number }>;
  milestones: Array<{ name: string; value: number; paid: boolean; due?: string }>;
}

export const companyData = {
  name: "Arrayah Digital",
  tagline: "Software delivery agency",
  headcount: 14,
  monthlyRevenue: 124000,
  monthlyBurn: 89000,
  cashRunway: 8.4,
  activeProjects: 3,
  utilizationRate: 84
};

export const teamRoster: TeamMember[] = [
  {
    id: "t1",
    name: "Sarah Chen",
    role: "Project Manager",
    avatar: "SC",
    color: "cyan",
    utilization: 92,
    projects: ["p1", "p2"],
    hourlyRate: 120
  },
  {
    id: "t2",
    name: "Mike Torres",
    role: "Lead Engineer",
    avatar: "MT",
    color: "violet",
    utilization: 100,
    projects: ["p1"],
    hourlyRate: 150
  },
  {
    id: "t3",
    name: "Priya Kapoor",
    role: "Full Stack Dev",
    avatar: "PK",
    color: "blue",
    utilization: 88,
    projects: ["p1", "p3"],
    hourlyRate: 130
  },
  {
    id: "t4",
    name: "James Wu",
    role: "Frontend Dev",
    avatar: "JW",
    color: "emerald",
    utilization: 75,
    projects: ["p2"],
    hourlyRate: 110
  },
  {
    id: "t5",
    name: "Anika Patel",
    role: "QA Engineer",
    avatar: "AP",
    color: "amber",
    utilization: 60,
    projects: ["p2", "p3"],
    hourlyRate: 100
  },
  {
    id: "t6",
    name: "Liam Ford",
    role: "Backend Dev",
    avatar: "LF",
    color: "rose",
    utilization: 95,
    projects: ["p3"],
    hourlyRate: 125
  }
];

export const projects: ProjectRecord[] = [
  {
    id: "bloomfast",
    name: "Uber for Flowers MVP",
    client: "Jack — BloomFast",
    clientInitials: "BF",
    clientColor: "blue",
    status: "active",
    health: 68,
    completion: 34,
    budget: 85000,
    spent: 24000,
    sprint: "brain active",
    dueDate: "Jun 2026",
    team: ["t1", "t2", "t3"],
    weeklyVelocity: [12, 18, 22, 28, 31, 34, 34],
    burnData: [0, 4200, 9800, 15000, 19600, 24000],
    description: "On-demand flower marketplace, florist ops, payments, driver assignment",
    riskLevel: "medium",
    stageSlug: "brain"
  },
  {
    id: "p2",
    name: "Studio Dashboard",
    client: "Elara Games",
    clientInitials: "EG",
    clientColor: "violet",
    status: "active",
    health: 91,
    completion: 38,
    budget: 60000,
    spent: 22800,
    sprint: "2 of 8",
    dueDate: "Aug 2026",
    team: ["t1", "t4", "t5"],
    weeklyVelocity: [20, 28, 32, 38, 35, 38, 40],
    burnData: [0, 5700, 11400, 17100, 22800],
    description: "Real-time analytics dashboard for game studio ops",
    riskLevel: "low",
    stageSlug: "brain"
  },
  {
    id: "p3",
    name: "API Gateway Rebuild",
    client: "NovaCorp",
    clientInitials: "NC",
    clientColor: "amber",
    status: "at-risk",
    health: 52,
    completion: 79,
    budget: 45000,
    spent: 41200,
    sprint: "6 of 7",
    dueDate: "Apr 2026",
    team: ["t3", "t5", "t6"],
    weeklyVelocity: [60, 65, 70, 72, 68, 75, 79],
    burnData: [0, 7500, 16200, 24800, 32100, 38600, 41200],
    description: "Full rebuild of legacy REST gateway to GraphQL + gRPC",
    riskLevel: "high",
    stageSlug: "changes"
  }
];

export const revenueTimeline = [
  { month: "Nov", revenue: 98000, expenses: 82000 },
  { month: "Dec", revenue: 105000, expenses: 85000 },
  { month: "Jan", revenue: 112000, expenses: 87000 },
  { month: "Feb", revenue: 108000, expenses: 86000 },
  { month: "Mar", revenue: 119000, expenses: 88000 },
  { month: "Apr", revenue: 124000, expenses: 89000 }
];

export const truthDocuments: TruthDocumentRecord[] = [
  {
    id: "tr1",
    projectId: "p1",
    type: "client-spec",
    title: "Creator Marketplace Product Brief",
    source: "Jack — Tempest AI",
    date: "12 Mar 2026",
    status: "processed",
    extractedRequirements: 14,
    icon: "FileText",
    summary: "End-to-end spec for creator onboarding, asset marketplace, and revenue split engine.",
    tags: ["onboarding", "marketplace", "payments"]
  },
  {
    id: "tr2",
    projectId: "p1",
    type: "recording",
    title: "Kickoff Call Recording — 45min",
    source: "Google Meet",
    date: "15 Mar 2026",
    status: "processed",
    extractedRequirements: 8,
    icon: "Mic",
    summary: "Jack confirmed Stripe Connect, 70/30 default split, creator tiers as V1 priorities.",
    tags: ["stripe", "tiers", "V1 scope"]
  },
  {
    id: "tr3",
    projectId: "p1",
    type: "document",
    title: "Figma Design System Export",
    source: "Figma",
    date: "18 Mar 2026",
    status: "processed",
    extractedRequirements: 22,
    icon: "Layers",
    summary: "Full component library and screen flows for creator-facing surfaces.",
    tags: ["design", "components", "screens"]
  },
  {
    id: "tr4",
    projectId: "p1",
    type: "slack-export",
    title: "Slack Export — #tempestai-project",
    source: "Slack",
    date: "01 Apr 2026",
    status: "processing",
    extractedRequirements: 6,
    icon: "Hash",
    summary: "Thread discussing Pro subscription addition, pricing model debate.",
    tags: ["scope change", "subscription", "pricing"]
  },
  {
    id: "tr5",
    projectId: "p1",
    type: "document",
    title: "Tempest AI Technical Architecture Doc",
    source: "Notion",
    date: "20 Mar 2026",
    status: "processed",
    extractedRequirements: 18,
    icon: "Code2",
    summary: "Existing platform architecture — auth, CDN, game engine APIs.",
    tags: ["architecture", "APIs", "constraints"]
  },
  {
    id: "tr6",
    projectId: "p2",
    type: "client-spec",
    title: "Studio Dashboard Requirements Brief",
    source: "Elara Games",
    date: "09 Mar 2026",
    status: "processed",
    extractedRequirements: 11,
    icon: "FileText",
    summary: "Operational analytics dashboard covering retention, crash monitoring, and release health.",
    tags: ["analytics", "studio ops", "reporting"]
  },
  {
    id: "tr7",
    projectId: "p2",
    type: "document",
    title: "Elara Figma Wireframes",
    source: "Figma",
    date: "14 Mar 2026",
    status: "processed",
    extractedRequirements: 17,
    icon: "Layers",
    summary: "Component layouts and dashboard modules for studio leadership and live-ops teams.",
    tags: ["design", "charts", "dashboards"]
  },
  {
    id: "tr8",
    projectId: "p3",
    type: "document",
    title: "Gateway Rebuild Technical Constraints",
    source: "NovaCorp Engineering",
    date: "04 Feb 2026",
    status: "processed",
    extractedRequirements: 13,
    icon: "Code2",
    summary: "Migration constraints for GraphQL edge services, gRPC backplane, and auth compatibility.",
    tags: ["graphql", "grpc", "migration"]
  },
  {
    id: "tr9",
    projectId: "p3",
    type: "recording",
    title: "Incident Review Recording",
    source: "Zoom",
    date: "22 Mar 2026",
    status: "processed",
    extractedRequirements: 7,
    icon: "Mic",
    summary: "Postmortem on gateway instability and outage-driven rebuild priorities.",
    tags: ["incident", "stability", "sla"]
  }
];

export const truthRequirements: TruthRequirementRecord[] = [
  {
    id: "rq1",
    docId: "tr1",
    text: "Creator onboarding must capture studio identity, creator tier intent, and linked game metadata before publish is unlocked.",
    sourceRef: "from 'Creator Marketplace Product Brief'",
    priority: "P1",
    assignee: "t3",
    status: "in-progress"
  },
  {
    id: "rq2",
    docId: "tr1",
    text: "Marketplace listings need tags, preview media, pricing controls, and a visible publish state for creators.",
    sourceRef: "from 'Creator Marketplace Product Brief'",
    priority: "P1",
    assignee: "t2",
    status: "todo"
  },
  {
    id: "rq3",
    docId: "tr1",
    text: "Revenue split defaults to 70/30 in V1, with room for a later Pro tier override without reworking payout logic.",
    sourceRef: "from 'Creator Marketplace Product Brief'",
    priority: "P1",
    assignee: "t2",
    status: "todo"
  },
  {
    id: "rq4",
    docId: "tr1",
    text: "Creator dashboard needs payout readiness, publish status, and marketplace visibility signals in one surface.",
    sourceRef: "from 'Creator Marketplace Product Brief'",
    priority: "P2",
    assignee: "t3",
    status: "todo"
  },
  {
    id: "rq5",
    docId: "tr2",
    text: "Stripe Connect onboarding is mandatory for creator payouts and must return verification state into the Tempest dashboard.",
    sourceRef: "from 'Kickoff Call Recording — 45min'",
    priority: "P0",
    assignee: "t2",
    status: "in-progress"
  },
  {
    id: "rq6",
    docId: "tr2",
    text: "Creator tiers are explicitly Free / Pro / Studio and messaging must frame them as monetisation unlocks, not just limits.",
    sourceRef: "from 'Kickoff Call Recording — 45min'",
    priority: "P1",
    assignee: "t1",
    status: "todo"
  },
  {
    id: "rq7",
    docId: "tr3",
    text: "Asset cards require hover preview, creator attribution, pricing, and publish badges that match the live marketplace feed.",
    sourceRef: "from 'Figma Design System Export'",
    priority: "P1",
    assignee: "t4",
    status: "todo"
  },
  {
    id: "rq8",
    docId: "tr3",
    text: "Creator dashboard should expose weekly earnings comparison, asset-level revenue, and recent engagement metrics.",
    sourceRef: "from 'Figma Design System Export'",
    priority: "P2",
    assignee: "t3",
    status: "todo"
  },
  {
    id: "rq9",
    docId: "tr4",
    text: "Pro subscription introduces a $29/month plan, 80/20 creator split, and priority marketplace placement.",
    sourceRef: "from 'Slack Export — #tempestai-project'",
    priority: "P1",
    assignee: "t2",
    status: "todo"
  },
  {
    id: "rq10",
    docId: "tr4",
    text: "Discovery feed must support tag-based filtering alongside categories to match how Tempest players find content.",
    sourceRef: "from 'Slack Export — #tempestai-project'",
    priority: "P1",
    assignee: "t3",
    status: "todo"
  },
  {
    id: "rq11",
    docId: "tr5",
    text: "Existing Tempest auth, CDN, and game engine APIs must remain unchanged while the creator monetisation layer is introduced.",
    sourceRef: "from 'Tempest AI Technical Architecture Doc'",
    priority: "P1",
    assignee: "t6",
    status: "in-review"
  },
  {
    id: "rq12",
    docId: "tr5",
    text: "Payout and analytics services must be modular so creator features can expand into recommendations and subscriptions in V2.",
    sourceRef: "from 'Tempest AI Technical Architecture Doc'",
    priority: "P2",
    assignee: "t6",
    status: "todo"
  },
  {
    id: "rq13",
    docId: "tr6",
    text: "Studio Dashboard must surface DAU, revenue, and release health in a single leadership view.",
    sourceRef: "from 'Studio Dashboard Requirements Brief'",
    priority: "P1",
    assignee: "t4",
    status: "in-progress"
  },
  {
    id: "rq14",
    docId: "tr7",
    text: "Analytics widgets should support drill-down from studio-level KPIs into title-level metrics.",
    sourceRef: "from 'Elara Figma Wireframes'",
    priority: "P2",
    assignee: "t5",
    status: "todo"
  },
  {
    id: "rq15",
    docId: "tr8",
    text: "Gateway rebuild must preserve auth compatibility while shifting the edge to GraphQL.",
    sourceRef: "from 'Gateway Rebuild Technical Constraints'",
    priority: "P0",
    assignee: "t6",
    status: "in-progress"
  },
  {
    id: "rq16",
    docId: "tr9",
    text: "Incident telemetry needs to be queryable across both legacy REST and the new gRPC stack during migration.",
    sourceRef: "from 'Incident Review Recording'",
    priority: "P1",
    assignee: "t3",
    status: "todo"
  }
];

export const extractedTasks: ExtractedTaskRecord[] = [
  {
    id: "et1",
    source: "tr1",
    task: "Creator signup flow with email verification",
    priority: "P1",
    assignee: "t3",
    estimatedHours: 8,
    status: "IN_PROGRESS"
  },
  {
    id: "et2",
    source: "tr2",
    task: "Stripe Connect onboarding for creator payouts",
    priority: "P0",
    assignee: "t2",
    estimatedHours: 14,
    status: "IN_PROGRESS"
  },
  {
    id: "et3",
    source: "tr3",
    task: "Asset card component with preview on hover",
    priority: "P1",
    assignee: "t4",
    estimatedHours: 6,
    status: "TODO"
  },
  {
    id: "et4",
    source: "tr1",
    task: "Creator tier system: Free / Pro / Studio logic",
    priority: "P1",
    assignee: "t2",
    estimatedHours: 10,
    status: "TODO"
  },
  {
    id: "et5",
    source: "tr4",
    task: "Revenue split toggle: 70/30 vs 80/20 for Pro",
    priority: "P1",
    assignee: "t2",
    estimatedHours: 9,
    status: "TODO"
  },
  {
    id: "et6",
    source: "tr2",
    task: "Revenue analytics per asset — chart view",
    priority: "P2",
    assignee: "t3",
    estimatedHours: 7,
    status: "TODO"
  },
  {
    id: "et7",
    source: "tr6",
    task: "Studio KPI hero strip for DAU, revenue, and release health",
    priority: "P1",
    assignee: "t4",
    estimatedHours: 10,
    status: "IN_PROGRESS"
  },
  {
    id: "et8",
    source: "tr8",
    task: "GraphQL edge contract compatible with legacy auth",
    priority: "P0",
    assignee: "t6",
    estimatedHours: 16,
    status: "IN_PROGRESS"
  }
];

export const brainDocuments = truthDocuments;

export const aiTaskQueue: AiTaskQueueItem[] = [
  {
    id: "ai-1",
    source: "tr1",
    sourceType: "spec",
    task: "Creator signup flow with email verification",
    priority: "P1",
    assignee: "t3",
    estimatedHours: 8,
    status: "IN_PROGRESS"
  },
  {
    id: "ai-2",
    source: "tr2",
    sourceType: "recording",
    task: "Stripe Connect onboarding for creator payouts",
    priority: "P0",
    assignee: "t2",
    estimatedHours: 14,
    status: "IN_PROGRESS"
  },
  {
    id: "ai-3",
    source: "tr4",
    sourceType: "chat export",
    task: "Revenue split toggle: 70/30 vs 80/20 for Pro",
    priority: "P1",
    assignee: "t2",
    estimatedHours: 9,
    status: "TODO"
  },
  {
    id: "ai-4",
    source: "tr3",
    sourceType: "design export",
    task: "Asset card component with preview on hover",
    priority: "P1",
    assignee: "t4",
    estimatedHours: 6,
    status: "TODO"
  }
];

export const newRBACTasks: AiTaskQueueItem[] = [
  {
    id: "rbac-1",
    source: "tr5",
    sourceType: "architecture",
    task: "RBAC permission matrix for creator, studio, and admin roles",
    priority: "P1",
    assignee: "t2",
    estimatedHours: 10,
    status: "TODO"
  },
  {
    id: "rbac-2",
    source: "tr5",
    sourceType: "architecture",
    task: "Role-aware guardrails for payout dashboard actions",
    priority: "P1",
    assignee: "t3",
    estimatedHours: 8,
    status: "TODO"
  },
  {
    id: "rbac-3",
    source: "tr5",
    sourceType: "architecture",
    task: "Permission checks for premium marketplace placement controls",
    priority: "P1",
    assignee: "t2",
    estimatedHours: 7,
    status: "TODO"
  },
  {
    id: "rbac-4",
    source: "tr5",
    sourceType: "architecture",
    task: "Admin override logs for featured placement changes",
    priority: "P2",
    assignee: "t3",
    estimatedHours: 5,
    status: "TODO"
  },
  {
    id: "rbac-5",
    source: "tr5",
    sourceType: "architecture",
    task: "Studio-tier access gating in creator onboarding",
    priority: "P1",
    assignee: "t2",
    estimatedHours: 6,
    status: "TODO"
  },
  {
    id: "rbac-6",
    source: "tr5",
    sourceType: "architecture",
    task: "Audit events for creator role changes",
    priority: "P2",
    assignee: "t6",
    estimatedHours: 5,
    status: "TODO"
  },
  {
    id: "rbac-7",
    source: "tr5",
    sourceType: "architecture",
    task: "Policy engine for internal moderation permissions",
    priority: "P1",
    assignee: "t6",
    estimatedHours: 8,
    status: "TODO"
  },
  {
    id: "rbac-8",
    source: "tr5",
    sourceType: "architecture",
    task: "RBAC-aware API middleware for creator services",
    priority: "P0",
    assignee: "t6",
    estimatedHours: 12,
    status: "TODO"
  },
  {
    id: "rbac-9",
    source: "tr5",
    sourceType: "architecture",
    task: "Permission regression test pack for publish and payout flows",
    priority: "P2",
    assignee: "t5",
    estimatedHours: 6,
    status: "TODO"
  }
];

export const commsThreads: CommsThreadRecord[] = [
  {
    id: "cm1",
    projectId: "p1",
    platform: "slack",
    platformColor: "violet",
    channel: "#tempestai-project",
    preview: "Jack: can we get the subscription model in V1? the 80/20 split is a deal maker for creators",
    timestamp: "Today 14:22",
    unread: true,
    actionable: true,
    extractedAction: "Add $29/month Pro subscription with 80/20 revenue split — +2 week impact",
    socratesAnalysis: {
      affectedFlows: 3,
      milestonesShift: 2,
      tasksOutdated: 7,
      newTasksNeeded: 9,
      timeline: "+2 weeks",
      budget: "+$4,200",
      breaksMvp: "yes",
      draftReply:
        "Jack — we can pull the Pro subscription into V1, but it changes payout logic, creator tiers, and discovery placement. Current estimate is +2 weeks and +$4,200. If you want the original date preserved, we should move premium placement to V2."
    },
    participants: ["Jack", "Sarah Chen", "Mike Torres"],
    summaryBullets: [
      "Jack proposed a Pro subscription to make monetisation more compelling for creators.",
      "Sarah acknowledged the request and committed to a timeline impact review.",
      "This request maps directly to Revenue & Payouts plus discovery placement logic."
    ],
    messages: [
      { sender: "Jack", time: "14:18", text: "Hey team — had a thought about monetisation", platform: "slack" },
      {
        sender: "Jack",
        time: "14:19",
        text: "What if we add a Pro tier for $29/month? creators on Pro get 80/20 instead of 70/30 and priority placement",
        platform: "slack"
      },
      {
        sender: "Sarah Chen",
        time: "14:21",
        text: "That's a solid idea — let me scope it and get back to you on timeline impact",
        platform: "slack"
      },
      {
        sender: "Jack",
        time: "14:22",
        text: "can we get the subscription model in V1? the 80/20 split is a deal maker for creators",
        platform: "slack"
      }
    ]
  },
  {
    id: "cm2",
    projectId: "p1",
    platform: "whatsapp",
    platformColor: "emerald",
    channel: "Jack (WhatsApp)",
    preview: "Jack: also forgot to mention — need the discovery feed to support tags not just categories",
    timestamp: "Yesterday 09:44",
    unread: true,
    actionable: true,
    extractedAction: "Discovery feed: tag-based filtering alongside category browsing — V1 scope",
    participants: ["Jack", "Sarah Chen"],
    summaryBullets: [
      "Jack clarified that player discovery is tag-driven, not category-driven.",
      "The request changes search and filter assumptions already in execution planning.",
      "This should be treated as V1 scope, not a later UX enhancement."
    ],
    messages: [
      { sender: "Jack", time: "09:40", text: "Morning! Quick one", platform: "whatsapp" },
      {
        sender: "Jack",
        time: "09:41",
        text: "also forgot to mention — need the discovery feed to support tags not just categories",
        platform: "whatsapp"
      },
      {
        sender: "Jack",
        time: "09:44",
        text: "it's how our players currently find content so it's kind of important 😅",
        platform: "whatsapp"
      }
    ]
  },
  {
    id: "cm3",
    projectId: "p1",
    platform: "email",
    platformColor: "blue",
    channel: "jack@tempestai.com",
    preview: "Re: Prototype Review — looks great! One thing on the creator dashboard...",
    timestamp: "2 Apr 2026",
    unread: false,
    actionable: true,
    extractedAction: "Creator dashboard: add weekly earnings comparison to previous week",
    participants: ["Jack", "Sarah Chen"],
    summaryBullets: [
      "Jack approved the general prototype direction.",
      "He specifically wants week-on-week earnings comparison in the creator dashboard.",
      "This request strengthens the case for revenue analytics visibility in V1."
    ],
    messages: [
      {
        sender: "Jack",
        time: "11:02",
        text: "Hey Sarah — prototype looks great, loving the direction",
        platform: "email"
      },
      {
        sender: "Jack",
        time: "11:03",
        text: "One thing on the creator dashboard — can we add a week-on-week earnings comparison? Creators will obsess over that number",
        platform: "email"
      }
    ]
  },
  {
    id: "cm4",
    projectId: "p1",
    platform: "discord",
    platformColor: "blue",
    channel: "#product-feedback",
    preview: "Jack: beta creators are asking about bulk upload for assets",
    timestamp: "1 Apr 2026",
    unread: false,
    actionable: false,
    extractedAction: "Bulk asset upload — defer to V2",
    participants: ["Jack", "Mike Torres"],
    summaryBullets: [
      "Creators are already asking for faster publishing workflows.",
      "Bulk asset upload is useful but not a V1 requirement.",
      "The team agreed it should sit in the V2 backlog."
    ],
    messages: [
      {
        sender: "Jack",
        time: "16:30",
        text: "FYI — beta creators are asking about bulk upload for assets",
        platform: "discord"
      },
      {
        sender: "Mike Torres",
        time: "16:45",
        text: "Makes sense — we can scope it for V2",
        platform: "discord"
      }
    ]
  },
  {
    id: "cm5",
    projectId: "p2",
    platform: "email",
    platformColor: "blue",
    channel: "product@elaragames.com",
    preview: "Elara: can we split the dashboard into studio overview and title deep dives?",
    timestamp: "Today 10:04",
    unread: true,
    actionable: true,
    extractedAction: "Split studio dashboard IA into overview and per-title analytics paths",
    participants: ["Sarah Chen", "Elara Games"],
    summaryBullets: [
      "Client wants a clearer separation between executive overview and title analytics.",
      "This affects dashboard navigation but not the core metrics layer.",
      "IA update should be scoped before frontend implementation hardens."
    ],
    messages: [
      {
        sender: "Elara Games",
        time: "10:01",
        text: "Can we split the dashboard into studio overview and title deep dives?",
        platform: "email"
      },
      {
        sender: "Sarah Chen",
        time: "10:04",
        text: "Yes — I’ll update the information architecture before we lock the prototype.",
        platform: "email"
      }
    ]
  },
  {
    id: "cm6",
    projectId: "p3",
    platform: "slack",
    platformColor: "violet",
    channel: "#novacorp-gateway",
    preview: "NovaCorp: keep the REST fallback alive for enterprise clients through cutover",
    timestamp: "Yesterday 17:22",
    unread: false,
    actionable: true,
    extractedAction: "Maintain REST fallback path during GraphQL migration window",
    participants: ["Sarah Chen", "NovaCorp", "Liam Ford"],
    summaryBullets: [
      "Enterprise clients cannot be forced onto the new gateway in one cutover.",
      "Fallback support increases migration complexity but reduces operational risk.",
      "This impacts rollout planning more than core implementation."
    ],
    messages: [
      {
        sender: "NovaCorp",
        time: "17:18",
        text: "Please keep the REST fallback alive for enterprise clients through cutover.",
        platform: "slack"
      },
      {
        sender: "Liam Ford",
        time: "17:21",
        text: "Understood — we can stage the fallback behind a traffic rule during rollout.",
        platform: "slack"
      }
    ]
  }
];

export const projectFinancials: Record<string, ProjectFinancialRecord> = {
  p1: {
    budget: 85000,
    spent: 51000,
    remaining: 34000,
    projected: 82400,
    margin: 28.5,
    invoiced: 42500,
    outstanding: 8500,
    weeklyBurn: [7200, 8100, 9400, 8800, 9600, 7900],
    budgetAllocation: [
      { category: "Engineering", allocated: 55000, spent: 35200 },
      { category: "Design", allocated: 12000, spent: 8400 },
      { category: "QA", allocated: 8000, spent: 4200 },
      { category: "PM", allocated: 10000, spent: 3200 }
    ],
    milestones: [
      { name: "Discovery & Scoping", value: 12000, paid: true },
      { name: "Prototype Approved", value: 18000, paid: true },
      { name: "Sprint 3 Delivery", value: 12500, paid: false, due: "15 Apr" },
      { name: "Final Delivery", value: 42500, paid: false, due: "Jun 2026" }
    ]
  },
  p2: {
    budget: 60000,
    spent: 22800,
    remaining: 37200,
    projected: 57300,
    margin: 31.2,
    invoiced: 18000,
    outstanding: 4800,
    weeklyBurn: [4200, 4700, 5100, 4400, 4400],
    budgetAllocation: [
      { category: "Engineering", allocated: 34000, spent: 14800 },
      { category: "Design", allocated: 10000, spent: 4300 },
      { category: "QA", allocated: 7000, spent: 1900 },
      { category: "PM", allocated: 9000, spent: 1800 }
    ],
    milestones: [
      { name: "Discovery", value: 10000, paid: true },
      { name: "Prototype", value: 14000, paid: false, due: "22 Apr" },
      { name: "Release Candidate", value: 16000, paid: false, due: "Jun 2026" },
      { name: "Launch", value: 20000, paid: false, due: "Aug 2026" }
    ]
  },
  p3: {
    budget: 45000,
    spent: 41200,
    remaining: 3800,
    projected: 49800,
    margin: 14.4,
    invoiced: 36000,
    outstanding: 9200,
    weeklyBurn: [6800, 7200, 6900, 7600, 7100, 7600],
    budgetAllocation: [
      { category: "Engineering", allocated: 30000, spent: 28900 },
      { category: "Design", allocated: 3000, spent: 1200 },
      { category: "QA", allocated: 5000, spent: 4300 },
      { category: "PM", allocated: 7000, spent: 6800 }
    ],
    milestones: [
      { name: "Audit Complete", value: 9000, paid: true },
      { name: "Migration Plan", value: 12000, paid: true },
      { name: "Cutover Prep", value: 10000, paid: false, due: "11 Apr" },
      { name: "Final Migration", value: 14000, paid: false, due: "Apr 2026" }
    ]
  }
};

export const intelChartData = {
  p1: {
    velocity: [
      { week: "W1", points: 42 },
      { week: "W2", points: 38 },
      { week: "W3", points: 55 },
      { week: "W4", points: 61 },
      { week: "W5", points: 58 },
      { week: "W6", points: 70 }
    ],
    featureProgress: [
      { week: "W1", "Creator Onboarding": 20, "Asset Marketplace": 0, "Revenue & Payouts": 0, "Creator Analytics": 0, "Game Discovery": 10 },
      { week: "W2", "Creator Onboarding": 45, "Asset Marketplace": 15, "Revenue & Payouts": 0, "Creator Analytics": 0, "Game Discovery": 22 },
      { week: "W3", "Creator Onboarding": 65, "Asset Marketplace": 35, "Revenue & Payouts": 20, "Creator Analytics": 0, "Game Discovery": 40 },
      { week: "W4", "Creator Onboarding": 80, "Asset Marketplace": 52, "Revenue & Payouts": 38, "Creator Analytics": 20, "Game Discovery": 55 },
      { week: "W5", "Creator Onboarding": 87, "Asset Marketplace": 65, "Revenue & Payouts": 45, "Creator Analytics": 38, "Game Discovery": 61 },
      { week: "W6", "Creator Onboarding": 87, "Asset Marketplace": 72, "Revenue & Payouts": 51, "Creator Analytics": 44, "Game Discovery": 68 }
    ],
    burndown: [
      { day: "Day 0", remaining: 120, ideal: 120 },
      { day: "Day 5", remaining: 108, ideal: 100 },
      { day: "Day 10", remaining: 95, ideal: 80 },
      { day: "Day 15", remaining: 84, ideal: 60 },
      { day: "Day 20", remaining: 71, ideal: 40 },
      { day: "Day 25", remaining: 58, ideal: 20 },
      { day: "Day 30", remaining: 49, ideal: 0 }
    ]
  },
  p2: {
    velocity: [
      { week: "W1", points: 20 },
      { week: "W2", points: 28 },
      { week: "W3", points: 32 },
      { week: "W4", points: 38 },
      { week: "W5", points: 35 },
      { week: "W6", points: 40 }
    ],
    featureProgress: [
      { week: "W1", "Creator Onboarding": 0, "Asset Marketplace": 18, "Revenue & Payouts": 0, "Creator Analytics": 14, "Game Discovery": 0 },
      { week: "W2", "Creator Onboarding": 0, "Asset Marketplace": 30, "Revenue & Payouts": 0, "Creator Analytics": 24, "Game Discovery": 0 },
      { week: "W3", "Creator Onboarding": 0, "Asset Marketplace": 38, "Revenue & Payouts": 0, "Creator Analytics": 32, "Game Discovery": 0 },
      { week: "W4", "Creator Onboarding": 0, "Asset Marketplace": 46, "Revenue & Payouts": 0, "Creator Analytics": 41, "Game Discovery": 0 },
      { week: "W5", "Creator Onboarding": 0, "Asset Marketplace": 54, "Revenue & Payouts": 0, "Creator Analytics": 49, "Game Discovery": 0 },
      { week: "W6", "Creator Onboarding": 0, "Asset Marketplace": 62, "Revenue & Payouts": 0, "Creator Analytics": 58, "Game Discovery": 0 }
    ],
    burndown: [
      { day: "Day 0", remaining: 92, ideal: 92 },
      { day: "Day 5", remaining: 80, ideal: 76 },
      { day: "Day 10", remaining: 70, ideal: 61 },
      { day: "Day 15", remaining: 58, ideal: 46 },
      { day: "Day 20", remaining: 49, ideal: 31 },
      { day: "Day 25", remaining: 39, ideal: 15 },
      { day: "Day 30", remaining: 28, ideal: 0 }
    ]
  },
  p3: {
    velocity: [
      { week: "W1", points: 60 },
      { week: "W2", points: 65 },
      { week: "W3", points: 70 },
      { week: "W4", points: 72 },
      { week: "W5", points: 68 },
      { week: "W6", points: 79 }
    ],
    featureProgress: [
      { week: "W1", "Creator Onboarding": 0, "Asset Marketplace": 0, "Revenue & Payouts": 22, "Creator Analytics": 0, "Game Discovery": 0 },
      { week: "W2", "Creator Onboarding": 0, "Asset Marketplace": 0, "Revenue & Payouts": 36, "Creator Analytics": 0, "Game Discovery": 0 },
      { week: "W3", "Creator Onboarding": 0, "Asset Marketplace": 0, "Revenue & Payouts": 49, "Creator Analytics": 0, "Game Discovery": 0 },
      { week: "W4", "Creator Onboarding": 0, "Asset Marketplace": 0, "Revenue & Payouts": 61, "Creator Analytics": 0, "Game Discovery": 0 },
      { week: "W5", "Creator Onboarding": 0, "Asset Marketplace": 0, "Revenue & Payouts": 72, "Creator Analytics": 0, "Game Discovery": 0 },
      { week: "W6", "Creator Onboarding": 0, "Asset Marketplace": 0, "Revenue & Payouts": 79, "Creator Analytics": 0, "Game Discovery": 0 }
    ],
    burndown: [
      { day: "Day 0", remaining: 84, ideal: 84 },
      { day: "Day 5", remaining: 74, ideal: 70 },
      { day: "Day 10", remaining: 61, ideal: 56 },
      { day: "Day 15", remaining: 50, ideal: 42 },
      { day: "Day 20", remaining: 40, ideal: 28 },
      { day: "Day 25", remaining: 28, ideal: 14 },
      { day: "Day 30", remaining: 19, ideal: 0 }
    ]
  }
};

export function getProjectById(projectId: string) {
  return projects.find((project) => project.id === projectId) ?? projects[0];
}

export function getTeamMemberById(memberId: string) {
  return teamRoster.find((member) => member.id === memberId);
}

export function getTeamForProject(projectId: string) {
  const project = getProjectById(projectId);
  return project.team
    .map((memberId) => getTeamMemberById(memberId))
    .filter((member): member is TeamMember => Boolean(member));
}

export function getTruthDocumentsForProject(projectId: string) {
  return truthDocuments.filter((document) => document.projectId === projectId);
}

export function getTruthDocumentById(docId: string) {
  return truthDocuments.find((document) => document.id === docId) ?? null;
}

export function getTruthRequirementsForDocument(docId: string) {
  return truthRequirements.filter((requirement) => requirement.docId === docId);
}

export function getExtractedTasksForDocument(docId: string) {
  return extractedTasks.filter((task) => task.source === docId);
}

export function getCommsThreadsForProject(projectId: string) {
  return commsThreads.filter((thread) => thread.projectId === projectId);
}

export function getUnreadCommsCount(projectId: string) {
  const newProjectUnread = mockThreads.filter(
    (thread) =>
      thread.projectId === projectId &&
      thread.messages.some((message) => message.insight && !message.insight.reviewedByHuman)
  ).length;

  if (newProjectUnread > 0) return newProjectUnread;

  return commsThreads.filter((thread) => thread.projectId === projectId && thread.unread).length;
}

export function getProjectFinancials(projectId: string) {
  return projectFinancials[projectId];
}

export function getProjectIntelData(projectId: string) {
  return intelChartData[projectId as keyof typeof intelChartData];
}
