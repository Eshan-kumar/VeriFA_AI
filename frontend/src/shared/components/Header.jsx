import Logo from "./Logo"

function MenuIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="3" y1="6" x2="21" y2="6" />
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="3" y1="18" x2="21" y2="18" />
    </svg>
  )
}

export default function Header({
  setSidebarOpen,
  darkMode,
  onToggleDarkMode,
}) {
  return (
    <header className="flex items-center justify-between px-3 sm:px-4 py-2.5 sm:py-3 bg-white/80 dark:bg-[#111827]/80 backdrop-blur-md border-b border-[#ececec] dark:border-[#1f2937]">
      <div className="flex items-center gap-2 sm:gap-3">
        <button
          className="md:hidden w-10 h-10 rounded-xl flex items-center justify-center text-[#1c1c1e] dark:text-gray-200 hover:bg-[#f0f0ef] dark:hover:bg-gray-800 border-none bg-transparent cursor-pointer transition-colors active:scale-95"
          onClick={() => setSidebarOpen(true)}
          aria-label="Open sidebar"
        >
          <MenuIcon />
        </button>
        <Logo size="sm" />
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={() => onToggleDarkMode && onToggleDarkMode()}
          className={[
            "flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[12.5px] sm:text-[13px] font-medium border cursor-pointer transition-all active:scale-95",
            darkMode
              ? "bg-[#1f2937] text-amber-300 border-[#374151] hover:bg-[#374151]"
              : "bg-white text-[#1c1c1e] border-[#e2e2df] hover:bg-[#f4f4f2]",
          ].join(" ")}
          title="Toggle Dark / Light Mode"
        >
          <span>{darkMode ? "🌙 Dark" : "☀️ Light"}</span>
        </button>
      </div>
    </header>
  )
}
