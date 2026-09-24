"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

export async function getGoals() {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const goals = await prisma.savingsGoal.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
  });

  return goals;
}

export async function createGoal(data: { name: string; targetAmount: number; currentAmount?: number; deadline?: Date }) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const goal = await prisma.savingsGoal.create({
    data: {
      userId: session.user.id,
      name: data.name,
      targetAmount: data.targetAmount,
      currentAmount: data.currentAmount || 0,
      deadline: data.deadline ? data.deadline.toISOString() : undefined,
    },
  });

  revalidatePath("/goals");
  return { success: true, goal };
}

export async function addFundsToGoal(goalId: string, amount: number) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const goal = await prisma.savingsGoal.findUnique({
    where: { id: goalId },
  });

  if (!goal || goal.userId !== session.user.id) {
    throw new Error("Goal not found or unauthorized");
  }

  const updatedGoal = await prisma.savingsGoal.update({
    where: { id: goalId },
    data: {
      currentAmount: goal.currentAmount + amount,
    },
  });

  revalidatePath("/goals");
  return { success: true, goal: updatedGoal };
}

export async function deleteGoal(goalId: string) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const goal = await prisma.savingsGoal.findUnique({
    where: { id: goalId },
  });

  if (!goal || goal.userId !== session.user.id) {
    throw new Error("Goal not found or unauthorized");
  }

  await prisma.savingsGoal.delete({
    where: { id: goalId },
  });

  revalidatePath("/goals");
  return { success: true };
}
