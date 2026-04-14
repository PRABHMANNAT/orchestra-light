"use client";

import { useParams } from "next/navigation";

import { Stage3ProductFlowchart } from "@/components/stages/Stage3DAG";

export default function DagPage() {
  const params = useParams<{ projectId: string }>();
  const projectId = typeof params?.projectId === "string" ? params.projectId : "bloomfast";

  return <Stage3ProductFlowchart projectId={projectId} />;
}
