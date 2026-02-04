import { GoogleGenAI } from "@google/genai";

/**
 * Fetches construction advice from Gemini API based on stone calculation parameters.
 * Uses gemini-3-flash-preview for expert reasoning tasks.
 */
export const getConstructionAdvice = async (
  length: number,
  width: number,
  height: number,
  totalMurubba: number,
  totalPrice: number
): Promise<string> => {
  try {
    // Initialize the Gemini API client using the API key exclusively from environment variables.
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const prompt = `As a construction expert specializing in floor stones, provide specific advice for the following specifications:
    - Dimensions: ${length}m x ${width}m
    - Thickness: ${height}cm
    - Total Area: ${totalMurubba.toFixed(2)} sqft
    - Estimated Total Price: ${totalPrice > 0 ? totalPrice.toFixed(2) + ' TK' : 'Not specified'}
    
    Offer 3 very concise practical insights in Bengali on installation, quality, or durability. 
    Keep it professional and friendly.`;

    // Request content generation using the recommended Gemini 3 model.
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });

    // Access the response text directly from the response object.
    return response.text || "Expert advice is currently unavailable.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "পরামর্শ লোড করা সম্ভব হয়নি। দয়া করে আপনার ইন্টারনেট কানেকশন চেক করুন।";
  }
};