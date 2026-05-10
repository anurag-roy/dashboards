import { startOfDay, subDays } from 'date-fns';

import {
  categories,
  currencies,
  expenseStatuses,
  locations,
  merchants,
  paymentStatuses,
  type Transaction,
} from './schema';

const locationPairs = locations.flatMap((location) =>
  location.countries.map((country) => ({
    continent: location.name,
    country,
  }))
);

function expenseStatusFor(index: number) {
  const value = (index * 37) % 100;
  if (value < 82) return expenseStatuses[0].value;
  if (value < 93) return expenseStatuses[1].value;
  if (value < 98) return expenseStatuses[2].value;
  return expenseStatuses[3].value;
}

function paymentStatusFor(index: number) {
  return index % 15 === 0 ? paymentStatuses[0].value : paymentStatuses[1].value;
}

function currencyFor(index: number) {
  return index % 9 === 0 ? currencies[1].value : currencies[0].value;
}

const GENERATED_DAY_COUNT = 180;

function dailyTransactionCount(dayIndex: number) {
  const seasonality = Math.sin(dayIndex / 8) * 1.4 + Math.cos(dayIndex / 17) * 1.1;
  const weekdayBump = dayIndex % 7 === 1 || dayIndex % 7 === 2 ? 1 : 0;
  return Math.max(3, Math.min(9, Math.round(5 + seasonality + weekdayBump)));
}

function dailyAmountBase(dayIndex: number) {
  const seasonal = 2800 + Math.sin(dayIndex / 9) * 700 + Math.cos(dayIndex / 21) * 500;
  const gentleTrend = (dayIndex % 45) * 12;
  return seasonal + gentleTrend;
}

export function getRollingTransactions(referenceDate: Date = new Date()): Transaction[] {
  const baseDate = startOfDay(referenceDate);
  const generatedTransactions: Transaction[] = [];
  let transactionSequence = 1;

  for (let dayIndex = 0; dayIndex < GENERATED_DAY_COUNT; dayIndex += 1) {
    const transactionDate = subDays(baseDate, dayIndex);
    const transactionsPerDay = dailyTransactionCount(dayIndex);
    const dayBaseAmount = dailyAmountBase(dayIndex);

    for (let itemIndex = 0; itemIndex < transactionsPerDay; itemIndex += 1) {
      const transactionIndex = dayIndex * 10 + itemIndex;
      const location = locationPairs[(transactionIndex * 3) % locationPairs.length]!;
      const spread = ((transactionIndex * 53) % 240) - 120;
      const weightedShare = (itemIndex + 1) / (transactionsPerDay + 2);
      const amount = Math.max(95, Math.round(dayBaseAmount * weightedShare * 0.52 + spread));

      generatedTransactions.push({
        transaction_id: `txn_${String(transactionSequence).padStart(5, '0')}`,
        transaction_date: transactionDate.toISOString(),
        expense_status: expenseStatusFor(transactionIndex),
        payment_status: paymentStatusFor(transactionIndex),
        merchant: merchants[(transactionIndex * 5) % merchants.length]!,
        category: categories[(transactionIndex * 7) % categories.length]!,
        amount,
        currency: currencyFor(transactionIndex),
        lastEdited: subDays(transactionDate, (transactionIndex % 4) + 1).toISOString(),
        continent: location.continent,
        country: location.country,
      });

      transactionSequence += 1;
    }
  }

  return generatedTransactions.sort((a, b) => b.transaction_date.localeCompare(a.transaction_date));
}

export const transactions: Transaction[] = getRollingTransactions();
