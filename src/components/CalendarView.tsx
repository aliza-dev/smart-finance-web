"use client";

import { useState, useMemo } from "react";
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths } from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Transaction } from "@/types";
import { formatCurrency } from "@/lib/currency";
import { useSession } from "next-auth/react";
import { getCategoryData, CustomCategoryData } from "@/components/CategoryIcon";

interface CalendarViewProps {
  transactions: Transaction[];
  customCategories?: CustomCategoryData[];
}

export function CalendarView({ transactions, customCategories = [] }: CalendarViewProps) {
  const { data: session } = useSession();
  const userCurrency = session?.user?.currency || "PKR";
  
  const [currentDate, setCurrentDate] = useState(new Date());

  const handlePrevMonth = () => setCurrentDate(subMonths(currentDate, 1));
  const handleNextMonth = () => setCurrentDate(addMonths(currentDate, 1));

  // Date boundaries for the grid
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);

  const days = eachDayOfInterval({ start: startDate, end: endDate });

  // Map transactions to dates
  const transactionsByDate = useMemo(() => {
    const map = new Map<string, { income: number; expense: number; categories: Set<string> }>();
    
    transactions.forEach(t => {
      // t.date is expected to be "yyyy-MM-dd"
      const tDate = t.date.substring(0, 10);
      
      if (!map.has(tDate)) {
        map.set(tDate, { income: 0, expense: 0, categories: new Set() });
      }
      
      const dayData = map.get(tDate)!;
      if (t.type === 'income') {
        dayData.income += Number(t.amount);
      } else {
        dayData.expense += Number(t.amount);
      }
      if (t.type === 'expense') {
        dayData.categories.add(t.category);
      }
    });
    
    return map;
  }, [transactions]);

  // Month summary
  const monthSummary = useMemo(() => {
    let income = 0;
    let expense = 0;
    
    const targetMonth = format(currentDate, "yyyy-MM");

    transactions.forEach(t => {
      if (t.date.startsWith(targetMonth)) {
        if (t.type === 'income') {
          income += Number(t.amount);
        } else {
          expense += Number(t.amount);
        }
      }
    });
    
    return { income, expense, balance: income - expense };
  }, [transactions, currentDate]);

  const today = new Date();

  return (
    <div className="space-y-6">
      {/* Month Summary Header */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-card border-border/50 shadow-sm transition-all hover:shadow-md">
          <CardContent className="p-6">
            <p className="text-sm font-medium text-muted-foreground mb-1">Total Income ({format(currentDate, "MMM")})</p>
            <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400" suppressHydrationWarning>
              {formatCurrency(monthSummary.income, userCurrency)}
            </p>
          </CardContent>
        </Card>
        <Card className="bg-card border-border/50 shadow-sm transition-all hover:shadow-md">
          <CardContent className="p-6">
            <p className="text-sm font-medium text-muted-foreground mb-1">Total Expense ({format(currentDate, "MMM")})</p>
            <p className="text-2xl font-bold text-rose-600 dark:text-rose-400" suppressHydrationWarning>
              {formatCurrency(monthSummary.expense, userCurrency)}
            </p>
          </CardContent>
        </Card>
        <Card className="bg-card border-border/50 shadow-sm transition-all hover:shadow-md">
          <CardContent className="p-6">
            <p className="text-sm font-medium text-muted-foreground mb-1">Net Balance ({format(currentDate, "MMM")})</p>
            <p className={`text-2xl font-bold ${monthSummary.balance >= 0 ? "text-slate-900 dark:text-slate-100" : "text-rose-600 dark:text-rose-400"}`} suppressHydrationWarning>
              {formatCurrency(monthSummary.balance, userCurrency)}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Calendar Navigation */}
      <div className="flex items-center justify-between mt-8 mb-4">
        <h3 className="text-xl font-semibold text-foreground font-[family-name:var(--font-playfair)]">
          {format(currentDate, "MMMM yyyy")}
        </h3>
        <div className="flex gap-2">
          <Button variant="outline" size="icon" onClick={handlePrevMonth} className="h-9 w-9 bg-card border-border/50 shadow-sm">
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={handleNextMonth} className="h-9 w-9 bg-card border-border/50 shadow-sm">
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Calendar Grid */}
      <Card className="bg-card border-border/50 shadow-sm overflow-hidden">
        <div className="grid grid-cols-7 border-b border-border/50">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <div key={day} className="p-3 text-center text-sm font-medium text-muted-foreground bg-muted/20">
              {day}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7">
          {days.map((day, idx) => {
            const dateStr = format(day, "yyyy-MM-dd");
            const dayData = transactionsByDate.get(dateStr);
            const isCurrentMonth = isSameMonth(day, currentDate);
            const isToday = isSameDay(day, today);

            return (
              <div
                key={day.toISOString()}
                className={`min-h-[100px] sm:min-h-[130px] p-2 border-b border-r border-border/50 transition-colors
                  ${!isCurrentMonth ? "bg-muted/10 opacity-60" : "hover:bg-muted/30"}
                  ${idx % 7 === 6 ? "border-r-0" : ""}
                  ${idx >= days.length - 7 ? "border-b-0" : ""}
                  ${isToday ? "bg-blue-500/5 dark:bg-blue-500/10 border-blue-500/30 dark:border-blue-500/30 relative" : ""}
                `}
              >
                {isToday && (
                  <div className="absolute inset-0 border-2 border-blue-500/30 dark:border-blue-500/40 pointer-events-none" />
                )}
                
                <div className="flex justify-between items-start mb-2">
                  <span className={`text-sm font-semibold w-7 h-7 flex items-center justify-center rounded-full
                    ${isToday ? "bg-blue-600 text-white shadow-sm" : "text-muted-foreground"}
                  `}>
                    {format(day, "d")}
                  </span>
                </div>
                
                <div className="flex flex-col gap-1.5 text-[11px] sm:text-xs md:text-sm mt-1 px-1">
                  {dayData && dayData.income > 0 && (
                    <div className="font-semibold text-emerald-600 dark:text-emerald-500 truncate bg-emerald-50 dark:bg-emerald-500/10 px-1.5 py-0.5 rounded" suppressHydrationWarning>
                      +{formatCurrency(dayData.income, userCurrency)}
                    </div>
                  )}
                  {dayData && dayData.expense > 0 && (
                    <div className="font-semibold text-rose-600 dark:text-rose-500 truncate bg-rose-50 dark:bg-rose-500/10 px-1.5 py-0.5 rounded" suppressHydrationWarning>
                      -{formatCurrency(dayData.expense, userCurrency)}
                    </div>
                  )}
                  {dayData && dayData.categories.size > 0 && (
                    <div className="flex flex-wrap gap-1 mt-1 px-1">
                      {Array.from(dayData.categories).map(cat => {
                        const { dotColor } = getCategoryData(cat, customCategories);
                        return (
                          <div 
                            key={cat} 
                            className={`w-2 h-2 rounded-full ${dotColor}`}
                            title={cat}
                          />
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}
