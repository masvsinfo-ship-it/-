import React, { useState } from 'react';
// Fix: Removed .ts extension from import paths
import { CalcMode, Language, UserProfile } from '../types';
import { translations } from '../translations';

interface Props {
  activeMode: CalcMode;
  setActiveMode: (mode: CalcMode) => void;
  currentTheme: 'emerald' | 'blue' | 'indigo';
  onThemeChange: (theme: 'emerald' | 'blue' | 'indigo') => void;
  language: Language;
  onLanguageChange: (lang: Language) => void;
  user: UserProfile | null;
  onLogout: () => void;
}

const Header: React.FC<Props> = ({ activeMode, setActiveMode, currentTheme, onThemeChange, language, onLanguageChange, user, onLogout }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isThemeOpen, setIsThemeOpen] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);

  const t = translations[language as keyof typeof translations] || translations.bn;

  const themeConfig = {
    emerald: { bg: 'bg-emerald-600', text: 'text-emerald-600', shadow: 'shadow-emerald-500/20', icon: 'text-emerald-500' },
    blue: { bg: 'bg-blue-600', text: 'text-blue-600', shadow: 'shadow-blue-500/20', icon: 'text-blue-500' },
    indigo: { bg: 'bg-indigo-600', text: 'text-indigo-600', shadow: 'shadow-indigo-500/20', icon: 'text-indigo-500' }
  }[currentTheme];

  const languages: { id: Language; label: string; flag: string }[] = [
    { id: 'bn', label: 'বাংলা', flag: '🇧🇩' },
    { id: 'en', label: 'English', flag: '🇺🇸' },
  ];

  return (
    <header className="sticky top-0 z-50 glass border-b border-slate-200/50 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="h-20 md:h-28 flex items-center justify-between gap-4">
          
          {/* Brand Logo */}
          <div className="flex items-center gap-2 md:gap-3 shrink-0">
            <div className={`w-10 h-10 md:w-12 md:h-12 ${themeConfig.bg} rounded-xl md:rounded-2xl flex items-center justify-center text-white shadow-lg ${themeConfig.shadow}`}>
              <i className="fas fa-gem text-lg md:text-xl"></i>
            </div>
            <div className="hidden sm:block leading-tight">
              <h1 className="text-sm md:text-xl font-black text-slate-800 tracking-tight">{t.appTitle}</h1>
              <p className="text-[8px] md:text-[9px] font-black text-slate-400 uppercase tracking-widest">{t.brand}</p>
            </div>
          </div>

          {/* Marquee Info */}
          <div className="flex-grow overflow-hidden relative marquee-mask h-full flex items-center max-w-md hidden lg:flex">
            <div className={`animate-marquee inline-block py-2 ${language === 'ar' ? 'rtl-marquee' : ''}`}>
              <span className="text-xs md:text-sm font-black text-slate-700 px-8">{t.scrollingMsg}</span>
            </div>
          </div>

          {/* Controls & Profile */}
          <div className="flex items-center gap-2 md:gap-3">
            {/* User Profile (Desktop) */}
            {user && (
              <div className="hidden lg:flex items-center gap-3 px-4 py-2 bg-slate-50 border border-slate-100 rounded-2xl">
                <div className={`w-8 h-8 rounded-full ${themeConfig.bg} flex items-center justify-center text-white text-[10px] font-black`}>
                  {user.name.charAt(0)}
                </div>
                <div className="text-left">
                  <p className="text-[10px] font-black text-slate-800 leading-none mb-1">{user.name}</p>
                  <p className="text-[8px] font-bold text-slate-400 leading-none">{user.mobile}</p>
                </div>
              </div>
            )}

            <button 
              onClick={() => { setIsLangOpen(!isLangOpen); setIsThemeOpen(false); }}
              className="w-9 h-9 md:w-11 md:h-11 flex items-center justify-center rounded-xl border border-slate-200/60 bg-white hover:bg-slate-50 transition-all text-sm font-black"
            >
              {languages.find(l => l.id === language)?.flag || '🇧🇩'}
            </button>
            
            <button 
              onClick={() => { setIsThemeOpen(!isThemeOpen); setIsLangOpen(false); }}
              className={`w-9 h-9 md:w-11 md:h-11 flex items-center justify-center rounded-xl border border-slate-200/60 bg-white transition-all ${themeConfig.icon}`}
            >
              <i className="fas fa-palette text-sm"></i>
            </button>

            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="w-9 h-9 md:w-11 md:h-11 flex items-center justify-center rounded-xl border border-slate-200/60 text-slate-600 bg-white shadow-sm"
            >
              <i className={`fas ${isMenuOpen ? 'fa-times' : 'fa-bars'} text-sm`}></i>
            </button>
          </div>
        </div>
      </div>

      {/* Popups */}
      {isLangOpen && (
        <div className="absolute right-4 md:right-16 top-full mt-2 w-40 bg-white border border-slate-100 rounded-2xl shadow-2xl p-2 animate-slide-up z-50">
          {languages.map((l) => (
            <button
              key={l.id}
              onClick={() => { onLanguageChange(l.id); setIsLangOpen(false); }}
              className={`w-full flex items-center gap-3 p-3 hover:bg-slate-50 rounded-xl text-xs font-bold ${language === l.id ? themeConfig.text : 'text-slate-600'}`}
            >
              <span>{l.flag}</span> {l.label}
            </button>
          ))}
        </div>
      )}

      {isThemeOpen && (
        <div className="absolute right-4 md:right-16 top-full mt-2 w-48 bg-white border border-slate-100 rounded-2xl shadow-2xl p-2 animate-slide-up z-50">
          {['emerald', 'blue', 'indigo'].map((th) => (
            <button
              key={th}
              onClick={() => { onThemeChange(th as any); setIsThemeOpen(false); }}
              className="w-full flex items-center gap-3 p-3 hover:bg-slate-50 rounded-xl text-xs font-bold capitalize text-slate-600"
            >
              <span className={`w-3 h-3 rounded-full bg-${th === 'emerald' ? 'emerald' : th === 'blue' ? 'blue' : 'indigo'}-500`}></span>
              {th} Theme
            </button>
          ))}
        </div>
      )}

      {/* Mobile / Full Menu */}
      {isMenuOpen && (
        <div className="absolute inset-x-0 top-full bg-white border-t border-slate-100 p-4 space-y-6 animate-slide-up shadow-2xl z-50 max-h-[85vh] overflow-y-auto">
          {user && (
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-2xl ${themeConfig.bg} flex items-center justify-center text-white text-xl font-black`}>
                  {user.name.charAt(0)}
                </div>
                <div>
                  <p className="text-sm font-black text-slate-800 uppercase tracking-tight">{user.name}</p>
                  <p className="text-xs font-bold text-slate-400 tracking-widest">{user.mobile}</p>
                </div>
              </div>
              <button 
                onClick={() => { onLogout(); setIsMenuOpen(false); }}
                className="px-4 py-2 bg-red-50 text-red-500 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-red-100 transition-colors"
              >
                {t.logout}
              </button>
            </div>
          )}
          
          <div className="pt-2">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2 mb-2">Social Links</p>
            <a 
              href="https://wa.me/8801735308795" 
              target="_blank" 
              className="w-full flex items-center justify-center gap-3 p-4 rounded-xl bg-emerald-600 text-white font-black text-sm shadow-lg active:scale-[0.98] transition-all"
            >
              <i className="fab fa-whatsapp text-lg"></i>
              {t.contactWhatsApp}
            </a>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;