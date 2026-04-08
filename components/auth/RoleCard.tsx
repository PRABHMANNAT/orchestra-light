"use client";

import { Code2, Eye, LayoutDashboard } from "lucide-react";
import { motion } from "framer-motion";

import { type UserRole } from "@/lib/roles";
import { cn } from "@/lib/utils";

const iconMap = {
  pm: LayoutDashboard,
  developer: Code2,
  client: Eye
};

const toneMap: Record<UserRole, string> = {
  pm: "border-[#111111]/20 text-[#111111]",
  developer: "border-[#d6d6d6] text-[#555555]",
  client: "border-[#d6d6d6] text-[#555555]"
};

interface RoleCardProps {
  role: UserRole;
  title: string;
  name: string;
  access: string;
  onClick: () => void;
}

export function RoleCard({ role, title, name, access, onClick }: RoleCardProps) {
  const Icon = iconMap[role];

  return (
    <motion.button
      type="button"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={cn(
        "pm-card relative min-h-[100px] w-full border border-[#e8e8e8] bg-white p-4 text-left shadow-sm",
        toneMap[role]
      )}
    >
      <div className="mb-2 flex items-center gap-3">
        <Icon size={20} strokeWidth={1.5} />
        <span className="font-sans text-[15px] font-semibold text-[#111111]">{title}</span>
      </div>
      <div className="font-sans text-[13px] text-[#444444]">{name}</div>
      <div className="mt-2 font-mono text-[10px] uppercase tracking-widest text-[#999999]">{access}</div>
    </motion.button>
  );
}
