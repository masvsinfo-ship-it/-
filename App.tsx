
import React, { useState } from 'react';
import { CalculatorTab, Language } from './types';
import { translations } from './translations';
import Header from './Header';
import VolumeCalculator from './VolumeCalculator';
import MurubbaToPiece from './MurubbaToPiece';
import MeterToPiece from './MeterToPiece';
import PieceToAll from './PieceToAll';
import GeminiAssistant from './GeminiAssistant';
import DeveloperInfo from './DeveloperInfo';
import History from './History';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<CalculatorTab>(CalculatorTab.VOLUME);
  const [lang, setLang] = useState<Language>(Language.BN);

  const t = translations[lang];

  const renderContent = () => {
    switch (activeTab) {
      case CalculatorTab.VOLUME: return <VolumeCalculator t={t} />;
      case CalculatorTab.MURUBBA_TO_PIECE: return <MurubbaToPiece t={t} />;
      case CalculatorTab.METER_TO_PIECE: return <MeterToPiece t={t} />;
      case CalculatorTab.PIECE_TO_ALL: return <PieceToAll t={t} />;
      case CalculatorTab.HISTORY: return <History t={t} />;
      case CalculatorTab.GEMINI_AI: return <GeminiAssistant t={t} lang={lang} />;
      default: return <VolumeCalculator t={t} />;
    }
  };

  const tabs = [
    { id: CalculatorTab.VOLUME, label: t.tabs.volume, icon: '📐' },
    { id: CalculatorTab.MURUBBA_TO_PIECE, label: t.tabs.murubba, icon: '🧱' },
    { id: CalculatorTab.METER_TO_PIECE, label: t.tabs.meter, icon: '📏' },
    { id: CalculatorTab.PIECE_TO_ALL, label: t.tabs.piece, icon: '🔢' },
    // Fix: Changed CalculatorTab.AI to CalculatorTab.GEMINI_AI and used t.tabs.ai for consistency
    { id: CalculatorTab.GEMINI_AI, icon: '🤖', label: t.tabs.ai },
    { id: CalculatorTab.HISTORY, label: t.tabs.history, icon: '📜' }
  ];

  return (
    <div className="h-screen flex flex-col bg-[#f5f7fa] overflow-hidden">
      <Header currentLang={lang} onLangChange={setLang} t={t} />
      <div className="bg-white border-b border-slate-100 shadow-sm sticky top-[105px] z-40 overflow-x-auto no-scrollbar">
        <div className="max-w-md mx-auto flex items-center px-4 py-3 gap-2">
          {tabs.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id as CalculatorTab)} className={`flex items-center gap-2 whitespace-nowrap px-4 py-2 rounded-2xl font-bold text-xs transition-all ${activeTab === tab.id ? 'bg-[#00a651] text-white scale-105' : 'bg-slate-50 text-slate-400'}`}>
              <span>{tab.icon}</span><span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>
      <main className="flex-grow overflow-y-auto p-5 no-scrollbar">
        <div className="max-w-md mx-auto animate-fadeIn">
          {renderContent()}
          <DeveloperInfo t={t} />
        </div>
      </main>
      <footer className="bg-white/30 backdrop-blur-sm py-2 text-center text-[9px] text-slate-300 font-bold uppercase tracking-widest">Carina Group Stone Solution</footer>
    </div>
  );
};

export default App;
