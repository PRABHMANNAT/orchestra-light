import type { Config } from "tailwindcss";
import defaultTheme from "tailwindcss/defaultTheme";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        title: ["var(--font-title)", ...defaultTheme.fontFamily.sans],
        display: ["var(--font-ui)", ...defaultTheme.fontFamily.sans],
        ui: ["var(--font-ui)", ...defaultTheme.fontFamily.sans],
        sans: ["var(--font-ui)", ...defaultTheme.fontFamily.sans],
        mono: ["var(--font-mono)", ...defaultTheme.fontFamily.mono]
      },
      colors: {
        navy: "#111111",
        brown: "#5f4411",
        green: "#6ca956",
        amber: "#e2b20d",
        yellow: "#eac42f",
        ice: "#aec5c3",
        surface: {
          "1": "rgba(255,255,255,0.88)",
          "2": "rgba(255,255,255,0.78)",
          "3": "rgba(255,255,255,0.58)"
        },
        bg: {
          DEFAULT: "#f5f5f2",
          "1": "rgba(255,255,255,0.88)",
          "2": "rgba(255,255,255,0.78)",
          "3": "rgba(245,245,245,0.92)",
          "4": "rgba(17,17,17,0.06)"
        },
        border: {
          DEFAULT: "rgba(17,17,17,0.08)",
          hover: "rgba(17,17,17,0.14)",
          active: "rgba(17,17,17,0.2)"
        },
        text: {
          primary: "#111111",
          secondary: "rgba(17,17,17,0.64)",
          muted: "rgba(17,17,17,0.42)"
        },
        accent: {
          cyan: "#334155",
          amber: "#e2b20d",
          green: "#6ca956",
          red: "#f87171",
          purple: "#5f4411",
          blue: "#aec5c3"
        }
      },
      borderRadius: {
        sm: "8px",
        md: "12px",
        lg: "16px",
        xl: "24px",
        "2xl": "32px",
        "3xl": "40px",
        glass: "24px",
        "glass-sm": "16px",
        "glass-xs": "12px"
      },
      backdropBlur: {
        glass: "16px",
        "glass-sm": "8px"
      },
      boxShadow: {
        "glass-sm":
          "0 1px 3px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.03), inset 0 1px 0 rgba(255,255,255,0.6)",
        glass:
          "0 4px 16px rgba(0,0,0,0.06), 0 1px 3px rgba(0,0,0,0.04), inset 0 1px 0 rgba(255,255,255,0.7)",
        "glass-lg":
          "0 8px 32px rgba(0,0,0,0.08), 0 2px 8px rgba(0,0,0,0.04), inset 0 1px 0 rgba(255,255,255,0.8)",
        "green-glow": "0 0 20px rgba(108,169,86,0.18)",
        "amber-glow": "0 0 20px rgba(226,178,13,0.18)"
      }
    }
  },
  plugins: []
};

export default config;
