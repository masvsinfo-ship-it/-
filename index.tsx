import { GoogleGenAI } from "@google/genai";

// App State
const state = {
    history: JSON.parse(localStorage.getItem('stone_history_v3') || '[]'),
    mode: 'toMurubba', // toMurubba, toPieces, toMeter, toPiecesToMurubba
    lastResult: null as any
};

// Selectors
const resArea = document.getElementById('result-area');
const historyList = document.getElementById('history-list');

// App Functions
const app = {
    init() {
        this.renderHistory();
    },

    setMode(mode: string, btn: HTMLElement) {
        state.mode = mode;
        // Update Tabs
        document.querySelectorAll('.mode-tab').forEach(t => t.classList.remove('active'));
        btn.classList.add('active');

        // Update Labels
        const label = document.getElementById('label-target');
        const input = document.getElementById('input-target');
        
        if (label) {
            if (mode === 'toMurubba') label.innerText = 'পরিমাণ (পিস)';
            else if (mode === 'toPieces') label.innerText = 'মুরুব্বা';
            else if (mode === 'toMeter') label.innerText = 'লম্বা (মিটার)';
            else if (mode === 'toPiecesToMurubba') label.innerText = 'পরিমাণ (পিস)';
        }
        
        if (input) (input as HTMLInputElement).value = '';
    },

    calculate() {
        const L_el = document.getElementById('input-len') as HTMLInputElement;
        const W_el = document.getElementById('input-wid') as HTMLInputElement;
        const T_el = document.getElementById('input-thi') as HTMLInputElement;
        const target_el = document.getElementById('input-target') as HTMLInputElement;
        const price_el = document.getElementById('input-price') as HTMLInputElement;

        const L = parseFloat(L_el.value);
        const W = parseFloat(W_el.value);
        const T = parseFloat(T_el.value) || 3;
        const target = parseFloat(target_el.value) || 0;
        const price = parseFloat(price_el.value) || 0;

        if (!L || !W) return alert('দৈর্ঘ্য ও প্রস্থ দিন');

        let murubba = 0, pieces = 0;
        const areaOne = L * W;

        if (state.mode === 'toMurubba') {
            pieces = target || 1;
            murubba = areaOne * pieces;
        } else if (state.mode === 'toPieces') {
            murubba = target;
            pieces = Math.ceil(murubba / areaOne);
        } else if (state.mode === 'toMeter') {
            const linear = target;
            pieces = Math.ceil(linear / L);
            murubba = pieces * areaOne;
        } else if (state.mode === 'toPiecesToMurubba') {
            pieces = target;
            murubba = pieces * areaOne;
        }

        const totalPrice = murubba * price;
        const result = { L, W, T, murubba, pieces, totalPrice, time: new Date().toLocaleTimeString() };

        state.lastResult = result;
        this.renderResult(result);
        
        // Save History
        state.history = [result, ...state.history].slice(0, 15);
        localStorage.setItem('stone_history_v3', JSON.stringify(state.history));
        this.renderHistory();
    },

    renderResult(res: any) {
        if (resArea) resArea.classList.remove('hidden');
        const resMurubba = document.getElementById('res-murubba');
        const resPieces = document.getElementById('res-pieces');
        const resTotalPrice = document.getElementById('res-total-price');
        const aiAdviceText = document.getElementById('ai-advice-text');

        if (resMurubba) resMurubba.innerText = res.murubba.toFixed(2);
        if (resPieces) resPieces.innerText = res.pieces;
        if (resTotalPrice) resTotalPrice.innerText = res.totalPrice.toLocaleString();
        if (aiAdviceText) aiAdviceText.classList.add('hidden');
        
        resArea?.scrollIntoView({ behavior: 'smooth' });
    },

    async getAIAdvice() {
        if (!state.lastResult) return;
        const btn = document.getElementById('ai-btn');
        const text = document.getElementById('ai-advice-text');
        
        if (!btn || !text) return;

        (btn as HTMLButtonElement).innerText = 'বিশ্লেষণ...';
        (btn as HTMLButtonElement).disabled = true;
        text.classList.remove('hidden');
        text.innerText = 'বিশ্লেষণ হচ্ছে...';

        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const response = await ai.models.generateContent({
                model: 'gemini-3-flash-preview',
                contents: `পাথরের হিসাব বিশ্লেষণ করুন: দৈর্ঘ্য ${state.lastResult.L}মি, প্রস্থ ${state.lastResult.W}মি, মুরুব্বা ${state.lastResult.murubba.toFixed(2)}। ৩টি সংক্ষিপ্ত পয়েন্টে বাংলায় পেশাদার কনস্ট্রাকশন পরামর্শ দিন।`
            });
            text.innerText = response.text || 'পরামর্শ পাওয়া যায়নি।';
        } catch (e) {
            text.innerText = 'পরামর্শ পাওয়া যায়নি।';
        } finally {
            (btn as HTMLButtonElement).innerText = 'পরামর্শ দেখুন';
            (btn as HTMLButtonElement).disabled = false;
        }
    },

    renderHistory() {
        if (!historyList) return;
        if (state.history.length === 0) {
            historyList.innerHTML = '<div class="text-center py-12 text-slate-300 text-xs font-bold uppercase tracking-widest">খালি</div>';
            return;
        }

        historyList.innerHTML = state.history.map((h: any) => `
            <div class="bg-white border border-slate-100 p-5 rounded-2xl flex items-center justify-between shadow-sm">
                <div class="flex items-center gap-4">
                    <div class="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400">
                        <i class="fas fa-history text-xs"></i>
                    </div>
                    <div>
                        <p class="text-xs font-black text-slate-800">${h.L}m × ${h.W}m</p>
                        <p class="text-[9px] font-bold text-slate-400 uppercase">${h.time}</p>
                    </div>
                </div>
                <div class="text-right">
                    <p class="text-lg font-black text-emerald-600">${h.murubba.toFixed(1)}</p>
                    <p class="text-[8px] font-black text-slate-300 uppercase">মুরুব্বা</p>
                </div>
            </div>
        `).join('');
    },

    clearHistory() {
        if (confirm('সব ইতিহাস মুছে ফেলবেন?')) {
            state.history = [];
            localStorage.setItem('stone_history_v3', JSON.stringify(state.history));
            this.renderHistory();
        }
    },

    share() {
        const res = state.lastResult;
        if (!res) return;
        const msg = `*পাথর হিসাব রিপোর্ট (কারিনা গ্রুপ)*\nমাপ: ${res.L}x${res.W} মি.\nমুরুব্বা: ${res.murubba.toFixed(2)}\nপিস: ${res.pieces}\nমোট দাম: ${res.totalPrice.toFixed(2)} টাকা`;
        window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`);
    }
};

(window as any).app = app;

document.addEventListener('DOMContentLoaded', () => app.init());
