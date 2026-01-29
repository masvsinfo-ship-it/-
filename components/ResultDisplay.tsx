
import React from 'react';
import { CalculationResult } from '../types';

interface Props {
  result: CalculationResult;
}

const ResultDisplay: React.FC<Props> = ({ result }) => {
  const isToPieces = result.calcMode === 'toPieces';
  const isFromMeter = result.calcMode === 'toPiecesFromMeter';
  const isFromPieces = result.calcMode === 'toMurubbaFromPieces';

  const accentColor = isFromPieces ? 'text-rose-400' : isFromMeter ? 'text-orange-400' : isToPieces ? 'text-blue-400' : 'text-emerald-400';

  return (
    <div className="space-y-5 max-w-xl mx-auto lg:ml-0">
      {/* Large Dark Result Card */}
      <div className="bg-slate-900 rounded-3xl p-10 text-white overflow-hidden relative border border-slate-800 shadow-2xl">
        <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/5 rounded-full blur-3xl"></div>
        
        <div className="relative z-10 flex flex-col items-center">
          <p className="text-slate-500 font-black uppercase tracking-[0.3em] text-[10px] mb-4">
            {(isToPieces || isFromMeter) ? 'প্রয়োজনীয় মোট মাল' : 'হিসাবকৃত মোট ফলাফল'}
          </p>
          
          <div className="flex items-baseline gap-3">
            <h3 className="text-7xl font-black tracking-tighter tabular-nums">
              {(isToPieces || isFromMeter) 
                ? Math.ceil(result.quantity).toLocaleString() 
                : result.totalMurubba.toLocaleString(undefined, { maximumFractionDigits: 3 })}
            </h3>
            <span className={`text-sm font-black uppercase tracking-[0.2em] ${accentColor}`}>
              {(isToPieces || isFromMeter) ? 'পিস' : 'মুরুব্বা'}
            </span>
          </div>

          <div className="mt-6 px-4 py-1.5 bg-white/5 rounded-full border border-white/10">
            <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">
              {isFromPieces ? 'পিস থেকে মুরুব্বা' :
               isFromMeter ? 'মিটার থেকে পিস' : 
               isToPieces ? 'মুরুব্বা থেকে পিস' : `${result.heightCm} সেমি উচ্চতায় মুরুব্বা হিসাব`}
            </span>
          </div>
        </div>
      </div>

      {/* Result Breakdown Columns - Larger Text */}
      <div className="grid grid-cols-1 gap-3">
        <div className="bg-white rounded-2xl p-6 border border-slate-200 flex items-center justify-between shadow-sm hover:border-slate-300 transition-all">
          <div className="flex items-center gap-5">
            <div className="w-12 h-12 rounded-2xl bg-slate-50 text-slate-400 flex items-center justify-center text-xl">
              <i className="fas fa-arrows-alt-h"></i>
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">মোট লম্বাই (মিটার)</p>
              <h4 className="text-2xl font-black text-slate-800 tracking-tight">
                {(result.totalLinearMeter || 0).toLocaleString(undefined, { maximumFractionDigits: 2 })} <span className="text-xs font-bold text-slate-400">মিটার</span>
              </h4>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-200 flex items-center justify-between shadow-sm hover:border-slate-300 transition-all">
          <div className="flex items-center gap-5">
            <div className="w-12 h-12 rounded-2xl bg-slate-50 text-slate-400 flex items-center justify-center text-xl">
              <i className="fas fa-cube"></i>
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">মোট আয়তন (ভলিউম)</p>
              <h4 className="text-2xl font-black text-slate-800 tracking-tight">
                {result.totalVolumeM3.toFixed(4)} <span className="text-xs font-bold text-slate-400">m³</span>
              </h4>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-200 flex items-center justify-between shadow-sm hover:border-slate-300 transition-all">
          <div className="flex items-center gap-5">
            <div className="w-12 h-12 rounded-2xl bg-slate-50 text-slate-400 flex items-center justify-center text-xl">
              <i className="fas fa-th"></i>
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">১ মুরুব্বায় মাল যাবে</p>
              <h4 className="text-2xl font-black text-slate-800 tracking-tight">
                {result.piecesPerMurubba.toFixed(2)} <span className="text-xs font-bold text-slate-400">পিস</span>
              </h4>
            </div>
          </div>
        </div>
      </div>

      {/* Summary Dimensions Small Card */}
      <div className="flex items-center justify-center gap-6 py-3 px-6 bg-slate-100 rounded-2xl text-[11px] font-black text-slate-500 uppercase tracking-widest">
        <span className="flex items-center gap-1.5"><i className="fas fa-long-arrow-alt-right text-[10px]"></i> {result.length}M দৈর্ঘ্য</span>
        <span className="w-1.5 h-1.5 bg-slate-300 rounded-full"></span>
        <span className="flex items-center gap-1.5"><i className="fas fa-arrows-alt-h text-[10px]"></i> {result.width}M প্রস্থ</span>
        <span className="w-1.5 h-1.5 bg-slate-300 rounded-full"></span>
        <span className="flex items-center gap-1.5"><i className="fas fa-layer-group text-[10px]"></i> {result.heightCm}CM উচ্চতা</span>
      </div>
    </div>
  );
};

export default ResultDisplay;
