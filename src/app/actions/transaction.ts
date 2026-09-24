'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { Transaction, Category, TransactionType } from '@/types';
import { auth } from '@/auth';

export async function getTransactions() {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return { transactions: [], error: 'Unauthorized' };
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    if (!user) {
      return { transactions: [], error: 'User not found' };
    }

    const transactions = await prisma.transaction.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
    });
    
    // We must map the DB records to the Transaction type used in frontend, mainly stringifying dates and decimal to number
    const formatted: Transaction[] = transactions.map(t => ({
      id: t.id,
      description: t.description,
      amount: Number(t.amount),
      type: t.type as TransactionType,
      category: t.category as Category,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      spendType: t.spendType as any,
      date: t.date,
    }));

    return { transactions: formatted, error: null };
  } catch (error) {
    console.error('Failed to fetch transactions:', error);
    return { transactions: [], error: 'Failed to fetch transactions' };
  }
}

export async function addTransaction(data: Omit<Transaction, 'id' | 'createdAt' | 'updatedAt'>) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return { transaction: null, error: 'Unauthorized' };
    }

    let user = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    if (!user) {
      // In case they logged in but don't exist in DB yet, create them.
      user = await prisma.user.create({
        data: {
          email: session.user.email,
          name: session.user.name || 'User',
        }
      });
    }

    const newTransaction = await prisma.transaction.create({
      data: {
        description: data.description,
        amount: Number(data.amount),
        type: data.type,
        category: data.category,
        spendType: data.spendType || "UNCATEGORIZED",
        date: data.date,
        userId: user.id,
      },
    });

    revalidatePath('/');
    
    const formatted: Transaction = {
      id: newTransaction.id,
      description: newTransaction.description,
      amount: Number(newTransaction.amount),
      type: newTransaction.type as TransactionType,
      category: newTransaction.category as Category,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      spendType: newTransaction.spendType as any,
      date: newTransaction.date,
    };
    
    return { transaction: formatted, error: null };
  } catch (error) {
    console.error('Failed to add transaction:', error);
    return { transaction: null, error: 'Failed to add transaction' };
  }
}

export async function updateTransaction(id: string, data: Omit<Transaction, 'id' | 'createdAt' | 'updatedAt'>) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return { transaction: null, error: 'Unauthorized' };
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    if (!user) {
      return { transaction: null, error: 'User not found' };
    }

    const updatedTransaction = await prisma.transaction.update({
      where: { id, userId: user.id },
      data: {
        description: data.description,
        amount: Number(data.amount),
        type: data.type,
        category: data.category,
        spendType: data.spendType || "UNCATEGORIZED",
        date: data.date,
      },
    });

    revalidatePath('/');
    revalidatePath('/transactions');
    
    const formatted: Transaction = {
      id: updatedTransaction.id,
      description: updatedTransaction.description,
      amount: Number(updatedTransaction.amount),
      type: updatedTransaction.type as TransactionType,
      category: updatedTransaction.category as Category,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      spendType: updatedTransaction.spendType as any,
      date: updatedTransaction.date,
    };
    
    return { transaction: formatted, error: null };
  } catch (error) {
    console.error('Failed to update transaction:', error);
    return { transaction: null, error: 'Failed to update transaction' };
  }
}

export async function deleteTransaction(id: string) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return { success: false, error: 'Unauthorized' };
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    if (!user) {
      return { success: false, error: 'User not found' };
    }

    await prisma.transaction.delete({
      where: { id, userId: user.id },
    });

    revalidatePath('/');
    return { success: true, error: null };
  } catch (error) {
    console.error('Failed to delete transaction:', error);
    return { success: false, error: 'Failed to delete transaction' };
  }
}
