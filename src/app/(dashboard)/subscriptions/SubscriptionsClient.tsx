"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Trash2, Repeat, Calendar } from "lucide-react";
import { addSubscription, deleteSubscription } from "@/app/actions/subscription";
import { toast } from "sonner";

import { formatCurrency } from "@/lib/currency";
import { useSession } from "next-auth/react";
import { addMonths, addYears, addWeeks, format, isBefore } from 'date-fns';
import { SubscriptionsCostChart } from "@/components/SubscriptionsCostChart";

interface Subscription {
  id: string;
  name: string;
  amount: number;
  billingCycle: string;
  createdAt: Date;
}



export function SubscriptionsClient({ initialSubscriptions }: { initialSubscriptions: Subscription[] }) {
  const { data: session } = useSession();
  const userCurrency = session?.user?.currency || "PKR";
  const [subscriptions, setSubscriptions] = useState(initialSubscriptions);
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Form state
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [billingCycle, setBillingCycle] = useState("MONTHLY");

  const getNextDueDate = (createdAt: Date | string, cycle: string) => {
    let nextDate = new Date(createdAt);
    const now = new Date();
    if (isNaN(nextDate.getTime())) return now;
    
    while (isBefore(nextDate, now)) {
      if (cycle === "MONTHLY") nextDate = addMonths(nextDate, 1);
      else if (cycle === "YEARLY") nextDate = addYears(nextDate, 1);
      else if (cycle === "WEEKLY") nextDate = addWeeks(nextDate, 1);
      else break;
    }
    return nextDate;
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !amount) return;

    setLoading(true);
    const result = await addSubscription({
      name,
      amount: parseFloat(amount),
      billingCycle,
    });

    if (result.subscription) {
      setSubscriptions([result.subscription, ...subscriptions]);
      setName("");
      setAmount("");
      toast.success("Subscription added");
    } else {
      toast.error(result.error || "Failed to add subscription");
    }
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    const result = await deleteSubscription(id);
    if (result.success) {
      setSubscriptions(subscriptions.filter((s) => s.id !== id));
      toast.success("Subscription deleted");
    } else {
      toast.error(result.error || "Failed to delete");
    }
    setDeletingId(null);
  };

  return (
    <div className="grid gap-6 md:grid-cols-[1fr_350px]">
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Active Subscriptions</CardTitle>
            <CardDescription>
              Your list of recurring bills and subscriptions.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {subscriptions.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64 text-slate-500 dark:text-slate-400 border border-dashed rounded-lg bg-slate-50/50 dark:bg-slate-900/50 mt-4">
                <Repeat className="h-12 w-12 mb-4 opacity-50" />
                <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">No subscriptions yet</h3>
                <p className="text-sm mt-1">Add your first subscription to get started!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {subscriptions.map((sub) => {
                  const nextDue = getNextDueDate(sub.createdAt, sub.billingCycle);
                  return (
                    <Card key={sub.id} className="bg-card shadow-sm border-border/50 hover:shadow-md transition-shadow relative overflow-hidden group">
                      <div className="p-5 flex flex-col h-full justify-between gap-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-semibold text-lg">{sub.name}</h3>
                            <span className="text-[10px] uppercase tracking-wider bg-secondary/80 text-secondary-foreground px-2 py-0.5 rounded-full font-medium mt-1 inline-block">
                              {sub.billingCycle}
                            </span>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(sub.id)}
                            disabled={deletingId === sub.id}
                            className="h-8 w-8 text-muted-foreground opacity-0 group-hover:opacity-100 hover:text-destructive transition-all -mt-1 -mr-1"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                        
                        <div className="flex items-end justify-between">
                          <div className="space-y-1">
                            <p className="text-sm text-muted-foreground">Next payment</p>
                            <p className="font-medium text-sm flex items-center gap-1.5">
                              <Calendar className="h-3.5 w-3.5 text-primary/70" />
                              {format(nextDue, "MMM dd, yyyy")}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-xl font-bold text-foreground">
                              {formatCurrency(sub.amount, userCurrency)}
                            </p>
                          </div>
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="space-y-6">
        <SubscriptionsCostChart subscriptions={subscriptions} userCurrency={userCurrency} />

        <Card>
          <CardHeader>
            <CardTitle>Add Subscription</CardTitle>
            <CardDescription>
              Enter a new recurring expense.
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleAdd}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Service Name</Label>
                <Input
                  id="name"
                  placeholder="e.g., Netflix, Spotify"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="amount">Amount</Label>
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="billingCycle">Billing Cycle</Label>
                <Select value={billingCycle} onValueChange={(val) => val && setBillingCycle(val)}>
                  <SelectTrigger id="billingCycle">
                    <SelectValue placeholder="Select cycle" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="WEEKLY">Weekly</SelectItem>
                    <SelectItem value="MONTHLY">Monthly</SelectItem>
                    <SelectItem value="YEARLY">Yearly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" className="w-full" disabled={loading || !name || !amount}>
                {loading ? "Adding..." : "Add Subscription"}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}
