
import React, { useState, useEffect, useRef } from 'react';
import { ChatMessage, Language, UserProfile } from '../types';
import { translations } from '../translations';

interface Props {
  language: Language;
  user: UserProfile;
  allUsers: UserProfile[];
}

const CommunityChat: React.FC<Props> = ({ language, user, allUsers }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [chatType, setChatType] = useState<'global' | 'private'>('global');
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
  const [isUserListOpen, setIsUserListOpen] = useState(false);
  
  const chatEndRef = useRef<HTMLDivElement>(null);
  const t = translations[language as keyof typeof translations] || translations.bn;

  // Load messages from localStorage
  useEffect(() => {
    const savedMessages = localStorage.getItem('stone_calc_chat_data');
    if (savedMessages) {
      setMessages(JSON.parse(savedMessages));
    } else {
      // Initial seeds
      const initial: ChatMessage[] = [
        { id: '1', senderName: 'Rahim Ali', senderMobile: '01711223344', recipientMobile: 'global', text: 'ভাই, আজ মুরুব্বা দর কত যাচ্ছে?', timestamp: Date.now() - 100000 },
        { id: '2', senderName: 'Karim Stone', senderMobile: '01755667788', recipientMobile: 'global', text: '৮৫ টাকা করে চলছে এখন।', timestamp: Date.now() - 50000 },
      ];
      setMessages(initial);
      localStorage.setItem('stone_calc_chat_data', JSON.stringify(initial));
    }
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, selectedUser, chatType]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      senderName: user.name,
      senderMobile: user.mobile,
      recipientMobile: chatType === 'global' ? 'global' : (selectedUser?.mobile || 'global'),
      text: inputText,
      timestamp: Date.now()
    };

    const updatedMessages = [...messages, newMessage];
    setMessages(updatedMessages);
    localStorage.setItem('stone_calc_chat_data', JSON.stringify(updatedMessages));
    setInputText('');
  };

  // Filter messages based on view
  const filteredMessages = messages.filter(msg => {
    if (chatType === 'global') {
      return msg.recipientMobile === 'global';
    } else {
      if (!selectedUser) return false;
      // Private messages between me and selected user
      return (
        (msg.senderMobile === user.mobile && msg.recipientMobile === selectedUser.mobile) ||
        (msg.senderMobile === selectedUser.mobile && msg.recipientMobile === user.mobile)
      );
    }
  });

  const otherUsers = allUsers.filter(u => u.mobile !== user.mobile);

  return (
    <div className="flex flex-col md:flex-row gap-4 h-[600px]">
      {/* Sidebar: User List */}
      <div className={`${isUserListOpen ? 'fixed inset-0 z-[60] bg-white' : 'hidden'} md:relative md:flex md:w-64 bg-white rounded-[2rem] shadow-xl border border-slate-100 flex-col overflow-hidden`}>
        <div className="p-5 border-b border-slate-50 bg-slate-50/50">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest">{language === 'bn' ? 'মেসেজ' : 'Messages'}</h3>
            <button onClick={() => setIsUserListOpen(false)} className="md:hidden text-slate-400 p-2">
              <i className="fas fa-times"></i>
            </button>
          </div>
          <button 
            onClick={() => { setChatType('global'); setSelectedUser(null); setIsUserListOpen(false); }}
            className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all ${chatType === 'global' ? 'bg-blue-600 text-white shadow-lg' : 'hover:bg-slate-100 text-slate-600'}`}
          >
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${chatType === 'global' ? 'bg-white/20' : 'bg-blue-100 text-blue-600'}`}>
              <i className="fas fa-globe-americas text-xs"></i>
            </div>
            <span className="text-[10px] font-black uppercase tracking-tight">{t.communityTab}</span>
          </button>
        </div>
        
        <div className="flex-grow overflow-y-auto p-2 no-scrollbar">
          <p className="px-4 py-2 text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">{language === 'bn' ? 'পারসোনাল' : 'Private'}</p>
          {otherUsers.map((u) => (
            <button
              key={u.mobile}
              onClick={() => { setChatType('private'); setSelectedUser(u); setIsUserListOpen(false); }}
              className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all mb-1 ${selectedUser?.mobile === u.mobile ? 'bg-emerald-500 text-white shadow-lg' : 'hover:bg-slate-50 text-slate-600'}`}
            >
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-[10px] font-black uppercase ${selectedUser?.mobile === u.mobile ? 'bg-white/20' : 'bg-slate-100 text-slate-400'}`}>
                {u.name.charAt(0)}
              </div>
              <div className="text-left leading-tight">
                <p className="text-[10px] font-black uppercase truncate max-w-[100px]">{u.name}</p>
                <p className={`text-[8px] font-bold ${selectedUser?.mobile === u.mobile ? 'text-white/60' : 'text-slate-400'}`}>{u.mobile}</p>
              </div>
            </button>
          ))}
          {otherUsers.length === 0 && (
            <p className="p-6 text-center text-[10px] text-slate-400 font-bold italic">No other users yet.</p>
          )}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-grow bg-white rounded-[2rem] shadow-xl border border-slate-100 flex flex-col overflow-hidden relative">
        <div className="p-4 border-b border-slate-50 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-3">
            <button onClick={() => setIsUserListOpen(true)} className="md:hidden w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center text-slate-500">
              <i className="fas fa-users"></i>
            </button>
            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center text-white shadow-lg ${chatType === 'global' ? 'bg-blue-600 shadow-blue-200' : 'bg-emerald-500 shadow-emerald-200'}`}>
              <i className={`fas ${chatType === 'global' ? 'fa-comments' : 'fa-user-lock'}`}></i>
            </div>
            <div>
              <h3 className="text-xs font-black text-slate-800 uppercase tracking-tight">
                {chatType === 'global' ? t.communityTab : (selectedUser?.name || 'Private Chat')}
              </h3>
              <div className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                <span className="text-[8px] font-bold text-slate-400 uppercase">
                  {chatType === 'global' ? `${t.online} (42)` : (language === 'bn' ? 'সরাসরি কথোপকথন' : 'Direct Message')}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex-grow overflow-y-auto p-4 space-y-4 no-scrollbar bg-slate-50/20">
          {filteredMessages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-10 opacity-30">
              <i className="fas fa-comment-dots text-4xl mb-4"></i>
              <p className="text-sm font-black uppercase tracking-widest">{language === 'bn' ? 'কোন মেসেজ নেই' : 'No messages'}</p>
            </div>
          ) : (
            filteredMessages.map((msg) => {
              const isMine = msg.senderMobile === user.mobile;
              return (
                <div key={msg.id} className={`flex flex-col ${isMine ? 'items-end' : 'items-start'} animate-in slide-in-from-bottom-2 duration-300`}>
                  {!isMine && chatType === 'global' && (
                    <span className="text-[8px] font-black text-slate-400 mb-1 px-1 uppercase tracking-widest">
                      {msg.senderName}
                    </span>
                  )}
                  <div className={`max-w-[85%] px-4 py-3 rounded-2xl text-xs font-bold shadow-sm relative ${
                    isMine 
                    ? 'bg-blue-600 text-white rounded-tr-none' 
                    : 'bg-white text-slate-700 rounded-tl-none border border-slate-100'
                  }`}>
                    {msg.text}
                    <p className={`text-[7px] mt-1 text-right opacity-50 font-black`}>
                      {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              );
            })
          )}
          <div ref={chatEndRef} />
        </div>

        <form onSubmit={handleSend} className="p-4 bg-white border-t border-slate-50">
          <div className="flex gap-2">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={chatType === 'global' ? t.typeMessage : `${language === 'bn' ? 'মেসেজ দিন' : 'Send message to'} ${selectedUser?.name}...`}
              className="flex-grow bg-slate-50 border-2 border-slate-100 rounded-2xl px-5 py-3 text-xs font-black outline-none focus:bg-white focus:border-blue-500 transition-all"
            />
            <button type="submit" className={`w-12 h-12 text-white rounded-2xl flex items-center justify-center transition-all shadow-lg active:scale-95 ${chatType === 'global' ? 'bg-blue-600 shadow-blue-200' : 'bg-emerald-500 shadow-emerald-200'}`}>
              <i className="fas fa-paper-plane text-sm"></i>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CommunityChat;
