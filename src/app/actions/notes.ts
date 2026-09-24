"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

export async function getNotes() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { error: "Unauthorized" };
    }

    const notes = await prisma.note.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
    });

    return { notes };
  } catch (error) {
    console.error("Failed to fetch notes:", error);
    return { error: "Failed to fetch notes" };
  }
}

export async function createNote(formData: FormData) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { error: "Unauthorized" };
    }

    const title = formData.get("title") as string;
    const content = formData.get("content") as string;

    if (!content) {
      return { error: "Content is required" };
    }

    await prisma.note.create({
      data: {
        title: title || null,
        content,
        userId: session.user.id,
      },
    });

    revalidatePath("/notes");
    return { success: true };
  } catch (error) {
    console.error("Failed to create note:", error);
    return { error: "Failed to create note" };
  }
}

export async function deleteNote(id: string) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { error: "Unauthorized" };
    }

    // Verify ownership
    const note = await prisma.note.findUnique({
      where: { id },
    });

    if (!note || note.userId !== session.user.id) {
      return { error: "Note not found or unauthorized" };
    }

    await prisma.note.delete({
      where: { id },
    });

    revalidatePath("/notes");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete note:", error);
    return { error: "Failed to delete note" };
  }
}
