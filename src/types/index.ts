export interface User {
  id: string;
  name: string;
  email: string;
}

export type Category = "food" | "housing" | "utilities" | "transport" | "entertainment" | "salary" | "other";

export type TransactionType = "income" | "expense";

export type SpendType = "NEED" | "WANT" | "SAVING" | "UNCATEGORIZED";

export interface Transaction {
  id: number | string;
  description: string;
  amount: number;
  type: TransactionType;
  category: Category;
  spendType: SpendType;
  date: string;
}

export interface Subscription {
  id: string;
  name: string;
  amount: number;
  billingCycle: string;
  type: string;
  nextDueDate?: string | null;
}
