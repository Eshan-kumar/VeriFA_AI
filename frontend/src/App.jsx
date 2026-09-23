import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { supabase } from './lib/supabaseClient';

// Public Landing Pages
import PublicLayout from './features/landing/PublicLayout';
import Hero from './features/landing/Hero';
import AIBenchmarksPage from './features/landing/pages/AIBenchmarksPage';
import RiskAnalyticsPage from './features/landing/pages/RiskAnalyticsPage';
import ModelSafetyPage from './features/landing/pages/ModelSafetyPage';
import ApiDocsPage from './features/landing/pages/ApiDocsPage';
import PricingPage from './features/landing/pages/PricingPage';

// Authentication and App
import Auth from './components/Auth';
import Dashboard from './components/Dashboard';

export default function App() {
  const [authUser, setAuthUser] = useState(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setAuthUser(session?.user ?? null);
      setIsAuthLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setAuthUser(session?.user ?? null);
      setIsAuthLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (isAuthLoading) {
    return (
      <div className="min-h-screen bg-neu-bg flex items-center justify-center">
        <div className="animate-pulse text-neu-primary font-black uppercase">Loading VERIFA.AI...</div>
      </div>
    );
  }

  // A wrapper for public routes that redirects to dashboard if already logged in
  const PublicRoute = ({ element }) => {
    if (authUser) {
      return <Navigate to="/dashboard" replace />;
    }
    return element;
  };

  return (
    <Routes>
      {/* Public Routes with the Layout */}
      <Route element={<PublicLayout onLoginClick={() => navigate('/auth')} />}>
        <Route path="/" element={<PublicRoute element={<Hero onPrimaryCtaClick={() => navigate('/auth')} />} />} />
        <Route path="/ai-benchmarks" element={<AIBenchmarksPage />} />
        <Route path="/risk-analytics" element={<RiskAnalyticsPage />} />
        <Route path="/model-safety" element={<ModelSafetyPage />} />
        <Route path="/api-docs" element={<ApiDocsPage />} />
        <Route path="/pricing" element={<PricingPage />} />
      </Route>

      {/* Authentication Route */}
      <Route 
        path="/auth" 
        element={
          authUser ? <Navigate to="/dashboard" replace /> : <Auth />
        } 
      />

      {/* Private Application Dashboard */}
      <Route path="/dashboard" element={<Dashboard />} />
      
      {/* Catch-all redirect */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
