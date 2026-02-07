
import React, { useState, useEffect } from 'react';
import { Language, UserProfile } from '../types';
import { translations } from '../translations';

interface Props {
  language: Language;
  onLogin: (user: UserProfile) => void;
  allUsers: UserProfile[];
}

const LoginOverlay: React.FC<Props> = ({ language, onLogin, allUsers }) => {
  const [mode, setMode] = useState<'signin' | 'signup' | 'admin'>('signin');
  const [mobile, setMobile] = useState('');
  const [name, setName] = useState('');
  const [adminPass, setAdminPass] = useState('');
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  
  const t = translations[language as keyof typeof translations] || translations.bn;

  useEffect(() => {
    const handler = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handler);

    // Check if already in standalone mode
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
    }

    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (isInstalled) {
      alert(language === 'bn' ? "অ্যাপটি অলরেডি ইন্সটল করা আছে!" : "App is already installed!");
      return;
    }
    
    if (!deferredPrompt) {
      alert(language === 'bn' ? "আপনার ব্রাউজার সরাসরি ডাউনলোড সাপোর্ট করছে না। ব্রাউজার মেনু থেকে 'Add to Home Screen' বা 'ইন্সটল অ্যাপ' ক্লিক করুন।" : "Direct download not supported. Please use 'Add to Home Screen' or 'Install App' from browser menu.");
      return;
    }
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setDeferredPrompt(null);
      setIsInstalled(true);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanMobile = mobile.replace(/\s/g, '');

    if (mode === 'admin') {
      if (adminPass === '8795') {
        onLogin({ mobile: 'ADMIN', name: 'System Admin', isLoggedIn: true, isAdmin: true });
      } else {
        alert(language === 'bn' ? "ভুল পাসওয়ার্ড!" : "Incorrect Password!");
      }
      return;
    }

    // Relaxed validation: just check if there is some input
    if (cleanMobile.length < 5) {
      alert(language === 'bn' ? "সঠিক মোবাইল নম্বর দিন" : "Provide correct mobile number");
      return;
    }

    if (mode === 'signin') {
      const existingUser = allUsers.find(u => u.mobile === cleanMobile);
      if (existingUser) {
        onLogin({ ...existingUser, isLoggedIn: true });
      } else {
        alert(language === 'bn' ? "এই নম্বরে কোনো একাউন্ট পাওয়া যায়নি। দয়া করে সাইন আপ করুন।" : "No account found with this number. Please Sign Up.");
        setMode('signup');
      }
    } else {
      if (!name.trim()) {
        alert(language === 'bn' ? "আপনার নাম লিখুন" : "Please enter your name");
        return;
      }
      onLogin({ mobile: cleanMobile, name: name.trim(), isLoggedIn: true, isAdmin: false });
    }
  };

  const isBN = language === 'bn';

  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-md"></div>
      
      <div className="relative w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl overflow-hidden animate-slide-up flex flex-col">
        <div className={`h-2 w-full transition-colors duration-500 ${
          mode === 'signin' ? 'bg-emerald-500' : mode === 'signup' ? 'bg-blue-500' : 'bg-slate-800'
        }`}></div>

        <div className="p-8 md:p-10 space-y-6">
          <div className="text-center space-y-2">
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 text-2xl shadow-inner transition-all duration-500 ${
              mode === 'signin' ? 'bg-emerald-100 text-emerald-600' : 
              mode === 'signup' ? 'bg-blue-100 text-blue-600' : 
              'bg-slate-100 text-slate-800'
            }`}>
              <i className={`fas ${
                mode === 'signin' ? 'fa-sign-in-alt' : 
                mode === 'signup' ? 'fa-user-plus' : 
                'fa-user-shield'
              }`}></i>
            </div>
            <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tight">
              {mode === 'signin' ? (isBN ? 'লগইন করুন' : 'Sign In') : 
               mode === 'signup' ? (isBN ? 'একাউন্ট খুলুন' : 'Sign Up') : 
               (isBN ? 'অ্যাডমিন প্রবেশ' : 'Admin Login')}
            </h2>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">{t.brand} Community</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'admin' ? (
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Admin Code</label>
                <input
                  type="password" required value={adminPass} onChange={(e) => setAdminPass(e.target.value)}
                  placeholder="••••" className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none focus:bg-white focus:border-slate-800 transition-all font-black text-3xl text-center tracking-[1em]"
                />
              </div>
            ) : (
              <>
                <div className="text-center px-4">
                  <p className="text-[10px] font-black text-red-600 uppercase tracking-tighter animate-pulse leading-relaxed">
                    {isBN ? '"এই মোবাইল নম্বরটিই আপনার একাউন্ট নম্বর হিসাবে থাকবে"' : '"This mobile number will serve as your account number"'}
                  </p>
                </div>

                {mode === 'signup' && (
                  <div className="space-y-1.5 animate-in fade-in slide-in-from-top-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">{t.enterName}</label>
                    <input
                      type="text" required value={name} onChange={(e) => setName(e.target.value)}
                      placeholder="Full Name" className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none focus:bg-white focus:border-blue-500 transition-all font-black text-lg text-slate-700"
                    />
                  </div>
                )}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">{t.enterMobile}</label>
                  <input
                    type="tel" required value={mobile} onChange={(e) => setMobile(e.target.value)}
                    placeholder="01XXXXXXXXX" className={`w-full px-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none focus:bg-white transition-all font-black text-lg text-slate-700 tracking-widest ${
                      mode === 'signin' ? 'focus:border-emerald-500' : 'focus:border-blue-500'
                    }`}
                  />
                </div>
              </>
            )}

            <button type="submit" className={`w-full py-5 text-white font-black text-xl rounded-2xl shadow-xl transition-all active:scale-[0.98] mt-2 ${
              mode === 'signin' ? 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-200' : 
              mode === 'signup' ? 'bg-blue-600 hover:bg-blue-700 shadow-blue-200' : 
              'bg-slate-800 hover:bg-slate-900 shadow-slate-200'
            }`}>
              {mode === 'signin' ? (isBN ? 'লগইন' : 'Login') : 
               mode === 'signup' ? (isBN ? 'সাইন আপ' : 'Sign Up') : 
               'Access Admin'}
            </button>
          </form>
          
          <div className="flex flex-col gap-3 text-center">
            {mode === 'signin' ? (
              <button 
                onClick={() => setMode('signup')}
                className="text-[11px] font-black text-blue-500 uppercase tracking-[0.1em] hover:text-blue-700 transition-colors"
              >
                {isBN ? 'একাউন্ট নেই? নতুন একাউন্ট খুলুন' : "Don't have an account? Sign Up"}
              </button>
            ) : mode === 'signup' ? (
              <button 
                onClick={() => setMode('signin')}
                className="text-[11px] font-black text-emerald-500 uppercase tracking-[0.1em] hover:text-emerald-700 transition-colors"
              >
                {isBN ? 'আগে থেকেই একাউন্ট আছে? লগইন করুন' : "Already have an account? Sign In"}
              </button>
            ) : (
              <button 
                onClick={() => setMode('signin')}
                className="text-[11px] font-black text-slate-400 uppercase tracking-[0.1em] hover:text-slate-600 transition-colors"
              >
                {isBN ? '← ফিরে যান' : "← Back to Login"}
              </button>
            )}

            {mode !== 'admin' && (
              <button 
                onClick={() => setMode('admin')}
                className="text-[8px] font-black text-slate-300 uppercase tracking-[0.2em] hover:text-slate-500 transition-colors mt-2"
              >
                Admin Access
              </button>
            )}
          </div>
        </div>

        {/* Very bottom download section inside the card but distinct */}
        <div className="mt-auto bg-slate-50 border-t border-slate-100 p-6 flex flex-col items-center gap-3">
          <button 
            onClick={handleInstall}
            className="w-full flex items-center justify-center gap-3 py-4 bg-emerald-500 hover:bg-emerald-600 text-white rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all shadow-lg shadow-emerald-200 active:scale-95"
          >
            <i className="fab fa-android text-lg"></i>
            {isBN ? 'অ্যান্ড্রয়েড অ্যাপ ডাউনলোড করুন' : 'Download Android App'}
          </button>
          <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest text-center">
            {isBN ? 'মোবাইলে সহজে ব্যবহারের জন্য ইন্সটল করুন' : 'Install for easier mobile access'}
          </p>
        </div>
      </div>

      <p className="mt-6 text-[9px] font-black text-white/30 uppercase tracking-[0.5em]">
        {t.brand} Digital Solutions
      </p>
    </div>
  );
};

export default LoginOverlay;
