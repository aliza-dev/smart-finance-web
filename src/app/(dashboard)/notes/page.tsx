import React from "react";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import NotesClient from "./NotesClient";
import { getNotes } from "@/app/actions/notes";

export const metadata = {
  title: "Notes - SmartSpend",
  description: "Jot down financial thoughts, grocery lists, or saving ideas.",
};

export default async function NotesPage() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login");
  }

  const { notes, error } = await getNotes();

  if (error || !notes) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-center px-4">
        <h2 className="text-2xl font-bold mb-2">Error Loading Notes</h2>
        <p className="text-muted-foreground">{error || "Failed to load notes"}</p>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">Notes</h1>
        <p className="text-muted-foreground">
          Jot down financial thoughts, grocery lists, or saving ideas.
        </p>
      </div>

      <NotesClient initialNotes={notes} />
    </div>
  );
}
