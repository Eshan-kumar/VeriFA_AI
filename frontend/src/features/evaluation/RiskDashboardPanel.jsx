import { useMemo } from "react"
import { generateRiskSnapshot } from "./riskDashboardData"
import TrustScoreGauge from "./TrustScoreGauge"
import RiskMetricTrendCard from "./RiskMetricTrendCard"
import RiskRadarChart from "./RiskRadarChart"
import RiskHeatmap from "./RiskHeatmap"

export default function RiskDashboardPanel({ show, onClose, activeChatId, activeChatTitle, isNewChat }) {
  // Regenerate only when the active chat changes — keeps numbers stable
  // per chat instead of re-randomizing on every re-render.
  const snapshot = useMemo(() => {
    try {
      return generateRiskSnapshot(activeChatId || "default_chat", isNewChat)
    } catch (e) {
      console.error("Error generating risk snapshot:", e)
      return generateRiskSnapshot("default_chat", isNewChat)
    }
  }, [activeChatId, isNewChat])

  if (!show || !snapshot) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 backdrop-blur-md p-2.5 sm:p-6 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="w-full max-w-[1100px] max-h-[92vh] sm:max-h-[90vh] bg-white dark:bg-[#0f172a] rounded-2xl sm:rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-2xl p-3.5 sm:p-6 overflow-y-auto text-slate-900 dark:text-slate-100 animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 sm:mb-5 gap-3 pb-3 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2 flex-wrap font-semibold text-[14.5px] sm:text-[16px] text-[#1c1c1e] dark:text-gray-100">
            <span className="text-[#2fae63] text-base sm:text-lg">🛰️</span> Real-Time Risk Dashboard
            <span className="text-[11px] font-normal text-[#8e8e93] dark:text-gray-400 bg-[#f4f4f2] dark:bg-[#1f2937] px-2 py-0.5 rounded-full font-mono truncate max-w-[150px] sm:max-w-none">
              {activeChatTitle || "Untitled Chat"}
            </span>
            <span className="flex items-center gap-1 text-[10.5px] sm:text-[11px] font-medium px-2 py-0.5 rounded-full bg-[#edf7f1] dark:bg-emerald-950/80 text-[#1c7c46] dark:text-emerald-400">
              <span className="w-1.5 h-1.5 rounded-full bg-[#2fae63] animate-pulse" /> Live Metrics
            </span>
          </div>
          <div className="flex items-center gap-2 self-end sm:self-auto">
            <button
              onClick={onClose}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11.5px] sm:text-[12.5px] font-semibold text-[#1c7c46] dark:text-emerald-400 bg-[#edf7f1] hover:bg-[#dff0e5] dark:bg-emerald-950/60 dark:hover:bg-emerald-900/60 border border-emerald-500/20 transition-all cursor-pointer shadow-xs"
              title="Return to Chat Evaluation Thread"
            >
              <span>← Return</span>
            </button>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full flex items-center justify-center text-[#6b6f76] dark:text-gray-400 hover:text-[#1c1c1e] dark:hover:text-white hover:bg-slate-200/50 dark:hover:bg-slate-800 transition-colors border-none bg-transparent cursor-pointer"
              title="Close Dashboard"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Top row: Trust score + metric trend cards */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 mb-4">
          <div className="lg:col-span-1">
            <TrustScoreGauge score={snapshot.trustScore || 85} label={snapshot.trustLabel || "Good"} />
          </div>
          <div className="lg:col-span-4 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
            {(snapshot.metrics || []).map((metric) => (
              <RiskMetricTrendCard key={metric.key} metric={metric} />
            ))}
          </div>
        </div>

        {/* Bottom row: Radar + Heatmap */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {snapshot.radar && <RiskRadarChart axes={snapshot.radar} />}
          {snapshot.heatmap && <RiskHeatmap heatmap={snapshot.heatmap} days={snapshot.heatmapDays || []} />}
        </div>

        <div className="text-[11px] text-[#8e8e93] dark:text-gray-500 text-center mt-5 pt-3 border-t border-slate-100 dark:border-slate-800/60">
          Showcase dashboard — figures are simulated per chat session for demo purposes, not live model measurements.
        </div>
      </div>
    </div>
  )
}
