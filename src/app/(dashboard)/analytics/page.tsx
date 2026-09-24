"use client";

import { useExpenseContext } from "@/context/ExpenseContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/currency";
import { useSession } from "next-auth/react";
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import { ArrowUpCircle, ArrowDownCircle, Wallet, Plus } from "lucide-react";
import Link from "next/link";
import { subDays, format } from "date-fns";
import { useState, useEffect } from "react";

const CATEGORY_COLORS: Record<string, string> = {
  food: "#f97316", // orange-500
  housing: "#6366f1", // indigo-500
  utilities: "#eab308", // yellow-500
  transport: "#14b8a6", // teal-500
  entertainment: "#ec4899", // pink-500
  health: "#10b981", // emerald-500
  shopping: "#3b82f6", // blue-500
  other: "#94a3b8" // slate-400
};

export default function AnalyticsPage() {
  const [isMounted, setIsMounted] = useState(false);
  const { transactions, totalIncome, totalExpenses, balance } = useExpenseContext();
  const { data: session } = useSession();
  const userCurrency = session?.user?.currency || "PKR";

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsMounted(true);
  }, []);

  const hasData = transactions && transactions.length > 0;

  // Prepare data for "Expenses by Category" Donut Chart
  const expensesByCategory = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc, curr) => {
      acc[curr.category] = (acc[curr.category] || 0) + curr.amount;
      return acc;
    }, {} as Record<string, number>);

  const pieData = Object.keys(expensesByCategory).map(key => ({
    name: key.charAt(0).toUpperCase() + key.slice(1),
    value: expensesByCategory[key],
    color: CATEGORY_COLORS[key] || CATEGORY_COLORS.other
  })).sort((a, b) => b.value - a.value);

  // Prepare data for "Daily Cashflow" Bar Chart (last 7 days)
  const last7Days = Array.from({ length: 7 }).map((_, i) => {
    const d = subDays(new Date(), 6 - i);
    return {
      date: d,
      displayDate: format(d, 'MMM dd'),
      rawDate: format(d, 'yyyy-MM-dd')
    };
  });

  const barData = last7Days.map(day => {
    const dayTrans = transactions.filter(t => {
      // Safely check if same day
      return t.date.startsWith(day.rawDate);
    });

    const income = dayTrans.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
    const expense = dayTrans.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);

    return {
      name: day.displayDate,
      Income: income,
      Expense: expense
    };
  });

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-10 p-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Daily Report</h1>
        <p className="text-muted-foreground text-lg">
          Insights and analytics to understand your financial health.
        </p>
      </div>

      {/* Top Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-card border-border/50 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-green-500/10 rounded-full -mr-8 -mt-8 blur-2xl"></div>
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Income</CardTitle>
            <div className="p-2 bg-green-500/10 rounded-full">
              <ArrowDownCircle className="h-4 w-4 text-green-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">
              {formatCurrency(totalIncome, userCurrency)}
            </div>
            <p className="text-xs font-medium text-emerald-500 mt-2 bg-emerald-500/10 inline-block px-2 py-1 rounded-md">
              +5.2% from yesterday
            </p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border/50 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-red-500/10 rounded-full -mr-8 -mt-8 blur-2xl"></div>
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Expense</CardTitle>
            <div className="p-2 bg-red-500/10 rounded-full">
              <ArrowUpCircle className="h-4 w-4 text-red-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">
              {formatCurrency(Math.abs(totalExpenses), userCurrency)}
            </div>
            <p className="text-xs font-medium text-rose-500 mt-2 bg-rose-500/10 inline-block px-2 py-1 rounded-md">
              -1.4% from yesterday
            </p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border/50 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-primary/10 rounded-full -mr-8 -mt-8 blur-2xl"></div>
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-medium text-muted-foreground">Net Cashflow</CardTitle>
            <div className="p-2 bg-primary/10 rounded-full">
              <Wallet className="h-4 w-4 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className={`text-3xl font-bold ${balance >= 0 ? "text-foreground" : "text-destructive"}`}>
              {formatCurrency(balance, userCurrency)}
            </div>
            <p className="text-xs font-medium text-primary mt-2 bg-primary/10 inline-block px-2 py-1 rounded-md">
              Steady
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Donut Chart: Expenses by Category */}
        <Card className="lg:col-span-1 bg-card border-border/50 shadow-sm flex flex-col relative overflow-hidden">
          <CardHeader>
            <CardTitle>Expenses by Category</CardTitle>
            <CardDescription>Breakdown of your spending</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col justify-center items-center min-h-[300px] relative">
            {!hasData && (
              <div className="absolute inset-0 z-10 backdrop-blur-sm bg-background/50 flex flex-col items-center justify-center p-6 text-center">
                <p className="font-medium mb-4">No data available yet</p>
                <Link href="/dashboard" className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground shadow hover:bg-primary/90 h-9 px-4 py-2 rounded-full">
                  <Plus className="h-4 w-4 mr-2" /> Add Transaction
                </Link>
              </div>
            )}
            
            {hasData && pieData.length === 0 ? (
              <p className="text-muted-foreground text-sm">No expenses recorded yet.</p>
            ) : (
              <div className="w-full h-full min-h-[250px]" style={{ filter: hasData ? 'none' : 'blur(4px)' }}>
                {isMounted && (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={hasData ? pieData : [{ name: "Mock", value: 100, color: "#cbd5e1" }]}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                        stroke="none"
                      >
                        {(hasData ? pieData : [{ name: "Mock", value: 100, color: "#cbd5e1" }]).map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip 
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        formatter={(value: any) => formatCurrency(Number(value), userCurrency)}
                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                      />
                      <Legend 
                        verticalAlign="bottom" 
                        height={36} 
                        iconType="circle"
                        wrapperStyle={{ fontSize: '12px' }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Bar Chart: Daily Cashflow */}
        <Card className="lg:col-span-2 bg-card border-border/50 shadow-sm relative overflow-hidden">
          <CardHeader>
            <CardTitle>Daily Cashflow</CardTitle>
            <CardDescription>Income vs. Expense over the last 7 days</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px] relative">
            {!hasData && (
              <div className="absolute inset-0 z-10 backdrop-blur-sm bg-background/50 flex flex-col items-center justify-center p-6 text-center">
                <p className="font-medium mb-4">No data available yet</p>
                <Link href="/dashboard" className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground shadow hover:bg-primary/90 h-9 px-4 py-2 rounded-full">
                  <Plus className="h-4 w-4 mr-2" /> Add Transaction
                </Link>
              </div>
            )}
            
            <div className="w-full h-full" style={{ filter: hasData ? 'none' : 'blur(4px)' }}>
              {isMounted && (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={hasData ? barData : last7Days.map((d, i) => ({ name: d.displayDate, Income: 3000 + (i * 500), Expense: 2000 + (i % 2 === 0 ? 500 : 0) }))}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    barGap={2}
                  >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" opacity={0.5} />
                    <XAxis 
                      dataKey="name" 
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                      dy={10}
                    />
                    <YAxis 
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                      tickFormatter={(value) => `$${value}`} // simplifying formatter for space
                    />
                    <Tooltip
                      cursor={{ fill: 'hsl(var(--muted)/0.4)' }}
                      contentStyle={{ borderRadius: '12px', border: '1px solid hsl(var(--border))', backgroundColor: 'hsl(var(--background))' }}
                      // eslint-disable-next-line @typescript-eslint/no-explicit-any
                      formatter={(value: any) => formatCurrency(Number(value), userCurrency)}
                    />
                    <Legend 
                      verticalAlign="top" 
                      height={36}
                      iconType="circle"
                      wrapperStyle={{ paddingBottom: '20px', fontSize: '12px' }}
                    />
                    <Bar dataKey="Income" fill="#10b981" radius={[4, 4, 0, 0]} maxBarSize={40} />
                    <Bar dataKey="Expense" fill="#f43f5e" radius={[4, 4, 0, 0]} maxBarSize={40} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}
