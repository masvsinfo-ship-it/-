
import React, { useState } from 'react';
import { saveToHistory } from './storage';
import { CalculatorTab } from './types';

const MurubbaToPiece: React.FC<{ t: any }> = ({ t }) => {
  const [length, setLength] = useState<string>('0.60');
  const [width, setWidth] = useState<string>('0.30');
  const [murubbaInput, setMurubbaInput] = useState<string>('25');
  const [result, setResult] = useState<any>(null);

  const calculate = () => {
    const l = parseFloat(length) || 0;
    const w = parseFloat(width) || 0;
    const m = parseFloat(murubbaInput) || 0;
    
    if (l > 0 && w > 0 && m > 0) {
      const areaPerPiece = l * w;
      const totalPieces = Math.ceil(m / areaPerPiece);
      const totalMeter = totalPieces * l; 
      const calcResults = { pieces: totalPieces, meter: totalMeter, totalMurubba: m };
      setResult(calcResults);
      saveToHistory({
        tabType: CalculatorTab.MURUBBA_TO_PIECE,
        inputs: { [t.length]: length, [t.width]: width, [t.murubba]: murubbaInput },
        results: calcResults
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-2"><div className="vertical-bar"></div><h2 className="text-xl font-bold text-[#1e293b]">{t.tabs.murubba}</h2></div>
      <div className="app-card bg-white p-6 border border-slate-100">
        <div className="grid grid-cols-2 gap-4">
          <Input label={t.length} val={length} onChange={setLength} />
          <Input label={t.width} val={width} onChange={setWidth} />
          <div className="col-span-2"><Input label={t.murubba} val={murubbaInput} onChange={setMurubbaInput} /></div>
        </div>
        <button onClick={calculate} className="w-full mt-6 bg-[#006cb4] text-white py-5 rounded-2xl font-bold text-lg active:scale-95 transition-all">{t.calc} →</button>
      </div>
      {result && <div className="bg-[#00a651] text-white p-10 rounded-[40px] text-center shadow-xl animate-fadeIn"><p className="text-xs font-bold opacity-70 uppercase mb-2">{t.totalPcs}</p><h3 className="text-6xl font-black">{result.pieces}</h3></div>}
    </div>
  );
};

const Input = ({ label, val, onChange }: any) => (
  <div className="space-y-1">
    <label className="text-slate-500 text-xs font-bold">{label}</label>
    <input type="number" value={val} onChange={(e) => onChange(e.target.value)} className="input-box w-full p-4 outline-none" />
  </div>
);

export default MurubbaToPiece;
