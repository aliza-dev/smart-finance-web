"use client";

import { useMemo } from "react";
import { BarChart, Bar, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis, Cell } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/currency";

export function SubscriptionsCostChart({ subscriptions, userCurrency = "PKR" }: { subscriptions: Array<{ amount: number, billingCycle: string, createdAt: string | Date }>, userCurrency?: string }) {
  const chartData = useMemo(() => {
    const today = new Date();
    const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
    
    const dailyCosts: Record<number, number> = {};
    for (let i = 1; i <= daysInMonth; i++) {
      dailyCosts[i] = 0;
    }

    subscriptions.forEach(sub => {
       const created = new Date(sub.createdAt);
       let day = created.getDate();
       if (isNaN(day)) day = 1;
       if (day > daysInMonth) day = daysInMonth;
       
       const cycle = (sub.billingCycle || "").toLowerCase();
       let monthlyAmount = sub.amount;
       if (cycle === "yearly") monthlyAmount = sub.amount / 12;

       if (cycle === "monthly" || cycle === "yearly") {
           dailyCosts[day] += monthlyAmount;
       } else if (cycle === "weekly") {
           let d = day;
           while (d <= daysInMonth) {
              dailyCosts[d] += sub.amount;
              d += 7;
           }
           let prevD = day - 7;
           while (prevD > 0) {
              dailyCosts[prevD] += sub.amount;
              prevD -= 7;
           }
       }
    });
    
    const weeklyCosts = [
      { name: "Week 1", amount: 0 },
      { name: "Week 2", amount: 0 },
      { name: "Week 3", amount: 0 },
      { name: "Week 4", amount: 0 },
    ];
    
    for (let i = 1; i <= daysInMonth; i++) {
        if (i <= 7) weeklyCosts[0].amount += dailyCosts[i];
        else if (i <= 14) weeklyCosts[1].amount += dailyCosts[i];
        else if (i <= 21) weeklyCosts[2].amount += dailyCosts[i];
        else weeklyCosts[3].amount += dailyCosts[i];
    }

    return weeklyCosts;
  }, [subscriptions]);

  const totalMonthly = useMemo(() => chartData.reduce((acc, curr) => acc + curr.amount, 0), [chartData]);

  if (!subscriptions.length) return null;

  return (
    <Card className="bg-primary/5 border-primary/20 mb-6">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Monthly Distribution</CardTitle>
        <CardDescription>Upcoming costs over the month ({formatCurrency(totalMonthly, userCurrency)})</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[200px] w-full mt-2">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" opacity={0.5} />
              <XAxis 
                dataKey="name" 
                stroke="hsl(var(--muted-foreground))"
                fontSize={11}
                tickLine={false}
                axisLine={false}
              />
              <YAxis 
                stroke="hsl(var(--muted-foreground))"
                fontSize={11}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `${value}`}
              />
              <Tooltip 
                cursor={{ fill: 'hsl(var(--muted))', opacity: 0.2 }}
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)' }}
                formatter={(value: any) => [formatCurrency(value, userCurrency), "Cost"]}
              />
              <Bar dataKey="amount" radius={[4, 4, 0, 0]}>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={`hsl(var(--primary))`} opacity={0.8} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
