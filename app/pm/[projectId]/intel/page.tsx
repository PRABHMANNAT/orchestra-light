"use client";

import { useParams } from "next/navigation";

import { ProductIntel } from "@/components/intelligence/ProductIntel";

export default function IntelPage() {
  const params = useParams<{ projectId: string }>();
  const projectId = typeof params?.projectId === "string" ? params.projectId : "p1";

  return <ProductIntel projectId={projectId} />;
}
