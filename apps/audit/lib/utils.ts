import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const focusRing = ['outline outline-offset-2 outline-0 focus-visible:outline-2', 'outline-primary'] as const;

const shortMonths = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'] as const;

function formatUtcDate(value: string | Date) {
  const date = new Date(value);

  return `${shortMonths[date.getUTCMonth()]} ${String(date.getUTCDate()).padStart(2, '0')}, ${date.getUTCFullYear()}`;
}

function formatUtcTime(value: string | Date) {
  const date = new Date(value);
  const hours = date.getUTCHours();
  const minutes = String(date.getUTCMinutes()).padStart(2, '0');
  const hour12 = hours % 12 || 12;
  const meridiem = hours >= 12 ? 'PM' : 'AM';

  return `${hour12}:${minutes} ${meridiem}`;
}

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
  date: (value: string | Date) => formatUtcDate(value),
  dateTime: (value: string | Date) => `${formatUtcDate(value)} at ${formatUtcTime(value)}`,
};

export function daysAgo(days: number) {
  const value = new Date();
  value.setDate(value.getDate() - days);
  return value;
}
