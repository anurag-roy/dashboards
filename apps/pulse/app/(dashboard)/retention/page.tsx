'use client';

import { cohorts } from '@/lib/data/retention/cohorts';
import { cohortsAggregate } from '@/lib/data/retention/cohortsAggregate';
import type {
  ActivitySummary,
  ChannelDistribution,
  CohortData,
  CohortRetentionData,
  PerformanceMetrics,
  SatisfactionMetrics,
  TopIssue,
} from '@/lib/data/retention/schema';
import { cn, focusRing, valueFormatter } from '@/lib/utils';
import { Button } from '@workspace/ui/components/button';
import { Card, CardContent } from '@workspace/ui/components/card';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@workspace/ui/components/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@workspace/ui/components/table';
import { Maximize2, X } from 'lucide-react';
import { useState } from 'react';

const HEATMAP_COLOR_CLASSES = [
  'bg-emerald-50 dark:bg-emerald-950',
  'bg-emerald-100 dark:bg-emerald-900',
  'bg-emerald-200 dark:bg-emerald-800',
  'bg-emerald-300 dark:bg-emerald-700',
  'bg-emerald-400 dark:bg-emerald-600',
  'bg-emerald-500 dark:bg-emerald-500',
  'bg-emerald-600 dark:bg-emerald-400',
] as const;

function getBackgroundColor(value: number, minValue: number, maxValue: number) {
  const normalizedValue = (value - minValue) / (maxValue - minValue);
  const index = Math.min(Math.floor(normalizedValue * HEATMAP_COLOR_CLASSES.length), HEATMAP_COLOR_CLASSES.length - 1);
  return HEATMAP_COLOR_CLASSES[index];
}

function getHeatmapTextColor(value: number, minValue: number, maxValue: number) {
  return (value - minValue) / (maxValue - minValue) > 0.6 ? 'text-white dark:text-white' : 'text-foreground';
}

type CohortDetailsDialogProps = {
  cohort: CohortData | null;
  cohortKey: string | null;
  onClose: () => void;
};

function CohortDetailsDialog({ cohort, cohortKey, onClose }: CohortDetailsDialogProps) {
  if (!cohort) return null;

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        showCloseButton={false}
        className='flex max-h-[min(calc(100vh-2rem),880px)] w-[calc(100vw-2rem)] max-w-2xl flex-col gap-0 overflow-hidden rounded-3xl border-border p-0 sm:max-w-3xl'
      >
        <DialogHeader className='flex-none gap-2 border-b border-border px-6 py-4'>
          <DialogClose
            render={
              <Button variant='ghost' size='icon-sm' className='absolute top-4 right-4 shrink-0' aria-label='Close' />
            }
          >
            <X className='size-5' />
          </DialogClose>
          <DialogTitle className='pr-12 text-lg font-semibold'>Cohort Details</DialogTitle>
          <DialogDescription className='text-sm'>
            Detailed metrics for cohort starting {cohortKey} with {cohort.size} initial customers
          </DialogDescription>
        </DialogHeader>

        <div className='flex-1 overflow-y-auto px-6 py-4'>
          <div className='space-y-6'>
            <section>
              <h3 className='mb-3 font-medium text-foreground'>Activity Summary</h3>
              <div className='grid grid-cols-1 gap-3 sm:grid-cols-2'>
                {Object.entries(cohort.summary.activity as Record<keyof ActivitySummary, number>).map(
                  ([key, value]) => (
                    <div
                      key={key}
                      className='flex items-center justify-between rounded-2xl border border-border bg-muted/50 px-3 py-2.5'
                    >
                      <span className='text-sm text-muted-foreground capitalize'>{key.replace(/_/g, ' ')}:</span>
                      <span className='font-medium text-foreground'>{value.toLocaleString()}</span>
                    </div>
                  )
                )}
              </div>
            </section>

            <section>
              <h3 className='mb-3 font-medium text-foreground'>Customer Satisfaction</h3>
              <div className='grid grid-cols-1 gap-3 sm:grid-cols-2'>
                {Object.entries(cohort.summary.satisfaction as Record<keyof SatisfactionMetrics, number>).map(
                  ([key, value]) => (
                    <div
                      key={key}
                      className='flex items-center justify-between rounded-2xl border border-border bg-muted/50 px-3 py-2.5'
                    >
                      <span className='text-sm text-muted-foreground capitalize'>{key.replace(/_/g, ' ')}:</span>
                      <span className='font-medium text-foreground'>
                        {key.includes('score') ? `${value}%` : value.toLocaleString()}
                      </span>
                    </div>
                  )
                )}
              </div>
            </section>

            <section>
              <h3 className='mb-3 font-medium text-foreground'>Performance Metrics</h3>
              <div className='grid grid-cols-1 gap-3 sm:grid-cols-2'>
                {Object.entries(cohort.summary.performance as Record<keyof PerformanceMetrics, number>).map(
                  ([key, value]) => (
                    <div
                      key={key}
                      className='flex items-center justify-between rounded-2xl border border-border bg-muted/50 px-3 py-2.5'
                    >
                      <span className='text-sm text-muted-foreground capitalize'>{key.replace(/_/g, ' ')}:</span>
                      <span className='font-medium text-foreground'>
                        {key.includes('rate') ? `${(value * 100).toFixed(1)}%` : `${value} mins`}
                      </span>
                    </div>
                  )
                )}
              </div>
            </section>

            <section>
              <h3 className='mb-3 font-medium text-foreground'>Top Issues</h3>
              <div className='space-y-3'>
                {cohort.summary.top_issues.map((issue: TopIssue, index: number) => (
                  <div key={`${issue.category}-${index}`} className='rounded-2xl border border-border bg-muted/50 p-3'>
                    <div className='flex items-center justify-between'>
                      <span className='font-medium text-foreground'>{issue.category}</span>
                      <span className='text-sm text-muted-foreground'>{issue.count} tickets</span>
                    </div>
                    <div className='mt-2 h-2 overflow-hidden rounded-full bg-muted'>
                      <div
                        className='h-full rounded-full bg-primary'
                        style={{ width: `${issue.resolution_rate * 100}%` }}
                      />
                    </div>
                    <div className='mt-1 text-sm text-muted-foreground'>
                      {(issue.resolution_rate * 100).toFixed(1)}% resolved
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <h3 className='mb-3 font-medium text-foreground'>Channel Distribution</h3>
              <div className='grid grid-cols-2 gap-3 sm:grid-cols-4'>
                {Object.entries(cohort.summary.channels as Record<keyof ChannelDistribution, number>).map(
                  ([channel, value]) => (
                    <div key={channel} className='rounded-2xl border border-border bg-muted/50 px-3 py-3 text-center'>
                      <span className='mb-1 block text-sm text-muted-foreground capitalize'>{channel}</span>
                      <span className='block text-lg font-medium text-foreground'>{value}%</span>
                    </div>
                  )
                )}
              </div>
            </section>
          </div>
        </div>

        <DialogFooter className='flex-none border-t border-border px-6 py-4'>
          <DialogClose render={<Button variant='secondary' type='button' />}>Close</DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default function CohortRetentionPage() {
  const [selectedCohort, setSelectedCohort] = useState<CohortData | null>(null);
  const [selectedCohortKey, setSelectedCohortKey] = useState<string | null>(null);

  const allCohortEntries = Object.entries(cohorts as CohortRetentionData);
  const cohortEntries = allCohortEntries.slice(0, -1);
  const maxWeeks = 9;
  const weeks = Array.from({ length: maxWeeks }, (_, i) => i);

  const agg = cohortsAggregate.aggregateMetrics;
  const commonIssuesSorted = [...cohortsAggregate.commonIssues].sort((a, b) => b.totalCount - a.totalCount);
  const issuesTotal = cohortsAggregate.commonIssues.reduce((sum, issue) => sum + issue.totalCount, 0);

  return (
    <main className='mx-auto w-full max-w-7xl px-4 pt-8 pb-12 sm:px-6 lg:px-8'>
      <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
        <div>
          <h1 className='text-2xl font-semibold text-foreground'>Cohort Retention</h1>
          <p className='text-muted-foreground sm:text-sm/6'>
            Track customer engagement patterns and analyze support trends across user segments
          </p>
        </div>
      </div>

      <section className='mt-8'>
        <div className='relative w-full'>
          <Table className='border-none'>
            <TableHeader>
              <TableRow className='border-none hover:bg-transparent'>
                <TableHead className='sticky left-0 z-20 min-w-36 bg-background px-2 shadow-[1px_0_0_0_hsl(var(--border))]'>
                  <span className='block font-medium'>Cohort</span>
                  <span className='block font-normal text-muted-foreground'>Initial customers</span>
                </TableHead>
                {weeks.map((week) => (
                  <TableHead key={week} className='border-none px-0.5 font-medium'>
                    Week {week}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {cohortEntries.map(([cohortKey, cohortData]: [string, CohortData], rowIndex) => {
                const visibleWeeks = maxWeeks - rowIndex;

                return (
                  <TableRow key={cohortKey} className='h-full border-none hover:bg-transparent'>
                    <TableCell className='sticky left-0 z-20 h-full bg-background p-0 shadow-[1px_0_0_0_hsl(var(--border))]'>
                      <button
                        type='button'
                        className={cn(
                          'group relative h-full w-full rounded-lg p-2.5 text-left transition hover:bg-muted focus-visible:bg-muted',
                          focusRing
                        )}
                        onClick={() => {
                          setSelectedCohort(cohortData);
                          setSelectedCohortKey(cohortKey);
                        }}
                      >
                        <Maximize2 className='absolute top-2.5 right-2 size-4 shrink-0 text-muted-foreground opacity-0 transition group-hover:opacity-100 group-focus-visible:opacity-100' />
                        <span className='block text-sm font-medium text-foreground'>{cohortKey}</span>
                        <span className='mt-0.5 block text-sm text-muted-foreground'>
                          {valueFormatter(cohortData.size)} customers
                        </span>
                      </button>
                    </TableCell>
                    {weeks.map((weekIndex) => (
                      <TableCell key={weekIndex} className='h-full p-[2px] align-middle'>
                        {weekIndex >= visibleWeeks ? (
                          <div className='flex h-[58px] flex-col justify-center rounded-md border border-dashed border-border bg-muted/40 px-3 py-2.5'>
                            <span className='h-3 w-8 rounded-sm bg-muted' />
                            <span className='mt-1 h-3 w-5 rounded-sm bg-muted' />
                          </div>
                        ) : cohortData.weeks[weekIndex] === null || cohortData.weeks[weekIndex] === undefined ? (
                          <div className='flex h-[58px] flex-col justify-center rounded-md border border-dashed border-border bg-muted/40 px-3 py-2.5'>
                            <span className='h-3 w-8 rounded-sm bg-muted' />
                            <span className='mt-1 h-3 w-5 rounded-sm bg-muted' />
                          </div>
                        ) : (
                          <div
                            className={cn(
                              'flex h-full min-h-[58px] flex-col justify-center rounded-md px-3 py-2.5',
                              getBackgroundColor(cohortData.weeks[weekIndex]!.percentage, 0, 100),
                              getHeatmapTextColor(cohortData.weeks[weekIndex]!.percentage, 0, 100)
                            )}
                          >
                            <span className='block text-sm font-medium'>
                              {cohortData.weeks[weekIndex]!.percentage.toFixed(1)}%
                            </span>
                            <span
                              className={cn(
                                'mt-0.5 block text-sm',
                                getHeatmapTextColor(cohortData.weeks[weekIndex]!.percentage, 0, 100)
                              )}
                            >
                              {cohortData.weeks[weekIndex]!.count}
                            </span>
                          </div>
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>

        <CohortDetailsDialog
          cohort={selectedCohort}
          cohortKey={selectedCohortKey}
          onClose={() => {
            setSelectedCohort(null);
            setSelectedCohortKey(null);
          }}
        />
      </section>

      <section className='mt-12'>
        <h2 className='text-xl font-semibold text-foreground'>Cohort Analytics</h2>

        <div className='mt-8 grid grid-cols-1 gap-5 lg:grid-cols-8'>
          <Card className='rounded-3xl shadow-sm lg:col-span-6'>
            <CardContent className='pt-0'>
              <p className='font-semibold text-foreground'>Cohort Statistics</p>
              <dl className='mt-4 grid grid-cols-1 gap-6 md:grid-cols-3'>
                <div className='space-y-6'>
                  <div>
                    <dt className='text-sm text-muted-foreground'>Total Users</dt>
                    <dd className='mt-1 flex items-baseline'>
                      <span className='text-2xl font-semibold text-foreground'>
                        {cohortsAggregate.totalUsers.toLocaleString()}
                      </span>
                      <span className='ml-2 text-sm text-emerald-600 dark:text-emerald-500'>+17%</span>
                    </dd>
                  </div>
                  <div>
                    <dt className='text-sm text-muted-foreground'>Average CSAT Score</dt>
                    <dd className='mt-1 flex items-baseline'>
                      <span className='text-2xl font-semibold text-foreground'>
                        {agg.satisfaction.avgCsatScore.toFixed(1)}
                      </span>
                      <span className='ml-2 text-sm text-emerald-600 dark:text-emerald-500'>+6%</span>
                    </dd>
                  </div>
                  <div>
                    <dt className='text-sm text-muted-foreground'>Average Response Time</dt>
                    <dd className='mt-1 flex items-baseline'>
                      <span className='text-2xl font-semibold text-foreground'>
                        {agg.performance.avgResponseTimeMinutes.toFixed(1)}m
                      </span>
                      <span className='ml-2 text-sm text-emerald-600 dark:text-emerald-500'>+12%</span>
                    </dd>
                  </div>
                </div>

                <div className='space-y-6'>
                  <div>
                    <dt className='text-sm text-muted-foreground'>Total Tickets</dt>
                    <dd className='mt-1 flex items-baseline'>
                      <span className='text-2xl font-semibold text-foreground'>
                        {agg.activity.totalTicketsCreated.toLocaleString()}
                      </span>
                      <span className='ml-2 text-sm text-emerald-600 dark:text-emerald-500'>+11%</span>
                    </dd>
                  </div>
                  <div>
                    <dt className='text-sm text-muted-foreground'>Resolution Rate</dt>
                    <dd className='mt-1 flex items-baseline'>
                      <span className='text-2xl font-semibold text-foreground'>
                        {(agg.activity.ticketResolutionRate * 100).toFixed(1)}%
                      </span>
                      <span className='ml-2 text-sm text-emerald-600 dark:text-emerald-500'>+2%</span>
                    </dd>
                  </div>
                  <div>
                    <dt className='text-sm text-muted-foreground'>Total Cohorts</dt>
                    <dd className='mt-1 flex items-baseline'>
                      <span className='text-2xl font-semibold text-foreground'>{cohortsAggregate.totalCohorts}</span>
                      <span className='ml-2 text-sm text-emerald-600 dark:text-emerald-500'>+5%</span>
                    </dd>
                  </div>
                </div>

                <div className='space-y-6'>
                  <div>
                    <dt className='text-sm text-muted-foreground'>Avg. Handling Time</dt>
                    <dd className='mt-1 flex items-baseline'>
                      <span className='text-2xl font-semibold text-foreground'>
                        {agg.performance.avgHandlingTimeMinutes.toFixed(1)}m
                      </span>
                      <span className='ml-2 text-sm text-emerald-600 dark:text-emerald-500'>+21%</span>
                    </dd>
                  </div>
                  <div>
                    <dt className='text-sm text-muted-foreground'>First Contact Resolution</dt>
                    <dd className='mt-1 flex items-baseline'>
                      <span className='text-2xl font-semibold text-foreground'>
                        {(agg.performance.avgFirstContactResolutionRate * 100).toFixed(1)}%
                      </span>
                      <span className='ml-2 text-sm text-emerald-600 dark:text-emerald-500'>+3%</span>
                    </dd>
                  </div>
                  <div>
                    <dt className='text-sm text-muted-foreground'>Retention Rate</dt>
                    <dd className='mt-1 flex items-baseline'>
                      <span className='text-2xl font-semibold text-foreground'>
                        {agg.retention.overallRetentionRate.toFixed(1)}%
                      </span>
                      <span className='ml-2 text-sm text-emerald-600 dark:text-emerald-500'>+2%</span>
                    </dd>
                  </div>
                </div>
              </dl>
            </CardContent>
          </Card>

          <Card className='rounded-3xl shadow-sm lg:col-span-2'>
            <CardContent className='pt-0'>
              <p className='font-semibold text-foreground'>Top Issues</p>
              <ol className='mt-4 divide-y divide-border'>
                {commonIssuesSorted.slice(0, 6).map((issue, index) => (
                  <li key={issue.category} className='flex items-center justify-between gap-2 py-2 first:pt-0'>
                    <div className='flex min-w-0 items-center gap-2'>
                      <span className='shrink-0 text-sm text-muted-foreground'>{index + 1}.</span>
                      <span className='truncate text-sm font-medium text-foreground'>{issue.category}</span>
                    </div>
                    <div className='shrink-0 text-sm text-muted-foreground tabular-nums'>
                      {issuesTotal > 0 ? Math.round((issue.totalCount / issuesTotal) * 100) : 0}% (
                      {issue.totalCount.toLocaleString()})
                    </div>
                  </li>
                ))}
              </ol>
            </CardContent>
          </Card>
        </div>
      </section>
    </main>
  );
}
