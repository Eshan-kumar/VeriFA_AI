import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';
import EvaluationReport from './EvaluationReport';
import { API_BASE_URL } from '../../shared/services/api';

export default function BatchRunner() {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState({ current: 0, total: 0 });
  const [results, setResults] = useState([]);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    const { data, error } = await supabase.from('prompt_library').select('category');
    if (data && !error) {
      const uniqueCats = [...new Set(data.map(d => d.category).filter(Boolean))];
      setCategories(uniqueCats);
      if (uniqueCats.length > 0) setSelectedCategory(uniqueCats[0]);
    }
  };

  const startBatchTest = async () => {
    if (!selectedCategory || isRunning) return;
    setIsRunning(true);
    setResults([]);

    const { data: prompts, error } = await supabase
      .from('prompt_library')
      .select('prompt_text')
      .eq('category', selectedCategory);

    if (error || !prompts || prompts.length === 0) {
      alert("No prompts found for this category.");
      setIsRunning(false);
      return;
    }

    setProgress({ current: 0, total: prompts.length });
    const batchResults = [];

    const { data: { session } } = await supabase.auth.getSession();
    const token = session?.access_token;

    const headers = { 'Content-Type': 'application/json' };
    if (token) headers.Authorization = `Bearer ${token}`;

    for (let i = 0; i < prompts.length; i++) {
      setProgress({ current: i + 1, total: prompts.length });
      const promptText = prompts[i].prompt_text;
      
      try {
        const res = await fetch(`${API_BASE_URL}/evaluate`, {
          method: 'POST',
          headers,
          body: JSON.stringify({ prompt: promptText, evaluationMode: 'api' })
        });
        
        if (res.ok) {
          const evalData = await res.json();
          batchResults.push({ prompt: promptText, ...evalData });
        } else {
          console.error("Evaluation failed for prompt:", promptText);
        }
      } catch (err) {
        console.error("Error evaluating:", err);
      }
    }

    setResults(batchResults);
    setIsRunning(false);
  };

  const progressPercentage = progress.total > 0 ? (progress.current / progress.total) * 100 : 0;

  return (
    <div className="w-full space-y-6">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Batch Testing</h3>
        <p className="text-gray-500 dark:text-gray-400 mb-6 text-sm">
          Run automated evaluations against your library of prompts.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 items-end">
          <div className="w-full sm:w-64 flex flex-col gap-2">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Select Category</label>
            <select 
              value={selectedCategory} 
              onChange={(e) => setSelectedCategory(e.target.value)}
              disabled={isRunning || categories.length === 0}
              className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#2fae63]"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
              {categories.length === 0 && <option>Loading categories...</option>}
            </select>
          </div>

          <button 
            onClick={startBatchTest} 
            disabled={isRunning || !selectedCategory}
            className="px-6 py-2.5 bg-[#2fae63] hover:bg-[#279857] text-white font-bold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
          >
            {isRunning ? 'Running...' : 'Start Batch Test'}
          </button>
        </div>

        {isRunning && (
          <div className="mt-6 space-y-2">
            <div className="flex justify-between text-sm font-medium text-gray-700 dark:text-gray-300">
              <span>Evaluating prompt {progress.current} of {progress.total}...</span>
              <span>{Math.round(progressPercentage)}%</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 overflow-hidden">
              <div 
                className="bg-[#2fae63] h-2.5 rounded-full transition-all duration-300" 
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
          </div>
        )}
      </div>

      {results.length > 0 && (
        <div className="space-y-8 animate-in fade-in">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white pb-2 border-b border-gray-200 dark:border-gray-700">
            Batch Results ({results.length})
          </h3>
          {results.map((res, index) => (
            <div key={index} className="space-y-4">
              <div className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 p-4 rounded-lg">
                <p className="text-xs font-bold text-gray-500 uppercase mb-1">Prompt {index + 1}</p>
                <p className="text-gray-900 dark:text-white font-medium">{res.prompt}</p>
              </div>
              <EvaluationReport evaluationData={res} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
