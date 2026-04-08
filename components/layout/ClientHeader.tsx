"use client";

import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

import { RoleBadge } from "@/components/shared/RoleBadge";
import { UserAvatar } from "@/components/shared/UserAvatar";
import { projectMeta } from "@/lib/mockData";
import { type MockUser } from "@/lib/roles";

export function ClientHeader({ user }: { user: MockUser }) {
  const router = useRouter();

  return (
    <header className="flex h-14 items-center justify-between border-b border-[#e8e8e8] bg-white/80 px-8 backdrop-blur-sm">
      <div className="flex items-center">
        <span className="font-sans text-[16px] font-semibold tracking-tight text-[#111111]">ORCHESTRA</span>
        <span className="ml-3 font-mono text-[9px] uppercase tracking-widest text-[#999999]">CLIENT PORTAL</span>
      </div>
      <div className="font-sans text-[13px] text-[#666666]">
        {projectMeta.project} · {projectMeta.client}
      </div>
      <div className="flex items-center gap-3">
        <UserAvatar initials={user.avatar} role={user.role} />
        <div className="font-sans text-[12px] text-[#111111]">{user.name}</div>
        <RoleBadge role={user.role} />
        <button
          type="button"
          onClick={() => {
            window.localStorage.removeItem("orchestra_user");
            router.replace("/login");
          }}
          className="text-[#999999] hover:text-[#555555]"
        >
          <LogOut size={13} strokeWidth={1.5} />
        </button>
      </div>
    </header>
  );
}
