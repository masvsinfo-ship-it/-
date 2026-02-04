
import React, { useState } from 'react';
import { saveToHistory } from './storage';
import { CalculatorTab } from './types';

const MeterToPiece: React.FC<{ t: any }> = ({ t }) => {
  const [length, setLength] = useState<string>('0.60');
  const [totalMeterInput, setTotalMeterInput] = useState<string>('25');
  const [result, setResult] = useState<any>(null);

  const calculate = () => {
    const l = parseFloat(length) || 0;
    const m = parseFloat(totalMeterInput) || 0;
    if (l > 0 && m > 0) {
      const totalPieces = Math.ceil(m / l);
      const calcResults = { pieces: totalPieces, meter: m };
      setResult(totalPieces);
      saveToHistory({ tabType: CalculatorTab.METER_TO_PIECE, inputs: { [t.length]: length, [t.meter]: totalMeterInput }, results: calcResults });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-2"><div className="vertical-bar"></div><h2 className="text-xl font-bold text-[#1e293b]">{t.tabs.meter}</h2></div>
      <div className="app-card bg-white p-6 border border-slate-100">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1"><label className="text-slate-500 text-xs font-bold">{t.length}</label><input type="number" value={length} onChange={(e) => setLength(e.target.value)} className="input-box w-full p-4 outline-none" /></div>
          <div className="space-y-1"><label className="text-slate-500 text-xs font-bold">{t.meter}</label><input type="number" value={totalMeterInput} onChange={(e) => setTotalMeterInput(e.target.value)} className="input-box w-full p-4 outline-none border-amber-200" /></div>
        </div>
        <button onClick={calculate} className="w-full mt-6 bg-amber-600 text-white py-5 rounded-2xl font-bold text-lg active:scale-95 transition-all">{t.calc} →</button>
      </div>
      {result && <div className="bg-amber-600 text-white p-10 rounded-[40px] text-center shadow-xl animate-fadeIn"><p className="text-xs font-bold opacity-70 uppercase mb-2">{t.totalPcs}</p><h3 className="text-6xl font-black">{result}</h3></div>}
    </div>
  );
};

export default MeterToPiece;
