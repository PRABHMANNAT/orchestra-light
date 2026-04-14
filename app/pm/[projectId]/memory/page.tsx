"use client";

import { useParams } from "next/navigation";

import { SourceOfTruth } from "@/components/intelligence/SourceOfTruth";

export default function MemoryPage() {
  const params = useParams<{ projectId: string }>();
  const projectId = typeof params?.projectId === "string" ? params.projectId : "bloomfast";

  return <SourceOfTruth projectId={projectId} />;
}
