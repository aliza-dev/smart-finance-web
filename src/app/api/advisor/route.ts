import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { GoogleGenAI } from '@google/genai';
import { prisma } from '@/lib/prisma';
export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;
    if (!userId) {
      return NextResponse.json({ error: 'User ID missing' }, { status: 400 });
    }

    const { messages } = await request.json();
    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: 'Messages are required' }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'AI API key not configured' }, { status: 500 });
    }

    // Fetch database metrics
    const transactions = await prisma.transaction.findMany({
      where: { userId }
    });

    const goals = await prisma.savingsGoal.findMany({
      where: { userId }
    });

    let totalIncome = 0;
    let totalExpenses = 0;

    transactions.forEach(t => {
      if (t.type === 'income') totalIncome += t.amount;
      else if (t.type === 'expense') totalExpenses += t.amount;
    });

    const netBalance = totalIncome - totalExpenses;

    const activeGoalsText = goals.length > 0 
      ? goals.map(g => `- ${g.name}: Target Rs ${g.targetAmount}, Current Rs ${g.currentAmount}`).join('\n')
      : "No active savings goals.";

    const ai = new GoogleGenAI({ apiKey });

    const systemPrompt = `You are SmartSpend AI, a personalized financial planner. The user's live financial context is: Total Income: Rs ${totalIncome}, Total Expenses: Rs ${totalExpenses}, Net Balance: Rs ${netBalance}. Strictly use these exact numbers to answer questions, provide customized 50/30/20 budget breakdowns, and give specific mathematical advice. Never say you don't have access to their data.

Active Savings Goals:
${activeGoalsText}

STRICT FORMATTING RULES:
- Zero Fluff: Never use introductory or concluding filler sentences (no "Let's look at this", no "You've got this!").
- Extreme Brevity: Use short, punchy sentences. Maximum 10-15 words per sentence.
- Bullet Points Only: Format almost all responses using small, easily scannable bullet points.
- Highlight Key Data: Always bold numbers and key metrics so the user can scan them in one second.
- Direct Answers: Get straight to the math and the action steps.

Example of expected output for a 50/30/20 breakdown:
Your 50/30/20 Budget (Income: Rs 150,000)
- **Needs (50%)**: Rs 75,000 (Housing, groceries)
- **Wants (30%)**: Rs 45,000 (Dining, hobbies)
- **Savings (20%)**: Rs 30,000 (Goals, emergency)

If a user asks about something unrelated to finance, gently steer the conversation back to financial planning, wealth management, or budgeting.`;

    // Format history for the interactions API
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const history = messages.slice(0, -1).map((msg: any) => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.content }]
    }));

    const lastMessage = messages[messages.length - 1].content;

    const chat = ai.chats.create({
      model: 'gemini-2.5-flash',
      config: {
        systemInstruction: systemPrompt,
        temperature: 0.7,
      },
      history: history.length > 0 ? history : undefined
    });

    const response = await chat.sendMessage({
      message: lastMessage
    });

    return NextResponse.json({ response: response.text }, { status: 200 });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error('Advisor API Error:', error);
    return NextResponse.json({ error: 'Failed to process AI request' }, { status: 500 });
  }
}
