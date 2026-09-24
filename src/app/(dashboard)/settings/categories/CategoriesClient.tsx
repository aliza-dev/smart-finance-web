"use client";

import React, { useState } from "react";
import { PlusCircle, Trash2, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { addCustomCategory, deleteCustomCategory } from "@/app/actions/category";
import { CategoryIcon } from "@/components/CategoryIcon";
import Link from "next/link";
import { toast } from "sonner";

interface CustomCategory {
  id: string;
  name: string;
  icon: string;
  color: string;
}

const ICONS = [
  "Coffee", "Plane", "Heart", "Book", "Gamepad", "Music", 
  "Camera", "Shirt", "Gift", "Smartphone", "Star", "Trophy"
];

const COLORS = [
  "bg-red-500/10 text-red-500",
  "bg-orange-500/10 text-orange-500",
  "bg-amber-500/10 text-amber-500",
  "bg-emerald-500/10 text-emerald-500",
  "bg-cyan-500/10 text-cyan-500",
  "bg-blue-500/10 text-blue-500",
  "bg-indigo-500/10 text-indigo-500",
  "bg-purple-500/10 text-purple-500",
  "bg-pink-500/10 text-pink-500",
  "bg-rose-500/10 text-rose-500",
];

export function CategoriesClient({ initialCategories }: { initialCategories: CustomCategory[] }) {
  const [categories, setCategories] = useState<CustomCategory[]>(initialCategories);
  const [name, setName] = useState("");
  const [selectedIcon, setSelectedIcon] = useState("Star");
  const [selectedColor, setSelectedColor] = useState(COLORS[0]);
  const [isAdding, setIsAdding] = useState(false);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsAdding(true);
    try {
      const newCat = await addCustomCategory(name.trim(), selectedIcon, selectedColor);
      setCategories([...categories, newCat]);
      setName("");
      toast.success("Category added successfully");
    } catch {
      toast.error("Failed to add category");
    } finally {
      setIsAdding(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteCustomCategory(id);
      setCategories(categories.filter((c) => c.id !== id));
      toast.success("Category deleted");
    } catch {
      toast.error("Failed to delete category");
    }
  };

  return (
    <div className="space-y-6">
      <Link href="/settings">
        <Button variant="ghost" className="pl-0 text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Settings
        </Button>
      </Link>

      <div className="bg-card rounded-2xl border border-border/50 shadow-sm p-6">
        <h3 className="text-lg font-semibold mb-4">Create New Category</h3>
        <form onSubmit={handleAdd} className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-1.5 block">Category Name</label>
            <Input 
              placeholder="e.g. Subscriptions, Hobbies..." 
              value={name} 
              onChange={(e) => setName(e.target.value)}
              className="bg-muted/50"
              maxLength={20}
              required
            />
          </div>
          
          <div>
            <label className="text-sm font-medium mb-1.5 block">Select Icon</label>
            <div className="grid grid-cols-6 sm:grid-cols-12 gap-2">
              {ICONS.map((icon) => (
                <button
                  key={icon}
                  type="button"
                  onClick={() => setSelectedIcon(icon)}
                  className={`flex items-center justify-center p-2 rounded-xl border transition-all ${selectedIcon === icon ? 'border-primary bg-primary/10' : 'border-border/50 hover:bg-accent'}`}
                >
                  <CategoryIcon category={name || "Custom"} customCategories={[{ name: name || "Custom", icon, color: "text-foreground" }]} iconClassName="h-5 w-5" />
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-sm font-medium mb-1.5 block">Select Color</label>
            <div className="flex flex-wrap gap-2">
              {COLORS.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setSelectedColor(color)}
                  className={`h-10 w-10 rounded-full flex items-center justify-center border-2 transition-all ${selectedColor === color ? 'border-foreground scale-110' : 'border-transparent hover:scale-105'} ${color}`}
                >
                  <div className="h-4 w-4 rounded-full bg-current opacity-50" />
                </button>
              ))}
            </div>
          </div>

          <Button type="submit" disabled={isAdding || !name.trim()} className="w-full sm:w-auto">
            <PlusCircle className="h-4 w-4 mr-2" />
            {isAdding ? "Saving..." : "Add Category"}
          </Button>
        </form>
      </div>

      <div className="bg-card rounded-2xl border border-border/50 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-border/50 bg-muted/20">
          <h3 className="font-semibold">Your Custom Categories</h3>
        </div>
        <div className="divide-y divide-border/50">
          {categories.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground text-sm">
              No custom categories yet. Create one above!
            </div>
          ) : (
            categories.map((cat) => (
              <div key={cat.id} className="p-4 flex items-center justify-between hover:bg-accent/50 transition-colors">
                <div className="flex items-center gap-4">
                  <CategoryIcon category={cat.name} customCategories={categories} iconClassName="h-5 w-5" className="h-10 w-10" />
                  <div>
                    <p className="font-medium capitalize">{cat.name}</p>
                    <p className="text-xs text-muted-foreground">Custom Category</p>
                  </div>
                </div>
                <Button variant="ghost" size="icon" onClick={() => handleDelete(cat.id)} className="text-rose-500 hover:text-rose-600 hover:bg-rose-500/10">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
