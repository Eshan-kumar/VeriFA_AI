import Logo from "../../shared/components/Logo"

export default function Sidebar({
  darkMode,
  setDarkMode,
  sidebarOpen,
  setSidebarOpen,
  activeNav,
  setActiveNav,
  activeChatId,
  activeChat,
  filteredChats,
  searchQuery,
  setSearchQuery,
  showSearchInput,
  setShowSearchInput,
  showUserMenu,
  setShowUserMenu,
  userMenuRef,
  handleNewChat,
  handleSelectChat,
  handleDeleteChat,
  setShowUpgradeModal,
  setChats,
  setActiveChatId,
  notify,
  onOpenSettings,
}) {
  const sidebarInner = (
    <>
      {/* Brand row */}
      <div className="flex items-center justify-between mb-4 px-1">
        <Logo size="md" />
        {/* Mobile close button */}
        <button
          className="md:hidden w-8 h-8 rounded-lg flex items-center justify-center text-[#6b6f76] dark:text-gray-400 hover:bg-[#f0f0ef] dark:hover:bg-gray-800 border-none bg-transparent cursor-pointer transition-colors"
          onClick={() => setSidebarOpen(false)}
          title="Close sidebar"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <rect x="3" y="4" width="18" height="16" rx="3" />
            <line x1="9" y1="4" x2="9" y2="20" />
          </svg>
        </button>
      </div>

      {/* Nav items */}
      <button
        onClick={() => {
          handleNewChat()
          setSidebarOpen(false)
        }}
        className={[
          "flex items-center gap-3 px-3 py-[10px] rounded-lg text-[14px] font-medium cursor-pointer mb-1 w-full text-left border-none transition-colors",
          activeNav === "New Chat" && activeChat?.messages?.length === 0
            ? darkMode ? "bg-[#1f2937] font-semibold text-white" : "bg-[#eef0ee] font-semibold text-[#1c1c1e]"
            : darkMode ? "bg-transparent text-gray-300 hover:bg-[#1f2937]" : "bg-transparent text-[#1c1c1e] hover:bg-[#f0f0ef]",
        ].join(" ")}
      >
        <span className="opacity-80 flex-shrink-0">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M12 20h9" />
            <path d="M16.5 3.5a2.1 2.1 0 1 1 3 3L7 19l-4 1 1-4Z" />
          </svg>
        </span>
        <span className="flex-1">New Chat</span>
      </button>

      <button
        onClick={() => {
          setActiveNav("Search Chats")
          setShowSearchInput(!showSearchInput)
        }}
        className={[
          "flex items-center gap-3 px-3 py-[10px] rounded-lg text-[14px] font-medium cursor-pointer mb-1 w-full text-left border-none transition-colors",
          showSearchInput || activeNav === "Search Chats"
            ? darkMode ? "bg-[#1f2937] font-semibold text-white" : "bg-[#eef0ee] font-semibold text-[#1c1c1e]"
            : darkMode ? "bg-transparent text-gray-300 hover:bg-[#1f2937]" : "bg-transparent text-[#1c1c1e] hover:bg-[#f0f0ef]",
        ].join(" ")}
      >
        <span className="opacity-80 flex-shrink-0">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <circle cx="11" cy="11" r="7" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        </span>
        <span className="flex-1">Search Chats</span>
      </button>

      {/* Filter search input */}
      {showSearchInput && (
        <div className="px-1 my-1.5">
          <input
            type="text"
            placeholder="Filter chat history..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#f4f4f2] dark:bg-[#1f2937] border border-[#e2e2df] dark:border-[#374151] text-[#1c1c1e] dark:text-gray-100 rounded-lg px-2.5 py-1.5 text-[13px] outline-none focus:border-[#2fae63] transition-colors"
            autoFocus
          />
        </div>
      )}

      {/* Recent History header */}
      <div className="text-[12px] text-[#6b6f76] dark:text-gray-400 mt-4 mb-1.5 px-1 font-medium flex items-center justify-between">
        <span>Recent History</span>
        <span className="text-[11px] bg-[#f0f0ef] dark:bg-[#1f2937] dark:text-gray-300 px-1.5 py-0.5 rounded-full">{filteredChats.length}</span>
      </div>

      <div className="flex-1 overflow-y-auto pr-0.5 space-y-0.5">
        {filteredChats.map((chat) => {
          const isActive = chat.id === activeChatId
          return (
            <div
              key={chat.id}
              onClick={() => {
                handleSelectChat(chat.id)
                setSidebarOpen(false)
              }}
              className={[
                "group flex items-center justify-between px-3 py-2 rounded-lg text-[13.5px] cursor-pointer transition-colors",
                isActive
                  ? darkMode ? "bg-[#1f2937] font-semibold text-white" : "bg-[#eef0ee] font-semibold text-[#1c1c1e]"
                  : darkMode ? "text-gray-300 hover:bg-[#1f2937]" : "text-[#3a3a3c] hover:bg-[#f0f0ef]",
              ].join(" ")}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <span className="opacity-70 flex-shrink-0">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <rect x="3" y="4" width="7" height="16" rx="1.5" />
                    <rect x="14" y="4" width="7" height="16" rx="1.5" />
                  </svg>
                </span>
                <span className="truncate">{chat.title}</span>
              </div>
              <button
                onClick={(e) => handleDeleteChat(e, chat.id)}
                className="opacity-70 md:opacity-0 group-hover:opacity-100 text-[#8e8e93] hover:text-[#d32f2f] bg-transparent border-none p-1 cursor-pointer transition-opacity"
                title="Delete chat"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="3 6 5 6 21 6" />
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                </svg>
              </button>
            </div>
          )
        })}

        {filteredChats.length === 0 && (
          <div className="text-[13px] text-[#8e8e93] dark:text-gray-500 px-3 py-4 text-center">No chats match search</div>
        )}
      </div>

      {/* Footer / Plan card */}
      <div className="mt-auto pt-3 border-t border-[#ececec] dark:border-[#1f2937]">
        <div className="bg-[#fafaf8] dark:bg-[#1f2937] border border-[#ececec] dark:border-[#374151] rounded-xl p-3 mb-2.5">
          <div className="flex items-center gap-2 text-[13.5px] font-semibold mb-2.5 text-[#1c1c1e] dark:text-gray-100">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M12 2 4 7v6c0 5 3.5 8.5 8 9 4.5-.5 8-4 8-9V7Z" />
            </svg>
            Free Plan
          </div>
          <button
            onClick={() => {
              setShowUpgradeModal(true)
              setSidebarOpen(false)
            }}
            className="w-full bg-[#141414] dark:bg-[#2fae63] text-white border-none rounded-lg py-2 text-[13px] font-semibold flex items-center justify-center gap-2 cursor-pointer hover:bg-black dark:hover:bg-[#1c7c46] transition-colors"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M5 16 2 6l5.5 3L12 3l4.5 6L22 6l-3 10Z" />
            </svg>
            Upgrade Now
          </button>
        </div>

        {/* User profile card & settings trigger */}
        <div className="relative">
          <div
            onClick={() => {
              if (onOpenSettings) onOpenSettings()
              setSidebarOpen(false)
            }}
            className="flex items-center justify-between p-2 rounded-xl bg-[#fafaf8] dark:bg-[#1f2937] border border-[#ececec] dark:border-[#374151] hover:bg-[#f0f0ef] dark:hover:bg-[#374151]/80 cursor-pointer transition-all"
            title="Click to open Settings & Preferences"
          >
            <div className="flex items-center gap-2.5 min-w-0 flex-1">
              <div className="w-7.5 h-7.5 rounded-full bg-gradient-to-br from-[#2fae63] to-[#1c7c46] text-white flex items-center justify-center font-bold text-[13px] flex-shrink-0 shadow-xs">
                U
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[13.5px] font-semibold leading-tight truncate text-[#1c1c1e] dark:text-gray-100">Evaluator User</div>
                <div className="text-[11.5px] text-[#2fae63] dark:text-emerald-400 font-medium">Free Account</div>
              </div>
            </div>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                if (onOpenSettings) onOpenSettings()
                setSidebarOpen(false)
              }}
              className="w-7 h-7 rounded-lg flex items-center justify-center text-[#6b6f76] hover:text-[#1c1c1e] dark:text-gray-400 dark:hover:text-white hover:bg-[#e4e4e0] dark:hover:bg-slate-700 border-none bg-transparent cursor-pointer transition-colors flex-shrink-0"
              title="Open Settings & Preferences"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.38a2 2 0 0 0-.73-2.73l-.15-.1a2 2 0 0 1-1-1.72v-.51a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </>
  )

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-[280px] min-w-[280px] bg-white dark:bg-[#111827] border-r border-[#ececec] dark:border-[#1f2937] flex-col px-4 py-4 overflow-y-auto transition-colors duration-200">
        {sidebarInner}
      </aside>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 md:hidden bg-black/50 backdrop-blur-xs"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      <aside
        className={[
          "fixed top-0 left-0 z-50 h-full w-[85vw] max-w-[280px] bg-white dark:bg-[#111827] border-r border-[#ececec] dark:border-[#1f2937] flex flex-col px-4 py-4 overflow-y-auto transition-transform duration-300 md:hidden shadow-2xl",
          sidebarOpen ? "translate-x-0" : "-translate-x-full",
        ].join(" ")}
      >
        {sidebarInner}
      </aside>
    </>
  )
}
