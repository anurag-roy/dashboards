'use client';

import { useDeferredValue, useMemo, useState } from 'react';
import { format, subDays } from 'date-fns';

import { transactions } from '@/lib/data/transactions';
import Header from './_components/Header';
import { DEFAULT_RANGE, RANGE_DAYS, type RangeKey } from './_components/dateRanges';
import { TransactionChart } from './_components/TransactionChart';
import type { ReportsFilters } from './_components/types';

export default function ReportsPage() {
  const [minAmount, maxAmount] = useMemo(() => {
    const amounts = transactions.map((transaction) => transaction.amount);
    return [Math.min(...amounts), Math.max(...amounts)];
  }, []);

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
  const refreshedAt = useMemo(
    () => format(new Date(transactions[0]?.transaction_date ?? '2026-04-25T12:00:00.000Z'), "dd/MM/yyyy 'at' HH:mm"),
    []
  );

  const filteredTransactions = useMemo(() => {
    const rangeStartDate = subDays(new Date(), RANGE_DAYS[deferredFilters.range]);
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
  }, [deferredFilters]);

  return (
    <>
      <Header
        filters={filters}
        refreshedAt={refreshedAt}
        minAmount={minAmount}
        maxAmount={maxAmount}
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
          yAxisWidth={70}
          className='hidden sm:block'
        />
        <TransactionChart type='amount' transactions={filteredTransactions} showYAxis={false} className='sm:hidden' />

        <TransactionChart
          type='count'
          transactions={filteredTransactions}
          yAxisWidth={70}
          className='hidden sm:block'
        />
        <TransactionChart type='count' transactions={filteredTransactions} showYAxis={false} className='sm:hidden' />

        <div className='grid grid-cols-1 gap-6 lg:grid-cols-2'>
          <TransactionChart type='category' transactions={filteredTransactions} yAxisWidth={110} />
          <TransactionChart type='merchant' transactions={filteredTransactions} yAxisWidth={110} />
        </div>
      </section>
    </>
  );
}
