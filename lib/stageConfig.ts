export interface StageConfig {
  slug: string;
  label: string;
  number: string;
  icon: string;
  description: string;
}

export const pmStages = [
  {
    slug: "1-intake",
    label: "What did Jack send?",
    number: "01",
    icon: "Upload",
    description: "Take in whatever Jack sent"
  },
  {
    slug: "2-clarification",
    label: "What does Jack want?",
    number: "02",
    icon: "MessageSquare",
    description: "Turn ambiguity into something buildable"
  },
  {
    slug: "3-dag",
    label: "How does it fit together?",
    number: "03",
    icon: "GitFork",
    description: "See the whole product in one place"
  },
  {
    slug: "4-prototype",
    label: "Does this look right?",
    number: "04",
    icon: "Layers",
    description: "Show real screens before build starts"
  },
  {
    slug: "5-approval",
    label: "Is Jack happy?",
    number: "05",
    icon: "ShieldCheck",
    description: "Get founder sign-off before build"
  },
  {
    slug: "6-execution",
    label: "Who builds what?",
    number: "06",
    icon: "ListTodo",
    description: "Make ownership obvious"
  },
  {
    slug: "7-changesync",
    label: "Jack changed something.",
    number: "07",
    icon: "RefreshCw",
    description: "Show what changed and what it costs"
  },
  {
    slug: "8-tower",
    label: "How are we doing?",
    number: "08",
    icon: "Activity",
    description: "See delivery clearly, right now"
  },
  {
    slug: "9-updates",
    label: "What does everyone know?",
    number: "09",
    icon: "Bell",
    description: "Send the right update without rewriting it"
  },
  {
    slug: "10-handover",
    label: "It shipped.",
    number: "10",
    icon: "PackageCheck",
    description: "Wrap delivery and hand it over cleanly"
  }
] as const satisfies readonly StageConfig[];

export type PmStageSlug = (typeof pmStages)[number]["slug"];
export type PMStageSlug = PmStageSlug;

export const PM_STAGES: readonly StageConfig[] = pmStages;

export const STAGE_GRADIENTS: Record<string, string> = {
  "1-intake": "linear-gradient(145deg, #d4e0c8 0%, #c8d4b8 40%, #d0dcc4 100%)",
  "2-clarification": "linear-gradient(145deg, #c8d0dc 0%, #bcc8d8 40%, #c4ccda 100%)",
  "3-dag": "linear-gradient(145deg, #d8ccc0 0%, #ccc0b0 40%, #d4c8bc 100%)",
  "4-prototype": "linear-gradient(145deg, #c8d8cc 0%, #bcccc0 40%, #c4d4c8 100%)",
  "5-approval": "linear-gradient(145deg, #dcd0c0 0%, #d0c4b0 40%, #d8ccbc 100%)",
  "6-execution": "linear-gradient(145deg, #ccd4c8 0%, #c0c8bc 40%, #c8d0c4 100%)",
  "7-changesync": "linear-gradient(145deg, #dcd4c4 0%, #d0c8b8 40%, #d8d0c0 100%)",
  "8-tower": "linear-gradient(145deg, #c4ccd8 0%, #b8c0d0 40%, #c0c8d4 100%)",
  "9-updates": "linear-gradient(145deg, #ccd8c8 0%, #c0ccbc 40%, #c8d4c4 100%)",
  "10-handover": "linear-gradient(145deg, #c8d4c8 0%, #bcccbc 40%, #c4d0c4 100%)"
};

export const getStageRoute = (projectId: string, stage: PmStageSlug) => `/pm/${projectId}/stage/${stage}`;
export const getTruthRoute = (projectId: string) => `/pm/${projectId}/truth`;
export const getCommsRoute = (projectId: string) => `/pm/${projectId}/comms`;
export const getIntelRoute = (projectId: string) => `/pm/${projectId}/intel`;

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

export const devNavItems = DEV_NAV_ITEMS;
export const clientTabs = CLIENT_TABS;
