'use client';

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@workspace/ui/components/accordion';
import { Button } from '@workspace/ui/components/button';

import { DEFAULT_RANGE, type RangeKey } from './dateRanges';
import { FilterAmount } from './FilterAmount';
import { FilterCountry } from './FilterCountry';
import { FilterDate } from './FilterDate';
import { FilterExpenseStatus } from './FilterExpenseStatus';
import type { ReportsFilters } from './types';

type HeaderProps = {
  filters: ReportsFilters;
  refreshedAt: string;
  minAmount: number;
  maxAmount: number;
  onRangeChange: (value: RangeKey) => void;
  onExpenseStatusChange: (value: ReportsFilters['expenseStatus']) => void;
  onCountriesChange: (countries: string[]) => void;
  onAmountChange: (value: [number, number]) => void;
  onReset: () => void;
};

export default function Header({
  filters,
  refreshedAt,
  minAmount,
  maxAmount,
  onRangeChange,
  onExpenseStatusChange,
  onCountriesChange,
  onAmountChange,
  onReset,
}: HeaderProps) {
  return (
    <section
      aria-labelledby='reports-title'
      className='sticky top-16 z-30 -mx-4 border-b border-border/70 bg-background/95 px-4 py-4 backdrop-blur sm:-mx-6 sm:px-6 lg:top-0 lg:-mx-10 lg:px-10'
    >
      <div className='flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between'>
        <div className='space-y-1'>
          <h1 id='reports-title' className='text-lg font-semibold text-foreground sm:text-xl'>
            Reports
          </h1>
          <p className='text-sm text-muted-foreground'>Last refresh: {refreshedAt}</p>
        </div>

        <Accordion className='block border-border md:hidden' defaultValue={[]}>
          <AccordionItem value='filters' className='border-none'>
            <AccordionTrigger className='rounded-2xl px-3 py-2 text-sm'>Filters</AccordionTrigger>
            <AccordionContent className='pb-2'>
              <div className='flex flex-col gap-3'>
                <FilterDate range={filters.range} onRangeChange={onRangeChange} />
                <FilterCountry selectedCountries={filters.selectedCountries} onCountriesChange={onCountriesChange} />
                <FilterExpenseStatus status={filters.expenseStatus} onStatusChange={onExpenseStatusChange} />
                <FilterAmount
                  minAmount={minAmount}
                  maxAmount={maxAmount}
                  amountRange={filters.amountRange}
                  onAmountChange={onAmountChange}
                />
                <Button
                  variant='secondary'
                  onClick={() => {
                    onReset();
                    onRangeChange(DEFAULT_RANGE);
                  }}
                >
                  Reset
                </Button>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        <div className='hidden items-start gap-3 md:flex md:flex-wrap md:justify-end'>
          <FilterDate range={filters.range} onRangeChange={onRangeChange} />
          <FilterCountry selectedCountries={filters.selectedCountries} onCountriesChange={onCountriesChange} />
          <FilterExpenseStatus status={filters.expenseStatus} onStatusChange={onExpenseStatusChange} />
          <FilterAmount
            minAmount={minAmount}
            maxAmount={maxAmount}
            amountRange={filters.amountRange}
            onAmountChange={onAmountChange}
          />
          <div className='flex flex-col gap-1.5'>
            <span className='h-4 shrink-0' aria-hidden='true' />
            <Button
              variant='secondary'
              className='shrink-0'
              onClick={() => {
                onReset();
                onRangeChange(DEFAULT_RANGE);
              }}
            >
              Reset
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
