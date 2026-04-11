"use client";

import { useParams } from "next/navigation";

import { SourceOfTruth } from "@/components/intelligence/SourceOfTruth";

export default function TruthPage() {
  const params = useParams<{ projectId: string }>();
  const projectId = typeof params?.projectId === "string" ? params.projectId : "p1";

  return <SourceOfTruth projectId={projectId} />;
}
