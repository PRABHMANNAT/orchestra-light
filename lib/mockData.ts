export interface TerminalLine {
  text: string;
  delay: number;
}

export interface ClarificationQuestionSpec {
  id: string;
  question: string;
  options: string[];
  answer: string;
  briefField: string;
}

export const CLARIFICATION_QUESTIONS: ClarificationQuestionSpec[] = [
  {
    id: "q1",
    question: "Who is the primary user V1 must serve most effectively?",
    options: ["Requester (submitting staff)", "Manager (approving)", "System Admin", "All roles equally"],
    answer: "Requester (submitting staff)",
    briefField: "PRIMARY USER"
  },
  {
    id: "q2",
    question: "Which single workflow must the first prototype demonstrate end-to-end?",
    options: ["Submit → Assign → Resolve", "Submit → Approve → Resolve", "Admin setup flow", "Reporting dashboard"],
    answer: "Submit → Assign → Resolve",
    briefField: "CORE JOURNEY"
  },
  {
    id: "q3",
    question: "What is the minimum required for the client to say 'yes, this is correct'?",
    options: ["Core request lifecycle only", "Requests + notifications", "Full platform with admin", "Requests + reporting"],
    answer: "Core request lifecycle only",
    briefField: "MVP PROOF POINT"
  },
  {
    id: "q4",
    question: "Which integrations are mandatory for V1 vs. deferred?",
    options: ["SSO now, email later", "Email now, SSO later", "Both integrations in V1", "Neither in V1"],
    answer: "SSO now, email later",
    briefField: "INTEGRATIONS (V1)"
  },
  {
    id: "q5",
    question: "What is fixed vs. flexible in this engagement?",
    options: ["Timeline fixed, scope flexible", "Scope fixed, timeline flexible", "Both fixed", "Both negotiable"],
    answer: "Timeline fixed, scope flexible",
    briefField: "CONSTRAINTS"
  },
  {
    id: "q6",
    question: "Who must sign off on prototype approval before build begins?",
    options: ["Manager only", "Client only", "Both Manager + Client required", "Engineering lead"],
    answer: "Both Manager + Client required",
    briefField: "SIGN-OFF"
  }
];

export const CLARIFIED_BRIEF = {
  primaryUser: "Requester (submitting staff)",
  coreJourney: "Submit → Assign → Resolve",
  mvpProofPoint: "Core request lifecycle works end-to-end",
  integrationsV1: "SSO / Active Directory",
  integrationsLater: "Email SMTP · Webhooks · CSV Export",
  constraints: "Timeline fixed · 8-week delivery",
  signOff: "Manager + Client both required",
  inScope: [
    "Service request submission",
    "Assignment workflow",
    "Status tracking",
    "Basic reporting",
    "Role-based access (SSO)"
  ],
  outOfScope: [
    "Manager approval gate",
    "Advanced analytics",
    "Audit logging",
    "Admin panel",
    "Billing integration",
    "Role management",
    "Mobile app"
  ],
  openDecisions: ["Notification trigger rules", "SLA policy thresholds", "Approval hierarchy depth"],
  risks: ["SSO integration complexity", "Approval logic depth", "Report performance at scale"]
};

export interface DagNode {
  id: string;
  label: string;
  type: "capability" | "screen" | "integration" | "data" | "rule" | "decision" | "flow";
  priority: "P0" | "P1" | "P2";
  inMVP: boolean;
  position: { x: number; y: number };
}

export const DAG_NODES: DagNode[] = [
  { id: "N1", label: "User Authentication", type: "capability", priority: "P0", inMVP: true, position: { x: 80, y: 200 } },
  { id: "N2", label: "Account Creation", type: "screen", priority: "P0", inMVP: true, position: { x: 280, y: 90 } },
  { id: "N3", label: "Login Screen", type: "screen", priority: "P0", inMVP: true, position: { x: 280, y: 290 } },
  { id: "N4", label: "SSO Integration", type: "integration", priority: "P0", inMVP: true, position: { x: 80, y: 50 } },
  { id: "N5", label: "Submit Request Form", type: "screen", priority: "P0", inMVP: true, position: { x: 500, y: 200 } },
  { id: "N6", label: "Request Entity (DB)", type: "data", priority: "P0", inMVP: true, position: { x: 500, y: 380 } },
  { id: "N7", label: "Assignment Engine", type: "flow", priority: "P0", inMVP: true, position: { x: 720, y: 130 } },
  { id: "N8", label: "Staff Role Rule", type: "rule", priority: "P0", inMVP: true, position: { x: 720, y: 300 } },
  { id: "N9", label: "Status Tracking View", type: "screen", priority: "P0", inMVP: true, position: { x: 940, y: 200 } },
  { id: "N10", label: "Basic Reporting", type: "screen", priority: "P0", inMVP: true, position: { x: 1160, y: 200 } },
  { id: "N11", label: "Email Notifications", type: "integration", priority: "P1", inMVP: false, position: { x: 720, y: 460 } },
  { id: "N12", label: "Manager Approval Gate", type: "decision", priority: "P1", inMVP: false, position: { x: 940, y: 380 } },
  { id: "N13", label: "Notification Prefs", type: "screen", priority: "P1", inMVP: false, position: { x: 940, y: 520 } },
  { id: "N14", label: "Advanced Analytics", type: "screen", priority: "P2", inMVP: false, position: { x: 1160, y: 380 } },
  { id: "N15", label: "Audit Logging", type: "capability", priority: "P2", inMVP: false, position: { x: 1160, y: 500 } },
  { id: "N16", label: "Admin Panel", type: "screen", priority: "P2", inMVP: false, position: { x: 1380, y: 200 } },
  { id: "N17", label: "Billing Integration", type: "integration", priority: "P2", inMVP: false, position: { x: 1380, y: 380 } },
  { id: "N18", label: "Role Management", type: "screen", priority: "P2", inMVP: false, position: { x: 1380, y: 500 } }
];

export interface DagEdge {
  id: string;
  source: string;
  target: string;
  label: string;
  critical: boolean;
}

export const DAG_EDGES: DagEdge[] = [
  { id: "e1", source: "N4", target: "N1", label: "requires", critical: true },
  { id: "e2", source: "N1", target: "N2", label: "unlocks", critical: true },
  { id: "e3", source: "N1", target: "N3", label: "unlocks", critical: true },
  { id: "e4", source: "N3", target: "N5", label: "requires", critical: true },
  { id: "e5", source: "N5", target: "N6", label: "writes to", critical: true },
  { id: "e6", source: "N5", target: "N7", label: "unlocks", critical: true },
  { id: "e7", source: "N8", target: "N7", label: "required for", critical: false },
  { id: "e8", source: "N7", target: "N9", label: "unlocks", critical: true },
  { id: "e9", source: "N6", target: "N9", label: "reads from", critical: true },
  { id: "e10", source: "N9", target: "N10", label: "feeds", critical: true },
  { id: "e11", source: "N7", target: "N11", label: "triggers", critical: false },
  { id: "e12", source: "N9", target: "N12", label: "enables", critical: false },
  { id: "e13", source: "N11", target: "N13", label: "requires", critical: false },
  { id: "e14", source: "N10", target: "N14", label: "extends to", critical: false },
  { id: "e15", source: "N9", target: "N15", label: "enables", critical: false },
  { id: "e16", source: "N8", target: "N16", label: "requires", critical: false },
  { id: "e17", source: "N6", target: "N17", label: "enables", critical: false },
  { id: "e18", source: "N8", target: "N18", label: "extends to", critical: false },
  { id: "e19", source: "N2", target: "N5", label: "unlocks", critical: false },
  { id: "e20", source: "N10", target: "N16", label: "extends to", critical: false },
  { id: "e21", source: "N12", target: "N9", label: "gates", critical: false }
];

export interface ExecutionTask {
  id: string;
  title: string;
  dag: string[];
  priority: "P0" | "P1" | "P2";
  deps: string[];
  ac: string;
}

export interface ExecutionEpic {
  id: string;
  name: string;
  priority: "P0" | "P1" | "P2";
  taskCount: number;
  tasks: ExecutionTask[];
}

export const EXECUTION_PLAN: ExecutionEpic[] = [
  {
    id: "E1",
    name: "Authentication & Access",
    priority: "P0",
    taskCount: 6,
    tasks: [
      {
        id: "T1.1",
        title: "Implement SSO integration (Active Directory)",
        dag: ["N4", "N1"],
        priority: "P0",
        deps: [],
        ac: "SSO login completes with valid token · RBAC roles assigned on first login"
      },
      {
        id: "T1.2",
        title: "Build login screen + all error states",
        dag: ["N3"],
        priority: "P0",
        deps: ["T1.1"],
        ac: "All error states render correctly · Redirect to dashboard on success"
      },
      {
        id: "T1.3",
        title: "Account creation flow",
        dag: ["N2"],
        priority: "P0",
        deps: ["T1.1"],
        ac: "New user can create account · Role assigned on creation"
      },
      {
        id: "T1.4",
        title: "Session management + token refresh",
        dag: ["N1"],
        priority: "P0",
        deps: ["T1.1", "T1.2"],
        ac: "Session persists across page reload · Token refreshes before expiry"
      },
      {
        id: "T1.5",
        title: "Role assignment on first login",
        dag: ["N8"],
        priority: "P0",
        deps: ["T1.1"],
        ac: "Role correctly assigned from SSO claims · Default fallback role applied"
      },
      {
        id: "T1.6",
        title: "Authentication integration tests",
        dag: ["N1"],
        priority: "P0",
        deps: ["T1.1", "T1.2", "T1.3", "T1.4", "T1.5"],
        ac: "All auth flows pass end-to-end test suite"
      }
    ]
  },
  {
    id: "E2",
    name: "Request Lifecycle",
    priority: "P0",
    taskCount: 10,
    tasks: [
      {
        id: "T2.1",
        title: "Request submission form (all field types, validation)",
        dag: ["N5"],
        priority: "P0",
        deps: ["T1.1"],
        ac: "All field types render · Validation prevents invalid submission"
      },
      {
        id: "T2.2",
        title: "Request entity schema + DB migrations",
        dag: ["N6"],
        priority: "P0",
        deps: [],
        ac: "Schema matches all field types · Migration runs cleanly"
      },
      {
        id: "T2.3",
        title: "Assignment engine (manual selection + auto-suggest)",
        dag: ["N7"],
        priority: "P0",
        deps: ["T2.1", "T2.2", "T1.5"],
        ac: "Manual assignment works · Auto-suggest shows top 3 matches"
      },
      {
        id: "T2.4",
        title: "Status state machine (submitted→assigned→in-progress→resolved)",
        dag: ["N9"],
        priority: "P0",
        deps: ["T2.3"],
        ac: "All state transitions work · Invalid transitions blocked"
      },
      {
        id: "T2.5",
        title: "Request detail view (read + update)",
        dag: ["N9"],
        priority: "P0",
        deps: ["T2.4"],
        ac: "All fields visible · Status update persists correctly"
      },
      {
        id: "T2.6",
        title: "Staff assignment dashboard",
        dag: ["N7"],
        priority: "P0",
        deps: ["T2.3"],
        ac: "Assigned requests visible · Staff can update status"
      },
      {
        id: "T2.7",
        title: "Requester tracking view (read-only status)",
        dag: ["N9"],
        priority: "P0",
        deps: ["T2.4"],
        ac: "Requester can see live status · Cannot modify assignment"
      },
      {
        id: "T2.8",
        title: "Priority classification + SLA countdown",
        dag: ["N9"],
        priority: "P0",
        deps: ["T2.1"],
        ac: "Priority correctly sets SLA · Countdown renders accurately"
      },
      {
        id: "T2.9",
        title: "Basic email notification trigger (deferred — placeholder only)",
        dag: ["N11"],
        priority: "P1",
        deps: ["T2.4"],
        ac: "Trigger fires on status change · Email content templated"
      },
      {
        id: "T2.10",
        title: "Request lifecycle integration tests",
        dag: ["N5", "N6", "N7", "N9"],
        priority: "P0",
        deps: ["T2.1", "T2.2", "T2.3", "T2.4", "T2.5"],
        ac: "Full lifecycle passes end-to-end · Edge cases covered"
      }
    ]
  },
  {
    id: "E3",
    name: "Reporting",
    priority: "P0",
    taskCount: 8,
    tasks: [
      {
        id: "T3.1",
        title: "Report data aggregation service",
        dag: ["N10"],
        priority: "P0",
        deps: ["T2.4"],
        ac: "Aggregates by period, category, status · Sub-200ms query time"
      },
      {
        id: "T3.2",
        title: "Volume by period chart (bar)",
        dag: ["N10"],
        priority: "P0",
        deps: ["T3.1"],
        ac: "7-day and 30-day views render · Data matches aggregation"
      },
      {
        id: "T3.3",
        title: "Resolution rate calculation",
        dag: ["N10"],
        priority: "P0",
        deps: ["T3.1"],
        ac: "Percentage accurate to 1 decimal · Updates in real time"
      },
      {
        id: "T3.4",
        title: "Average handle time metric",
        dag: ["N10"],
        priority: "P0",
        deps: ["T3.1"],
        ac: "Calculated from status transition timestamps · Displays in hours"
      },
      {
        id: "T3.5",
        title: "SLA compliance rate",
        dag: ["N10"],
        priority: "P0",
        deps: ["T3.1", "T2.8"],
        ac: "Percentage of requests resolved within SLA · Breakdowns by category"
      },
      {
        id: "T3.6",
        title: "Category breakdown table",
        dag: ["N10"],
        priority: "P0",
        deps: ["T3.1"],
        ac: "All 4 categories shown · Sortable by column"
      },
      {
        id: "T3.7",
        title: "Date range filter",
        dag: ["N10"],
        priority: "P0",
        deps: ["T3.2"],
        ac: "Today, 7D, 30D, and custom range work · All charts update on change"
      },
      {
        id: "T3.8",
        title: "Export to CSV",
        dag: ["N10"],
        priority: "P1",
        deps: ["T3.1"],
        ac: "CSV downloads correctly · Matches visible data"
      }
    ]
  }
];

export const FEATURE_PROGRESS = [
  { label: "Authentication & SSO", value: 87, variant: "green", status: "on-track" },
  { label: "Request Submission Form", value: 75, variant: "cyan", status: "on-track" },
  { label: "Assignment Engine", value: 38, variant: "amber", status: "blocked" },
  { label: "Status Tracking", value: 100, variant: "green", status: "done" },
  { label: "Basic Reporting", value: 52, variant: "cyan", status: "on-track" },
  { label: "Email Notifications", value: 0, variant: "muted", status: "deferred" },
  { label: "Manager Approval Gate", value: 22, variant: "amber", status: "at-risk" },
  { label: "Admin Panel", value: 0, variant: "muted", status: "deferred" },
  { label: "Billing Integration", value: 0, variant: "muted", status: "deferred" },
  { label: "Role Management", value: 33, variant: "amber", status: "at-risk" }
] as const;

export const BLOCKERS = [
  {
    title: "Assignment Engine",
    severity: "blocked",
    desc: "Awaiting client sign-off on permissions hierarchy. T2.3, T2.5, T2.6 stalled.",
    dag: "N7, N8",
    blocking: "N9, N10",
    stalledDays: 2
  },
  {
    title: "Role Management",
    severity: "blocked",
    desc: "RBAC schema requires architecture review from CTO before implementation.",
    dag: "N8",
    blocking: "N16, N18",
    stalledDays: 1
  },
  {
    title: "Manager Approval Gate",
    severity: "at-risk",
    desc: "New requirement from SRS v3. Approval hierarchy depth still unresolved open decision.",
    dag: "N12 (new)",
    blocking: "N9 (indirect)",
    stalledDays: 0
  }
] as const;

export const DEV_TASKS = [
  {
    id: "T1.1",
    title: "Implement SSO integration (Active Directory)",
    epic: "E1 — Authentication & Access",
    dag: "N4, N1",
    jira: "PROJ-4",
    status: "in-progress",
    priority: "P0",
    progress: 82,
    deps: [] as string[],
    ac: "SSO login completes · RBAC roles assigned · Token issued",
    started: "11 Mar",
    estimate: "15 Mar",
    subtasksRemaining: 2
  },
  {
    id: "T2.3",
    title: "Assignment Engine",
    epic: "E2 — Request Lifecycle",
    dag: "N7",
    jira: "PROJ-18",
    status: "blocked",
    priority: "P0",
    progress: 0,
    blocker: "Awaiting client sign-off on permissions hierarchy",
    deps: ["T1.5"],
    ac: "Manual assignment works · Auto-suggest shows top 3"
  },
  {
    id: "T1.4",
    title: "Session management + token refresh",
    epic: "E1",
    dag: "N1",
    jira: "PROJ-7",
    status: "in-progress",
    priority: "P0",
    progress: 40,
    deps: ["T1.1", "T1.2"],
    ac: "Session persists across reload · Token refreshes before expiry"
  },
  {
    id: "T2.4",
    title: "Status State Machine",
    epic: "E2",
    dag: "N9",
    jira: "PROJ-19",
    status: "todo",
    priority: "P0",
    progress: 0,
    deps: ["T2.3"],
    ac: "All transitions work · Invalid transitions blocked",
    note: "Updated: includes pending-approval state from SRS change sync"
  },
  {
    id: "T2.5",
    title: "Request detail view (read + update)",
    epic: "E2",
    dag: "N9",
    jira: "PROJ-20",
    status: "todo",
    priority: "P0",
    progress: 0,
    deps: ["T2.4"]
  },
  {
    id: "T1.6",
    title: "Authentication integration tests",
    epic: "E1",
    dag: "N1",
    jira: "PROJ-9",
    status: "todo",
    priority: "P0",
    progress: 0,
    deps: ["T1.1", "T1.2", "T1.3", "T1.4", "T1.5"]
  }
] as const;

const demoValueByNode: Record<string, number> = {
  N1: 5,
  N2: 3,
  N3: 5,
  N4: 5,
  N5: 5,
  N6: 4,
  N7: 5,
  N8: 4,
  N9: 5,
  N10: 4,
  N11: 3,
  N12: 4,
  N13: 2,
  N14: 2,
  N15: 2,
  N16: 1,
  N17: 1,
  N18: 2
};

export interface ClarificationQuestion {
  q: string;
  options: string[];
  answer: string;
}

export interface DagNodeData {
  id: string;
  label: string;
  nodeType: "capability" | "screen" | "integration" | "data" | "rule" | "decision" | "flow" | "async";
  priority: "P0" | "P1" | "P2";
  inMVP: boolean;
  position: { x: number; y: number };
  demoValue: number;
}

export interface DagEdgeData {
  id: string;
  source: string;
  target: string;
  label: string;
  critical: boolean;
}

export const projectMeta = {
  version: "v0.9.1 — DEMO BUILD",
  client: "ACME Corp",
  project: "Service Request Platform",
  activeWindow: "ACTIVE — WEEK 4 OF 8",
  handoverDate: "14 MARCH 2025"
};

export const roleCardContent = [
  {
    role: "pm",
    title: "PROJECT MANAGER",
    name: "Sarah Chen",
    access: "Full platform access — all workflow stages"
  },
  {
    role: "developer",
    title: "DEVELOPER",
    name: "Mike Torres",
    access: "Assigned work · Sprint board · Task details"
  },
  {
    role: "client",
    title: "CLIENT",
    name: "James Whitfield",
    access: "Prototype review · Approvals · Progress updates"
  }
] as const;

export const intakeUploadFile = {
  name: "ServiceRequest_SRS_v2.pdf",
  size: "2.4 MB · PDF · Uploaded 09:41:22"
};

export const intakeAnalysisLines: TerminalLine[] = [
  { text: "loading document: ServiceRequest_SRS_v2.pdf ... done", delay: 100 },
  { text: "document validated: 2.4MB · 22 pages · PDF/A compliant", delay: 220 },
  { text: "chunking sections ... 12 sections identified", delay: 220 },
  { text: "extracting actors and user roles ... done", delay: 220 },
  { text: "mapping feature requirements ... 34 requirements found", delay: 220 },
  { text: "identifying constraints and integrations ... done", delay: 220 },
  { text: "flagging ambiguous requirements ... 6 flagged", delay: 220 },
  { text: "computing risk surface ... done", delay: 220 },
  { text: "classifying dependency-bearing capabilities ... done", delay: 220 },
  { text: "generating structured brief ... done", delay: 220 },
  { text: "cross-checking ambiguity clusters ... done", delay: 220 },
  { text: "analysis complete ✓", delay: 260 }
];

export const intakeCards = [
  {
    title: "PRODUCT SUMMARY",
    icon: "Layers",
    tone: "cyan",
    content:
      "A web platform for managing service requests, approvals, status tracking, and multi-level reporting for enterprise operations teams."
  },
  {
    title: "USER ROLES",
    icon: "Users",
    tone: "default",
    items: ["Requester", "Staff Assignee", "Manager", "System Admin"]
  },
  {
    title: "CORE FEATURES",
    icon: "ListTodo",
    tone: "default",
    items: [
      "Service request submission",
      "Assignment workflow",
      "Status tracking",
      "Manager approval gates",
      "Notifications",
      "Reporting dashboard",
      "Admin controls",
      "Audit logging",
      "SLA tracking"
    ]
  },
  {
    title: "CONSTRAINTS",
    icon: "Settings",
    tone: "default",
    content:
      "Must integrate with existing SSO. Mobile-responsive required. Sub-2s load time. WCAG 2.1 AA compliance."
  },
  {
    title: "INTEGRATIONS",
    icon: "Plug",
    tone: "default",
    items: ["SSO / Active Directory", "Email (SMTP)", "Webhook support", "Export to CSV/PDF"]
  },
  {
    title: "UNCLEAR AREAS",
    icon: "AlertTriangle",
    tone: "red",
    content:
      "6 ambiguous requirements flagged — approval hierarchy depth, notification triggers, report scheduling frequency, mobile scope, SLA policy, data retention rules"
  },
  {
    title: "LIKELY RISKS",
    icon: "ShieldAlert",
    tone: "amber",
    content: "SSO integration complexity · Approval logic depth · Report performance at scale"
  }
];

export const clarificationQuestions: ClarificationQuestion[] = CLARIFICATION_QUESTIONS.map((item) => ({
  q: item.question,
  options: item.options,
  answer: item.answer
}));

export const clarifiedBriefRows = [
  { label: "PRIMARY USER", value: CLARIFIED_BRIEF.primaryUser },
  { label: "CORE JOURNEY", value: CLARIFIED_BRIEF.coreJourney },
  { label: "MVP PROOF POINT", value: CLARIFIED_BRIEF.mvpProofPoint },
  { label: "INTEGRATIONS (V1)", value: CLARIFIED_BRIEF.integrationsV1 },
  { label: "INTEGRATIONS (LATER)", value: CLARIFIED_BRIEF.integrationsLater },
  { label: "CONSTRAINTS", value: CLARIFIED_BRIEF.constraints },
  { label: "SIGN-OFF REQUIRED", value: CLARIFIED_BRIEF.signOff }
];

export const dagNodes: DagNodeData[] = DAG_NODES.map((node) => ({
  id: node.id,
  label: node.label,
  nodeType: node.type,
  priority: node.priority,
  inMVP: node.inMVP,
  position: node.position,
  demoValue: demoValueByNode[node.id] ?? 3
}));

export const dagEdges: DagEdgeData[] = DAG_EDGES.map((edge) => ({ ...edge }));

export const prototypeScreens = [
  { id: "screen-1", label: "LOGIN", shortLabel: "01", url: "app.orchestra.io/login" },
  { id: "screen-2", label: "DASHBOARD", shortLabel: "02", url: "app.orchestra.io/dashboard" },
  { id: "screen-3", label: "SUBMIT", shortLabel: "03", url: "app.orchestra.io/requests/new" },
  { id: "screen-4", label: "DETAIL", shortLabel: "04", url: "app.orchestra.io/requests/REQ-0241" },
  { id: "screen-5", label: "REPORTS", shortLabel: "05", url: "app.orchestra.io/reports" }
];

export const prototypeNodeChips = [
  "N1 Auth",
  "N2 Account",
  "N3 Login",
  "N5 Submit",
  "N6 Request",
  "N7 Assign",
  "N8 Role",
  "N9 Status",
  "N10 Reports"
];

export const prototypeScope = {
  included: [
    "Login + SSO auth",
    "Request submission",
    "Assignment workflow",
    "Status tracking",
    "Basic reporting"
  ],
  mocked: [
    "Email notifications (simulated)",
    "Data persistence (local state)",
    "SSO handshake (bypassed for demo)",
    "Role permissions (simplified)"
  ],
  deferred: [
    "Manager approval gate",
    "Advanced analytics",
    "Audit logging",
    "Admin panel",
    "Billing integration",
    "Role management"
  ]
};

export const dashboardStats = [
  { label: "OPEN", value: "24", tone: "white" },
  { label: "ASSIGNED", value: "8", tone: "amber" },
  { label: "OVERDUE", value: "3", tone: "red" },
  { label: "RESOLVED", value: "142", tone: "green" }
];

export const requestTableRows = [
  { id: "REQ-0241", title: "Network access required for new hire", status: "in-progress", assignee: "Mike Torres", updated: "2h ago" },
  { id: "REQ-0240", title: "Laptop replacement request", status: "p1", assignee: "—", updated: "4h ago" },
  { id: "REQ-0238", title: "VPN access for remote contractor", status: "done", assignee: "A. Kim", updated: "1d ago" }
];

export const detailTimeline = [
  { title: "SUBMITTED", detail: "Sarah Chen · 2h ago", meta: "Requester", tone: "done" },
  { title: "ASSIGNED", detail: "Mike Torres · 1h ago", meta: "Staff Assignee", tone: "in-progress" },
  { title: "IN PROGRESS", detail: "Mike Torres · 45min ago", meta: "Active now", tone: "p1" },
  { title: "RESOLVED", detail: "Pending", meta: "", tone: "deferred" }
];

export const reportsBars = [42, 58, 66, 51, 74, 61, 69];

export const reportsCategories = [
  { category: "IT Support", count: "42%", resolved: "96%", time: "2.1h" },
  { category: "Facilities", count: "28%", resolved: "91%", time: "3.0h" },
  { category: "HR", count: "18%", resolved: "97%", time: "1.9h" },
  { category: "Finance", count: "12%", resolved: "89%", time: "4.2h" }
];

export const approvalApprovers = [
  {
    avatar: "SC",
    name: "Sarah Chen",
    role: "Project Manager",
    status: "APPROVED ✓",
    tone: "done",
    timestamp: "Today · 11:30"
  },
  {
    avatar: "JW",
    name: "James Whitfield",
    role: "Director of Ops · ACME Corp",
    status: "AWAITING REVIEW",
    tone: "p1",
    timestamp: "Pending"
  }
];

export const scopeSummary = {
  inScope: [
    "Employee login using your existing company SSO",
    "Service request submission form",
    "Automatic assignment to the right staff member",
    "Real-time status tracking for requesters",
    "Management reporting dashboard"
  ],
  outOfScope: [
    "Manager approval step",
    "Advanced analytics",
    "Billing flows",
    "Full admin panel",
    "Audit logging",
    "Notification preferences"
  ],
  delivery: "8 weeks · Fixed timeline",
  signoff: "MANAGER ✓ · Client ⏳"
};

export const executionEpics = EXECUTION_PLAN.map((epic) => ({
  id: epic.id,
  title: epic.name,
  priority: epic.priority.toLowerCase(),
  countLabel: `${epic.taskCount} TASKS`,
  tasks: epic.tasks.map((task) => ({
    id: task.id,
    title: task.title,
    dag: task.dag,
    priority: task.priority.toLowerCase(),
    dependencies: task.deps.length ? task.deps : ["none"],
    acceptance: task.ac.split(" · ")
  }))
}));

export const boardSyncChecklist = [
  "3 epics with descriptions",
  "24 tasks with acceptance criteria",
  "67 subtasks",
  "18 dependency links preserved",
  "Product flowchart node IDs embedded in task descriptions",
  "Link to approved scope v1.0 in each epic"
];

export const boardSyncLines: TerminalLine[] = [
  { text: "authenticating with Jira API ... done", delay: 100 },
  { text: "creating project: ACME-SRP ... PROJ-0 created", delay: 180 },
  { text: "pushing epic: Authentication & Access ... PROJ-1 ✓", delay: 180 },
  { text: "pushing epic: Request Lifecycle ... PROJ-2 ✓", delay: 180 },
  { text: "pushing epic: Reporting ... PROJ-3 ✓", delay: 180 },
  { text: "writing 24 tasks with acceptance criteria ... done", delay: 180 },
  { text: "generating 67 subtasks ... done", delay: 180 },
  { text: "mapping 18 dependency links ... done", delay: 180 },
  { text: "embedding product flowchart node references (N1-N10) ... done", delay: 180 },
  { text: "attaching approved scope reference: v1.0-2024-03-14 ... done", delay: 180 },
  { text: "verifying sync integrity ... 94 items confirmed", delay: 180 },
  { text: "SYNC COMPLETE ✓ — 94 items written to Jira", delay: 220 }
];

export const changeSyncLines: TerminalLine[] = [
  { text: "loading revised document: ServiceRequest_SRS_v3.pdf", delay: 100 },
  { text: "comparing against locked scope: v1.0-approved", delay: 180 },
  { text: "diff analysis running ...", delay: 180 },
  { text: "ADDED: Manager approval gate before assignment (R35)", delay: 180 },
  { text: "ADDED: Approval notification to requester (R36)", delay: 180 },
  { text: "MODIFIED: Assignment flow now requires approval state (R7)", delay: 180 },
  { text: "NO CHANGES: Authentication · Submission · Reporting (R1–R20)", delay: 180 },
  { text: "computing product flowchart impact ...", delay: 180 },
  { text: "AFFECTED NODES: N7, N9, N10", delay: 180 },
  { text: "NEW NODES REQUIRED: N12 (Manager Approval Gate) · N19 (Approval Notification)", delay: 180 },
  { text: "AFFECTED TASKS: T2.3 · T2.4 · T2.8 · T3.1", delay: 180 },
  { text: "CHANGE IMPACT SUMMARY READY ✓", delay: 220 }
];

export const changeApplyLines: TerminalLine[] = [
  { text: "updating product flowchart: adding N12, N19 ... done", delay: 100 },
  { text: "updating edges: N7→N12→N9 ... done", delay: 180 },
  { text: "revising T2.3, T2.4, T2.8 ... done", delay: 180 },
  { text: "creating T2.11, T2.12 ... done", delay: 180 },
  { text: "pushing updates to Jira: 6 items modified, 2 items created ... done", delay: 180 },
  { text: "updating Brief to v1.1 ... done", delay: 180 },
  { text: "PLAN ALIGNED WITH SRS v3 ✓", delay: 220 }
];

export const changePanels = {
  dag: [
    "NEW NODE: N12 Manager Approval Gate",
    "Inserted between N7 (Assign) and N9 (Status)",
    "NEW NODE: N19 Approval Notification",
    "Triggered by N12",
    "MODIFIED EDGE: N7 → N9 now routes through N12 first"
  ],
  tasks: [
    "T2.3 Assignment Engine — needs revision",
    "T2.4 Status State Machine — needs revision",
    "T2.8 Notification triggers — needs revision",
    "NEW TASK: T2.11 Manager Approval UI",
    "NEW TASK: T2.12 Approval notification service"
  ],
  delivery: [
    "Estimated additional effort: +4–6 days",
    "Tasks affected: 4 existing + 2 new",
    "Prototype affected: Screen 4 requires approval step",
    "Board: 6 Jira items need updating"
  ]
};

export const towerMetrics = {
  health: "74",
  onTrack: "18",
  blocked: "3",
  atRisk: "5",
  scopeComplete: 62
};

export const featureProgress = FEATURE_PROGRESS.map((item) => ({
  label: item.label,
  value: item.value,
  variant: item.variant,
  deferred: item.status === "deferred"
}));

export const blockerCards = BLOCKERS.map((item) => ({
  title:
    item.severity === "blocked"
      ? `${item.title.toUpperCase()} — BLOCKED`
      : `${item.title.toUpperCase()} — AT RISK`,
  description: item.desc,
  meta: `FLOWCHART: ${item.dag} · BLOCKING: ${item.blocking}${item.stalledDays > 0 ? ` · STALLED: ${item.stalledDays} DAY${item.stalledDays === 1 ? "" : "S"}` : ""}`,
  tone: item.severity === "blocked" ? "blocked" : "p1"
}));

export const dependencyRiskMatrix = [
  "green",
  "green",
  "green",
  "green",
  "green",
  "green",
  "red",
  "red",
  "green",
  "green",
  "muted",
  "amber",
  "muted",
  "muted",
  "muted",
  "muted",
  "muted",
  "amber"
] as const;

export const stakeholderTabs = {
  pm: {
    heading: "WEEK 4 STATUS REPORT",
    subheading: "SERVICE REQUEST PLATFORM · ACME CORP · 14 MAR 2025",
    sections: [
      {
        title: "WHAT GOT DONE THIS WEEK",
        content:
          "Authentication and SSO integration reached 87% — login, session management, and role assignment are all working. Status tracking hit 100% completion and is fully tested. Basic reporting is at 52% with all core metrics rendering correctly."
      },
      {
        title: "WHAT IS BLOCKED",
        content:
          "Assignment engine is stalled pending client sign-off on permissions hierarchy. Three tasks (T2.3, T2.5, T2.6) are waiting. This is on the critical path and creates risk for Week 5 delivery targets. Role management is also blocked pending CTO architecture review."
      },
      {
        title: "WHAT CHANGED",
        content:
          "Client delivered a scope change — manager approval gate is now required before assignment. Change sync ran automatically. Two new tasks created (T2.11, T2.12), four existing tasks flagged for revision. Estimated additional effort: 4–6 days."
      },
      {
        title: "DECISIONS NEEDED",
        content:
          "1. Client to confirm permissions hierarchy model by EOW — unblocks assignment engine. 2. CTO to complete RBAC architecture review — unblocks role management. 3. Approval gate scope: synchronous vs async — required for T2.11 spec."
      },
      {
        title: "PROJECT HEALTH",
        content:
          "ON TRACK with caveats. Delivery health score: 74/100. Two open blockers are critical path items but resolvable within current timeline if decisions arrive by end of week."
      }
    ]
  },
  cto: {
    heading: "CTO TECHNICAL BRIEF",
    subheading: "SERVICE REQUEST PLATFORM · WEEK 4",
    sections: [
      {
        title: "DEPENDENCY RISK",
        content:
          "N7 and N8 remain the critical dependency pinch points. The new N12 approval gate introduces an additional branch in the request lifecycle and directly affects delivery sequencing."
      },
      {
        title: "BUILD VELOCITY",
        content:
          "Authentication is nearly complete. Request lifecycle work is progressing but exposed to permissions ambiguity. Reporting is moving steadily with the aggregation layer already underway."
      }
    ]
  },
  exec: {
    heading: "EXECUTIVE SUMMARY",
    subheading: "PLAIN-ENGLISH STATUS FOR LEADERSHIP",
    sections: [
      {
        title: "STATUS",
        content:
          "The project is progressing on schedule overall. Core user login and request tracking are in strong shape. One client decision on manager permissions is holding back a small but important part of the build."
      },
      {
        title: "RISK",
        content:
          "If the permissions decision lands this week, the current delivery date holds. If it slips, the assignment workflow could push into the final week."
      }
    ]
  },
  client: {
    heading: "FOR: James Whitfield · Director of Operations, ACME Corp",
    subheading: "PROJECT: Service Request Platform · Week 4 Update",
    sections: [
      {
        title: "PROGRESS OVERVIEW",
        content:
          "62% complete and still on track. Login and user access are working. Request tracking is complete. Assignment is nearly ready and reporting is in progress."
      },
      {
        title: "YOUR PLATFORM THIS WEEK",
        content:
          "Login and user access now work against your existing Active Directory. Requesters can see live updates at every step. Reporting dashboards are functional with the core metrics already visible."
      },
      {
        title: "ONE ACTION NEEDED FROM YOUR SIDE",
        content:
          "To keep on schedule, we need you to confirm how manager permissions work in your organisation. Specifically: can any manager approve any request, or are approvals department-specific?"
      },
      {
        title: "NEXT MILESTONE",
        content:
          "End of Week 5 — Assignment system fully operational plus reporting complete."
      }
    ]
  }
};

export const clientComments = [
  {
    screen: "Screen 2 (Dashboard)",
    body:
      "Can the stat cards use our brand blue instead of the cyan? Also need 'My Requests' to be the default view, not Overview.",
    author: "James Whitfield",
    timestamp: "14 Mar 14:33"
  },
  {
    screen: "Screen 3 (Submit Form)",
    body:
      "Looks good. Can we add an 'Urgency' field? Different from Priority — this is about SLA impact.",
    author: "James Whitfield",
    timestamp: "14 Mar 14:38"
  },
  {
    screen: "Screen 5 (Reports)",
    body: "Perfect. This is exactly what the ops team needs.",
    author: "James Whitfield",
    timestamp: "14 Mar 14:41"
  }
];

export const weekUpdates = [
  { label: "Week 3", summary: "Login working · Assignment 60% done · No blockers" },
  { label: "Week 2", summary: "Setup complete · 3 features started" }
];

export const handoverCards = {
  pm: [
    {
      title: "WHAT WAS BUILT",
      icon: "Package",
      tone: "default",
      items: [
        "SSO Authentication + role-based access",
        "Service request submission + full lifecycle",
        "Assignment engine",
        "Status tracking + SLA",
        "Basic reporting (5 metrics)",
        "Responsive web platform",
        "Webhook support"
      ]
    },
    {
      title: "LIVE LINKS",
      icon: "Globe",
      tone: "cyan",
      items: [
        "PRODUCTION: app.acmecorp.com/service-requests",
        "STAGING: staging.acmecorp.com/service-requests",
        "API DOCS: docs.acmecorp.com/api/v1",
        "ADMIN: app.acmecorp.com/admin"
      ]
    },
    {
      title: "ADMIN + CREDENTIALS",
      icon: "Shield",
      tone: "amber",
      items: [
        "Admin panel login: First login via SSO · auto-granted admin role",
        "DB access: Shared via 1Password vault (link)",
        "SSO config: IT contact — devops@acmecorp.com",
        "API keys: Stored in Vercel environment variables"
      ]
    },
    {
      title: "KNOWN LIMITATIONS",
      icon: "AlertTriangle",
      tone: "red",
      items: [
        "Manager approval gate: Deferred to v2 (scope change came late)",
        "Email notifications: Basic only — full config requires client IT setup",
        "Advanced analytics: Not in v1 scope",
        "Mobile: Desktop-first — mobile responsive but not optimised"
      ]
    },
    {
      title: "NEXT STEPS",
      icon: "ArrowRight",
      tone: "cyan",
      items: [
        "V2 Scoping: Manager approval gate + advanced analytics + mobile app",
        "Performance audit recommended at 500+ concurrent users",
        "SLA policy configuration (remains an open decision)",
        "Ongoing maintenance: Monthly retainer proposal sent"
      ]
    },
    {
      title: "SUPPORT + CONTACTS",
      icon: "Headphones",
      tone: "default",
      items: [
        "30-day hypercare window: 14 Mar – 14 Apr 2025",
        "Primary Project Manager: Sarah Chen — sarah@orchestra.io",
        "Issue tracker: Linear board (link)",
        "Emergency: +61 400 000 000"
      ]
    }
  ],
  client: [
    {
      title: "WHAT WAS DELIVERED",
      icon: "Package",
      tone: "default",
      items: [
        "Secure sign-in using your company SSO",
        "Service request form and request lifecycle tracking",
        "Automatic assignment workflow",
        "Status updates for requesters",
        "Reporting dashboard for operations teams"
      ]
    },
    {
      title: "LIVE LINKS",
      icon: "Globe",
      tone: "cyan",
      items: [
        "Production: app.acmecorp.com/service-requests",
        "Staging: staging.acmecorp.com/service-requests",
        "Support docs: docs.acmecorp.com/service-requests"
      ]
    },
    {
      title: "ADMIN ACCESS",
      icon: "Shield",
      tone: "amber",
      items: [
        "Admin access is provisioned through your existing SSO",
        "SSO configuration contact: devops@acmecorp.com",
        "Database access provided separately via secure share"
      ]
    },
    {
      title: "KNOWN LIMITATIONS",
      icon: "AlertTriangle",
      tone: "red",
      items: [
        "Manager approval gate is planned for the next phase",
        "Email notifications are basic until SMTP is configured",
        "Advanced analytics remain out of scope for this release"
      ]
    },
    {
      title: "NEXT STEPS",
      icon: "ArrowRight",
      tone: "cyan",
      items: [
        "Decide whether to proceed with Phase 2 scope",
        "Confirm SLA policy settings",
        "Book the post-launch performance review"
      ]
    },
    {
      title: "SUPPORT",
      icon: "Headphones",
      tone: "default",
      items: [
        "30-day hypercare is included",
        "Primary contact: Sarah Chen",
        "Use the client portal for updates and follow-up questions"
      ]
    }
  ]
};

export const devSummary = ["8 TASKS ASSIGNED", "3 IN PROGRESS", "2 BLOCKED", "3 TODO"];

export const devInProgress = [
  {
    id: "T1.1",
    title: "Implement SSO Integration",
    epic: "E1 — Authentication & Access",
    meta: "FLOWCHART: N4, N1 · JIRA: PROJ-4",
    status: "in-progress",
    priority: "p0",
    progress: 82,
    acceptance: "SSO login completes with valid token · RBAC roles assigned on first login",
    footer: "Started: 11 Mar · Est. completion: 15 Mar · 2 subtasks remaining"
  },
  {
    id: "T2.3",
    title: "Assignment Engine",
    epic: "E2 — Request Lifecycle",
    meta: "FLOWCHART: N7 · JIRA: PROJ-18",
    status: "blocked",
    priority: "p0",
    progress: 0,
    acceptance: "Awaiting client sign-off on permissions hierarchy",
    footer: "Flagged in Control Tower · STALLED 2 DAYS"
  },
  {
    id: "T1.4",
    title: "Session Management + Token Refresh",
    epic: "E1 — Authentication & Access",
    meta: "FLOWCHART: N1 · JIRA: PROJ-7",
    status: "in-progress",
    priority: "p0",
    progress: 40,
    acceptance: "Refresh flow and silent re-auth handling are partially complete",
    footer: "Started: 13 Mar · 3 subtasks remaining"
  }
];

export const devTodo = [
  {
    id: "T2.4",
    title: "Status State Machine",
    note: "Updated: includes 'pending approval' state from SRS change sync",
    status: "revised"
  },
  {
    id: "T2.5",
    title: "Request Detail View",
    note: "Waiting on T2.4 state model finalisation",
    status: "deferred"
  },
  {
    id: "T1.6",
    title: "Auth Integration Tests",
    note: "Blocked on T1.1 completion",
    status: "deferred"
  }
];

export const sprintBoard = {
  todo: [
    { id: "PROJ-12", title: "Request submission form", dag: "N5", epic: "E2", priority: "p0" },
    { id: "PROJ-18", title: "Assignment engine", dag: "N7", epic: "E2", priority: "p0" }
  ],
  inProgress: [
    { id: "PROJ-4", title: "SSO integration", dag: "N4", epic: "E1", priority: "p0" },
    { id: "PROJ-7", title: "Session management", dag: "N1", epic: "E1", priority: "p0" }
  ],
  inReview: [{ id: "PROJ-21", title: "Status tracking view", dag: "N9", epic: "E2", priority: "p0" }],
  done: [
    { id: "PROJ-2", title: "Login screen", dag: "N3", epic: "E1", priority: "p0" },
    { id: "PROJ-26", title: "Reporting shell", dag: "N10", epic: "E3", priority: "p1" }
  ]
};
