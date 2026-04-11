"use client";

import { useParams } from "next/navigation";

import { ClientComms } from "@/components/intelligence/ClientComms";

export default function CommsPage() {
  const params = useParams<{ projectId: string }>();
  const projectId = typeof params?.projectId === "string" ? params.projectId : "p1";

  return <ClientComms projectId={projectId} />;
}
