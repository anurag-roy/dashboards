'use client';

import { useDeferredValue, useMemo, useState } from 'react';
import { subDays } from 'date-fns';

import Header from './Header';
import { DEFAULT_RANGE, RANGE_DAYS, type RangeKey } from './dateRanges';
import { TransactionChart } from './TransactionChart';
import type { ReportsFilters } from './types';
import type { Transaction } from '@/lib/data/schema';

type ReportsClientProps = {
  transactions: Transaction[];
  referenceDateIso: string;
  refreshedAt: string;
};

export function ReportsClient({ transactions, referenceDateIso, refreshedAt }: ReportsClientProps) {
  const referenceDate = useMemo(() => new Date(referenceDateIso), [referenceDateIso]);

  const [minAmount, maxAmount] = useMemo(() => {
    const amounts = transactions.map((transaction) => transaction.amount);
    return [Math.min(...amounts), Math.max(...amounts)];
  }, [transactions]);

  const defaultFilters = useMemo<ReportsFilters>(
    () => ({
      range: DEFAULT_RANGE,
      expenseStatus: 'all',
      amountRange: [minAmount, maxAmount],
      selectedCountries: [],
    }),
    [maxAmount, minAmount]
  );

  const [filters, setFilters] = useState<ReportsFilters>(defaultFilters);
  const deferredFilters = useDeferredValue(filters);

  const filteredTransactions = useMemo(() => {
    const rangeStartDate = subDays(referenceDate, RANGE_DAYS[deferredFilters.range] - 1);
    const { expenseStatus, amountRange, selectedCountries } = deferredFilters;
    const [rangeMin, rangeMax] = amountRange;
    const countrySet = selectedCountries.length === 0 ? null : new Set<string>(selectedCountries);

    return transactions.filter((transaction) => {
      const statusMatch = expenseStatus === 'all' || transaction.expense_status === expenseStatus;
      const amountMatch = transaction.amount >= rangeMin && transaction.amount <= rangeMax;
      const countryMatch = countrySet === null || countrySet.has(transaction.country);
      const dateMatch = new Date(transaction.transaction_date) >= rangeStartDate;
      return statusMatch && amountMatch && countryMatch && dateMatch;
    });
  }, [deferredFilters, referenceDate, transactions]);

  return (
    <>
      <Header
        filters={filters}
        refreshedAt={refreshedAt}
        minAmount={minAmount}
        maxAmount={maxAmount}
        transactions={transactions}
        onRangeChange={(value: RangeKey) => setFilters((prev) => ({ ...prev, range: value }))}
        onExpenseStatusChange={(value) => setFilters((prev) => ({ ...prev, expenseStatus: value }))}
        onCountriesChange={(countries) => setFilters((prev) => ({ ...prev, selectedCountries: countries }))}
        onAmountChange={(value) => setFilters((prev) => ({ ...prev, amountRange: value }))}
        onReset={() => setFilters(defaultFilters)}
      />

      <section className='mt-6 space-y-10'>
        <TransactionChart
          type='amount'
          transactions={filteredTransactions}
          yAxisWidth={40}
          className='hidden sm:block'
        />
        <TransactionChart type='amount' transactions={filteredTransactions} showYAxis={false} className='sm:hidden' />

        <TransactionChart
          type='count'
          transactions={filteredTransactions}
          yAxisWidth={40}
          className='hidden sm:block'
        />
        <TransactionChart type='count' transactions={filteredTransactions} showYAxis={false} className='sm:hidden' />

        <div className='grid grid-cols-1 gap-6 lg:grid-cols-2'>
          <TransactionChart type='category' transactions={filteredTransactions} yAxisWidth={80} />
          <TransactionChart type='merchant' transactions={filteredTransactions} yAxisWidth={60} />
        </div>
      </section>
    </>
  );
}
