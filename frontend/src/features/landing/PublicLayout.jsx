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
  darkMode = true,
  onToggleDarkMode,
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className={`flex flex-col min-h-screen font-sans transition-colors duration-300 ${darkMode ? "dark bg-[#0b0f17] text-white" : "bg-[#f8faf9] text-slate-900"}`}>
      
      {/* ── TOP NAVBAR ── */}
      <nav className="relative z-20 w-full max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Brand logo wordmark */}
        <Link to="/" className="flex items-center gap-3 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#2fae63] to-[#1c7c46] flex items-center justify-center text-white font-black text-lg shadow-md shadow-emerald-500/20">
            V
          </div>
          <span className="font-extrabold text-2xl tracking-tight text-slate-900 dark:text-white font-sans drop-shadow-xs">
            {brandName}
          </span>
        </Link>

        {/* Desktop Nav Links */}
        <div className="hidden md:flex items-center gap-7">
          {navLinks.map((link, idx) => (
            <Link
              key={idx}
              to={link.path}
              className="text-[14px] text-slate-600 dark:text-slate-300 hover:text-[#2fae63] dark:hover:text-emerald-400 font-semibold transition-colors duration-200"
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
                className="w-8.5 h-8.5 rounded-full border border-slate-300 dark:border-white/20 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:text-[#2fae63] dark:hover:text-white hover:border-[#2fae63] dark:hover:border-white/60 hover:bg-emerald-50 dark:hover:bg-white/5 transition-all duration-200"
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

          {/* Smooth Animated Theme Toggle Slider */}
          {onToggleDarkMode && (
            <button
              type="button"
              onClick={onToggleDarkMode}
              className={[
                "relative inline-flex h-8 w-14 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-300 ease-in-out focus:outline-none shadow-inner items-center",
                darkMode ? "bg-[#2fae63]" : "bg-slate-300 dark:bg-slate-700",
              ].join(" ")}
              title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              <span className="sr-only">Toggle theme</span>
              <span
                className={[
                  "pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow-md ring-0 transition duration-300 ease-in-out flex items-center justify-center text-[11px]",
                  darkMode ? "translate-x-6 bg-slate-900 text-amber-300" : "translate-x-0 bg-white text-amber-500",
                ].join(" ")}
              >
                {darkMode ? "🌙" : "☀️"}
              </span>
            </button>
          )}

          <button
            onClick={onLoginClick}
            className="px-4.5 py-1.5 rounded-full text-[13.5px] font-semibold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 transition-all cursor-pointer shadow-md shadow-emerald-500/20"
          >
            Sign In
          </button>
        </div>

        {/* Mobile Hamburger Toggle */}
        <div className="flex items-center gap-2 md:hidden">
          {onToggleDarkMode && (
            <button
              onClick={onToggleDarkMode}
              className="w-9 h-9 rounded-xl bg-slate-200 dark:bg-white/10 flex items-center justify-center text-slate-800 dark:text-white border border-slate-300 dark:border-white/20 text-xs"
            >
              {darkMode ? "🌙" : "☀️"}
            </button>
          )}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="w-10 h-10 rounded-xl bg-slate-200 dark:bg-white/10 flex items-center justify-center text-slate-800 dark:text-white border border-slate-300 dark:border-white/20"
          >
            {mobileMenuOpen ? "✕" : "☰"}
          </button>
        </div>
      </nav>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden relative z-30 bg-white/95 dark:bg-[#0a0a0d]/95 backdrop-blur-md border-b border-slate-200 dark:border-white/10 px-6 py-4 flex flex-col gap-4 animate-in slide-in-from-top-2">
          {navLinks.map((link, idx) => (
            <Link
              key={idx}
              to={link.path}
              onClick={() => setMobileMenuOpen(false)}
              className="text-base text-slate-800 dark:text-slate-200 hover:text-[#2fae63] py-1 font-semibold"
            >
              {link.name}
            </Link>
          ))}
          <div className="flex gap-3 pt-2 border-t border-slate-200 dark:border-white/10">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                if (onLoginClick) onLoginClick();
              }}
              className="w-full py-2 rounded-xl text-sm font-semibold text-white bg-[#2fae63]"
            >
              Sign In
            </button>
          </div>
        </div>
      )}

      {/* ── PAGE CONTENT ── */}
      <Outlet />

      {/* ── FOOTER ── */}
      <footer className="py-12 px-6 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0b0f17] text-xs text-slate-500 dark:text-slate-400 mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-[#2fae63] text-white flex items-center justify-center font-bold text-sm">
              V
            </div>
            <span className="font-extrabold text-sm text-slate-900 dark:text-white tracking-tight">{brandName}</span>
            <span>© {new Date().getFullYear()} All rights reserved.</span>
          </div>

          <div className="flex items-center gap-6">
            <Link to="/ai-benchmarks" className="hover:text-emerald-500 transition-colors">Benchmarks</Link>
            <Link to="/risk-analytics" className="hover:text-emerald-500 transition-colors">Risk Telemetry</Link>
            <Link to="/model-safety" className="hover:text-emerald-500 transition-colors">Safety Shield</Link>
            <Link to="/api-docs" className="hover:text-emerald-500 transition-colors">API Docs</Link>
            <Link to="/pricing" className="hover:text-emerald-500 transition-colors">Pricing</Link>
          </div>

          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-semibold text-slate-700 dark:text-slate-300">All Security Systems Operational</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
