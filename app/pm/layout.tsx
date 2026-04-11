export default function PmRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="main-bg relative min-h-screen bg-page text-text-primary">
      <div className="grain-overlay" />
      <div className="vignette" />
      <div className="scanlines" />
      <div className="relative z-10 min-h-screen">{children}</div>
    </div>
  );
}
