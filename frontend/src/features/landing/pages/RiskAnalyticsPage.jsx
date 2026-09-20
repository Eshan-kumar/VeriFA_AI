export default function RiskAnalyticsPage() {
  return (
    <section className="py-16 md:py-24 px-6 max-w-7xl mx-auto flex-grow w-full mt-16">
      <div className="text-center max-w-3xl mx-auto mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-teal-500/10 text-teal-600 dark:text-teal-400 border border-teal-500/20 mb-3">
          <span>🛰️ Continuous Risk Telemetry</span>
        </div>
        <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-4">
          Real-Time Risk Analytics Dashboard
        </h2>
        <p className="text-slate-600 dark:text-slate-400 text-sm md:text-base">
          Monitor live trust scores, hallucination drift, toxicity index, and jailbreak risk vectors.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Risk Gauge Metric Card */}
        <div className="bg-white dark:bg-[#111827] rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">AI Trust Score</span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/10 text-[#2fae63]">Excellent</span>
            </div>
            <div className="text-center py-6">
              <div className="text-6xl font-black text-slate-900 dark:text-white tracking-tight">98.4%</div>
              <div className="text-xs text-slate-500 dark:text-slate-400 mt-2 font-medium">Composite System Integrity Rating</div>
            </div>
          </div>
          <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800 text-xs">
            <div className="flex justify-between items-center">
              <span className="text-slate-500">Hallucination Index</span>
              <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">1.2% (Low)</span>
            </div>
            <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
              <div className="bg-emerald-500 h-full w-[98.8%]" />
            </div>
            <div className="flex justify-between items-center pt-2">
              <span className="text-slate-500">Prompt Injection Risk</span>
              <span className="font-mono font-bold text-teal-600 dark:text-teal-400">0.1% (Safe)</span>
            </div>
            <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
              <div className="bg-teal-500 h-full w-[99.9%]" />
            </div>
          </div>
        </div>

        {/* Live Event Telemetry Stream */}
        <div className="lg:col-span-2 bg-white dark:bg-[#111827] rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
              <span className="text-sm font-bold text-slate-900 dark:text-white">Live Security Telemetry Stream</span>
            </div>
            <span className="text-xs font-mono text-slate-400">Updated: Just Now</span>
          </div>
          <div className="space-y-3 font-mono text-xs">
            {[
              { time: "13:22:04", event: "Prompt Injection Audit", target: "GPT-4o Endpoint", status: "PASSED", color: "text-emerald-500 bg-emerald-500/10" },
              { time: "13:21:48", event: "PII Redaction Scan", target: "Customer Chatbot API", status: "MASKED", color: "text-teal-500 bg-teal-500/10" },
              { time: "13:21:12", event: "Latency SLA Benchmark", target: "Claude 3.5 Sonnet", status: "142ms OK", color: "text-cyan-500 bg-cyan-500/10" },
              { time: "13:20:30", event: "Toxicity & Bias Inspection", target: "Llama 3 70B Custom", status: "0% Toxicity", color: "text-emerald-500 bg-emerald-500/10" },
            ].map((log, i) => (
              <div key={i} className="p-3 rounded-xl bg-slate-50 dark:bg-[#1f2937]/60 border border-slate-200/60 dark:border-slate-800 flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-3">
                  <span className="text-slate-400">{log.time}</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{log.event}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-slate-500 text-[11px]">{log.target}</span>
                  <span className={`px-2 py-0.5 rounded-md font-bold text-[10px] ${log.color}`}>{log.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
