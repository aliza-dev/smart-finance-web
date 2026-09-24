"use client";

import { useState, useRef } from "react";
import { useExpenseContext } from "@/context/ExpenseContext";
import { Category, TransactionType } from "@/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

import { ArrowUpCircle, ArrowDownCircle, Trash2, Wallet, Activity, Camera, Loader2, Delete, ArrowRightLeft } from "lucide-react";
import { toast } from "sonner";
import { scanReceipt } from "@/app/actions/scanner";
import { SmartAdd } from "@/components/SmartAdd";
import { CategoryIcon } from "@/components/CategoryIcon";
import { AnalyticsChart } from "@/components/AnalyticsChart";
import { UpcomingSubscriptions } from "@/components/UpcomingSubscriptions";

import { formatCurrency } from "@/lib/currency";
import { useSession } from "next-auth/react";

const formatDate = (dateString: string) => {
  try {
    const parts = dateString.split('T')[0].split('-');
    const localDate = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
    
    return new Intl.DateTimeFormat('en-GB', { 
      day: '2-digit', 
      month: 'short', 
      year: 'numeric' 
    }).format(localDate);
  } catch {
    return dateString;
  }
};

export default function Home() {
  const { data: session } = useSession();
  const userCurrency = session?.user?.currency || "PKR";

  const { transactions, addTransaction, deleteTransaction, totalIncome, totalExpenses, balance, customCategories } = useExpenseContext();

  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState<TransactionType>("expense");
  const [category, setCategory] = useState<Category>("food");
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isScanning, setIsScanning] = useState(false);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsScanning(true);
    toast.info("Scanning receipt...", { duration: 3000 });

    try {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64String = (reader.result as string).split(',')[1];
        const res = await scanReceipt(base64String, file.type);
        if (res.data) {
          toast.success("Receipt scanned successfully!");
          if (res.data.amount) setAmount(String(res.data.amount));
          if (res.data.description) setDescription(res.data.description);
          if (res.data.category && allCategories.includes(res.data.category.toLowerCase() as Category)) {
            setCategory(res.data.category.toLowerCase() as Category);
          }
          setType("expense");
        } else {
          toast.error(res.error || "Failed to scan receipt.");
        }
        setIsScanning(false);
      };
      reader.readAsDataURL(file);
    } catch {
      toast.error("Error processing image.");
      setIsScanning(false);
    }
  };
  
  const defaultCategories: Category[] = ["food", "housing", "utilities", "transport", "entertainment", "salary", "other"];
  const allCategories = [...defaultCategories, ...customCategories.map(c => c.name as Category)];
  
  const recentTransactions = transactions.slice(0, 5);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description || !amount) {
      toast.error("Please provide both a description and an amount.");
      return;
    }

    await addTransaction({
      description,
      amount: Number(amount),
      type,
      category,
      spendType: "UNCATEGORIZED", // Default manual entry to uncategorized
    });

    setDescription("");
    setAmount("");
    setType("expense");
    setCategory("food");
  };

  const handleNumpadClick = (val: string) => {
    if (val === "back") {
      setAmount(prev => prev.slice(0, -1));
    } else if (val === ".") {
      if (!amount.includes(".")) {
        setAmount(prev => prev ? prev + "." : "0.");
      }
    } else {
      // Prevent leading zeros unless followed by dot
      if (amount === "0") {
        setAmount(val);
      } else {
        // limit to 2 decimal places
        const parts = amount.split(".");
        if (parts[1] && parts[1].length >= 2) return;
        setAmount(prev => prev + val);
      }
    }
  };

  return (
    <div className="min-h-screen font-sans p-4 md:p-8">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Header section */}
        <header className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground mt-1 text-lg">Manage your finances efficiently.</p>
          </div>
          <div className="p-3 bg-blue-100 text-blue-700 rounded-full">
            <Activity className="h-6 w-6" />
          </div>
        </header>

        {/* Summary Cards */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-card border-border/50 shadow-sm transition-all hover:shadow-md">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Income</CardTitle>
              <ArrowUpCircle className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600 dark:text-emerald-400" suppressHydrationWarning>{formatCurrency(totalIncome, userCurrency)}</div>
            </CardContent>
          </Card>
          <Card className="bg-card border-none shadow-sm transition-all hover:shadow-md">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Expenses</CardTitle>
              <ArrowDownCircle className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600 dark:text-rose-400" suppressHydrationWarning>{formatCurrency(Math.abs(totalExpenses), userCurrency)}</div>
            </CardContent>
          </Card>
          <Card className="bg-card border-none shadow-sm transition-all hover:shadow-md">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Net Balance</CardTitle>
              <Wallet className="h-4 w-4 text-slate-500" />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${balance >= 0 ? "text-slate-900 dark:text-slate-100" : "text-red-600 dark:text-rose-400"}`} suppressHydrationWarning>
                {formatCurrency(balance, userCurrency)}
              </div>
            </CardContent>
          </Card>
          <UpcomingSubscriptions />
        </section>

        {/* Analytics Section */}
        <section className="grid grid-cols-1 gap-6">
          <Card className="bg-card border-none shadow-sm transition-all hover:shadow-md">
            <CardHeader>
              <CardTitle>Expense Analytics</CardTitle>
              <CardDescription>Visualizing where your money goes.</CardDescription>
            </CardHeader>
            <CardContent>
              <AnalyticsChart transactions={transactions} />
            </CardContent>
          </Card>
        </section>

        {/* Smart Add AI Section */}
        <SmartAdd />

        {/* Main Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Add Transaction Form - Left Col */}
          <Card className="lg:col-span-1 h-fit bg-card border-none shadow-sm transition-all hover:shadow-md">
            <CardHeader className="flex flex-row items-start justify-between pb-4">
              <div>
                <CardTitle>Manual Entry</CardTitle>
                <CardDescription>Record a new income or expense.</CardDescription>
              </div>
              <div>
                <input 
                  type="file" 
                  accept="image/*" 
                  className="hidden" 
                  ref={fileInputRef} 
                  onChange={handleFileUpload} 
                />
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="h-8 gap-1"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isScanning}
                >
                  {isScanning ? <Loader2 className="h-4 w-4 animate-spin" /> : <Camera className="h-4 w-4" />}
                  <span className="hidden sm:inline">{isScanning ? "Scanning..." : "Scan Receipt"}</span>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2 pb-1">
                  <div className="flex p-1 bg-slate-100 dark:bg-slate-900 rounded-full">
                    <button
                      type="button"
                      onClick={() => setType('income')}
                      className={`flex-1 flex items-center justify-center gap-1.5 py-1 rounded-full text-xs font-medium transition-all ${type === 'income' ? 'bg-white dark:bg-slate-800 shadow-sm text-green-600 dark:text-emerald-400' : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-100'}`}
                    >
                      <ArrowDownCircle className="h-4 w-4" /> Income
                    </button>
                    <button
                      type="button"
                      onClick={() => setType('expense')}
                      className={`flex-1 flex items-center justify-center gap-1.5 py-1 rounded-full text-xs font-medium transition-all ${type === 'expense' ? 'bg-white dark:bg-slate-800 shadow-sm text-red-600 dark:text-rose-400' : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-100'}`}
                    >
                      <ArrowUpCircle className="h-4 w-4" /> Expense
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setType('expense');
                        toast.info("Transfer is recorded as an expense for now.");
                      }}
                      className="flex-1 flex items-center justify-center gap-1.5 py-1 rounded-full text-xs font-medium transition-all text-slate-500 hover:text-slate-900 dark:hover:text-slate-100"
                    >
                      <ArrowRightLeft className="h-4 w-4" /> Transfer
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Input 
                    id="description" 
                    placeholder="e.g., Grocery Shopping" 
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>
                
                <div className="space-y-3">
                  <div className="space-y-1.5">
                    <Label className="text-xs">Amount</Label>
                    <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border flex items-center justify-between text-xl font-bold tracking-wider">
                      <span className="text-muted-foreground text-sm">Rs</span>
                      <span>{amount || "0.00"}</span>
                    </div>
                  </div>
                  
                  {/* Numpad */}
                  <div className="grid grid-cols-3 gap-1.5">
                    {["1", "2", "3", "4", "5", "6", "7", "8", "9", ".", "0"].map(num => (
                      <Button
                        key={num}
                        type="button"
                        variant="outline"
                        className="h-8 text-base font-medium bg-card hover:bg-muted"
                        onClick={() => handleNumpadClick(num)}
                      >
                        {num}
                      </Button>
                    ))}
                    <Button
                      type="button"
                      variant="outline"
                      className="h-8 text-base font-medium bg-card hover:bg-muted text-destructive"
                      onClick={() => handleNumpadClick("back")}
                    >
                      <Delete className="h-5 w-5" />
                    </Button>
                  </div>
                </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs">Category</Label>
                    <div className="grid grid-cols-4 gap-1.5">
                      {allCategories.map(cat => (
                        <button
                          key={cat}
                          type="button"
                          onClick={() => setCategory(cat as Category)}
                          className={`flex flex-col items-center justify-center p-1.5 rounded-xl border transition-all ${category === cat ? 'border-primary bg-primary/5 ring-1 ring-primary' : 'border-border/50 hover:bg-muted'}`}
                        >
                          <CategoryIcon category={cat} customCategories={customCategories} />
                          <span className="text-[10px] capitalize mt-1 text-muted-foreground">{cat}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                <Button type="submit" className="w-full mt-2">Save Transaction</Button>
              </form>
            </CardContent>
          </Card>

          {/* Transactions List - Right Col */}
          <Card className="lg:col-span-2 overflow-hidden bg-card border-none shadow-sm transition-all hover:shadow-md">
            <CardHeader className="flex flex-row items-center justify-between pb-4">
              <div>
                <CardTitle>Recent Transactions</CardTitle>
                <CardDescription>View and manage your recent activity.</CardDescription>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center mb-4">
                <p className="text-sm text-muted-foreground">Showing latest 5 transactions</p>
                <a href="/transactions" className={buttonVariants({ variant: "outline" })}>View All</a>
              </div>

              {/* Data Table */}
              <div className="rounded-md border w-full overflow-x-auto">
                <Table className="min-w-[600px] whitespace-nowrap">
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                      <TableHead className="w-[80px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentTransactions.map(t => (
                      <TableRow key={t.id}>
                        <TableCell className="text-muted-foreground">{formatDate(t.date)}</TableCell>
                        <TableCell className="font-medium">{t.description}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <CategoryIcon category={t.category} customCategories={customCategories} />
                            <div className="flex flex-col">
                              <span className="capitalize">{t.category}</span>
                              {t.spendType && t.spendType !== "UNCATEGORIZED" && (
                                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full mt-1 w-fit ${
                                  t.spendType === 'NEED' ? 'bg-orange-100 text-orange-600 dark:bg-orange-500/20 dark:text-orange-400' :
                                  t.spendType === 'WANT' ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400' :
                                  'bg-blue-100 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400'
                                }`}>
                                  {t.spendType}
                                </span>
                              )}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className={`text-right font-semibold ${t.type === 'income' ? 'text-green-600 dark:text-emerald-400' : 'text-red-600 dark:text-rose-400'}`} suppressHydrationWarning>
                          {t.type === 'income' ? '+' : ''}{formatCurrency(Number(t.amount), userCurrency)}
                        </TableCell>
                        <TableCell>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => deleteTransaction(t.id)}
                            className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only">Delete</span>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                    {recentTransactions.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={5} className="h-48 text-center">
                          <div className="flex flex-col items-center justify-center text-muted-foreground">
                            <Wallet className="h-10 w-10 mb-4 opacity-50" />
                            <p className="text-lg font-medium">No transactions found</p>
                            <p className="text-sm">Try adjusting your filters or add a new transaction above.</p>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

        </div>
      </div>
    </div>
  );
}
