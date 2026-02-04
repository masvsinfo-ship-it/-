
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
      icon: 'text-emerald-500'
    },
    blue: {
      bg: 'bg-blue-600',
      text: 'text-blue-600',
      shadow: 'shadow-blue-500/20',
      icon: 'text-blue-500'
    },
    indigo: {
      bg: 'bg-indigo-600',
      text: 'text-indigo-600',
      shadow: 'shadow-indigo-500/20',
      icon: 'text-indigo-500'
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

  const devWhatsAppUrl = "https://wa.me/8801735308795";

  return (
    <header className="sticky top-0 z-50 glass border-b border-slate-200/50 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="h-20 md:h-28 flex items-center gap-2 md:gap-4 relative">
          <div className={`flex items-center gap-2 md:gap-3 shrink-0 z-20 bg-white/90 py-2 ${language === 'ar' ? 'pl-3 rounded-l-2xl border-l' : 'pr-3 rounded-r-2xl border-r'} border-slate-100/50`}>
            <div className={`w-9 h-9 md:w-12 md:h-12 ${themeConfig.bg} rounded-xl md:rounded-2xl flex items-center justify-center text-white shadow-lg ${themeConfig.shadow}`}>
              <i className="fas fa-gem text-sm md:text-xl"></i>
            </div>
            <div className="leading-tight">
              <h1 className="text-[12px] md:text-xl font-black text-slate-800 tracking-tight whitespace-nowrap">{t.appTitle}</h1>
              <p className="text-[6px] md:text-[9px] font-black text-slate-400 uppercase tracking-widest">{t.brand}</p>
            </div>
          </div>
          
          <div className="flex-grow overflow-hidden relative marquee-mask h-full flex items-center z-10">
            <div className={`animate-marquee inline-block py-2 ${language === 'ar' ? 'rtl-marquee' : ''}`}>
              <span className="text-xs md:text-2xl font-black text-slate-700 px-12">{t.scrollingMsg}</span>
              <span className="text-xs md:text-2xl font-black text-slate-700 px-12">{t.scrollingMsg}</span>
            </div>
          </div>

          <div className={`flex items-center gap-1 md:gap-2 shrink-0 z-20 bg-white/90 py-2 ${language === 'ar' ? 'pr-3 rounded-r-2xl border-r' : 'pl-3 rounded-l-2xl border-l'} border-slate-100/50`}>
             {user && (
              <div className="hidden lg:flex items-center gap-3 mr-4 px-4 py-2 bg-slate-50 border border-slate-100 rounded-2xl">
                <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-500 font-black text-[10px]">
                  {user.name.charAt(0)}
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-800 uppercase tracking-tight">{user.name}</p>
                  <p className="text-[8px] font-bold text-slate-400 tracking-widest">{user.mobile}</p>
                </div>
              </div>
            )}

            <button 
              onClick={() => { setIsLangOpen(!isLangOpen); setIsThemeOpen(false); }}
              className="w-8 h-8 md:w-11 md:h-11 flex items-center justify-center rounded-lg md:rounded-xl border border-slate-200/60 bg-white hover:bg-slate-50 transition-all text-xs font-black"
            >
              {languages.find(l => l.id === language)?.flag}
            </button>
            <button 
              onClick={() => { setIsThemeOpen(!isThemeOpen); setIsLangOpen(false); }}
              className={`w-8 h-8 md:w-11 md:h-11 flex items-center justify-center rounded-lg md:rounded-xl border border-slate-200/60 hover:bg-white transition-all ${themeConfig.icon}`}
            >
              <i className="fas fa-palette text-xs md:text-base"></i>
            </button>
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="w-8 h-8 md:w-11 md:h-11 flex items-center justify-center rounded-lg md:rounded-xl border border-slate-200/60 text-slate-600 bg-white shadow-sm"
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
          
          <div className="pt-4 border-t border-slate-100">
             <a 
              href={devWhatsAppUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-3 p-4 rounded-xl bg-emerald-600 text-white font-black text-sm shadow-lg shadow-emerald-200 active:scale-[0.98] transition-all"
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
