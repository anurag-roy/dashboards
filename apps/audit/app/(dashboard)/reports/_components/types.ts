import { expenseStatuses } from '@/lib/data/schema';
import type { RangeKey } from './dateRanges';

export type ExpenseStatusValue = (typeof expenseStatuses)[number]['value'];

export type ReportsFilters = {
  range: RangeKey;
  expenseStatus: 'all' | ExpenseStatusValue;
  amountRange: [number, number];
  selectedCountries: string[];
};
