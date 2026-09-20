import { useState } from "react";

export default function PricingPage() {
  const [billingCycle, setBillingCycle] = useState("monthly");

  return (
    <section className="py-16 md:py-24 px-6 max-w-7xl mx-auto flex-grow w-full mt-16">
      <div className="text-center max-w-3xl mx-auto mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 mb-3">
          <span>💎 Transparent Plans</span>
        </div>
        <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-4">
          Predictable Pricing for Teams & Developers
        </h2>
        <p className="text-slate-600 dark:text-slate-400 text-sm md:text-base mb-6">
          Start for free and scale security evaluations as your chatbot traffic grows.
        </p>

        {/* Billing Cycle Switch */}
        <div className="inline-flex items-center p-1 rounded-full bg-slate-200 dark:bg-white/10 border border-slate-300 dark:border-white/10">
          <button
            onClick={() => setBillingCycle("monthly")}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
              billingCycle === "monthly" ? "bg-[#2fae63] text-white shadow-sm" : "text-slate-600 dark:text-slate-300"
            }`}
          >
            Monthly Billing
          </button>
          <button
            onClick={() => setBillingCycle("annual")}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
              billingCycle === "annual" ? "bg-[#2fae63] text-white shadow-sm" : "text-slate-600 dark:text-slate-300"
            }`}
          >
            <span>Annual Billing</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-amber-400 text-slate-950 font-bold">20% OFF</span>
          </button>
        </div>
      </div>

      {/* Pricing Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
        {/* Card 1: Free */}
        <div className="bg-white dark:bg-[#111827] rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-lg flex flex-col justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Developer</span>
            <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">Free Tier</h3>
            <div className="my-6">
              <span className="text-4xl font-black text-slate-900 dark:text-white">$0</span>
              <span className="text-xs text-slate-500 ml-1">/ forever</span>
            </div>
            <ul className="space-y-3 text-sm text-slate-600 dark:text-slate-300 mb-8">
              <li className="flex items-center gap-2">
                <span className="text-emerald-500 font-bold">✓</span> 100 Scans / day
              </li>
              <li className="flex items-center gap-2">
                <span className="text-emerald-500 font-bold">✓</span> Basic Latency Benchmark
              </li>
              <li className="flex items-center gap-2">
                <span className="text-emerald-500 font-bold">✓</span> Standard Prompt Safety Check
              </li>
              <li className="flex items-center gap-2">
                <span className="text-emerald-500 font-bold">✓</span> Community Support
              </li>
            </ul>
          </div>
          <button
            className="w-full py-3 rounded-xl font-semibold text-sm bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer"
          >
            Get Started Free
          </button>
        </div>

        {/* Card 2: Pro (POPULAR) */}
        <div className="bg-white dark:bg-[#111827] rounded-3xl p-8 border-2 border-[#2fae63] shadow-2xl relative flex flex-col justify-between transform md:-translate-y-2">
          <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-[#2fae63] text-white text-xs font-extrabold tracking-wider uppercase shadow-md">
            Most Popular
          </div>
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#2fae63]">Pro Evaluator</span>
            <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">Professional</h3>
            <div className="my-6">
              <span className="text-4xl font-black text-slate-900 dark:text-white">
                {billingCycle === "annual" ? "$15" : "$19"}
              </span>
              <span className="text-xs text-slate-500 ml-1">/ month</span>
            </div>
            <ul className="space-y-3 text-sm text-slate-600 dark:text-slate-300 mb-8">
              <li className="flex items-center gap-2">
                <span className="text-emerald-500 font-bold">✓</span> Unlimited Evaluations
              </li>
              <li className="flex items-center gap-2">
                <span className="text-emerald-500 font-bold">✓</span> Multi-model Benchmarking
              </li>
              <li className="flex items-center gap-2">
                <span className="text-emerald-500 font-bold">✓</span> Real-Time Risk Dashboard
              </li>
              <li className="flex items-center gap-2">
                <span className="text-emerald-500 font-bold">✓</span> Export PDF / CSV Reports
              </li>
              <li className="flex items-center gap-2">
                <span className="text-emerald-500 font-bold">✓</span> Priority Email Support
              </li>
            </ul>
          </div>
          <button
            className="w-full py-3 rounded-xl font-semibold text-sm text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 transition-all cursor-pointer shadow-lg shadow-emerald-500/20"
          >
            Start 7-Day Free Trial
          </button>
        </div>

        {/* Card 3: Enterprise */}
        <div className="bg-white dark:bg-[#111827] rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-lg flex flex-col justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Enterprise</span>
            <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">Custom Security</h3>
            <div className="my-6">
              <span className="text-4xl font-black text-slate-900 dark:text-white">
                {billingCycle === "annual" ? "$79" : "$99"}
              </span>
              <span className="text-xs text-slate-500 ml-1">/ month</span>
            </div>
            <ul className="space-y-3 text-sm text-slate-600 dark:text-slate-300 mb-8">
              <li className="flex items-center gap-2">
                <span className="text-emerald-500 font-bold">✓</span> Custom Model Endpoints
              </li>
              <li className="flex items-center gap-2">
                <span className="text-emerald-500 font-bold">✓</span> Dedicated Security SLA
              </li>
              <li className="flex items-center gap-2">
                <span className="text-emerald-500 font-bold">✓</span> SOC2 Compliance Exports
              </li>
              <li className="flex items-center gap-2">
                <span className="text-emerald-500 font-bold">✓</span> 24/7 Dedicated Account Rep
              </li>
            </ul>
          </div>
          <button
            className="w-full py-3 rounded-xl font-semibold text-sm bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer"
          >
            Contact Enterprise Team
          </button>
        </div>
      </div>
    </section>
  );
}
