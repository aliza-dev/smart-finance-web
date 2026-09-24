"use client";

import { useState } from "react";
import { Bell, Calendar, PlusCircle, CheckCircle2, CreditCard, Clock, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Subscription } from "@/types";
import { formatCurrency } from "@/lib/currency";
import { useSession } from "next-auth/react";
import { AddReminderModal } from "@/components/AddReminderModal";

interface RemindersClientProps {
  subscriptions: Subscription[];
  totalMonthlyIncome: number;
}

export function RemindersClient({ subscriptions, totalMonthlyIncome }: RemindersClientProps) {
  const { data: session } = useSession();
  const userCurrency = session?.user?.currency || "PKR";
  
  const [activeTab, setActiveTab] = useState<"All" | "Subscriptions" | "Bills" | "Installments">("All");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filteredSubscriptions = subscriptions.filter(sub => {
    if (activeTab === "All") return true;
    return sub.type?.toLowerCase() === activeTab.toLowerCase().slice(0, -1) || sub.type?.toLowerCase() === activeTab.toLowerCase();
  });

  const totalRecurring = subscriptions.reduce((sum, sub) => {
    // Approximate monthly if yearly
    return sum + (sub.billingCycle === "yearly" ? sub.amount / 12 : sub.amount);
  }, 0);

  const recurringPercent = totalMonthlyIncome > 0 ? ((totalRecurring / totalMonthlyIncome) * 100).toFixed(1) : 0;

  const calculateDaysLeft = (dateString?: string | null) => {
    if (!dateString) return null;
    const parts = dateString.split('-');
    if (parts.length !== 3) return null;
    const due = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const diffTime = due.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const getDueStyle = (days: number | null) => {
    if (days === null) return "bg-slate-500/10 text-slate-500";
    if (days < 0) return "bg-red-500/10 text-red-500"; // Overdue
    if (days <= 3) return "bg-rose-500/10 text-rose-500";
    if (days <= 7) return "bg-orange-500/10 text-orange-500";
    return "bg-blue-500/10 text-blue-500";
  };

  const getDueText = (days: number | null) => {
    if (days === null) return "No Date";
    if (days < 0) return `Overdue by ${Math.abs(days)} days`;
    if (days === 0) return "Due Today";
    if (days === 1) return "Due Tomorrow";
    return `Due in ${days} days`;
  };

  const getIcon = (type: string) => {
    if (type === "bill") return <FileText className="h-6 w-6" />;
    if (type === "installment") return <Clock className="h-6 w-6" />;
    return <CreditCard className="h-6 w-6" />;
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Reminders</h1>
          <p className="text-muted-foreground text-lg">
            Stay on top of your upcoming bills and financial goals.
          </p>
        </div>
        <Button className="rounded-full shadow-sm" onClick={() => setIsModalOpen(true)}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Reminder
        </Button>
      </div>

      <div className="bg-card p-6 rounded-2xl border border-border/50 shadow-sm flex flex-col sm:flex-row justify-between items-center gap-4">
        <div>
          <p className="text-sm font-medium text-muted-foreground">Monthly Recurring vs Income</p>
          <div className="mt-1 flex items-end gap-2">
            <span className="text-3xl font-bold">{formatCurrency(totalRecurring, userCurrency)}</span>
            <span className="text-sm text-muted-foreground mb-1">/ {formatCurrency(totalMonthlyIncome, userCurrency)}</span>
          </div>
        </div>
        <div className="text-right">
          <div className="text-3xl font-bold text-primary">{recurringPercent}%</div>
          <p className="text-sm text-muted-foreground">Committed</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0">
        {["All", "Subscriptions", "Bills", "Installments"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab as "All" | "Subscriptions" | "Bills" | "Installments")}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap ${
              activeTab === tab 
                ? "bg-primary text-primary-foreground shadow-sm" 
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredSubscriptions.map(sub => {
          const daysLeft = calculateDaysLeft(sub.nextDueDate);
          const style = getDueStyle(daysLeft);

          return (
            <div key={sub.id} className="bg-card rounded-2xl border border-border/50 shadow-sm overflow-hidden flex flex-col group hover:shadow-md transition-all hover:border-primary/20">
              <div className="p-6 flex-1 space-y-4">
                <div className="flex justify-between items-start">
                  <div className={`p-3 rounded-xl ${style}`}>
                    {getIcon(sub.type)}
                  </div>
                  <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${style}`}>
                    {getDueText(daysLeft)}
                  </span>
                </div>
                <div>
                  <h3 className="font-semibold text-lg text-foreground">{sub.name}</h3>
                  <p className="text-sm text-muted-foreground mt-1 capitalize">{sub.type || "Subscription"} • {sub.billingCycle}</p>
                </div>
                {sub.nextDueDate && (
                  <div className="pt-2 flex items-center gap-2 text-sm font-medium">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>{new Date(sub.nextDueDate).toLocaleDateString()}</span>
                  </div>
                )}
              </div>
              <div className="p-4 bg-muted/30 border-t border-border/50 flex items-center justify-between">
                <span className="font-bold text-lg text-rose-500">-{formatCurrency(sub.amount, userCurrency)}</span>
                <Button variant="ghost" size="sm" className="h-8 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 dark:hover:bg-emerald-950/30">
                  <CheckCircle2 className="mr-2 h-4 w-4" />
                  Mark Paid
                </Button>
              </div>
            </div>
          );
        })}
        {filteredSubscriptions.length === 0 && (
          <div className="col-span-full py-12 text-center text-muted-foreground bg-muted/20 rounded-2xl border border-dashed border-border">
            <Bell className="h-10 w-10 mx-auto opacity-50 mb-4" />
            <p className="text-lg font-medium">No reminders found.</p>
            <p className="text-sm">Click &quot;Add Reminder&quot; to get started.</p>
            <Button variant="outline" className="mt-4 rounded-full" onClick={() => setIsModalOpen(true)}>
              <PlusCircle className="mr-2 h-4 w-4" /> Add Reminder
            </Button>
          </div>
        )}
      </div>
      
      <AddReminderModal isOpen={isModalOpen} setIsOpen={setIsModalOpen} />
    </div>
  );
}
