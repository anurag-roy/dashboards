import { clsx, type ClassValue } from 'clsx';
import { format } from 'date-fns';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const focusRing = ['outline outline-offset-2 outline-0 focus-visible:outline-2', 'outline-primary'] as const;

export const formatters = {
  currency: (number: number, currency = 'USD') =>
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(number),
  number: (number: number) => new Intl.NumberFormat('en-US').format(number),
  compact: (number: number) =>
    new Intl.NumberFormat('en-US', {
      notation: 'compact',
      compactDisplay: 'short',
      maximumFractionDigits: 1,
    }).format(number),
  date: (value: string | Date) => format(new Date(value), 'MMM dd, yyyy'),
  dateTime: (value: string | Date) => format(new Date(value), "MMM dd, yyyy 'at' h:mma"),
};

export function daysAgo(days: number) {
  const value = new Date();
  value.setDate(value.getDate() - days);
  return value;
}
