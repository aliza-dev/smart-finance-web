"use client";

import { useMemo } from "react";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { format, parseISO } from "date-fns";
import { Transaction } from "@/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/currency";

export function TransactionsTrendChart({ transactions, userCurrency = "PKR" }: { transactions: Transaction[], userCurrency?: string }) {
  const chartData = useMemo(() => {
    // Group transactions by date
    const grouped = transactions.reduce((acc, t) => {
      const date = t.date.split("T")[0];
      if (!acc[date]) {
        acc[date] = { date, income: 0, expense: 0 };
      }
      if (t.type === 'income') {
        acc[date].income += Number(t.amount);
      } else {
        acc[date].expense += Number(t.amount);
      }
      return acc;
    }, {} as Record<string, { date: string, income: number, expense: number }>);
    
    const sorted = Object.values(grouped).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()).slice(-30);
    
    if (sorted.length === 1) {
      const singleDate = new Date(sorted[0].date);
      singleDate.setDate(singleDate.getDate() - 1);
      const prevDateStr = singleDate.toISOString().split("T")[0];
      sorted.unshift({ date: prevDateStr, income: 0, expense: 0 });
    }
    
    return sorted;
  }, [transactions]);

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle>Income vs Expense Trend</CardTitle>
        <CardDescription>Your cash flow over the last 30 days.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[250px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
              <XAxis 
                dataKey="date" 
                tickFormatter={(date) => format(parseISO(date), "MMM dd")}
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis 
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                width={80}
                tickFormatter={(value) => `${value}`}
              />
              <Tooltip 
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)' }}
                labelFormatter={(label) => format(parseISO(label as string), "MMM dd, yyyy")}
                formatter={(value: any) => [formatCurrency(value, userCurrency), ""]}
              />
              <Area type="monotone" dataKey="income" name="Income" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorIncome)" />
              <Area type="monotone" dataKey="expense" name="Expense" stroke="#ef4444" strokeWidth={2} fillOpacity={1} fill="url(#colorExpense)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
