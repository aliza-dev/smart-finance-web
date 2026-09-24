"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Category } from "@/types";
import { setBudget } from "@/app/actions/budget";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { CustomCategoryData } from "@/components/CategoryIcon";

const CATEGORIES: Category[] = ["food", "housing", "utilities", "transport", "entertainment", "salary", "other"];

export function SetBudgetForm({ month, customCategories = [] }: { month: string, customCategories?: CustomCategoryData[] }) {
  const allCategories = [...CATEGORIES, ...customCategories.map(c => c.name as Category)];
  const [category, setCategory] = useState<Category>("food");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    setLoading(true);
    const { error } = await setBudget(category, Number(amount), month);
    setLoading(false);

    if (error) {
      toast.error(error);
    } else {
      toast.success("Budget set successfully!");
      setAmount("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 items-end bg-card p-4 rounded-xl border shadow-sm">
      <div className="w-full sm:w-1/3">
        <label className="text-sm font-medium mb-1.5 block text-muted-foreground">Category</label>
        <Select value={category} onValueChange={(val) => setCategory(val as Category)}>
          <SelectTrigger>
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            {allCategories.map((c) => (
              <SelectItem key={c} value={c} className="capitalize">
                {c}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="w-full sm:w-1/3">
        <label className="text-sm font-medium mb-1.5 block text-muted-foreground">Amount (Rs)</label>
        <Input 
          type="number" 
          placeholder="e.g. 5000" 
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
      </div>

      <Button type="submit" disabled={loading} className="w-full sm:w-1/3 h-10">
        {loading ? <Loader2 className="animate-spin mr-2" size={16} /> : null}
        Set Budget
      </Button>
    </form>
  );
}
