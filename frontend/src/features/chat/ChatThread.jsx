export default function ChatThread({
  activeChat,
  evaluating,
  messagesEndRef,
  QUICK_ACTIONS,
  setPrompt,
  handleSendPrompt,
}) {
  return (
    <div className="w-full flex-1 flex flex-col justify-start overflow-y-auto mb-4 px-1">
      {activeChat && activeChat.messages && activeChat.messages.length > 0 ? (
        <div className="space-y-4 py-2">
          {activeChat.messages.map((msg) => (
            <div
              key={msg.id}
              className={[
                "flex flex-col max-w-[92%] sm:max-w-[85%] rounded-2xl sm:rounded-3xl p-3.5 sm:p-4 text-[13.5px] sm:text-[14.5px] leading-relaxed shadow-xs transition-colors",
                msg.role === "user"
                  ? "ml-auto bg-[#1c1c1e] dark:bg-[#10b981] text-white rounded-br-[4px]"
                  : "mr-auto bg-white dark:bg-[#1f2937] border border-[#e2e2df] dark:border-[#374151] text-[#1c1c1e] dark:text-gray-100 rounded-bl-[4px]",
              ].join(" ")}
            >
              <div className="font-medium mb-1 flex items-center justify-between text-[11.5px] sm:text-[12px] opacity-70">
                <span>{msg.role === "user" ? "You" : "Evaluation Assistant"}</span>
                <span>{msg.timestamp}</span>
              </div>

              <div>{msg.content}</div>

              {/* Metrics Report Card */}
              {msg.metrics && (
                <div className="mt-3 pt-3 border-t border-[#eee] dark:border-[#374151] bg-[#f9faf9] dark:bg-[#111827] rounded-xl p-2.5 sm:p-3 text-[12px] sm:text-[12.5px] text-[#1c1c1e] dark:text-gray-100 space-y-2">
                  <div className="font-semibold text-[#1c7c46] dark:text-emerald-400 flex items-center justify-between flex-wrap gap-1">
                    <span className="flex items-center gap-1.5 text-[11.5px] sm:text-[12.5px]">📊 Evaluation Report ({msg.metrics.status})</span>
                    <span className="text-[10.5px] font-mono text-[#6b6f76] dark:text-gray-400 bg-white dark:bg-[#1f2937] px-2 py-0.5 rounded-md border border-[#e2e2df] dark:border-[#374151]">
                      {msg.metrics.genuineity || "Verified"}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 sm:gap-2">
                    <div className="bg-white dark:bg-[#1f2937] p-2 rounded-lg border border-[#e6e6e2] dark:border-[#374151]">
                      <div className="text-[10.5px] text-[#6b6f76] dark:text-gray-400">Latency</div>
                      <div className="font-semibold text-[12px] sm:text-[13px] text-[#1c1c1e] dark:text-gray-100">{msg.metrics.latency}</div>
                    </div>
                    <div className="bg-white dark:bg-[#1f2937] p-2 rounded-lg border border-[#e6e6e2] dark:border-[#374151]">
                      <div className="text-[10.5px] text-[#6b6f76] dark:text-gray-400">Accuracy</div>
                      <div className="font-semibold text-[12px] sm:text-[13px] text-[#1f9d55] dark:text-emerald-400">{msg.metrics.accuracy}</div>
                    </div>
                    <div className="bg-white dark:bg-[#1f2937] p-2 rounded-lg border border-[#e6e6e2] dark:border-[#374151]">
                      <div className="text-[10.5px] text-[#6b6f76] dark:text-gray-400">Safety Score</div>
                      <div className="font-semibold text-[12px] sm:text-[13px] text-[#1c1c1e] dark:text-gray-100">{msg.metrics.safety}</div>
                    </div>
                    <div className="bg-white dark:bg-[#1f2937] p-2 rounded-lg border border-[#e6e6e2] dark:border-[#374151]">
                      <div className="text-[10.5px] text-[#6b6f76] dark:text-gray-400">UI/UX Score</div>
                      <div className="font-semibold text-[12px] sm:text-[13px] text-[#1c1c1e] dark:text-gray-100">{msg.metrics.uiUxScore || "9.0/10"}</div>
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between text-[10.5px] sm:text-[11px] text-[#6b6f76] dark:text-gray-400 pt-1 gap-1">
                    <span>Source / Target: <span className="font-mono text-[#1c1c1e] dark:text-gray-200">{msg.metrics.sourceUsed}</span></span>
                    <span>Token Usage: <span className="font-mono text-[#1c1c1e] dark:text-gray-200">{msg.metrics.tokens} tk</span></span>
                  </div>
                </div>
              )}
            </div>
          ))}

          {evaluating && (
            <div className="mr-auto bg-white dark:bg-[#1f2937] border border-[#e2e2df] dark:border-[#374151] rounded-2xl sm:rounded-3xl p-3.5 sm:p-4 text-[13px] sm:text-[14px] text-[#6b6f76] dark:text-gray-300 flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-[#2fae63] border-t-transparent rounded-full animate-spin flex-shrink-0" />
              Running evaluation benchmarks...
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center text-center my-auto py-6 sm:py-8 px-2">
          <h1 className="text-[20px] sm:text-[32px] font-semibold text-[#141414] dark:text-gray-100 mb-2 sm:mb-3 leading-snug">
            Hii User, Enter Your Queries
          </h1>
          <p className="text-[13px] sm:text-[14.5px] text-[#6b6f76] dark:text-gray-400 max-w-[500px] mb-6 sm:mb-8">
            Enter your chatbot prompt below to test latency, precision, safety, and UI/UX accuracy in real time.
          </p>

          <div className="w-full max-w-[800px]">
            <div className="text-[11.5px] sm:text-[12.5px] font-semibold text-[#6b6f76] dark:text-gray-400 uppercase tracking-wider mb-3">
              Quick Evaluation Benchmarks
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-2.5">
              {QUICK_ACTIONS.map((action) => (
                <button
                  key={action.label}
                  onClick={() => {
                    setPrompt(action.promptText)
                    handleSendPrompt(action.promptText)
                  }}
                  className="flex items-center gap-2.5 sm:gap-3 bg-white dark:bg-[#1f2937] border border-[#e6e6e2] dark:border-[#374151] rounded-2xl p-2.5 sm:p-3 text-left hover:border-[#2fae63] dark:hover:border-[#2fae63] hover:shadow-xs cursor-pointer transition-all group"
                >
                  <div className="w-7 sm:w-8 h-7 sm:h-8 rounded-lg bg-[#f4f6f4] dark:bg-emerald-950/60 text-[#1c7c46] dark:text-emerald-400 flex items-center justify-center group-hover:bg-[#2fae63] group-hover:text-white transition-colors flex-shrink-0 text-sm sm:text-base">
                    {action.icon}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-[13px] sm:text-[14px] font-semibold text-[#1c1c1e] dark:text-gray-100">{action.label}</div>
                    <div className="text-[11.5px] sm:text-[12px] text-[#6b6f76] dark:text-gray-400 line-clamp-1">{action.promptText}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
