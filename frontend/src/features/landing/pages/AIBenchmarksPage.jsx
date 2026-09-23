import { useState } from "react";

const BENCHMARK_DATA = [
  {
    model: "GPT-4o Evaluation",
    provider: "OpenAI",
    latency: "142 ms",
    accuracy: "98.6%",
    safetyScore: "99.4%",
    ttft: "42 ms",
    tps: "128 tps",
    status: "Optimal",
    badgeColor: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
  },
  {
    model: "Claude 3.5 Sonnet",
    provider: "Anthropic",
    latency: "158 ms",
    accuracy: "98.1%",
    safetyScore: "99.8%",
    ttft: "49 ms",
    tps: "115 tps",
    status: "Optimal",
    badgeColor: "bg-teal-500/10 text-teal-600 dark:text-teal-400 border-teal-500/20",
  },
  {
    model: "Llama 3 70B",
    provider: "Meta AI / Open",
    latency: "195 ms",
    accuracy: "95.4%",
    safetyScore: "97.2%",
    ttft: "65 ms",
    tps: "98 tps",
    status: "Verified",
    badgeColor: "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/20",
  },
  {
    model: "Gemini 1.5 Pro",
    provider: "Google AI",
    latency: "148 ms",
    accuracy: "97.9%",
    safetyScore: "98.9%",
    ttft: "44 ms",
    tps: "122 tps",
    status: "Optimal",
    badgeColor: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
  },
];

export default function AIBenchmarksPage() {
  const [activeBenchmarkMetric, setActiveBenchmarkMetric] = useState("all");

  return (
    <section className="py-16 md:py-24 px-6 max-w-7xl mx-auto flex-grow w-full mt-16">
      <div className="text-center max-w-3xl mx-auto mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 text-xs font-black bg-emerald-500/10 text-emerald-600 border-[3px] border-neu-border border-emerald-500/20 mb-3 uppercase">
          <span>⚡ Live Telemetry Benchmarks</span>
        </div>
        <h2 className="text-3xl md:text-4xl font-extrabold text-neu-text tracking-tight mb-4">
          Multi-Model Performance Matrix
        </h2>
        <p className="text-slate-600 text-sm md:text-base">
          Compare latency, accuracy, token throughput, and safety ratings across top AI models in real time.
        </p>
      </div>

      <div className="flex justify-center items-center gap-2 mb-8 flex-wrap">
        {["all", "latency", "accuracy", "safety"].map((filter) => (
          <button
            key={filter}
            onClick={() => setActiveBenchmarkMetric(filter)}
            className={`px-4 py-2 text-xs font-black capitalize transition-all cursor-pointer uppercase ${
              activeBenchmarkMetric === filter
                ? "bg-[#2fae63] text-white shadow-md shadow-emerald-500/20"
                : "bg-white  text-slate-600  border border-slate-200  hover:bg-slate-100 "
            } `}
          >
            {filter === "all" ? "All Metrics" : `${filter} Focus`}
          </button>
        ))}
      </div>

      <div className="bg-neu-surface rounded-3xl border-[3px] border-neu-border overflow-hidden shadow-neu">
        {/* Mobile Card Grid View (< md) */}
        <div className="grid grid-cols-1 gap-3.5 p-4 md:hidden">
          {BENCHMARK_DATA.map((row, idx) => (
            <div key={idx} className="bg-slate-50/80 p-4 border-[3px] border-neu-border border-slate-200/80 space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 font-black text-sm text-neu-text uppercase">
                  <div className="w-2.5 h-2.5 bg-[#2fae63]" />
                  {row.model}
                </div>
                <span className={`px-2.5 py-0.5 text-[11px] font-black border-[3px] border-neu-border uppercase ${row.badgeColor} `}>
                  {row.status}
                </span>
              </div>
              <div className="text-xs text-neu-text/80 font-medium">
                Provider: <span className="text-slate-700">{row.provider}</span>
              </div>
              <div className="grid grid-cols-2 gap-2 pt-1 text-xs font-mono">
                <div className="bg-neu-surface p-2 border-[3px] border-neu-border border-slate-200/60 shadow-neu">
                  <div className="text-[10px] text-neu-text/80 font-sans">Avg Latency</div>
                  <div className="font-black text-emerald-600 uppercase">{row.latency}</div>
                </div>
                <div className="bg-neu-surface p-2 border-[3px] border-neu-border border-slate-200/60 shadow-neu">
                  <div className="text-[10px] text-neu-text/80 font-sans">Accuracy</div>
                  <div className="font-black text-neu-text uppercase">{row.accuracy}</div>
                </div>
                <div className="bg-neu-surface p-2 border-[3px] border-neu-border border-slate-200/60 shadow-neu">
                  <div className="text-[10px] text-neu-text/80 font-sans">Safety Score</div>
                  <div className="font-black text-teal-600 uppercase">{row.safetyScore}</div>
                </div>
                <div className="bg-neu-surface p-2 border-[3px] border-neu-border border-slate-200/60 shadow-neu">
                  <div className="text-[10px] text-neu-text/80 font-sans">TTFT</div>
                  <div className="font-black text-neu-text/80 uppercase">{row.ttft}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Desktop Table View (>= md) */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-700">
            <thead className="bg-neu-surface text-neu-text uppercase text-[11px] tracking-wider border-b-[3px] border-neu-border border-[3px] shadow-neu">
              <tr>
                <th className="px-6 py-4 font-black uppercase">Model Engine</th>
                <th className="px-6 py-4 font-black uppercase">Provider</th>
                <th className="px-6 py-4 font-black uppercase">Avg Latency</th>
                <th className="px-6 py-4 font-black uppercase">Accuracy</th>
                <th className="px-6 py-4 font-black uppercase">Safety Score</th>
                <th className="px-6 py-4 font-black uppercase">TTFT</th>
                <th className="px-6 py-4 font-black uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {BENCHMARK_DATA.map((row, idx) => (
                <tr key={idx} className="transition-colors">
                  <td className="px-6 py-4 font-black text-neu-text flex items-center gap-3 uppercase">
                    <div className="w-2.5 h-2.5 bg-[#2fae63]" />
                    {row.model}
                  </td>
                  <td className="px-6 py-4 text-xs text-neu-text/80 font-medium">{row.provider}</td>
                  <td className="px-6 py-4 font-mono text-emerald-600 font-black uppercase">{row.latency}</td>
                  <td className="px-6 py-4 font-mono font-black uppercase">{row.accuracy}</td>
                  <td className="px-6 py-4 font-mono text-teal-600 font-black uppercase">{row.safetyScore}</td>
                  <td className="px-6 py-4 font-mono text-neu-text/80">{row.ttft}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 text-xs font-black border-[3px] border-neu-border uppercase ${row.badgeColor} `}>
                      {row.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
