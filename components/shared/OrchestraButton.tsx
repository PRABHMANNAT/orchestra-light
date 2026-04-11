"use client";

import { useState } from "react";
import { motion, type Transition } from "framer-motion";
import { type LucideIcon } from "lucide-react";

import { SPRING_BOUNCY } from "@/lib/animations";
import { cn } from "@/lib/utils";

interface OrchestraButtonProps {
  variant: "primary" | "secondary" | "ghost" | "danger";
  size?: "default" | "sm" | "md";
  isLoading?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
  className?: string;
  type?: "button" | "submit";
  icon?: LucideIcon;
  fullWidth?: boolean;
}

const baseTextStyle = {
  fontFamily: "var(--font-ui)",
  fontWeight: 500,
  letterSpacing: "0.05em",
  whiteSpace: "nowrap" as const
};

const outerTransition = SPRING_BOUNCY as Transition;

export function OrchestraButton({
  variant,
  size = "default",
  isLoading = false,
  disabled = false,
  onClick,
  children,
  className,
  type = "button",
  icon: Icon,
  fullWidth = false
}: OrchestraButtonProps) {
  const [isHovered, setIsHovered] = useState(false);
  const resolvedSize = size === "md" ? "default" : size;
  const paddings =
    resolvedSize === "sm"
      ? { padding: "7px 16px", fontSize: "11px" }
      : { padding: "12px 24px", fontSize: "13px" };

  const glowPalette =
    variant === "danger"
      ? {
          accent: "#f87171",
          soft: "rgba(239,68,68,0.14)",
          mid: "rgba(239,68,68,0.07)",
          strong: "rgba(239,68,68,0.1)",
          border: "rgba(239,68,68,0.28)",
          borderTop: "rgba(239,68,68,0.48)",
          ring: "rgba(239,68,68,0.08)",
          glow: "rgba(239,68,68,0.18)",
          textShadow: "0 0 22px rgba(239,68,68,0.6)"
        }
      : variant === "secondary"
        ? {
            accent: "#a78bfa",
            soft: "rgba(167,139,250,0.14)",
            mid: "rgba(167,139,250,0.07)",
            strong: "rgba(140,92,246,0.1)",
            border: "rgba(167,139,250,0.28)",
            borderTop: "rgba(167,139,250,0.48)",
            ring: "rgba(167,139,250,0.08)",
            glow: "rgba(167,139,250,0.18)",
            textShadow: "0 0 22px rgba(167,139,250,0.6)"
          }
      : {
          accent: "#00e5cc",
          soft: "rgba(0,229,204,0.14)",
          mid: "rgba(0,229,204,0.07)",
          strong: "rgba(0,180,160,0.1)",
          border: "rgba(0,229,204,0.28)",
          borderTop: "rgba(0,229,204,0.48)",
          ring: "rgba(0,229,204,0.08)",
          glow: "rgba(0,229,204,0.18)",
          textShadow: "0 0 22px rgba(0,229,204,0.65)"
        };

  if (variant === "ghost") {
    return (
      <motion.button
        type={type}
        onClick={disabled || isLoading ? undefined : onClick}
        whileHover={disabled ? undefined : { scale: 1.02 }}
        whileTap={disabled ? undefined : { scale: 0.97 }}
        transition={outerTransition}
        className={cn("inline-flex items-center justify-center", fullWidth ? "w-full" : "", className)}
        style={{
          position: "relative",
          overflow: "hidden",
          borderRadius: 6,
          border: "1px solid rgba(255,255,255,0.09)",
          background: "transparent",
          color: "rgba(140,140,165,1)",
          padding: paddings.padding,
          opacity: disabled ? 0.38 : 1,
          pointerEvents: disabled ? "none" : "auto",
          cursor: disabled ? "not-allowed" : "pointer",
          boxShadow: isHovered ? "0 4px 16px rgba(0,0,0,0.35)" : "none",
          ...(baseTextStyle as object),
          fontSize: paddings.fontSize,
          width: fullWidth ? "100%" : undefined
        }}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
      >
        <span
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: 6,
            background: isHovered ? "rgba(255,255,255,0.04)" : "transparent",
            borderColor: isHovered ? "rgba(255,255,255,0.18)" : "rgba(255,255,255,0.09)",
            transition: "all 0.2s ease"
          }}
        />
        <span
          style={{
            position: "relative",
            zIndex: 2,
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            color: isHovered ? "rgba(230,230,245,1)" : "rgba(140,140,165,1)"
          }}
        >
          {isLoading ? (
            <>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 0.75, repeat: Infinity, ease: "linear" }}
                style={{
                  width: 14,
                  height: 14,
                  borderRadius: 9999,
                  border: "2px solid rgba(255,255,255,0.12)",
                  borderTop: "2px solid rgba(230,230,245,1)"
                }}
              />
              <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.08em" }}>processing</span>
            </>
          ) : (
            <>
              {Icon ? <Icon size={14} strokeWidth={1.5} /> : null}
              <span>{children}</span>
            </>
          )}
        </span>
      </motion.button>
    );
  }

  return (
    <motion.button
      type={type}
      onClick={disabled || isLoading ? undefined : onClick}
      whileHover={disabled ? undefined : { scale: 1.032, y: -1.5 }}
      whileTap={disabled ? undefined : { scale: 0.962, y: 0 }}
      transition={outerTransition}
      className={cn("inline-flex items-center justify-center", fullWidth ? "w-full" : "", className)}
      style={{
        position: "relative",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 6,
        overflow: "hidden",
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.38 : 1,
        pointerEvents: disabled ? "none" : "auto",
        width: fullWidth ? "100%" : undefined
      }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <span
        style={{
          position: "absolute",
          inset: -4,
          zIndex: 0,
          borderRadius: 10,
          pointerEvents: "none",
          background: `radial-gradient(ellipse at 50% -10%, ${
            variant === "danger" ? "rgba(239,68,68,0.45)" : variant === "secondary" ? "rgba(167,139,250,0.4)" : "rgba(0,229,204,0.45)"
          } 0%, transparent 65%)`,
          filter: "blur(18px)",
          opacity: isHovered ? 0.7 : 0,
          transition: "opacity 0.4s ease"
        }}
      />

      <span
        style={{
          position: "relative",
          zIndex: 10,
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 8,
          width: fullWidth ? "100%" : undefined,
          padding: paddings.padding,
          background: `linear-gradient(135deg, ${glowPalette.soft} 0%, ${glowPalette.mid} 50%, ${glowPalette.strong} 100%)`,
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          border: `1px solid ${isHovered ? glowPalette.borderTop : glowPalette.border}`,
          borderTop: `1px solid ${isHovered ? glowPalette.borderTop : glowPalette.borderTop}`,
          borderRadius: 6,
          boxShadow: isHovered
            ? `0 0 0 1px ${glowPalette.border}, 0 8px 36px ${glowPalette.glow}, 0 1px 0 rgba(255,255,255,0.12) inset`
            : `0 0 0 1px ${glowPalette.ring}, 0 4px 20px ${glowPalette.glow}, 0 1px 0 rgba(255,255,255,0.09) inset`,
          transition: "all 0.25s ease"
        }}
      >
        <span
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 20,
            pointerEvents: "none",
            borderRadius: 6,
            overflow: "hidden"
          }}
        >
          <span
            style={{
              position: "absolute",
              top: 0,
              left: isHovered ? "160%" : "-100%",
              width: "55%",
              height: "100%",
              background: "linear-gradient(108deg, transparent 38%, rgba(255,255,255,0.11) 50%, transparent 62%)",
              transition: "left 0.52s ease"
            }}
          />
        </span>

        {isLoading ? (
          <span style={{ position: "relative", zIndex: 30, display: "inline-flex", alignItems: "center", gap: 8 }}>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 0.75, repeat: Infinity, ease: "linear" }}
              style={{
                width: 14,
                height: 14,
                border: `2px solid ${
                  variant === "danger"
                    ? "rgba(239,68,68,0.2)"
                    : variant === "secondary"
                      ? "rgba(167,139,250,0.2)"
                      : "rgba(0,229,204,0.2)"
                }`,
                borderTop: `2px solid ${glowPalette.accent}`,
                borderRadius: 9999
              }}
            />
            <span
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 11,
                color: `${glowPalette.accent}99`,
                marginLeft: 2
              }}
            >
              processing
            </span>
          </span>
        ) : (
          <span
            style={{
              position: "relative",
              zIndex: 30,
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              ...(baseTextStyle as object),
              fontSize: paddings.fontSize,
              color: glowPalette.accent,
              textShadow: glowPalette.textShadow
            }}
          >
            {Icon ? <Icon size={14} strokeWidth={1.5} /> : null}
            <span>{children}</span>
          </span>
        )}
      </span>
    </motion.button>
  );
}
