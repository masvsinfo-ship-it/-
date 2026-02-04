
import { GoogleGenAI } from "@google/genai";

// Function to fetch construction advice using Gemini API
export const getConstructionAdvice = async (length: number, width: number, height: number, murubba: number, totalPrice: number) => {
  // Initialize AI client inside the call to ensure latest API key is used
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `একজন পাথর বিশেষজ্ঞ এবং কন্সট্রাকশন কনসালটেন্ট হিসেবে নিচের হিসাবটি বিশ্লেষণ করুন:
      
      - দৈর্ঘ্য ও প্রস্থ: ${length}m x ${width}m
      - পুরুত্ব: ${height}cm
      - মোট মুরুব্বা: ${murubba.toFixed(2)}
      - মোট মূল্য: ${totalPrice > 0 ? totalPrice.toFixed(2) + ' TK' : 'উল্লেখ নেই'}

      পরামর্শের বিষয়সমূহ:
      ১. এই সাইজের এবং পুরুত্বের পাথর সাধারণত কোন ধরণের কাজে (যেমন: ফ্লোর, ওয়াল বা সিঁড়ি) সবচেয়ে ভালো হবে?
      ২. এই পরিমাণ পাথর পরিবহনে সবচেয়ে সাশ্রয়ী মাধ্যম কোনটি হবে?
      ৩. কন্সট্রাকশন সাইটে এই পাথর ব্যবহারের আগে কী ধরণের সতর্কতা অবলম্বন করা জরুরি?
      
      নির্দেশনা: শুধুমাত্র ৩-৪টি ছোট পয়েন্টে সহজ বাংলায় উত্তর দিন। পেশাদার কিন্তু বন্ধুত্বপূর্ণ ভাষা ব্যবহার করুন।`,
      config: {
        temperature: 0.7,
        topP: 0.9,
      }
    });

    // Directly access the text property as per latest SDK guidelines
    return response.text;
  } catch (error) {
    console.error("Gemini Error:", error);
    return "দুঃখিত, কৃত্রিম বুদ্ধিমত্তা এই মুহূর্তে কাজ করছে না।";
  }
};
