import { getGoals } from "@/app/actions/goals";
import { GoalsClient } from "./GoalsClient";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Savings Goals - ExpenseTracker",
};

export default async function GoalsPage() {
  const session = await auth();
  
  if (!session?.user) {
    redirect("/api/auth/signin");
  }

  const initialGoals = await getGoals();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Savings Goals</h1>
        <p className="text-muted-foreground text-lg">
          Set targets and track your progress towards your financial objectives.
        </p>
      </div>

      <GoalsClient initialGoals={initialGoals} />
    </div>
  );
}
