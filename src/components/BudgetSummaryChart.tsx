"use client";

import { useMemo } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/currency";

export function BudgetSummaryChart({ budgets, spentByCategory, userCurrency = "PKR" }: { budgets: Array<{ amount: number, category: string }>, spentByCategory: Record<string, number>, userCurrency?: string }) {
  const chartData = useMemo(() => {
    let totalBudget = 0;
    let totalSpent = 0;
    
    budgets.forEach(b => {
      totalBudget += b.amount;
      totalSpent += (spentByCategory[b.category] || 0);
    });

    if (totalBudget === 0 && totalSpent === 0) {
      return [{ name: "No Data", value: 1, color: "hsl(var(--muted))" }];
    }

    return [
      { name: "Total Spent", value: totalSpent, color: "#ef4444" },
      { name: "Remaining Budget", value: Math.max(0, totalBudget - totalSpent), color: "#10b981" }
    ];
  }, [budgets, spentByCategory]);

  const totalBudget = useMemo(() => budgets.reduce((acc, b) => acc + b.amount, 0), [budgets]);
  const totalSpent = useMemo(() => budgets.reduce((acc, b) => acc + (spentByCategory[b.category] || 0), 0), [budgets, spentByCategory]);


  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle>Budget Overview</CardTitle>
        <CardDescription>Total Budget vs Total Spent across all categories</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
           <div className="flex-1 w-full space-y-4">
             <div className="flex justify-between items-center border-b pb-2 border-border/50">
               <span className="text-muted-foreground">Total Budget</span>
               <span className="text-xl font-bold">{formatCurrency(totalBudget, userCurrency)}</span>
             </div>
             <div className="flex justify-between items-center border-b pb-2 border-border/50">
               <span className="text-muted-foreground">Total Spent</span>
               <span className="text-xl font-bold text-destructive">{formatCurrency(totalSpent, userCurrency)}</span>
             </div>
             <div className="flex justify-between items-center pb-2">
               <span className="text-muted-foreground">Remaining</span>
               <span className={`text-xl font-bold ${totalBudget - totalSpent < 0 ? 'text-destructive' : 'text-emerald-500'}`}>
                 {formatCurrency(totalBudget - totalSpent, userCurrency)}
               </span>
             </div>
           </div>
           <div className="h-[200px] w-full md:w-[200px]">
             <ResponsiveContainer width="100%" height="100%">
               <PieChart>
                 <Pie
                   data={chartData}
                   cx="50%"
                   cy="50%"
                   innerRadius={60}
                   outerRadius={80}
                   paddingAngle={5}
                   dataKey="value"
                   stroke="none"
                 >
                   {chartData.map((entry, index) => (
                     <Cell key={`cell-${index}`} fill={entry.color} />
                   ))}
                 </Pie>
                 <Tooltip 
                   formatter={(value: any) => formatCurrency(value, userCurrency)} 
                   contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)' }}
                 />
               </PieChart>
             </ResponsiveContainer>
           </div>
        </div>
      </CardContent>
    </Card>
  );
}
