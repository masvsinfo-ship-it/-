
import React from 'react';
import { HistoryItem, Language } from '../types';
import { translations } from '../translations';

interface Props {
  items: HistoryItem[];
  onSelect: (item: HistoryItem) => void;
  language: Language;
}

const HistoryList: React.FC<Props> = ({ items, onSelect, language }) => {
  // Use a fallback to ensure 't' is always defined correctly
  const t = translations[language as keyof typeof translations] || translations.bn;

  if (items.length === 0) return (
    <div className="bg-white rounded-3xl border-2 border-dashed border-slate-200 p-12 text-center">
      <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
        <i className="fas fa-folder-open text-2xl text-slate-300"></i>
      </div>
      <p className="text-slate-400 font-bold text-sm">{t.noHistory}</p>
    </div>
  );

  const getModeStyles = (mode: string) => {
    switch (mode) {
      case 'toPieces': return { bg: 'bg-blue-50', text: 'text-blue-500', valText: 'text-blue-600' };
      case 'toMurubbaFromPieces': return { bg: 'bg-rose-50', text: 'text-rose-500', valText: 'text-rose-600' };
      case 'toPiecesFromMeter': return { bg: 'bg-orange-50', text: 'text-orange-500', valText: 'text-orange-600' };
      default: return { bg: 'bg-emerald-50', text: 'text-emerald-500', valText: 'text-emerald-600' };
    }
  };

  return (
    <div className="space-y-3">
      {items.map((item) => {
        const styles = getModeStyles(item.calcMode);
        return (
          <button
            key={item.id} onClick={() => onSelect(item)}
            className="w-full bg-white border border-slate-100 p-5 rounded-2xl hover:shadow-xl hover:shadow-slate-200/50 transition-all text-left group flex items-center justify-between"
          >
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-lg ${styles.bg} ${styles.text}`}>
                <i className={`fas ${item.calcMode.includes('Pieces') ? 'fa-layer-group' : 'fa-cubes'}`}></i>
              </div>
              <div>
                <h4 className="font-bold text-slate-800 text-sm leading-none mb-1">{item.label}</h4>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  {item.length}m × {item.width}m × {item.height}cm
                </p>
              </div>
            </div>
            <div className={`${language === 'ar' ? 'text-left' : 'text-right'}`}>
              <p className={`text-xl font-black leading-none ${styles.valText}`}>
                {item.totalMurubba.toFixed(2)}
              </p>
              <p className="text-[8px] text-slate-400 font-black uppercase tracking-tighter">{t.murubba}</p>
            </div>
          </button>
        );
      })}
    </div>
  );
};

export default HistoryList;
