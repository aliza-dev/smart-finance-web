"use server";

import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function scanReceipt(base64Image: string, mimeType: string) {
  try {
    const prompt = `Analyze this receipt image and extract the following information.
Return ONLY a valid JSON object with no markdown formatting or backticks.

Expected JSON schema:
{
  "amount": number, // total amount
  "date": string, // YYYY-MM-DD
  "description": string, // short description like store name or items
  "category": string // one of: 'food', 'housing', 'utilities', 'transport', 'entertainment', 'salary', 'other'
}`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        {
          role: "user",
          parts: [
            { text: prompt },
            {
              inlineData: {
                data: base64Image,
                mimeType: mimeType,
              },
            },
          ],
        },
      ],
      config: {
        responseMimeType: "application/json",
      }
    });

    if (response.text) {
      return { data: JSON.parse(response.text) };
    }
    
    return { error: "Could not parse receipt." };
  } catch (error) {
    console.error("Scanner Error:", error);
    return { error: "Failed to scan receipt." };
  }
}
