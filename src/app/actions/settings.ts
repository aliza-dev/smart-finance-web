"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

export async function exportUserData() {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const transactions = await prisma.transaction.findMany({
    where: { userId: session.user.id },
    orderBy: { date: "desc" },
  });

  const budgets = await prisma.budget.findMany({
    where: { userId: session.user.id },
  });

  // Return structured data for PDF generation
  return {
    transactions,
    budgets,
  };
}

export async function resetAccountTransactions() {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  await prisma.transaction.deleteMany({
    where: { userId: session.user.id },
  });

  revalidatePath("/");
  revalidatePath("/transactions");
  revalidatePath("/reports");
  revalidatePath("/settings");

  return { success: true };
}

export async function wipeAllAccountData() {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  // Delete all user data
  await prisma.transaction.deleteMany({ where: { userId: session.user.id } });
  await prisma.budget.deleteMany({ where: { userId: session.user.id } });
  await prisma.savingsGoal.deleteMany({ where: { userId: session.user.id } });
  await prisma.subscription.deleteMany({ where: { userId: session.user.id } });

  // Revalidate everything
  revalidatePath("/");
  revalidatePath("/transactions");
  revalidatePath("/analytics");
  revalidatePath("/calendar");
  revalidatePath("/budgets");
  revalidatePath("/goals");
  revalidatePath("/subscriptions");
  revalidatePath("/settings");

  return { success: true };
}

export async function updateUserCurrency(currency: string) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  await prisma.user.update({
    where: { id: session.user.id },
    data: { currency },
  });

  revalidatePath("/");
  revalidatePath("/transactions");
  revalidatePath("/budgets");
  revalidatePath("/subscriptions");
  revalidatePath("/settings");

  return { success: true };
}
