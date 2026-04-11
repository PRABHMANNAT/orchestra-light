import type { Config } from "tailwindcss";
import defaultTheme from "tailwindcss/defaultTheme";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        title: ["var(--font-display)", "sans-serif"],
        display: ["var(--font-display)", "sans-serif"],
        ui: ["var(--font-ui)", ...defaultTheme.fontFamily.sans],
        sans: ["var(--font-ui)", ...defaultTheme.fontFamily.sans],
        mono: ["var(--font-mono)", "monospace"]
      },
      colors: {
        page: "var(--color-bg-page)",
        sidebar: "var(--color-bg-sidebar)",
        bg: {
          0: "var(--color-bg-page)",
          1: "var(--color-bg-1)",
          2: "var(--color-bg-2)",
          3: "var(--color-bg-3)",
          4: "var(--color-bg-4)"
        },
        border: {
          DEFAULT: "var(--color-border)",
          subtle: "var(--color-border-subtle)",
          hover: "var(--color-border-hover)",
          "cyan-glass": "var(--color-border-cyan)"
        },
        text: {
          primary: "var(--color-text-primary)",
          secondary: "var(--color-text-secondary)",
          muted: "var(--color-text-muted)",
          cyan: "var(--color-text-cyan)"
        },
        accent: {
          cyan: "var(--color-accent)",
          dim: "var(--color-accent-dim)",
          glow: "var(--color-accent-glow)"
        }
      },
      borderRadius: {
        sm: "4px",
        DEFAULT: "6px",
        md: "6px",
        lg: "8px",
        xl: "12px",
        "2xl": "16px"
      },
      boxShadow: {
        glass: "0 4px 24px rgba(0,0,0,0.4), 0 1px 0 rgba(255,255,255,0.05) inset, 0 -1px 0 rgba(0,0,0,0.3) inset",
        "glass-sm": "0 2px 12px rgba(0,0,0,0.35), 0 1px 0 rgba(255,255,255,0.04) inset",
        "glass-heavy":
          "0 8px 40px rgba(0,0,0,0.5), 0 1px 0 rgba(255,255,255,0.07) inset, 0 -1px 0 rgba(0,0,0,0.4) inset, 0 0 0 1px rgba(0,229,204,0.03)"
      }
    }
  },
  plugins: []
};

export default config;
