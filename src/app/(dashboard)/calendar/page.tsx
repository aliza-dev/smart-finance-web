import { getTransactions } from "@/app/actions/transaction";
import { getCustomCategories } from "@/app/actions/category";
import { CalendarView } from "@/components/CalendarView";

export const metadata = {
  title: "Calendar | SmartSpend",
  description: "View your monthly income and expenses aggregated by day.",
};

export default async function CalendarPage() {
  const { transactions, error } = await getTransactions();
  const customCategories = await getCustomCategories();

  if (error) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-destructive font-medium">{error}</p>
      </div>
    );
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2 mb-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Calendar</h2>
          <p className="text-muted-foreground mt-1">Track your daily income and expenses</p>
        </div>
      </div>
      <CalendarView transactions={transactions} customCategories={customCategories} />
    </div>
  );
}
