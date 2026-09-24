import { getBudgets } from "@/app/actions/budget";
import { getTransactions } from "@/app/actions/transaction";
import { getCustomCategories } from "@/app/actions/category";
import { SetBudgetForm } from "@/components/SetBudgetForm";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { PiggyBank } from "lucide-react";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { formatCurrency } from "@/lib/currency";
import { CategoryIcon } from "@/components/CategoryIcon";
import { BudgetSummaryChart } from "@/components/BudgetSummaryChart";

const getCategoryColorClass = (cat: string) => {
  const normalized = cat.toLowerCase();
  switch (normalized) {
    case 'food': return 'border-orange-500/20 bg-orange-500/5';
    case 'grocery':
    case 'shopping': return 'border-blue-500/20 bg-blue-500/5';
    case 'transport':
    case 'transportation': return 'border-teal-500/20 bg-teal-500/5';
    case 'health':
    case 'healthcare': return 'border-emerald-500/20 bg-emerald-500/5';
    case 'housing': return 'border-indigo-500/20 bg-indigo-500/5';
    case 'utilities': return 'border-yellow-500/20 bg-yellow-500/5';
    case 'entertainment': return 'border-pink-500/20 bg-pink-500/5';
    default: return 'border-border/50 bg-card';
  }
};

export default async function BudgetsPage() {
  const session = await auth();
  if (!session?.user) {
    redirect("/");
  }
  
  const userCurrency = session.user.currency || "PKR";

  const currentDate = new Date();
  // Format as YYYY-MM
  const currentMonth = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}`;

  const [{ budgets }, { transactions }, customCategories] = await Promise.all([
    getBudgets(currentMonth),
    getTransactions(),
    getCustomCategories()
  ]);

  // Filter expenses for current month
  const expensesThisMonth = (transactions || []).filter(t => {
    return t.type === 'expense' && t.date.startsWith(currentMonth);
  });

  // Calculate spent per category
  const spentByCategory = expensesThisMonth.reduce((acc, curr) => {
    acc[curr.category] = (acc[curr.category] || 0) + curr.amount;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="max-w-5xl mx-auto p-4 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">Monthly Budgeting</h1>
        <p className="text-muted-foreground">
          Set limits for your spending categories and track them throughout {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}.
        </p>
      </div>

      <section>
        <h2 className="text-xl font-semibold mb-4">Set a New Budget</h2>
        <SetBudgetForm month={currentMonth} customCategories={customCategories} />
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-4">Your Budgets</h2>
        <BudgetSummaryChart budgets={budgets || []} spentByCategory={spentByCategory} userCurrency={userCurrency} />
        
        {!budgets || budgets.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-slate-500 dark:text-slate-400 border border-dashed rounded-lg bg-slate-50/50 dark:bg-slate-900/50 w-full mt-4">
            <PiggyBank className="h-12 w-12 mb-4 opacity-50" />
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">No budgets set yet</h3>
            <p className="text-sm mt-1">Set a new budget for this month to start tracking your spending.</p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {budgets.map((budget) => {
              const spent = spentByCategory[budget.category] || 0;
              const percentage = Math.min((spent / budget.amount) * 100, 100);
              const isOverBudget = spent > budget.amount;
              const isNearLimit = percentage >= 85;

              return (
                <Card key={budget.id} className={`overflow-hidden transition-all border ${isOverBudget ? 'border-destructive bg-destructive/5' : getCategoryColorClass(budget.category)}`}>
                  <CardHeader className="pb-2 flex flex-row items-center gap-4">
                    <CategoryIcon category={budget.category} customCategories={customCategories} className="h-12 w-12 flex-shrink-0" iconClassName="h-6 w-6" />
                    <div className="flex-1">
                      <CardTitle className="text-xl capitalize mb-1">{budget.category}</CardTitle>
                      <CardDescription className="flex justify-between items-center text-sm">
                        <span>{percentage.toFixed(1)}% used</span>
                        <span className={`font-semibold ${isOverBudget ? 'text-destructive' : 'text-foreground'}`}>
                          {isOverBudget ? 'Over Budget' : 'On Track'}
                        </span>
                      </CardDescription>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-2">
                    <div className="space-y-4">
                      <div className="relative pt-1">
                        <div className="flex mb-2 items-center justify-between">
                          <div>
                            <span className="text-xs font-semibold inline-block text-muted-foreground uppercase">
                              Spent
                            </span>
                            <div className="text-sm font-bold text-foreground">{formatCurrency(spent, userCurrency)}</div>
                          </div>
                          <div className="text-right">
                            <span className="text-xs font-semibold inline-block text-muted-foreground uppercase">
                              {isOverBudget ? 'Over By' : 'Remaining'}
                            </span>
                            <div className={`text-sm font-bold ${isOverBudget ? 'text-destructive' : 'text-foreground'}`}>
                              {formatCurrency(Math.abs(budget.amount - spent), userCurrency)}
                            </div>
                          </div>
                        </div>
                        <Progress 
                          value={percentage} 
                          className={`h-3 ${isOverBudget ? 'bg-destructive/20' : 'bg-muted/50'}`}
                          indicatorClassName={isOverBudget ? 'bg-destructive' : (isNearLimit ? 'bg-amber-500' : 'bg-primary')}
                        />
                        <div className="flex justify-between items-center mt-2 text-xs text-muted-foreground font-medium">
                          <span>$0</span>
                          <span>Budget: {formatCurrency(budget.amount, userCurrency)}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
