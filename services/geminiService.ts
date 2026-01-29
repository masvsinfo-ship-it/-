
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getConstructionAdvice = async (length: number, width: number, heightCm: number, murubba: number) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `একজন পাথর ব্যবসায়ী বা কন্সট্রাকশন ইঞ্জিনিয়ার হিসেবে উত্তর দিন। 
      হিসাব: দৈর্ঘ্য ${length} মি., প্রস্থ ${width} মি., উচ্চতা ${heightCm} সে.মি.। মোট মুরুব্বা: ${murubba.toFixed(2)}।
      এই পাথর দিয়ে কি ধরণের কাজ করা সম্ভব? আনুমানিক খরচ কত হতে পারে (বাংলাদেশি টাকায়)? এবং এই পাথর বহনের জন্য কি ধরণের ট্রাক প্রয়োজন? 
      অত্যন্ত সংক্ষেপে ৩-৪টি বুলেট পয়েন্টে বাংলায় উত্তর দিন।`,
      config: {
        temperature: 0.7,
        topP: 0.8,
        topK: 40,
      }
    });

    return response.text;
  } catch (error) {
    console.error("Gemini Error:", error);
    return "দুঃখিত, পরামর্শ লোড করা সম্ভব হয়নি।";
  }
};
