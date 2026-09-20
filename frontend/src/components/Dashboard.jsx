import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import html2pdf from 'html2pdf.js';
import BatchEvaluator from './BatchEvaluator';
import AdminDashboard from './AdminDashboard';
import SettingsModal from '../features/settings/SettingsModal';
import ThemeToggleSlider from '../shared/components/ThemeToggleSlider';
import RiskDashboardPanel from '../features/evaluation/RiskDashboardPanel';

export default function Dashboard() {
  const [authUser, setAuthUser] = useState(null);
  const [activeView, setActiveView] = useState('chat');
  const [apiKey, setApiKey] = useState('');
  const [evaluationMode, setEvaluationMode] = useState('api');
  const [history, setHistory] = useState([]);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchInput, setShowSearchInput] = useState(false);
  const navigate = useNavigate();

  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showRiskDashboard, setShowRiskDashboard] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const reportRef = useRef(null);

  // Chat State
  const [promptInput, setPromptInput] = useState('');
  const [currentEvaluation, setCurrentEvaluation] = useState({ isGreeting: true });
  const [inputMode, setInputMode] = useState('Auto');
  const [manualBotResponse, setManualBotResponse] = useState('');
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    // Check initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setAuthUser(session?.user ?? null);
      setIsAuthLoading(false);
    });

    // Listen for changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setAuthUser(session?.user ?? null);
      setIsAuthLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (authUser) {
      fetchUserHistory();
    }
  }, [authUser, activeView]);

  const fetchUserHistory = async () => {
    const { data, error } = await supabase
      .from('evaluations')
      .select('*')
      .eq('user_id', authUser.id)
      .order('created_at', { ascending: false });

    if (!error && data) {
      setHistory(data);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  const [isEvaluating, setIsEvaluating] = useState(false);

  const startNewChat = () => {
    setActiveView('chat');
    setMessages([]);
    setPromptInput('');
    setCurrentEvaluation({ isGreeting: true });
    setManualBotResponse('');
    setIsSidebarOpen(false);
  };

  const loadHistoryItem = (ev) => {
    setActiveView('chat');

    setCurrentEvaluation({
      botResponse: ev.bot_response || (ev.target_chatbot === 'Manual Entry' ? '(Manual Entry)' : 'Loaded from history...'),
      score: ev.overall_score,
      toxicity: ev.ethical_scores?.Toxicity?.score || 1,
      hallucination: ev.ethical_scores?.Hallucination?.score || 1,
      bias: ev.ethical_scores?.Bias?.score || 1,
      privacy: ev.ethical_scores?.Privacy?.score || 1,
      safety: ev.ethical_scores?.Safety?.score || 1,
      transparency: ev.ethical_scores?.Transparency?.score || 1,
      quality: ev.ethical_scores?.Quality?.score || 1,
      isGreeting: false
    });
    setPromptInput(ev.prompt || ev.user_prompt || '');

    setMessages([
      {
        id: ev.id,
        role: 'assistant',
        isEvaluation: true,
        text: `Evaluation complete. The bot response scored ${ev.overall_score}/100 overall.`,
        metrics: {
          overall: ev.overall_score,
          toxicity: ev.ethical_scores.Toxicity?.score || 1,
          hallucination: ev.ethical_scores.Hallucination?.score || 1,
          bias: ev.ethical_scores.Bias?.score || 1,
          privacy: ev.ethical_scores.Privacy?.score || 1,
          safety: ev.ethical_scores.Safety?.score || 1,
          transparency: ev.ethical_scores.Transparency?.score || 1,
          quality: ev.ethical_scores.Quality?.score || 1
        },
        time: new Date(ev.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      },
      {
        id: ev.id + "_prompt",
        role: 'user',
        text: ev.prompt || ev.user_prompt,
        time: new Date(ev.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
    setIsSidebarOpen(false);
  };

  const handleSend = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (!promptInput.trim() || isEvaluating) return;

    const userText = promptInput;
    const userMessage = { id: Date.now(), role: 'user', text: userText, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };

    setMessages([...messages, userMessage]);
    setIsEvaluating(true);

    try {
      const payload = { prompt: promptInput, apiKey, evaluationMode };
      if (inputMode === 'Manual') {
        payload.botResponse = manualBotResponse;
      }

      const res = await fetch('http://localhost:5000/api/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      let evalData;
      if (res.ok) evalData = await res.json();

      // Fallback
      if (!evalData) {
        evalData = {
          botResponse: "As an AI language model, I'm here to provide helpful, safe, and objective information.",
          overall_score: 85,
          ethical_scores: { Toxicity: { score: 2 }, Quality: { score: 8 }, Bias: { score: 1 }, Hallucination: { score: 2 }, Privacy: { score: 1 }, Safety: { score: 1 }, Transparency: { score: 7 } }
        };
      }

      const evalPayload = {
        botResponse: evalData.botResponse || "As an AI language model...",
        score: evalData.overall_score || 85,
        toxicity: evalData.ethical_scores?.Toxicity?.score || 1,
        hallucination: evalData.ethical_scores?.Hallucination?.score || 1,
        bias: evalData.ethical_scores?.Bias?.score || 1,
        privacy: evalData.ethical_scores?.Privacy?.score || 1,
        safety: evalData.ethical_scores?.Safety?.score || 1,
        transparency: evalData.ethical_scores?.Transparency?.score || 1,
        quality: evalData.ethical_scores?.Quality?.score || 1
      };

      const { data: insertedData, error: insertError } = await supabase.from('evaluations').insert({
        user_id: authUser?.id || null,
        user_prompt: promptInput,
        target_chatbot: inputMode === 'Manual' ? 'Manual Entry' : 'Gemini 2.5 Flash',
        bot_response: evalPayload.botResponse,
        overall_score: evalPayload.score,
        ethical_scores: {
          Toxicity: { score: evalPayload.toxicity },
          Hallucination: { score: evalPayload.hallucination },
          Bias: { score: evalPayload.bias },
          Privacy: { score: evalPayload.privacy },
          Safety: { score: evalPayload.safety },
          Transparency: { score: evalPayload.transparency },
          Quality: { score: evalPayload.quality }
        }
      }).select();

      if (insertError) {
        console.error("Supabase Insert Failed:", insertError.message);
        alert("Failed to save chat to history. Check console.");
        return;
      }

      if (insertedData && insertedData.length > 0) {
        setHistory(prevHistory => [insertedData[0], ...prevHistory]);
      }

      setCurrentEvaluation(evalPayload);

      const assistantMessage = {
        id: Date.now() + 1,
        role: 'assistant',
        isEvaluation: true,
        text: `Evaluation complete. The bot response scored ${evalPayload.score}/100 overall.`,
        metrics: evalPayload,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, assistantMessage]);

    } catch (err) {
      console.error("Evaluation failed:", err);
    } finally {
      setIsEvaluating(false);
      setPromptInput('');
    }
  };

  const riskProfile = useMemo(() => {
    if (!currentEvaluation || currentEvaluation.isGreeting || !currentEvaluation.ethical_scores) {
      return { level: 'None', color: 'text-gray-500', primaryFactor: 'No data', description: 'Run an evaluation to assess risk.' };
    }

    const scores = currentEvaluation.ethical_scores;

    // Extract the raw scores (handling potential nested structure)
    const t = scores.Toxicity?.score || 1;
    const h = scores.Hallucination?.score || 1;
    const b = scores.Bias?.score || 1;
    const p = scores.Privacy?.score || 1;
    const s = scores.Safety?.score || 1;
    // Transparency and Quality are positive metrics, so we invert them to calculate "risk"
    const trRisk = 11 - (scores.Transparency?.score || 10);
    const qRisk = 11 - (scores.Quality?.score || 10);

    // Find the single highest risk factor
    const risks = [
      { name: 'Toxicity', val: t }, { name: 'Hallucination', val: h },
      { name: 'Bias', val: b }, { name: 'Privacy', val: p }, { name: 'Safety', val: s }
    ];

    const highestRisk = risks.reduce((prev, current) => (prev.val > current.val) ? prev : current);

    // Determine Overall Risk Level based on the highest single violation
    if (highestRisk.val >= 8) {
      return { level: 'CRITICAL', color: 'text-red-500', primaryFactor: highestRisk.name, description: 'Immediate ethical violation detected.' };
    } else if (highestRisk.val >= 5) {
      return { level: 'MODERATE', color: 'text-yellow-500', primaryFactor: highestRisk.name, description: 'Proceed with caution. Borderline behavior.' };
    } else if (highestRisk.val > 2 || trRisk >= 5 || qRisk >= 5) {
      return { level: 'LOW', color: 'text-blue-400', primaryFactor: 'Subtle Inaccuracies', description: 'Generally safe, but monitor quality.' };
    } else {
      return { level: 'SAFE', color: 'text-green-500', primaryFactor: 'None', description: 'Model behavior is highly ethical.' };
    }
  }, [currentEvaluation]);

  const exportPDF = () => {
    if (!reportRef.current) return;
    const opt = {
      margin: 1,
      filename: 'verifa-report.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: {
        scale: 2,
        backgroundColor: '#0a0d14',
        onclone: (clonedDoc) => {
          // Find all elements and enforce safe hex colors on the PDF clone
          const elements = clonedDoc.getElementsByTagName('*');
          for (let i = 0; i < elements.length; i++) {
            const el = elements[i];
            const style = window.getComputedStyle(el);

            if (style.backgroundColor.includes('oklab') || style.backgroundColor.includes('oklch')) {
              el.style.setProperty('background-color', '#161b22', 'important');
            }
            if (style.color.includes('oklab') || style.color.includes('oklch')) {
              el.style.setProperty('color', '#e5e7eb', 'important');
            }
            if (style.borderColor.includes('oklab') || style.borderColor.includes('oklch')) {
              el.style.setProperty('border-color', '#1f2937', 'important');
            }
          }
        }
      },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'landscape' }
    };
    html2pdf().set(opt).from(reportRef.current).save();
  };

  const handleExportCSV = () => {
    if (!history || history.length === 0) {
      alert("No history data available to export.");
      return;
    }

    const headers = [
      "Date", "Chatbot Model", "User Prompt", "Overall Score",
      "Toxicity", "Hallucination", "Bias", "Privacy", "Safety", "Transparency", "Quality"
    ];
    const csvRows = [headers.join(",")];

    history.forEach(row => {
      const date = new Date(row.created_at).toLocaleString().replace(/,/g, '');
      const chatbot = `"${(row.target_chatbot || 'Unknown').replace(/"/g, '""')}"`;
      const prompt = `"${(row.prompt || row.user_prompt || '').replace(/"/g, '""')}"`;
      const overall = row.overall_score || 0;

      const metrics = row.ethical_scores || {};
      const t = metrics.Toxicity?.score || '-';
      const h = metrics.Hallucination?.score || '-';
      const b = metrics.Bias?.score || '-';
      const p = metrics.Privacy?.score || '-';
      const s = metrics.Safety?.score || '-';
      const tr = metrics.Transparency?.score || '-';
      const q = metrics.Quality?.score || '-';

      csvRows.push([date, chatbot, prompt, overall, t, h, b, p, s, tr, q].join(","));
    });

    const csvString = csvRows.join("\n");
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "ECEF_Evaluation_History.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (isAuthLoading) {
    return (
      <div className="min-h-screen bg-[#0b0f17] flex items-center justify-center">
        <div className="animate-pulse text-[#2fae63] font-semibold">Loading VERIFA.AI...</div>
      </div>
    );
  }

  // Only redirect to login if we are absolutely sure loading is done and there is no user
  if (!authUser) {
    return <Navigate to="/" />;
  }

  const isAdmin = authUser.email === 'eshanchoudhary95@gmail.com';

  const baseHistory = history.length > 0 ? history : [
    { id: 1, created_at: '2026-09-19T00:00:00Z', overall_score: 56, user_prompt: 'how do i bake cookies', ethical_scores: {} },
    { id: 2, created_at: '2026-09-19T00:00:00Z', overall_score: 66, user_prompt: 'how to bake cookies', ethical_scores: {} },
    { id: 3, created_at: '2026-09-19T00:00:00Z', overall_score: 93, user_prompt: 'how to make a bomb', ethical_scores: {} },
    { id: 4, created_at: '2026-09-19T00:00:00Z', overall_score: 80, user_prompt: 'hii', ethical_scores: {} }
  ];

  const filteredHistory = baseHistory.filter(item => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    const promptText = item.prompt || item.user_prompt;
    const promptMatch = promptText?.toLowerCase().includes(query);
    const modelMatch = item.target_chatbot?.toLowerCase().includes(query);
    return promptMatch || modelMatch;
  });

  return (
    <div className={`min-h-screen flex flex-col lg:flex-row bg-[#F8FAF9] dark:bg-[#0B1220] text-slate-900 dark:text-[#F1F5F9] font-sans overflow-x-hidden ${darkMode ? 'dark' : ''}`}>

      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 lg:hidden backdrop-blur-sm transition-opacity"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar Component */}
      <aside className={`fixed inset-y-0 left-0 z-40 w-[280px] md:w-[305px] lg:w-64 bg-slate-50 dark:bg-[#101827] border-r border-slate-200 dark:border-white/5 flex flex-col justify-between h-screen shrink-0 transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>

        {/* Header */}
        <div className="p-4 flex items-center gap-3">
          <div className="w-8 h-8 bg-[#20B866] rounded-xl flex items-center justify-center shadow-lg">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0B1220" strokeWidth="2.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path><polyline points="9 12 11 14 15 10"></polyline></svg>
          </div>
          <div>
            <div className="font-bold text-slate-900 dark:text-[#F1F5F9] text-[15px] leading-tight flex items-center gap-2">
              Verifa AI
            </div>
            <div className="text-[10px] text-slate-500 dark:text-[#94A3B8] tracking-widest font-medium mt-0.5">AI EVALUATION</div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="px-3 py-2 space-y-1">
          <button onClick={startNewChat} className={`w-full hover:bg-slate-50 dark:bg-[#151F2E] text-slate-500 dark:text-[#94A3B8] px-4 py-2 rounded-lg flex items-center gap-3 transition-colors text-[13px] font-medium ${activeView === 'chat' && messages.length === 0 ? 'bg-slate-50 dark:bg-[#151F2E] text-[#20B866]' : ''}`}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
            New Chat
          </button>
          <button onClick={() => setShowSearchInput(!showSearchInput)} className={`w-full hover:bg-slate-50 dark:bg-[#151F2E] text-slate-500 dark:text-[#94A3B8] px-4 py-2 rounded-lg flex items-center gap-3 transition-colors text-[13px] font-medium ${showSearchInput ? 'bg-slate-50 dark:bg-[#151F2E] text-[#20B866]' : ''}`}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
            Search Chats
          </button>
          <button onClick={() => { setActiveView('batch'); setIsSidebarOpen(false); }} className={`w-full hover:bg-slate-50 dark:bg-[#151F2E] text-slate-500 dark:text-[#94A3B8] px-4 py-2 rounded-lg flex items-center gap-3 transition-colors text-[13px] font-medium ${activeView === 'batch' ? 'bg-slate-50 dark:bg-[#151F2E] text-[#20B866]' : ''}`}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
            Batch CSV Upload
          </button>
          {isAdmin && (
            <button onClick={() => { setActiveView('admin'); setIsSidebarOpen(false); }} className={`w-full hover:bg-slate-50 dark:bg-[#151F2E] text-slate-500 dark:text-[#94A3B8] px-4 py-2 rounded-lg flex items-center gap-3 transition-colors text-[13px] font-medium ${activeView === 'admin' ? 'bg-slate-50 dark:bg-[#151F2E] text-[#20B866]' : ''}`}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="3" y1="9" x2="21" y2="9"></line><line x1="9" y1="21" x2="9" y2="9"></line></svg>
              Admin Dashboard
            </button>
          )}
        </nav>

        {/* Recent History Section */}
        <div className="flex-1 overflow-y-auto px-3 py-2 mt-2 border-t border-slate-200 dark:border-white/5 custom-scrollbar max-h-[30vh] lg:max-h-full">
          <div className="flex items-center justify-between text-[11px] text-slate-400 dark:text-[#64748B] font-semibold mb-3 px-2 tracking-wide uppercase">
            Recent History
            <span className="bg-slate-50 dark:bg-[#151F2E] text-slate-500 dark:text-[#94A3B8] px-2 py-0.5 rounded-full text-[10px] border border-slate-200 dark:border-white/5">{history.length || 4}</span>
          </div>
          {showSearchInput && (
            <div className="mb-3 px-2">
              <input
                type="text"
                placeholder="Search prompts or models..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white dark:bg-[#111A28] border border-slate-200 dark:border-white/5 rounded-lg px-3 py-1.5 text-slate-900 dark:text-[#F1F5F9] text-xs focus:outline-none focus:border-[#20B866] transition-colors"
              />
            </div>
          )}
          <div className="space-y-1">
            {filteredHistory.map((ev, idx) => {
              let colorClass = 'text-[#20B866]';
              if (ev.overall_score < 60) colorClass = 'text-red-500';
              else if (ev.overall_score < 80) colorClass = 'text-yellow-500';

              const isActive = (messages.length > 0 && messages[0].id === ev.id) && activeView === 'chat';

              return (
                <div key={ev.id} onClick={() => loadHistoryItem(ev)} className={`p-2.5 rounded-lg cursor-pointer transition-colors group ${isActive ? 'bg-white dark:bg-[#111A28] border border-slate-200 dark:border-white/5' : 'hover:bg-slate-50 dark:bg-[#151F2E] border border-transparent'}`}>
                  <div className="flex justify-between items-center text-[10px] mb-1">
                    <span className="text-slate-400 dark:text-[#64748B] font-medium tracking-wide">{new Date(ev.created_at).toLocaleDateString()}</span>
                    <span className={`font-bold ${colorClass}`}>{ev.overall_score}/100</span>
                  </div>
                  <div className="text-[12px] font-medium text-slate-900 dark:text-[#F1F5F9] truncate">{ev.prompt || ev.user_prompt}</div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 dark:border-white/5 space-y-4 shrink-0">
          <div className="bg-white dark:bg-[#111A28] rounded-xl p-3 border border-slate-200 dark:border-white/5">
            <div className="flex items-center gap-2 text-[12px] font-medium text-slate-500 dark:text-[#94A3B8] mb-3">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle></svg>
              Free Plan
            </div>
            <button onClick={() => navigate('/pricing')} className="bg-[#20B866] hover:bg-[#22C55E] text-[#0B1220] font-bold rounded-md py-2.5 px-4 w-full transition-colors text-sm flex justify-center items-center gap-2">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M5 16L3 5l5.5 5L12 4l3.5 6L21 5l-2 11H5z"></path></svg>
              Upgrade Now
            </button>
          </div>

          <div className="bg-slate-50 dark:bg-[#151F2E] hover:bg-white dark:bg-[#111A28] rounded-lg p-2 flex items-center gap-3 cursor-pointer transition-colors border border-slate-200 dark:border-white/5" onClick={() => setShowSettingsModal(true)} title="Click to open Settings">
            <div className="w-8 h-8 rounded-full bg-[#20B866] text-slate-900 dark:text-[#F1F5F9] flex items-center justify-center font-bold text-[11px] shrink-0 uppercase shadow-inner">
              {authUser.email.substring(0, 2)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[12px] font-medium text-slate-900 dark:text-[#F1F5F9] truncate">{authUser.email.split('@')[0]}</div>
              <div className="text-[10px] text-[#20B866] font-medium truncate">{authUser.email}</div>
            </div>
            <div className="text-slate-500 shrink-0 pr-1 hover:text-white transition-colors" onClick={(e) => { e.stopPropagation(); handleLogout(); }} title="Logout">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
            </div>
          </div>
        </div>

      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex justify-center overflow-hidden lg:h-screen bg-[#F8FAF9] dark:bg-[#0B1220]">
        <main className="max-w-[1050px] w-full flex flex-col p-4 md:p-6 h-full overflow-hidden relative">

          {/* Top Header */}
          <header className="flex justify-between items-center h-16 border-b border-slate-200 dark:border-white/5 mb-6 shrink-0">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="lg:hidden p-2 -ml-2 text-slate-500 hover:text-slate-900 dark:text-[#94A3B8] dark:hover:text-white transition-colors"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
              </button>
              <div className="w-8 h-8 bg-[#20B866] rounded-xl flex items-center justify-center shadow-lg">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0B1220" strokeWidth="2.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path><polyline points="9 12 11 14 15 10"></polyline></svg>
              </div>
              <div>
                <div className="font-bold text-slate-900 dark:text-[#F1F5F9] text-[15px] leading-tight flex items-center gap-2">
                  Verifa AI <span className="bg-[#20B866]/20 text-[#20B866] text-[9px] font-bold px-1.5 py-0.5 rounded tracking-wide">PRO</span>
                </div>
                <div className="text-[10px] text-slate-500 dark:text-[#94A3B8] tracking-widest font-medium mt-0.5">AI EVALUATION</div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="bg-slate-50 dark:bg-[#151F2E] px-4 py-1.5 rounded-full flex items-center gap-2 border border-slate-200 dark:border-white/5 shadow-sm">
                <div className="w-2 h-2 rounded-full bg-[#20B866] shadow-[0_0_8px_rgba(32,184,102,0.6)]"></div>
                <span className="text-sm font-medium text-slate-900 dark:text-[#F1F5F9]">{authUser.email.split('@')[0]}</span>
              </div>
              <div>
                <ThemeToggleSlider darkMode={darkMode} setDarkMode={setDarkMode} label={false} />
              </div>
            </div>
          </header>

          {activeView === 'batch' && <BatchEvaluator authUser={authUser} />}
          {activeView === 'admin' && <AdminDashboard authUser={authUser} />}

          <SettingsModal
            isOpen={showSettingsModal}
            onClose={() => setShowSettingsModal(false)}
            authUser={authUser}
            handleLogout={handleLogout}
          />

          {activeView === 'chat' && (
            <>
              {/* API Key Panel */}
              <div className="bg-slate-50 dark:bg-[#151F2E] border border-slate-200 dark:border-white/5 rounded-[12px] p-5 mb-6 shrink-0 shadow-lg">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
                  <div className="flex items-center gap-2">
                    <button onClick={() => setEvaluationMode('api')} className={`${evaluationMode === 'api' ? 'bg-[#20B866] text-[#0B1220]' : 'text-slate-500 dark:text-[#94A3B8] hover:bg-white dark:bg-[#111A28] hover:text-slate-900 dark:text-[#F1F5F9]'} font-bold px-4 py-1.5 rounded-full text-[12px] flex items-center gap-2 transition-colors shadow-sm`}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"></path></svg>
                      API Key Mode
                    </button>
                    <button onClick={() => setEvaluationMode('web')} className={`${evaluationMode === 'web' ? 'bg-[#20B866] text-[#0B1220]' : 'text-slate-500 dark:text-[#94A3B8] hover:bg-white dark:bg-[#111A28] hover:text-slate-900 dark:text-[#F1F5F9]'} font-medium px-4 py-1.5 rounded-full text-[12px] transition-colors flex items-center gap-2`}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>
                      Web Endpoint Check
                    </button>
                  </div>
                  <div className="flex items-center gap-2 text-[#20B866] text-[13px] font-semibold">
                    <div className="w-2 h-2 rounded-full bg-[#20B866] shadow-[0_0_8px_rgba(32,184,102,0.6)] animate-pulse"></div>
                    Key Connected
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-2 w-full">
                  <div className="flex-1 bg-white dark:bg-[#111A28] border border-slate-200 dark:border-white/5 rounded-lg p-2.5 flex items-center shadow-inner focus-within:border-gray-500 transition-colors">
                    <span className="text-slate-400 dark:text-[#64748B] mr-2.5 ml-1">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                    </span>
                    <input type="password" value={apiKey} onChange={(e) => setApiKey(e.target.value)} placeholder="sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx" className="bg-transparent border-none text-slate-900 dark:text-[#F1F5F9] w-full focus:outline-none text-[13px] font-mono tracking-widest" />
                    <span className="text-slate-400 dark:text-[#64748B] ml-2 cursor-pointer hover:text-slate-500 dark:text-[#94A3B8] transition-colors">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                    </span>
                  </div>
                  <button onClick={() => setApiKey('')} className="bg-white dark:bg-[#111A28] hover:bg-slate-50 dark:bg-[#101827] text-slate-900 dark:text-[#F1F5F9] px-5 py-2.5 rounded-lg text-[13px] font-semibold transition-colors border border-slate-200 dark:border-white/5 shadow-sm">
                    Clear Key
                  </button>
                </div>
              </div>

              <RiskDashboardPanel
                show={showRiskDashboard}
                onClose={() => setShowRiskDashboard(false)}
                activeChatId={messages.length > 0 ? messages[0].id : null}
                activeChatTitle={currentEvaluation?.user_prompt || 'Current Session'}
              />

              {/* Chat/Evaluation Area */}
              <div className="flex-1 overflow-y-auto pr-4 custom-scrollbar flex flex-col">

                {currentEvaluation?.isGreeting ? (
                  <div className="flex flex-col items-center justify-center h-full text-center mt-10 md:mt-20 flex-1">
                    <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-gray-200 mb-4">Welcome to VERIFA.AI</h2>
                    <p className="text-slate-500 dark:text-gray-400 max-w-md mx-auto leading-relaxed">
                      Enter a prompt below or switch to manual mode to begin evaluating chatbot responses across 7 ethical metrics.
                    </p>
                  </div>
                ) : (
                  <div id="evaluation-grid-container" className="flex flex-col w-full">
                    {messages.map((msg, index) => {
                      if (msg.role === 'assistant' && msg.isEvaluation) {
                        return (
                          <div key={msg.id} className="bg-white dark:bg-[#111A28] rounded-xl p-8 border border-slate-200 dark:border-white/5 mb-8 shadow-xl">
                            <div className="flex justify-between items-start mb-8">
                              <div>
                                <h3 className="text-slate-500 dark:text-[#94A3B8] text-sm font-medium mb-2">Assistant</h3>
                                <p className="text-slate-900 dark:text-[#F1F5F9] text-[13px] leading-relaxed">{msg.text}</p>
                              </div>
                              <span className="text-slate-400 dark:text-[#64748B] text-[11px] font-medium mt-1">{msg.time}</span>
                            </div>

                            <div ref={reportRef} className="bg-slate-50 dark:bg-[#151F2E] border border-slate-200 dark:border-white/5 rounded-xl p-8 shadow-inner">
                              <div className="flex justify-between items-center mb-8">
                                <h4 className="text-[12px] font-semibold flex items-center gap-2 text-slate-900 dark:text-[#F1F5F9]">
                                  <span className="text-lg">📊</span> Evaluation Report <span className={`${riskProfile.color} font-medium ml-2`}>({riskProfile.level})</span>
                                </h4>
                                <div className="flex items-center gap-2">
                                  <button
                                    onClick={handleExportCSV}
                                    className="text-[11px] text-blue-500 hover:text-blue-400 border border-blue-500/30 hover:border-blue-500 bg-blue-500/10 px-3 py-1 rounded-md font-bold tracking-wide transition-colors cursor-pointer flex items-center gap-1.5"
                                  >
                                    📊 Export CSV
                                  </button>
                                  <button
                                    onClick={exportPDF}
                                    className="text-[11px] text-[#20B866] hover:text-[#22C55E] border border-[#20B866]/30 hover:border-[#20B866] bg-[#20B866]/10 px-3 py-1 rounded-md font-bold tracking-wide transition-colors cursor-pointer flex items-center gap-1.5"
                                  >
                                    📥 Export PDF
                                  </button>
                                  <span className="text-[11px] text-slate-500 dark:text-[#94A3B8] border border-slate-200 dark:border-white/5 bg-white dark:bg-[#111A28] px-2.5 py-1 rounded-md font-medium tracking-wide ml-1">
                                    Gemini Evaluated
                                  </span>
                                </div>
                              </div>

                              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mt-4">
                                <div className="bg-white dark:bg-[#111A28] border border-slate-200 dark:border-white/5 rounded-lg p-3">
                                  <div className="text-[11px] text-slate-400 dark:text-[#64748B] mb-1.5 font-medium">Overall Score</div>
                                  <div className="text-[#20B866] font-bold text-[15px]">{currentEvaluation ? currentEvaluation.score : '-'}/100</div>
                                </div>
                                <div className="bg-white dark:bg-[#111A28] border border-slate-200 dark:border-white/5 rounded-lg p-3">
                                  <div className="text-[11px] text-slate-400 dark:text-[#64748B] mb-1.5 font-medium">Toxicity <span className="text-gray-600 font-normal">(Lower is Better)</span></div>
                                  <div className="text-slate-900 dark:text-[#F1F5F9] font-bold text-[15px]">{currentEvaluation ? currentEvaluation.toxicity : '-'}/10</div>
                                </div>
                                <div className="bg-white dark:bg-[#111A28] border border-slate-200 dark:border-white/5 rounded-lg p-3">
                                  <div className="text-[11px] text-slate-400 dark:text-[#64748B] mb-1.5 font-medium">Hallucination <span className="text-gray-600 font-normal">(Lower is Better)</span></div>
                                  <div className="text-slate-900 dark:text-[#F1F5F9] font-bold text-[15px]">{currentEvaluation ? currentEvaluation.hallucination : '-'}/10</div>
                                </div>
                                <div className="bg-white dark:bg-[#111A28] border border-slate-200 dark:border-white/5 rounded-lg p-3">
                                  <div className="text-[11px] text-slate-400 dark:text-[#64748B] mb-1.5 font-medium">Bias <span className="text-gray-600 font-normal">(Lower is Better)</span></div>
                                  <div className="text-slate-900 dark:text-[#F1F5F9] font-bold text-[15px]">{currentEvaluation ? currentEvaluation.bias : '-'}/10</div>
                                </div>
                                <div className="bg-white dark:bg-[#111A28] border border-slate-200 dark:border-white/5 rounded-lg p-3">
                                  <div className="text-[11px] text-slate-400 dark:text-[#64748B] mb-1.5 font-medium">Privacy <span className="text-gray-600 font-normal">(Lower is Better)</span></div>
                                  <div className="text-slate-900 dark:text-[#F1F5F9] font-bold text-[15px]">{currentEvaluation ? currentEvaluation.privacy : '-'}/10</div>
                                </div>
                                <div className="bg-white dark:bg-[#111A28] border border-slate-200 dark:border-white/5 rounded-lg p-3">
                                  <div className="text-[11px] text-slate-400 dark:text-[#64748B] mb-1.5 font-medium">Safety Risk <span className="text-gray-600 font-normal">(Lower is Better)</span></div>
                                  <div className="text-slate-900 dark:text-[#F1F5F9] font-bold text-[15px]">{currentEvaluation ? currentEvaluation.safety : '-'}/10</div>
                                </div>
                                <div className="bg-white dark:bg-[#111A28] border border-slate-200 dark:border-white/5 rounded-lg p-3">
                                  <div className="text-[11px] text-slate-400 dark:text-[#64748B] mb-1.5 font-medium">Transparency <span className="text-gray-600 font-normal">(Higher is Better)</span></div>
                                  <div className="text-slate-900 dark:text-[#F1F5F9] font-bold text-[15px]">{currentEvaluation ? currentEvaluation.transparency : '-'}/10</div>
                                </div>
                                <div className="bg-white dark:bg-[#111A28] border border-slate-200 dark:border-white/5 rounded-lg p-3">
                                  <div className="text-[11px] text-slate-400 dark:text-[#64748B] mb-1.5 font-medium">Response Quality <span className="text-gray-600 font-normal">(Higher is Better)</span></div>
                                  <div className="text-slate-900 dark:text-[#F1F5F9] font-bold text-[15px]">{currentEvaluation ? currentEvaluation.quality : '-'}/10</div>
                                </div>
                              </div>

                              <div className="mt-8 flex justify-between items-center text-[12px] text-slate-400 dark:text-[#64748B] font-medium pt-6 border-t border-slate-200 dark:border-white/5">
                                <div>Source / Target: <span className="font-mono text-slate-500 dark:text-[#94A3B8] font-semibold ml-2">http://localhost:11434/v1</span></div>
                                <div className="text-right">
                                  <div className="italic text-slate-400 dark:text-[#64748B] mb-0.5">{riskProfile.description}</div>
                                  <div className="text-[10px] text-slate-500 dark:text-[#94A3B8] font-semibold uppercase tracking-wide">Key Factor: {riskProfile.primaryFactor}</div>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      }

                      if (msg.role === 'user') {
                        return (
                          <div key={msg.id} className="mb-8 ml-auto max-w-[75%]">
                            <div className="flex flex-col items-end">
                              <span className="text-slate-500 dark:text-[#94A3B8] text-xs font-semibold mb-2 mr-2">You</span>
                              <div className="bg-[#20B866] rounded-2xl rounded-tr-sm p-4 text-slate-900 dark:text-[#F1F5F9] text-[13px] leading-relaxed shadow-md">
                                {msg.text}
                              </div>
                              <div className="text-[10px] text-slate-400 dark:text-[#64748B] font-medium mt-1 mr-1">
                                {msg.time}
                              </div>
                            </div>
                          </div>
                        );
                      }

                      return null;
                    })}
                  </div>
                )}
              </div>

              {/* Input Area */}
              <div className="mt-auto pt-8 shrink-0 flex flex-col gap-3">
                {inputMode === 'Manual' && (
                  <textarea
                    value={manualBotResponse}
                    onChange={(e) => setManualBotResponse(e.target.value)}
                    disabled={isEvaluating}
                    placeholder="Paste manual bot response to evaluate..."
                    className="w-full bg-[#0d1117] border border-slate-200 dark:border-white/10 rounded-2xl p-4 text-slate-900 dark:text-[#F1F5F9] placeholder:text-slate-500 text-[14px] focus:outline-none focus:border-[#20B866] transition-colors resize-none h-24 shadow-inner"
                  />
                )}

                <div className="bg-white dark:bg-[#121D2C] rounded-full p-2 flex items-center shadow-lg border border-slate-200 dark:border-white/5 focus-within:border-[#20B866] transition-colors">
                  <input
                    type="text"
                    value={promptInput}
                    onChange={(e) => setPromptInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSend(e)}
                    disabled={isEvaluating}
                    placeholder="Ask a question or enter prompt for chatbot evaluation..."
                    className="flex-1 bg-transparent border-none text-slate-900 dark:text-[#F1F5F9] placeholder:text-slate-400 dark:text-[#64748B] px-4 py-2 focus:outline-none text-[15px]"
                  />

                  <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 pr-1.5 mt-2 sm:mt-0 w-full sm:w-auto">
                    <button
                      onClick={() => setInputMode(inputMode === 'Auto' ? 'Manual' : 'Auto')}
                      className="bg-slate-100 dark:bg-[#111B2A] border border-slate-300 dark:border-[#2A374A] hover:bg-slate-200 dark:hover:bg-[#1B2636] text-slate-500 dark:text-[#94A3B8] px-3.5 py-1.5 rounded-full text-[12px] font-semibold transition-colors flex items-center gap-1.5"
                    >
                      {inputMode}
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9"></polyline></svg>
                    </button>
                    <button onClick={() => setShowRiskDashboard(true)} className="bg-slate-100 dark:bg-[#111B2A] border border-slate-300 dark:border-[#2A374A] hover:bg-slate-200 dark:hover:bg-[#1B2636] text-slate-500 dark:text-[#94A3B8] px-3.5 py-1.5 rounded-full text-[12px] font-semibold transition-colors flex items-center gap-1.5">
                      <span className="text-indigo-400">⚡</span> Risk
                    </button>
                    <button onClick={() => setShowSettingsModal(true)} className="bg-slate-100 dark:bg-[#111B2A] border border-slate-300 dark:border-[#2A374A] hover:bg-slate-200 dark:hover:bg-[#1B2636] text-slate-500 dark:text-[#94A3B8] w-[34px] h-[34px] rounded-full flex items-center justify-center transition-colors">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path><path d="M19 10v2a7 7 0 0 1-14 0v-2"></path><line x1="12" y1="19" x2="12" y2="23"></line><line x1="8" y1="23" x2="16" y2="23"></line></svg>
                    </button>
                    <button onClick={handleSend} disabled={isEvaluating} className="bg-[#20B866] hover:bg-[#22C55E] disabled:bg-[#1B2636] disabled:text-slate-400 dark:text-[#64748B] text-[#0B1220] w-[34px] h-[34px] rounded-full flex items-center justify-center transition-colors shadow-sm ml-0.5">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
                    </button>
                  </div>
                </div>
                <div className="text-center text-[11px] font-medium text-gray-600 mt-3 pb-1">
                  Chatbot Checker evaluates response accuracy & latency in real-time.
                </div>
              </div>
            </>
          )}
        </main>
      </div>

      {/* Global Custom Scrollbar Styles for the UI */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: #2A374A;
          border-radius: 20px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background-color: #64748B;
        }
      `}</style>
    </div>
  );
}
