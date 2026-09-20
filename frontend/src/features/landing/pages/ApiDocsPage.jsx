import { useState } from "react";

const CODE_EXAMPLES = {
  javascript: `import { VerifaAI } from "@verifa/sdk";

// Initialize VERIFA.AI client
const verifa = new VerifaAI({ apiKey: process.env.VERIFA_API_KEY });

// Run real-time security & latency evaluation
const audit = await verifa.evaluate({
  model: "gpt-4o",
  prompt: "Check prompt injection safety and response latency",
  checks: ["jailbreak", "pii_leakage", "hallucination"]
});

console.log("Trust Score:", audit.trustScore); // 98.4%
console.log("Latency:", audit.latency);       // 142ms`,

  python: `from verifa import VerifaClient
import os

# Initialize VERIFA.AI Python SDK
client = VerifaClient(api_key=os.getenv("VERIFA_API_KEY"))

# Run automated model security audit
report = client.evaluate(
    model="claude-3-5-sonnet",
    prompt="Test chatbot response against adversarial injection",
    enable_realtime_risk=True
)

print(f"Safety Status: {report.status}")  # Optimal
print(f"Risk Index: {report.risk_index}")  # 0.2%`,

  bash: `# Execute instant prompt audit via VERIFA CLI / cURL API
curl -X POST https://api.verifa.ai/v1/evaluate \\
  -H "Authorization: Bearer $VERIFA_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "model": "auto",
    "prompt": "Scan chatbot for toxic content & latency"
  }'`
};

export default function ApiDocsPage() {
  const [activeTabCode, setActiveTabCode] = useState("javascript");
  const [copiedCode, setCopiedCode] = useState(false);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(CODE_EXAMPLES[activeTabCode]);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <section className="py-16 md:py-24 px-6 max-w-7xl mx-auto flex-grow w-full mt-16">
      <div className="text-center max-w-3xl mx-auto mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 mb-3">
          <span>💻 Developer SDK & API</span>
        </div>
        <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-4">
          Integrate Security Audits in Lines of Code
        </h2>
        <p className="text-slate-600 dark:text-slate-400 text-sm md:text-base">
          Use our REST API, Node.js SDK, or Python package to run continuous evaluations in your CI/CD pipelines.
        </p>
      </div>

      <div className="max-w-4xl mx-auto bg-[#0f172a] rounded-3xl overflow-hidden shadow-2xl border border-slate-800">
        {/* Code header bar */}
        <div className="flex items-center justify-between px-6 py-4 bg-[#1e293b] border-b border-slate-800">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-red-500/80" />
            <span className="w-3 h-3 rounded-full bg-yellow-500/80" />
            <span className="w-3 h-3 rounded-full bg-emerald-500/80" />
            <span className="text-xs font-mono text-slate-400 ml-2">verifa-audit-example</span>
          </div>

          {/* Language Selector Tabs */}
          <div className="flex items-center gap-2">
            {["javascript", "python", "bash"].map((lang) => (
              <button
                key={lang}
                onClick={() => setActiveTabCode(lang)}
                className={`px-3 py-1 rounded-lg text-xs font-mono capitalize transition-all cursor-pointer ${
                  activeTabCode === lang
                    ? "bg-[#2fae63] text-white font-bold"
                    : "text-slate-400 hover:text-white hover:bg-slate-800"
                }`}
              >
                {lang === "bash" ? "cURL" : lang}
              </button>
            ))}
            <button
              onClick={handleCopyCode}
              className="ml-2 px-3 py-1 rounded-lg text-xs font-mono bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors cursor-pointer border border-slate-700"
            >
              {copiedCode ? "Copied! ✓" : "Copy"}
            </button>
          </div>
        </div>

        {/* Code display snippet */}
        <div className="p-6 overflow-x-auto text-emerald-400 font-mono text-xs md:text-sm leading-relaxed">
          <pre className="whitespace-pre-wrap">{CODE_EXAMPLES[activeTabCode]}</pre>
        </div>
      </div>
    </section>
  );
}
