import React, { useState } from 'react';
import { supabase } from '../lib/supabaseClient';

export default function Auth() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
        });
        if (error) throw error;
        alert('Check your email for the confirmation link!');
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
      }
    } catch (err) {
      setError(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-neu-bg p-4 font-sans text-neu-text">
      <div className="bg-neu-surface border-[3px] border-neu-border p-8 max-w-md w-full shadow-neu">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-neu-primary border-[2px] border-neu-border mb-5 shadow-neu text-neu-text">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
              <polyline points="9 12 11 14 15 10"></polyline>
            </svg>
          </div>
          <div className="font-black text-neu-text text-2xl leading-tight flex justify-center items-center gap-2 mb-1 uppercase">
            VERIFA.AI <span className="bg-neu-primary text-neu-text text-[11px] font-bold px-2 py-0.5 tracking-wide border-2 border-neu-border shadow-neu">PRO</span>
          </div>
          <div className="text-[11px] text-neu-text/70 tracking-widest font-bold mb-4 uppercase">CHATBOT EVALUATOR</div>
          <h1 className="text-xl font-black text-neu-text tracking-tight uppercase">
            {isSignUp ? 'Create an Account' : 'Welcome Back'}
          </h1>
          <p className="text-sm text-neu-text/80 mt-2 font-medium">
            {isSignUp ? 'Sign up to start evaluating AI models' : 'Sign in to access your dashboard'}
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-100 border-[3px] border-neu-border shadow-neu text-red-700 text-sm font-bold flex items-center gap-2">
            <span>⚠️</span>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleAuth} className="space-y-5">
          <div>
            <label className="block text-sm font-bold text-neu-text mb-1.5 uppercase">Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-neu-bg border-[3px] border-neu-border px-4 py-3 text-neu-text focus:outline-none focus:shadow-neu transition-all text-[14px] font-medium"
              placeholder="you@company.com"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-neu-text mb-1.5 uppercase">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-neu-bg border-[3px] border-neu-border px-4 py-3 text-neu-text focus:outline-none focus:shadow-neu transition-all text-[14px] font-medium"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-neu-primary hover:bg-neu-primary/90 text-neu-text font-black py-3.5 border-[3px] border-neu-border transition-all shadow-neu active:translate-x-[2px] active:translate-y-[2px] active:shadow-none disabled:opacity-50 disabled:cursor-not-allowed mt-2 text-[15px] uppercase flex items-center justify-center gap-2"
          >
            {loading && (
              <svg className="animate-spin h-5 w-5 text-neu-text" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            )}
            {loading ? 'Processing...' : isSignUp ? 'Sign Up' : 'Sign In'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-sm text-neu-text hover:text-neu-secondary transition-colors bg-transparent border-none cursor-pointer font-bold uppercase"
          >
            {isSignUp ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
          </button>
        </div>
      </div>
    </div>
  );
}
