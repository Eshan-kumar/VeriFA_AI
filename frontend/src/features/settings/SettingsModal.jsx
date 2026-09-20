import { useState, useEffect } from "react"
import { settingsApi } from "../../shared/services/api"

export default function SettingsModal({
  isOpen,
  onClose,
  darkMode,
  themeMode = "dark",
  setThemeMode,
  evalMode,
  setEvalMode,
  apiKey,
  setApiKey,
  targetUrl,
  setTargetUrl,
  selectedModel,
  setSelectedModel,
  modelOptions = [],
  notify,
  handleClearHistory,
  authUser,
  handleLogout,
}) {
  const [activeTab, setActiveTab] = useState("general")
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [showOpenaiKey, setShowOpenaiKey] = useState(false)
  const [showAnthropicKey, setShowAnthropicKey] = useState(false)
  const [showGeminiKey, setShowGeminiKey] = useState(false)

  // General Profile & Appearance Config
  const [generalConfig, setGeneralConfig] = useState({
    userName: authUser?.email ? authUser.email.split("@")[0] : "Evaluator User",
    userEmail: authUser?.email || "",
    organization: "VERIFA.AI Ethical Lab",
    language: "English (US)",
    defaultView: "app",
  })

  // Evaluation Framework Settings State
  const [providers, setProviders] = useState({
    openaiKey: apiKey || "",
    openaiKeyMasked: "",
    anthropicKey: "",
    anthropicKeyMasked: "",
    geminiKey: "",
    geminiKeyMasked: "",
    localEndpoint: targetUrl || "http://localhost:11434/v1",
    rateLimitReqPerMin: 60,
    timeoutSec: 30,
  })

  const [rubrics, setRubrics] = useState({
    bias: { enabled: true, weight: 25, threshold: 85 },
    toxicity: { enabled: true, weight: 25, threshold: 90 },
    safety: { enabled: true, weight: 20, threshold: 95 },
    fairness: { enabled: true, weight: 15, threshold: 80 },
    honesty: { enabled: true, weight: 15, threshold: 85 },
  })

  const [datasets, setDatasets] = useState({
    activeDataset: "Adversarial Red-Team Benchmark",
    sampleSize: 50,
    isRestricted: false,
  })

  const [judgeConfig, setJudgeConfig] = useState({
    method: "LLM-as-a-Judge",
    judgeModel: "GPT-4o (Ethical Guardrail)",
    passThresholdPercent: 85,
  })

  const [loggingConfig, setLoggingConfig] = useState({
    logTranscripts: true,
    redactPii: true,
    retentionDays: 90,
  })

  const [alertsConfig, setAlertsConfig] = useState({
    alertEmail: authUser?.email || "",
    webhookUrl: "",
    notifyOnFail: true,
  })

  const [integrationsConfig, setIntegrationsConfig] = useState({
    platformApiKey: "",
    cicdWebhook: "",
    exportFormat: "JSON",
  })

  // Fetch settings from MongoDB when modal opens
  useEffect(() => {
    if (isOpen) {
      setLoading(true)
      const userId = authUser?.id || "guest_user"
      settingsApi
        .getSettings(userId)
        .then((res) => {
          if (res?.settings) {
            const s = res.settings
            if (s.generalConfig) setGeneralConfig((prev) => ({ ...prev, ...s.generalConfig }))
            if (s.providers) setProviders((prev) => ({ ...prev, ...s.providers }))
            if (s.rubrics) setRubrics((prev) => ({ ...prev, ...s.rubrics }))
            if (s.datasets) setDatasets((prev) => ({ ...prev, ...s.datasets }))
            if (s.judgeConfig) setJudgeConfig((prev) => ({ ...prev, ...s.judgeConfig }))
            if (s.loggingConfig) setLoggingConfig((prev) => ({ ...prev, ...s.loggingConfig }))
            if (s.alertsConfig) setAlertsConfig((prev) => ({ ...prev, ...s.alertsConfig }))
            if (s.integrationsConfig) setIntegrationsConfig((prev) => ({ ...prev, ...s.integrationsConfig }))
            if (s.selectedModel && setSelectedModel) setSelectedModel(s.selectedModel)
            if (s.evalMode && setEvalMode) setEvalMode(s.evalMode)
            // Note: themeMode is NOT auto-applied on modal open to preserve user's active theme selection!
          }
        })
        .catch((err) => {
          console.warn("Could not load settings from backend:", err)
        })
        .finally(() => setLoading(false))
    }
  }, [isOpen, authUser])

  if (!isOpen) return null

  // Save Settings to MongoDB
  const handleSaveSettings = async () => {
    setSaving(true)
    const userId = authUser?.id || "guest_user"

    // Sync legacy props
    if (setApiKey && providers.openaiKey) setApiKey(providers.openaiKey)
    if (setTargetUrl && providers.localEndpoint) setTargetUrl(providers.localEndpoint)

    const payload = {
      userId,
      evalMode,
      selectedModel,
      themeMode,
      generalConfig,
      providers,
      rubrics,
      datasets,
      judgeConfig,
      loggingConfig,
      alertsConfig,
      integrationsConfig,
    }

    try {
      await settingsApi.saveSettings(payload)
      notify && notify("Settings saved successfully.")
      onClose()
    } catch (err) {
      notify && notify(err.message || "Failed to save settings.")
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0B1220]/75 backdrop-blur-md p-2.5 sm:p-4 animate-in fade-in duration-200">
      <div
        className="bg-[#111A28] rounded-2xl sm:rounded-3xl max-w-[820px] w-full shadow-2xl border border-white/5 overflow-hidden relative animate-in zoom-in-95 duration-200 text-[#F1F5F9] flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 sm:py-4.5 border-b border-white/5 bg-[#151F2E]">
          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
            <div className="w-9 sm:w-10 h-9 sm:h-10 rounded-2xl bg-[#20B866]/10 text-[#20B866] flex items-center justify-center font-bold text-lg sm:text-xl border border-[#20B866]/20 shadow-xs flex-shrink-0">
              ⚙️
            </div>
            <div className="min-w-0">
              <h2 className="text-[15px] sm:text-[18px] font-bold tracking-tight text-[#F1F5F9] truncate">
                Framework Settings
              </h2>
              <p className="text-[11px] sm:text-[12.5px] text-[#94A3B8] truncate">
                Profile, appearance, model keys & rubrics
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-[#F1F5F9] hover:hover:bg-[#151F2E] transition-colors border-none bg-transparent cursor-pointer flex-shrink-0"
          >
            ✕
          </button>
        </div>

        {/* Horizontal Navigation Tabs */}
        <div className="flex border-b border-white/5 px-3 sm:px-6 gap-1 overflow-x-auto bg-[#151F2E] scrollbar-none">
          {[
            { id: "general", label: "⚙️ General" },
            { id: "providers", label: "🤖 Models" },
            { id: "rubrics", label: "⚖️ Rubrics" },
            { id: "datasets", label: "📁 Datasets" },
            { id: "judge", label: "👩‍⚖️ Judge" },
            { id: "logging", label: "🛡️ Privacy" },
            { id: "alerts", label: "🔔 Alerts" },
            { id: "account", label: "👤 Account" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={[
                "py-2.5 sm:py-3 px-2.5 sm:px-3.5 text-[11.5px] sm:text-[12.5px] font-medium border-b-2 cursor-pointer transition-all flex items-center gap-1.5 whitespace-nowrap bg-transparent border-t-0 border-x-0",
                activeTab === tab.id
                  ? "border-[#20B866] text-[#20B866] font-semibold"
                  : "border-transparent text-[#94A3B8] hover:text-slate-800 hover:text-[#F1F5F9]",
              ].join(" ")}
            >
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Tab Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6 flex-1 text-[#F1F5F9]">
          {loading ? (
            <div className="flex items-center justify-center py-12 text-slate-400 gap-2">
              <span className="w-5 h-5 border-2 border-[#20B866] border-t-transparent rounded-full animate-spin" />
              <span>Loading framework configurations...</span>
            </div>
          ) : (
            <>
              {/* TAB 0: GENERAL SETTINGS */}
              {activeTab === "general" && (
                <div className="space-y-5 animate-in fade-in duration-150">
                  <div>
                    <h3 className="text-sm font-bold text-[#F1F5F9] mb-1">
                      General Evaluator & Interface Settings
                    </h3>
                    <p className="text-xs text-[#94A3B8] mb-4">
                      Customize your display name, theme mode, language preferences, and default workspace view.
                    </p>

                    <div className="space-y-4">
                      {/* Full Name / Evaluator Name */}
                      <div>
                        <label className="text-xs font-semibold text-[#F1F5F9] block mb-1.5">
                          Evaluator Full Name
                        </label>
                        <input
                          type="text"
                          placeholder="E.g. Eshan Kumar"
                          value={generalConfig.userName}
                          onChange={(e) => setGeneralConfig({ ...generalConfig, userName: e.target.value })}
                          className="w-full bg-[#151F2E] border border-white/5 rounded-xl px-3.5 py-2.5 text-xs outline-none focus:border-[#20B866] text-[#F1F5F9] font-medium"
                        />
                      </div>

                      {/* Organization / Lab Name */}
                      <div>
                        <label className="text-xs font-semibold text-[#F1F5F9] block mb-1.5">
                          Organization / Research Lab
                        </label>
                        <input
                          type="text"
                          placeholder="E.g. VERIFA.AI Security Lab"
                          value={generalConfig.organization}
                          onChange={(e) => setGeneralConfig({ ...generalConfig, organization: e.target.value })}
                          className="w-full bg-[#151F2E] border border-white/5 rounded-xl px-3.5 py-2.5 text-xs outline-none focus:border-[#20B866] text-[#F1F5F9] font-medium"
                        />
                      </div>

                      {/* Theme Appearance Mode */}
                      <div>
                        <label className="text-xs font-semibold text-[#F1F5F9] block mb-1.5">
                          Appearance & Theme Mode
                        </label>
                        <div className="grid grid-cols-3 gap-3">
                          {/* Light Mode Card */}
                          <div
                            onClick={() => {
                              if (setThemeMode) setThemeMode("light")
                              notify && notify("Switched to Light Theme")
                            }}
                            className={[
                              "p-3 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between",
                              themeMode === "light"
                                ? "border-[#20B866] bg-[#20B866]/10 shadow-sm"
                                : "border-white/5 bg-[#151F2E] hover:border-[#20B866]",
                            ].join(" ")}
                          >
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-1.5 font-semibold text-xs text-[#F1F5F9]">
                                <span>☀️</span> Light
                              </div>
                              {themeMode === "light" && (
                                <span className="w-2 h-2 rounded-full bg-[#20B866] shadow-xs shadow-[#20B866]/50" />
                              )}
                            </div>
                            <div className="h-8 bg-white rounded-lg border border-slate-200 p-1 flex items-center gap-1">
                              <div className="w-2 h-2 rounded-full bg-[#20B866]" />
                              <div className="h-1 w-10 bg-slate-200 rounded" />
                            </div>
                          </div>

                          {/* Dark Mode Card */}
                          <div
                            onClick={() => {
                              if (setThemeMode) setThemeMode("dark")
                              notify && notify("Switched to Dark Theme")
                            }}
                            className={[
                              "p-3 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between",
                              themeMode === "dark"
                                ? "border-[#20B866] bg-[#20B866]/10 shadow-sm"
                                : "border-white/5 bg-[#151F2E] hover:border-[#20B866]",
                            ].join(" ")}
                          >
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-1.5 font-semibold text-xs text-[#F1F5F9]">
                                <span>🌙</span> Dark
                              </div>
                              {themeMode === "dark" && (
                                <span className="w-2 h-2 rounded-full bg-[#20B866] shadow-xs shadow-[#20B866]/50" />
                              )}
                            </div>
                            <div className="h-8 bg-slate-900 rounded-lg border border-slate-700 p-1 flex items-center gap-1">
                              <div className="w-2 h-2 rounded-full bg-[#20B866]" />
                              <div className="h-1 w-10 bg-slate-700 rounded" />
                            </div>
                          </div>

                          {/* System Mode Card */}
                          <div
                            onClick={() => {
                              if (setThemeMode) setThemeMode("system")
                              notify && notify("Switched to System Default Theme")
                            }}
                            className={[
                              "p-3 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between",
                              themeMode === "system"
                                ? "border-[#20B866] bg-[#20B866]/10 shadow-sm"
                                : "border-white/5 bg-[#151F2E] hover:border-[#20B866]",
                            ].join(" ")}
                          >
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-1.5 font-semibold text-xs text-[#F1F5F9]">
                                <span>🖥️</span> System
                              </div>
                              {themeMode === "system" && (
                                <span className="w-2 h-2 rounded-full bg-[#20B866] shadow-xs shadow-[#20B866]/50" />
                              )}
                            </div>
                            <div className="h-8 bg-gradient-to-r from-white to-slate-900 rounded-lg border border-white/5 p-1 flex items-center gap-1">
                              <div className="w-2 h-2 rounded-full bg-[#20B866]" />
                              <div className="h-1 w-10 bg-slate-400 rounded" />
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Interface Language */}
                      <div>
                        <label className="text-xs font-semibold text-[#F1F5F9] block mb-1.5">
                          Interface Language
                        </label>
                        <select
                          value={generalConfig.language}
                          onChange={(e) => setGeneralConfig({ ...generalConfig, language: e.target.value })}
                          className="w-full bg-[#151F2E] border border-white/5 rounded-xl px-3.5 py-2.5 text-xs font-medium outline-none focus:border-[#20B866]"
                        >
                          <option value="English (US)">🌐 English (US)</option>
                          <option value="English (UK)">🌐 English (UK)</option>
                          <option value="Spanish">🌐 Spanish (Español)</option>
                          <option value="French">🌐 French (Français)</option>
                          <option value="German">🌐 German (Deutsch)</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 1: MODELS & PROVIDERS */}
              {activeTab === "providers" && (
                <div className="space-y-5 animate-in fade-in duration-150">
                  <div>
                    <h3 className="text-sm font-bold text-[#F1F5F9] mb-1">
                      Model Provider API Keys & Endpoints
                    </h3>
                    <p className="text-xs text-[#94A3B8] mb-4">
                      Configure keys for models evaluated by the framework. Keys are encrypted at rest using AES-256-GCM.
                    </p>

                    <div className="space-y-4">
                      {/* OpenAI API Key */}
                      <div>
                        <label className="text-xs font-semibold text-[#F1F5F9] block mb-1.5">
                          OpenAI API Key (GPT-4o, GPT-3.5)
                        </label>
                        <div className="flex items-center bg-[#151F2E] border border-white/5 rounded-xl px-3 py-2 focus-within:border-[#20B866] transition-colors">
                          <input
                            type={showOpenaiKey ? "text" : "password"}
                            placeholder={providers.openaiKeyMasked || "sk-proj-..."}
                            value={providers.openaiKey}
                            onChange={(e) => setProviders({ ...providers, openaiKey: e.target.value })}
                            className="flex-1 bg-transparent border-none outline-none text-xs font-mono text-[#F1F5F9]"
                          />
                          <button
                            type="button"
                            onClick={() => setShowOpenaiKey(!showOpenaiKey)}
                            className="text-slate-400 hover:text-slate-700 hover:text-[#F1F5F9] bg-transparent border-none cursor-pointer text-xs"
                          >
                            {showOpenaiKey ? "🙈" : "👁️"}
                          </button>
                        </div>
                      </div>

                      {/* Anthropic API Key */}
                      <div>
                        <label className="text-xs font-semibold text-[#F1F5F9] block mb-1.5">
                          Anthropic API Key (Claude 3.5 Sonnet, Haiku)
                        </label>
                        <div className="flex items-center bg-[#151F2E] border border-white/5 rounded-xl px-3 py-2 focus-within:border-[#20B866] transition-colors">
                          <input
                            type={showAnthropicKey ? "text" : "password"}
                            placeholder={providers.anthropicKeyMasked || "sk-ant-..."}
                            value={providers.anthropicKey}
                            onChange={(e) => setProviders({ ...providers, anthropicKey: e.target.value })}
                            className="flex-1 bg-transparent border-none outline-none text-xs font-mono text-[#F1F5F9]"
                          />
                          <button
                            type="button"
                            onClick={() => setShowAnthropicKey(!showAnthropicKey)}
                            className="text-slate-400 hover:text-slate-700 hover:text-[#F1F5F9] bg-transparent border-none cursor-pointer text-xs"
                          >
                            {showAnthropicKey ? "🙈" : "👁️"}
                          </button>
                        </div>
                      </div>

                      {/* Google Gemini API Key */}
                      <div>
                        <label className="text-xs font-semibold text-[#F1F5F9] block mb-1.5">
                          Google Gemini API Key (Gemini 1.5 Pro, Flash)
                        </label>
                        <div className="flex items-center bg-[#151F2E] border border-white/5 rounded-xl px-3 py-2 focus-within:border-[#20B866] transition-colors">
                          <input
                            type={showGeminiKey ? "text" : "password"}
                            placeholder={providers.geminiKeyMasked || "AIzaSy..."}
                            value={providers.geminiKey}
                            onChange={(e) => setProviders({ ...providers, geminiKey: e.target.value })}
                            className="flex-1 bg-transparent border-none outline-none text-xs font-mono text-[#F1F5F9]"
                          />
                          <button
                            type="button"
                            onClick={() => setShowGeminiKey(!showGeminiKey)}
                            className="text-slate-400 hover:text-slate-700 hover:text-[#F1F5F9] bg-transparent border-none cursor-pointer text-xs"
                          >
                            {showGeminiKey ? "🙈" : "👁️"}
                          </button>
                        </div>
                      </div>

                      {/* Local / Self-Hosted Endpoint */}
                      <div>
                        <label className="text-xs font-semibold text-[#F1F5F9] block mb-1.5">
                          Self-Hosted / Local LLM Endpoint URL (Ollama, vLLM, LM Studio)
                        </label>
                        <input
                          type="url"
                          placeholder="http://localhost:11434/v1"
                          value={providers.localEndpoint}
                          onChange={(e) => setProviders({ ...providers, localEndpoint: e.target.value })}
                          className="w-full bg-[#151F2E] border border-white/5 rounded-xl px-3 py-2 text-xs font-mono outline-none focus:border-[#20B866] text-[#F1F5F9] transition-colors"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Rate Limits & Timeouts */}
                  <div className="pt-4 border-t border-white/5 grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-semibold text-[#F1F5F9] block mb-1">
                        Rate Limit (Req / Min)
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="1000"
                        value={providers.rateLimitReqPerMin}
                        onChange={(e) => setProviders({ ...providers, rateLimitReqPerMin: Number(e.target.value) })}
                        className="w-full bg-[#151F2E] border border-white/5 rounded-xl px-3 py-2 text-xs outline-none focus:border-[#20B866]"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-[#F1F5F9] block mb-1">
                        Request Timeout (Sec)
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="300"
                        value={providers.timeoutSec}
                        onChange={(e) => setProviders({ ...providers, timeoutSec: Number(e.target.value) })}
                        className="w-full bg-[#151F2E] border border-white/5 rounded-xl px-3 py-2 text-xs outline-none focus:border-[#20B866]"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: RUBRICS & WEIGHTS */}
              {activeTab === "rubrics" && (
                <div className="space-y-5 animate-in fade-in duration-150">
                  <div>
                    <h3 className="text-sm font-bold text-[#F1F5F9] mb-1">
                      Active Ethical Evaluation Rubrics & Weights
                    </h3>
                    <p className="text-xs text-[#94A3B8] mb-4">
                      Enable rubrics, adjust scoring weights, and set minimum pass thresholds for safety benchmarking.
                    </p>
                  </div>

                  <div className="space-y-4">
                    {[
                      { key: "bias", label: "Bias & Stereotypes", desc: "Detects gender, racial, and socioeconomic discrimination", icon: "⚖️" },
                      { key: "toxicity", label: "Toxicity & Profanity", desc: "Flags hate speech, harassment, and toxic language", icon: "☠️" },
                      { key: "safety", label: "Safety & Jailbreak Defense", desc: "Evaluates prompt injection and safety guardrails", icon: "🛡️" },
                      { key: "fairness", label: "Fairness & Neutrality", desc: "Measures political & opinion neutrality", icon: "⚖️" },
                      { key: "honesty", label: "Honesty & Hallucination", desc: "Checks factual grounding vs reference hallucinations", icon: "🤥" },
                    ].map((item) => {
                      const rubric = rubrics[item.key] || { enabled: true, weight: 20, threshold: 85 }
                      return (
                        <div key={item.key} className="p-3.5 rounded-2xl border border-white/5 bg-[#151F2E] space-y-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2.5">
                              <span className="text-base">{item.icon}</span>
                              <div>
                                <div className="text-xs font-bold text-[#F1F5F9]">{item.label}</div>
                                <div className="text-[11px] text-[#94A3B8]">{item.desc}</div>
                              </div>
                            </div>
                            <input
                              type="checkbox"
                              checked={rubric.enabled}
                              onChange={(e) =>
                                setRubrics({
                                  ...rubrics,
                                  [item.key]: { ...rubric, enabled: e.target.checked },
                                })
                              }
                              className="w-4 h-4 accent-[#20B866] cursor-pointer"
                            />
                          </div>

                          {rubric.enabled && (
                            <div className="grid grid-cols-2 gap-4 pt-2 border-t border-slate-200/60 dark:border-slate-800/60 text-xs">
                              <div>
                                <div className="flex items-center justify-between text-[#64748B] mb-1">
                                  <span>Weight:</span>
                                  <span className="font-semibold text-[#20B866]">{rubric.weight}%</span>
                                </div>
                                <input
                                  type="range"
                                  min="0"
                                  max="100"
                                  value={rubric.weight}
                                  onChange={(e) =>
                                    setRubrics({
                                      ...rubrics,
                                      [item.key]: { ...rubric, weight: Number(e.target.value) },
                                    })
                                  }
                                  className="w-full accent-[#20B866] cursor-pointer"
                                />
                              </div>

                              <div>
                                <div className="flex items-center justify-between text-[#64748B] mb-1">
                                  <span>Pass Threshold:</span>
                                  <span className="font-semibold text-[#20B866]">{rubric.threshold}%</span>
                                </div>
                                <input
                                  type="range"
                                  min="0"
                                  max="100"
                                  value={rubric.threshold}
                                  onChange={(e) =>
                                    setRubrics({
                                      ...rubrics,
                                      [item.key]: { ...rubric, threshold: Number(e.target.value) },
                                    })
                                  }
                                  className="w-full accent-[#20B866] cursor-pointer"
                                />
                              </div>
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}

              {/* TAB 3: DATASETS & SAMPLING */}
              {activeTab === "datasets" && (
                <div className="space-y-5 animate-in fade-in duration-150">
                  <div>
                    <h3 className="text-sm font-bold text-[#F1F5F9] mb-1">
                      Evaluation Dataset Management
                    </h3>
                    <p className="text-xs text-[#94A3B8] mb-4">
                      Select test prompt suites and configure sampling limits for model evaluation runs.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="text-xs font-semibold text-[#F1F5F9] block mb-1.5">
                        Active Benchmark Prompt Dataset
                      </label>
                      <select
                        value={datasets.activeDataset}
                        onChange={(e) => setDatasets({ ...datasets, activeDataset: e.target.value })}
                        className="w-full bg-[#151F2E] border border-white/5 rounded-xl px-3 py-2.5 text-xs font-medium outline-none focus:border-[#20B866]"
                      >
                        <option value="Adversarial Red-Team Benchmark">🚩 Adversarial Red-Team Benchmark (250 Prompts)</option>
                        <option value="Customer Safety Evaluation Suite">🛡️ Customer Safety Evaluation Suite (150 Prompts)</option>
                        <option value="Ethical Alignment & Bias Prompts">⚖️ Ethical Alignment & Bias Prompts (300 Prompts)</option>
                        <option value="Custom Uploaded Dataset">📤 Custom Uploaded Dataset</option>
                      </select>
                    </div>

                    <div>
                      <div className="flex items-center justify-between text-xs font-semibold mb-1">
                        <span className="text-[#F1F5F9]">Evaluation Sample Size</span>
                        <span className="text-[#20B866]">{datasets.sampleSize} Prompts</span>
                      </div>
                      <input
                        type="range"
                        min="10"
                        max="500"
                        step="10"
                        value={datasets.sampleSize}
                        onChange={(e) => setDatasets({ ...datasets, sampleSize: Number(e.target.value) })}
                        className="w-full accent-[#20B866] cursor-pointer"
                      />
                    </div>

                    <div className="p-3.5 rounded-2xl border border-amber-500/20 bg-amber-500/10 flex items-center justify-between">
                      <div>
                        <div className="text-xs font-bold text-amber-600 dark:text-amber-400">
                          Restricted Access Dataset Tag
                        </div>
                        <div className="text-[11px] text-[#94A3B8]">
                          Mark dataset as sensitive / adversarial red-team requiring admin privileges.
                        </div>
                      </div>
                      <input
                        type="checkbox"
                        checked={datasets.isRestricted}
                        onChange={(e) => setDatasets({ ...datasets, isRestricted: e.target.checked })}
                        className="w-4 h-4 accent-amber-500 cursor-pointer"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 4: JUDGE CONFIG */}
              {activeTab === "judge" && (
                <div className="space-y-5 animate-in fade-in duration-150">
                  <div>
                    <h3 className="text-sm font-bold text-[#F1F5F9] mb-1">
                      Scoring & LLM-as-a-Judge Settings
                    </h3>
                    <p className="text-xs text-[#94A3B8] mb-4">
                      Configure automated LLM judge models and pass/fail thresholds for evaluation runs.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="text-xs font-semibold text-[#F1F5F9] block mb-1.5">
                        Scoring Evaluation Method
                      </label>
                      <select
                        value={judgeConfig.method}
                        onChange={(e) => setJudgeConfig({ ...judgeConfig, method: e.target.value })}
                        className="w-full bg-[#151F2E] border border-white/5 rounded-xl px-3 py-2.5 text-xs font-medium outline-none focus:border-[#20B866]"
                      >
                        <option value="LLM-as-a-Judge">👩‍⚖️ LLM-as-a-Judge (Automated Guardrail)</option>
                        <option value="Rule-Based Evaluator">📏 Rule-Based Regex & Safety Key Filters</option>
                        <option value="Hybrid (LLM + Rules)">⚡ Hybrid (LLM Guardrail + Safety Rules)</option>
                        <option value="Human Reviewer">👤 Human Review Queue</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-[#F1F5F9] block mb-1.5">
                        Judge Model Engine
                      </label>
                      <select
                        value={judgeConfig.judgeModel}
                        onChange={(e) => setJudgeConfig({ ...judgeConfig, judgeModel: e.target.value })}
                        className="w-full bg-[#151F2E] border border-white/5 rounded-xl px-3 py-2.5 text-xs font-medium outline-none focus:border-[#20B866]"
                      >
                        <option value="GPT-4o (Ethical Guardrail)">OpenAI GPT-4o (Recommended Judge)</option>
                        <option value="Claude 3.5 Sonnet (Safety Judge)">Anthropic Claude 3.5 Sonnet</option>
                        <option value="Gemini 1.5 Pro (Ethical Benchmarker)">Google Gemini 1.5 Pro</option>
                        <option value="Local Llama 3 70B Guardrail">Local Llama 3 70B Guardrail</option>
                      </select>
                    </div>

                    <div>
                      <div className="flex items-center justify-between text-xs font-semibold mb-1">
                        <span className="text-[#F1F5F9]">Overall Pass Threshold Score</span>
                        <span className="text-[#20B866]">{judgeConfig.passThresholdPercent}%</span>
                      </div>
                      <input
                        type="range"
                        min="50"
                        max="100"
                        value={judgeConfig.passThresholdPercent}
                        onChange={(e) => setJudgeConfig({ ...judgeConfig, passThresholdPercent: Number(e.target.value) })}
                        className="w-full accent-[#20B866] cursor-pointer"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 5: LOGGING & PRIVACY */}
              {activeTab === "logging" && (
                <div className="space-y-5 animate-in fade-in duration-150">
                  <div>
                    <h3 className="text-sm font-bold text-[#F1F5F9] mb-1">
                      Data & Privacy Controls
                    </h3>
                    <p className="text-xs text-[#94A3B8] mb-4">
                      Control prompt transcript logging, PII anonymization, and data retention policies.
                    </p>
                  </div>

                  <div className="space-y-3">
                    <div className="p-3.5 rounded-2xl border border-white/5 flex items-center justify-between">
                      <div>
                        <div className="text-xs font-bold text-[#F1F5F9]">Log Evaluation Transcripts</div>
                        <div className="text-[11px] text-[#94A3B8]">Save detailed model prompts and outputs to MongoDB.</div>
                      </div>
                      <input
                        type="checkbox"
                        checked={loggingConfig.logTranscripts}
                        onChange={(e) => setLoggingConfig({ ...loggingConfig, logTranscripts: e.target.checked })}
                        className="w-4 h-4 accent-[#20B866] cursor-pointer"
                      />
                    </div>

                    <div className="p-3.5 rounded-2xl border border-white/5 flex items-center justify-between">
                      <div>
                        <div className="text-xs font-bold text-[#F1F5F9]">Redact & Anonymize PII</div>
                        <div className="text-[11px] text-[#94A3B8]">Automatically strip emails, phone numbers, and names before saving.</div>
                      </div>
                      <input
                        type="checkbox"
                        checked={loggingConfig.redactPii}
                        onChange={(e) => setLoggingConfig({ ...loggingConfig, redactPii: e.target.checked })}
                        className="w-4 h-4 accent-[#20B866] cursor-pointer"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-[#F1F5F9] block mb-1">
                        Data Retention Period (Days)
                      </label>
                      <input
                        type="number"
                        min="7"
                        max="365"
                        value={loggingConfig.retentionDays}
                        onChange={(e) => setLoggingConfig({ ...loggingConfig, retentionDays: Number(e.target.value) })}
                        className="w-full bg-[#151F2E] border border-white/5 rounded-xl px-3 py-2 text-xs outline-none focus:border-[#20B866]"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 6: ALERTS & WEBHOOKS */}
              {activeTab === "alerts" && (
                <div className="space-y-5 animate-in fade-in duration-150">
                  <div>
                    <h3 className="text-sm font-bold text-[#F1F5F9] mb-1">
                      Alerts & CI/CD Webhooks
                    </h3>
                    <p className="text-xs text-[#94A3B8] mb-4">
                      Set up notifications for safety violations and automated CI/CD pipeline triggers.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="text-xs font-semibold text-[#F1F5F9] block mb-1.5">
                        Alert Recipient Email Address
                      </label>
                      <input
                        type="email"
                        placeholder="eval-alerts@company.com"
                        value={alertsConfig.alertEmail}
                        onChange={(e) => setAlertsConfig({ ...alertsConfig, alertEmail: e.target.value })}
                        className="w-full bg-[#151F2E] border border-white/5 rounded-xl px-3 py-2 text-xs outline-none focus:border-[#20B866]"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-[#F1F5F9] block mb-1.5">
                        Slack / Teams Webhook URL
                      </label>
                      <input
                        type="url"
                        placeholder="https://hooks.slack.com/services/..."
                        value={alertsConfig.webhookUrl}
                        onChange={(e) => setAlertsConfig({ ...alertsConfig, webhookUrl: e.target.value })}
                        className="w-full bg-[#151F2E] border border-white/5 rounded-xl px-3 py-2 text-xs font-mono outline-none focus:border-[#20B866]"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-[#F1F5F9] block mb-1.5">
                        Export Format Preference
                      </label>
                      <select
                        value={integrationsConfig.exportFormat}
                        onChange={(e) => setIntegrationsConfig({ ...integrationsConfig, exportFormat: e.target.value })}
                        className="w-full bg-[#151F2E] border border-white/5 rounded-xl px-3 py-2 text-xs font-medium outline-none focus:border-[#20B866]"
                      >
                        <option value="JSON">JSON Format</option>
                        <option value="CSV">CSV Spreadsheet</option>
                        <option value="PDF">PDF Executive Summary</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 7: ACCOUNT & SESSION */}
              {activeTab === "account" && (
                <div className="space-y-5 animate-in fade-in duration-150">
                  <div>
                    <h3 className="text-sm font-bold text-[#F1F5F9] mb-1">
                      Account & Team Role
                    </h3>
                    <p className="text-xs text-[#94A3B8] mb-4">
                      Active evaluator session details and historical clear controls.
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-[#151F2E] border border-white/5 space-y-2">
                    <div className="text-xs text-[#94A3B8]">Signed In Evaluator</div>
                    <div className="text-sm font-bold text-[#F1F5F9] flex items-center gap-2">
                      <span>👤</span>
                      <span>{authUser?.email || generalConfig.userEmail || "Guest Evaluator Session"}</span>
                    </div>
                    <span className="inline-block text-[11px] font-medium px-2.5 py-0.5 rounded-full bg-[#20B866]/10 text-[#20B866] border border-[#20B866]/20">
                      Lead Ethical Evaluator
                    </span>
                  </div>

                  <div className="pt-4 border-t border-white/5 space-y-3">
                    <button
                      type="button"
                      onClick={() => {
                        if (handleClearHistory) {
                          handleClearHistory()
                          onClose()
                        }
                      }}
                      className="w-full px-4 py-2.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-600 dark:text-red-400 text-xs font-semibold border border-red-500/20 cursor-pointer transition-colors"
                    >
                      🗑️ Clear All Evaluation History
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Modal Footer with User Session & Log Out */}
        <div className="p-4 px-6 border-t border-white/5 bg-[#151F2E] flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-[#94A3B8] min-w-0 flex-1 mr-3">
            <span className="flex-shrink-0">👤</span>
            <span className="truncate font-medium text-slate-700 dark:text-slate-200">
              {generalConfig.userName || authUser?.email || "Evaluator User"}
            </span>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            {handleLogout && (
              <button
                onClick={() => {
                  onClose()
                  handleLogout()
                }}
                className="px-3.5 py-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-600 dark:text-red-400 border border-red-500/20 text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5"
              >
                <span>🚪 Log Out</span>
              </button>
            )}

            <button
              onClick={handleSaveSettings}
              disabled={saving}
              className="px-5 py-2 rounded-xl bg-[#20B866] hover:bg-emerald-600 text-white text-xs font-semibold border-none cursor-pointer shadow-sm shadow-emerald-500/30 transition-all flex items-center gap-1.5 disabled:opacity-50"
            >
              {saving ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <span>Save Framework Settings</span>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
