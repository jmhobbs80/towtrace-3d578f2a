
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

export function downloadTemplate(filename: string): void {
  const template = [
    'vin,make,model,year,trim,color,mileage,purchase_price,listing_price,notes',
    'SAMPLE1234567890,Toyota,Camry,2020,LE,Silver,35000,15000,18000,Good condition'
  ].join('\n');

  const blob = new Blob([template], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  window.URL.revokeObjectURL(url);
}
