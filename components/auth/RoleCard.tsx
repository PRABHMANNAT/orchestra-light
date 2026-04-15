"use client";

import { Code2, Eye, LayoutDashboard } from "lucide-react";
import { motion } from "framer-motion";

import { type UserRole } from "@/lib/roles";

const iconMap = {
  pm: LayoutDashboard,
  developer: Code2,
  client: Eye
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
      className="login-role-card glass w-full rounded-lg p-4 text-left"
    >
      <div className="mb-2 flex items-center gap-3">
        <Icon size={18} className="text-[var(--accent-cyan)]" />
        <span className="font-ui text-[14px] font-medium text-[var(--text-primary)]">{title}</span>
      </div>
      <div className="font-ui text-[13px] text-[var(--text-secondary)]">{name}</div>
      <div className="mt-2 font-mono text-[10px] tracking-[0.12em] text-[var(--text-muted)]">{access}</div>
    </motion.button>
  );
}
