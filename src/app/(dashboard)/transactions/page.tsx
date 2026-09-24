"use client";

import { useState } from "react";
import { useExpenseContext } from "@/context/ExpenseContext";
import { Category, TransactionType, Transaction } from "@/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Trash2, Download, FileText, Pencil, Wallet } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { CategoryIcon } from "@/components/CategoryIcon";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { formatCurrency } from "@/lib/currency";
import { useSession } from "next-auth/react";
import { TransactionsTrendChart } from "@/components/TransactionsTrendChart";

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

export default function TransactionsPage() {
  const { data: session } = useSession();
  const userCurrency = session?.user?.currency || "PKR";

  const { transactions, updateTransaction, deleteTransaction, customCategories } = useExpenseContext();

  const [filterType, setFilterType] = useState<TransactionType | "all">("all");
  const [filterCategory, setFilterCategory] = useState<Category | "all">("all");
  const [sortConfig, setSortConfig] = useState<{ key: keyof Transaction; direction: 'asc' | 'desc' } | null>(null);

  // Edit State
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [editDescription, setEditDescription] = useState("");
  const [editAmount, setEditAmount] = useState("");
  const [editType, setEditType] = useState<TransactionType>("expense");
  const [editCategory, setEditCategory] = useState<Category>("food");
  const [editSpendType, setEditSpendType] = useState<"NEED" | "WANT" | "SAVING" | "UNCATEGORIZED">("UNCATEGORIZED");
  const [editDate, setEditDate] = useState("");

  const defaultCategories: Category[] = ["food", "housing", "utilities", "transport", "entertainment", "salary", "other"];
  const allCategories = [...defaultCategories, ...customCategories.map(c => c.name as Category)];

  let processedTransactions = [...transactions];
  
  if (filterType !== "all") {
    processedTransactions = processedTransactions.filter(t => t.type === filterType);
  }
  if (filterCategory !== "all") {
    processedTransactions = processedTransactions.filter(t => t.category === filterCategory);
  }

  if (sortConfig !== null) {
    processedTransactions.sort((a, b) => {
      const aVal = a[sortConfig.key] as string | number;
      const bVal = b[sortConfig.key] as string | number;
      if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
  }

  const handleSort = (key: keyof Transaction) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') direction = 'desc';
    setSortConfig({ key, direction });
  };

  const openEdit = (t: Transaction) => {
    setEditingTransaction(t);
    setEditDescription(t.description);
    setEditAmount(String(t.amount));
    setEditType(t.type);
    setEditCategory(t.category);
    setEditSpendType(t.spendType || "UNCATEGORIZED");
    setEditDate(t.date);
  };

  const handleUpdate = async () => {
    if (!editingTransaction) return;
    await updateTransaction(String(editingTransaction.id), {
      description: editDescription,
      amount: Number(editAmount),
      type: editType,
      category: editCategory,
      spendType: editSpendType,
      date: editDate
    });
    setEditingTransaction(null);
  };

  const downloadCSV = () => {
    const headers = ["Date", "Description", "Category", "Type", "Amount"];
    const rows = processedTransactions.map(t => [
      t.date,
      t.description,
      t.category,
      t.type,
      t.amount
    ]);
    const csvContent = [
      headers.join(","),
      ...rows.map(r => r.join(","))
    ].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "transactions.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const downloadPDF = () => {
    const doc = new jsPDF();
    
    // Calculate totals
    const totalIncome = processedTransactions.filter(t => t.type === 'income').reduce((sum, t) => sum + Number(t.amount), 0);
    const totalExpenses = processedTransactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + Number(t.amount), 0);
    const netBalance = totalIncome - totalExpenses;

    // Header
    doc.setFontSize(20);
    doc.setTextColor(15, 23, 42); // slate-900
    doc.text("Official Financial Statement", 14, 22);
    
    doc.setFontSize(10);
    doc.setTextColor(100, 116, 139); // slate-500
    doc.text(`Generated on: ${formatDate(new Date().toISOString())}`, 14, 30);
    
    autoTable(doc, {
      startY: 38,
      head: [["Date", "Description", "Category", "Type", "Amount"]],
      body: processedTransactions.map(t => [
        formatDate(t.date),
        t.description,
        t.category.charAt(0).toUpperCase() + t.category.slice(1),
        t.type.charAt(0).toUpperCase() + t.type.slice(1),
        t.type === 'income' ? `+${formatCurrency(t.amount, userCurrency)}` : formatCurrency(t.amount, userCurrency)
      ]),
      theme: 'grid',
      headStyles: {
        fillColor: [15, 23, 42], // slate-900
        textColor: 255,
        fontSize: 10,
        fontStyle: 'bold',
        halign: 'left',
      },
      bodyStyles: {
        textColor: [51, 65, 85], // slate-700
        fontSize: 9,
      },
      alternateRowStyles: {
        fillColor: [248, 250, 252], // slate-50
      },
      columnStyles: {
        4: { halign: 'right', fontStyle: 'bold' } // Amount column right aligned
      }
    });

    // Summary block
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const finalY = (doc as any).lastAutoTable.finalY + 10;
    
    doc.setFontSize(14);
    doc.setTextColor(15, 23, 42);
    doc.text("Financial Summary", 14, finalY);
    
    doc.setFontSize(11);
    doc.setTextColor(51, 65, 85);
    
    doc.text(`Total Income:`, 14, finalY + 10);
    doc.setTextColor(22, 163, 74); // green-600
    doc.text(`+${formatCurrency(totalIncome, userCurrency)}`, 50, finalY + 10);
    
    doc.setTextColor(51, 65, 85);
    doc.text(`Total Expenses:`, 14, finalY + 18);
    doc.setTextColor(220, 38, 38); // red-600
    doc.text(`${formatCurrency(totalExpenses, userCurrency)}`, 50, finalY + 18);
    
    doc.setTextColor(15, 23, 42);
    doc.setFont("helvetica", "bold");
    doc.text(`Net Balance:`, 14, finalY + 28);
    
    if (netBalance >= 0) {
      doc.setTextColor(22, 163, 74);
    } else {
      doc.setTextColor(220, 38, 38);
    }
    doc.text(`${formatCurrency(netBalance, userCurrency)}`, 50, finalY + 28);

    // Footer with page number
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const pageCount = (doc as any).internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(9);
      doc.setTextColor(148, 163, 184); // slate-400
      doc.setFont("helvetica", "normal");
      doc.text(`Page ${i} of ${pageCount}`, doc.internal.pageSize.width / 2, doc.internal.pageSize.height - 10, { align: 'center' });
    }

    doc.save("financial-statement.pdf");
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-background text-slate-900 dark:text-foreground font-sans p-4 md:p-8">
      <div className="max-w-5xl mx-auto space-y-8">
        <header>
          <h1 className="text-4xl font-bold tracking-tight">Transactions</h1>
          <p className="text-muted-foreground mt-1 text-lg">Manage all your financial records here.</p>
        </header>

        {processedTransactions.length > 0 && (
          <TransactionsTrendChart transactions={processedTransactions} userCurrency={userCurrency} />
        )}

        <Card>
          <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-4 gap-4">
            <div>
              <CardTitle>All Transactions</CardTitle>
              <CardDescription>View, filter, edit, and export your activity.</CardDescription>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={downloadCSV}>
                <Download className="mr-2 h-4 w-4" /> CSV
              </Button>
              <Button variant="outline" onClick={downloadPDF}>
                <FileText className="mr-2 h-4 w-4" /> PDF
              </Button>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4 mb-4">
              <Select value={filterType} onValueChange={(val) => setFilterType(val as TransactionType | "all")}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Filter by Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="expense">Expense</SelectItem>
                  <SelectItem value="income">Income</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filterCategory} onValueChange={(val) => setFilterCategory(val as Category | "all")}>
                <SelectTrigger className="w-full sm:w-[180px] capitalize">
                  <SelectValue placeholder="Filter by Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {allCategories.map(cat => (
                    <SelectItem key={cat} value={cat} className="capitalize">{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {processedTransactions.length > 0 ? (
              <div className="rounded-md border w-full overflow-x-auto">
                <Table className="min-w-[600px] whitespace-nowrap">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="cursor-pointer hover:bg-muted/50" onClick={() => handleSort('date')}>
                        Date {sortConfig?.key === 'date' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                      </TableHead>
                      <TableHead className="cursor-pointer hover:bg-muted/50" onClick={() => handleSort('description')}>
                        Description {sortConfig?.key === 'description' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                      </TableHead>
                      <TableHead className="cursor-pointer hover:bg-muted/50" onClick={() => handleSort('category')}>
                        Category {sortConfig?.key === 'category' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                      </TableHead>
                      <TableHead className="text-right cursor-pointer hover:bg-muted/50" onClick={() => handleSort('amount')}>
                        Amount {sortConfig?.key === 'amount' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                      </TableHead>
                      <TableHead className="text-center">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {processedTransactions.map(t => (
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
                          {t.type === 'income' ? '+' : ''}{formatCurrency(t.amount, userCurrency)}
                        </TableCell>
                        <TableCell className="text-center">
                          <Button variant="ghost" size="icon" onClick={() => openEdit(t)} className="h-8 w-8 text-blue-500 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-950">
                            <Pencil className="h-4 w-4" />
                            <span className="sr-only">Edit</span>
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => deleteTransaction(t.id)} className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950">
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only">Delete</span>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-64 text-slate-500 dark:text-slate-400 border border-dashed rounded-lg bg-slate-50/50 dark:bg-slate-900/50">
                <Wallet className="h-12 w-12 mb-4 opacity-50" />
                <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">No transactions yet</h3>
                <p className="text-sm mt-1">Add your first expense or income to get started!</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Edit Dialog */}
        <Dialog open={!!editingTransaction} onOpenChange={(open) => !open && setEditingTransaction(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Transaction</DialogTitle>
              <DialogDescription>Update the details of your transaction below.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Description</Label>
                <Input value={editDescription} onChange={(e) => setEditDescription(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Amount</Label>
                <Input type="number" value={editAmount} onChange={(e) => setEditAmount(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Date</Label>
                <Input type="date" value={editDate} onChange={(e) => setEditDate(e.target.value)} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Type</Label>
                  <Select value={editType} onValueChange={(val) => setEditType(val as TransactionType)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="expense">Expense</SelectItem>
                      <SelectItem value="income">Income</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Category</Label>
                  <Select value={editCategory} onValueChange={(val) => setEditCategory(val as Category)}>
                    <SelectTrigger className="capitalize"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {allCategories.map(cat => (
                        <SelectItem key={cat} value={cat} className="capitalize">{cat}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Spend Type</Label>
                <Select value={editSpendType} onValueChange={(val) => setEditSpendType(val as "NEED" | "WANT" | "SAVING" | "UNCATEGORIZED")}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="UNCATEGORIZED">Uncategorized</SelectItem>
                    <SelectItem value="NEED">Need</SelectItem>
                    <SelectItem value="WANT">Want</SelectItem>
                    <SelectItem value="SAVING">Saving</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setEditingTransaction(null)}>Cancel</Button>
              <Button onClick={handleUpdate}>Save Changes</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

      </div>
    </div>
  );
}
