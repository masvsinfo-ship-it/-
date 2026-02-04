import { GoogleGenAI } from "@google/genai";

const translations: Record<string, any> = {
    bn: {
        appTitle: "পাথর ক্যালকুলেটর",
        brand: "KARINA GROUP",
        scrollingMsg: "নির্ভুল হিসাবের নিশ্চয়তা - কারিনা গ্রুপ। এই সফটওয়্যার সবার জন্য ফ্রি তাই কেউ এটা বিক্রির চেষ্টা করবেন না।",
        toMurubba: "মাপ থেকে মুরুব্বা",
        toMurubbaFromPieces: "পিস থেকে মুরুব্বা",
        toPieces: "মুরুব্বা থেকে পিস",
        toPiecesFromMeter: "মিটার থেকে পিস",
        length: "দৈর্ঘ্য (মিটার)",
        width: "প্রস্থ (মিটার)",
        thickness: "পুরুত্ব (সেমি)",
        quantityPieces: "পরিমাণ (পিস)",
        quantityMurubba: "মুরুব্বা",
        quantityMeter: "লম্বা (মিটার)",
        price: "ইউনিট দর (ঐচ্ছিক)",
        calculate: "হিসাব করুন",
        totalMurubba: "মোট মুরুব্বা",
        totalPieces: "মোট পিস",
        totalPrice: "মোট আনুমানিক মূল্য",
        aiAdvice: "AI বিশেষজ্ঞ পরামর্শ",
        getAdvice: "পরামর্শ দেখুন",
        history: "পূর্ববর্তী হিসাবসমূহ",
        clear: "সব মুছুন",
        rights: "কারিনা গ্রুপ • ২০২৬ সর্বস্বত্ব সংরক্ষিত"
    },
    en: {
        appTitle: "Stone Calculator",
        brand: "KARINA GROUP",
        scrollingMsg: "Accurate Stone Calculations - KARINA GROUP. This tool is free, please do not sell it.",
        toMurubba: "Measure to Murubba",
        toMurubbaFromPieces: "Pieces to Murubba",
        toPieces: "Murubba to Pieces",
        toPiecesFromMeter: "Meter to Pieces",
        length: "Length (Meter)",
        width: "Width (Meter)",
        thickness: "Thickness (cm)",
        quantityPieces: "Quantity (Pieces)",
        quantityMurubba: "Murubba",
        quantityMeter: "Length (Meter)",
        price: "Unit Price (Optional)",
        calculate: "Calculate",
        totalMurubba: "Total Murubba",
        totalPieces: "Total Pieces",
        totalPrice: "Total Estimated Price",
        aiAdvice: "AI Expert Advice",
        getAdvice: "Get Advice",
        history: "History",
        clear: "Clear All",
        rights: "Karina Group • 2026 All Rights Reserved"
    }
};

const state = {
    history: JSON.parse(localStorage.getItem('stone_history_v7') || '[]'),
    mode: 'toMurubba', 
    language: localStorage.getItem('stone_lang') || 'bn',
    lastResult: null as any
};

const app = {
    init() {
        this.setLanguage(state.language);
        this.renderHistory();
        // Set initial color variables
        this.updateThemeColors('toMurubba');
    },

    setLanguage(lang: string) {
        state.language = lang;
        localStorage.setItem('stone_lang', lang);
        document.documentElement.lang = lang;
        
        const t = translations[lang] || translations.bn;
        const mapping: any = {
            'txt-app-title': t.appTitle,
            'txt-brand': t.brand,
            'txt-marquee': t.scrollingMsg,
            'lbl-len': t.length,
            'lbl-wid': t.width,
            'lbl-thi': t.thickness,
            'lbl-price': t.price,
            'btn-calc': t.calculate,
            'txt-res-murubba-lbl': t.totalMurubba,
            'txt-res-pieces-lbl': t.totalPieces,
            'txt-res-price-lbl': t.totalPrice,
            'txt-ai-title': t.aiAdvice,
            'ai-btn': t.getAdvice,
            'txt-history-title': t.history,
            'btn-clear': t.clear,
            'txt-rights': t.rights
        };

        Object.keys(mapping).forEach(id => {
            const el = document.getElementById(id);
            if (el) el.innerText = mapping[id];
        });

        document.querySelectorAll('#mode-tabs button').forEach(btn => {
            const key = btn.getAttribute('data-t');
            if (key && t[key]) (btn as HTMLElement).innerText = t[key];
        });

        this.updateTargetLabel();
    },

    updateThemeColors(mode: string) {
        const root = document.documentElement;
        if (mode === 'toMurubba') {
            root.style.setProperty('--theme-primary', '#10b981');
            root.style.setProperty('--theme-dark', '#047857');
            root.style.setProperty('--theme-light', '#f0fdf4');
            root.style.setProperty('--theme-border', '#dcfce7');
            root.style.setProperty('--theme-shadow', 'rgba(16, 185, 129, 0.3)');
        } else if (mode === 'toPieces') {
            root.style.setProperty('--theme-primary', '#3b82f6');
            root.style.setProperty('--theme-dark', '#1d4ed8');
            root.style.setProperty('--theme-light', '#eff6ff');
            root.style.setProperty('--theme-border', '#dbeafe');
            root.style.setProperty('--theme-shadow', 'rgba(59, 130, 246, 0.3)');
        } else if (mode === 'toMeter') {
            root.style.setProperty('--theme-primary', '#8b5cf6');
            root.style.setProperty('--theme-dark', '#6d28d9');
            root.style.setProperty('--theme-light', '#f5f3ff');
            root.style.setProperty('--theme-border', '#ede9fe');
            root.style.setProperty('--theme-shadow', 'rgba(139, 92, 246, 0.3)');
        }
    },

    setMode(mode: string, btn: HTMLElement) {
        state.mode = mode;
        document.querySelectorAll('.mode-tab').forEach(t => t.classList.remove('active'));
        btn.classList.add('active');
        this.updateThemeColors(mode);
        this.updateTargetLabel();
        (document.getElementById('input-target') as HTMLInputElement).value = '';
    },

    updateTargetLabel() {
        const label = document.getElementById('label-target');
        const t = translations[state.language] || translations.bn;
        if (label) {
            if (state.mode === 'toMurubba') label.innerText = t.quantityPieces;
            else if (state.mode === 'toPieces') label.innerText = t.quantityMurubba;
            else if (state.mode === 'toMeter') label.innerText = t.quantityMeter;
        }
    },

    calculate() {
        const L = parseFloat((document.getElementById('input-len') as HTMLInputElement).value);
        const W = parseFloat((document.getElementById('input-wid') as HTMLInputElement).value);
        const target = parseFloat((document.getElementById('input-target') as HTMLInputElement).value) || 0;
        const price = parseFloat((document.getElementById('input-price') as HTMLInputElement).value) || 0;

        if (isNaN(L) || isNaN(W)) {
            alert(state.language === 'bn' ? 'সঠিক মাপ দিন' : 'Enter dimensions');
            return;
        }

        let murubba = 0, pieces = 0;
        const areaOne = L * W;

        if (state.mode === 'toMurubba') {
            pieces = target || 1;
            murubba = areaOne * pieces;
        } else if (state.mode === 'toPieces') {
            murubba = target;
            pieces = areaOne > 0 ? Math.ceil(murubba / areaOne) : 0;
        } else if (state.mode === 'toMeter') {
            pieces = L > 0 ? Math.ceil(target / L) : 0;
            murubba = pieces * areaOne;
        }

        const totalPrice = murubba * price;
        const result = { L, W, murubba, pieces, totalPrice, time: new Date().toLocaleTimeString() };

        state.lastResult = result;
        this.renderResult(result);
        
        state.history = [result, ...state.history].slice(0, 15);
        localStorage.setItem('stone_history_v7', JSON.stringify(state.history));
        this.renderHistory();
    },

    renderResult(res: any) {
        const resArea = document.getElementById('result-area');
        if (resArea) resArea.classList.remove('hidden');
        
        (document.getElementById('res-murubba') as HTMLElement).innerText = res.murubba.toFixed(2);
        (document.getElementById('res-pieces') as HTMLElement).innerText = res.pieces.toString();
        (document.getElementById('res-total-price') as HTMLElement).innerHTML = `${res.totalPrice.toLocaleString()} <span class="text-3xl font-bold text-theme">TK</span>`;
        
        resArea?.scrollIntoView({ behavior: 'smooth' });
    },

    async getAIAdvice() {
        if (!state.lastResult) return;
        const btn = document.getElementById('ai-btn') as HTMLButtonElement;
        const text = document.getElementById('ai-advice-text') as HTMLElement;
        
        btn.disabled = true;
        text.classList.remove('hidden');
        text.innerText = state.language === 'bn' ? 'AI বিশ্লেষণ করছে...' : 'AI Analyzing...';

        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const prompt = `Stone Calculation analysis: Dimension ${state.lastResult.L}m x ${state.lastResult.W}m, Murubba: ${state.lastResult.murubba.toFixed(2)}. 
            Please give 3 pro tips for stone setting in ${state.language === 'bn' ? 'Bengali' : 'English'}. Keep it short.`;
            
            const response = await ai.models.generateContent({
                model: 'gemini-3-flash-preview',
                contents: prompt
            });
            text.innerText = response.text || 'No advice found.';
        } catch (e) {
            text.innerText = 'পরামর্শ লোড করা সম্ভব হয়নি।';
        } finally {
            btn.disabled = false;
        }
    },

    renderHistory() {
        const list = document.getElementById('history-list');
        if (!list) return;
        
        if (state.history.length === 0) {
            list.innerHTML = '<div class="text-center py-10 text-slate-300 font-bold text-xs uppercase tracking-widest">ইতিহাস খালি</div>';
            return;
        }

        list.innerHTML = state.history.map((h: any) => `
            <div class="bg-white border border-slate-100 p-6 rounded-2xl flex items-center justify-between glowing-card animate-slide-up">
                <div class="flex items-center gap-4">
                    <div class="w-12 h-12 bg-theme-light rounded-xl flex items-center justify-center text-theme">
                        <i class="fas fa-history"></i>
                    </div>
                    <div>
                        <p class="text-sm font-black text-slate-800">${h.L}m × ${h.W}m</p>
                        <p class="text-[9px] font-bold text-slate-400 uppercase tracking-wider">${h.time}</p>
                    </div>
                </div>
                <div class="text-right">
                    <p class="text-xl font-black text-theme-dark">${h.murubba.toFixed(1)}</p>
                    <p class="text-[8px] font-black text-slate-300 uppercase tracking-widest">MURUBBA</p>
                </div>
            </div>
        `).join('');
    },

    clearHistory() {
        if (confirm(state.language === 'bn' ? 'সব ইতিহাস মুছবেন?' : 'Delete all history?')) {
            state.history = [];
            localStorage.setItem('stone_history_v7', JSON.stringify(state.history));
            this.renderHistory();
        }
    },

    share() {
        if (!state.lastResult) return;
        const res = state.lastResult;
        const msg = `Stone Report: ${res.L}x${res.W}m | Murubba: ${res.murubba.toFixed(2)} | Price: ${res.totalPrice.toLocaleString()} TK - Karina Group`;
        window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`);
    }
};

(window as any).app = app;
document.addEventListener('DOMContentLoaded', () => app.init());
