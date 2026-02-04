
import React, { useState, useEffect } from 'react';
import { getHistory, deleteHistoryItem, clearAllHistory } from './storage';
import { HistoryItem, CalculatorTab } from './types';

const History: React.FC<{ t: any }> = ({ t }) => {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  useEffect(() => { setHistory(getHistory()); }, []);

  const clear = () => { if (window.confirm(t.clearHistory + '?')) { clearAllHistory(); setHistory([]); } };
  const del = (id: string) => { deleteHistoryItem(id); setHistory(getHistory()); };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-3"><div className="vertical-bar"></div><h2 className="text-xl font-bold text-[#1e293b]">{t.history}</h2></div>
        {history.length > 0 && <button onClick={clear} className="text-[10px] font-bold text-red-500 uppercase tracking-widest bg-red-50 px-3 py-1.5 rounded-full border border-red-100">{t.clearHistory}</button>}
      </div>
      {history.length === 0 ? (
        <div className="app-card bg-white p-12 text-center border border-slate-100 text-slate-300 font-bold">📜 {t.noHistory}</div>
      ) : (
        history.map(item => (
          <div key={item.id} className="app-card bg-white p-5 border border-slate-100 animate-fadeIn relative">
             <button onClick={() => del(item.id)} className="absolute top-4 right-4 text-slate-300">✕</button>
             <span className="text-[10px] font-black uppercase text-[#00a651] bg-green-50 px-2 py-0.5 rounded">{item.tabType}</span>
             <p className="text-[10px] text-slate-300 mb-4">{new Date(item.timestamp).toLocaleTimeString()}</p>
             <div className="grid grid-cols-2 gap-4 text-xs font-bold text-slate-600">
                {Object.entries(item.results).map(([k, v]: any) => <div key={k}>{k}: {v?.toFixed ? v.toFixed(2) : v}</div>)}
             </div>
          </div>
        ))
      )}
    </div>
  );
};

export default History;
