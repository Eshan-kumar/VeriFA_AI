export default function TrustScoreGauge({ score = 0, label = "Fair" }) {
  const radius = 54
  const stroke = 10
  const circumference = 2 * Math.PI * radius
  const progress = circumference * (1 - score / 100)

  const color =
    score >= 90 ? "#2fae63" : score >= 75 ? "#22c55e" : score >= 60 ? "#f59e0b" : "#ef4444"

  return (
    <div className="flex flex-col items-center justify-center bg-[#f9faf9] dark:bg-[#111827] border border-[#e6e6e2] dark:border-[#374151] rounded-2xl p-4 h-full">
      <div className="text-[12.5px] font-semibold text-[#1c1c1e] dark:text-gray-200 mb-2 self-start flex items-center gap-1.5">
        🛡️ Overall AI Trust Score
      </div>

      <div className="relative w-35 h-35">
        <svg width="140" height="140" viewBox="0 0 140 140" className="-rotate-90">
          <circle
            cx="70"
            cy="70"
            r={radius}
            fill="none"
            stroke="currentColor"
            className="text-[#e6e6e2] dark:text-[#374151]"
            strokeWidth={stroke}
          />
          <circle
            cx="70"
            cy="70"
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={progress}
            style={{ transition: "stroke-dashoffset 0.6s ease, stroke 0.6s ease" }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-[30px] font-bold text-[#1c1c1e] dark:text-gray-100 leading-none">{score}</span>
          <span className="text-[11px] text-[#8e8e93] dark:text-gray-400 mt-0.5">/ 100</span>
        </div>
      </div>

      <span
        className="mt-3 text-[12px] font-semibold px-2.5 py-1 rounded-full"
        style={{ color, backgroundColor: `${color}1a` }}
      >
        {label}
      </span>
    </div>
  )
}
