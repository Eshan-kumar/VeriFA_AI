import { useState } from "react";
import { Link, Outlet } from "react-router-dom";

export default function PublicLayout({
  brandName = "VERIFA.AI",
  navLinks = [
    { name: "AI Benchmarks", path: "/ai-benchmarks" },
    { name: "Risk Analytics", path: "/risk-analytics" },
    { name: "Model Safety", path: "/model-safety" },
    { name: "API Docs", path: "/api-docs" },
    { name: "Pricing", path: "/pricing" }
  ],
  socialLinks = [
    { name: "GitHub", href: "https://github.com", icon: "github" },
    { name: "Discord", href: "https://discord.com", icon: "discord" },
    { name: "Reddit", href: "https://reddit.com", icon: "reddit" },
    { name: "X", href: "https://x.com", icon: "twitter" },
  ],
  onLoginClick,
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className={`flex flex-col min-h-screen font-sans transition-colors duration-300 bg-neu-bg text-neu-text`}>
      
      {/* ── TOP NAVBAR ── */}
      <nav className="relative z-20 w-full max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Brand logo wordmark */}
        <Link to="/" className="flex items-center gap-3 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
          <div className="w-9 h-9 bg-neu-primary border-2 border-neu-border flex items-center justify-center text-neu-text font-black text-lg shadow-neu">
            V
          </div>
          <span className="font-black text-2xl tracking-tight text-neu-text font-sans uppercase">
            {brandName}
          </span>
        </Link>

        {/* Desktop Nav Links */}
        <div className="hidden md:flex items-center gap-7">
          {navLinks.map((link, idx) => (
            <Link
              key={idx}
              to={link.path}
              className="text-[14px] text-neu-text hover:text-neu-secondary font-black transition-colors duration-200 uppercase"
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* Social Icons, Theme Toggle & Sign In (Right) */}
        <div className="hidden md:flex items-center gap-4">
          <div className="flex items-center gap-2">
            {socialLinks.map((s, idx) => (
              <a
                key={idx}
                href={s.href}
                target="_blank"
                rel="noreferrer"
                aria-label={s.name}
                className="w-8 h-8 border-2 border-neu-border bg-neu-surface shadow-neu flex items-center justify-center text-neu-text hover:bg-neu-secondary hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none transition-all duration-200"
              >
                {s.icon === "github" && (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
                    <path d="M9 18c-4.51 2-5-2-7-2" />
                  </svg>
                )}
                {s.icon === "discord" && (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <path d="M18 6h0a14.5 14.5 0 0 0-4-1.25 1 1 0 0 0-1 .5A10 10 0 0 0 12 7a10 10 0 0 0-1-.75 1 1 0 0 0-1-.5A14.5 14.5 0 0 0 6 6a15.8 15.8 0 0 0-3 10.5 14.6 14.6 0 0 0 4.5 2.25 1 1 0 0 0 1.1-.4 10.3 10.3 0 0 0 1-1.6 1 1 0 0 0-.5-1.3 9.6 9.6 0 0 1-1.3-.6 1 1 0 0 1-.1-1.6c.1-.1.2-.2.3-.2a11.5 11.5 0 0 0 9.8 0c.1 0 .2.1.3.2a1 1 0 0 1-.1 1.6 9.6 9.6 0 0 1-1.3.6 1 1 0 0 0-.5 1.3c.3.6.6 1.1 1 1.6a1 1 0 0 0 1.1.4 14.6 14.6 0 0 0 4.5-2.25A15.8 15.8 0 0 0 18 6z" />
                  </svg>
                )}
                {s.icon === "reddit" && (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <circle cx="12" cy="12" r="9" />
                    <path d="M12 8a2.5 2.5 0 0 1 2.5 2.5v.5" />
                    <circle cx="9" cy="13" r="1" fill="currentColor" />
                    <circle cx="15" cy="13" r="1" fill="currentColor" />
                  </svg>
                )}
                {s.icon === "twitter" && (
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <path d="M4 4l11.733 16h4.267l-11.733-16z" />
                    <path d="M4 20l6.768-6.768m2.46-2.46L20 4" />
                  </svg>
                )}
              </a>
            ))}
          </div>



          <button
            onClick={onLoginClick}
            className="px-4.5 py-1.5 text-[13.5px] font-black text-neu-text bg-neu-accent border-2 border-neu-border shadow-neu hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none transition-all cursor-pointer uppercase"
          >
            Sign In
          </button>
        </div>

        {/* Mobile Hamburger Toggle */}
        <div className="flex items-center gap-2 md:hidden">

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="w-10 h-10 bg-neu-surface flex items-center justify-center text-neu-text border-2 border-neu-border shadow-neu font-black"
          >
            {mobileMenuOpen ? "✕" : "☰"}
          </button>
        </div>
      </nav>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden relative z-30 bg-neu-surface border-b-[3px] border-neu-border px-6 py-4 flex flex-col gap-4 animate-in slide-in-from-top-2">
          {navLinks.map((link, idx) => (
            <Link
              key={idx}
              to={link.path}
              onClick={() => setMobileMenuOpen(false)}
              className="text-base text-neu-text hover:text-neu-secondary py-1 font-black uppercase"
            >
              {link.name}
            </Link>
          ))}
          <div className="flex gap-3 pt-2 border-t-[3px] border-neu-border">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                if (onLoginClick) onLoginClick();
              }}
              className="w-full py-2 text-sm font-black text-neu-text bg-neu-accent border-2 border-neu-border shadow-neu hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none uppercase"
            >
              Sign In
            </button>
          </div>
        </div>
      )}

      {/* ── PAGE CONTENT ── */}
      <Outlet />

      {/* ── FOOTER ── */}
      <footer className="py-12 px-6 border-t-[3px] border-neu-border bg-neu-surface text-xs text-neu-text font-bold mt-auto uppercase">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 bg-neu-primary border-2 border-neu-border text-neu-text flex items-center justify-center font-black text-sm shadow-neu">
              V
            </div>
            <span className="font-black text-sm text-neu-text tracking-tight uppercase">{brandName}</span>
            <span>© {new Date().getFullYear()} All rights reserved.</span>
          </div>

          <div className="flex items-center gap-6">
            <Link to="/ai-benchmarks" className="hover:text-neu-secondary transition-colors">Benchmarks</Link>
            <Link to="/risk-analytics" className="hover:text-neu-secondary transition-colors">Risk Telemetry</Link>
            <Link to="/model-safety" className="hover:text-neu-secondary transition-colors">Safety Shield</Link>
            <Link to="/api-docs" className="hover:text-neu-secondary transition-colors">API Docs</Link>
            <Link to="/pricing" className="hover:text-neu-secondary transition-colors">Pricing</Link>
          </div>

          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-neu-secondary border border-neu-border animate-pulse" />
            <span className="font-black text-neu-text">All Security Systems Operational</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
