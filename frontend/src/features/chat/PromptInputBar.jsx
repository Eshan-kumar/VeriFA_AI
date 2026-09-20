export default function PromptInputBar({
  prompt,
  setPrompt,
  evaluating,
  selectedModel,
  setSelectedModel,
  isModelDropdownOpen,
  setIsModelDropdownOpen,
  modelDropdownRef,
  MODEL_OPTIONS,
  isRecording,
  handleVoiceToggle,
  handleSendPrompt,
  handleKeyDown,
  notify,
}) {
  return (
    <div className="w-full max-w-[900px]">
      <div className="relative flex items-center gap-2 bg-white dark:bg-[#1f2937] border border-[#e6e6e2] dark:border-[#374151] rounded-3xl px-3 sm:px-4 py-2 shadow-[0_8px_30px_rgba(0,0,0,0.05)] focus-within:border-[#2fae63] transition-all">
        {/* Input */}
        <input
          className="flex-1 min-w-0 border-none outline-none text-[14px] sm:text-[15px] bg-transparent text-[#1c1c1e] dark:text-gray-100 placeholder-[#9a9a96] dark:placeholder-gray-400 font-sans"
          type="text"
          placeholder="Ask a question or enter prompt for chatbot evaluation…"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={handleKeyDown}
        />

        {/* Model Dropdown */}
        <div className="relative block" ref={modelDropdownRef}>
          <button
            type="button"
            onClick={() => setIsModelDropdownOpen(!isModelDropdownOpen)}
            className="flex items-center gap-1 text-[11px] sm:text-[13.5px] font-medium text-[#1c1c1e] dark:text-gray-200 bg-[#f7f7f5] dark:bg-[#111827] border border-[#e6e6e2] dark:border-[#374151] cursor-pointer px-2 sm:px-2.5 py-1 sm:py-1.5 rounded-xl hover:bg-[#eeeee9] dark:hover:bg-[#374151] transition-colors"
          >
            <span className="truncate max-w-[65px] sm:max-w-none">{selectedModel.split(" ")[0]}</span>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="flex-shrink-0">
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </button>

          {isModelDropdownOpen && (
            <div className="absolute right-0 bottom-10 w-[180px] sm:w-[200px] bg-white dark:bg-[#1f2937] border border-[#e6e6e2] dark:border-[#374151] rounded-xl shadow-lg p-1.5 z-40 text-[12px] sm:text-[13px]">
              {MODEL_OPTIONS.map((opt) => (
                <div
                  key={opt}
                  onClick={() => {
                    setSelectedModel(opt)
                    setIsModelDropdownOpen(false)
                    notify(`Evaluation engine set to ${opt}`)
                  }}
                  className={[
                    "px-2.5 py-1.5 rounded-lg cursor-pointer hover:bg-[#f4f4f2] dark:hover:bg-[#374151]",
                    selectedModel === opt
                      ? "font-semibold text-[#1c7c46] dark:text-emerald-400 bg-[#edf7f1] dark:bg-emerald-950/60"
                      : "text-[#1c1c1e] dark:text-gray-200",
                  ].join(" ")}
                >
                  {opt}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Voice Button */}
        <button
          type="button"
          onClick={handleVoiceToggle}
          className={[
            "w-[36px] h-[36px] rounded-full border-none flex items-center justify-center cursor-pointer flex-shrink-0 transition-all",
            isRecording
              ? "bg-[#d32f2f] text-white animate-pulse"
              : "bg-[#f2f2ef] dark:bg-[#111827] text-[#1c1c1e] dark:text-gray-200 hover:bg-[#e9e9e5] dark:hover:bg-[#374151]",
          ].join(" ")}
          title={isRecording ? "Stop Listening" : "Voice input"}
        >
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="9" y="2" width="6" height="12" rx="3" />
            <path d="M5 10a7 7 0 0 0 14 0" />
            <line x1="12" y1="19" x2="12" y2="22" />
          </svg>
        </button>

        {/* Send Button */}
        <button
          type="button"
          onClick={() => handleSendPrompt()}
          disabled={!prompt.trim() || evaluating}
          className={[
            "w-[36px] h-[36px] rounded-full border-none flex items-center justify-center cursor-pointer flex-shrink-0 transition-all",
            prompt.trim() && !evaluating
              ? "bg-[#2fae63] text-white hover:bg-[#1c7c46] shadow-sm"
              : "bg-[#e4e4e0] dark:bg-[#374151] text-[#a0a09c] dark:text-gray-500 cursor-not-allowed",
          ].join(" ")}
          title="Send Prompt for Evaluation"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
            <line x1="22" y1="2" x2="11" y2="13" />
            <polygon points="22 2 15 22 11 13 2 9 22 2" />
          </svg>
        </button>
      </div>

      <div className="text-center text-[11.5px] text-[#8e8e93] dark:text-gray-400 mt-2">
        Chatbot Checker evaluates response accuracy & latency in real-time.
      </div>
    </div>
  )
}
