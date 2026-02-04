
import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import { Language } from './types';

interface Props { t: any; lang: Language; }

const GeminiAssistant: React.FC<Props> = ({ t, lang }) => {
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);

  const askGemini = async () => {
    if (!prompt.trim()) return;
    const apiKey = process.env.API_KEY;
    if (!apiKey) { setResponse('System Error: API key missing.'); return; }
    setLoading(true); setResponse('');
    try {
      const ai = new GoogleGenAI({ apiKey });
      const result = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Construction expert. Lang: ${lang}. Terminology: Murubba (1x1m), Meter (length), Pieces. Prompt: ${prompt}`,
      });
      setResponse(result.text || 'No response.');
    } catch (error) { setResponse('Error: Please try again.'); }
    finally { setLoading(false); }
  };

  return (
    <div className="space-y-4">
      <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
        <h2 className="font-bold text-slate-800 mb-4 flex items-center gap-2">🤖 AI Assistant</h2>
        <textarea value={prompt} onChange={(e) => setPrompt(e.target.value)} placeholder="পাথর নিয়ে প্রশ্ন করুন..." className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl p-4 min-h-[100px] outline-none focus:border-blue-500" />
        <button onClick={askGemini} disabled={loading} className="w-full mt-3 bg-blue-600 text-white font-bold py-4 rounded-2xl active:scale-95 transition-all disabled:opacity-50">{loading ? '...' : 'জিজ্ঞাসা করুন'}</button>
      </div>
      {response && <div className="bg-blue-600 text-white p-5 rounded-3xl animate-fadeIn"><p className="text-sm leading-relaxed whitespace-pre-wrap">{response}</p></div>}
    </div>
  );
};

export default GeminiAssistant;
