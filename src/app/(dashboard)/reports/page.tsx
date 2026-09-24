import { GenerateReportCard } from "@/components/GenerateReportCard";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function ReportsPage() {
  const session = await auth();
  if (!session) {
    redirect("/");
  }

  const currentDate = new Date();
  const currentMonth = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}`;

  return (
    <div className="max-w-5xl mx-auto p-4 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">AI Insights & Reports</h1>
        <p className="text-muted-foreground">
          Leverage Gemini AI to get deep, actionable insights into your spending habits and financial health.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-1">
        <GenerateReportCard month={currentMonth} />
      </div>
    </div>
  );
}
