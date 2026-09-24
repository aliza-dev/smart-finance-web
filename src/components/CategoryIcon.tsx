import React from 'react';
import { 
  Utensils, 
  ShoppingBag, 
  Car, 
  Activity,
  Home,
  Zap,
  Film,
  Briefcase,
  PiggyBank,
  User,
  Tag,
  // Custom Icon Options
  Coffee,
  Plane,
  Heart,
  Book,
  Gamepad,
  Music,
  Camera,
  Shirt,
  Gift,
  Smartphone,
  Star,
  Trophy,
} from 'lucide-react';
import { Category } from '@/types';

export interface CustomCategoryData { name: string; icon: string; color: string }

interface CategoryIconProps {
  category: Category | string;
  className?: string;
  iconClassName?: string;
  customCategories?: CustomCategoryData[];
}

export const getCategoryData = (cat: string, customCategories: CustomCategoryData[] = []) => {
  const normalized = cat.toLowerCase();

  // Check custom categories first
  const customMatch = customCategories.find(c => c.name.toLowerCase() === normalized);
  if (customMatch) {
    const allIcons: Record<string, React.ElementType> = {
      Coffee, Plane, Heart, Book, Gamepad, Music, Camera, Shirt, Gift, Smartphone, Star, Trophy,
      Utensils, ShoppingBag, Car, Activity, Home, Zap, Film, Briefcase, PiggyBank, User, Tag
    };
    
    // Extract bg color from classes like 'bg-red-500/10 text-red-500' -> 'bg-red-500'
    const colorParts = customMatch.color.split(' ');
    let dotColor = 'bg-slate-500';
    const bgPart = colorParts.find(p => p.startsWith('bg-'));
    if (bgPart) {
      dotColor = bgPart.split('/')[0];
    }
    
    return { 
      icon: allIcons[customMatch.icon] || Tag, 
      classes: customMatch.color,
      dotColor
    };
  }

  switch (normalized) {
    case 'food':
      return { icon: Utensils, classes: 'bg-orange-500/10 text-orange-500', dotColor: 'bg-orange-500' };
    case 'grocery':
    case 'shopping':
      return { icon: ShoppingBag, classes: 'bg-blue-500/10 text-blue-500', dotColor: 'bg-blue-500' };
    case 'transport':
    case 'transportation':
      return { icon: Car, classes: 'bg-teal-500/10 text-teal-500', dotColor: 'bg-teal-500' };
    case 'health':
    case 'healthcare':
      return { icon: Activity, classes: 'bg-emerald-500/10 text-emerald-500', dotColor: 'bg-emerald-500' };
    case 'housing':
      return { icon: Home, classes: 'bg-indigo-500/10 text-indigo-500', dotColor: 'bg-indigo-500' };
    case 'utilities':
      return { icon: Zap, classes: 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-500', dotColor: 'bg-yellow-500' };
    case 'entertainment':
      return { icon: Film, classes: 'bg-pink-500/10 text-pink-500', dotColor: 'bg-pink-500' };
    case 'salary':
    case 'income':
      return { icon: Briefcase, classes: 'bg-emerald-500/10 text-emerald-500', dotColor: 'bg-emerald-500' };
    case 'savings':
      return { icon: PiggyBank, classes: 'bg-purple-500/10 text-purple-500', dotColor: 'bg-purple-500' };
    case 'personal':
      return { icon: User, classes: 'bg-rose-500/10 text-rose-500', dotColor: 'bg-rose-500' };
    default:
      return { icon: Tag, classes: 'bg-slate-500/10 text-slate-500', dotColor: 'bg-slate-500' };
  }
};

export function CategoryIcon({ category, className = "", iconClassName = "w-4 h-4", customCategories = [] }: CategoryIconProps) {
  const { icon: Icon, classes } = getCategoryData(category, customCategories);

  return (
    <div className={`flex items-center justify-center rounded-full p-2 ${classes} ${className}`}>
      <Icon className={iconClassName} />
    </div>
  );
}
