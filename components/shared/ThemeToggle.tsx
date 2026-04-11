"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Moon, Sun } from "lucide-react";

const STORAGE_KEY = "orchestra_theme";

type Theme = "dark" | "light";

function applyTheme(theme: Theme) {
  document.documentElement.setAttribute("data-theme", theme);
  window.localStorage.setItem(STORAGE_KEY, theme);
  window.dispatchEvent(new CustomEvent("orchestra-theme-change", { detail: theme }));
}

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("dark");

  useEffect(() => {
    const syncTheme = (nextTheme?: Theme) => {
      const rootTheme = nextTheme ?? (document.documentElement.getAttribute("data-theme") as Theme | null) ?? "dark";
      setTheme(rootTheme === "light" ? "light" : "dark");
    };

    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored === "light" || stored === "dark") {
      applyTheme(stored);
      syncTheme(stored);
    } else {
      applyTheme("dark");
      syncTheme("dark");
    }

    const handleThemeChange = (event: Event) => syncTheme((event as CustomEvent<Theme>).detail);
    const handleStorage = (event: StorageEvent) => {
      if (event.key === STORAGE_KEY && (event.newValue === "dark" || event.newValue === "light")) {
        syncTheme(event.newValue);
      }
    };

    window.addEventListener("orchestra-theme-change", handleThemeChange);
    window.addEventListener("storage", handleStorage);

    return () => {
      window.removeEventListener("orchestra-theme-change", handleThemeChange);
      window.removeEventListener("storage", handleStorage);
    };
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    applyTheme(nextTheme);
  };

  const Icon = theme === "dark" ? Moon : Sun;

  return (
    <motion.button
      type="button"
      onClick={toggleTheme}
      whileHover={{ scale: 1.04 }}
      whileTap={{ scale: 0.96 }}
      transition={{ duration: 0.2 }}
      className="flex h-8 w-8 items-center justify-center rounded-sm border"
      style={{
        background: "transparent",
        borderColor: "rgba(255,255,255,0.07)",
        color: "rgba(160,160,192,0.7)",
        transition: "all 0.2s ease"
      }}
      onMouseEnter={(event) => {
        event.currentTarget.style.borderColor = "rgba(0,229,204,0.3)";
        event.currentTarget.style.color = "#00e5cc";
      }}
      onMouseLeave={(event) => {
        event.currentTarget.style.borderColor = "rgba(255,255,255,0.07)";
        event.currentTarget.style.color = "rgba(160,160,192,0.7)";
      }}
      title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
      aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={theme}
          initial={{ rotate: -180, opacity: 0 }}
          animate={{ rotate: 0, opacity: 1 }}
          exit={{ rotate: 180, opacity: 0 }}
          transition={{ duration: 0.22 }}
          className="flex items-center justify-center"
        >
          <Icon size={14} strokeWidth={1.5} />
        </motion.span>
      </AnimatePresence>
    </motion.button>
  );
}
