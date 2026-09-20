// Small inline sparkline (no chart library dependency)
function Sparkline({ points, color }) {
  const width = 160
  const height = 40
  const min = Math.min(...points)
  const max = Math.max(...points)
  const range = max - min || 1

  const coords = points.map((p, i) => {
    const x = (i / (points.length - 1)) * width
    const y = height - ((p - min) / range) * height
    return [x, y]
  })

  const linePath = coords.map(([x, y], i) => `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`).join(" ")
  const areaPath = `${linePath} L${width},${height} L0,${height} Z`

  return (
    <svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none">
      <path d={areaPath} fill={color} opacity="0.12" />
      <path d={linePath} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={coords[coords.length - 1][0]} cy={coords[coords.length - 1][1]} r="3" fill={color} />
    </svg>
  )
}

export default function RiskMetricTrendCard({ metric }) {
  const { label, value, unit, trend, delta, goodDirection, color } = metric

  // "Good" if the trend moved in the direction that's favorable for this metric
  const improving = goodDirection === "up" ? delta >= 0 : delta <= 0
  const deltaDisplay = `${delta > 0 ? "+" : ""}${delta}${unit}`

  return (
    <div className="bg-[#f9faf9] dark:bg-[#111827] p-3.5 rounded-xl border border-[#e6e6e2] dark:border-[#374151] flex flex-col">
      <div className="flex justify-between items-start mb-1">
        <span className="text-[12.5px] font-semibold text-[#1c1c1e] dark:text-gray-200">{label}</span>
        <span
          className={[
            "text-[10.5px] font-mono font-semibold px-1.5 py-0.5 rounded-full",
            improving
              ? "text-[#1c7c46] bg-[#edf7f1] dark:text-emerald-400 dark:bg-emerald-950/60"
              : "text-[#b91c1c] bg-[#fdeded] dark:text-red-400 dark:bg-red-950/40",
          ].join(" ")}
        >
          {deltaDisplay}
        </span>
      </div>

      <div className="text-[24px] font-bold text-[#1c1c1e] dark:text-gray-100 leading-tight mb-2">
        {value}
        <span className="text-[13px] font-medium text-[#8e8e93] dark:text-gray-400">{unit}</span>
      </div>

      <div className="mt-auto">
        <Sparkline points={trend} color={color} />
      </div>

      <div className="flex justify-between text-[10.5px] text-[#8e8e93] dark:text-gray-400 mt-1">
        <span>12 runs ago</span>
        <span>Now</span>
      </div>
    </div>
  )
}
