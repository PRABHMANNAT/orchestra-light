import type { Metadata } from "next";
import { Bebas_Neue, DM_Mono, Syne } from "next/font/google";
import { Toaster } from "sonner";
import "@xyflow/react/dist/style.css";

import "@/styles/globals.css";

const themeInitScript = `
(() => {
  try {
    const storageKey = "orchestra_theme";
    const storedTheme = window.localStorage.getItem(storageKey);
    const theme = storedTheme === "light" || storedTheme === "dark" ? storedTheme : "dark";
    document.documentElement.setAttribute("data-theme", theme);
    if (!storedTheme) {
      window.localStorage.setItem(storageKey, theme);
    }
  } catch {
    document.documentElement.setAttribute("data-theme", "dark");
  }
})();
`;

const bebasNeue = Bebas_Neue({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-display"
});

const syne = Syne({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-ui"
});

const dmMono = DM_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono"
});

export const metadata: Metadata = {
  title: "Orchestra Demo",
  description: "Tempest AI Creator Marketplace V1 delivery workspace",
  icons: {
    icon: [{ url: "/orchestra-icon.svg", type: "image/svg+xml" }],
    shortcut: [{ url: "/orchestra-icon.svg", type: "image/svg+xml" }],
    apple: [{ url: "/orchestra-icon.svg", type: "image/svg+xml" }]
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      data-theme="dark"
      suppressHydrationWarning
      className={`${bebasNeue.variable} ${syne.variable} ${dmMono.variable}`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="main-bg">
        <div className="grain-overlay" />
        <div className="vignette" />
        <div className="scanlines" />
        {children}
        <Toaster
          theme="dark"
          style={{ fontFamily: "var(--font-mono)" }}
          toastOptions={{
            style: {
              background: "rgba(14,14,22,0.88)",
              border: "1px solid rgba(255,255,255,0.08)",
              color: "var(--color-text-primary)",
              fontSize: "11px",
              borderRadius: "8px",
              boxShadow: "0 24px 80px rgba(0,0,0,0.55)"
            }
          }}
        />
      </body>
    </html>
  );
}
