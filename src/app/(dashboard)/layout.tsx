import { ExpenseProvider } from "@/context/ExpenseContext";
import { Sidebar, MobileNav } from "@/components/Sidebar";
import { getTransactions } from "@/app/actions/transaction";
import { getCustomCategories } from "@/app/actions/category";
import { ThemeToggle } from "@/components/ThemeToggle";
import { AuthButtons } from "@/components/AuthButtons";

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { transactions } = await getTransactions();
  const customCategories = await getCustomCategories();

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <header className="flex justify-between items-center h-14 lg:h-[60px] px-4 lg:px-6 bg-background border-b shadow-sm w-full">
          <div className="flex items-center gap-2">
            <MobileNav />
          </div>
          <div className="flex gap-4 items-center">
            <ThemeToggle />
            <AuthButtons />
          </div>
        </header>
        <main className="flex-1 p-4 md:p-8 max-w-7xl mx-auto w-full">
          <ExpenseProvider initialTransactions={transactions || []} initialCategories={customCategories || []}>
            {children}
          </ExpenseProvider>
        </main>
      </div>
    </div>
  );
}
