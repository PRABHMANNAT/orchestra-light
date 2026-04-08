export interface StageConfig {
  slug: string;
  label: string;
  number: string;
  icon: string;
  description: string;
}

export const STAGE_GRADIENTS: Record<string, string> = {
  "1-intake": "linear-gradient(145deg, #d4e0c8 0%, #c8d4b8 40%, #d0dcc4 100%)",
  "2-clarification": "linear-gradient(145deg, #c8d0dc 0%, #bcc8d8 40%, #c4ccda 100%)",
  "3-dag": "linear-gradient(145deg, #d8ccc0 0%, #ccc0b0 40%, #d4c8bc 100%)",
  "4-prototype": "linear-gradient(145deg, #c8d8cc 0%, #bcccc0 40%, #c4d4c8 100%)",
  "5-approval": "linear-gradient(145deg, #dcd0c0 0%, #d0c4b0 40%, #d8ccbc 100%)",
  "6-execution": "linear-gradient(145deg, #ccd4c8 0%, #c0c8bc 40%, #c8d0c4 100%)",
  "7-boardsync": "linear-gradient(145deg, #c8d4cc 0%, #bcc8c0 40%, #c4ccc8 100%)",
  "8-changesync": "linear-gradient(145deg, #dcd4c4 0%, #d0c8b8 40%, #d8d0c0 100%)",
  "9-tower": "linear-gradient(145deg, #c4ccd8 0%, #b8c0d0 40%, #c0c8d4 100%)",
  "10-updates": "linear-gradient(145deg, #ccd8c8 0%, #c0ccbc 40%, #c8d4c4 100%)",
  "11-handover": "linear-gradient(145deg, #c8d4c8 0%, #bcccbc 40%, #c4d0c4 100%)",
  "7-changesync": "linear-gradient(145deg, #dcd4c4 0%, #d0c8b8 40%, #d8d0c0 100%)",
  "8-tower": "linear-gradient(145deg, #c4ccd8 0%, #b8c0d0 40%, #c0c8d4 100%)",
  "10-handover": "linear-gradient(145deg, #c8d4c8 0%, #bcccbc 40%, #c4d0c4 100%)"
};

export const PM_STAGES: StageConfig[] = [
  {
    slug: "1-intake",
    label: "INTAKE",
    number: "01",
    icon: "Upload",
    description: "Ingest SRS, PRD, notes and voice material"
  },
  {
    slug: "2-clarification",
    label: "CLARIFICATION",
    number: "02",
    icon: "MessageSquare",
    description: "Manager-style questions that resolve ambiguity"
  },
  {
    slug: "3-dag",
    label: "PRODUCT FLOWCHART",
    number: "03",
    icon: "GitFork",
    description: "Visual map of your delivery workflow"
  },
  {
    slug: "4-prototype",
    label: "PROTOTYPE",
    number: "04",
    icon: "Layers",
    description: "Visual slice of the approved MVP path"
  },
  {
    slug: "5-approval",
    label: "SCOPE APPROVAL",
    number: "05",
    icon: "ShieldCheck",
    description: "Lock scope before execution begins"
  },
  {
    slug: "6-execution",
    label: "EXECUTION PLAN",
    number: "06",
    icon: "ListTodo",
    description: "Epics, tasks, and acceptance criteria"
  },
  {
    slug: "7-boardsync",
    label: "BOARD SYNC",
    number: "07",
    icon: "Zap",
    description: "Write approved plan to Jira or Linear"
  },
  {
    slug: "8-changesync",
    label: "CHANGE SYNC",
    number: "08",
    icon: "RefreshCw",
    description: "Diff old vs new SRS, patch plan and product flowchart"
  },
  {
    slug: "9-tower",
    label: "CONTROL TOWER",
    number: "09",
    icon: "Activity",
    description: "Live delivery intelligence vs approved scope"
  },
  {
    slug: "10-updates",
    label: "UPDATES",
    number: "10",
    icon: "Bell",
    description: "Automated stakeholder and client reports"
  },
  {
    slug: "11-handover",
    label: "HANDOVER",
    number: "11",
    icon: "PackageCheck",
    description: "Professional project close and delivery"
  }
];

export type PMStageSlug = (typeof PM_STAGES)[number]["slug"];

export const DEV_NAV_ITEMS = [
  { href: "/dev", label: "My Work" },
  { href: "/dev/sprint", label: "Sprint Board" },
  { href: "/dev", label: "Assigned Tasks" },
  { href: "/dev", label: "Dependencies" },
  { href: "/dev", label: "Team" }
] as const;

export const CLIENT_TABS = [
  { key: "prototype", label: "PROTOTYPE REVIEW" },
  { key: "approvals", label: "APPROVALS" },
  { key: "updates", label: "PROGRESS UPDATES" },
  { key: "handover", label: "HANDOVER" }
] as const;

export const pmStages = [
  {
    slug: "1-intake",
    label: "INTAKE",
    number: "01",
    icon: "Upload",
    description: "Ingest SRS, PRD, notes and voice material"
  },
  {
    slug: "2-clarification",
    label: "CLARIFICATION",
    number: "02",
    icon: "MessageSquare",
    description: "Manager-style questions that resolve ambiguity"
  },
  {
    slug: "3-dag",
    label: "PRODUCT FLOWCHART",
    number: "03",
    icon: "GitFork",
    description: "Visual map of your delivery workflow"
  },
  {
    slug: "4-prototype",
    label: "PROTOTYPE",
    number: "04",
    icon: "Layers",
    description: "Visual slice of the approved MVP path"
  },
  {
    slug: "5-approval",
    label: "SCOPE APPROVAL",
    number: "05",
    icon: "ShieldCheck",
    description: "Lock scope before execution begins"
  },
  {
    slug: "6-execution",
    label: "EXECUTION PLAN",
    number: "06",
    icon: "ListTodo",
    description: "Epics, tasks, and acceptance criteria"
  },
  {
    slug: "7-changesync",
    label: "CHANGE SYNC",
    number: "07",
    icon: "RefreshCw",
    description: "Diff old vs new SRS, patch plan and product flowchart"
  },
  {
    slug: "8-tower",
    label: "CONTROL TOWER",
    number: "08",
    icon: "Activity",
    description: "Live delivery intelligence vs approved scope"
  },
  {
    slug: "9-updates",
    label: "UPDATES",
    number: "09",
    icon: "Bell",
    description: "Automated stakeholder and client reports"
  },
  {
    slug: "10-handover",
    label: "HANDOVER",
    number: "10",
    icon: "PackageCheck",
    description: "Professional project close and delivery"
  }
] as const;

export type PmStageSlug = (typeof pmStages)[number]["slug"];

export const devNavItems = DEV_NAV_ITEMS;
export const clientTabs = CLIENT_TABS;
