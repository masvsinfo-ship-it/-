
import React, { useState, useEffect } from 'react';
import Header from './components/Header.tsx';
import CalculatorCard from './components/CalculatorCard.tsx';
import ResultDisplay from './components/ResultDisplay.tsx';
import HistoryList from './components/HistoryList.tsx';
import AIAssistant from './components/AIAssistant.tsx';
import LoginOverlay from './components/LoginOverlay.tsx';
import CommunityChat from './components/CommunityChat.tsx';
import AdminDashboard from './components/AdminDashboard.tsx';
import { CalculationResult, HistoryItem, CalcMode, Language, UserProfile } from './types.ts';
import { translations } from './translations.ts';

const App: React.FC = () => {
  const [activeMode, setActiveMode] = useState<CalcMode>('toMurubba');
  const [result, setResult] = useState<CalculationResult | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [theme, setTheme] = useState<'emerald' | 'blue' | 'indigo'>('emerald');
  const [language, setLanguage] = useState<Language>('bn');
  const [user, setUser] = useState<UserProfile | null>(null);
  const [allUsers, setAllUsers] = useState<UserProfile[]>([]);
  const [activeTab, setActiveTab] = useState<'calc' | 'chat' | 'admin'>('calc');

  const t = translations[language as keyof typeof translations] || translations.bn;

  useEffect(() => {
    const savedHistory = localStorage.getItem('stone_calc_history');
    if (savedHistory) setHistory(JSON.parse(savedHistory));
    
    const savedTheme = localStorage.getItem('stone_calc_theme') as any;
    if (savedTheme && ['emerald', 'blue', 'indigo'].includes(savedTheme)) setTheme(savedTheme);

    const savedLang = localStorage.getItem('stone_calc_lang') as Language;
    if (savedLang && ['bn', 'en', 'hi', 'ar'].includes(savedLang)) setLanguage(savedLang);

    const savedUser = localStorage.getItem('stone_calc_user');
    if (savedUser) setUser(JSON.parse(savedUser));

    const savedUsersList = localStorage.getItem('stone_calc_registered_users');
    if (savedUsersList) setAllUsers(JSON.parse(savedUsersList));
  }, []);

  useEffect(() => {
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    localStorage.setItem('stone_calc_lang', language);
  }, [language]);

  const handleLogin = (newUser: UserProfile) => {
    setUser(newUser);
    localStorage.setItem('stone_calc_user', JSON.stringify(newUser));

    // Save to global user list if not already in list
    if (newUser.mobile !== 'ADMIN') {
      const updatedUsersList = [...allUsers];
      const existingUserIndex = updatedUsersList.findIndex(u => u.mobile === newUser.mobile);
      if (existingUserIndex === -1) {
        updatedUsersList.push(newUser);
        setAllUsers(updatedUsersList);
        localStorage.setItem('stone_calc_registered_users', JSON.stringify(updatedUsersList));
      } else {
        // Update name if it changed
        updatedUsersList[existingUserIndex].name = newUser.name;
        setAllUsers(updatedUsersList);
        localStorage.setItem('stone_calc_registered_users', JSON.stringify(updatedUsersList));
      }
    }
  };

  const handleLogout = () => {
    setUser(null);
    setActiveTab('calc');
    localStorage.removeItem('stone_calc_user');
  };

  const handleThemeChange = (newTheme: 'emerald' | 'blue' | 'indigo') => {
    setTheme(newTheme);
    localStorage.setItem('stone_calc_theme', newTheme);
  };

  const handleCalculate = (data: CalculationResult) => {
    setResult(data);
    const newItem: HistoryItem = {
      ...data,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: Date.now(),
      label: `${t.appTitle} ${history.length + 1}`,
      userMobile: user?.mobile
    };
    const updatedHistory = [newItem, ...history].slice(0, 50);
    setHistory(updatedHistory);
    localStorage.setItem('stone_calc_history', JSON.stringify(updatedHistory));
  };

  const clearHistory = () => {
    const remainingHistory = history.filter(item => item.userMobile !== user?.mobile);
    setHistory(remainingHistory);
    localStorage.setItem('stone_calc_history', JSON.stringify(remainingHistory));
  };

  const currentUserHistory = history.filter(item => item.userMobile === user?.mobile);

  const themeAccentBg = {
    emerald: 'bg-emerald-500',
    blue: 'bg-blue-500',
    indigo: 'bg-indigo-500'
  }[theme];

  return (
    <div className={`min-h-screen flex flex-col bg-slate-50/50 ${language === 'ar' ? 'font-serif' : ''}`}>
      {!user && <LoginOverlay language={language} onLogin={handleLogin} allUsers={allUsers} />}
      
      <Header 
        activeMode={activeMode} 
        setActiveMode={setActiveMode} 
        currentTheme={theme} 
        onThemeChange={handleThemeChange} 
        language={language}
        onLanguageChange={setLanguage}
        user={user}
        onLogout={handleLogout}
      />
      
      <main className="flex-grow container mx-auto px-4 py-6 max-w-6xl">
        <div className="flex bg-white p-1 rounded-2xl shadow-sm border border-slate-100 max-w-fit mx-auto mb-6">
          <button 
            onClick={() => setActiveTab('calc')}
            className={`px-6 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${activeTab === 'calc' ? themeAccentBg + ' text-white shadow-lg' : 'text-slate-400 hover:text-slate-600'}`}
          >
            <i className="fas fa-calculator mr-1.5"></i> {t.calculate}
          </button>
          <button 
            onClick={() => setActiveTab('chat')}
            className={`px-6 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${activeTab === 'chat' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-600'}`}
          >
            <i className="fas fa-sms mr-1.5"></i> {t.communityTab}
          </button>
          {user?.isAdmin && (
            <button 
              onClick={() => setActiveTab('admin')}
              className={`px-6 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${activeTab === 'admin' ? 'bg-slate-800 text-white shadow-lg' : 'text-slate-400 hover:text-slate-800'}`}
            >
              <i className="fas fa-user-shield mr-1.5"></i> Admin
            </button>
          )}
        </div>

        {activeTab === 'calc' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in duration-500">
            <div className="lg:col-span-2 space-y-6">
              <section>
                <div className="flex items-center gap-2.5 mb-4">
                  <div className={`w-1.5 h-6 ${themeAccentBg} rounded-full`}></div>
                  <h2 className="text-xl font-black text-slate-800 uppercase tracking-tight">
                    {t[activeMode as keyof typeof t]}
                  </h2>
                </div>
                <CalculatorCard activeMode={activeMode} onCalculate={handleCalculate} themeColor={theme} language={language} />
              </section>

              {result && (
                <section className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="flex items-center gap-2.5 mb-4">
                    <div className="w-1.5 h-6 bg-slate-800 rounded-full"></div>
                    <h2 className="text-xl font-black text-slate-800 uppercase tracking-tight">{t.resultTitle}</h2>
                  </div>
                  <ResultDisplay result={result} themeColor={theme} language={language} />
                </section>
              )}

              <section>
                  <AIAssistant currentCalculation={result} language={language} />
              </section>
            </div>

            <div className="space-y-6">
              <section className="sticky top-28">
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center gap-2.5">
                    <div className="w-1.5 h-6 bg-slate-300 rounded-full"></div>
                    <h2 className="text-xl font-black text-slate-800 uppercase tracking-tight">{t.history}</h2>
                  </div>
                  {currentUserHistory.length > 0 && (
                    <button onClick={clearHistory} className="text-[9px] text-red-500 font-black uppercase tracking-widest bg-white px-2.5 py-1 rounded-full border border-red-50 hover:bg-red-50 transition-colors">{t.clearHistory}</button>
                  )}
                </div>
                <HistoryList items={currentUserHistory} onSelect={setResult} language={language} />
              </section>
            </div>
          </div>
        )}

        {activeTab === 'chat' && user && (
          <div className="max-w-4xl mx-auto animate-in zoom-in-95 duration-300">
            <CommunityChat language={language} user={user} allUsers={allUsers} />
          </div>
        )}

        {activeTab === 'admin' && user?.isAdmin && (
          <div className="max-w-4xl mx-auto">
            <AdminDashboard users={allUsers} language={language} />
          </div>
        )}
      </main>

      <footer className="pb-10 pt-4 px-4">
        <div className="container mx-auto max-w-sm">
          <div className="bg-white rounded-3xl p-4 shadow-xl shadow-slate-200/50 border border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex -space-x-2">
                <a 
                  href="https://fb.com/billal8795" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-[#1877F2] rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-500/30 hover:-translate-y-1 transition-transform z-10"
                >
                  <i className="fab fa-facebook-f text-sm"></i>
                </a>
                <a 
                  href="https://wa.me/8801735308795" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-[#25D366] rounded-2xl flex items-center justify-center text-white shadow-lg shadow-green-500/30 hover:-translate-y-1 transition-transform z-20 border-2 border-white"
                >
                  <i className="fab fa-whatsapp text-lg"></i>
                </a>
              </div>
              <div className="leading-none">
                <p className="text-[10px] font-black text-slate-800 uppercase tracking-tighter">Contact Dev</p>
                <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">Billal Hossain</p>
              </div>
            </div>
            
            <div className="text-right">
              <p className="text-[8px] font-black text-slate-300 uppercase tracking-widest leading-none mb-1">Version 2.0</p>
              <p className="text-[9px] font-black text-slate-800 uppercase tracking-tight">{t.brand}</p>
            </div>
          </div>
          
          <div className="mt-6 text-center">
            <p className="text-[8px] font-black text-slate-400/50 uppercase tracking-[0.4em]">{t.rights}</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
