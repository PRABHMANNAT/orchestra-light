"use client";

import Link from "next/link";
import { LogOut } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

import { RoleBadge } from "@/components/shared/RoleBadge";
import { UserAvatar } from "@/components/shared/UserAvatar";
import { projectMeta } from "@/lib/mockData";
import { type MockUser } from "@/lib/roles";
import { devNavItems } from "@/lib/stageConfig";
import { cn } from "@/lib/utils";

export function DevSidebar({ user }: { user: MockUser }) {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <aside className="flex h-full w-[220px] shrink-0 flex-col border-r border-[#e8e8e8] bg-white/80 backdrop-blur-sm">
      <div className="px-4 pb-4 pt-5">
        <div className="font-sans text-[18px] font-semibold tracking-tight text-[#111111]">ORCHESTRA</div>
        <div className="font-mono text-[10px] uppercase tracking-widest text-[#999999]">{projectMeta.version}</div>
        <div className="mt-4 flex items-center gap-3">
          <UserAvatar initials={user.avatar} role={user.role} />
          <div>
            <div className="font-sans text-[12px] text-[#111111]">{user.name}</div>
            <RoleBadge role={user.role} />
          </div>
        </div>
      </div>
      <div className="flex-1 px-2">
        {devNavItems.map((item) => (
          <Link
            key={`${item.href}-${item.label}`}
            href={item.href}
            prefetch={false}
            className={cn(
              "mb-1 flex min-h-[42px] items-center rounded-lg px-3 font-sans text-[13px] transition-colors",
              pathname === item.href
                ? "border border-[#e8e8e8] bg-white text-[#111111] shadow-sm"
                : "text-[#999999] hover:bg-[#f5f5f5] hover:text-[#111111]"
            )}
          >
            {item.label}
          </Link>
        ))}
      </div>
      <div className="border-t border-[#f0f0f0] px-4 py-4">
        <div className="font-mono text-[9px] uppercase tracking-widest text-[#999999]">{projectMeta.project}</div>
        <button
          type="button"
          onClick={() => {
            window.localStorage.removeItem("orchestra_user");
            router.replace("/login");
          }}
          className="mt-3 text-[#999999] hover:text-[#555555]"
        >
          <LogOut size={13} strokeWidth={1.5} />
        </button>
      </div>
    </aside>
  );
}
