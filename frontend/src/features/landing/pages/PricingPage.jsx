import { useState } from "react";

export default function PricingPage() {
  const [billingCycle, setBillingCycle] = useState("monthly");

  return (
    <section className="py-16 md:py-24 px-6 max-w-7xl mx-auto flex-grow w-full mt-16">
      <div className="text-center max-w-3xl mx-auto mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 text-xs font-black bg-emerald-500/10 text-emerald-600 border-[3px] border-neu-border border-emerald-500/20 mb-3 uppercase">
          <span>💎 Transparent Plans</span>
        </div>
        <h2 className="text-3xl md:text-4xl font-extrabold text-neu-text tracking-tight mb-4">
          Predictable Pricing for Teams & Developers
        </h2>
        <p className="text-slate-600 text-sm md:text-base mb-6">
          Start for free and scale security evaluations as your chatbot traffic grows.
        </p>

        {/* Billing Cycle Switch */}
        <div className="inline-flex items-center p-1 bg-slate-200 border-[3px] border-neu-border">
          <button
            onClick={() => setBillingCycle("monthly")}
            className={`px-4 py-1.5 text-xs font-black transition-all cursor-pointer uppercase ${
              billingCycle === "monthly" ? "bg-[#2fae63] text-white shadow-sm" : "text-slate-600 "
            } `}
          >
            Monthly Billing
          </button>
          <button
            onClick={() => setBillingCycle("annual")}
            className={`px-4 py-1.5 text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 uppercase ${
              billingCycle === "annual" ? "bg-[#2fae63] text-white shadow-sm" : "text-slate-600 "
            } `}
          >
            <span>Annual Billing</span>
            <span className="px-1.5 py-0.2 text-[10px] bg-amber-400 text-slate-950 font-black uppercase">20% OFF</span>
          </button>
        </div>
      </div>

      {/* Pricing Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
        {/* Card 1: Free */}
        <div className="bg-neu-surface rounded-3xl p-8 border-[3px] border-neu-border flex flex-col justify-between shadow-neu">
          <div>
            <span className="text-xs font-black uppercase tracking-wider text-neu-text/80">Developer</span>
            <h3 className="text-2xl font-extrabold text-neu-text mt-1">Free Tier</h3>
            <div className="my-6">
              <span className="text-4xl font-black text-neu-text">$0</span>
              <span className="text-xs text-neu-text/80 ml-1">/ forever</span>
            </div>
            <ul className="space-y-3 text-sm text-slate-600 mb-8">
              <li className="flex items-center gap-2">
                <span className="text-emerald-500 font-black uppercase">✓</span> 100 Scans / day
              </li>
              <li className="flex items-center gap-2">
                <span className="text-emerald-500 font-black uppercase">✓</span> Basic Latency Benchmark
              </li>
              <li className="flex items-center gap-2">
                <span className="text-emerald-500 font-black uppercase">✓</span> Standard Prompt Safety Check
              </li>
              <li className="flex items-center gap-2">
                <span className="text-emerald-500 font-black uppercase">✓</span> Community Support
              </li>
            </ul>
          </div>
          <button
            className="w-full py-3 font-black text-sm bg-slate-100 text-neu-text transition-colors cursor-pointer uppercase"
          >
            Get Started Free
          </button>
        </div>

        {/* Card 2: Pro (POPULAR) */}
        <div className="bg-neu-surface rounded-3xl p-8 border-2 border-[#2fae63] relative flex flex-col justify-between transform md:-translate-y-2 shadow-neu">
          <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-3 py-1 bg-[#2fae63] text-neu-text text-xs font-extrabold tracking-wider uppercase">
            Most Popular
          </div>
          <div>
            <span className="text-xs font-black uppercase tracking-wider text-[#2fae63]">Pro Evaluator</span>
            <h3 className="text-2xl font-extrabold text-neu-text mt-1">Professional</h3>
            <div className="my-6">
              <span className="text-4xl font-black text-neu-text">
                {billingCycle === "annual" ? "$15" : "$19"}
              </span>
              <span className="text-xs text-neu-text/80 ml-1">/ month</span>
            </div>
            <ul className="space-y-3 text-sm text-slate-600 mb-8">
              <li className="flex items-center gap-2">
                <span className="text-emerald-500 font-black uppercase">✓</span> Unlimited Evaluations
              </li>
              <li className="flex items-center gap-2">
                <span className="text-emerald-500 font-black uppercase">✓</span> Multi-model Benchmarking
              </li>
              <li className="flex items-center gap-2">
                <span className="text-emerald-500 font-black uppercase">✓</span> Real-Time Risk Dashboard
              </li>
              <li className="flex items-center gap-2">
                <span className="text-emerald-500 font-black uppercase">✓</span> Export PDF / CSV Reports
              </li>
              <li className="flex items-center gap-2">
                <span className="text-emerald-500 font-black uppercase">✓</span> Priority Email Support
              </li>
            </ul>
          </div>
          <button
            className="w-full py-3 font-black text-sm text-neu-text bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 transition-all cursor-pointer shadow-emerald-500/20 uppercase"
          >
            Start 7-Day Free Trial
          </button>
        </div>

        {/* Card 3: Enterprise */}
        <div className="bg-neu-surface rounded-3xl p-8 border-[3px] border-neu-border flex flex-col justify-between shadow-neu">
          <div>
            <span className="text-xs font-black uppercase tracking-wider text-neu-text/80">Enterprise</span>
            <h3 className="text-2xl font-extrabold text-neu-text mt-1">Custom Security</h3>
            <div className="my-6">
              <span className="text-4xl font-black text-neu-text">
                {billingCycle === "annual" ? "$79" : "$99"}
              </span>
              <span className="text-xs text-neu-text/80 ml-1">/ month</span>
            </div>
            <ul className="space-y-3 text-sm text-slate-600 mb-8">
              <li className="flex items-center gap-2">
                <span className="text-emerald-500 font-black uppercase">✓</span> Custom Model Endpoints
              </li>
              <li className="flex items-center gap-2">
                <span className="text-emerald-500 font-black uppercase">✓</span> Dedicated Security SLA
              </li>
              <li className="flex items-center gap-2">
                <span className="text-emerald-500 font-black uppercase">✓</span> SOC2 Compliance Exports
              </li>
              <li className="flex items-center gap-2">
                <span className="text-emerald-500 font-black uppercase">✓</span> 24/7 Dedicated Account Rep
              </li>
            </ul>
          </div>
          <button
            className="w-full py-3 font-black text-sm bg-slate-100 text-neu-text transition-colors cursor-pointer uppercase"
          >
            Contact Enterprise Team
          </button>
        </div>
      </div>
    </section>
  );
}
