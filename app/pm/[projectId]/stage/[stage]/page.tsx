"use client";

import { type ComponentType } from "react";
import { useParams } from "next/navigation";

import { StageRouteTransition } from "@/components/layout/StageRouteTransition";
import { Stage1Intake } from "@/components/stages/Stage1Intake";
import { Stage2Clarification } from "@/components/stages/Stage2Clarification";
import { Stage3ProductFlowchart } from "@/components/stages/Stage3DAG";
import { Stage4Prototype } from "@/components/stages/Stage4Prototype";
import { Stage5Approval } from "@/components/stages/Stage5Approval";
import { Stage6ExecutionPlan } from "@/components/stages/Stage6ExecutionPlan";
import { Stage7ChangeSync } from "@/components/stages/Stage7ChangeSync";
import { Stage8ControlTower } from "@/components/stages/Stage8ControlTower";
import { Stage9StakeholderUpdates } from "@/components/stages/Stage9StakeholderUpdates";
import { Stage10Handover } from "@/components/stages/Stage10Handover";
import { type PmStageSlug } from "@/lib/stageConfig";

const stageComponents: Record<PmStageSlug, ComponentType> = {
  "1-intake": Stage1Intake,
  "2-clarification": Stage2Clarification,
  "3-dag": Stage3ProductFlowchart,
  "4-prototype": Stage4Prototype,
  "5-approval": Stage5Approval,
  "6-execution": Stage6ExecutionPlan,
  "7-changesync": Stage7ChangeSync,
  "8-tower": Stage8ControlTower,
  "9-updates": Stage9StakeholderUpdates,
  "10-handover": Stage10Handover
};

export default function ProjectStagePage() {
  const params = useParams<{ projectId: string; stage: string }>();
  const stage = (typeof params?.stage === "string" ? params.stage : "1-intake") as PmStageSlug;
  const StageComponent = stageComponents[stage];

  if (!StageComponent) {
    return (
      <div className="flex min-h-screen items-center justify-center px-8 py-12">
        <div className="glass rounded-xl px-6 py-5 font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--text-muted)]">
          Stage not found.
        </div>
      </div>
    );
  }

  return (
    <StageRouteTransition stage={`${params?.projectId ?? "p1"}:${stage}`}>
      <StageComponent />
    </StageRouteTransition>
  );
}
