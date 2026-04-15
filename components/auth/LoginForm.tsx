"use client";

import { useMemo, useState } from "react";
import { Code2, Eye, LayoutDashboard } from "lucide-react";
import { motion } from "framer-motion";

import { chipBounce, staggerContainer } from "@/lib/animations";
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
    setIsAutoSigning(true);
    window.setTimeout(() => onSuccess(user), 450);
  };

  const signInAsRole = (role: UserRole) => {
    const user = MOCK_USERS.find((entry) => entry.role === role);
    if (!user) return;

    setEmail(user.email);
    setPassword(user.password);
    setError("");
    setIsAutoSigning(true);
    window.setTimeout(() => onSuccess(user), 600);
  };

  return (
    <div className="space-y-5">
      <div>
        <label className="mb-1 block font-mono text-[10px] tracking-[0.12em] text-text-muted">EMAIL ADDRESS</label>
        <input
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="tactical-input w-full rounded-lg px-3 py-2.5 font-ui text-[13px] text-[var(--text-primary)] outline-none"
        />
      </div>
      <div>
        <label className="mb-1 block font-mono text-[10px] tracking-[0.12em] text-text-muted">PASSWORD</label>
        <input
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className="tactical-input w-full rounded-lg px-3 py-2.5 font-ui text-[13px] text-[var(--text-primary)] outline-none"
        />
      </div>
      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}>
        <OrchestraButton fullWidth variant="primary" onClick={handleSubmit} isLoading={isAutoSigning}>
          SIGN IN
        </OrchestraButton>
      </motion.div>
      {error ? <p className="font-mono text-[10px] tracking-[0.08em] text-[#fca5a5]">{error}</p> : null}
      <div>
        <div className="mb-3 font-mono text-[10px] tracking-[0.18em] text-text-muted">QUICK ACCESS</div>
        <motion.div variants={staggerContainer(0.06, 0.1)} initial="hidden" animate="show" className="grid gap-3 md:grid-cols-3">
          {roleCardContent.map((card) => {
            const Icon = iconMap[card.role];
            void Icon;

            return (
              <motion.div key={card.role} variants={chipBounce}>
                <RoleCard
                  role={card.role}
                  title={card.title}
                  name={card.name}
                  access={card.access}
                  onClick={() => signInAsRole(card.role)}
                />
              </motion.div>
            );
          })}
        </motion.div>
      </div>
      {currentRole ? (
        <div className="font-mono text-[10px] tracking-[0.12em] text-text-muted">
          Auto-detected role: {currentRole === "pm" ? "manager" : currentRole}
        </div>
      ) : null}
    </div>
  );
}
