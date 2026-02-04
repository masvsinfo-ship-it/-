
import React, { useState } from 'react';
import { saveToHistory } from './storage';
import { CalculatorTab } from './types';

const PieceToAll: React.FC<{ t: any }> = ({ t }) => {
  const [length, setLength] = useState<string>('0.60');
  const [width, setWidth] = useState<string>('0.30');
  const [pieces, setPieces] = useState<string>('180');
  const [result, setResult] = useState<any>(null);

  const calculate = () => {
    const l = parseFloat(length) || 0;
    const w = parseFloat(width) || 0;
    const p = parseFloat(pieces) || 0;
    if (l > 0 && w > 0 && p > 0) {
      const totalMurubba = p * (l * w);
      const totalMeter = p * l;
      const calcResults = { murubba: totalMurubba, meter: totalMeter };
      setResult(calcResults);
      saveToHistory({ tabType: CalculatorTab.PIECE_TO_ALL, inputs: { [t.length]: length, [t.width]: width, [t.pieces]: pieces }, results: calcResults });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-2"><div className="vertical-bar"></div><h2 className="text-xl font-bold text-[#1e293b]">{t.tabs.piece}</h2></div>
      <div className="app-card bg-white p-6 border border-slate-100">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1"><label className="text-slate-500 text-xs font-bold">{t.length}</label><input type="number" value={length} onChange={(e) => setLength(e.target.value)} className="input-box w-full p-4 outline-none" /></div>
          <div className="space-y-1"><label className="text-slate-500 text-xs font-bold">{t.width}</label><input type="number" value={width} onChange={(e) => setWidth(e.target.value)} className="input-box w-full p-4 outline-none" /></div>
          <div className="col-span-2 space-y-1"><label className="text-red-500 text-xs font-bold">{t.pieces}</label><input type="number" value={pieces} onChange={(e) => setPieces(e.target.value)} className="input-box w-full p-4 outline-none border-red-200" /></div>
        </div>
        <button onClick={calculate} className="w-full mt-6 bg-red-600 text-white py-5 rounded-2xl font-bold text-lg active:scale-95 transition-all">{t.calc} →</button>
      </div>
      {result && <div className="grid grid-cols-2 gap-4 animate-fadeIn"><div className="bg-[#00a651] text-white p-6 rounded-3xl text-center"><p className="text-[10px] font-bold uppercase mb-2 opacity-80">{t.totalMur}</p><div className="text-3xl font-black">{result.murubba.toFixed(2)}</div></div><div className="bg-white border border-slate-100 p-6 rounded-3xl text-center"><p className="text-slate-400 text-[10px] font-bold uppercase mb-2">{t.totalMet}</p><div className="text-3xl font-black text-slate-700">{result.meter.toFixed(2)}</div></div></div>}
    </div>
  );
};

export default PieceToAll;
