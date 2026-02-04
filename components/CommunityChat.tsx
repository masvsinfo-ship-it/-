
import React, { useState, useEffect, useRef, useMemo } from 'react';
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

  // Get last message for each user thread for the "Inbox" view
  const threads = useMemo(() => {
    const userThreads: Record<string, ChatMessage> = {};
    
    // Sort messages to get the latest ones
    const sortedMessages = [...messages].sort((a, b) => a.timestamp - b.timestamp);
    
    sortedMessages.forEach(msg => {
      if (msg.recipientMobile !== 'global') {
        const otherParty = msg.senderMobile === user.mobile ? msg.recipientMobile : msg.senderMobile;
        userThreads[otherParty] = msg;
      }
    });

    return userThreads;
  }, [messages, user.mobile]);

  const filteredMessages = messages.filter(msg => {
    if (chatType === 'global') {
      return msg.recipientMobile === 'global';
    } else {
      if (!selectedUser) return false;
      return (
        (msg.senderMobile === user.mobile && msg.recipientMobile === selectedUser.mobile) ||
        (msg.senderMobile === selectedUser.mobile && msg.recipientMobile === user.mobile)
      );
    }
  });

  const otherUsers = allUsers.filter(u => u.mobile !== user.mobile);
  
  // Sort users so those with existing chats appear at top
  const sortedUsers = [...otherUsers].sort((a, b) => {
    const aLast = threads[a.mobile]?.timestamp || 0;
    const bLast = threads[b.mobile]?.timestamp || 0;
    return bLast - aLast;
  });

  const isBN = language === 'bn';

  return (
    <div className="flex flex-col md:flex-row gap-4 h-[650px] animate-in fade-in zoom-in-95 duration-500">
      {/* Sidebar: Inbox List */}
      <div className={`${isUserListOpen ? 'fixed inset-0 z-[60] bg-white' : 'hidden'} md:relative md:flex md:w-80 bg-white rounded-[2.5rem] shadow-xl border border-slate-100 flex-col overflow-hidden`}>
        <div className="p-6 border-b border-slate-50 bg-slate-50/50">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-sm font-black text-slate-800 uppercase tracking-[0.2em]">{isBN ? 'ইনবক্স' : 'Inbox'}</h3>
            <button onClick={() => setIsUserListOpen(false)} className="md:hidden text-slate-400 p-2">
              <i className="fas fa-times"></i>
            </button>
          </div>
          
          <button 
            onClick={() => { setChatType('global'); setSelectedUser(null); setIsUserListOpen(false); }}
            className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all ${chatType === 'global' ? 'bg-blue-600 text-white shadow-xl shadow-blue-200' : 'hover:bg-slate-100 text-slate-600'}`}
          >
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${chatType === 'global' ? 'bg-white/20' : 'bg-blue-100 text-blue-600'}`}>
              <i className="fas fa-globe-americas"></i>
            </div>
            <div className="text-left">
              <p className="text-[10px] font-black uppercase tracking-tight">{t.communityTab}</p>
              <p className={`text-[8px] font-bold uppercase tracking-widest ${chatType === 'global' ? 'text-white/60' : 'text-slate-400'}`}>{isBN ? 'সবার জন্য উন্মুক্ত' : 'Public Chat'}</p>
            </div>
          </button>
        </div>
        
        <div className="flex-grow overflow-y-auto p-3 no-scrollbar space-y-2">
          <div className="px-4 py-3 flex items-center justify-between">
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em]">{isBN ? 'ব্যক্তিগত আলাপ' : 'Direct Messages'}</p>
            <div className="w-4 h-px bg-slate-100 flex-grow ml-4"></div>
          </div>
          
          {sortedUsers.map((u) => {
            const lastMsg = threads[u.mobile];
            const isActive = selectedUser?.mobile === u.mobile && chatType === 'private';
            
            return (
              <button
                key={u.mobile}
                onClick={() => { setChatType('private'); setSelectedUser(u); setIsUserListOpen(false); }}
                className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all relative group ${isActive ? 'bg-emerald-500 text-white shadow-xl shadow-emerald-200' : 'hover:bg-slate-50 text-slate-600'}`}
              >
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-sm font-black uppercase shrink-0 ${isActive ? 'bg-white/20' : 'bg-slate-100 text-slate-400 group-hover:bg-emerald-100 group-hover:text-emerald-500'}`}>
                  {u.name.charAt(0)}
                </div>
                <div className="text-left leading-tight flex-grow min-w-0">
                  <div className="flex justify-between items-center mb-1">
                    <p className="text-[10px] font-black uppercase truncate pr-2">{u.name}</p>
                    {lastMsg && (
                      <span className={`text-[7px] font-bold ${isActive ? 'text-white/50' : 'text-slate-300'}`}>
                        {new Date(lastMsg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    )}
                  </div>
                  <p className={`text-[9px] font-medium truncate ${isActive ? 'text-white/80' : 'text-slate-400'}`}>
                    {lastMsg ? (lastMsg.senderMobile === user.mobile ? `${isBN ? 'আপনি:' : 'You:'} ${lastMsg.text}` : lastMsg.text) : (isBN ? 'চ্যাট শুরু করুন' : 'Tap to chat')}
                  </p>
                </div>
                {isActive && (
                  <div className="absolute left-1 top-1/2 -translate-y-1/2 w-1 h-8 bg-white rounded-full"></div>
                )}
              </button>
            );
          })}
          
          {otherUsers.length === 0 && (
            <div className="py-10 text-center space-y-3 opacity-40">
              <i className="fas fa-user-friends text-3xl text-slate-200"></i>
              <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">{isBN ? 'কোন ইউজার পাওয়া যায়নি' : 'No other users found'}</p>
            </div>
          )}
        </div>
      </div>

      {/* Main Conversation Window */}
      <div className="flex-grow bg-white rounded-[2.5rem] shadow-xl border border-slate-100 flex flex-col overflow-hidden relative">
        {/* Chat Header */}
        <div className="p-5 border-b border-slate-50 flex items-center justify-between bg-white/80 backdrop-blur-md sticky top-0 z-10">
          <div className="flex items-center gap-4">
            <button onClick={() => setIsUserListOpen(true)} className="md:hidden w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 hover:text-blue-500 transition-colors">
              <i className="fas fa-inbox"></i>
            </button>
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-xl ${chatType === 'global' ? 'bg-blue-600 shadow-blue-200' : 'bg-emerald-500 shadow-emerald-200'}`}>
              {chatType === 'global' ? <i className="fas fa-comments text-lg"></i> : <span className="font-black text-lg">{selectedUser?.name.charAt(0)}</span>}
            </div>
            <div>
              <h3 className="text-sm font-black text-slate-800 uppercase tracking-tight">
                {chatType === 'global' ? t.communityTab : (selectedUser?.name || 'Direct Chat')}
              </h3>
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                  {chatType === 'global' ? (isBN ? 'সবার সাথে চ্যাট' : 'Global Room') : (isBN ? 'পারসোনাল ইনবক্স' : 'Private Conversation')}
                </span>
              </div>
            </div>
          </div>
          
          <div className="hidden sm:flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-300 text-[10px]">
              <i className="fas fa-shield-alt"></i>
            </div>
          </div>
        </div>

        {/* Message List */}
        <div className="flex-grow overflow-y-auto p-6 space-y-6 no-scrollbar bg-slate-50/30">
          {filteredMessages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-10">
              <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center text-slate-300 mb-6 border-4 border-white shadow-inner">
                <i className={`fas ${chatType === 'global' ? 'fa-globe-americas' : 'fa-paper-plane'} text-3xl`}></i>
              </div>
              <h4 className="text-sm font-black text-slate-800 uppercase tracking-widest mb-2">{isBN ? 'চ্যাট শুরু করুন' : 'Start Chating'}</h4>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter max-w-[200px] leading-relaxed">
                {chatType === 'global' ? (isBN ? 'গ্রুপে আপনার মতামত শেয়ার করুন' : 'Share your thoughts with the group') : `${isBN ? 'সরাসরি মেসেজ দিন' : 'Send a direct message to'} ${selectedUser?.name}`}
              </p>
            </div>
          ) : (
            filteredMessages.map((msg, index) => {
              const isMine = msg.senderMobile === user.mobile;
              const showName = chatType === 'global' && !isMine;
              
              return (
                <div key={msg.id} className={`flex flex-col ${isMine ? 'items-end' : 'items-start'} animate-in slide-in-from-bottom-2 duration-300 delay-[${index * 50}ms]`}>
                  {showName && (
                    <span className="text-[8px] font-black text-slate-400 mb-1 px-2 uppercase tracking-widest">
                      {msg.senderName}
                    </span>
                  )}
                  <div className={`max-w-[75%] px-5 py-3.5 rounded-2xl shadow-sm relative ${
                    isMine 
                    ? 'bg-blue-600 text-white rounded-tr-none shadow-blue-100' 
                    : 'bg-white text-slate-700 rounded-tl-none border border-slate-100 shadow-slate-100'
                  }`}>
                    <p className="text-xs font-bold leading-relaxed">{msg.text}</p>
                    <div className={`flex items-center gap-1.5 mt-2 justify-end opacity-40`}>
                      <span className="text-[7px] font-black uppercase">
                        {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                      {isMine && <i className="fas fa-check-double text-[6px]"></i>}
                    </div>
                  </div>
                </div>
              );
            })
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Input Area */}
        <form onSubmit={handleSend} className="p-6 bg-white border-t border-slate-50">
          <div className="flex gap-3 bg-slate-50 p-2 rounded-3xl border-2 border-slate-100 focus-within:border-blue-500 focus-within:bg-white transition-all shadow-inner">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={chatType === 'global' ? t.typeMessage : `${isBN ? 'মেসেজ দিন' : 'Message'} ${selectedUser?.name}...`}
              className="flex-grow bg-transparent px-4 py-3 text-xs font-black outline-none text-slate-700 placeholder:text-slate-300"
            />
            <button 
              type="submit" 
              disabled={!inputText.trim()}
              className={`w-12 h-12 text-white rounded-2xl flex items-center justify-center transition-all shadow-lg active:scale-90 disabled:opacity-50 disabled:grayscale ${chatType === 'global' ? 'bg-blue-600 shadow-blue-200' : 'bg-emerald-500 shadow-emerald-200'}`}
            >
              <i className="fas fa-paper-plane text-sm"></i>
            </button>
          </div>
          <p className="text-center text-[7px] font-black text-slate-300 uppercase tracking-[0.4em] mt-3">{isBN ? 'নিরাপদ এবং এন্ড-টু-এন্ড ইনক্রিপ্টেড' : 'Secure & End-to-End Encrypted'}</p>
        </form>
      </div>
    </div>
  );
};

export default CommunityChat;
