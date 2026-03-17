import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getAvailabilityBadge(qty: number) {
  if (qty === 0) return { label: 'Out of Stock', variant: 'destructive' as const, color: 'bg-red-100 text-red-700 border-red-200' }
  if (qty < 5) return { label: 'Low Stock', variant: 'secondary' as const, color: 'bg-amber-100 text-amber-700 border-amber-200' }
  return { label: 'In Stock', variant: 'default' as const, color: 'bg-green-100 text-green-700 border-green-200' }
}

export function formatOrderNumber(id: string, createdAt: Date) {
  const year = new Date(createdAt).getFullYear()
  return `MT-${year}-${id.slice(-5).toUpperCase()}`
}
