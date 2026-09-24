import { ThemeToggle } from "@/components/ThemeToggle";
import { AlertTriangle, ShieldCheck, Download, Fingerprint, Globe, Bell, ChevronRight, Palette, Tag } from "lucide-react";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ExportDataButton, WipeDataButton, CurrencySelector } from "./SettingsActions";
import { SettingsSwitch } from "./SettingsSwitches";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default async function SettingsPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/api/auth/signin");
  }

  const initials = session.user.name?.slice(0, 2).toUpperCase() || "US";

  return (
    <div className="space-y-8 max-w-4xl mx-auto pb-10 p-4 md:p-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground text-lg">
          Manage your account settings and preferences.
        </p>
      </div>

      <div className="space-y-6">
        
        {/* Profile Details - Not a standard row, keeping it slightly prominent but cleaner */}
        <div className="flex items-center gap-6 p-6 bg-card rounded-2xl border border-border/50 shadow-sm">
          <Avatar className="h-20 w-20 relative border-2 border-background shadow-md">
            <AvatarImage src={session.user.image || undefined} alt={session.user.name || "User avatar"} />
            <AvatarFallback className="bg-primary/10 text-primary text-xl font-bold">{initials}</AvatarFallback>
          </Avatar>
          <div className="space-y-1">
            <h2 className="text-2xl font-bold">{session.user.name || "N/A"}</h2>
            <div className="flex items-center gap-2 text-muted-foreground">
              <ShieldCheck className="h-4 w-4 text-emerald-500" />
              <span>{session.user.email}</span>
            </div>
          </div>
        </div>

        {/* General Settings */}
        <div className="space-y-2">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider px-2">General</h3>
          <div className="bg-card rounded-2xl border border-border/50 shadow-sm overflow-hidden flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-border/50 hover:bg-accent transition-colors cursor-pointer group">
              <div className="flex items-center gap-4">
                <div className="p-2 rounded-lg bg-blue-500/10 text-blue-500 group-hover:bg-blue-500 group-hover:text-white transition-colors">
                  <Fingerprint className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-medium text-foreground">Security & Biometrics</h4>
                  <p className="text-sm text-muted-foreground">Manage FaceID and App Lock</p>
                </div>
              </div>
              <SettingsSwitch id="biometrics" initialState={true} />
            </div>

            <Link href="/settings/categories">
              <div className="flex items-center justify-between p-4 border-b border-border/50 hover:bg-accent transition-colors cursor-pointer group">
                <div className="flex items-center gap-4">
                  <div className="p-2 rounded-lg bg-pink-500/10 text-pink-500 group-hover:bg-pink-500 group-hover:text-white transition-colors">
                    <Tag className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-medium text-foreground">Category Management</h4>
                    <p className="text-sm text-muted-foreground">Create and organize custom categories</p>
                  </div>
                </div>
                <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-foreground" />
              </div>
            </Link>
            
            <div className="flex items-center justify-between p-4 hover:bg-accent transition-colors group">
              <div className="flex items-center gap-4">
                <div className="p-2 rounded-lg bg-orange-500/10 text-orange-500 group-hover:bg-orange-500 group-hover:text-white transition-colors">
                  <Bell className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-medium text-foreground">Notifications & Haptics</h4>
                  <p className="text-sm text-muted-foreground">Alerts for spending limits</p>
                </div>
              </div>
              <SettingsSwitch id="haptics" initialState={true} />
            </div>
          </div>
        </div>

        {/* Preferences */}
        <div className="space-y-2">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider px-2">Preferences</h3>
          <div className="bg-card rounded-2xl border border-border/50 shadow-sm overflow-hidden flex flex-col">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border-b border-border/50 hover:bg-accent transition-colors">
              <div className="flex items-center gap-4 mb-3 sm:mb-0">
                <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-500">
                  <Palette className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-medium text-foreground">Theme & Style</h4>
                  <p className="text-sm text-muted-foreground">Light, Dark, or System modes</p>
                </div>
              </div>
              <div className="sm:ml-auto">
                <ThemeToggle />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 hover:bg-accent transition-colors">
              <div className="flex items-center gap-4 mb-3 sm:mb-0">
                <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-500">
                  <Globe className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-medium text-foreground">Localization</h4>
                  <p className="text-sm text-muted-foreground">Set your default currency</p>
                </div>
              </div>
              <div className="sm:ml-auto">
                <CurrencySelector />
              </div>
            </div>

          </div>
        </div>

        {/* Data & Export */}
        <div className="space-y-2">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider px-2">Data & Export</h3>
          <div className="bg-card rounded-2xl border border-border/50 shadow-sm overflow-hidden flex flex-col">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border-b border-border/50 hover:bg-accent transition-colors">
              <div className="flex items-center gap-4 mb-3 sm:mb-0">
                <div className="p-2 rounded-lg bg-teal-500/10 text-teal-500">
                  <Download className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-medium text-foreground">Export Data</h4>
                  <p className="text-sm text-muted-foreground">Download PDF financial summary</p>
                </div>
              </div>
              <div className="sm:ml-auto">
                <ExportDataButton userName={session.user.name || "User"} userEmail={session.user.email || ""} />
              </div>
            </div>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="space-y-2 mt-8">
          <h3 className="text-sm font-semibold text-red-500 uppercase tracking-wider px-2">Danger Zone</h3>
          <div className="bg-red-50 dark:bg-red-950/10 border border-red-200 dark:border-red-900/50 rounded-2xl shadow-sm overflow-hidden flex flex-col">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 transition-colors">
              <div className="flex items-center gap-4 mb-3 sm:mb-0">
                <div className="p-2 rounded-lg bg-red-500/20 text-red-600 dark:text-red-500">
                  <AlertTriangle className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-medium text-red-700 dark:text-red-400">Wipe Account Data</h4>
                  <p className="text-sm text-red-600/80 dark:text-red-500/80">Permanently delete all your financial data</p>
                </div>
              </div>
              <div className="sm:ml-auto">
                <WipeDataButton />
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
