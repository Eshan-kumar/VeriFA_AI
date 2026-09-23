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
}) {
  return (
    <header className="flex items-center justify-between px-3 sm:px-4 py-2.5 sm:py-3 bg-white/80 backdrop-blur-md border-b-[3px] border-neu-border border-[#ececec]">
      <div className="flex items-center gap-2 sm:gap-3">
        <button
          className="md:hidden w-10 h-10 flex items-center justify-center text-[#1c1c1e] hover:bg-[#f0f0ef] border-none bg-transparent cursor-pointer transition-colors active:scale-95"
          onClick={() => setSidebarOpen(true)}
          aria-label="Open sidebar"
        >
          <MenuIcon />
        </button>
        <Logo size="sm" />
      </div>

    </header>
  )
}
