"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { Transaction } from "@/types";
import { format } from "date-fns";
import { addTransaction as addTransactionAction, deleteTransaction as deleteTransactionAction } from "@/app/actions/transaction";
import { CustomCategoryData } from "@/components/CategoryIcon";
import { toast } from "sonner";

interface ExpenseContextType {
  transactions: Transaction[];
  addTransaction: (transaction: Omit<Transaction, "id" | "date">) => Promise<void>;
  updateTransaction: (id: string, transaction: Omit<Transaction, "id" | "createdAt" | "updatedAt">) => Promise<void>;
  deleteTransaction: (id: number | string) => Promise<void>;
  totalIncome: number;
  totalExpenses: number;
  balance: number;
  customCategories: CustomCategoryData[];
}

const ExpenseContext = createContext<ExpenseContextType | undefined>(undefined);

export function ExpenseProvider({ children, initialTransactions, initialCategories }: { children: ReactNode, initialTransactions: Transaction[], initialCategories: CustomCategoryData[] }) {
  const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions);
  const [customCategories, setCustomCategories] = useState<CustomCategoryData[]>(initialCategories);

  // Sync state if initialTransactions changes (e.g., from server revalidation)
  useEffect(() => {
    // eslint-disable-next-line
    setTransactions(initialTransactions);
  }, [initialTransactions]);

  useEffect(() => {
    // eslint-disable-next-line
    setCustomCategories(initialCategories);
  }, [initialCategories]);

  const addTransaction = async (transactionData: Omit<Transaction, "id" | "date">) => {
    const todayStr = format(new Date(), "yyyy-MM-dd");
    const optimisticTransaction: Transaction = {
      id: Date.now().toString(),
      date: todayStr,
      ...transactionData,
      amount: Number(transactionData.amount),
    };
    
    // Optimistic UI update
    setTransactions((prev) => [optimisticTransaction, ...prev]);

    // Server action
    const { transaction, error } = await addTransactionAction({
      ...transactionData,
      date: todayStr,
      amount: Number(transactionData.amount)
    });

    if (error || !transaction) {
      console.error(error);
      toast.error("Failed to add transaction");
      // Revert optimistic update on failure
      setTransactions((prev) => prev.filter((t) => t.id !== optimisticTransaction.id));
      return;
    }

    toast.success("Transaction added successfully!");
    // Replace optimistic with real transaction from DB
    setTransactions((prev) => prev.map((t) => (t.id === optimisticTransaction.id ? transaction : t)));
  };

  const updateTransaction = async (id: string, transactionData: Omit<Transaction, "id" | "createdAt" | "updatedAt">) => {
    // Optimistic UI update
    const previousTransactions = [...transactions];
    const updatedAmount = Number(transactionData.amount);
    
    setTransactions((prev) => prev.map((t) => 
      t.id === id ? { ...t, ...transactionData, amount: updatedAmount } : t
    ));

    // Server action
    const { transaction, error } = await import("@/app/actions/transaction").then(m => m.updateTransaction(id, transactionData));

    if (error || !transaction) {
      console.error(error);
      toast.error("Failed to update transaction");
      // Revert optimistic update
      setTransactions(previousTransactions);
    } else {
      toast.success("Transaction updated successfully!");
    }
  };

  const deleteTransaction = async (id: number | string) => {
    // Optimistic UI update
    const previousTransactions = [...transactions];
    setTransactions((prev) => prev.filter((t) => t.id !== id));

    // Server action
    const { success, error } = await deleteTransactionAction(String(id));

    if (error || !success) {
      console.error(error);
      toast.error("Failed to delete transaction");
      // Revert optimistic update
      setTransactions(previousTransactions);
    } else {
      toast.success("Transaction deleted successfully!");
    }
  };

  const totalIncome = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = totalIncome - totalExpenses;

  return (
    <ExpenseContext.Provider
      value={{
        transactions,
        addTransaction,
        updateTransaction,
        deleteTransaction,
        totalIncome,
        totalExpenses,
        balance,
        customCategories,
      }}
    >
      {children}
    </ExpenseContext.Provider>
  );
}

export function useExpenseContext() {
  const context = useContext(ExpenseContext);
  if (context === undefined) {
    throw new Error("useExpenseContext must be used within an ExpenseProvider");
  }
  return context;
}
