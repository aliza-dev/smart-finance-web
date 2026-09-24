"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createGoal, addFundsToGoal, deleteGoal } from "@/app/actions/goals";
import { toast } from "sonner";
import { formatCurrency } from "@/lib/currency";
import { useSession } from "next-auth/react";
import { Target, PlusCircle, Trash2, Calendar } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { CircularProgress } from "@/components/CircularProgress";
import { CategoryIcon } from "@/components/CategoryIcon";
import { differenceInDays } from "date-fns";

interface SavingsGoal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string | null;
  createdAt: Date;
}

export function GoalsClient({ initialGoals }: { initialGoals: SavingsGoal[] }) {
  const { data: session } = useSession();
  const userCurrency = session?.user?.currency || "PKR";

  const [goals, setGoals] = useState(initialGoals);
  const [loading, setLoading] = useState(false);

  // New Goal State
  const [name, setName] = useState("");
  const [targetAmount, setTargetAmount] = useState("");
  const [currentAmount, setCurrentAmount] = useState("");
  const [deadline, setDeadline] = useState("");

  const templates = [
    { name: "Vehicle", icon: "transport" },
    { name: "Home", icon: "housing" },
    { name: "Trip", icon: "entertainment" },
    { name: "Emergency Fund", icon: "health" },
  ];

  const handleTemplateClick = (tName: string) => {
    setName(tName);
  };

  // Add Funds State
  const [activeGoalId, setActiveGoalId] = useState<string | null>(null);
  const [fundAmount, setFundAmount] = useState("");
  const [fundDialogOpen, setFundDialogOpen] = useState(false);

  const handleAddGoal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !targetAmount) return;

    setLoading(true);
    try {
      const result = await createGoal({
        name,
        targetAmount: parseFloat(targetAmount),
        currentAmount: currentAmount ? parseFloat(currentAmount) : 0,
        deadline: deadline ? new Date(deadline) : undefined,
      });

      if (result.success && result.goal) {
        setGoals([result.goal as SavingsGoal, ...goals]);
        setName("");
        setTargetAmount("");
        setCurrentAmount("");
        setDeadline("");
        toast.success("Goal created successfully!");
      }
    } catch (error: Error | unknown) {
      toast.error((error as Error).message || "Failed to create goal");
    } finally {
      setLoading(false);
    }
  };

  const handleAddFunds = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeGoalId || !fundAmount) return;

    setLoading(true);
    try {
      const result = await addFundsToGoal(activeGoalId, parseFloat(fundAmount));

      if (result.success && result.goal) {
        setGoals(goals.map((g) => (g.id === activeGoalId ? (result.goal as SavingsGoal) : g)));
        setFundAmount("");
        setFundDialogOpen(false);
        setActiveGoalId(null);
        toast.success("Funds added successfully!");
      }
    } catch (error: Error | unknown) {
      toast.error((error as Error).message || "Failed to add funds");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const result = await deleteGoal(id);
      if (result.success) {
        setGoals(goals.filter((g) => g.id !== id));
        toast.success("Goal deleted successfully!");
      }
    } catch (error: Error | unknown) {
      toast.error((error as Error).message || "Failed to delete goal");
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-6">
        <div className="grid gap-4 md:grid-cols-2">
          {goals.map((goal) => {
            const percentage = Math.min(100, Math.round((goal.currentAmount / goal.targetAmount) * 100));
            return (
              <Card key={goal.id} className="relative overflow-hidden group border-slate-200 dark:border-white/10 shadow-sm transition-all hover:shadow-md">
                <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive" onClick={() => handleDelete(goal.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Target className="h-5 w-5 text-primary" />
                    {goal.name}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center mt-2">
                    <div className="flex-1 space-y-3">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Saved vs Goal</p>
                        <p className="text-lg font-bold">
                          <span className="text-primary">{formatCurrency(goal.currentAmount, userCurrency)}</span>
                          <span className="text-muted-foreground text-sm font-medium ml-1">
                            / {formatCurrency(goal.targetAmount, userCurrency)}
                          </span>
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Remaining to save: <span className="font-medium text-foreground">{formatCurrency(Math.max(0, goal.targetAmount - goal.currentAmount), userCurrency)}</span>
                        </p>
                      </div>
                      
                      {goal.deadline && (
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Remaining Days</p>
                          <p className="text-base font-semibold">
                            {Math.max(0, differenceInDays(new Date(goal.deadline), new Date()))} days
                          </p>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex-shrink-0">
                      <CircularProgress value={percentage} color="var(--primary)" size={80} strokeWidth={8} />
                    </div>
                  </div>
                  
                  {goal.deadline && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground pt-2 border-t mt-4">
                      <Calendar className="h-4 w-4" />
                      <span>Start: {new Date(goal.createdAt).toLocaleDateString()} &mdash; Target: {new Date(goal.deadline).toLocaleDateString()}</span>
                    </div>
                  )}
                </CardContent>
                <CardFooter className="pt-2">
                  <Dialog open={fundDialogOpen && activeGoalId === goal.id} onOpenChange={(open) => {
                    setFundDialogOpen(open);
                    if (open) setActiveGoalId(goal.id);
                    else setActiveGoalId(null);
                  }}>
                    <DialogTrigger render={<Button variant="outline" className="w-full gap-2" />}>
                        <PlusCircle className="h-4 w-4" /> Add Funds
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Add Funds to {goal.name}</DialogTitle>
                        <DialogDescription>
                          How much would you like to contribute to this goal?
                        </DialogDescription>
                      </DialogHeader>
                      <form onSubmit={handleAddFunds} className="space-y-4 pt-4">
                        <div className="space-y-2">
                          <Label htmlFor="fundAmount">Amount</Label>
                          <Input
                            id="fundAmount"
                            type="number"
                            step="0.01"
                            min="0.01"
                            placeholder="0.00"
                            value={fundAmount}
                            onChange={(e) => setFundAmount(e.target.value)}
                            required
                          />
                        </div>
                        <DialogFooter>
                          <Button type="submit" disabled={loading || !fundAmount}>
                            {loading ? "Adding..." : "Add Funds"}
                          </Button>
                        </DialogFooter>
                      </form>
                    </DialogContent>
                  </Dialog>
                </CardFooter>
              </Card>
            );
          })}
          
          {goals.length === 0 && (
             <div className="col-span-1 md:col-span-2 flex flex-col items-center justify-center h-64 text-slate-500 dark:text-slate-400 border border-dashed rounded-lg bg-slate-50/50 dark:bg-slate-900/50">
               <Target className="h-12 w-12 mb-4 opacity-50" />
               <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">No goals yet</h3>
               <p className="text-sm mt-1">Create your first savings goal to get started!</p>
             </div>
          )}
        </div>
      </div>

      <div className="lg:col-span-1 space-y-6">
        <Card className="sticky top-6">
          <CardHeader>
            <CardTitle>Create Goal</CardTitle>
            <CardDescription>
              Set a new financial target.
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleAddGoal}>
            <CardContent className="space-y-4">
              <div className="space-y-3 pb-2">
                <Label>Templates</Label>
                <div className="grid grid-cols-2 gap-2">
                  {templates.map(t => (
                    <div 
                      key={t.name}
                      onClick={() => handleTemplateClick(t.name)}
                      className={`flex flex-col items-center justify-center p-3 rounded-xl border cursor-pointer transition-all hover:border-primary/50 hover:bg-primary/5 ${name === t.name ? 'border-primary bg-primary/10' : 'border-border/50 bg-card'}`}
                    >
                      <CategoryIcon category={t.icon} className="mb-2" />
                      <span className="text-xs font-medium text-center">{t.name}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="name">Goal Name</Label>
                <Input
                  id="name"
                  placeholder="e.g., New Laptop, Vacation"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="targetAmount">Target Amount</Label>
                <Input
                  id="targetAmount"
                  type="number"
                  step="0.01"
                  min="1"
                  placeholder="0.00"
                  value={targetAmount}
                  onChange={(e) => setTargetAmount(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="currentAmount">Starting Balance (Optional)</Label>
                <Input
                  id="currentAmount"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  value={currentAmount}
                  onChange={(e) => setCurrentAmount(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="deadline">Target Date (Optional)</Label>
                <Input
                  id="deadline"
                  type="date"
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" className="w-full" disabled={loading || !name || !targetAmount}>
                {loading ? "Creating..." : "Create Goal"}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}
