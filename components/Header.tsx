
import React, { useState } from 'react';
import { CalcMode } from '../types';

interface Props {
  activeMode: CalcMode;
  setActiveMode: (mode: CalcMode) => void;
}

const Header: React.FC<Props> = ({ activeMode, setActiveMode }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const modes: { id: CalcMode; label: string; icon: string }[] = [
    { id: 'toMurubba', label: 'মাপ থেকে মুরুব্বা', icon: 'fa-cube' },
    { id: 'toMurubbaFromPieces', label: 'পিস থেকে মুরুব্বা', icon: 'fa-layer-group' },
    { id: 'toPieces', label: 'মুরুব্বা থেকে পিস', icon: 'fa-th' },
    { id: 'toPiecesFromMeter', label: 'মিটার থেকে পিস', icon: 'fa-arrows-alt-h' },
  ];

  const facebookUrl = "https://www.facebook.com/KareenaGroup"; // আপনার ফেইসবুক আইডি এখানে দিন

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-md">
      <div className="container mx-auto px-4">
        <div className="h-24 flex items-center justify-between">
          {/* Logo Section */}
          <div className="flex items-center gap-4 cursor-pointer" onClick={() => window.location.reload()}>
            <div className="bg-slate-900 text-white w-14 h-14 rounded-2xl flex items-center justify-center shadow-xl transition-transform hover:scale-105 active:scale-95">
              <i className="fas fa-gem text-2xl"></i>
            </div>
            <div className="hidden sm:block">
              <h1 className="text-2xl font-black text-slate-900 leading-none mb-1">কারিনা গ্রুপ</h1>
              <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em]">পাথর হিসাব ক্যালকুলেটর</p>
            </div>
          </div>
          
          {/* Desktop Navigation - Calculation Modes */}
          <nav className="hidden lg:flex items-center gap-1 bg-slate-100 p-1.5 rounded-2xl border border-slate-200">
            {modes.map((mode) => (
              <button
                key={mode.id}
                onClick={() => setActiveMode(mode.id)}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-black transition-all ${
                  activeMode === mode.id
                    ? 'bg-white text-emerald-600 shadow-md border border-emerald-50 scale-[1.02]'
                    : 'text-slate-500 hover:text-slate-800 hover:bg-white/50'
                }`}
              >
                <i className={`fas ${mode.icon} text-xs ${activeMode === mode.id ? 'text-emerald-500' : 'text-slate-300'}`}></i>
                {mode.label}
              </button>
            ))}
          </nav>

          {/* Contact and Status Section */}
          <div className="flex items-center gap-3 sm:gap-6">
            <div className="hidden sm:flex items-center gap-2 px-5 py-2.5 bg-emerald-50 text-emerald-600 rounded-full text-xs font-black border border-emerald-100 uppercase tracking-widest">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              সিস্টেম সচল
            </div>

            {/* Desktop Contact Link */}
            <a 
              href={facebookUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="hidden md:flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-black shadow-lg shadow-blue-500/30 transition-all hover:translate-y-[-2px] active:translate-y-0"
            >
              <i className="fab fa-facebook-f"></i>
              যোগাযোগ
            </a>

            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden text-slate-600 p-3 hover:bg-slate-100 rounded-2xl transition-all border border-slate-100"
            >
              <i className={`fas ${isMenuOpen ? 'fa-times' : 'fa-bars'} text-2xl`}></i>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden py-6 border-t border-slate-100 animate-in slide-in-from-top-2 duration-300">
            <div className="grid grid-cols-1 gap-3">
              <p className="px-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">হিসাব পদ্ধতি নির্বাচন করুন</p>
              {modes.map((mode) => (
                <button
                  key={mode.id}
                  onClick={() => {
                    setActiveMode(mode.id);
                    setIsMenuOpen(false);
                  }}
                  className={`flex items-center gap-4 px-6 py-5 rounded-2xl text-base font-black transition-all ${
                    activeMode === mode.id
                      ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-200'
                      : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <i className={`fas ${mode.icon} w-6`}></i>
                  {mode.label}
                </button>
              ))}

              <div className="h-px bg-slate-100 my-2 mx-4"></div>
              
              <p className="px-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">সরাসরি যোগাযোগ</p>
              <a 
                href={facebookUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-4 px-6 py-5 rounded-2xl text-base font-black bg-blue-50 text-blue-600 hover:bg-blue-100 transition-all"
              >
                <i className="fab fa-facebook w-6 text-xl"></i>
                ফেইসবুকে যোগাযোগ করুন
              </a>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
