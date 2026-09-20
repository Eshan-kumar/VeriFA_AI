export default function Logo({ size = "md", showText = true, className = "" }) {
  const isSmall = size === "sm"
  return (
    <div className={`flex items-center gap-2.5 select-none ${className}`}>
      <div className={`${isSmall ? "w-7.5 h-7.5 rounded-xl text-sm" : "w-8.5 h-8.5 rounded-xl text-base"} bg-gradient-to-tr from-emerald-600 via-teal-500 to-indigo-600 text-white flex items-center justify-center shadow-md shadow-emerald-500/20 relative group transition-all duration-300`}>
        <svg width={isSmall ? "17" : "19"} height={isSmall ? "17" : "19"} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2L3 7v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-9-5z" />
          <path d="m9 12 2 2 4-4" />
        </svg>
        <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-400 animate-ping opacity-75" />
      </div>
      {showText && (
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5">
            <span className="font-bold text-[16px] tracking-tight text-slate-900 dark:text-slate-100 font-sans leading-none">
              VERIFA<span className="text-emerald-500 font-extrabold">.AI</span>
            </span>
            <span className="text-[9.5px] font-mono font-semibold px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 leading-none">
              PRO
            </span>
          </div>
          <span className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 tracking-wider uppercase mt-0.5">
            Chatbot Evaluator
          </span>
        </div>
      )}
    </div>
  )
}
