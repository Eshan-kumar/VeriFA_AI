import React, { useState } from 'react';
import BatchRunner from './BatchRunner';
import EvaluationReport from './EvaluationReport';
import { API_BASE_URL } from '../../shared/services/api';
import { supabase } from '../../lib/supabaseClient';

export default function EvaluationStudio() {
  const [testMode, setTestMode] = useState('custom'); // 'custom' or 'library'
  
  // Custom mode state
  const [customPrompt, setCustomPrompt] = useState('');
  const [isTesting, setIsTesting] = useState(false);
  const [result, setResult] = useState(null);

  const handleTestChatbot = async () => {
    if (!customPrompt.trim() || isTesting) return;
    
    setIsTesting(true);
    setResult(null);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;

      const headers = { 'Content-Type': 'application/json' };
      if (token) headers.Authorization = `Bearer ${token}`;

      const res = await fetch(`${API_BASE_URL}/evaluate`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ prompt: customPrompt, evaluationMode: 'api' })
      });

      if (res.ok) {
        const data = await res.json();
        setResult(data);
      } else {
        console.error("Evaluation failed.");
      }
    } catch (err) {
      console.error("Error during evaluation:", err);
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto w-full px-4 py-8">
      <div className="mb-8 flex flex-col items-center text-center">
        <h1 className="text-3xl font-black text-gray-900 dark:text-white mb-2">Evaluation Studio</h1>
        <p className="text-gray-500 dark:text-gray-400 max-w-2xl">
          Test custom prompts in real-time or run automated batch evaluations using your prompt library.
        </p>
      </div>

      {/* Toggle Slider */}
      <div className="flex justify-center mb-10">
        <div className="bg-gray-100 dark:bg-gray-900 p-1.5 rounded-full flex relative w-64 shadow-inner border border-gray-200 dark:border-gray-800">
          <div 
            className="absolute top-1.5 bottom-1.5 left-1.5 w-[calc(50%-6px)] bg-white dark:bg-gray-700 rounded-full shadow transition-transform duration-300 ease-in-out z-0"
            style={{ transform: testMode === 'library' ? 'translateX(100%)' : 'translateX(0)' }}
          />
          <button 
            onClick={() => setTestMode('custom')}
            className={`flex-1 py-2 text-sm font-bold z-10 transition-colors ${testMode === 'custom' ? 'text-gray-900 dark:text-white' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}
          >
            Custom Prompt
          </button>
          <button 
            onClick={() => setTestMode('library')}
            className={`flex-1 py-2 text-sm font-bold z-10 transition-colors ${testMode === 'library' ? 'text-gray-900 dark:text-white' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}
          >
            Prompt Library
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="w-full">
        {testMode === 'custom' ? (
          <div className="w-full space-y-6 animate-in fade-in duration-300">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700">
              <label className="block text-sm font-bold text-gray-900 dark:text-white mb-3">
                Enter your test prompt
              </label>
              <textarea 
                value={customPrompt}
                onChange={(e) => setCustomPrompt(e.target.value)}
                placeholder="What would you like to ask the chatbot?"
                className="w-full h-32 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-[#2fae63] transition-all resize-none mb-4"
              />
              <div className="flex justify-end">
                <button 
                  onClick={handleTestChatbot}
                  disabled={isTesting || !customPrompt.trim()}
                  className="px-6 py-2.5 bg-[#2fae63] hover:bg-[#279857] text-white font-bold rounded-lg transition-colors disabled:opacity-50 flex items-center gap-2"
                >
                  {isTesting ? (
                    <>
                      <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25"></circle>
                        <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" className="opacity-75"></path>
                      </svg>
                      Evaluating...
                    </>
                  ) : (
                    'Test Chatbot'
                  )}
                </button>
              </div>
            </div>

            {result && (
              <div className="mt-8 animate-in slide-in-from-bottom-4">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Evaluation Results</h3>
                <EvaluationReport evaluationData={result} />
              </div>
            )}
          </div>
        ) : (
          <div className="animate-in fade-in duration-300">
            <BatchRunner />
          </div>
        )}
      </div>
    </div>
  );
}
