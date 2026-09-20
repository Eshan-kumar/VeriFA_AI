export default function RiskRadarChart({ axes }) {
  const size = 260
  const center = size / 2
  const maxRadius = center - 34
  const levels = 4 // ring count

  const angleFor = (i) => (Math.PI * 2 * i) / axes.length - Math.PI / 2

  const pointFor = (i, value) => {
    const r = (value / 100) * maxRadius
    const angle = angleFor(i)
    return [center + r * Math.cos(angle), center + r * Math.sin(angle)]
  }

  const polygonPoints = axes.map((a, i) => pointFor(i, a.value).join(",")).join(" ")

  return (
    <div className="bg-[#f9faf9] dark:bg-[#111827] p-4 rounded-xl border border-[#e6e6e2] dark:border-[#374151] flex flex-col items-center">
      <div className="text-[12.5px] font-semibold text-[#1c1c1e] dark:text-gray-200 self-start mb-2 flex items-center gap-1.5">
        🕸️ Risk Profile Radar
      </div>

      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="w-full max-w-[260px] h-auto">
        {/* Background rings */}
        {Array.from({ length: levels }).map((_, ringIdx) => {
          const ringRadius = (maxRadius * (ringIdx + 1)) / levels
          const ringPoints = axes
            .map((_, i) => {
              const angle = angleFor(i)
              return [center + ringRadius * Math.cos(angle), center + ringRadius * Math.sin(angle)].join(",")
            })
            .join(" ")
          return (
            <polygon
              key={ringIdx}
              points={ringPoints}
              fill="none"
              stroke="currentColor"
              className="text-[#e2e2df] dark:text-[#374151]"
              strokeWidth="1"
            />
          )
        })}

        {/* Axis lines */}
        {axes.map((_, i) => {
          const [x, y] = pointFor(i, 100)
          return (
            <line
              key={i}
              x1={center}
              y1={center}
              x2={x}
              y2={y}
              stroke="currentColor"
              className="text-[#e2e2df] dark:text-[#374151]"
              strokeWidth="1"
            />
          )
        })}

        {/* Data polygon */}
        <polygon points={polygonPoints} fill="#2fae63" fillOpacity="0.22" stroke="#2fae63" strokeWidth="2" />
        {axes.map((a, i) => {
          const [x, y] = pointFor(i, a.value)
          return <circle key={i} cx={x} cy={y} r="3" fill="#2fae63" />
        })}

        {/* Axis labels */}
        {axes.map((a, i) => {
          const angle = angleFor(i)
          const labelRadius = maxRadius + 22
          const x = center + labelRadius * Math.cos(angle)
          const y = center + labelRadius * Math.sin(angle)
          return (
            <text
              key={a.label}
              x={x}
              y={y}
              textAnchor="middle"
              dominantBaseline="middle"
              className="fill-[#6b6f76] dark:fill-gray-400"
              fontSize="9.5"
              fontWeight="600"
            >
              {a.label}
            </text>
          )
        })}
      </svg>

      <div className="grid grid-cols-2 gap-x-4 gap-y-1 mt-2 w-full">
        {axes.map((a) => (
          <div key={a.label} className="flex items-center justify-between text-[11px]">
            <span className="text-[#6b6f76] dark:text-gray-400">{a.label}</span>
            <span className="font-mono font-semibold text-[#1c1c1e] dark:text-gray-200">{a.value}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
