import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { GoogleGenAI } from '@google/genai';
import { revalidatePath } from 'next/cache';

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { text, localDate } = await request.json();
    console.log("--- SMART ADD DEBUG ---");
    console.log("Raw input text received:", text);
    
    if (!text) {
      return NextResponse.json({ error: 'Text is required' }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.error("GEMINI_API_KEY is not defined in environment variables");
      return NextResponse.json({ error: 'AI API key not configured' }, { status: 500 });
    }
    
    // Warn if it looks like a Groq key
    if (apiKey.startsWith('gsk_')) {
      console.error("WARNING: GEMINI_API_KEY appears to be a Groq API key (starts with gsk_). Please use a valid Google Gemini API Key.");
    }
    
    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found in DB' }, { status: 404 });
    }

    const prompt = `
    Parse the following natural language text into a JSON object representing a transaction.
    Expect the user to input amounts in Pakistani Rupees (e.g., Rs, PKR, or just raw numbers).
    Return ONLY raw valid JSON. DO NOT wrap the output in markdown code blocks like \`\`\`json.
    
    IMPORTANT: If the text describes receiving money, getting paid, salary, bonuses, earnings, or cash gifts, explicitly set "type": "income". If it is spending, buying, paying bills, etc., set "type": "expense".
    
    CRITICAL RULE FOR INCOME: If the "type" is "income", you MUST assign a related category like "salary" or "other". NEVER assign expense categories like "food", "housing", or "transport" to income transactions!
    If the input mentions 'salary', 'freelance', 'payment received', or 'earned', strictly map it to the 'salary' category, NOT 'other'.
    
    CRITICAL RULE FOR SPEND TYPE:
    - Groceries, utility bills, rent, and medical expenses MUST be classified as 'NEED'.
    - Dining out, pizza, fast food, shopping for clothes, entertainment, and hobbies MUST be classified as 'WANT'.
    
    The JSON object MUST have the following schema:
    {
      "description": "string (short description of the item)",
      "amount": number (positive number, extracted from the Rs/PKR text, no symbols),
      "type": "string (must be 'income' or 'expense')",
      "category": "string (one of EXACTLY: 'food', 'housing', 'utilities', 'transport', 'entertainment', 'salary', 'other')",
      "spendType": "string (categorize expense as 'NEED', 'WANT', or 'SAVING'. If income, use 'UNCATEGORIZED')"
    }
    
    Text to parse: "${text}"
    `;

    console.log("Using Google Gemini API...");
    const ai = new GoogleGenAI({ apiKey });
    
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
            responseMimeType: 'application/json',
            temperature: 0.1
        }
    });

    const rawContent = response.text;
    console.log("Raw AI response content:", rawContent);
    
    if (!rawContent) {
      console.error('Empty response content from Gemini');
      return NextResponse.json({ error: 'Invalid response from AI' }, { status: 500 });
    }

    let parsed;
    try {
      parsed = JSON.parse(rawContent);
    } catch (parseError) {
      console.error("Failed to parse JSON response:", parseError, "Raw Content:", rawContent);
      return NextResponse.json({ error: 'Failed to parse JSON from AI' }, { status: 500 });
    }

    const finalCategory = parsed.category ? parsed.category.toLowerCase() : 'other';
    const finalType = parsed.type === 'income' ? 'income' : 'expense';

    console.log("Parsed AI output before Prisma:", {
      description: parsed.description,
      amount: parsed.amount,
      type: finalType,
      category: finalCategory,
      spendType: parsed.spendType || 'UNCATEGORIZED'
    });

    // Save to Prisma
    const newTransaction = await prisma.transaction.create({
      data: {
        description: parsed.description || 'Unknown Item',
        amount: Number(parsed.amount) || 0,
        type: finalType,
        category: finalCategory,
        spendType: parsed.spendType || 'UNCATEGORIZED',
        date: localDate || new Date().toISOString().split('T')[0],
        userId: user.id
      }
    });

    console.log("Transaction saved successfully:", newTransaction.id, newTransaction.category);
    
    revalidatePath('/'); // Trigger UI data refresh
    
    return NextResponse.json({ transaction: newTransaction }, { status: 200 });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error('Smart Add Error (Catch Block):', error);
    
    // Check if it's an API key error
    if (error.message?.includes('API key') || error.status === 400 || error.status === 403) {
       return NextResponse.json({ error: 'Invalid Gemini API Key. Please update your .env.local file with a valid Google Gemini API Key.' }, { status: 500 });
    }
    
    return NextResponse.json({ error: 'Failed to process AI request' }, { status: 500 });
  }
}

