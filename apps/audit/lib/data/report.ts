import { format } from 'date-fns';

import { transactions } from './transactions';

type DailyTotals = {
  total: number;
  approved: number;
  blocked: number;
};

const byDate = new Map<string, DailyTotals>();

for (const transaction of transactions) {
  const dateKey = format(transaction.transaction_date, 'yyyy-MM-dd');
  const entry = byDate.get(dateKey) ?? { total: 0, approved: 0, blocked: 0 };
  entry.total += transaction.amount;
  if (transaction.expense_status === 'approved') {
    entry.approved += transaction.amount;
  } else {
    entry.blocked += transaction.amount;
  }
  byDate.set(dateKey, entry);
}

export const aggregatedReport = Array.from(byDate.entries())
  .sort(([a], [b]) => a.localeCompare(b))
  .map(([date, totals]) => ({
    date: `${date}T00:00:00`,
    amounts: [
      { amount: Math.round(totals.total), status: 'total' },
      { amount: Math.round(totals.approved), status: 'approved' },
      { amount: Math.round(totals.blocked), status: 'blocked' },
    ],
  }));
