
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount);
}

export function toLocation(json: any): { address: string; coordinates?: [number, number] } | undefined {
  if (!json) return undefined;
  if (typeof json === 'object' && 'address' in json) {
    return {
      address: json.address as string,
      coordinates: json.coordinates as [number, number] | undefined,
    };
  }
  return undefined;
}
