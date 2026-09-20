export default function ThemeToggleSlider({ darkMode, setDarkMode, label = true }) {
  return (
    <div
      onClick={() => setDarkMode(!darkMode)}
      className={[
        "flex items-center justify-between cursor-pointer select-none px-3 py-2 rounded-lg transition-all border",
        darkMode
          ? "bg-[#1f2937] hover:bg-[#374151] border-[#374151] text-gray-200"
          : "bg-[#f4f4f2] hover:bg-[#eaeaea] border-[#e2e2df] text-[#1c1c1e]",
      ].join(" ")}
      title="Toggle Dark / Light Mode Theme"
    >
      {label && (
        <span className="text-[13px] font-medium flex items-center gap-2">
          {darkMode ? <span>🌙 Dark Mode</span> : <span>☀️ Light Mode</span>}
        </span>
      )}
      <div
        className={[
          "w-10 h-5 rounded-full p-0.5 transition-colors relative flex items-center ml-auto",
          darkMode ? "bg-[#2fae63]" : "bg-[#d1d5db]",
        ].join(" ")}
      >
        <div
          className={[
            "w-4 h-4 rounded-full bg-white shadow-md transform transition-transform duration-200 flex items-center justify-center text-[9px]",
            darkMode ? "translate-x-5" : "translate-x-0",
          ].join(" ")}
        >
          {darkMode ? "🌙" : "☀️"}
        </div>
      </div>
    </div>
  )
}
