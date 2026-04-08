import { type UserRole } from "@/lib/roles";
import { cn } from "@/lib/utils";

interface UserAvatarProps {
  initials: string;
  role: UserRole;
  size?: "sm" | "md" | "lg";
}

const sizeMap = {
  sm: "h-6 w-6 text-[9px]",
  md: "h-8 w-8 text-[10px]",
  lg: "h-10 w-10 text-[12px]"
};

export function UserAvatar({ initials, role: _role, size = "md" }: UserAvatarProps) {
  return (
    <div
      className={cn(
        "flex items-center justify-center rounded-lg border border-[#dddddd] bg-[#f0f0f0] font-mono text-[#333333]",
        sizeMap[size]
      )}
    >
      {initials}
    </div>
  );
}
