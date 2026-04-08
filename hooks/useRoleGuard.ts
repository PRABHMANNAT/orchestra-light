"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { type MockUser, type UserRole, roleRouteMap } from "@/lib/roles";

export function useRoleGuard(allowedRole: UserRole) {
  const router = useRouter();
  const [user, setUser] = useState<MockUser | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const raw = window.localStorage.getItem("orchestra_user");

    if (!raw) {
      router.replace("/login");
      return;
    }

    try {
      const parsed = JSON.parse(raw) as MockUser;

      if (parsed.role !== allowedRole) {
        router.replace(roleRouteMap[parsed.role]);
        return;
      }

      setUser(parsed);
      setReady(true);
    } catch {
      window.localStorage.removeItem("orchestra_user");
      router.replace("/login");
    }
  }, [allowedRole, router]);

  return { user, ready };
}

