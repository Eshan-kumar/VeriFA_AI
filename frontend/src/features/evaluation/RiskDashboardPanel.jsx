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
        className="w-full max-w-[1100px] max-h-[92vh] sm:max-h-[90vh] bg-neu-surface sm:rounded-3xl border-[3px] border-neu-border border-slate-200/80 p-3.5 sm:p-6 overflow-y-auto text-neu-text animate-in zoom-in-95 duration-200 shadow-neu"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 sm:mb-5 gap-3 pb-3 border-b-[3px] border-neu-border">
          <div className="flex items-center gap-2 flex-wrap font-black text-[14.5px] sm:text-[16px] text-[#1c1c1e] uppercase">
            <span className="text-[#2fae63] text-base sm:text-lg">🛰️</span> Real-Time Risk Dashboard
            <span className="text-[11px] font-normal text-[#8e8e93] bg-[#f4f4f2] px-2 py-0.5 font-mono truncate max-w-[150px] sm:max-w-none">
              {activeChatTitle || "Untitled Chat"}
            </span>
            <span className="flex items-center gap-1 text-[10.5px] sm:text-[11px] font-medium px-2 py-0.5 bg-[#edf7f1] text-[#1c7c46]">
              <span className="w-1.5 h-1.5 bg-[#2fae63] animate-pulse" /> Live Metrics
            </span>
          </div>
          <div className="flex items-center gap-2 self-end sm:self-auto">
            <button
              onClick={onClose}
              className="flex items-center gap-1.5 px-3 py-1.5 text-[11.5px] sm:text-[12.5px] font-black text-[#1c7c46] bg-[#edf7f1] hover:bg-[#dff0e5] border-[3px] border-neu-border border-emerald-500/20 transition-all cursor-pointer shadow-xs uppercase"
              title="Return to Chat Evaluation Thread"
            >
              <span>← Return</span>
            </button>
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center text-[#6b6f76] hover:text-[#1c1c1e] transition-colors border-none bg-transparent cursor-pointer"
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

        <div className="text-[11px] text-[#8e8e93] text-center mt-5 pt-3 border-t-[3px] border-neu-border border-slate-100">
          Showcase dashboard — figures are simulated per chat session for demo purposes, not live model measurements.
        </div>
      </div>
    </div>
  )
}
