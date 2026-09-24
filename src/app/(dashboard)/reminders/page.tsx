import { RemindersClient } from "./RemindersClient";
import { getTransactions } from "@/app/actions/transaction";
import { getSubscriptions } from "@/app/actions/subscription";
import { Subscription } from "@/types";

export default async function RemindersPage() {
  const { transactions } = await getTransactions();
  const { subscriptions } = await getSubscriptions();

  // Calculate total monthly income
  const today = new Date();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();

  const totalMonthlyIncome = (transactions || [])
    .filter(t => {
      if (t.type !== "income") return false;
      const dateParts = t.date.split('-');
      if (dateParts.length !== 3) return false;
      const tMonth = Number(dateParts[1]) - 1;
      const tYear = Number(dateParts[0]);
      return tMonth === currentMonth && tYear === currentYear;
    })
    .reduce((sum, t) => sum + Number(t.amount), 0);

  return (
    <RemindersClient 
      subscriptions={(subscriptions as Subscription[]) || []} 
      totalMonthlyIncome={totalMonthlyIncome} 
    />
  );
}
