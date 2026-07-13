'use client';

import * as React from 'react';
import Link from 'next/link';
import {
  Activity,
  ArrowDown,
  ArrowRight,
  ArrowUp,
  CheckCircle2,
  CircleDollarSign,
  Clock3,
  Gauge,
  GitBranch,
  RefreshCcw,
  ShieldCheck,
  TriangleAlert,
  Zap,
  type LucideIcon,
} from 'lucide-react';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts';

import { Badge } from '@workspace/ui/components/badge';
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from '@workspace/ui/components/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from '@workspace/ui/components/chart';
import { InsightBadge } from '@workspace/ui/components/insight-badge';
import { ProgressBar } from '@workspace/ui/components/progress-bar';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@workspace/ui/components/select';
import { Separator } from '@workspace/ui/components/separator';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@workspace/ui/components/table';

import {
  gatewayIncidents,
  getBudgetSummary,
  getOverviewSummary,
  getProviderHealth,
  getRoutingOutcomes,
  overviewStats,
  type GatewayIncident,
  type ProviderHealth,
  type RoutingOutcome,
} from '@/lib/data/overview-stats';
import { formatters } from '@/lib/utils';

const periodItems = [
  { value: '7', label: '7 days' },
  { value: '30', label: '30 days' },
  { value: '90', label: '90 days' },
];

const trafficChartConfig = {
  directRequests: { label: 'Primary route', color: 'var(--chart-2)' },
  cacheHits: { label: 'Cache served', color: 'var(--chart-1)' },
  providerFallbacks: { label: 'Provider fallback', color: 'var(--chart-4)' },
  modelFallbacks: { label: 'Model fallback', color: 'var(--chart-3)' },
  blockedRequests: { label: 'Policy blocked', color: 'var(--muted-foreground)' },
  failedRequests: { label: 'Failed', color: 'var(--destructive)' },
} satisfies ChartConfig;

const trafficLegendItems = [
  { label: 'Primary route', color: 'var(--chart-2)' },
  { label: 'Cache served', color: 'var(--chart-1)' },
  { label: 'Provider fallback', color: 'var(--chart-4)' },
  { label: 'Model fallback', color: 'var(--chart-3)' },
  { label: 'Policy blocked', color: 'var(--muted-foreground)' },
  { label: 'Failed', color: 'var(--destructive)' },
];

type TrendTone = 'success' | 'warning' | 'neutral';

type MetricItemProps = {
  title: string;
  value: string;
  detail: string;
  change: number;
  changeSuffix?: string;
  trendTone: TrendTone;
  icon: LucideIcon;
};

function MetricItem({ title, value, detail, change, changeSuffix = '%', trendTone, icon: Icon }: MetricItemProps) {
  const TrendIcon = change < 0 ? ArrowDown : ArrowUp;

  return (
    <div className='min-w-0 p-4 xl:border-r xl:border-border xl:last:border-r-0'>
      <div className='flex items-center justify-between gap-3'>
        <p className='truncate text-xs font-medium text-muted-foreground'>{title}</p>
        <Icon className='size-4 shrink-0 text-muted-foreground' aria-hidden='true' />
      </div>
      <div className='mt-3 flex items-end gap-2'>
        <p className='text-xl font-semibold text-foreground tabular-nums'>{value}</p>
        <InsightBadge variant={trendTone} className='mb-0.5'>
          <TrendIcon className='size-3' aria-hidden='true' />
          {Math.abs(change)}
          {changeSuffix}
        </InsightBadge>
      </div>
      <p className='mt-1 truncate text-xs text-muted-foreground'>{detail}</p>
    </div>
  );
}

function RoutingOutcomeRow({ outcome }: { outcome: RoutingOutcome }) {
  return (
    <div className='flex flex-col gap-2'>
      <div className='flex items-start justify-between gap-3'>
        <div className='min-w-0'>
          <p className='text-sm font-medium text-foreground'>{outcome.label}</p>
          <p className='truncate text-xs text-muted-foreground'>{outcome.description}</p>
        </div>
        <div className='shrink-0 text-right'>
          <p className='text-sm font-medium text-foreground tabular-nums'>{outcome.percentage.toFixed(1)}%</p>
          <p className='text-xs text-muted-foreground tabular-nums'>{formatters.compact(outcome.value)}</p>
        </div>
      </div>
      <ProgressBar value={outcome.percentage} variant={outcome.variant} />
    </div>
  );
}

function ProviderStatus({ status }: { status: ProviderHealth['status'] }) {
  return (
    <InsightBadge variant={status === 'degraded' ? 'warning' : 'success'} className='capitalize'>
      {status}
    </InsightBadge>
  );
}

function IncidentIcon({ status }: { status: GatewayIncident['status'] }) {
  if (status === 'investigating') {
    return <TriangleAlert className='size-4 text-amber-600 dark:text-amber-500' aria-hidden='true' />;
  }

  if (status === 'monitoring') {
    return <Activity className='size-4 text-primary' aria-hidden='true' />;
  }

  return <CheckCircle2 className='size-4 text-emerald-600 dark:text-emerald-500' aria-hidden='true' />;
}

function IncidentRow({ incident }: { incident: GatewayIncident }) {
  return (
    <div className='flex gap-3 border-b border-border py-4 first:pt-0 last:border-b-0 last:pb-0'>
      <div className='mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full bg-muted'>
        <IncidentIcon status={incident.status} />
      </div>
      <div className='min-w-0 flex-1'>
        <div className='flex items-start justify-between gap-3'>
          <div>
            <p className='text-sm font-medium text-foreground'>{incident.title}</p>
            <p className='text-xs text-muted-foreground'>{incident.provider}</p>
          </div>
          <span className='shrink-0 text-xs text-muted-foreground'>{incident.time}</span>
        </div>
        <p className='mt-2 text-xs leading-5 text-muted-foreground'>{incident.description}</p>
      </div>
    </div>
  );
}

function ProviderHealthTable({ providers }: { providers: ProviderHealth[] }) {
  return (
    <Table>
      <TableHeader>
        <TableRow className='hover:bg-transparent'>
          <TableHead>Provider</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className='text-right'>Requests</TableHead>
          <TableHead className='text-right'>Route share</TableHead>
          <TableHead className='text-right'>Uptime</TableHead>
          <TableHead className='text-right'>P95 TTFT</TableHead>
          <TableHead className='text-right'>Throughput</TableHead>
          <TableHead className='text-right'>Errors</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {providers.map((provider) => (
          <TableRow key={provider.id}>
            <TableCell className='font-medium text-foreground'>{provider.name}</TableCell>
            <TableCell>
              <ProviderStatus status={provider.status} />
            </TableCell>
            <TableCell className='text-right tabular-nums'>{formatters.compact(provider.requests)}</TableCell>
            <TableCell className='text-right tabular-nums'>{provider.routeShare}%</TableCell>
            <TableCell className='text-right tabular-nums'>{provider.uptime}%</TableCell>
            <TableCell className='text-right tabular-nums'>{provider.p95Ttft}ms</TableCell>
            <TableCell className='text-right tabular-nums'>{provider.throughput} tok/s</TableCell>
            <TableCell className='text-right tabular-nums'>{provider.errorRate}%</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

export default function OverviewPage() {
  const [period, setPeriod] = React.useState('30');
  const days = Number(period);
  const chartData = overviewStats.slice(-days);
  const summary = React.useMemo(() => getOverviewSummary(days), [days]);
  const providers = React.useMemo(() => getProviderHealth(days), [days]);
  const routingOutcomes = React.useMemo(() => getRoutingOutcomes(days), [days]);
  const budget = React.useMemo(() => getBudgetSummary(), []);

  return (
    <div>
      <div className='flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between'>
        <div>
          <div className='flex flex-wrap items-center gap-2'>
            <h1 className='text-2xl font-semibold text-foreground'>Gateway Health</h1>
            <Badge variant='outline' className='rounded-full'>
              <span className='size-1.5 rounded-full bg-emerald-500' aria-hidden='true' />
              Live
            </Badge>
          </div>
          <p className='mt-1 text-sm text-muted-foreground'>
            Routing reliability, provider performance, and spend across your AI gateway
          </p>
        </div>
        <Select value={period} onValueChange={(value) => value && setPeriod(value)} items={periodItems}>
          <SelectTrigger className='w-full sm:w-[140px]'>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {periodItems.map((item) => (
                <SelectItem key={item.value} value={item.value} label={item.label}>
                  {item.label}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      <Separator className='my-6' />

      <Card className='rounded-3xl shadow-sm' size='sm'>
        <CardContent className='p-0'>
          <div className='grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6'>
            <MetricItem
              title='Requests'
              value={formatters.compact(summary.requests.value)}
              detail='Across all projects'
              change={summary.requests.change}
              trendTone='success'
              icon={Activity}
            />
            <MetricItem
              title='Success rate'
              value={`${summary.successRate.value}%`}
              detail='After gateway recovery'
              change={summary.successRate.change}
              changeSuffix=' pp'
              trendTone={summary.successRate.change >= 0 ? 'success' : 'warning'}
              icon={ShieldCheck}
            />
            <MetricItem
              title='P95 TTFT'
              value={`${summary.p95Ttft.value}ms`}
              detail='Time to first token'
              change={summary.p95Ttft.change}
              trendTone={summary.p95Ttft.change <= 0 ? 'success' : 'warning'}
              icon={Zap}
            />
            <MetricItem
              title='P95 latency'
              value={`${(summary.p95Latency.value / 1_000).toFixed(2)}s`}
              detail='End-to-end response'
              change={summary.p95Latency.change}
              trendTone={summary.p95Latency.change <= 0 ? 'success' : 'warning'}
              icon={Clock3}
            />
            <MetricItem
              title='Fallback rate'
              value={`${summary.fallbackRate.value}%`}
              detail={`${summary.retryRate}% retried upstream`}
              change={summary.fallbackRate.change}
              changeSuffix=' pp'
              trendTone={summary.fallbackRate.change > 0 ? 'warning' : 'success'}
              icon={GitBranch}
            />
            <MetricItem
              title='Cache savings'
              value={formatters.currency(summary.cacheSavings.value)}
              detail={`${summary.cacheHitRate}% cache hit rate`}
              change={summary.cacheSavings.change}
              trendTone='success'
              icon={CircleDollarSign}
            />
          </div>
        </CardContent>
      </Card>

      <div className='mt-6 grid grid-cols-1 gap-6 xl:grid-cols-3'>
        <Card className='rounded-3xl shadow-sm xl:col-span-2'>
          <CardHeader>
            <CardTitle>Traffic and routing outcomes</CardTitle>
            <CardDescription>
              Daily request outcomes across primary routes, cache, fallbacks, and failures.
            </CardDescription>
            <CardAction>
              <Link
                href='/traces'
                className='inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline'
              >
                Explore requests
                <ArrowRight className='size-3.5' aria-hidden='true' />
              </Link>
            </CardAction>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={trafficChartConfig}
              className='aspect-auto h-72 w-full'
              initialDimension={{ width: 760, height: 288 }}
            >
              <BarChart data={chartData} margin={{ top: 8, right: 4, bottom: 0, left: 0 }}>
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey='date'
                  tickLine={false}
                  axisLine={false}
                  minTickGap={32}
                  tickMargin={8}
                  tickFormatter={(value) =>
                    new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                  }
                />
                <YAxis hide tickFormatter={(value) => formatters.compact(value)} />
                <ChartTooltip
                  content={
                    <ChartTooltipContent
                      indicator='line'
                      valueFormatter={(value) => formatters.compact(Number(value))}
                    />
                  }
                />
                <Bar
                  dataKey='directRequests'
                  stackId='outcomes'
                  fill='var(--color-directRequests)'
                  isAnimationActive={false}
                />
                <Bar dataKey='cacheHits' stackId='outcomes' fill='var(--color-cacheHits)' isAnimationActive={false} />
                <Bar
                  dataKey='providerFallbacks'
                  stackId='outcomes'
                  fill='var(--color-providerFallbacks)'
                  isAnimationActive={false}
                />
                <Bar
                  dataKey='modelFallbacks'
                  stackId='outcomes'
                  fill='var(--color-modelFallbacks)'
                  isAnimationActive={false}
                />
                <Bar
                  dataKey='blockedRequests'
                  stackId='outcomes'
                  fill='var(--color-blockedRequests)'
                  isAnimationActive={false}
                />
                <Bar
                  dataKey='failedRequests'
                  stackId='outcomes'
                  fill='var(--color-failedRequests)'
                  radius={[3, 3, 0, 0]}
                  isAnimationActive={false}
                />
              </BarChart>
            </ChartContainer>
            <div className='mt-4 grid grid-cols-2 gap-x-4 gap-y-2 sm:flex sm:flex-wrap'>
              {trafficLegendItems.map((item) => (
                <div key={item.label} className='flex min-w-0 items-center gap-2 text-xs text-muted-foreground'>
                  <span
                    className='size-2 shrink-0 rounded-sm'
                    style={{ backgroundColor: item.color }}
                    aria-hidden='true'
                  />
                  <span className='truncate'>{item.label}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className='rounded-3xl shadow-sm'>
          <CardHeader>
            <CardTitle>Routing outcomes</CardTitle>
            <CardDescription>How the gateway completed each request.</CardDescription>
          </CardHeader>
          <CardContent className='flex flex-col gap-5'>
            {routingOutcomes.map((outcome) => (
              <RoutingOutcomeRow key={outcome.id} outcome={outcome} />
            ))}
          </CardContent>
        </Card>
      </div>

      <div className='mt-6 grid grid-cols-1 gap-6 xl:grid-cols-3'>
        <Card className='rounded-3xl shadow-sm xl:col-span-2'>
          <CardHeader>
            <CardTitle>Provider health</CardTitle>
            <CardDescription>Observed reliability and streaming performance for active upstreams.</CardDescription>
            <CardAction>
              <div className='flex items-center gap-2 text-xs text-muted-foreground'>
                <RefreshCcw className='size-3.5' aria-hidden='true' />
                Updated just now
              </div>
            </CardAction>
          </CardHeader>
          <CardContent className='px-0'>
            <ProviderHealthTable providers={providers} />
          </CardContent>
        </Card>

        <div className='flex flex-col gap-6'>
          <Card className='rounded-3xl shadow-sm'>
            <CardHeader>
              <CardTitle>Monthly budget</CardTitle>
              <CardDescription>Gateway spend across every provider and project.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className='flex items-end justify-between gap-4'>
                <div>
                  <p className='text-2xl font-semibold text-foreground tabular-nums'>
                    {formatters.currency(budget.spent)}
                  </p>
                  <p className='mt-1 text-xs text-muted-foreground'>of {formatters.currency(budget.limit)} budget</p>
                </div>
                <InsightBadge variant={budget.projected > budget.limit ? 'error' : 'warning'}>
                  {formatters.currency(budget.projected)} projected
                </InsightBadge>
              </div>
              <ProgressBar
                value={budget.utilization}
                variant={budget.utilization >= 80 ? 'error' : 'warning'}
                className='mt-4'
              />
              <div className='mt-5 flex flex-col gap-3'>
                {budget.projects.map((project) => (
                  <div key={project.name} className='flex items-center justify-between gap-3 text-sm'>
                    <div className='flex min-w-0 items-center gap-2'>
                      <span className='size-1.5 shrink-0 rounded-full bg-primary' aria-hidden='true' />
                      <span className='truncate text-muted-foreground'>{project.name}</span>
                    </div>
                    <span className='shrink-0 text-foreground tabular-nums'>{formatters.currency(project.spend)}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className='rounded-3xl shadow-sm'>
            <CardHeader>
              <CardTitle>Incidents</CardTitle>
              <CardDescription>Provider events affecting routing decisions.</CardDescription>
              <CardAction>
                <InsightBadge variant='warning'>1 active</InsightBadge>
              </CardAction>
            </CardHeader>
            <CardContent>
              {gatewayIncidents.map((incident) => (
                <IncidentRow key={incident.id} incident={incident} />
              ))}
            </CardContent>
          </Card>
        </div>
      </div>

      <div className='mt-6 grid grid-cols-1 gap-4 rounded-2xl border border-border bg-muted/40 p-4 sm:grid-cols-3'>
        <div className='flex items-center gap-3'>
          <Gauge className='size-4 text-primary' aria-hidden='true' />
          <div>
            <p className='text-sm font-medium text-foreground'>99.94% gateway availability</p>
            <p className='text-xs text-muted-foreground'>Within the 99.9% monthly SLO</p>
          </div>
        </div>
        <div className='flex items-center gap-3'>
          <GitBranch className='size-4 text-primary' aria-hidden='true' />
          <div>
            <p className='text-sm font-medium text-foreground'>96.8% fallback recovery</p>
            <p className='text-xs text-muted-foreground'>Affected requests completed successfully</p>
          </div>
        </div>
        <div className='flex items-center gap-3'>
          <CircleDollarSign className='size-4 text-primary' aria-hidden='true' />
          <div>
            <p className='text-sm font-medium text-foreground'>
              {formatters.currency(summary.totalCost.value)} routed spend
            </p>
            <p className='text-xs text-muted-foreground'>
              Before {formatters.currency(summary.cacheSavings.value)} cache savings
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
