import { notFound } from "next/navigation";

import { pmStages, type PmStageSlug } from "@/lib/stageConfig";

export const dynamic = "force-dynamic";
export const dynamicParams = false;

const stageLoaders: Record<PmStageSlug, () => Promise<React.ComponentType>> = {
  "1-intake": async () => (await import("@/components/stages/Stage1Intake")).Stage1Intake,
  "2-clarification": async () => (await import("@/components/stages/Stage2Clarification")).Stage2Clarification,
  "3-dag": async () => (await import("@/components/stages/Stage3DAG")).Stage3ProductFlowchart,
  "4-prototype": async () => (await import("@/components/stages/Stage4Prototype")).Stage4Prototype,
  "5-approval": async () => (await import("@/components/stages/Stage5Approval")).Stage5Approval,
  "6-execution": async () => (await import("@/components/stages/Stage6ExecutionPlan")).Stage6ExecutionPlan,
  "7-changesync": async () => (await import("@/components/stages/Stage7ChangeSync")).Stage7ChangeSync,
  "8-tower": async () => (await import("@/components/stages/Stage8ControlTower")).Stage8ControlTower,
  "9-updates": async () => (await import("@/components/stages/Stage9StakeholderUpdates")).Stage9StakeholderUpdates,
  "10-handover": async () => (await import("@/components/stages/Stage10Handover")).Stage10Handover
};

export function generateStaticParams() {
  return pmStages.map((stage) => ({ stage: stage.slug }));
}

export default async function PmStagePage({ params }: { params: { stage: string } }) {
  const loader = stageLoaders[params.stage as PmStageSlug];

  if (!loader) {
    notFound();
  }

  const StageComponent = await loader();

  return <StageComponent />;
}
