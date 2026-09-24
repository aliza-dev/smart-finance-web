"use client";

import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { getSubscriptions } from "@/app/actions/subscription";
import { CalendarClock, Loader2, Repeat } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/currency";
import { useSession } from "next-auth/react";

export function UpcomingSubscriptions() {
  const { data: session } = useSession();
  const userCurrency = session?.user?.currency || "PKR";
  const [subscriptions, setSubscriptions] = useState<Array<{ id: string, name: string, amount: number, billingCycle: string, createdAt: Date }>>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const { subscriptions } = await getSubscriptions();
      if (subscriptions) setSubscriptions(subscriptions);
      setLoading(false);
    }
    load();
  }, []);

  function getDaysUntilNextBill(createdAt: Date, cycle: string) {
    const created = new Date(createdAt);
    const now = new Date();
    
    const nextDate = new Date(created);
    if (cycle === "monthly") {
      nextDate.setMonth(nextDate.getMonth() + 1);
      while (nextDate < now) {
        nextDate.setMonth(nextDate.getMonth() + 1);
      }
    } else if (cycle === "yearly") {
      nextDate.setFullYear(nextDate.getFullYear() + 1);
      while (nextDate < now) {
        nextDate.setFullYear(nextDate.getFullYear() + 1);
      }
    }
  
    const diffTime = nextDate.getTime() - now.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
  }

  if (loading) {
    return (
      <Card className="bg-card border-border/50 shadow-sm transition-all hover:shadow-md">
        <CardHeader className="pb-2 flex flex-row items-center justify-between">
          <CardTitle className="text-sm font-medium text-muted-foreground">Upcoming Subscriptions</CardTitle>
          <CalendarClock className="h-4 w-4 text-slate-500" />
        </CardHeader>
        <CardContent className="flex items-center py-2">
          <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  if (subscriptions.length === 0) {
    return (
      <Card className="bg-card border-border/50 shadow-sm transition-all hover:shadow-md">
        <CardHeader className="pb-2 flex flex-row items-center justify-between">
          <CardTitle className="text-sm font-medium text-muted-foreground">Upcoming Subscriptions</CardTitle>
          <CalendarClock className="h-4 w-4 text-slate-500" />
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground py-1">No active subscriptions.</p>
        </CardContent>
      </Card>
    );
  }

  // Find nearest billing date
  const subsWithDays = subscriptions.map(sub => ({
    ...sub,
    daysLeft: getDaysUntilNextBill(sub.createdAt, sub.billingCycle)
  })).sort((a, b) => a.daysLeft - b.daysLeft);

  const nextSub = subsWithDays[0];
  
  return (
    <Card className="bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-indigo-950/30 dark:to-blue-950/30 border-indigo-100 dark:border-indigo-900">
      <CardHeader className="pb-2 flex flex-row items-center justify-between">
        <CardTitle className="text-sm font-medium text-indigo-700 dark:text-indigo-400">Upcoming Subscriptions</CardTitle>
        <Repeat className="h-4 w-4 text-indigo-500" />
      </CardHeader>
      <CardContent>
        <div className="flex flex-col space-y-1">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-slate-900 dark:text-slate-100">{nextSub.name}</span>
            <Badge variant="secondary" className="bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300">
              {nextSub.daysLeft} {nextSub.daysLeft === 1 ? 'day' : 'days'}
            </Badge>
          </div>
          <p className="text-sm text-indigo-600/80 dark:text-indigo-400/80">
            Next bill: {formatCurrency(nextSub.amount, userCurrency)}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
