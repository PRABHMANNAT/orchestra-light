import { cn } from "@/lib/utils";
import { type UserRole } from "@/lib/roles";

const roleTone: Record<UserRole, string> = {
  pm: "border-[#111111] bg-[#111111] text-white",
  developer: "border-[#e0e0e0] bg-[#f5f5f5] text-[#555555]",
  client: "border-[#e0e0e0] bg-[#fafafa] text-[#666666]"
};

export function RoleBadge({ role }: { role: UserRole }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 font-mono text-[9px] uppercase tracking-[0.12em]",
        roleTone[role]
      )}
    >
      {role === "pm" ? "MGR" : role === "developer" ? "DEV" : "CLIENT"}
    </span>
  );
}
