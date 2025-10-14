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

export const deepCleanNulls = <T,>(data: T): T => {
    if (data === null) {
        // Return an empty string. We cast it to T for generic compatibility,
        // as the function signature promises to return the same shape T.
        return '' as unknown as T;
    }
    
    // If it's a primitive or function, return it as is
    if (typeof data !== 'object' || data === undefined) {
        return data;
    }

    if (Array.isArray(data)) {
        // Map over the array, recursively calling deepCleanNulls
        // Cast to T as Array.isArray(data) implies T is an array type
        return data.map(deepCleanNulls) as T;
    }

    // Handle objects by iterating over properties
    const cleanedObject: Record<string, unknown> = {};
    const dataAsRecord = data as Record<string, unknown>;

    for (const key in dataAsRecord) {
        // Check if the property is owned by the object and not inherited
        if (Object.prototype.hasOwnProperty.call(dataAsRecord, key)) {
            cleanedObject[key] = deepCleanNulls(dataAsRecord[key]);
        }
    }
    // Cast to T as the object structure is preserved
    return cleanedObject as T;
};