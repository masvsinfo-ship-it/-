
import React, { useState } from 'react';
import { Language, UserProfile } from '../types';
import { translations } from '../translations';

interface Props {
  language: Language;
  onLogin: (user: UserProfile) => void;
}

const LoginOverlay: React.FC<Props> = ({ language, onLogin }) => {
  const [mobile, setMobile] = useState('');
  const [name, setName] = useState('');
  const t = translations[language as keyof typeof translations] || translations.bn;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mobile.length < 11 || !name.trim()) {
      alert(language === 'bn' ? "সঠিক তথ্য দিন" : "Provide correct info");
      return;
    }
    onLogin({ mobile, name, isLoggedIn: true });
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-md"></div>
      <div className="relative w-full max-w-md bg-white rounded-[2rem] shadow-2xl overflow-hidden animate-slide-up">
        <div className="h-2 w-full bg-emerald-500"></div>
        <div className="p-8 md:p-10 space-y-8">
          <div className="text-center space-y-2">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4 text-2xl shadow-inner">
              <i className="fas fa-user-plus"></i>
            </div>
            <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tight">{t.loginTitle}</h2>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{t.brand} Community</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">{t.enterName}</label>
              <input
                type="text" required value={name} onChange={(e) => setName(e.target.value)}
                placeholder="Full Name" className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none focus:bg-white focus:border-emerald-500 transition-all font-black text-lg text-slate-700"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">{t.enterMobile}</label>
              <input
                type="tel" required value={mobile} onChange={(e) => setMobile(e.target.value)}
                placeholder="017XXXXXXXX" className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none focus:bg-white focus:border-emerald-500 transition-all font-black text-lg text-slate-700 tracking-widest"
              />
            </div>

            <button type="submit" className="w-full py-5 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xl rounded-2xl shadow-xl shadow-emerald-200 transition-all active:scale-[0.98]">
              {t.loginBtn}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginOverlay;
