export default function EvaluationConfigCard({
  evalMode,
  setEvalMode,
  apiKey,
  setApiKey,
  targetUrl,
  setTargetUrl,
  showApiKey,
  setShowApiKey,
  notify,
}) {
  return (
    <div className="w-full bg-white/90 dark:bg-[#1f2937]/90 backdrop-blur-md border border-[#e2e2df] dark:border-[#374151] rounded-2xl sm:rounded-3xl p-3 sm:p-4 shadow-sm mb-4 transition-colors">
      {/* Mode selection tabs */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 mb-3 border-b border-[#ececec] dark:border-[#374151] pb-3 sm:pb-2">
        <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap sm:flex-nowrap">
          <button
            type="button"
            onClick={() => setEvalMode("apiKey")}
            className={[
              "flex-1 sm:flex-initial px-3 py-1.5 rounded-lg text-[12px] sm:text-[12.5px] font-semibold cursor-pointer border transition-colors text-center",
              evalMode === "apiKey"
                ? "bg-[#2fae63] text-white border-[#2fae63]"
                : "bg-[#f4f4f2] dark:bg-[#111827] text-[#6b6f76] dark:text-gray-300 border-transparent hover:bg-[#eaeaea]",
            ].join(" ")}
          >
            🔑 API Key Mode
          </button>
          <button
            type="button"
            onClick={() => setEvalMode("endpoint")}
            className={[
              "flex-1 sm:flex-initial px-3 py-1.5 rounded-lg text-[12px] sm:text-[12.5px] font-semibold cursor-pointer border transition-colors text-center",
              evalMode === "endpoint"
                ? "bg-[#2fae63] text-white border-[#2fae63]"
                : "bg-[#f4f4f2] dark:bg-[#111827] text-[#6b6f76] dark:text-gray-300 border-transparent hover:bg-[#eaeaea]",
            ].join(" ")}
          >
            🌐 Web Endpoint Check
          </button>
        </div>

        <span className="self-start sm:self-auto flex items-center gap-1.5 text-[11px] sm:text-[11.5px] font-medium px-2.5 py-0.5 rounded-full bg-[#edf7f1] dark:bg-emerald-950/80 text-[#1c7c46] dark:text-emerald-400">
          <span className="w-2 h-2 rounded-full bg-[#2fae63] animate-pulse" />
          {evalMode === "apiKey"
            ? (apiKey.trim() ? "Key Connected" : "No Key Set")
            : (targetUrl.trim() ? "Endpoint Set" : "No Endpoint")}
        </span>
      </div>

      {/* Input field based on mode */}
      {evalMode === "apiKey" ? (
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
          <div className="flex-1 flex items-center bg-[#f7f7f5] dark:bg-[#111827] border border-[#e6e6e2] dark:border-[#374151] rounded-xl px-3 py-2 focus-within:border-[#2fae63] transition-colors">
            <svg className="text-[#8e8e93] dark:text-gray-400 mr-2 flex-shrink-0" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>

            <input
              type={showApiKey ? "text" : "password"}
              placeholder="Enter your OpenAI, Anthropic, or Custom API key..."
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="flex-1 min-w-0 bg-transparent border-none outline-none text-[12.5px] sm:text-[13.5px] text-[#1c1c1e] dark:text-gray-100 placeholder-[#9a9a96] dark:placeholder-gray-500 font-mono"
            />

            <button
              type="button"
              onClick={() => setShowApiKey(!showApiKey)}
              className="text-[#8e8e93] hover:text-[#1c1c1e] dark:text-gray-400 dark:hover:text-white bg-transparent border-none cursor-pointer px-1 transition-colors flex-shrink-0"
              title={showApiKey ? "Hide Key" : "Show Key"}
            >
              {showApiKey ? (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                  <line x1="1" y1="1" x2="23" y2="23" />
                </svg>
              ) : (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              )}
            </button>
          </div>

          {apiKey && (
            <button
              onClick={() => {
                setApiKey("")
                notify("API key cleared")
              }}
              className="bg-[#f0f0ef] dark:bg-[#374151] hover:bg-[#e4e4e0] dark:hover:bg-gray-600 text-[#6b6f76] dark:text-gray-200 text-[12px] font-medium px-3 py-2 rounded-lg border-none cursor-pointer transition-colors flex-shrink-0"
            >
              Clear Key
            </button>
          )}
        </div>
      ) : (
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
          <div className="flex-1 flex items-center bg-[#f7f7f5] dark:bg-[#111827] border border-[#e6e6e2] dark:border-[#374151] rounded-xl px-3 py-2 focus-within:border-[#2fae63] transition-colors">
            <svg className="text-[#8e8e93] dark:text-gray-400 mr-2 flex-shrink-0" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <circle cx="12" cy="12" r="10" />
              <line x1="2" y1="12" x2="22" y2="12" />
              <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
            </svg>

            <input
              type="url"
              placeholder="Enter Chatbot API Endpoint or Web URL (e.g. https://mychatbot.com/api)..."
              value={targetUrl}
              onChange={(e) => setTargetUrl(e.target.value)}
              className="flex-1 min-w-0 bg-transparent border-none outline-none text-[12.5px] sm:text-[13.5px] text-[#1c1c1e] dark:text-gray-100 placeholder-[#9a9a96] dark:placeholder-gray-500 font-mono"
            />
          </div>

          {targetUrl && (
            <button
              onClick={() => {
                setTargetUrl("")
                notify("Endpoint URL cleared")
              }}
              className="bg-[#f0f0ef] dark:bg-[#374151] hover:bg-[#e4e4e0] dark:hover:bg-gray-600 text-[#6b6f76] dark:text-gray-200 text-[12px] font-medium px-3 py-2 rounded-lg border-none cursor-pointer transition-colors flex-shrink-0"
            >
              Clear Endpoint
            </button>
          )}
        </div>
      )}
    </div>
  )
}
