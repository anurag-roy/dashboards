import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const focusInput = ['focus:ring-2', 'focus:ring-ring/30', 'focus:border-primary'] as const;

export const focusRing = ['outline outline-offset-2 outline-0 focus-visible:outline-2', 'outline-primary'] as const;

export const hasErrorInput = ['ring-2', 'border-destructive', 'ring-destructive/20'] as const;

export const usNumberFormatter = (number: number, decimals = 0) =>
  new Intl.NumberFormat('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })
    .format(Number(number))
    .toString();

export const percentageFormatter = (number: number, decimals = 1) => {
  const formattedNumber = new Intl.NumberFormat('en-US', {
    style: 'percent',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(number);
  const symbol = number > 0 && number !== Infinity ? '+' : '';
  return `${symbol}${formattedNumber}`;
};

export const formatters: Record<string, (n: number, currency?: string) => string> = {
  currency: (number: number, currency = 'USD') =>
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
    }).format(number),
  unit: (number: number) => `${usNumberFormatter(number)}`,
};
