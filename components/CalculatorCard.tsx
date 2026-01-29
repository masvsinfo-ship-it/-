
import React, { useState, useEffect } from 'react';
import { CalculationResult, CalcMode } from '../types';

interface Props {
  activeMode: CalcMode;
  onCalculate: (data: CalculationResult) => void;
}

const CalculatorCard: React.FC<Props> = ({ activeMode, onCalculate }) => {
  const [length, setLength] = useState<string>('');
  const [width, setWidth] = useState<string>('');
  const [heightCm, setHeightCm] = useState<string>('3');
  const [quantity, setQuantity] = useState<string>('1');
  const [targetValueInput, setTargetValueInput] = useState<string>('');

  // Clear target value when mode changes to prevent confusion
  useEffect(() => {
    setTargetValueInput('');
  }, [activeMode]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const l = parseFloat(length);
    const w = parseFloat(width);
    const h = parseFloat(heightCm);
    
    if (isNaN(l) || isNaN(w) || isNaN(h) || l <= 0 || h <= 0) return;

    const volumeOnePiece = l * w * (h / 100);
    const murubbaPerPiece = volumeOnePiece / 0.03;
    const piecesPerMurubba = 1 / murubbaPerPiece;
    const piecesPerMeter = 1 / l;

    if (activeMode === 'toPieces') {
      const tm = parseFloat(targetValueInput);
      if (isNaN(tm)) return;
      const totalPieces = (tm * 0.03) / volumeOnePiece;
      onCalculate({
        calcMode: activeMode, length: l, width: w, heightCm: h,
        quantity: totalPieces,
        totalVolumeM3: tm * 0.03,
        totalMurubba: tm,
        totalAreaM2: totalPieces * l * w,
        piecesPerMurubba, piecesPerMeter,
        targetValue: tm,
        totalLinearMeter: totalPieces * l
      });
    } else if (activeMode === 'toPiecesFromMeter') {
      const tmeter = parseFloat(targetValueInput);
      if (isNaN(tmeter)) return;
      const totalPieces = tmeter / l;
      const totalVolume = totalPieces * volumeOnePiece;
      const totalMurubba = totalVolume / 0.03;
      onCalculate({
        calcMode: activeMode, length: l, width: w, heightCm: h,
        quantity: totalPieces,
        totalVolumeM3: totalVolume,
        totalMurubba: totalMurubba,
        totalAreaM2: totalPieces * l * w,
        piecesPerMurubba, piecesPerMeter,
        targetValue: tmeter,
        totalLinearMeter: tmeter
      });
    } else if (activeMode === 'toMurubbaFromPieces') {
      const tpcs = parseFloat(targetValueInput);
      if (isNaN(tpcs)) return;
      const totalLinearMeter = tpcs * l;
      const totalArea = tpcs * l * w;
      const totalVolume = totalArea * (h / 100);
      const totalMurubba = totalVolume / 0.03;

      onCalculate({
        calcMode: activeMode, length: l, width: w, heightCm: h,
        quantity: tpcs,
        totalVolumeM3: totalVolume,
        totalMurubba: totalMurubba,
        totalAreaM2: totalArea,
        piecesPerMurubba, piecesPerMeter,
        targetValue: tpcs,
        totalLinearMeter: totalLinearMeter
      });
    } else {
      const q = parseFloat(quantity) || 1;
      const totalVolume = volumeOnePiece * q;
      const totalMurubba = totalVolume / 0.03;
      onCalculate({
        calcMode: activeMode, length: l, width: w, heightCm: h,
        quantity: q,
        totalVolumeM3: totalVolume,
        totalMurubba: totalMurubba,
        totalAreaM2: l * w * q,
        piecesPerMurubba, piecesPerMeter,
        totalLinearMeter: l * q
      });
    }
  };

  const getModeColor = () => {
    switch(activeMode) {
      case 'toMurubbaFromPieces': return 'rose';
      case 'toPieces': return 'blue';
      case 'toPiecesFromMeter': return 'orange';
      default: return 'emerald';
    }
  };

  const activeColor = getModeColor();

  return (
    <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-slate-200/60 border border-slate-100 p-10 sm:p-14">
      <form onSubmit={handleSubmit} className="space-y-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="space-y-3">
            <label className="block text-base font-black text-slate-500 uppercase tracking-widest ml-1">দৈর্ঘ্য (মিটার)</label>
            <input
              type="number" step="any" required value={length} onChange={(e) => setLength(e.target.value)}
              placeholder="0.00" className="w-full px-6 py-5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all font-black text-2xl text-slate-800"
            />
          </div>

          <div className="space-y-3">
            <label className="block text-base font-black text-slate-500 uppercase tracking-widest ml-1">প্রস্থ (মিটার)</label>
            <input
              type="number" step="any" required value={width} onChange={(e) => setWidth(e.target.value)}
              placeholder="0.00" className="w-full px-6 py-5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all font-black text-2xl text-slate-800"
            />
          </div>

          <div className="space-y-3">
            <label className="block text-base font-black text-slate-500 uppercase tracking-widest ml-1">উচ্চতা (সেমি)</label>
            <input
              type="number" step="any" required value={heightCm} onChange={(e) => setHeightCm(e.target.value)}
              placeholder="3" className="w-full px-6 py-5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all font-black text-2xl text-slate-800"
            />
          </div>

          {['toPieces', 'toPiecesFromMeter', 'toMurubbaFromPieces'].includes(activeMode) ? (
            <div className="space-y-3">
              <label className={`block text-base font-black uppercase tracking-widest ml-1 text-${activeColor}-600`}>
                {activeMode === 'toPieces' ? 'টার্গেট মুরুব্বা' : 
                 activeMode === 'toMurubbaFromPieces' ? 'টার্গেট পিস' : 'টার্গেট মিটার'}
              </label>
              <input
                type="number" step="any" required value={targetValueInput} onChange={(e) => setTargetValueInput(e.target.value)}
                placeholder="0.00" className={`w-full px-6 py-5 border rounded-2xl focus:ring-4 outline-none transition-all font-black text-2xl bg-${activeColor}-50 border-${activeColor}-200 text-${activeColor}-700 focus:ring-${activeColor}-500/10 focus:border-${activeColor}-500`}
              />
            </div>
          ) : (
            <div className="space-y-3">
              <label className="block text-base font-black text-emerald-600 uppercase tracking-widest ml-1">মোট পিস</label>
              <input
                type="number" step="1" required value={quantity} onChange={(e) => setQuantity(e.target.value)}
                placeholder="1" className="w-full px-6 py-5 bg-emerald-50 border border-emerald-200 rounded-2xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all font-black text-2xl text-emerald-700"
              />
            </div>
          )}
        </div>

        <div className="pt-6">
          <button
            type="submit"
            className={`w-full py-6 rounded-3xl text-white font-black text-2xl shadow-2xl transition-all active:scale-[0.98] flex items-center justify-center gap-4 bg-${activeColor}-600 hover:bg-${activeColor}-700 shadow-${activeColor}-500/30`}
          >
            হিসাব দেখুন <i className="fas fa-calculator text-xl"></i>
          </button>
          <div className="flex items-center justify-center gap-6 mt-10">
              <div className="h-px bg-slate-200 flex-grow"></div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-[0.4em] whitespace-nowrap">
                নির্ভুল হিসাব • সহজ সমাধান • কারিনা গ্রুপ
              </p>
              <div className="h-px bg-slate-200 flex-grow"></div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CalculatorCard;
