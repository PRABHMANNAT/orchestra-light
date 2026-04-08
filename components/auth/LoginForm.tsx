"use client";

import { useMemo, useState } from "react";
import { Code2, Eye, LayoutDashboard } from "lucide-react";
import { motion } from "framer-motion";

import { RoleCard } from "@/components/auth/RoleCard";
import { OrchestraButton } from "@/components/shared/OrchestraButton";
import { type MockUser, findUserByCredentials, MOCK_USERS, type UserRole } from "@/lib/roles";
import { roleCardContent } from "@/lib/mockData";

const iconMap = {
  pm: LayoutDashboard,
  developer: Code2,
  client: Eye
};

interface LoginFormProps {
  onSuccess: (user: MockUser) => void;
}

export function LoginForm({ onSuccess }: LoginFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isAutoSigning, setIsAutoSigning] = useState(false);
  const currentRole = useMemo(() => MOCK_USERS.find((user) => user.email === email)?.role, [email]);

  const handleSubmit = () => {
    const user = findUserByCredentials(email, password);

    if (!user) {
      setError("Credentials not recognised in demo dataset");
      return;
    }

    setError("");
    onSuccess(user);
  };

  const signInAsRole = (role: UserRole) => {
    const user = MOCK_USERS.find((entry) => entry.role === role);
    if (!user) return;

    setEmail(user.email);
    setPassword(user.password);
    setError("");
    setIsAutoSigning(true);
    window.setTimeout(() => {
      onSuccess(user);
    }, 600);
  };

  return (
    <div className="space-y-5">
      <div>
        <label className="mb-1 block font-mono text-[10px] uppercase tracking-[0.12em] text-[#999999]">
          EMAIL ADDRESS
        </label>
        <input
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="w-full rounded-lg border border-[#e0e0e0] bg-white px-3 py-2.5 font-sans text-[13px] text-[#111111] outline-none"
        />
      </div>
      <div>
        <label className="mb-1 block font-mono text-[10px] uppercase tracking-[0.12em] text-[#999999]">
          PASSWORD
        </label>
        <input
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className="w-full rounded-lg border border-[#e0e0e0] bg-white px-3 py-2.5 font-sans text-[13px] text-[#111111] outline-none"
        />
      </div>
      <motion.div animate={isAutoSigning ? { scale: [1, 1.02, 1] } : { scale: 1 }}>
        <OrchestraButton fullWidth variant="primary" onClick={handleSubmit}>
          SIGN IN
        </OrchestraButton>
      </motion.div>
      {error ? <p className="font-mono text-[10px] uppercase tracking-[0.08em] text-[#991b1b]">{error}</p> : null}
      <div>
        <div className="mb-3 font-mono text-[10px] uppercase tracking-[0.18em] text-[#999999]">
          QUICK ACCESS
        </div>
        <div className="grid gap-3 md:grid-cols-3">
          {roleCardContent.map((card) => {
            const Icon = iconMap[card.role];
            void Icon;
            return (
              <RoleCard
                key={card.role}
                role={card.role}
                title={card.title}
                name={card.name}
                access={card.access}
                onClick={() => signInAsRole(card.role)}
              />
            );
          })}
        </div>
      </div>
      {currentRole ? (
        <div className="font-mono text-[10px] uppercase tracking-[0.12em] text-[#999999]">
          Auto-detected role: {currentRole === "pm" ? "manager" : currentRole}
        </div>
      ) : null}
    </div>
  );
}
