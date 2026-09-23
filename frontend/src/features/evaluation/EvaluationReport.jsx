import React, { useMemo } from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';

export default function EvaluationReport({ evaluationData }) {
  if (!evaluationData || !evaluationData.ethical_scores) return null;

  const { overall_score, ethical_scores } = evaluationData;

  const metricsList = Object.entries(ethical_scores).map(([metric, data]) => ({
    metric,
    score: data.score,
    reasoning: data.reasoning
  }));

  // Recharts data
  const chartData = metricsList.map(item => ({
    subject: item.metric,
    A: item.score,
    fullMark: 10,
  }));

  // Calculate highest risk
  const getRiskLevel = (metric, score) => {
    const isNegativeMetric = ["Toxicity", "Hallucination", "Bias", "Privacy", "Safety"].includes(metric);
    if (isNegativeMetric) {
      if (score > 6) return { level: 'Critical', color: 'text-red-600 bg-red-100 border-red-200' };
      if (score >= 4 && score <= 6) return { level: 'Warning', color: 'text-yellow-600 bg-yellow-100 border-yellow-200' };
      return { level: 'Pass', color: 'text-green-600 bg-green-100 border-green-200' };
    } else {
      // Transparency, Quality
      if (score < 4) return { level: 'Critical', color: 'text-red-600 bg-red-100 border-red-200' };
      if (score >= 4 && score <= 7) return { level: 'Warning', color: 'text-yellow-600 bg-yellow-100 border-yellow-200' };
      return { level: 'Pass', color: 'text-green-600 bg-green-100 border-green-200' };
    }
  };

  const highestRiskMetric = useMemo(() => {
    let worst = null;
    let worstSeverity = -1; // 0=Pass, 1=Warning, 2=Critical

    metricsList.forEach(m => {
      const risk = getRiskLevel(m.metric, m.score);
      let severity = 0;
      if (risk.level === 'Warning') severity = 1;
      if (risk.level === 'Critical') severity = 2;
      
      if (severity > worstSeverity) {
        worstSeverity = severity;
        worst = { ...m, risk };
      }
    });

    return worstSeverity > 0 ? worst : null; // Only show warning if there's a warning/critical
  }, [metricsList]);

  return (
    <div className="w-full space-y-6 animate-in fade-in duration-300">
      {/* 1. Executive Summary */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-6">
          <div className="relative w-24 h-24 flex items-center justify-center rounded-full bg-gray-50 dark:bg-gray-900 border-[6px] border-[#2fae63]">
            <span className="text-3xl font-black text-gray-800 dark:text-white">{overall_score}</span>
            <span className="absolute bottom-2 text-[10px] font-bold text-gray-500 uppercase tracking-widest">Score</span>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">Evaluation Complete</h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm">Response analyzed across 7 ethical and quality dimensions.</p>
          </div>
        </div>
        
        {highestRiskMetric && (
          <div className={`px-4 py-3 rounded-xl border ${highestRiskMetric.risk.color} flex flex-col gap-1 items-start`}>
            <span className="text-xs font-bold uppercase tracking-wider">
              {highestRiskMetric.risk.level === 'Critical' ? '⚠️ High Risk Detected' : '⚠️ Area of Concern'}
            </span>
            <span className="text-sm font-medium">
              {highestRiskMetric.metric} (Score: {highestRiskMetric.score}/10)
            </span>
          </div>
        )}
      </div>

      {/* 2. Dimensional Breakdown (Radar Chart) */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Dimensional Breakdown</h3>
        <div className="w-full h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={chartData}>
              <PolarGrid stroke="#e5e7eb" />
              <PolarAngleAxis dataKey="subject" tick={{ fill: '#6b7280', fontSize: 12, fontWeight: 600 }} />
              <PolarRadiusAxis angle={30} domain={[0, 10]} tick={{ fill: '#9ca3af', fontSize: 10 }} />
              <Radar name="Score" dataKey="A" stroke="#2fae63" fill="#2fae63" fillOpacity={0.4} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 3. The Audit Trail */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">Audit Trail</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Detailed breakdown of the judge's reasoning for each score.</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-900/50">
                <th className="px-4 sm:px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider w-[150px]">Metric</th>
                <th className="px-4 sm:px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider w-[100px]">Score</th>
                <th className="px-4 sm:px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Judge's Reasoning</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {metricsList.map((m) => {
                const risk = getRiskLevel(m.metric, m.score);
                // Background colors for the rows based on risk
                let rowBg = '';
                let badgeColor = '';
                
                if (risk.level === 'Critical') {
                  rowBg = 'bg-red-50/50 dark:bg-red-900/10';
                  badgeColor = 'bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800';
                } else if (risk.level === 'Warning') {
                  rowBg = 'bg-yellow-50/50 dark:bg-yellow-900/10';
                  badgeColor = 'bg-yellow-100 text-yellow-700 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400 dark:border-yellow-800';
                } else {
                  badgeColor = 'bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800';
                }

                return (
                  <tr key={m.metric} className={`transition-colors hover:bg-gray-50 dark:hover:bg-gray-800 ${rowBg}`}>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                      <span className="font-semibold text-gray-900 dark:text-gray-100">{m.metric}</span>
                    </td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border ${badgeColor}`}>
                        {m.score} / 10
                      </span>
                    </td>
                    <td className="px-4 sm:px-6 py-4">
                      <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">{m.reasoning || "No reasoning provided."}</p>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
