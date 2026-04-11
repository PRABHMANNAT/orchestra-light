import { type UserRole } from "@/lib/roles";

const roleMap: Record<UserRole, string> = {
  pm: "MGR",
  developer: "DEV",
  client: "CLIENT"
};

const toneMap: Record<UserRole, string> = {
  pm: "rgba(0,229,204,0.25)",
  developer: "rgba(255,255,255,0.08)",
  client: "rgba(255,255,255,0.08)"
};

const colorMap: Record<UserRole, string> = {
  pm: "#00e5cc",
  developer: "var(--color-text-secondary)",
  client: "var(--color-text-secondary)"
};

export function RoleBadge({ role }: { role: UserRole }) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        padding: "2px 7px",
        borderRadius: 3,
        border: `1px solid ${toneMap[role]}`,
        background: "transparent",
        color: colorMap[role],
        fontFamily: "var(--font-mono)",
        fontSize: 9,
        letterSpacing: "0.14em"
      }}
    >
      {roleMap[role]}
    </span>
  );
}
