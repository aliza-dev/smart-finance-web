"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

export async function getSubscriptions() {
  const session = await auth();
  if (!session?.user?.id) {
    return { subscriptions: [], error: "Unauthorized" };
  }

  try {
    const subscriptions = await prisma.subscription.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
    });
    return { subscriptions };
  } catch (error) {
    console.error("Failed to fetch subscriptions", error);
    return { subscriptions: [], error: "Failed to fetch subscriptions" };
  }
}

export async function addSubscription(data: { name: string; amount: number; billingCycle: string; type?: string; nextDueDate?: string }) {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "Unauthorized" };
  }

  try {
    const newSubscription = await prisma.subscription.create({
      data: {
        ...data,
        userId: session.user.id,
      },
    });
    revalidatePath("/subscriptions");
    return { subscription: newSubscription };
  } catch (error) {
    console.error("Failed to add subscription", error);
    return { error: "Failed to add subscription" };
  }
}

export async function deleteSubscription(id: string) {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "Unauthorized" };
  }

  try {
    await prisma.subscription.delete({
      where: { id, userId: session.user.id },
    });
    revalidatePath("/subscriptions");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete subscription", error);
    return { error: "Failed to delete subscription" };
  }
}
