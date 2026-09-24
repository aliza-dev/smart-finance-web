"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

export async function getCustomCategories() {
  const session = await auth();
  if (!session?.user?.id) return [];

  const categories = await prisma.customCategory.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: 'asc' }
  });

  return categories;
}

export async function addCustomCategory(name: string, icon: string, color: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const newCategory = await prisma.customCategory.create({
    data: {
      name: name.toLowerCase(),
      icon,
      color,
      userId: session.user.id,
    }
  });

  revalidatePath("/");
  return newCategory;
}

export async function deleteCustomCategory(id: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  await prisma.customCategory.deleteMany({
    where: { 
      id,
      userId: session.user.id
    }
  });

  revalidatePath("/");
}
