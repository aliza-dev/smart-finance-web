"use client";

import React, { useState, useTransition } from "react";
import { Plus, Trash2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { createNote, deleteNote } from "@/app/actions/notes";
import { toast } from "sonner";
import { format } from "date-fns";
import { Note } from "@prisma/client";

export default function NotesClient({ initialNotes }: { initialNotes: Note[] }) {
  const [notes, setNotes] = useState<Note[]>(initialNotes);
  const [isPending, startTransition] = useTransition();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const title = formData.get("title") as string;
    const content = formData.get("content") as string;

    if (!content.trim()) {
      toast.error("Note content cannot be empty.");
      return;
    }

    startTransition(async () => {
      const res = await createNote(formData);
      if (res.error) {
        toast.error(res.error);
      } else {
        toast.success("Note saved successfully.");
        // Optimistic update isn't strictly necessary if revalidatePath triggers a re-render,
        // but since this is a client component holding state, we should refresh or manually update state.
        // The easiest way is to let the server revalidate and we just reset the form.
        // Wait, since we hold `notes` in state, revalidatePath won't update `notes` state unless we reload or rely purely on props.
        // Let's just reload the page for a clean sync.
        window.location.reload();
      }
    });
  };

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    startTransition(async () => {
      const res = await deleteNote(id);
      if (res.error) {
        toast.error(res.error);
      } else {
        toast.success("Note deleted.");
        setNotes((prev) => prev.filter((n) => n.id !== id));
      }
      setDeletingId(null);
    });
  };

  return (
    <div className="space-y-8">
      {/* Create Note Form */}
      <Card className="max-w-2xl border-border/50 shadow-sm rounded-2xl">
        <form onSubmit={handleCreate}>
          <CardHeader>
            <CardTitle className="text-lg">Add a new note</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              name="title"
              placeholder="Title (optional)"
              className="bg-transparent border-border/50 focus-visible:ring-1 focus-visible:ring-primary/30"
              disabled={isPending}
            />
            <Textarea
              name="content"
              placeholder="Take a note..."
              className="bg-transparent border-border/50 focus-visible:ring-1 focus-visible:ring-primary/30 min-h-[120px] resize-none"
              required
              disabled={isPending}
            />
          </CardContent>
          <CardFooter className="flex justify-end border-t border-border/10 pt-4">
            <Button type="submit" disabled={isPending} className="rounded-full shadow-sm">
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Plus className="mr-2 h-4 w-4" />
                  Save Note
                </>
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>

      {/* Notes Grid */}
      {notes.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground border border-dashed border-border/50 rounded-2xl">
          <p>No notes yet. Start typing above to create one!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {notes.map((note) => (
            <Card
              key={note.id}
              className="group relative flex flex-col justify-between border-border/30 hover:border-border/60 transition-colors shadow-sm rounded-2xl bg-card"
            >
              <CardHeader className="pb-3 pt-5 px-5">
                <div className="flex justify-between items-start gap-4">
                  <CardTitle className="text-lg leading-tight font-medium">
                    {note.title || <span className="text-muted-foreground italic">Untitled</span>}
                  </CardTitle>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity hover:text-destructive hover:bg-destructive/10 shrink-0"
                    onClick={() => handleDelete(note.id)}
                    disabled={deletingId === note.id}
                  >
                    {deletingId === note.id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Trash2 className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="px-5 pb-4 text-muted-foreground text-sm flex-1 whitespace-pre-wrap leading-relaxed">
                {note.content}
              </CardContent>
              <CardFooter className="px-5 pb-4 pt-0">
                <span className="text-xs text-muted-foreground/60">
                  {format(new Date(note.createdAt), "MMM d, yyyy")}
                </span>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
