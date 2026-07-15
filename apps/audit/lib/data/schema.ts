import { z } from 'zod';

export const transactionSchema = z.object({
  transaction_id: z.string(),
  transaction_date: z.string(),
  expense_status: z.enum(['approved', 'pending', 'actionRequired', 'inAudit']),
  payment_status: z.enum(['processing', 'cleared']),
  merchant: z.string(),
  category: z.string(),
  amount: z.number(),
  currency: z.enum(['usd', 'eur']),
  lastEdited: z.string(),
  continent: z.string(),
  country: z.string(),
});

export type Transaction = z.infer<typeof transactionSchema>;

export const categories = [
  'Office Supplies',
  'Rent',
  'Utilities',
  'Employee Salaries',
  'Marketing',
  'Travel',
  'Training & Development',
  'Consulting Fees',
  'Insurance',
  'Technology & Software',
  'Legal Fees',
  'Subscriptions',
  'Maintenance & Repairs',
  'Shipping & Delivery',
  'Advertising',
] as const;

export const merchants = [
  'Adobe',
  'Amazon',
  'Apple',
  'Delta',
  'DoorDash',
  'Facebook Ads',
  'FedEx',
  'Google Ads',
  'Google',
  'LinkedIn',
  'Microsoft',
  'Notion',
  'Starbucks',
  'Stripe',
  'Twilio',
  'Uber',
  'United Airlines',
] as const;

export const expenseStatuses = [
  { value: 'approved', label: 'Approved', variant: 'success', weight: 0.82 },
  { value: 'pending', label: 'Pending', variant: 'neutral', weight: 0.11 },
  { value: 'actionRequired', label: 'Action required', variant: 'error', weight: 0.05 },
  { value: 'inAudit', label: 'In audit', variant: 'warning', weight: 0.02 },
] as const;

export const paymentStatuses = [
  { value: 'processing', label: 'Processing', weight: 0.06 },
  { value: 'cleared', label: 'Cleared', weight: 0.94 },
] as const;

export const currencies = [
  { value: 'usd', label: 'USD', weight: 0.88 },
  { value: 'eur', label: 'EUR', weight: 0.12 },
] as const;

export const locations = [
  {
    name: 'North America',
    countries: ['United States', 'Canada', 'Mexico'],
    weight: 30,
  },
  {
    name: 'Europe',
    countries: ['Germany', 'France', 'United Kingdom', 'Netherlands', 'Spain'],
    weight: 30,
  },
  {
    name: 'Asia',
    countries: ['India', 'Japan', 'Singapore', 'South Korea'],
    weight: 20,
  },
  {
    name: 'South America',
    countries: ['Brazil', 'Argentina', 'Chile'],
    weight: 10,
  },
  {
    name: 'Australia',
    countries: ['Australia', 'New Zealand'],
    weight: 10,
  },
] as const;

export const departments: { value: string; label: string }[] = [
  { value: 'all-areas', label: 'All areas' },
  { value: 'it', label: 'IT' },
  { value: 'sales', label: 'Sales' },
  { value: 'marketing', label: 'Marketing' },
];

export const roles: { value: string; label: string }[] = [
  { value: 'admin', label: 'Admin' },
  { value: 'member', label: 'Member' },
  { value: 'viewer', label: 'Viewer' },
  { value: 'contributor', label: 'Contributor' },
];
