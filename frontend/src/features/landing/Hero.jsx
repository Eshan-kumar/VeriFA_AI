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
      {/* ── TOP RADIAL AMBIENT GLOW (Removed for Neubrutalism) ── */}

      {/* ── HERO CENTER CONTENT ── */}
      <div className="relative z-10 max-w-[720px] mx-auto px-6 pt-10 md:pt-16 pb-4 text-center flex flex-col items-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1 text-xs font-black bg-neu-primary text-neu-text border-2 border-neu-border shadow-neu mb-6 uppercase">
          <span className="w-2 h-2 bg-neu-text animate-pulse" />
          <span>VERIFA.AI Data Engine 2.0 Released</span>
        </div>

        {/* Headline */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-[66px] font-black tracking-tight leading-[1.08] mb-6 font-sans uppercase text-neu-text">
          <span className="block">
            {headlineLine1}
          </span>
          <span className="block mt-1 text-neu-secondary" style={{ textShadow: '2px 2px 0 #111111' }}>{headlineLine2}</span>
        </h1>

        {/* Subheading */}
        <p className="text-neu-text text-sm sm:text-base md:text-[16px] leading-relaxed max-w-[540px] mb-8 font-bold">
          {subheading}
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 w-full sm:w-auto">
          <button
            onClick={onPrimaryCtaClick}
            className="w-full sm:w-auto px-9 py-4 text-[16px] font-black text-neu-text bg-neu-primary border-[3px] border-neu-border transition-all shadow-neu hover:bg-neu-primary/90 active:translate-x-[2px] active:translate-y-[2px] active:shadow-none cursor-pointer uppercase"
          >
            <span className="flex items-center justify-center gap-2">
              <span>{primaryCtaText}</span>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </span>
          </button>
        </div>
      </div>

      {/* ── FEATURE HIGHLIGHTS GRID ── */}
      <div className="relative z-10 w-full max-w-6xl mx-auto px-6 py-12 md:py-16 grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link to="/model-safety" className="p-6 bg-neu-surface border-[3px] border-neu-border shadow-neu hover:translate-x-[2px] hover:-translate-y-[2px] hover:shadow-neu-hover transition-all group block">
          <div className="w-11 h-11 bg-neu-primary border-2 border-neu-border shadow-neu flex items-center justify-center text-xl mb-4 font-bold group-hover:scale-110 transition-transform text-neu-text">
            🛡️
          </div>
          <h3 className="text-lg font-black text-neu-text mb-2 uppercase">Prompt Safety & Jailbreak Scans</h3>
          <p className="text-sm text-neu-text font-medium leading-relaxed">
            Detect prompt injection vulnerabilities, toxic outputs, and sensitive data leakage in real time.
          </p>
        </Link>

        <Link to="/ai-benchmarks" className="p-6 bg-neu-surface border-[3px] border-neu-border shadow-neu hover:translate-x-[2px] hover:-translate-y-[2px] hover:shadow-neu-hover transition-all group block">
          <div className="w-11 h-11 bg-neu-secondary border-2 border-neu-border shadow-neu flex items-center justify-center text-xl mb-4 font-bold group-hover:scale-110 transition-transform text-neu-text">
            ⚡
          </div>
          <h3 className="text-lg font-black text-neu-text mb-2 uppercase">120K TPS Latency Benchmarks</h3>
          <p className="text-sm text-neu-text font-medium leading-relaxed">
            Measure response latency, token throughput, and model accuracy across OpenAI, Anthropic, Gemini & custom endpoints.
          </p>
        </Link>

        <Link to="/risk-analytics" className="p-6 bg-neu-surface border-[3px] border-neu-border shadow-neu hover:translate-x-[2px] hover:-translate-y-[2px] hover:shadow-neu-hover transition-all group block">
          <div className="w-11 h-11 bg-neu-accent border-2 border-neu-border shadow-neu flex items-center justify-center text-xl mb-4 font-bold group-hover:scale-110 transition-transform text-neu-text">
            🛰️
          </div>
          <h3 className="text-lg font-black text-neu-text mb-2 uppercase">Real-Time Risk Analytics</h3>
          <p className="text-sm text-neu-text font-medium leading-relaxed">
            Access continuous risk score dashboards, confidence ratings, and automated compliance metrics per evaluation session.
          </p>
        </Link>
      </div>
    </div>
  );
}
