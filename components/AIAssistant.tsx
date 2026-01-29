
import React, { useState, useEffect } from 'react';
import { CalculationResult } from '../types';
import { getConstructionAdvice } from '../services/geminiService';

interface Props {
  currentCalculation: CalculationResult | null;
}

const AIAssistant: React.FC<Props> = ({ currentCalculation }) => {
  const [advice, setAdvice] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchAdvice = async () => {
    if (!currentCalculation) return;
    setLoading(true);
    setAdvice(null);
    const result = await getConstructionAdvice(
      currentCalculation.length,
      currentCalculation.width,
      currentCalculation.heightCm,
      currentCalculation.totalMurubba
    );
    setAdvice(result || "পরামর্শ পাওয়া যায়নি।");
    setLoading(false);
  };

  useEffect(() => {
    // Reset advice when calculation changes, don't auto-fetch to save tokens
    setAdvice(null);
  }, [currentCalculation]);

  if (!currentCalculation) return null;

  return (
    <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-6 mt-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-indigo-600 text-white rounded-full flex items-center justify-center shadow-lg shadow-indigo-200">
          <i className="fas fa-robot text-lg"></i>
        </div>
        <div>
          <h3 className="text-indigo-900 font-bold">এআই সহকারী পরামর্শ</h3>
          <p className="text-xs text-indigo-600 font-medium italic">আপনার হিসেবের ওপর ভিত্তি করে নির্মাণ টিপস</p>
        </div>
      </div>

      {!advice && !loading && (
        <button
          onClick={fetchAdvice}
          className="w-full py-3 bg-white border-2 border-indigo-200 text-indigo-700 font-bold rounded-xl hover:bg-indigo-600 hover:text-white hover:border-indigo-600 transition-all flex items-center justify-center gap-2"
        >
          <i className="fas fa-magic"></i>
          স্মার্ট পরামর্শ দেখুন
        </button>
      )}

      {loading && (
        <div className="flex flex-col items-center justify-center py-6 text-indigo-400">
          <i className="fas fa-circle-notch fa-spin text-3xl mb-3"></i>
          <p className="text-sm font-medium animate-pulse">হিসাব বিশ্লেষণ করা হচ্ছে...</p>
        </div>
      )}

      {advice && (
        <div className="bg-white rounded-xl p-5 border border-indigo-100 shadow-sm animate-in fade-in duration-700">
          <div className="prose prose-sm text-slate-700 whitespace-pre-line leading-relaxed">
            {advice}
          </div>
          <div className="mt-4 pt-4 border-t border-slate-100 flex justify-end">
             <button 
                onClick={fetchAdvice}
                className="text-xs font-bold text-indigo-600 hover:text-indigo-800 transition-colors flex items-center gap-1"
             >
                <i className="fas fa-sync-alt"></i> পুনরায় পরামর্শ নিন
             </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIAssistant;
