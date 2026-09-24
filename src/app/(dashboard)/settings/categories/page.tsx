import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getCustomCategories } from "@/app/actions/category";
import { CategoriesClient } from "./CategoriesClient";

export default async function CategoriesSettingsPage() {
  const session = await auth();
  if (!session?.user) {
    redirect("/api/auth/signin");
  }

  const categories = await getCustomCategories();

  return (
    <div className="space-y-8 max-w-4xl mx-auto pb-10 p-4 md:p-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Custom Categories</h1>
        <p className="text-muted-foreground text-lg">
          Create and manage your own personalized spending categories.
        </p>
      </div>
      
      <CategoriesClient initialCategories={categories} />
    </div>
  );
}
