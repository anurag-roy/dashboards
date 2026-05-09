'use client';

import { RotateCcw } from 'lucide-react';
import React from 'react';

import { workflowStats } from '@/lib/data/workflow/workflow-data';
import { departments } from '@/lib/data/workflow/schema';
import { cn, valueFormatter } from '@/lib/utils';

import { Button } from '@workspace/ui/components/button';
import { Checkbox } from '@workspace/ui/components/checkbox';
import { Input } from '@workspace/ui/components/input';
import { Label } from '@workspace/ui/components/label';
import { ProgressCircle } from '@workspace/ui/components/progress-circle';
import { Separator } from '@workspace/ui/components/separator';
import { Slider } from '@workspace/ui/components/slider';

export default function WorkflowPage() {
  const data = React.useMemo(() => workflowStats, []);

  const [excludedDepartments, setExcludedDepartments] = React.useState<Set<string>>(new Set());

  const aggregateStats = React.useMemo(() => {
    const row = data[0];
    if (!row) {
      return {
        total_cases: 0,
        tested_cases: 0,
        untested_cases: 0,
        error_free_cases: 0,
        corrected_cases: 0,
      };
    }
    const selectedStats = row.department_stats.filter((dept) => !excludedDepartments.has(dept.department));

    return {
      total_cases: selectedStats.reduce((sum, dept) => sum + dept.total_cases, 0),
      tested_cases: selectedStats.reduce((sum, dept) => sum + dept.tested_cases, 0),
      untested_cases: selectedStats.reduce((sum, dept) => sum + dept.untested_cases, 0),
      error_free_cases: selectedStats.reduce((sum, dept) => sum + dept.error_free_cases, 0),
      corrected_cases: selectedStats.reduce((sum, dept) => sum + dept.corrected_cases, 0),
    };
  }, [data, excludedDepartments]);

  const actualQuota = React.useMemo(() => {
    return aggregateStats.total_cases === 0
      ? 0
      : Math.round((aggregateStats.tested_cases / aggregateStats.total_cases) * 100);
  }, [aggregateStats]);

  const [scenarioQuota, setScenarioQuota] = React.useState<number>(actualQuota);

  React.useEffect(() => {
    setScenarioQuota(actualQuota);
  }, [actualQuota]);

  const calculatePercentage = (numerator: number, denominator: number) => {
    if (denominator === 0) return 0;
    return (numerator / denominator) * 100;
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = Math.min(Math.max(0, Number(event.target.value)), 100);
    setScenarioQuota(value);
  };

  const scenarioStats = React.useMemo(() => {
    const newTestedCases = Math.round((scenarioQuota / 100) * aggregateStats.total_cases);
    const newUntestedCases = aggregateStats.total_cases - newTestedCases;

    const originalErrorRatio = aggregateStats.error_free_cases / aggregateStats.tested_cases;
    const newErrorFreeCases = Math.round(newTestedCases * originalErrorRatio);
    const newCorrectedCases = newTestedCases - newErrorFreeCases;

    return {
      total_cases: aggregateStats.total_cases,
      tested_cases: newTestedCases,
      untested_cases: newUntestedCases,
      error_free_cases: newErrorFreeCases,
      corrected_cases: newCorrectedCases,
    };
  }, [aggregateStats, scenarioQuota]);

  const displayStats = scenarioQuota === actualQuota ? aggregateStats : scenarioStats;

  const handleDepartmentToggle = (department: string) => {
    setExcludedDepartments((prev) => {
      const nextSet = new Set(prev);
      if (nextSet.has(department)) {
        nextSet.delete(department);
      } else {
        nextSet.add(department);
      }
      return nextSet;
    });
  };

  const COST_ASSUMPTIONS = {
    testCostPerCase: 50,
    errorCorrectionCost: 200,
    undetectedErrorCost: 800,
    casesPerFTEAnnually: 250,
    expectedErrorRate: 0.15,
  };

  const GROWTH_FACTORS = {
    SAVINGS_BASE: 1.1,
    SAVINGS_ACCELERATION: 1.05,
    FTE_BASE: 1.08,
    FTE_ACCELERATION: 1.03,
  };

  const calculateImpact = (stats: typeof displayStats) => {
    const untested = stats.untested_cases;
    const tested = stats.tested_cases;
    const corrected = stats.corrected_cases;

    const testingCosts = tested * COST_ASSUMPTIONS.testCostPerCase;

    const correctionCosts = corrected * COST_ASSUMPTIONS.errorCorrectionCost;

    const undetectedErrors = Math.round(untested * COST_ASSUMPTIONS.expectedErrorRate);
    const undetectedErrorCosts = undetectedErrors * COST_ASSUMPTIONS.undetectedErrorCost;

    const baselineErrorCosts = Math.round(
      stats.total_cases * COST_ASSUMPTIONS.expectedErrorRate * COST_ASSUMPTIONS.undetectedErrorCost
    );

    const totalCosts = testingCosts + correctionCosts + undetectedErrorCosts;

    const savings = baselineErrorCosts - totalCosts;

    const testingFTE = tested / COST_ASSUMPTIONS.casesPerFTEAnnually;

    const correctionFTE = corrected / (COST_ASSUMPTIONS.casesPerFTEAnnually * 2);

    const preventionFTE = (baselineErrorCosts - undetectedErrorCosts) / (COST_ASSUMPTIONS.undetectedErrorCost * 100);

    const netFTEImpact = preventionFTE - (testingFTE + correctionFTE);

    return {
      costs: totalCosts,
      savings,
      fteImpact: netFTEImpact,
    };
  };

  const currentImpact = calculateImpact(aggregateStats);
  const scenarioImpact =
    scenarioQuota === actualQuota
      ? { costs: currentImpact.costs, savings: 0, fteImpact: 0 }
      : calculateImpact(displayStats);

  return (
    <main>
      <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
        <div>
          <h1 className='text-2xl font-semibold text-foreground'>Workflow</h1>
          <p className='text-muted-foreground sm:text-sm/6'>
            Analyze case testing efficiency and simulate cost impacts across departments
          </p>
        </div>
      </div>
      <Separator className='my-6' />

      <div className='flex w-full flex-wrap items-start gap-6 rounded-3xl bg-muted/50 p-6 shadow-sm ring-1 ring-border'>
        <div className='w-full sm:w-96'>
          <Label htmlFor='test-quota-slider' className='text-base font-medium sm:text-sm'>
            Test Quota (%)
          </Label>
          <div className='mt-2 flex items-center gap-4'>
            <Slider
              aria-labelledby='test-quota-slider'
              id='test-quota-slider'
              value={[scenarioQuota]}
              onValueChange={(value) => {
                const next = Array.isArray(value) ? (value[0] ?? 0) : value;
                setScenarioQuota(next);
              }}
              min={0}
              max={100}
              step={5}
              disabled={excludedDepartments.size === departments.length}
              className='min-w-0 flex-1 sm:max-w-56'
            />
            <label htmlFor='quota' className='sr-only'>
              Scenario Quota (percent)
            </label>
            <Input
              id='quota'
              type='number'
              value={scenarioQuota}
              onChange={handleInputChange}
              min={0}
              max={100}
              disabled={excludedDepartments.size === departments.length}
              className='w-20 shrink-0 sm:w-16'
            />
            {scenarioQuota !== actualQuota ? (
              <Button
                type='button'
                onClick={() => setScenarioQuota(actualQuota)}
                variant='ghost'
                size='icon-sm'
                className='group -ml-2.5 shrink-0 py-2.5 sm:-ml-2.5 sm:py-2'
                aria-label='Reset scenario quota to current aggregate'
              >
                <RotateCcw className='size-5 text-muted-foreground transition group-hover:-rotate-45 group-hover:text-foreground' />
              </Button>
            ) : null}
          </div>
          <p className='mt-1 flex items-center gap-2 text-sm tabular-nums'>
            <span className='text-muted-foreground'>Current: {actualQuota}%</span>
            <span className='text-foreground'>Scenario: {scenarioQuota}%</span>
          </p>
        </div>

        <div className='flex-auto'>
          <legend className='font-medium text-foreground sm:text-sm'>Select department to exclude</legend>
          <div className='mt-5 grid grid-cols-1 gap-4 sm:grid-cols-3'>
            {(data[0]?.department_stats ?? []).map((dept) => {
              const excluded = excludedDepartments.has(dept.department);
              return (
                <div key={dept.department} className='flex items-center gap-2.5'>
                  <Checkbox
                    id={dept.department}
                    checked={excluded}
                    onCheckedChange={() => handleDepartmentToggle(dept.department)}
                    aria-label={`Exclude ${dept.department_label}`}
                  />
                  <Label
                    htmlFor={dept.department}
                    className={cn(
                      'cursor-pointer text-base whitespace-nowrap sm:text-sm',
                      excluded && 'text-muted-foreground line-through decoration-muted-foreground'
                    )}
                  >
                    {dept.department_label}
                  </Label>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <section className='relative mt-12 p-4'>
        {excludedDepartments.size === departments.length ? (
          <div className='absolute inset-0 z-10 bg-background/60 backdrop-blur-[2px]'>
            <div className='flex min-h-full items-center justify-center px-4'>
              <div className='flex max-w-sm flex-col items-center justify-center gap-4 rounded-3xl bg-card p-6 text-center text-sm text-foreground shadow-sm ring-1 ring-border'>
                You must include at least one department
                <Button
                  variant='secondary'
                  type='button'
                  className='w-full'
                  onClick={() => setExcludedDepartments(new Set())}
                >
                  Reset departments
                </Button>
              </div>
            </div>
          </div>
        ) : null}

        {/* Desktop: horizontal 5-column grid */}
        <div className='relative hidden min-w-[40rem] grid-cols-5 md:grid'>
          <div className='flex flex-col items-center gap-6'>
            <h2 className='text-sm font-medium text-nowrap text-foreground'>1. Completed Cases</h2>
            <div className='flex justify-center'>
              <ProgressCircle radius={45} strokeWidth={6} value={displayStats.total_cases}>
                <div className='flex flex-col items-center'>
                  <span className='mt-1 font-medium text-foreground tabular-nums'>
                    {valueFormatter(displayStats.total_cases)}
                  </span>
                  <span className='text-xs font-medium text-muted-foreground tabular-nums'>100%</span>
                </div>
              </ProgressCircle>
            </div>
          </div>

          <div className='mt-24 min-w-32'>
            <div className='w-full border-t border-dashed border-border' />
            <div className='mx-auto h-48 w-px border-l border-dashed border-border' />
            <div className='ml-auto w-1/2 border-t border-dashed border-border' />
          </div>

          <div className='flex flex-col items-center gap-6'>
            <h2 className='text-sm font-medium text-nowrap text-foreground'>2. Test Results</h2>
            <div>
              <div className='flex justify-center'>
                <ProgressCircle
                  radius={45}
                  strokeWidth={6}
                  value={calculatePercentage(displayStats.tested_cases, displayStats.total_cases)}
                >
                  <div className='flex flex-col items-center'>
                    <span className='mt-1 font-medium text-foreground tabular-nums'>
                      {valueFormatter(displayStats.tested_cases)}
                    </span>
                    <span className='text-xs font-medium text-muted-foreground tabular-nums'>
                      {calculatePercentage(displayStats.tested_cases, displayStats.total_cases).toFixed(1)}%
                    </span>
                  </div>
                </ProgressCircle>
              </div>
              <p className='mt-4 text-sm text-muted-foreground'>Tested Cases</p>
            </div>

            <div className='mt-10'>
              <div className='flex justify-center'>
                <ProgressCircle
                  radius={45}
                  strokeWidth={6}
                  value={calculatePercentage(displayStats.untested_cases, displayStats.total_cases)}
                >
                  <div className='flex flex-col items-center'>
                    <span className='mt-1 font-medium text-foreground tabular-nums'>
                      {valueFormatter(displayStats.untested_cases)}
                    </span>
                    <span className='text-xs font-medium text-muted-foreground tabular-nums'>
                      {((displayStats.untested_cases / displayStats.total_cases) * 100).toFixed(1)}%
                    </span>
                  </div>
                </ProgressCircle>
              </div>
              <p className='mt-4 text-sm text-muted-foreground'>Untested Cases</p>
            </div>
          </div>

          <div className='mt-24 min-w-32'>
            <div className='w-full border-t border-dashed border-border' />
            <div className='mx-auto h-48 w-px border-l border-dashed border-border' />
            <div className='ml-auto w-1/2 border-t border-dashed border-border' />
          </div>

          <div className='flex flex-col items-center gap-6'>
            <div>
              <h2 className='text-sm font-medium text-nowrap text-foreground'>3. Impact</h2>
            </div>
            <div>
              <div className='flex justify-center'>
                <ProgressCircle
                  variant='success'
                  radius={45}
                  strokeWidth={6}
                  value={calculatePercentage(displayStats.error_free_cases, displayStats.total_cases)}
                >
                  <div className='flex flex-col items-center'>
                    <span className='mt-1 font-medium text-foreground tabular-nums'>
                      {valueFormatter(displayStats.error_free_cases)}
                    </span>
                    <span className='text-xs font-medium text-muted-foreground tabular-nums'>
                      {calculatePercentage(displayStats.error_free_cases, displayStats.total_cases).toFixed(1)}%
                    </span>
                  </div>
                </ProgressCircle>
              </div>
              <p className='mt-4 text-sm text-muted-foreground'>Error-free Cases</p>
            </div>

            <div className='mt-10'>
              <div className='flex justify-center'>
                <ProgressCircle
                  variant='error'
                  radius={45}
                  strokeWidth={6}
                  value={calculatePercentage(displayStats.corrected_cases, displayStats.total_cases)}
                >
                  <div className='flex flex-col items-center'>
                    <span className='mt-1 font-medium text-foreground tabular-nums'>
                      {valueFormatter(displayStats.corrected_cases)}
                    </span>
                    <span className='text-xs font-medium text-muted-foreground tabular-nums'>
                      {calculatePercentage(displayStats.corrected_cases, displayStats.total_cases).toFixed(1)}%
                    </span>
                  </div>
                </ProgressCircle>
              </div>
              <p className='mt-4 text-sm text-muted-foreground'>Corrected Cases</p>
            </div>
          </div>
        </div>

        {/* Mobile: vertical stacked layout */}
        <div className='flex flex-col gap-8 md:hidden'>
          <div className='flex flex-col items-center gap-4'>
            <h2 className='text-sm font-medium text-foreground'>1. Completed Cases</h2>
            <ProgressCircle radius={45} strokeWidth={6} value={displayStats.total_cases}>
              <div className='flex flex-col items-center'>
                <span className='mt-1 font-medium text-foreground tabular-nums'>
                  {valueFormatter(displayStats.total_cases)}
                </span>
                <span className='text-xs font-medium text-muted-foreground tabular-nums'>100%</span>
              </div>
            </ProgressCircle>
          </div>

          <div className='mx-auto h-8 w-px border-l border-dashed border-border' />

          <div className='flex flex-col items-center gap-4'>
            <h2 className='text-sm font-medium text-foreground'>2. Test Results</h2>
            <div className='grid grid-cols-2 gap-6'>
              <div className='flex flex-col items-center'>
                <ProgressCircle
                  radius={40}
                  strokeWidth={5}
                  value={calculatePercentage(displayStats.tested_cases, displayStats.total_cases)}
                >
                  <div className='flex flex-col items-center'>
                    <span className='mt-1 text-sm font-medium text-foreground tabular-nums'>
                      {valueFormatter(displayStats.tested_cases)}
                    </span>
                    <span className='text-[10px] font-medium text-muted-foreground tabular-nums'>
                      {calculatePercentage(displayStats.tested_cases, displayStats.total_cases).toFixed(1)}%
                    </span>
                  </div>
                </ProgressCircle>
                <p className='mt-3 text-sm text-muted-foreground'>Tested</p>
              </div>
              <div className='flex flex-col items-center'>
                <ProgressCircle
                  radius={40}
                  strokeWidth={5}
                  value={calculatePercentage(displayStats.untested_cases, displayStats.total_cases)}
                >
                  <div className='flex flex-col items-center'>
                    <span className='mt-1 text-sm font-medium text-foreground tabular-nums'>
                      {valueFormatter(displayStats.untested_cases)}
                    </span>
                    <span className='text-[10px] font-medium text-muted-foreground tabular-nums'>
                      {((displayStats.untested_cases / displayStats.total_cases) * 100).toFixed(1)}%
                    </span>
                  </div>
                </ProgressCircle>
                <p className='mt-3 text-sm text-muted-foreground'>Untested</p>
              </div>
            </div>
          </div>

          <div className='mx-auto h-8 w-px border-l border-dashed border-border' />

          <div className='flex flex-col items-center gap-4'>
            <h2 className='text-sm font-medium text-foreground'>3. Impact</h2>
            <div className='grid grid-cols-2 gap-6'>
              <div className='flex flex-col items-center'>
                <ProgressCircle
                  variant='success'
                  radius={40}
                  strokeWidth={5}
                  value={calculatePercentage(displayStats.error_free_cases, displayStats.total_cases)}
                >
                  <div className='flex flex-col items-center'>
                    <span className='mt-1 text-sm font-medium text-foreground tabular-nums'>
                      {valueFormatter(displayStats.error_free_cases)}
                    </span>
                    <span className='text-[10px] font-medium text-muted-foreground tabular-nums'>
                      {calculatePercentage(displayStats.error_free_cases, displayStats.total_cases).toFixed(1)}%
                    </span>
                  </div>
                </ProgressCircle>
                <p className='mt-3 text-sm text-muted-foreground'>Error-free</p>
              </div>
              <div className='flex flex-col items-center'>
                <ProgressCircle
                  variant='error'
                  radius={40}
                  strokeWidth={5}
                  value={calculatePercentage(displayStats.corrected_cases, displayStats.total_cases)}
                >
                  <div className='flex flex-col items-center'>
                    <span className='mt-1 text-sm font-medium text-foreground tabular-nums'>
                      {valueFormatter(displayStats.corrected_cases)}
                    </span>
                    <span className='text-[10px] font-medium text-muted-foreground tabular-nums'>
                      {calculatePercentage(displayStats.corrected_cases, displayStats.total_cases).toFixed(1)}%
                    </span>
                  </div>
                </ProgressCircle>
                <p className='mt-3 text-sm text-muted-foreground'>Corrected</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Separator className='my-12' />

      <section className='relative mt-12'>
        <h2 className='font-medium text-foreground'>Impact overview</h2>

        <div className='mt-4 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3'>
          <div className='relative rounded-3xl border border-border bg-card px-4 py-3 shadow-sm'>
            <span
              className='absolute inset-x-0 top-1/2 h-10 w-1 -translate-y-1/2 rounded-r-md bg-primary'
              aria-hidden
            />

            <div className='pl-3'>
              <p className='flex items-center justify-between gap-2'>
                <span className='text-sm text-muted-foreground'>Total cases</span>
                <span className='text-sm text-muted-foreground'>current</span>
              </p>
              <p className='flex items-center justify-between gap-2'>
                <span className='text-lg font-medium text-foreground'>{valueFormatter(displayStats.total_cases)}</span>
                <span className='text-base font-medium text-muted-foreground'>
                  {valueFormatter(aggregateStats.total_cases)}
                </span>
              </p>
            </div>
          </div>

          <div className='relative rounded-3xl border border-border bg-card px-4 py-3 shadow-sm'>
            <span
              className='absolute inset-x-0 top-1/2 h-10 w-1 -translate-y-1/2 rounded-r-md bg-primary'
              aria-hidden
            />

            <div className='pl-3'>
              <p className='flex items-center justify-between gap-2'>
                <span className='text-sm text-muted-foreground'>Net cost savings</span>
                <span className='text-sm text-muted-foreground'>current</span>
              </p>
              <p className='flex items-center justify-between gap-2'>
                <span className='text-lg font-medium text-foreground'>
                  {scenarioQuota === actualQuota
                    ? 'No impact'
                    : `$${valueFormatter(Math.round(scenarioImpact.savings))}`}
                </span>
                <span className='text-base font-medium text-muted-foreground'>
                  ${valueFormatter(Math.round(currentImpact.savings))}
                </span>
              </p>
            </div>
          </div>

          <div className='relative rounded-3xl border border-border bg-card px-4 py-3 shadow-sm'>
            <span
              className='absolute inset-x-0 top-1/2 h-10 w-1 -translate-y-1/2 rounded-r-md bg-primary'
              aria-hidden
            />

            <div className='pl-3'>
              <p className='flex items-center justify-between gap-2'>
                <span className='text-sm text-muted-foreground'>Net FTE impact</span>
                <span className='text-sm text-muted-foreground'>current</span>
              </p>
              <p className='flex items-center justify-between gap-2'>
                <span className='text-lg font-medium text-foreground'>
                  {scenarioQuota === actualQuota ? 'No impact' : scenarioImpact.fteImpact.toFixed(1)}
                </span>
                <span className='text-base font-medium text-muted-foreground'>
                  {currentImpact.fteImpact.toFixed(1)}
                </span>
              </p>
            </div>
          </div>
        </div>

        <div className='mt-8 grid grid-cols-1 gap-8 sm:grid-cols-2'>
          <div>
            <h3 className='text-sm font-medium text-foreground'>Cost savings breakdown</h3>
            <ul role='list' className='mt-2 divide-y divide-border text-sm'>
              {[1, 5, 10].map((years) => {
                const baseMultiplier = Math.pow(GROWTH_FACTORS.SAVINGS_BASE, years);
                const acceleratedGrowth = Math.pow(GROWTH_FACTORS.SAVINGS_ACCELERATION, years);
                const totalMultiplier = baseMultiplier * acceleratedGrowth * (1 + years * 0.1);

                const currentSavings = currentImpact.savings * totalMultiplier;
                const projectedSavings =
                  scenarioQuota === actualQuota ? currentSavings : scenarioImpact.savings * totalMultiplier;

                const difference =
                  scenarioQuota === actualQuota
                    ? 0
                    : ((projectedSavings - currentSavings) / Math.abs(currentSavings)) * 100 * (1 + years * 0.5);

                return (
                  <li key={years} className='flex items-center justify-between py-3'>
                    <span>
                      In {years} year{years > 1 ? 's' : ''}
                    </span>
                    <span className='flex items-center gap-3 tabular-nums'>
                      <span className='text-right font-medium text-foreground'>
                        {scenarioQuota === actualQuota
                          ? 'No impact'
                          : `$${valueFormatter(Math.round(projectedSavings))}`}
                      </span>
                      <span className='h-5 w-px bg-border' aria-hidden />
                      <span
                        className={cn(
                          'rounded-full px-1.5 py-1 text-right text-xs font-semibold',
                          difference === 0 && 'bg-muted text-muted-foreground',
                          difference > 0 && 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
                          difference < 0 && 'bg-destructive/10 text-destructive'
                        )}
                      >
                        {difference === 0 ? '0.0%' : `${difference > 0 ? '+' : ''}${difference.toFixed(1)}%`}
                      </span>
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>

          <div>
            <h3 className='text-sm font-medium text-foreground'>FTE impact breakdown</h3>
            <ul role='list' className='mt-2 divide-y divide-border text-sm'>
              {[1, 5, 10].map((years) => {
                const baseMultiplier = Math.pow(GROWTH_FACTORS.FTE_BASE, years);
                const acceleratedGrowth = Math.pow(GROWTH_FACTORS.FTE_ACCELERATION, years);
                const totalMultiplier = baseMultiplier * acceleratedGrowth * (1 + years * 0.1);

                const currentFTE = (currentImpact.fteImpact * totalMultiplier) / 1.4;
                const projectedFTE =
                  scenarioQuota === actualQuota ? currentFTE : (scenarioImpact.fteImpact * totalMultiplier) / 1.4;

                const difference =
                  scenarioQuota === actualQuota
                    ? 0
                    : (((projectedFTE - currentFTE) / Math.abs(currentFTE)) * 100 * (1 + years * 0.5)) / 1.4;

                return (
                  <li key={years} className='flex items-center justify-between py-3'>
                    <span>
                      In {years} year{years > 1 ? 's' : ''}
                    </span>
                    <span className='flex items-center gap-3 tabular-nums'>
                      <span className='text-right font-medium text-foreground'>
                        {scenarioQuota === actualQuota ? 'No impact' : projectedFTE.toFixed(1)}
                      </span>
                      <span className='h-5 w-px bg-border' aria-hidden />
                      <span
                        className={cn(
                          'rounded-full px-1.5 py-1 text-right text-xs font-semibold',
                          difference === 0 && 'bg-muted text-muted-foreground',
                          difference > 0 && 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
                          difference < 0 && 'bg-destructive/10 text-destructive'
                        )}
                      >
                        {difference === 0 ? '0.0%' : `${difference > 0 ? '+' : ''}${difference.toFixed(1)}%`}
                      </span>
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </section>
    </main>
  );
}
