import { type UserRole } from "@/lib/roles";

interface UserAvatarProps {
  initials: string;
  role: UserRole;
  size?: "sm" | "md" | "lg";
}

const sizeMap = {
  sm: 26,
  md: 30,
  lg: 40
} as const;

export function UserAvatar({ initials, role, size = "md" }: UserAvatarProps) {
  const dimension = sizeMap[size];
  const isManager = role === "pm";

  return (
    <div
      style={{
        width: dimension,
        height: dimension,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: "50%",
        background: isManager ? "rgba(0,229,204,0.1)" : "rgba(255,255,255,0.04)",
        border: isManager ? "1px solid rgba(0,229,204,0.2)" : "1px solid rgba(255,255,255,0.08)",
        color: isManager ? "#00e5cc" : "var(--color-text-primary)",
        fontFamily: "var(--font-mono)",
        fontSize: size === "lg" ? 12 : 11
      }}
    >
      {initials}
    </div>
  );
}
