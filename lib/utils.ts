import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function matchesSearchAllFields<T extends Record<string, any>>(
  item: T,
  searchValue: string
): boolean {
  const lowerSearch = searchValue.toLowerCase();

  return Object.values(item).some((value) => {
    if (value == null) return false;

    // If the value is an object or array, skip (or recurse if needed)
    if (typeof value === "object") return false;

    return value.toString().toLowerCase().includes(lowerSearch);
  });
}