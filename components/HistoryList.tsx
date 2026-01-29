
import React from 'react';
import { HistoryItem } from '../types';

interface Props {
  items: HistoryItem[];
  onSelect: (item: HistoryItem) => void;
}

const HistoryList: React.FC<Props> = ({ items, onSelect }) => {
  if (items.length === 0) return (
    <div className="bg-white rounded-3xl border-2 border-dashed border-slate-200 p-12 text-center">
      <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
        <i className="fas fa-folder-open text-2xl text-slate-300"></i>
      </div>
      <p className="text-slate-400 font-bold text-sm">কোন পূর্ববর্তী তথ্য নেই</p>
    </div>
  );

  return (
    <div className="space-y-3">
      {items.map((item) => (
        <button
          key={item.id} onClick={() => onSelect(item)}
          className="w-full bg-white border border-slate-100 p-5 rounded-2xl hover:shadow-xl hover:shadow-slate-200/50 transition-all text-left group flex items-center justify-between"
        >
          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-lg ${
              item.calcMode === 'toPieces' ? 'bg-blue-50 text-blue-500' : 
              item.calcMode === 'toMurubbaFromPieces' ? 'bg-rose-50 text-rose-500' :
              item.calcMode === 'toPiecesFromMeter' ? 'bg-orange-50 text-orange-500' : 'bg-emerald-50 text-emerald-500'
            }`}>
              <i className={`fas ${item.calcMode.includes('Pieces') ? 'fa-layer-group' : 'fa-cubes'}`}></i>
            </div>
            <div>
              <h4 className="font-bold text-slate-800 text-sm leading-none mb-1">{item.label}</h4>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                {item.length}m × {item.width}m × {item.heightCm}cm
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className={`text-xl font-black leading-none ${
              item.calcMode === 'toMurubbaFromPieces' ? 'text-rose-600' :
              item.calcMode.includes('Pieces') ? 'text-blue-600' : 'text-emerald-600'
            }`}>
              {item.totalMurubba.toFixed(2)}
            </p>
            <p className="text-[8px] text-slate-400 font-black uppercase tracking-tighter">মুরুব্বা</p>
          </div>
        </button>
      ))}
    </div>
  );
};

export default HistoryList;
