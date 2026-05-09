'use client';

import { CategoryBarCard } from '@/components/ui/overview/dashboard-category-bar-card';
import { ChartCard } from '@/components/ui/overview/dashboard-chart-card';
import { Filterbar } from '@/components/ui/overview/dashboard-filterbar';
import { ProgressBarCard } from '@/components/ui/overview/dashboard-progress-bar-card';
import { overviews } from '@/lib/data/overview-data';
import type { OverviewData } from '@/lib/data/schema';
import { cn } from '@/lib/utils';
import type { KpiEntry, KpiEntryExtended, PeriodValue } from '@/lib/types/overview';
import { subDays, toDate } from 'date-fns';
import * as React from 'react';
import type { DateRange } from 'react-day-picker';

const categories: { title: keyof OverviewData; type: 'currency' | 'unit' }[] = [
  { title: 'Rows read', type: 'unit' },
  { title: 'Rows written', type: 'unit' },
  { title: 'Queries', type: 'unit' },
  { title: 'Payments completed', type: 'currency' },
  { title: 'Sign ups', type: 'unit' },
  { title: 'Logins', type: 'unit' },
  { title: 'Sign outs', type: 'unit' },
  { title: 'Support calls', type: 'unit' },
];

const kpi1: KpiEntry[] = [
  { title: 'Rows read', percentage: 48.1, current: 48.1, allowed: 100, unit: 'M' },
  { title: 'Rows written', percentage: 78.3, current: 78.3, allowed: 100, unit: 'M' },
  { title: 'Storage', percentage: 26, current: 5.2, allowed: 20, unit: 'GB' },
];

const kpi2: KpiEntry[] = [
  { title: 'Weekly active users', percentage: 21.7, current: 21.7, allowed: 100, unit: '%' },
  { title: 'Total users', percentage: 70, current: 28, allowed: 40 },
  { title: 'Uptime', percentage: 98.3, current: 98.3, allowed: 100, unit: '%' },
];

const kpi3: KpiEntryExtended[] = [
  { title: 'Base tier', percentage: 68.1, value: '$200', color: 'bg-chart-1' },
  { title: 'On-demand charges', percentage: 20.8, value: '$61.1', color: 'bg-chart-3' },
  { title: 'Caching', percentage: 11.1, value: '$31.9', color: 'bg-chart-2' },
];

const overviewsDates = overviews.map((item) => toDate(item.date as string | Date).getTime());
const maxDate = toDate(Math.max(...overviewsDates));

export default function OverviewPage() {
  const [selectedDates, setSelectedDates] = React.useState<DateRange | undefined>({
    from: subDays(maxDate, 30),
    to: maxDate,
  });
  const [selectedPeriod, setSelectedPeriod] = React.useState<PeriodValue>('last-year');
  const [selectedCategories, setSelectedCategories] = React.useState<string[]>(categories.map((c) => c.title));

  return (
    <>
      <section aria-labelledby='current-billing-cycle'>
        <h1 id='current-billing-cycle' className='scroll-mt-10 text-lg font-semibold text-foreground sm:text-xl'>
          Current billing cycle
        </h1>
        <div className='mt-4 grid grid-cols-1 gap-14 sm:mt-8 sm:grid-cols-2 lg:mt-10 xl:grid-cols-3'>
          <ProgressBarCard
            title='Usage'
            change='+0.2%'
            value='68.1%'
            valueDescription='of allowed capacity'
            ctaDescription='Monthly usage resets in 12 days.'
            ctaText='Manage plan.'
            ctaLink='#'
            data={kpi1}
          />
          <ProgressBarCard
            title='Workspace'
            change='+2.9%'
            value='21.7%'
            valueDescription='weekly active users'
            ctaDescription='Add up to 20 members in free plan.'
            ctaText='Invite users.'
            ctaLink='#'
            data={kpi2}
          />
          <CategoryBarCard
            title='Costs'
            change='-1.4%'
            value='$293.5'
            valueDescription='current billing cycle'
            subtitle='Current costs'
            ctaDescription='Set hard caps in'
            ctaText='cost spend management.'
            ctaLink='#'
            data={kpi3}
          />
        </div>
      </section>
      <section aria-labelledby='usage-overview'>
        <h1 id='usage-overview' className='mt-16 scroll-mt-8 text-lg font-semibold text-foreground sm:text-xl'>
          Overview
        </h1>
        <div className='sticky top-16 z-30 flex items-center justify-between border-b border-border bg-background pt-4 pb-4 sm:pt-6 md:top-0 md:mx-0 md:px-0 md:pt-8 dark:bg-background'>
          <Filterbar
            maxDate={maxDate}
            minDate={new Date(2024, 0, 1)}
            selectedDates={selectedDates}
            onDatesChange={setSelectedDates}
            selectedPeriod={selectedPeriod}
            onPeriodChange={setSelectedPeriod}
            categories={categories}
            setSelectedCategories={setSelectedCategories}
            selectedCategories={selectedCategories}
          />
        </div>
        <dl className={cn('mt-10 grid grid-cols-1 gap-14 sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-3')}>
          {categories
            .filter((c) => selectedCategories.includes(c.title))
            .map((category) => (
              <ChartCard
                key={category.title}
                title={category.title}
                type={category.type}
                selectedDates={selectedDates}
                selectedPeriod={selectedPeriod}
              />
            ))}
        </dl>
      </section>
    </>
  );
}
