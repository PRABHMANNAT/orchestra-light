import type { Metadata } from "next";
import { Bebas_Neue, DM_Mono, Inter } from "next/font/google";
import { Toaster } from "sonner";
import "@xyflow/react/dist/style.css";

import "@/styles/globals.css";

const bebasNeue = Bebas_Neue({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-title"
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-ui"
});

const dmMono = DM_Mono({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--font-mono"
});

export const metadata: Metadata = {
  title: "Orchestra Demo",
  description: "AI project manager for software delivery",
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
    <html lang="en" className={`${bebasNeue.variable} ${inter.variable} ${dmMono.variable}`}>
      <body className="overflow-x-hidden antialiased">
        {children}
        <Toaster
          theme="light"
          style={{ fontFamily: "var(--font-mono)" }}
          toastOptions={{
            style: {
              background: "rgba(255, 255, 255, 0.95)",
              border: "1px solid #e8e8e8",
              color: "#111111",
              fontSize: "11px",
              borderRadius: "12px",
              boxShadow: "0 1px 2px rgba(17,17,17,0.04), 0 12px 32px rgba(17,17,17,0.08)"
            }
          }}
        />
      </body>
    </html>
  );
}
