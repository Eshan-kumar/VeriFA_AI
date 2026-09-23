export default function RiskAnalyticsPage() {
  return (
    <section className="py-16 md:py-24 px-6 max-w-7xl mx-auto flex-grow w-full mt-16">
      <div className="text-center max-w-3xl mx-auto mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 text-xs font-black bg-teal-500/10 text-teal-600 border-[3px] border-neu-border border-teal-500/20 mb-3 uppercase">
          <span>🛰️ Continuous Risk Telemetry</span>
        </div>
        <h2 className="text-3xl md:text-4xl font-extrabold text-neu-text tracking-tight mb-4">
          Real-Time Risk Analytics Dashboard
        </h2>
        <p className="text-slate-600 text-sm md:text-base">
          Monitor live trust scores, hallucination drift, toxicity index, and jailbreak risk vectors.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Risk Gauge Metric Card */}
        <div className="bg-neu-surface rounded-3xl p-6 border-[3px] border-neu-border flex flex-col justify-between shadow-neu">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-black uppercase tracking-wider text-neu-text/80">AI Trust Score</span>
              <span className="px-2.5 py-0.5 text-xs font-black bg-emerald-500/10 text-[#2fae63] uppercase">Excellent</span>
            </div>
            <div className="text-center py-6">
              <div className="text-6xl font-black text-neu-text tracking-tight">98.4%</div>
              <div className="text-xs text-neu-text/80 mt-2 font-medium">Composite System Integrity Rating</div>
            </div>
          </div>
          <div className="space-y-3 pt-4 border-t-[3px] border-neu-border border-slate-100 text-xs">
            <div className="flex justify-between items-center">
              <span className="text-neu-text/80">Hallucination Index</span>
              <span className="font-mono font-black text-emerald-600 uppercase">1.2% (Low)</span>
            </div>
            <div className="w-full bg-slate-100 h-2 overflow-hidden">
              <div className="bg-emerald-500 h-full w-[98.8%]" />
            </div>
            <div className="flex justify-between items-center pt-2">
              <span className="text-neu-text/80">Prompt Injection Risk</span>
              <span className="font-mono font-black text-teal-600 uppercase">0.1% (Safe)</span>
            </div>
            <div className="w-full bg-slate-100 h-2 overflow-hidden">
              <div className="bg-teal-500 h-full w-[99.9%]" />
            </div>
          </div>
        </div>

        {/* Live Event Telemetry Stream */}
        <div className="lg:col-span-2 bg-neu-surface rounded-3xl p-6 border-[3px] border-neu-border shadow-neu">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 bg-emerald-500 animate-ping" />
              <span className="text-sm font-black text-neu-text uppercase">Live Security Telemetry Stream</span>
            </div>
            <span className="text-xs font-mono text-neu-text/80">Updated: Just Now</span>
          </div>
          <div className="space-y-3 font-mono text-xs">
            {[
              { time: "13:22:04", event: "Prompt Injection Audit", target: "GPT-4o Endpoint", status: "PASSED", color: "text-emerald-500 bg-emerald-500/10" },
              { time: "13:21:48", event: "PII Redaction Scan", target: "Customer Chatbot API", status: "MASKED", color: "text-teal-500 bg-teal-500/10" },
              { time: "13:21:12", event: "Latency SLA Benchmark", target: "Claude 3.5 Sonnet", status: "142ms OK", color: "text-cyan-500 bg-cyan-500/10" },
              { time: "13:20:30", event: "Toxicity & Bias Inspection", target: "Llama 3 70B Custom", status: "0% Toxicity", color: "text-emerald-500 bg-emerald-500/10" },
            ].map((log, i) => (
              <div key={i} className="p-3 bg-neu-surface border-[3px] border-neu-border border-slate-200/60 flex items-center justify-between flex-wrap gap-2 shadow-neu">
                <div className="flex items-center gap-3">
                  <span className="text-neu-text/80">{log.time}</span>
                  <span className="font-black text-neu-text uppercase">{log.event}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-neu-text/80 text-[11px]">{log.target}</span>
                  <span className={`px-2 py-0.5 font-black text-[10px] uppercase ${log.color} `}>{log.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
