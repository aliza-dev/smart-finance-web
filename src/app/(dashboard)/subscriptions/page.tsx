import { getSubscriptions } from "@/app/actions/subscription";
import { SubscriptionsClient } from "./SubscriptionsClient";
import { redirect } from "next/navigation";
import { auth } from "@/auth";

export default async function SubscriptionsPage() {
  const session = await auth();
  if (!session?.user) {
    redirect("/api/auth/signin");
  }

  const { subscriptions, error } = await getSubscriptions();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Subscriptions</h1>
        <p className="text-muted-foreground mt-2">
          Manage your recurring bills and track your fixed monthly costs.
        </p>
      </div>
      
      {error && <div className="text-red-500">{error}</div>}
      
      <SubscriptionsClient initialSubscriptions={subscriptions || []} />
    </div>
  );
}
