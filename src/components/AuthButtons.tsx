"use client";
import { signIn, signOut, useSession } from "next-auth/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

export function AuthButtons() {
  const { data: session } = useSession();

  if (session) {
    const user = session.user;
    const initials = user?.name ? user.name.slice(0, 2).toUpperCase() : user?.email?.slice(0, 2).toUpperCase() || "U";

    return (
      <DropdownMenu>
        <DropdownMenuTrigger className="rounded-full outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 border-none bg-transparent cursor-pointer p-0 m-0 overflow-hidden">
          <Avatar>
            <AvatarImage src={user?.image || undefined} alt={user?.name || "User avatar"} />
            <AvatarFallback className="bg-primary/10 text-primary font-semibold">{initials}</AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56 mt-2">
          <div className="flex flex-col space-y-1 p-3 border-b border-border/50 bg-muted/20">
            <p className="text-sm font-semibold leading-none text-foreground">{user?.name || "User"}</p>
            <p className="text-xs leading-none text-muted-foreground">{user?.email}</p>
          </div>
          <div className="p-1">
            <DropdownMenuItem 
              className="text-red-600 focus:text-red-700 focus:bg-red-100 dark:focus:bg-red-950/50 cursor-pointer font-medium p-2 rounded-md transition-colors"
              onClick={() => signOut({ callbackUrl: '/' })}
            >
              Sign Out
            </DropdownMenuItem>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <Button variant="outline" onClick={() => signIn("github")}>
        GitHub Sign In
      </Button>
      <Button onClick={() => signIn("google")}>
        Google Sign In
      </Button>
    </div>
  );
}
