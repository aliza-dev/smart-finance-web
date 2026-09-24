'use server';

import { Transaction } from '@/types';

interface ParseResult {
  transaction: Omit<Transaction, 'id' | 'createdAt' | 'updatedAt'> | null;
  error: string | null;
}

export async function parseTransactionText(text: string, localDate?: string): Promise<ParseResult> {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    console.warn("No GEMINI_API_KEY found. Falling back to simple regex parser.");
    return fallbackParser(text, localDate);
  }

  try {
    const prompt = `
    Parse the following natural language text into a JSON object representing a transaction.
    Return ONLY valid JSON, with no markdown formatting.
    
    The JSON object MUST have the following schema:
    {
      "description": "string (short description of the item)",
      "amount": number (positive number),
      "type": "string (must be 'income' or 'expense')",
      "category": "string (one of: 'housing', 'transport', 'food', 'utilities', 'insurance', 'healthcare', 'savings', 'personal', 'entertainment', 'salary', 'other')",
      "spendType": "string (must be 'NEED', 'WANT', 'SAVING', or 'UNCATEGORIZED')"
    }
    
    Text to parse: "${text}"
    `;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.1,
            responseMimeType: "application/json"
          }
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.statusText}`);
    }

    const data = await response.json();
    const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (!rawText) {
      throw new Error("Failed to extract JSON from Gemini response");
    }

    const parsed = JSON.parse(rawText);
    
    return {
      transaction: {
        description: parsed.description || 'Unknown Item',
        amount: Number(parsed.amount) || 0,
        type: parsed.type === 'income' ? 'income' : 'expense',
        category: parsed.category || 'other',
        spendType: parsed.spendType || 'UNCATEGORIZED',
        date: localDate || new Date().toISOString().split('T')[0]
      },
      error: null
    };

  } catch (error) {
    console.error("AI Parsing Error:", error);
    return { transaction: null, error: "Failed to parse with AI. Try again." };
  }
}

// A simple regex fallback for demonstration when API key is missing
function fallbackParser(text: string, localDate?: string): ParseResult {
  const amountMatch = text.match(/\$?(\d+(?:\.\d{2})?)/);
  const amount = amountMatch ? parseFloat(amountMatch[1]) : 0;
  
  const lowerText = text.toLowerCase();
  let type: 'income' | 'expense' = 'expense';
  if (lowerText.includes('earned') || lowerText.includes('salary') || lowerText.includes('got paid') || lowerText.includes('income')) {
    type = 'income';
  }

  let category = 'other';
  if (lowerText.includes('coffee') || lowerText.includes('food') || lowerText.includes('dinner')) category = 'food';
  else if (lowerText.includes('uber') || lowerText.includes('gas') || lowerText.includes('train')) category = 'transport';
  else if (lowerText.includes('rent') || lowerText.includes('mortgage')) category = 'housing';

  if (!amount) {
    return { transaction: null, error: "Could not detect an amount. E.g. 'Spent $5 on coffee'" };
  }

  return {
    transaction: {
      description: text.replace(/\$?(\d+(?:\.\d{2})?)/, '').trim(),
      amount,
      type,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      category: category as any,
      spendType: 'UNCATEGORIZED',
      date: localDate || new Date().toISOString().split('T')[0]
    },
    error: null
  };
}
