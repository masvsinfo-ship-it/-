import React, { useState, useEffect } from 'react';
// Fix: Removed .ts extension from import paths
import { CalculationResult, Language } from '../types';
import { getConstructionAdvice } from '../services/geminiService';
import { translations } from '../translations';

interface Props {
  currentCalculation: CalculationResult | null;
  language: Language;
}

const AIAssistant: React.FC<Props> = ({ currentCalculation, language }) => {
  const [advice, setAdvice] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const t = translations[language as keyof typeof translations] || translations.bn;

  const fetchAdvice = async () => {
    if (!currentCalculation) return;
    setLoading(true);
    setAdvice(null);
    const result = await getConstructionAdvice(
      currentCalculation.length,
      currentCalculation.width,
      currentCalculation.height,
      currentCalculation.totalMurubba,
      currentCalculation.totalPrice || 0
    );
    setAdvice(result || (language === 'bn' ? "পরামর্শ পাওয়া যায়নি।" : "Advice not found."));
    setLoading(false);
  };

  useEffect(() => {
    setAdvice(null);
  }, [currentCalculation]);

  if (!currentCalculation) return null;

  return (
    <div className="bg-slate-900 rounded-[1.5rem] p-5 border border-slate-800 shadow-2xl relative overflow-hidden mt-6">
      <div className="absolute -right-4 -top-4 opacity-5 pointer-events-none">
        <i className="fas fa-brain text-7xl text-white"></i>
      </div>
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
              <i className="fas fa-sparkles text-[10px]"></i>
            </div>
            <div>
              <h3 className="text-white font-black text-xs">{t.aiGuide}</h3>
              <p className="text-[8px] text-slate-500 font-bold uppercase tracking-widest">{t.aiSub}</p>
            </div>
          </div>
          
          {advice && (
            <button 
              onClick={fetchAdvice}
              className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/5 text-slate-400 hover:text-white transition-colors"
            >
              <i className="fas fa-redo-alt text-[10px]"></i>
            </button>
          )}
        </div>

        {!advice && !loading && (
          <button
            onClick={fetchAdvice}
            className="w-full py-3 bg-white/5 hover:bg-white/10 text-white font-black text-[10px] rounded-lg border border-white/10 transition-all flex items-center justify-center gap-2 uppercase tracking-widest"
          >
            <i className="fas fa-wand-magic-sparkles text-indigo-400"></i> {t.getAdvice}
          </button>
        )}

        {loading && (
          <div className="flex flex-col items-center justify-center py-4">
            <div className="w-5 h-5 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mb-2"></div>
            <p className="text-[8px] font-black text-indigo-400 uppercase tracking-widest animate-pulse">{t.analyzing}</p>
          </div>
        )}

        {advice && (
          <div className="animate-slide-up">
            <div className="bg-slate-800/40 rounded-xl p-4 text-slate-300 text-[11px] leading-relaxed border border-slate-700/50 italic">
              {advice}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AIAssistant;