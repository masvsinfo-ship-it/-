
import React from 'react';
import { Language } from '../types';
import { translations } from '../translations';

interface Props {
  language: Language;
}

const DeploymentGuide: React.FC<Props> = ({ language }) => {
  const t = translations[language as keyof typeof translations] || translations.en;

  return (
    <div className="bg-white border-2 border-dashed border-emerald-100 rounded-[1.5rem] p-6 mt-8">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600">
          <i className="fas fa-cloud-upload-alt"></i>
        </div>
        <h3 className="font-black text-slate-800 uppercase tracking-tight text-sm">
          {t.hostingGuide}
        </h3>
      </div>
      
      <div className="space-y-3">
        <div className="flex items-start gap-3">
          <div className="w-5 h-5 bg-slate-100 rounded-full flex items-center justify-center text-[10px] font-bold text-slate-500 shrink-0 mt-0.5">1</div>
          <p className="text-xs font-bold text-slate-600">{t.hostingStep1}</p>
        </div>
        <div className="flex items-start gap-3">
          <div className="w-5 h-5 bg-slate-100 rounded-full flex items-center justify-center text-[10px] font-bold text-slate-500 shrink-0 mt-0.5">2</div>
          <p className="text-xs font-bold text-slate-600">{t.hostingStep2}</p>
        </div>
        <div className="flex items-start gap-3">
          <div className="w-5 h-5 bg-slate-100 rounded-full flex items-center justify-center text-[10px] font-bold text-slate-500 shrink-0 mt-0.5">3</div>
          <p className="text-xs font-bold text-slate-600">{t.hostingStep3}</p>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        <a href="https://pages.cloudflare.com" target="_blank" className="px-3 py-1.5 bg-orange-50 text-orange-600 rounded-lg text-[10px] font-black uppercase tracking-widest border border-orange-100 hover:bg-orange-100 transition-colors">Cloudflare</a>
        <a href="https://vercel.com" target="_blank" className="px-3 py-1.5 bg-black text-white rounded-lg text-[10px] font-black uppercase tracking-widest hover:opacity-80 transition-opacity">Vercel</a>
        <a href="https://surge.sh" target="_blank" className="px-3 py-1.5 bg-slate-800 text-white rounded-lg text-[10px] font-black uppercase tracking-widest hover:opacity-80 transition-opacity">Surge</a>
      </div>
    </div>
  );
};

export default DeploymentGuide;
