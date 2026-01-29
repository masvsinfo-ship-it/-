
import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import CalculatorCard from './components/CalculatorCard';
import ResultDisplay from './components/ResultDisplay';
import HistoryList from './components/HistoryList';
import AIAssistant from './components/AIAssistant';
import { CalculationResult, HistoryItem, CalcMode } from './types';

const App: React.FC = () => {
  const [activeMode, setActiveMode] = useState<CalcMode>('toMurubba');
  const [result, setResult] = useState<CalculationResult | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);

  // Load history from localStorage
  useEffect(() => {
    const savedHistory = localStorage.getItem('stone_calc_history');
    if (savedHistory) {
      setHistory(JSON.parse(savedHistory));
    }
  }, []);

  const handleCalculate = (data: CalculationResult) => {
    setResult(data);
    const newItem: HistoryItem = {
      ...data,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: Date.now(),
      label: `হিসাব ${history.length + 1}`
    };
    const updatedHistory = [newItem, ...history].slice(0, 10);
    setHistory(updatedHistory);
    localStorage.setItem('stone_calc_history', JSON.stringify(updatedHistory));
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem('stone_calc_history');
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50/50">
      <Header activeMode={activeMode} setActiveMode={setActiveMode} />
      
      <main className="flex-grow container mx-auto px-4 py-8 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Calculator */}
          <div className="lg:col-span-2 space-y-8">
            <section>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-2 h-8 bg-emerald-500 rounded-full"></div>
                <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tight">
                  {activeMode === 'toMurubba' ? 'মাপ থেকে মুরুব্বা' : 
                   activeMode === 'toMurubbaFromPieces' ? 'পিস থেকে মুরুব্বা' :
                   activeMode === 'toPieces' ? 'মুরুব্বা থেকে পিস' : 'মিটার থেকে পিস'} ইনপুট
                </h2>
              </div>
              <CalculatorCard activeMode={activeMode} onCalculate={handleCalculate} />
            </section>

            {result && (
              <section className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-2 h-8 bg-blue-500 rounded-full"></div>
                  <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tight">
                    হিসাবের ফলাফল
                  </h2>
                </div>
                <ResultDisplay result={result} />
              </section>
            )}

            <section>
                <AIAssistant currentCalculation={result} />
            </section>
          </div>

          {/* Right Column: History */}
          <div className="space-y-6">
            <section className="sticky top-24">
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-8 bg-slate-400 rounded-full"></div>
                  <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tight">
                    সাম্প্রতিক হিসেব
                  </h2>
                </div>
                {history.length > 0 && (
                  <button 
                    onClick={clearHistory}
                    className="text-xs text-red-500 hover:text-red-700 transition-colors uppercase font-black tracking-widest"
                  >
                    মুছে ফেলুন
                  </button>
                )}
              </div>
              <HistoryList items={history} onSelect={setResult} />
            </section>
          </div>

        </div>
      </main>

      <footer className="bg-slate-900 text-slate-400 py-10 border-t border-slate-800">
        <div className="container mx-auto px-4 text-center">
            <p className="text-sm font-bold uppercase tracking-[0.2em] mb-4">সুত্র: ১মি. × ১মি. × ৩সেমি. = ১ মুরুব্বা</p>
            <div className="flex flex-col md:flex-row items-center justify-center gap-6 text-xs font-bold uppercase tracking-widest">
              <span>© {new Date().getFullYear()} কারিনা গ্রুপ</span>
              <span className="hidden md:inline w-px h-4 bg-slate-800"></span>
              <div className="flex items-center gap-2">
                <span className="text-slate-600">ডেব্লোপার:</span>
                <span className="text-emerald-500">Md Billal</span>
              </div>
            </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
