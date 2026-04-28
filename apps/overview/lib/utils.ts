import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const focusRing = ['outline outline-offset-2 outline-0 focus-visible:outline-2', 'outline-primary'] as const;

export function valueFormatter(number: number) {
  return new Intl.NumberFormat('en-US').format(number);
}
