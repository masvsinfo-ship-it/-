
import React, { useState, useRef, useEffect } from 'react';
import { Language } from './types';

interface HeaderProps {
  currentLang: Language;
  onLangChange: (lang: Language) => void;
  t: any;
}

const Header: React.FC<HeaderProps> = ({ currentLang, onLangChange, t }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const languages = [
    { code: Language.BN, label: 'বাংলা', flag: '🇧🇩' },
    { code: Language.HI, label: 'हिन्दी', flag: '🇮🇳' },
    { code: Language.AR, label: 'العربية', flag: '🇸🇦' },
    { code: Language.EN, label: 'English', flag: '🇺🇸' },
  ];

  const currentLanguage = languages.find(l => l.code === currentLang) || languages[0];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="bg-white px-6 pt-10 pb-4 border-b border-slate-50 sticky top-0 z-50">
      <div className="max-w-md mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#00a651] rounded-xl flex items-center justify-center shadow-lg shadow-green-100">
            <span className="text-white text-xl">💎</span>
          </div>
          <div>
            <h1 className="text-[#1e293b] font-bold text-lg leading-tight">{t.appName}</h1>
            <p className="text-slate-400 text-[10px] font-medium tracking-tighter">{t.groupName}</p>
          </div>
        </div>
        
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-2 bg-slate-50 px-3 py-2 rounded-xl border border-slate-100 hover:bg-slate-100 transition-all active:scale-95"
          >
            <span className="text-lg">{currentLanguage.flag}</span>
            <span className="text-xs font-bold text-slate-700">{currentLanguage.label}</span>
          </button>

          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-40 bg-white border border-slate-100 rounded-2xl shadow-2xl overflow-hidden animate-fadeIn z-50">
              <div className="py-1">
                {languages.map((l) => (
                  <button
                    key={l.code}
                    onClick={() => {
                      onLangChange(l.code);
                      setIsDropdownOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-slate-50 ${
                      currentLang === l.code ? 'bg-green-50 text-[#00a651]' : 'text-slate-600'
                    }`}
                  >
                    <span className="text-xl">{l.flag}</span>
                    <span className="text-sm font-bold">{l.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
