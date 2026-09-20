import { useState, useEffect, useRef } from "react"
import { supabase } from "../../lib/supabaseClient"

export default function AuthModal({
  isOpen,
  onClose,
  onLoginSuccess,
  initialEmail = "",
}) {
  const [step, setStep] = useState("email") // "email" | "otp"
  const [email, setEmail] = useState(initialEmail)
  const [otpDigits, setOtpDigits] = useState(["", "", "", "", "", ""])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [infoMessage, setInfoMessage] = useState(null)
  const [devOtpCode, setDevOtpCode] = useState(null)

  // Resend cooldown timer
  const [cooldown, setCooldown] = useState(0)

  const otpInputRefs = [
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
  ]

  useEffect(() => {
    if (initialEmail) setEmail(initialEmail)
  }, [initialEmail])

  // Countdown timer effect for resend cooldown
  useEffect(() => {
    if (cooldown <= 0) return
    const timer = setInterval(() => {
      setCooldown((prev) => prev - 1)
    }, 1000)
    return () => clearInterval(timer)
  }, [cooldown])

  if (!isOpen) return null

  // Step 1: Send Passwordless OTP Code
  const handleSendCode = async (e) => {
    if (e) e.preventDefault()
    setError(null)
    setInfoMessage(null)

    if (!email || !email.includes("@")) {
      setError("Please enter a valid email address.")
      return
    }

    setLoading(true)
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          shouldCreateUser: true,
        },
      })
      if (error) throw error

      setStep("otp")
      setInfoMessage(`We've sent a 6-digit code to ${email}`)
      setCooldown(60) // 60-second cooldown before resend
      // Focus first OTP digit input
      setTimeout(() => otpInputRefs[0].current?.focus(), 100)
    } catch (err) {
      setError(err.message || "Failed to send auth code. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  // Handle OTP digit changes
  const handleDigitChange = (index, value) => {
    // Only accept numeric digit
    const digit = value.replace(/[^0-9]/g, "").slice(-1)
    const newDigits = [...otpDigits]
    newDigits[index] = digit
    setOtpDigits(newDigits)
    setError(null)

    // Auto-advance to next input field
    if (digit && index < 5) {
      otpInputRefs[index + 1].current?.focus()
    }

    // If all 6 digits are filled, automatically submit verification
    if (digit && index === 5 && newDigits.every((d) => d !== "")) {
      verifyCode(newDigits.join(""))
    }
  }

  // Handle backspace navigation between inputs
  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otpDigits[index] && index > 0) {
      otpInputRefs[index - 1].current?.focus()
    }
  }

  // Handle paste full 6-digit code
  const handlePaste = (e) => {
    e.preventDefault()
    const pasted = e.clipboardData.getData("text").replace(/[^0-9]/g, "").slice(0, 6)
    if (pasted.length === 6) {
      const digits = pasted.split("")
      setOtpDigits(digits)
      verifyCode(pasted)
    }
  }

  // Step 2: Verify OTP Code
  const verifyCode = async (codeToVerify) => {
    const code = codeToVerify || otpDigits.join("")
    if (code.length < 6) {
      setError("Please enter the complete 6-digit code.")
      return
    }

    setError(null)
    setLoading(true)
    try {
      const { data, error } = await supabase.auth.verifyOtp({
        email,
        token: code,
        type: 'email',
      })
      if (error) throw error

      onLoginSuccess(data.user)
      onClose()
    } catch (err) {
      setError(err.message || "Invalid or expired code. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-[#0f111a] border border-slate-800 rounded-3xl max-w-[440px] w-full p-7 shadow-2xl text-white relative animate-in zoom-in-95 duration-200">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-white border-none bg-transparent cursor-pointer p-1 transition-colors"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        {/* Badge Icon */}
        <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-emerald-500 via-purple-500 to-indigo-500 flex items-center justify-center font-bold text-xl mb-4 shadow-lg shadow-purple-500/20">
          ✦
        </div>

        {/* STEP 1: EMAIL INPUT */}
        {step === "email" ? (
          <div>
            <h2 className="text-2xl font-extrabold tracking-tight text-white mb-1.5 font-sans">
              Passwordless Auth
            </h2>
            <p className="text-xs text-slate-400 leading-relaxed mb-6">
              Enter your email to sign in or create an account automatically. No passwords required.
            </p>

            {error && (
              <div className="mb-4 p-3 rounded-xl bg-red-950/50 border border-red-800/60 text-red-300 text-xs flex items-center gap-2">
                <span>⚠️</span>
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSendCode} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value)
                    setError(null)
                  }}
                  className="w-full bg-[#07090e] border border-slate-800 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all font-medium"
                  required
                  autoFocus
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-emerald-500 via-purple-600 to-indigo-600 hover:opacity-95 text-white font-semibold py-3.5 rounded-xl border-none cursor-pointer transition-all shadow-lg shadow-emerald-500/20 text-sm flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? (
                  <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Send Auth Code</span>
                    <span>→</span>
                  </>
                )}
              </button>
            </form>
          </div>
        ) : (
          /* STEP 2: 6-DIGIT OTP ENTRY */
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <h2 className="text-2xl font-extrabold tracking-tight text-white font-sans">
                Check Your Inbox
              </h2>
              <button
                onClick={() => {
                  setStep("email")
                  setError(null)
                }}
                className="text-xs text-slate-400 hover:text-emerald-400 bg-transparent border-none cursor-pointer underline"
              >
                Change Email
              </button>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed mb-4">
              Enter the 6-digit code sent to <strong className="text-slate-200">{email}</strong>
            </p>

            {/* Dev helper badge (only rendered if ENABLE_DEV_OTP=true in .env) */}
            {devOtpCode && (
              <div className="mb-4 p-2.5 rounded-xl bg-purple-950/40 border border-purple-800/50 flex items-center justify-between text-xs">
                <span className="text-purple-300 font-medium">⚡ Demo Code: <strong className="text-white font-mono tracking-widest">{devOtpCode}</strong></span>
                <button
                  type="button"
                  onClick={() => {
                    const digits = devOtpCode.split("")
                    setOtpDigits(digits)
                    verifyCode(devOtpCode)
                  }}
                  className="px-2 py-1 rounded-lg bg-purple-600 text-white font-semibold text-[11px] cursor-pointer hover:bg-purple-500 transition-colors border-none"
                >
                  Auto-Fill Code
                </button>
              </div>
            )}

            {error && (
              <div className="mb-4 p-3 rounded-xl bg-red-950/50 border border-red-800/60 text-red-300 text-xs flex items-center gap-2">
                <span>⚠️</span>
                <span>{error}</span>
              </div>
            )}

            {/* 6 Segmented Input Digits */}
            <div className="flex items-center justify-between gap-1.5 sm:gap-2 mb-6" onPaste={handlePaste}>
              {otpDigits.map((digit, idx) => (
                <input
                  key={idx}
                  ref={otpInputRefs[idx]}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleDigitChange(idx, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(idx, e)}
                  className={[
                    "flex-1 max-w-[48px] h-12 sm:h-14 bg-[#07090e] border text-center text-lg sm:text-xl font-bold rounded-xl outline-none transition-all font-mono",
                    digit
                      ? "border-emerald-500 text-emerald-400 bg-emerald-950/20"
                      : "border-slate-800 text-white focus:border-purple-500",
                  ].join(" ")}
                />
              ))}
            </div>

            <button
              onClick={() => verifyCode()}
              disabled={loading || otpDigits.some((d) => d === "")}
              className="w-full bg-gradient-to-r from-emerald-500 via-purple-600 to-indigo-600 hover:opacity-95 text-white font-semibold py-3.5 rounded-xl border-none cursor-pointer transition-all shadow-lg shadow-purple-500/20 text-sm flex items-center justify-center gap-2 disabled:opacity-50 mb-4"
            >
              {loading ? (
                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <span>Verify & Continue →</span>
              )}
            </button>

            {/* Resend Cooldown Section */}
            <div className="text-center text-xs">
              {cooldown > 0 ? (
                <span className="text-slate-500">
                  Resend code in <strong className="text-slate-400">{cooldown}s</strong>
                </span>
              ) : (
                <button
                  onClick={handleSendCode}
                  disabled={loading}
                  className="text-emerald-400 hover:text-emerald-300 font-semibold bg-transparent border-none cursor-pointer"
                >
                  Didn't receive a code? Resend Code
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
