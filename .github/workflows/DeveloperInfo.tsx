
import React from 'react';

const DeveloperInfo: React.FC<{ t: any }> = ({ t }) => (
  <div className="mt-12 p-8 bg-white rounded-[40px] border border-slate-100 shadow-sm text-center animate-fadeIn">
    <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mb-4 border border-slate-100 mx-auto rotate-3 hover:rotate-0 transition-transform">
      <span className="text-3xl">👨‍💻</span>
    </div>
    <h3 className="text-slate-800 font-bold text-lg mb-1">{t.devTitle}</h3>
    <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-8">Built by Billal</p>
    <div className="flex justify-center gap-6">
      <a href="https://fb.com/billal8795" className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center shadow-lg active:scale-90">F</a>
      <a href="https://wa.me/8801735308795" className="w-12 h-12 bg-green-500 text-white rounded-full flex items-center justify-center shadow-lg active:scale-90">W</a>
    </div>
  </div>
);

export default DeveloperInfo;
