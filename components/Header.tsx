
import React, { useState } from 'react';
import { CalcMode, Language, UserProfile } from '../types.ts';
import { translations } from '../translations.ts';

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
    emerald: {
      bg: 'bg-emerald-600',
      text: 'text-emerald-600',
      shadow: 'shadow-emerald-500/20',
      icon: 'text-emerald-500',
      marqueeBg: 'bg-emerald-50',
      marqueeText: 'text-emerald-700',
      marqueeBorder: 'border-emerald-100'
    },
    blue: {
      bg: 'bg-blue-600',
      text: 'text-blue-600',
      shadow: 'shadow-blue-500/20',
      icon: 'text-blue-500',
      marqueeBg: 'bg-blue-50',
      marqueeText: 'text-blue-700',
      marqueeBorder: 'border-blue-100'
    },
    indigo: {
      bg: 'bg-indigo-600',
      text: 'text-indigo-600',
      shadow: 'shadow-indigo-500/20',
      icon: 'text-indigo-500',
      marqueeBg: 'bg-indigo-50',
      marqueeText: 'text-indigo-700',
      marqueeBorder: 'border-indigo-100'
    }
  }[currentTheme];

  const modes: { id: CalcMode; label: string; icon: string }[] = [
    { id: 'toMurubba', label: t.toMurubba, icon: 'fa-cube' },
    { id: 'toMurubbaFromPieces', label: t.toMurubbaFromPieces, icon: 'fa-layer-group' },
    { id: 'toPieces', label: t.toPieces, icon: 'fa-th' },
    { id: 'toPiecesFromMeter', label: t.toPiecesFromMeter, icon: 'fa-arrows-alt-h' },
  ];

  const languages: { id: Language; label: string; flag: string }[] = [
    { id: 'bn', label: 'বাংলা', flag: '🇧🇩' },
    { id: 'en', label: 'English', flag: '🇺🇸' },
    { id: 'hi', label: 'हिन्दी', flag: '🇮🇳' },
    { id: 'ar', label: 'العربية', flag: '🇸🇦' },
  ];

  return (
    <div className="sticky top-0 z-50">
      <header className="glass border-b border-slate-200/50 shadow-sm relative z-30">
        <div className="container mx-auto px-4">
          <div className="h-20 flex items-center justify-between gap-4">
            <div className={`flex items-center gap-3 shrink-0`}>
              <div className={`w-10 h-10 md:w-12 md:h-12 ${themeConfig.bg} rounded-xl md:rounded-2xl flex items-center justify-center text-white shadow-lg ${themeConfig.shadow}`}>
                <i className="fas fa-gem text-lg md:text-xl"></i>
              </div>
              <div className="leading-tight">
                <h1 className="text-sm md:text-xl font-black text-slate-800 tracking-tight whitespace-nowrap">{t.appTitle}</h1>
                <p className="text-[8px] md:text-[9px] font-black text-slate-400 uppercase tracking-widest">{t.brand}</p>
              </div>
            </div>

            <div className="flex items-center gap-1 md:gap-2 shrink-0">
              <button 
                onClick={() => { setIsLangOpen(!isLangOpen); setIsThemeOpen(false); }}
                className="w-9 h-9 md:w-11 md:h-11 flex items-center justify-center rounded-lg md:rounded-xl border border-slate-200/60 bg-white hover:bg-slate-50 transition-all text-xs font-black"
              >
                {languages.find(l => l.id === language)?.flag}
              </button>
              <button 
                onClick={() => { setIsThemeOpen(!isThemeOpen); setIsLangOpen(false); }}
                className={`w-9 h-9 md:w-11 md:h-11 flex items-center justify-center rounded-lg md:rounded-xl border border-slate-200/60 hover:bg-white transition-all ${themeConfig.icon}`}
              >
                <i className="fas fa-palette text-xs md:text-base"></i>
              </button>
              <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="w-9 h-9 md:w-11 md:h-11 flex items-center justify-center rounded-lg md:rounded-xl border border-slate-200/60 text-slate-600 bg-white shadow-sm"
              >
                <i className={`fas ${isMenuOpen ? 'fa-times' : 'fa-bars'} text-xs md:text-base`}></i>
              </button>
            </div>
          </div>
        </div>

        {isLangOpen && (
          <div className={`absolute ${language === 'ar' ? 'left-16' : 'right-16'} top-full mt-2 w-40 bg-white border border-slate-100 rounded-2xl shadow-2xl p-2 animate-slide-up z-50`}>
            {languages.map((l) => (
              <button
                key={l.id}
                onClick={() => { onLanguageChange(l.id); setIsLangOpen(false); }}
                className={`w-full flex items-center gap-3 p-3 hover:bg-slate-50 rounded-xl text-xs font-bold ${language === l.id ? themeConfig.text : 'text-slate-600'}`}
              >
                <span>{l.flag}</span>
                {l.label}
              </button>
            ))}
          </div>
        )}

        {isThemeOpen && (
          <div className={`absolute ${language === 'ar' ? 'left-4' : 'right-4'} top-full mt-2 w-48 bg-white border border-slate-100 rounded-2xl shadow-2xl p-2 animate-slide-up z-50`}>
            {[
              { id: 'emerald', label: 'Emerald', dot: 'bg-emerald-500' },
              { id: 'blue', label: 'Blue', dot: 'bg-blue-600' },
              { id: 'indigo', label: 'Indigo', dot: 'bg-indigo-600' }
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => { onThemeChange(t.id as any); setIsThemeOpen(false); }}
                className="w-full flex items-center gap-3 p-3 hover:bg-slate-50 rounded-xl text-xs font-bold capitalize text-slate-600"
              >
                <span className={`w-3 h-3 rounded-full ${t.dot}`}></span>
                {t.label} Theme
              </button>
            ))}
          </div>
        )}

        {isMenuOpen && (
          <div className="absolute inset-x-0 top-full bg-white border-t border-slate-100 p-4 space-y-6 animate-slide-up shadow-2xl z-50 max-h-[80vh] overflow-y-auto">
            {user && (
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-slate-400 text-xl font-black">
                    {user.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-black text-slate-800 uppercase tracking-tight">{user.name}</p>
                    <p className="text-xs font-bold text-slate-400 tracking-widest">{user.mobile}</p>
                  </div>
                </div>
                <button 
                  onClick={onLogout}
                  className="px-4 py-2 bg-red-50 text-red-500 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-red-100 transition-colors"
                >
                  {t.logout}
                </button>
              </div>
            )}

            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2 mb-2">{t.calcType}</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {modes.map((mode) => (
                  <button
                    key={mode.id}
                    onClick={() => { setActiveMode(mode.id); setIsMenuOpen(false); }}
                    className={`w-full flex items-center gap-4 p-4 rounded-xl text-sm font-black transition-all ${
                      activeMode === mode.id ? `${themeConfig.bg} text-white shadow-lg` : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <i className={`fas ${mode.icon} w-6 text-center`}></i>
                    {mode.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Marquee Bar with Dynamic Colors */}
      <div className={`${themeConfig.marqueeBg} ${themeConfig.marqueeBorder} border-b py-2 overflow-hidden marquee-mask relative z-20 shadow-sm`}>
        <div className="animate-marquee whitespace-nowrap">
          <span className={`text-[11px] md:text-sm font-black ${themeConfig.marqueeText} px-12 tracking-tight uppercase`}>{t.scrollingMsg}</span>
          <span className={`text-[11px] md:text-sm font-black ${themeConfig.marqueeText} px-12 tracking-tight uppercase`}>{t.scrollingMsg}</span>
        </div>
      </div>
    </div>
  );
};

export default Header;
