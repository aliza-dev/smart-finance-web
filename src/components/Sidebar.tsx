"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Receipt,
  PiggyBank,
  Settings,
  Wallet,
  Menu,
  Repeat,
  Target,
  Calendar,
  BarChart2,
  Bell,
  Sparkles,
  Notebook,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet";

const navGroups = [
  {
    title: "Core",
    items: [
      { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
      { name: "Transactions", href: "/transactions", icon: Receipt },
      { name: "Daily Report", href: "/analytics", icon: BarChart2 },
    ]
  },
  {
    title: "Planning & Tracking",
    items: [
      { name: "Calendar", href: "/calendar", icon: Calendar },
      { name: "Budgets", href: "/budgets", icon: PiggyBank },
      { name: "Goals", href: "/goals", icon: Target },
      { name: "Subscriptions", href: "/subscriptions", icon: Repeat },
      { name: "Notes", href: "/notes", icon: Notebook },
    ]
  },
  {
    title: "Assistance & Alerts",
    items: [
      { name: "Reminders", href: "/reminders", icon: Bell },
      { name: "AI Advisor", href: "/advisor", icon: Sparkles },
    ]
  }
];

const settingsItem = { name: "Settings", href: "/settings", icon: Settings };

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden border-r bg-slate-50 dark:bg-slate-950 md:block w-64 min-h-screen">
      <div className="flex h-full max-h-screen flex-col gap-2">
        <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
          <Link href="/dashboard" className="flex items-center gap-2 font-semibold text-primary">
            <Wallet className="h-6 w-6" />
            <span className="">SmartSpend</span>
          </Link>
        </div>
        <div className="flex-1 overflow-auto py-4 flex flex-col">
          <nav className="grid items-start px-2 text-sm font-medium lg:px-4 space-y-6">
            {navGroups.map((group) => (
              <div key={group.title} className="space-y-1">
                <h4 className="text-xs text-muted-foreground uppercase tracking-wider mb-2 px-3 font-semibold">
                  {group.title}
                </h4>
                {group.items.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        "flex items-center gap-3 rounded-lg px-3 py-2 transition-all",
                        isActive
                          ? "bg-primary/10 text-primary font-bold shadow-sm"
                          : "text-muted-foreground hover:bg-muted/80 hover:text-foreground"
                      )}
                    >
                      <item.icon className={cn("h-4 w-4", isActive ? "stroke-[2.5px]" : "")} />
                      {item.name}
                    </Link>
                  );
                })}
              </div>
            ))}
          </nav>
          
          <div className="px-2 lg:px-4 pt-6 pb-4">
            <div>
              <Link
                href={settingsItem.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 transition-all",
                  pathname === settingsItem.href
                    ? "bg-primary/10 text-primary font-bold shadow-sm"
                    : "text-muted-foreground hover:bg-muted/80 hover:text-foreground"
                )}
              >
                <settingsItem.icon className={cn("h-4 w-4", pathname === settingsItem.href ? "stroke-[2.5px]" : "")} />
                {settingsItem.name}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}

export function MobileNav() {
  const pathname = usePathname();
  const [open, setOpen] = React.useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger render={<Button variant="outline" size="icon" className="shrink-0 md:hidden" />}>
        <Menu className="h-5 w-5" />
        <span className="sr-only">Toggle navigation menu</span>
      </SheetTrigger>
      <SheetContent side="left" className="flex flex-col w-[280px]">
        <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
        <Link href="/dashboard" className="flex items-center gap-2 font-semibold text-primary mb-6 mt-4">
          <Wallet className="h-6 w-6" />
          <span className="">SmartSpend</span>
        </Link>
        <div className="flex-1 overflow-auto flex flex-col">
          <nav className="grid gap-6 text-lg font-medium">
            {navGroups.map((group) => (
              <div key={group.title} className="space-y-1">
                <h4 className="text-xs text-muted-foreground uppercase tracking-wider mb-2 px-3 font-semibold">
                  {group.title}
                </h4>
                {group.items.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className={cn(
                        "flex items-center gap-3 rounded-lg px-3 py-2 transition-all text-base",
                        isActive
                          ? "bg-primary/10 text-primary font-bold shadow-sm"
                          : "text-muted-foreground hover:bg-muted/80 hover:text-foreground"
                      )}
                    >
                      <item.icon className={cn("h-5 w-5", isActive ? "stroke-[2.5px]" : "")} />
                      {item.name}
                    </Link>
                  );
                })}
              </div>
            ))}
          </nav>
          <div className="pt-6 pb-4">
             <div>
                <Link
                  href={settingsItem.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 transition-all text-base",
                    pathname === settingsItem.href
                      ? "bg-primary/10 text-primary font-bold shadow-sm"
                      : "text-muted-foreground hover:bg-muted/80 hover:text-foreground"
                  )}
                >
                  <settingsItem.icon className={cn("h-5 w-5", pathname === settingsItem.href ? "stroke-[2.5px]" : "")} />
                  {settingsItem.name}
                </Link>
             </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
