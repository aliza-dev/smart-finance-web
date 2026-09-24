"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { exportUserData, resetAccountTransactions, wipeAllAccountData, updateUserCurrency } from "@/app/actions/settings";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { formatCurrency } from "@/lib/currency";
import { useSession } from "next-auth/react";

export function ExportDataButton({ userName, userEmail }: { userName: string; userEmail: string }) {
  const { data: session } = useSession();
  const userCurrency = session?.user?.currency || "PKR";
  const [loading, setLoading] = useState(false);

  const handleExport = async () => {
    setLoading(true);
    toast.info("Generating PDF...", { id: "pdf-toast" });
    try {
      const { transactions, budgets } = await exportUserData();
      
      const doc = new jsPDF();
      
      // Document dimensions
      const pageWidth = doc.internal.pageSize.width;
      
      // Premium Header
      doc.setFillColor(15, 23, 42); // dark slate
      doc.rect(0, 0, pageWidth, 40, 'F');
      
      doc.setFontSize(24);
      doc.setTextColor(255, 255, 255);
      doc.text("Financial Summary Report", 14, 22);
      
      doc.setFontSize(11);
      doc.setTextColor(200, 210, 220);
      doc.text(`Generated for: ${userName} (${userEmail})`, 14, 32);
      doc.text(`Date: ${new Date().toLocaleDateString()}`, pageWidth - 14, 32, { align: 'right' });
      
      // Calculate Totals
      let totalIncome = 0;
      let totalExpense = 0;
      transactions.forEach(t => {
        if (t.type === 'income') totalIncome += t.amount;
        else totalExpense += t.amount;
      });
      const netBalance = totalIncome - totalExpense;

      // Summary Block
      doc.setFontSize(16);
      doc.setTextColor(15, 23, 42);
      doc.text("Financial Summary", 14, 52);

      autoTable(doc, {
        startY: 56,
        head: [['Total Income', 'Total Expenses', 'Net Balance']],
        body: [[
          formatCurrency(totalIncome, userCurrency), 
          formatCurrency(totalExpense, userCurrency), 
          formatCurrency(netBalance, userCurrency)
        ]],
        theme: 'grid',
        headStyles: { fillColor: [15, 23, 42], textColor: [255, 255, 255], fontStyle: 'bold', halign: 'center' },
        bodyStyles: { fontSize: 12, halign: 'center', fontStyle: 'bold' },
        didParseCell: function(data) {
          if (data.section === 'body') {
            if (data.column.index === 0) data.cell.styles.textColor = [22, 163, 74]; // Green
            if (data.column.index === 1) data.cell.styles.textColor = [220, 38, 38]; // Red
            if (data.column.index === 2) {
              data.cell.styles.textColor = netBalance >= 0 ? [22, 163, 74] : [220, 38, 38];
            }
          }
        }
      });
      
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let finalY = (doc as any).lastAutoTable.finalY || 70;

      // Budgets Table
      if (budgets.length > 0) {
        doc.setFontSize(14);
        doc.setTextColor(15, 23, 42);
        doc.text("Active Budgets", 14, finalY + 12);
        
        autoTable(doc, {
          startY: finalY + 16,
          head: [['Category', 'Month', 'Amount']],
          body: budgets.map(b => [b.category, b.month, formatCurrency(b.amount, userCurrency)]),
          theme: 'striped',
          headStyles: { fillColor: [71, 85, 105] },
        });
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        finalY = (doc as any).lastAutoTable.finalY || finalY + 20;
      }
      
      // Transactions Table
      if (transactions.length > 0) {
        doc.setFontSize(14);
        doc.setTextColor(15, 23, 42);
        doc.text("Recent Transactions", 14, finalY + 12);
        
        autoTable(doc, {
          startY: finalY + 16,
          head: [['Date', 'Type', 'Category', 'Description', 'Amount']],
          body: transactions.map(t => [
            new Date(t.date).toLocaleDateString(),
            t.type.charAt(0).toUpperCase() + t.type.slice(1),
            t.category,
            t.description,
            formatCurrency(t.amount, userCurrency)
          ]),
          theme: 'striped',
          headStyles: { fillColor: [71, 85, 105] },
          didParseCell: function(data) {
            if (data.section === 'body' && data.column.index === 4) {
              const rowData = data.row.raw as string[];
              if (rowData && rowData[1] === 'Expense') {
                data.cell.styles.textColor = [220, 38, 38];
              } else {
                data.cell.styles.textColor = [22, 163, 74];
              }
            }
          }
        });
      }
      
      doc.save(`Financial_Summary_${new Date().toISOString().split("T")[0]}.pdf`);
      toast.success("PDF Downloaded Successfully", { id: "pdf-toast" });
    } catch (error) {
      console.error(error);
      toast.error("Failed to export PDF.", { id: "pdf-toast" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button variant="outline" className="flex items-center gap-2 bg-background shadow-sm hover:bg-slate-50 transition-colors" onClick={handleExport} disabled={loading}>
      <Download className="h-4 w-4" />
      {loading ? "Generating..." : "Export Financial Summary"}
    </Button>
  );
}

export function WipeDataButton() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [confirmText, setConfirmText] = useState("");
  const router = useRouter();

  const handleWipe = async () => {
    if (confirmText !== "CONFIRM") return;
    
    setLoading(true);
    try {
      await wipeAllAccountData();
      toast.success("Account data wiped successfully.");
      setOpen(false);
      setConfirmText("");
      // Force refresh the router so that data is re-fetched and metrics reset
      router.refresh();
    } catch {
      toast.error("Failed to wipe account data.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(val) => { setOpen(val); if (!val) setConfirmText(""); }}>
      <DialogTrigger render={
        <Button variant="destructive" className="bg-red-600 hover:bg-red-700 text-white shadow-sm transition-colors" />
      }>
        Wipe All Data
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-red-600">Are you absolutely sure?</DialogTitle>
          <DialogDescription className="space-y-4 pt-2">
            <p>
              This action cannot be undone. This will permanently delete all your <strong>Transactions, Budgets, Goals, and Subscriptions</strong>.
            </p>
            <p>
              To verify, type <strong>CONFIRM</strong> below:
            </p>
            <Input 
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              placeholder="CONFIRM"
              className="mt-2 font-mono"
            />
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose render={<Button variant="outline" />}>
            Cancel
          </DialogClose>
          <Button variant="destructive" onClick={handleWipe} disabled={loading || confirmText !== "CONFIRM"}>
            {loading ? "Wiping..." : "Wipe All Data"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function CurrencySelector() {
  const { data: session, update } = useSession();
  const currentCurrency = session?.user?.currency || "PKR";
  const [loading, setLoading] = useState(false);

  const handleCurrencyChange = async (newCurrency: string | null) => {
    if (!newCurrency) return;
    setLoading(true);
    try {
      await updateUserCurrency(newCurrency);
      await update({ user: { currency: newCurrency } });
      toast.success(`Currency updated to ${newCurrency}`);
    } catch {
      toast.error("Failed to update currency");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Select value={currentCurrency} onValueChange={handleCurrencyChange} disabled={loading}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select Currency" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="PKR">Pakistani Rupee (Rs)</SelectItem>
        <SelectItem value="USD">US Dollar ($)</SelectItem>
        <SelectItem value="EUR">Euro (€)</SelectItem>
        <SelectItem value="GBP">British Pound (£)</SelectItem>
        <SelectItem value="INR">Indian Rupee (₹)</SelectItem>
      </SelectContent>
    </Select>
  );
}
