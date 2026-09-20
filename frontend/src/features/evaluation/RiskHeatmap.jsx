function cellColor(value) {
  // 0 = safe (green) -> 100 = high risk (red)
  if (value < 20) return { bg: "#2fae6326", text: "#1c7c46" }
  if (value < 40) return { bg: "#a3e63526", text: "#65a30d" }
  if (value < 60) return { bg: "#f59e0b26", text: "#b45309" }
  if (value < 80) return { bg: "#f9731626", text: "#c2410c" }
  return { bg: "#ef444426", text: "#b91c1c" }
}

export default function RiskHeatmap({ heatmap, days }) {
  return (
    <div className="bg-[#f9faf9] dark:bg-[#111827] p-4 rounded-xl border border-[#e6e6e2] dark:border-[#374151]">
      <div className="text-[12.5px] font-semibold text-[#1c1c1e] dark:text-gray-200 mb-3 flex items-center gap-1.5">
        🔥 7-Day Risk Heatmap
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-separate" style={{ borderSpacing: "4px" }}>
          <thead>
            <tr>
              <th className="text-[10.5px] text-left text-[#8e8e93] dark:text-gray-400 font-medium pr-2 pb-1">Category</th>
              {days.map((d) => (
                <th key={d} className="text-[10.5px] text-[#8e8e93] dark:text-gray-400 font-medium pb-1 w-10">
                  {d}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {heatmap.map((row) => (
              <tr key={row.category}>
                <td className="text-[11.5px] font-medium text-[#1c1c1e] dark:text-gray-200 pr-2 whitespace-nowrap">
                  {row.category}
                </td>
                {row.values.map((v, i) => {
                  const { bg, text } = cellColor(v)
                  return (
                    <td key={i}>
                      <div
                        className="w-10 h-8 rounded-md flex items-center justify-center text-[10.5px] font-mono font-semibold"
                        style={{ backgroundColor: bg, color: text }}
                        title={`${row.category} · ${days[i]}: ${v}% risk`}
                      >
                        {v}
                      </div>
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center gap-3 mt-3 text-[10px] text-[#8e8e93] dark:text-gray-400">
        <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-sm inline-block" style={{ background: "#2fae6355" }} /> Low</span>
        <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-sm inline-block" style={{ background: "#f59e0b55" }} /> Medium</span>
        <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-sm inline-block" style={{ background: "#ef444455" }} /> High</span>
      </div>
    </div>
  )
}
