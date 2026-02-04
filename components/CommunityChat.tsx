
import React, { useState, useEffect, useRef } from 'react';
import { ChatMessage, Language, UserProfile } from '../types';
import { translations } from '../translations';

interface Props {
  language: Language;
  user: UserProfile;
}

const CommunityChat: React.FC<Props> = ({ language, user }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);
  const t = translations[language as keyof typeof translations] || translations.bn;

  useEffect(() => {
    // Initial dummy messages to simulate community
    const initial = [
      { id: '1', sender: 'Rahim Ali', text: 'ভাই, আজ মুরুব্বা দর কত যাচ্ছে?', timestamp: Date.now() - 100000, isMine: false },
      { id: '2', sender: 'Karim Stone', text: '৮৫ টাকা করে চলছে এখন।', timestamp: Date.now() - 50000, isMine: false },
    ];
    setMessages(initial);
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      sender: user.name,
      text: inputText,
      timestamp: Date.now(),
      isMine: true
    };

    setMessages([...messages, newMessage]);
    setInputText('');

    // Simulate AI response for specific keywords
    if (inputText.includes('দর') || inputText.includes('price')) {
      setTimeout(() => {
        const aiResponse: ChatMessage = {
          id: (Date.now() + 1).toString(),
          sender: 'AI Mod',
          text: 'পাথরের বর্তমান বাজার দর জানতে আপনার নিকটস্থ ডিলারের সাথে যোগাযোগ করুন। অথবা হিসাব দেখতে ক্যালকুলেটর ব্যবহার করুন।',
          timestamp: Date.now(),
          isMine: false
        };
        setMessages(prev => [...prev, aiResponse]);
      }, 1500);
    }
  };

  return (
    <div className="bg-white rounded-[1.5rem] shadow-xl border border-slate-100 flex flex-col h-[500px]">
      <div className="p-4 border-b border-slate-50 flex items-center justify-between bg-slate-50/50 rounded-t-[1.5rem]">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-[10px] font-black">
            <i className="fas fa-users"></i>
          </div>
          <div>
            <h3 className="text-xs font-black text-slate-800 uppercase tracking-tight">{t.communityTab}</h3>
            <div className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
              <span className="text-[8px] font-bold text-slate-400 uppercase">{t.online} (42)</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-grow overflow-y-auto p-4 space-y-4 no-scrollbar">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex flex-col ${msg.isMine ? 'items-end' : 'items-start'}`}>
            <span className="text-[8px] font-black text-slate-400 mb-1 px-1 uppercase tracking-widest">
              {msg.sender}
            </span>
            <div className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-xs font-bold shadow-sm ${
              msg.isMine 
              ? 'bg-blue-600 text-white rounded-tr-none' 
              : 'bg-slate-100 text-slate-700 rounded-tl-none border border-slate-200/50'
            }`}>
              {msg.text}
            </div>
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>

      <form onSubmit={handleSend} className="p-4 border-t border-slate-50 bg-slate-50/30 rounded-b-[1.5rem]">
        <div className="flex gap-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={t.typeMessage}
            className="flex-grow bg-white border border-slate-200 rounded-xl px-4 py-2 text-xs font-bold outline-none focus:border-blue-500 transition-colors"
          />
          <button type="submit" className="w-10 h-10 bg-blue-600 text-white rounded-xl flex items-center justify-center hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 active:scale-95">
            <i className="fas fa-paper-plane text-xs"></i>
          </button>
        </div>
      </form>
    </div>
  );
};

export default CommunityChat;
