export interface StageConfig {
  slug: PMProjectSurfaceSlug;
  label: string;
  number: string;
  icon: string;
  description: string;
}

export type PMProjectSurfaceSlug =
  | "brain"
  | "dag"
  | "comms"
  | "intel"
  | "decisions"
  | "changes"
  | "outputs"
  | "memory";

export const pmSurfaces = [
  {
    slug: "brain",
    label: "Brain",
    number: "01",
    icon: "Brain",
    description: "Source package and clarified brief"
  },
  {
    slug: "dag",
    label: "DAG",
    number: "02",
    icon: "GitBranch",
    description: "Product structure and dependency map"
  },
  {
    slug: "comms",
    label: "Communications",
    number: "03",
    icon: "MessageCircle",
    description: "Client messages interpreted against the product"
  },
  {
    slug: "intel",
    label: "Intelligence",
    number: "04",
    icon: "Sparkles",
    description: "Classifications, contradictions, and Socrates"
  },
  {
    slug: "decisions",
    label: "Decisions",
    number: "05",
    icon: "CheckSquare",
    description: "What was decided and where it came from"
  },
  {
    slug: "changes",
    label: "Changes",
    number: "06",
    icon: "RefreshCw",
    description: "Requirement changes and their implications"
  },
  {
    slug: "outputs",
    label: "Outputs",
    number: "07",
    icon: "Send",
    description: "Role-specific updates and handoffs"
  },
  {
    slug: "memory",
    label: "Memory",
    number: "08",
    icon: "Archive",
    description: "Searchable project source of truth"
  }
] as const satisfies readonly StageConfig[];

export const pmStages = pmSurfaces;
export type PmStageSlug = PMProjectSurfaceSlug;
export type PMStageSlug = PmStageSlug;
export const PM_STAGES: readonly StageConfig[] = pmSurfaces;

export const STAGE_GRADIENTS: Record<PMProjectSurfaceSlug, string> = {
  brain: "linear-gradient(145deg, rgba(0,229,204,0.14) 0%, rgba(167,139,250,0.08) 100%)",
  dag: "linear-gradient(145deg, rgba(0,229,204,0.12) 0%, rgba(251,191,36,0.08) 100%)",
  comms: "linear-gradient(145deg, rgba(96,165,250,0.12) 0%, rgba(52,211,153,0.07) 100%)",
  intel: "linear-gradient(145deg, rgba(167,139,250,0.12) 0%, rgba(0,229,204,0.07) 100%)",
  decisions: "linear-gradient(145deg, rgba(52,211,153,0.12) 0%, rgba(96,165,250,0.07) 100%)",
  changes: "linear-gradient(145deg, rgba(251,191,36,0.12) 0%, rgba(251,113,133,0.07) 100%)",
  outputs: "linear-gradient(145deg, rgba(0,229,204,0.12) 0%, rgba(96,165,250,0.07) 100%)",
  memory: "linear-gradient(145deg, rgba(167,139,250,0.1) 0%, rgba(255,255,255,0.03) 100%)"
};

export const getSurfaceRoute = (projectId: string, surface: PMProjectSurfaceSlug) => `/pm/${projectId}/${surface}`;
export const getStageRoute = (projectId: string, surface: PMProjectSurfaceSlug) => getSurfaceRoute(projectId, surface);
export const getBrainRoute = (projectId: string) => getSurfaceRoute(projectId, "brain");
export const getDagRoute = (projectId: string) => getSurfaceRoute(projectId, "dag");
export const getCommsRoute = (projectId: string) => getSurfaceRoute(projectId, "comms");
export const getIntelRoute = (projectId: string) => getSurfaceRoute(projectId, "intel");
export const getDecisionsRoute = (projectId: string) => getSurfaceRoute(projectId, "decisions");
export const getChangesRoute = (projectId: string) => getSurfaceRoute(projectId, "changes");
export const getOutputsRoute = (projectId: string) => getSurfaceRoute(projectId, "outputs");
export const getMemoryRoute = (projectId: string) => getSurfaceRoute(projectId, "memory");
export const getTruthRoute = getMemoryRoute;
