'use server';

import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { GoogleGenAI } from '@google/genai';

export async function generateAIReport(month: string) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return { report: null, error: 'Unauthorized' };
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    if (!user) {
      return { report: null, error: 'User not found' };
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return { report: null, error: 'AI API key not configured' };
    }

    // Fetch transactions and budgets for the given month
    const [transactions, budgets] = await Promise.all([
      prisma.transaction.findMany({
        where: {
          userId: user.id,
          date: { startsWith: month }
        }
      }),
      prisma.budget.findMany({
        where: {
          userId: user.id,
          month: month
        }
      })
    ]);

    if (transactions.length === 0) {
      return { 
        report: {
          quickSummary: "No transactions found for this month to analyze.",
          topSpendingCategory: "N/A",
          criticalAlerts: ["No data available for this month."],
          actionPlan: ["Add your income and expenses to get personalized insights."]
        }, 
        error: null 
      };
    }

    const prompt = `
      You are a professional and insightful financial advisor. Analyze the user's expense and income data for the month of ${month}.
      All amounts are in Pakistani Rupees (PKR / Rs).
      
      Here are their budgets for this month:
      ${JSON.stringify(budgets.map(b => ({ category: b.category, limit: b.amount })), null, 2)}
      
      Here are their transactions for this month:
      ${JSON.stringify(transactions.map(t => ({ description: t.description, amount: t.amount, type: t.type, category: t.category, date: t.date })), null, 2)}
      
      You must respond strictly in JSON format using this exact schema:
      {
        "quickSummary": "One short sentence overview",
        "topSpendingCategory": "Category Name",
        "criticalAlerts": ["Short warning 1", "Short warning 2"],
        "actionPlan": ["Quick step 1", "Quick step 2"]
      }

      Keep it professional, encouraging, and easy to read. Do not hallucinate data.
    `;

    const ai = new GoogleGenAI({ apiKey });
    
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          responseMimeType: "application/json",
        }
    });

    const rawContent = response.text;
    
    if (!rawContent) {
      return { report: null, error: 'Invalid response from AI' };
    }

    try {
      const parsedReport = JSON.parse(rawContent);
      return { report: parsedReport, error: null };
    } catch (parseError) {
      console.error('Failed to parse AI JSON response:', parseError);
      return { report: null, error: 'Failed to parse AI report' };
    }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error('AI Report Error:', error);
    return { report: null, error: 'Failed to generate AI report' };
  }
}
