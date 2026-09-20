// Deterministic dummy-data generator for the Real-Time Risk Dashboard.
// Each chat gets its own stable "fake live feed" seeded off its chat id,
// so switching chats shows different (but consistent) numbers instead of
// re-randomizing on every render.

// Simple string hash -> 32-bit seed
function hashSeed(str) {
  let h = 1779033703 ^ str.length
  for (let i = 0; i < str.length; i++) {
    h = Math.imul(h ^ str.charCodeAt(i), 3432918353)
    h = (h << 13) | (h >>> 19)
  }
  return () => {
    h = Math.imul(h ^ (h >>> 16), 2246822507)
    h = Math.imul(h ^ (h >>> 13), 3266489909)
    h ^= h >>> 16
    return (h >>> 0) / 4294967296
  }
}

// Mulberry32 PRNG driven by the hashed seed, gives a repeatable stream
function mulberry32(seedFn) {
  let a = Math.floor(seedFn() * 4294967296)
  return () => {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function makeRng(chatId, salt = "") {
  return mulberry32(hashSeed(`${chatId || "default"}::${salt}`))
}

function clamp(n, min, max) {
  return Math.min(max, Math.max(min, n))
}

// Wander a value up/down within bounds to create a plausible trend line
function walkSeries(rng, { length = 12, start, min, max, volatility = 6 }) {
  const points = [start]
  for (let i = 1; i < length; i++) {
    const prev = points[i - 1]
    const delta = (rng() - 0.5) * volatility * 2
    points.push(Number(clamp(prev + delta, min, max).toFixed(1)))
  }
  return points
}

const RISK_CATEGORIES = ["Safety", "Bias", "Toxicity", "Hallucination", "Prompt Injection"]

/**
 * Generates a full dummy risk snapshot for a given chat.
 * Everything is derived from chatId, so it's stable across re-renders
 * but different from chat to chat.
 */
export function generateRiskSnapshot(chatId, isNewChat = false) {
  if (isNewChat) {
    return {
      trustScore: 0,
      trustLabel: "N/A",
      metrics: [
        { key: "safety", label: "Safety Score", value: 0, unit: "%", trend: Array(12).fill(0), delta: 0, goodDirection: "up", color: "#2fae63" },
        { key: "bias", label: "Bias Trend", value: 0, unit: "%", trend: Array(12).fill(0), delta: 0, goodDirection: "down", color: "#f59e0b" },
        { key: "toxicity", label: "Toxicity Trend", value: 0, unit: "%", trend: Array(12).fill(0), delta: 0, goodDirection: "down", color: "#ef4444" },
        { key: "hallucination", label: "Hallucination Rate", value: 0, unit: "%", trend: Array(12).fill(0), delta: 0, goodDirection: "down", color: "#8b5cf6" },
      ],
      radar: [
        { label: "Safety", value: 0 },
        { label: "Bias Resistance", value: 0 },
        { label: "Toxicity Control", value: 0 },
        { label: "Factual Accuracy", value: 0 },
        { label: "Latency Score", value: 0 },
        { label: "UI/UX Quality", value: 0 },
      ],
      heatmapDays: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      heatmap: RISK_CATEGORIES.map((category) => ({ category, values: Array(7).fill(0) })),
    }
  }

  const safeId = chatId ? String(chatId) : "default_chat"
  const rng = makeRng(safeId, "risk-v1")

  // --- Trend metrics (12 points, e.g. "last 12 evaluation runs") ---
  const safetyTrend = walkSeries(rng, { start: 92 + rng() * 6, min: 70, max: 100, volatility: 3 })
  const biasTrend = walkSeries(rng, { start: 8 + rng() * 10, min: 0, max: 45, volatility: 4 })
  const toxicityTrend = walkSeries(rng, { start: 4 + rng() * 6, min: 0, max: 35, volatility: 3 })
  const hallucinationTrend = walkSeries(rng, { start: 6 + rng() * 10, min: 0, max: 40, volatility: 4 })

  const safetyScore = safetyTrend[safetyTrend.length - 1]
  const biasScore = biasTrend[biasTrend.length - 1]
  const toxicityScore = toxicityTrend[toxicityTrend.length - 1]
  const hallucinationRate = hallucinationTrend[hallucinationTrend.length - 1]

  const delta = (series) => Number((series[series.length - 1] - series[0]).toFixed(1))

  // --- Radar chart axes (0-100, all "higher is better") ---
  const radar = [
    { label: "Safety", value: Math.round(safetyScore) },
    { label: "Bias Resistance", value: Math.round(100 - biasScore) },
    { label: "Toxicity Control", value: Math.round(100 - toxicityScore) },
    { label: "Factual Accuracy", value: Math.round(100 - hallucinationRate) },
    { label: "Latency Score", value: Math.round(clamp(70 + rng() * 28, 40, 99)) },
    { label: "UI/UX Quality", value: Math.round(clamp(75 + rng() * 22, 40, 99)) },
  ]

  // --- Risk heatmap: 7 days x risk categories, 0-100 risk intensity ---
  const heatmapDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
  const heatmap = RISK_CATEGORIES.map((category) => ({
    category,
    values: heatmapDays.map(() => Math.round(clamp(rng() * 60 + (category === "Safety" ? 0 : 5), 0, 100))),
  }))

  // --- Overall AI Trust Score: weighted composite ---
  const trustScore = Math.round(
    clamp(
      safetyScore * 0.35 +
        (100 - biasScore) * 0.2 +
        (100 - toxicityScore) * 0.2 +
        (100 - hallucinationRate) * 0.25,
      0,
      100
    )
  )

  const trustLabel =
    trustScore >= 90 ? "Excellent" : trustScore >= 75 ? "Good" : trustScore >= 60 ? "Fair" : "At Risk"

  return {
    trustScore,
    trustLabel,
    metrics: [
      {
        key: "safety",
        label: "Safety Score",
        value: safetyScore,
        unit: "%",
        trend: safetyTrend,
        delta: delta(safetyTrend),
        goodDirection: "up",
        color: "#2fae63",
      },
      {
        key: "bias",
        label: "Bias Trend",
        value: biasScore,
        unit: "%",
        trend: biasTrend,
        delta: delta(biasTrend),
        goodDirection: "down",
        color: "#f59e0b",
      },
      {
        key: "toxicity",
        label: "Toxicity Trend",
        value: toxicityScore,
        unit: "%",
        trend: toxicityTrend,
        delta: delta(toxicityTrend),
        goodDirection: "down",
        color: "#ef4444",
      },
      {
        key: "hallucination",
        label: "Hallucination Rate",
        value: hallucinationRate,
        unit: "%",
        trend: hallucinationTrend,
        delta: delta(hallucinationTrend),
        goodDirection: "down",
        color: "#8b5cf6",
      },
    ],
    radar,
    heatmap,
    heatmapDays,
  }
}
