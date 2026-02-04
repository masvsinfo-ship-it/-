
import React, { useState, useEffect } from 'react';
import { CalculationResult, CalcMode, Language } from '../types';
import { translations } from '../translations';

interface Props {
  activeMode: CalcMode;
  onCalculate: (data: CalculationResult) => void;
  themeColor: 'emerald' | 'blue' | 'indigo';
  language: Language;
}

const CalculatorCard: React.FC<Props> = ({ activeMode, onCalculate, themeColor, language }) => {
  const [length, setLength] = useState<string>('');
  const [width, setWidth] = useState<string>('');
  const [height, setHeight] = useState<string>('3'); 
  const [quantity, setQuantity] = useState<string>('1');
  const [targetValueInput, setTargetValueInput] = useState<string>('');
  const [unitPrice, setUnitPrice] = useState<string>('');

  // Use a fallback to ensure 't' is always defined correctly
  const t = translations[language as keyof typeof translations] || translations.bn;

  useEffect(() => {
    setTargetValueInput('');
  }, [activeMode]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const l = parseFloat(length);
    const w = parseFloat(width);
    const h = parseFloat(height);
    const uPrice = parseFloat(unitPrice) || 0;
    
    if (isNaN(l) || isNaN(w) || isNaN(h) || l <= 0 || w <= 0 || h <= 0) {
      alert(language === 'bn' ? "দয়া করে সঠিক মাপ দিন" : (language === 'hi' ? "कृपया सही माप दें" : (language === 'ar' ? "يرجى تقديم القياسات الصحيحة" : "Please provide correct measurements")));
      return;
    }

    const murubbaPerPiece = l * w;
    const volumeOnePieceM3 = l * w * (h / 100);
    const piecesPerMurubba = 1 / murubbaPerPiece;
    const piecesPerLinearUnit = 1 / l;

    let q = parseFloat(quantity) || 1;
    let tm = 0;
    let tLinear = 0;

    if (activeMode === 'toPieces') {
      tm = parseFloat(targetValueInput) || 0;
      q = tm / murubbaPerPiece;
      tLinear = q * l;
    } else if (activeMode === 'toPiecesFromMeter') {
      tLinear = parseFloat(targetValueInput) || 0;
      q = tLinear / l;
      tm = q * murubbaPerPiece;
    } else if (activeMode === 'toMurubbaFromPieces') {
      q = parseFloat(targetValueInput) || 0;
      tm = q * murubbaPerPiece;
      tLinear = q * l;
    } else {
      tm = murubbaPerPiece * q;
      tLinear = l * q;
    }

    const totalVolumeM3 = q * volumeOnePieceM3;
    
    // Calculate total price based on active mode context
    let totalPrice = 0;
    if (activeMode === 'toPiecesFromMeter') {
      totalPrice = tLinear * uPrice;
    } else {
      totalPrice = tm * uPrice;
    }

    const estimatedWeightTon = totalVolumeM3 * 1.6;

    const finalResult: CalculationResult = {
      calcMode: activeMode,
      inputUnit: 'metric',
      length: l,
      width: w,
      height: h,
      quantity: q,
      totalVolumeM3,
      totalMurubba: tm,
      totalArea: tm,
      piecesPerMurubba,
      piecesPerLinearUnit,
      targetValue: parseFloat(targetValueInput),
      totalLinearUnit: tLinear,
      unitPrice: uPrice,
      totalPrice,
      estimatedWeightTon
    };

    onCalculate(finalResult);
  };

  const modeStyles = {
    toMurubba: {
      emerald: { accent: 'emerald', btn: 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-200' },
      blue: { accent: 'blue', btn: 'bg-blue-600 hover:bg-blue-700 shadow-blue-200' },
      indigo: { accent: 'indigo', btn: 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-200' }
    },
    toMurubbaFromPieces: { accent: 'rose', btn: 'bg-rose-600 hover:bg-rose-700 shadow-rose-200' },
    toPieces: { accent: 'sky', btn: 'bg-sky-600 hover:bg-sky-700 shadow-sky-200' },
    toPiecesFromMeter: { accent: 'amber', btn: 'bg-amber-600 hover:bg-amber-700 shadow-amber-200' }
  };

  const getStyle = () => {
    if (activeMode === 'toMurubba') return modeStyles.toMurubba[themeColor];
    return modeStyles[activeMode as keyof typeof modeStyles] as any;
  };

  const style = getStyle();
  
  const accentColors: any = {
    emerald: 'border-emerald-100 focus:border-emerald-500 text-emerald-600',
    blue: 'border-blue-100 focus:border-blue-500 text-blue-600',
    indigo: 'border-indigo-100 focus:border-indigo-500 text-indigo-600',
    rose: 'border-rose-100 focus:border-rose-500 text-rose-600',
    sky: 'border-sky-100 focus:border-sky-500 text-sky-600',
    amber: 'border-amber-100 focus:border-amber-500 text-amber-600',
  };

  return (
    <div className="bg-white rounded-[1.5rem] shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
      <div className={`h-1 w-full bg-${style.accent}-500 opacity-50`}></div>
      <form onSubmit={handleSubmit} className="p-5 md:p-8 space-y-6">
        <div className="grid grid-cols-2 gap-4 md:gap-6">
          <div className="space-y-1.5">
            <label className="text-[10px] md:text-xs font-black text-slate-500 uppercase tracking-widest ml-1">{t.length}</label>
            <input
              type="number" step="any" required value={length} onChange={(e) => setLength(e.target.value)}
              placeholder={t.placeholderVal} className={`w-full px-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-xl focus:bg-white focus:border-${style.accent}-500 outline-none transition-all font-black text-xl md:text-2xl text-slate-700`}
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] md:text-xs font-black text-slate-500 uppercase tracking-widest ml-1">{t.width}</label>
            <input
              type="number" step="any" required value={width} onChange={(e) => setWidth(e.target.value)}
              placeholder={t.placeholderVal} className={`w-full px-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-xl focus:bg-white focus:border-${style.accent}-500 outline-none transition-all font-black text-xl md:text-2xl text-slate-700`}
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] md:text-xs font-black text-slate-500 uppercase tracking-widest ml-1">{t.thickness}</label>
            <input
              type="number" step="any" required value={height} onChange={(e) => setHeight(e.target.value)}
              placeholder="3" className={`w-full px-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-xl focus:bg-white focus:border-${style.accent}-500 outline-none transition-all font-black text-xl md:text-2xl text-slate-700`}
            />
          </div>

          <div className="space-y-1.5">
            <label className={`text-[10px] md:text-xs font-black uppercase tracking-widest ml-1 text-${style.accent}-500`}>
              {activeMode === 'toPieces' ? t.murubba : 
               activeMode === 'toMurubbaFromPieces' ? t.quantity : 
               activeMode === 'toPiecesFromMeter' ? t.meter : t.quantity}
            </label>
            <input
              type="number" step="any" required 
              value={['toPieces', 'toPiecesFromMeter', 'toMurubbaFromPieces'].includes(activeMode) ? targetValueInput : quantity}
              onChange={(e) => ['toPieces', 'toPiecesFromMeter', 'toMurubbaFromPieces'].includes(activeMode) ? setTargetValueInput(e.target.value) : setQuantity(e.target.value)}
              placeholder="0" className={`w-full px-4 py-3 bg-slate-50 border-2 rounded-xl outline-none transition-all font-black text-xl md:text-2xl focus:bg-white ${accentColors[style.accent]}`}
            />
          </div>

          <div className="col-span-2 space-y-1.5 pt-2">
            <label className="text-[10px] md:text-xs font-black text-slate-500 uppercase tracking-widest ml-1">{t.pricePerUnit}</label>
            <input
              type="number" step="any" value={unitPrice} onChange={(e) => setUnitPrice(e.target.value)}
              placeholder="0.00" className={`w-full px-4 py-4 bg-slate-50 border-2 border-slate-100 rounded-xl focus:bg-white focus:border-${style.accent}-500 outline-none transition-all font-black text-xl md:text-3xl text-emerald-600`}
            />
          </div>
        </div>

        <button
          type="submit"
          className={`w-full py-4 md:py-5 rounded-xl text-white font-black text-lg md:text-xl shadow-lg transition-all active:scale-[0.98] flex items-center justify-center gap-3 ${style.btn}`}
        >
          {t.calculate} <i className={`fas ${language === 'ar' ? 'fa-arrow-left' : 'fa-arrow-right'} text-xs`}></i>
        </button>
      </form>
    </div>
  );
};

export default CalculatorCard;
