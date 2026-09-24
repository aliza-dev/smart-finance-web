'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { auth } from '@/auth';

export async function getBudgets(month: string) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return { budgets: [], error: 'Unauthorized' };
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    if (!user) {
      return { budgets: [], error: 'User not found' };
    }

    const budgets = await prisma.budget.findMany({
      where: { 
        userId: user.id,
        month: month
      },
      orderBy: { category: 'asc' },
    });

    return { budgets, error: null };
  } catch (error) {
    console.error('Failed to fetch budgets:', error);
    return { budgets: [], error: 'Failed to fetch budgets' };
  }
}

export async function setBudget(category: string, amount: number, month: string) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return { budget: null, error: 'Unauthorized' };
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    if (!user) {
      return { budget: null, error: 'User not found' };
    }

    const budget = await prisma.budget.upsert({
      where: {
        userId_category_month: {
          userId: user.id,
          category,
          month
        }
      },
      update: {
        amount
      },
      create: {
        userId: user.id,
        category,
        amount,
        month
      }
    });

    revalidatePath('/budgets');
    return { budget, error: null };
  } catch (error) {
    console.error('Failed to set budget:', error);
    return { budget: null, error: 'Failed to set budget' };
  }
}
