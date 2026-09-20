import { useState } from "react";
import { Link } from "react-router-dom";

export default function Hero({
  headlineLine1 = "Data-Driven Model Evaluation.",
  headlineLine2 = "Reliable Metrics & Analytics.",
  subheading = "Gain deep insights into your data with our robust AI analytics engine, providing comprehensive metrics and real-time evaluation data.",
  primaryCtaText = "Get Started Free",
  onPrimaryCtaClick,
}) {
  return (
    <div className="flex-grow flex flex-col justify-center relative w-full overflow-hidden pt-6 pb-12 select-none">
      {/* ── TOP RADIAL AMBIENT GLOW (Emerald / Teal theme) ── */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[550px] bg-[radial-gradient(ellipse_at_top,rgba(47,174,99,0.25)_0%,rgba(20,184,166,0.18)_35%,rgba(11,15,23,0)_75%)] pointer-events-none z-0" />

      {/* ── HERO CENTER CONTENT ── */}
      <div className="relative z-10 max-w-[720px] mx-auto px-6 pt-10 md:pt-16 pb-4 text-center flex flex-col items-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 mb-6">
          <span className="w-2 h-2 rounded-full bg-[#2fae63] animate-pulse" />
          <span>VERIFA.AI Data Engine 2.0 Released</span>
        </div>

        {/* Headline */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-[66px] font-extrabold tracking-tight leading-[1.08] mb-6 font-sans">
          <span className="bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400 bg-clip-text text-transparent block">
            {headlineLine1}
          </span>
          <span className="text-slate-900 dark:text-white block mt-1">{headlineLine2}</span>
        </h1>

        {/* Subheading */}
        <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base md:text-[16px] leading-relaxed max-w-[540px] mb-8 font-normal">
          {subheading}
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 w-full sm:w-auto">
          <button
            onClick={onPrimaryCtaClick}
            className="w-full sm:w-auto px-9 py-4 rounded-full text-[16px] font-semibold text-white bg-[#141414] dark:bg-[#2fae63] hover:bg-black dark:hover:bg-[#1c7c46] transition-all duration-300 relative group cursor-pointer shadow-xl shadow-emerald-500/20 hover:scale-105 active:scale-95"
          >
            <span className="flex items-center justify-center gap-2">
              <span>{primaryCtaText}</span>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </span>
          </button>
        </div>
      </div>

      {/* ── FEATURE HIGHLIGHTS GRID ── */}
      <div className="relative z-10 w-full max-w-6xl mx-auto px-6 py-12 md:py-16 grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link to="/model-safety" className="p-6 rounded-3xl bg-white/80 dark:bg-white/5 border border-slate-200 dark:border-white/10 backdrop-blur-md hover:border-emerald-500/50 shadow-sm transition-all duration-300 group block">
          <div className="w-11 h-11 rounded-2xl bg-emerald-500/10 text-emerald-500 dark:text-emerald-400 flex items-center justify-center text-xl mb-4 font-bold border border-emerald-500/20 group-hover:scale-110 transition-transform">
            🛡️
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Prompt Safety & Jailbreak Scans</h3>
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            Detect prompt injection vulnerabilities, toxic outputs, and sensitive data leakage in real time.
          </p>
        </Link>

        <Link to="/ai-benchmarks" className="p-6 rounded-3xl bg-white/80 dark:bg-white/5 border border-slate-200 dark:border-white/10 backdrop-blur-md hover:border-teal-500/50 shadow-sm transition-all duration-300 group block">
          <div className="w-11 h-11 rounded-2xl bg-teal-500/10 text-teal-500 dark:text-teal-400 flex items-center justify-center text-xl mb-4 font-bold border border-teal-500/20 group-hover:scale-110 transition-transform">
            ⚡
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">120K TPS Latency Benchmarks</h3>
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            Measure response latency, token throughput, and model accuracy across OpenAI, Anthropic, Gemini & custom endpoints.
          </p>
        </Link>

        <Link to="/risk-analytics" className="p-6 rounded-3xl bg-white/80 dark:bg-white/5 border border-slate-200 dark:border-white/10 backdrop-blur-md hover:border-cyan-500/50 shadow-sm transition-all duration-300 group block">
          <div className="w-11 h-11 rounded-2xl bg-cyan-500/10 text-cyan-500 dark:text-cyan-400 flex items-center justify-center text-xl mb-4 font-bold border border-cyan-500/20 group-hover:scale-110 transition-transform">
            🛰️
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Real-Time Risk Analytics</h3>
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            Access continuous risk score dashboards, confidence ratings, and automated compliance metrics per evaluation session.
          </p>
        </Link>
      </div>
    </div>
  );
}
