import React, { useState, useEffect, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import { GoogleGenAI } from "@google/genai";

// Types
enum Language { BN = 'bn', EN = 'en' }
enum Tab { VOL = 'VOL', MUR = 'MUR', MET = 'MET', PCS = 'PCS', AI = 'AI', HIS = 'HIS' }

const translations = {
  [Language.BN]: {
    appName: 'পাথরের হিসাব', groupName: 'কারিনা গ্রুপ', calc: 'হিসাব করুন',
    length: 'দৈর্ঘ্য (মি)', width: 'প্রস্থ (মি)', thick: 'পুরুত্ব (সেমি)', pieces: 'পিস',
    murubba: 'মুরুব্বা', meter: 'মিটার', rateMur: 'দর (মুরুব্বা)', rateMet: 'দর (মিটার)',
    res: 'ফলাফল', tMur: 'মোট মুরুব্বা', tMet: 'মোট মিটার', tPcs: 'মোট পিস',
    pMur: 'মুরুব্বা দাম', pMet: 'মিটার দাম', tVol: 'মোট ভলিউম (m³)', 
    his: 'হিস্টোরি', empty: 'কোন তথ্য নেই', ask: 'AI জিজ্ঞাসা',
    tabs: { [Tab.VOL]: 'ভলিউম', [Tab.MUR]: 'মুরুব্বা', [Tab.MET]: 'মিটার', [Tab.PCS]: 'পিস', [Tab.AI]: 'এআই', [Tab.HIS]: 'হিস্টোরি' }
  },
  [Language.EN]: {
    appName: 'Stone Calc', groupName: 'Carina Group', calc: 'Calculate',
    length: 'Length (m)', width: 'Width (m)', thick: 'Thickness (cm)', pieces: 'Pieces',
    murubba: 'Murubba', meter: 'Meter', rateMur: 'Rate (Murubba)', rateMet: 'Rate (Meter)',
    res: 'Result', tMur: 'Total Murubba', tMet: 'Total Meter', tPcs: 'Total Pieces',
    pMur: 'Price (Murubba)', pMet: 'Price (Meter)', tVol: 'Total Vol (m³)',
    his: 'History', empty: 'No Data', ask: 'Ask AI',
    tabs: { [Tab.VOL]: 'Volume', [Tab.MUR]: 'Murubba', [Tab.MET]: 'Meter', [Tab.PCS]: 'Piece', [Tab.AI]: 'AI', [Tab.HIS]: 'History' }
  }
};

const App = () => {
  const [lang, setLang] = useState<Language>(Language.BN);
  const [activeTab, setActiveTab] = useState<Tab>(Tab.VOL);
  const [history, setHistory] = useState<any[]>(() => {
    const saved = localStorage.getItem('stone_history_v4');
    return saved ? JSON.parse(saved) : [];
  });

  const t = translations[lang];

  useEffect(() => {
    localStorage.setItem('stone_history_v4', JSON.stringify(history));
  }, [history]);

  const addHistory = (type: string, results: any) => {
    const item = { id: Date.now(), time: new Date().toLocaleTimeString(), type, results };
    setHistory(prev => [item, ...prev].slice(0, 20));
  };

  return (
    <div className="min-h-screen pb-24 flex flex-col max-w-md mx-auto bg-white shadow-2xl shadow-slate-200">
      {/* Header */}
      <header className="bg-white px-6 pt-10 pb-4 border-b border-slate-50 sticky top-0 z-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#00a651] rounded-2xl flex items-center justify-center shadow-lg shadow-green-100">
              <span className="text-white text-xl">💎</span>
            </div>
            <div>
              <h1 className="text-[#1e293b] font-bold text-lg leading-tight">{t.appName}</h1>
              <p className="text-slate-400 text-[10px] font-bold uppercase tracking-tighter">{t.groupName}</p>
            </div>
          </div>
          <button 
            onClick={() => setLang(lang === Language.BN ? Language.EN : Language.BN)}
            className="bg-slate-50 px-3 py-2 rounded-xl border border-slate-100 font-bold text-xs text-slate-600 active:scale-95 transition-all"
          >
            {lang === Language.BN ? 'EN 🇺🇸' : 'BN 🇧🇩'}
          </button>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white border-b border-slate-100 sticky top-[90px] z-40 py-4 overflow-x-auto no-scrollbar">
        <div className="flex gap-2 px-4 min-w-max">
          {Object.values(Tab).map(tab => (
            <button 
              key={tab} 
              onClick={() => setActiveTab(tab)}
              className={`flex items-center gap-2 px-5 py-3 rounded-2xl font-bold text-xs transition-all ${
                activeTab === tab ? 'bg-[#00a651] text-white shadow-lg shadow-green-100 scale-105' : 'bg-slate-50 text-slate-400 border border-slate-100'
              }`}
            >
              {t.tabs[tab]}
            </button>
          ))}
        </div>
      </nav>

      {/* Content */}
      <main className="flex-grow p-5 animate-fadeIn">
        {activeTab === Tab.VOL && <VolumeCalc t={t} onSave={addHistory} />}
        {activeTab === Tab.MUR && <MurubbaToPiece t={t} onSave={addHistory} />}
        {activeTab === Tab.MET && <MeterToPiece t={t} onSave={addHistory} />}
        {activeTab === Tab.PCS && <PieceToAll t={t} onSave={addHistory} />}
        {activeTab === Tab.AI && <GeminiAssistant t={t} lang={lang} />}
        {activeTab === Tab.HIS && <HistoryView t={t} history={history} setHistory={setHistory} />}
      </main>

      {/* Developer Badge */}
      <div className="p-8 text-center bg-white mx-5 mt-10 rounded-[40px] border border-slate-100 shadow-sm mb-10">
          <p className="text-slate-300 text-[10px] font-bold uppercase tracking-widest mb-4">Developed by Billal</p>
          <div className="flex justify-center gap-6">
              <a href="https://wa.me/8801735308795" className="w-12 h-12 bg-[#25d366] text-white rounded-2xl flex items-center justify-center text-xl shadow-lg shadow-green-100 active:scale-90 transition-all">W</a>
              <a href="https://fb.com/billal8795" className="w-12 h-12 bg-[#1877f2] text-white rounded-2xl flex items-center justify-center text-xl shadow-lg shadow-blue-100 active:scale-90 transition-all">F</a>
          </div>
      </div>

      <footer className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-md border-t border-slate-50 py-3 text-center z-50 max-w-md mx-auto">
        <p className="text-[9px] font-bold text-slate-400 tracking-widest uppercase">Carina Group Stone Solution © 2024</p>
      </footer>
    </div>
  );
};

// Sub-components
const VolumeCalc = ({ t, onSave }: any) => {
  const [val, setVal] = useState({ l: '1', w: '1', t: '3', p: '1', rM: '' });
  const [res, setRes] = useState<any>(null);

  const calculate = () => {
    const area = parseFloat(val.l) * parseFloat(val.w) * parseFloat(val.p);
    const vol = area * (parseFloat(val.t) / 100);
    const met = parseFloat(val.l) * parseFloat(val.p);
    const price = val.rM ? area * parseFloat(val.rM) : null;
    const result = { mur: area, met, vol, price };
    setRes(result);
    onSave('ভলিউম', result);
  };

  return (
    <div className="space-y-6">
      <div className="app-card p-6 grid grid-cols-2 gap-4">
        <Input label={t.length} val={val.l} onChange={v => setVal({...val, l: v})} />
        <Input label={t.width} val={val.w} onChange={v => setVal({...val, w: v})} />
        <Input label={t.thick} val={val.t} onChange={v => setVal({...val, t: v})} />
        <Input label={t.pieces} val={val.p} onChange={v => setVal({...val, p: v})} color="text-green-600" />
        <div className="col-span-2">
          <Input label={t.rateMur} val={val.rM} onChange={v => setVal({...val, rM: v})} placeholder="ঐচ্ছিক" />
        </div>
        <button onClick={calculate} className="col-span-2 bg-[#00a651] text-white py-4 rounded-2xl font-bold shadow-lg shadow-green-100 active:scale-95 transition-all mt-2">{t.calc}</button>
      </div>
      {res && (
        <div className="grid grid-cols-2 gap-4 animate-fadeIn">
          <div className="bg-[#00a651] text-white p-6 rounded-3xl text-center shadow-lg shadow-green-50">
            <p className="text-[10px] font-bold opacity-70 uppercase mb-1">{t.tMur}</p>
            <h3 className="text-3xl font-black">{res.mur.toFixed(2)}</h3>
          </div>
          <div className="bg-white border border-slate-100 p-6 rounded-3xl text-center">
            <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">{t.tMet}</p>
            <h3 className="text-3xl font-black text-slate-700">{res.met.toFixed(2)}</h3>
          </div>
          {res.price && (
            <div className="col-span-2 bg-amber-500 text-white p-5 rounded-3xl text-center shadow-lg shadow-amber-50">
              <p className="text-[10px] font-bold opacity-80 uppercase mb-1">{t.pMur}</p>
              <h3 className="text-4xl font-black">{res.price.toLocaleString()} ৳</h3>
            </div>
          )}
          <div className="col-span-2 bg-slate-800 text-white p-3 rounded-2xl text-center text-xs">
            {t.tVol}: {res.vol.toFixed(3)} m³
          </div>
        </div>
      )}
    </div>
  );
};

const MurubbaToPiece = ({ t, onSave }: any) => {
  const [val, setVal] = useState({ l: '0.60', w: '0.30', m: '25' });
  const [res, setRes] = useState<any>(null);
  const calculate = () => {
    const pcs = Math.ceil(parseFloat(val.m) / (parseFloat(val.l) * parseFloat(val.w)));
    setRes(pcs);
    onSave('মুরুব্বা → পিস', { pcs, mur: parseFloat(val.m) });
  };
  return (
    <div className="space-y-6">
      <div className="app-card p-6 grid grid-cols-2 gap-4">
        <Input label={t.length} val={val.l} onChange={v => setVal({...val, l: v})} />
        <Input label={t.width} val={val.w} onChange={v => setVal({...val, w: v})} />
        <div className="col-span-2">
          <Input label={t.murubba} val={val.m} onChange={v => setVal({...val, m: v})} />
        </div>
        <button onClick={calculate} className="col-span-2 bg-blue-600 text-white py-4 rounded-2xl font-bold shadow-lg active:scale-95 transition-all mt-2">{t.calc}</button>
      </div>
      {res && (
        <div className="bg-blue-600 text-white p-10 rounded-[40px] text-center shadow-xl animate-fadeIn">
            <p className="text-xs font-bold opacity-70 uppercase mb-2">{t.tPcs}</p>
            <h3 className="text-6xl font-black">{res}</h3>
        </div>
      )}
    </div>
  );
};

const MeterToPiece = ({ t, onSave }: any) => {
  const [val, setVal] = useState({ l: '0.60', m: '25' });
  const [res, setRes] = useState<any>(null);
  const calculate = () => {
    const pcs = Math.ceil(parseFloat(val.m) / parseFloat(val.l));
    setRes(pcs);
    onSave('মিটার → পিস', { pcs, met: parseFloat(val.m) });
  };
  return (
    <div className="space-y-6">
      <div className="app-card p-6 grid grid-cols-2 gap-4">
        <Input label={t.length} val={val.l} onChange={v => setVal({...val, l: v})} />
        <Input label={t.meter} val={val.m} onChange={v => setVal({...val, m: v})} />
        <button onClick={calculate} className="col-span-2 bg-indigo-600 text-white py-4 rounded-2xl font-bold shadow-lg active:scale-95 transition-all mt-2">{t.calc}</button>
      </div>
      {res && (
        <div className="bg-indigo-600 text-white p-10 rounded-[40px] text-center shadow-xl animate-fadeIn">
            <p className="text-xs font-bold opacity-70 uppercase mb-2">{t.tPcs}</p>
            <h3 className="text-6xl font-black">{res}</h3>
        </div>
      )}
    </div>
  );
};

const PieceToAll = ({ t, onSave }: any) => {
  const [val, setVal] = useState({ l: '0.60', w: '0.30', p: '100' });
  const [res, setRes] = useState<any>(null);
  const calculate = () => {
    const l = parseFloat(val.l);
    const w = parseFloat(val.w);
    const p = parseFloat(val.p);
    const mur = p * l * w;
    const met = p * l;
    setRes({ mur, met });
    onSave('পিস → অল', { mur, met, pcs: p });
  };
  return (
    <div className="space-y-6">
      <div className="app-card p-6 grid grid-cols-2 gap-4">
        <Input label={t.length} val={val.l} onChange={v => setVal({...val, l: v})} />
        <Input label={t.width} val={val.w} onChange={v => setVal({...val, w: v})} />
        <div className="col-span-2">
          <Input label={t.pieces} val={val.p} onChange={v => setVal({...val, p: v})} color="text-red-500" />
        </div>
        <button onClick={calculate} className="col-span-2 bg-red-600 text-white py-4 rounded-2xl font-bold shadow-lg active:scale-95 transition-all mt-2">{t.calc}</button>
      </div>
      {res && (
        <div className="grid grid-cols-2 gap-4 animate-fadeIn">
          <div className="bg-[#00a651] text-white p-6 rounded-3xl text-center shadow-lg">
            <p className="text-[10px] font-bold opacity-70 uppercase mb-1">{t.tMur}</p>
            <h3 className="text-3xl font-black">{res.mur.toFixed(2)}</h3>
          </div>
          <div className="bg-white border border-slate-100 p-6 rounded-3xl text-center">
            <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">{t.tMet}</p>
            <h3 className="text-3xl font-black text-slate-700">{res.met.toFixed(2)}</h3>
          </div>
        </div>
      )}
    </div>
  );
};

const GeminiAssistant = ({ t, lang }: any) => {
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);

  const askAI = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    setResponse('');
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
      const result = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `You are a stone construction expert. Helpful, accurate, and concise. User asks in ${lang}: ${prompt}. Focus on stone measurements, Murubba, Meter, and Piece concepts. Answer in ${lang}.`,
      });
      setResponse(result.text || 'No response.');
    } catch (e) {
      setResponse('Error connecting to AI. Please check your API key.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="app-card p-6">
        <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">🤖 AI Assistant</h3>
        <textarea 
          value={prompt} 
          onChange={e => setPrompt(e.target.value)} 
          className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 text-sm min-h-[100px] outline-none focus:border-blue-400 transition-all" 
          placeholder="পাথর বা হিসাব নিয়ে প্রশ্ন করুন..." 
        />
        <button 
          onClick={askAI} 
          disabled={loading} 
          className="w-full mt-3 bg-blue-600 text-white py-4 rounded-2xl font-bold shadow-lg active:scale-95 transition-all disabled:opacity-50"
        >
          {loading ? 'ভাবছি...' : t.ask}
        </button>
      </div>
      {response && (
        <div className="bg-blue-600 text-white p-6 rounded-3xl shadow-lg animate-fadeIn text-sm leading-relaxed whitespace-pre-wrap">
          {response}
        </div>
      )}
    </div>
  );
};

const HistoryView = ({ t, history, setHistory }: any) => (
  <div className="space-y-4">
    <div className="flex justify-between items-center mb-2">
      <h3 className="font-bold text-slate-800">{t.his}</h3>
      {history.length > 0 && (
        <button 
          onClick={() => { if(confirm('সব মুছবেন?')) setHistory([]); }} 
          className="text-[10px] font-bold text-red-500 uppercase bg-red-50 px-3 py-1.5 rounded-full border border-red-100"
        >
          Clear
        </button>
      )}
    </div>
    {history.length === 0 ? (
      <div className="p-20 text-center text-slate-300 font-bold uppercase tracking-widest">{t.empty}</div>
    ) : (
      history.map((item: any) => (
        <div key={item.id} className="app-card p-5 border border-slate-50 relative animate-fadeIn group">
          <div className="flex justify-between items-start mb-2">
            <span className="text-[10px] font-black bg-slate-100 px-2 py-0.5 rounded text-slate-500 uppercase">{item.type}</span>
            <span className="text-[10px] text-slate-300">{item.time}</span>
          </div>
          <div className="text-sm font-bold text-slate-700 flex flex-wrap gap-2">
            {item.results.pcs && <span className="bg-blue-50 text-blue-600 px-2 py-1 rounded-lg">পিস: {item.results.pcs}</span>}
            {item.results.mur && <span className="bg-green-50 text-green-600 px-2 py-1 rounded-lg">মুরুব্বা: {item.results.mur.toFixed(2)}</span>}
            {item.results.met && <span className="bg-amber-50 text-amber-600 px-2 py-1 rounded-lg">মিটার: {item.results.met.toFixed(2)}</span>}
          </div>
        </div>
      ))
    )}
  </div>
);

const Input = ({ label, val, onChange, color = "text-slate-400", placeholder = "" }: any) => (
  <div className="space-y-1">
    <label className={`text-[10px] font-bold uppercase ${color}`}>{label}</label>
    <input 
      type="number" 
      value={val} 
      onChange={e => onChange(e.target.value)} 
      placeholder={placeholder} 
      className="input-box w-full p-4 outline-none" 
    />
  </div>
);

const rootElement = document.getElementById('root');
if (rootElement) {
  createRoot(rootElement).render(<App />);
}
