"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { X, Download } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export function InstallPrompt() {
  const [isReadyForInstall, setIsReadyForInstall] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [promptDeferred, setPromptDeferred] = useState<any>(null);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    // Dismiss if already dismissed in this session
    if (sessionStorage.getItem("pwa-prompt-dismissed")) {
      // eslint-disable-next-line
      setIsDismissed(true);
    }

    const handleBeforeInstallPrompt = (e: Event) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      // Stash the event so it can be triggered later.
      setPromptDeferred(e);
      // Update UI notify the user they can install the PWA
      setIsReadyForInstall(true);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    };
  }, []);

  const installApp = async () => {
    if (!promptDeferred) return;
    promptDeferred.prompt();
    const { outcome } = await promptDeferred.userChoice;
    if (outcome === "accepted") {
      console.log("User accepted the A2HS prompt");
    } else {
      console.log("User dismissed the A2HS prompt");
    }
    setPromptDeferred(null);
    setIsReadyForInstall(false);
  };

  const dismissPrompt = () => {
    setIsDismissed(true);
    sessionStorage.setItem("pwa-prompt-dismissed", "true");
  };

  if (!isReadyForInstall || isDismissed) {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 z-50 animate-in slide-in-from-bottom-10 fade-in duration-300">
      <Card className="border-primary/20 shadow-xl bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <CardContent className="p-4 flex items-center justify-between gap-4">
          <div className="flex flex-col">
            <span className="font-semibold text-sm">Install App</span>
            <span className="text-xs text-muted-foreground">Add to home screen for quick access.</span>
          </div>
          <div className="flex items-center gap-2">
            <Button size="sm" onClick={installApp} className="flex items-center gap-1">
              <Download className="h-4 w-4" />
              <span>Install</span>
            </Button>
            <Button size="icon" variant="ghost" className="h-8 w-8 text-muted-foreground" onClick={dismissPrompt}>
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
