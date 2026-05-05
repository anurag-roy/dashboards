'use client';

import * as React from 'react';
import Link from 'next/link';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Label,
  Pie,
  PieChart,
  Line,
  LineChart,
  XAxis,
  YAxis,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@workspace/ui/components/card';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  type ChartConfig,
} from '@workspace/ui/components/chart';
import { InsightBadge } from '@workspace/ui/components/insight-badge';
import { ProgressCircle } from '@workspace/ui/components/progress-circle';
import { ProgressBar } from '@workspace/ui/components/progress-bar';
import { Badge } from '@workspace/ui/components/badge';
import { Separator } from '@workspace/ui/components/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@workspace/ui/components/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@workspace/ui/components/table';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@workspace/ui/components/tooltip';
import { ArrowRight } from 'lucide-react';

import { overviewStats, getOverviewSummary } from '@/lib/data/overview-stats';
import { models, modelMap } from '@/lib/data/models';
import { getModelTotals } from '@/lib/data/usage-by-model';
import { traces } from '@/lib/data/traces';
import { formatters, relativeTime } from '@/lib/utils';
import { cn } from '@workspace/ui/lib/utils';
import { ProviderLogo } from '@/components/ProviderLogo';

const periodItems = [
  { value: '7', label: '7 days' },
  { value: '30', label: '30 days' },
  { value: '90', label: '90 days' },
];

function aggregateOthers<T extends ReturnType<typeof getModelTotals>[number]>(models: T[], name = 'Others') {
  return {
    id: 'others',
    name,
    provider: 'Various',
    providerId: 'other',
    color: 'var(--muted-foreground)',
    costPer1kInput: 0,
    costPer1kOutput: 0,
    featured: false as const,
    totalRequests: models.reduce((sum, model) => sum + model.totalRequests, 0),
    totalTokens: models.reduce((sum, model) => sum + model.totalTokens, 0),
    totalCost: Math.round(models.reduce((sum, model) => sum + model.totalCost, 0) * 100) / 100,
    avgLatency: Math.round(models.reduce((sum, model) => sum + model.avgLatency, 0) / (models.length || 1)),
  };
}

// --- KPI Card Sparkline ---
function KpiCard({
  title,
  value,
  change,
  previous,
  data,
  color,
}: {
  title: string;
  value: string;
  change: number;
  previous: string;
  data: { value: number }[];
  color: string;
}) {
  const config = { value: { label: title, color } } satisfies ChartConfig;
  const badgeVariant = change > 0 ? 'success' : change < 0 ? 'error' : 'neutral';

  return (
    <Card className='rounded-3xl shadow-sm'>
      <CardHeader className='pb-2'>
        <div className='flex items-center gap-2'>
          <CardTitle className='text-sm font-medium text-muted-foreground'>{title}</CardTitle>
          <InsightBadge variant={badgeVariant}>
            {change > 0 ? '+' : ''}
            {change}%
          </InsightBadge>
        </div>
      </CardHeader>
      <CardContent>
        <p className='text-2xl font-semibold text-foreground'>{value}</p>
        <p className='mt-1 text-xs text-muted-foreground'>from {previous} last period</p>
        <ChartContainer
          config={config}
          className='mt-4 aspect-auto h-12 w-full'
          initialDimension={{ width: 300, height: 48 }}
        >
          <AreaChart data={data} margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
            <defs>
              <linearGradient id={`fill-${title.replace(/\s/g, '')}`} x1='0' y1='0' x2='0' y2='1'>
                <stop offset='0%' stopColor={color} stopOpacity={0.15} />
                <stop offset='100%' stopColor={color} stopOpacity={0.01} />
              </linearGradient>
            </defs>
            <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
            <Area
              type='monotone'
              dataKey='value'
              stroke={color}
              strokeWidth={1.5}
              fill={`url(#fill-${title.replace(/\s/g, '')})`}
              dot={false}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

// --- Main Page ---
export default function OverviewPage() {
  const [period, setPeriod] = React.useState('30');
  const days = Number(period);
  const chartData = overviewStats.slice(-days);
  const currentSummary = React.useMemo(() => getOverviewSummary(days), [days]);
  const modelTotals = React.useMemo(() => getModelTotals(days), [days]);

  // Sparkline data for KPIs
  const requestSparkline = chartData.map((d) => ({ value: d.totalRequests }));
  const tokenSparkline = chartData.map((d) => ({ value: d.promptTokens + d.completionTokens }));
  const costSparkline = chartData.map((d) => ({ value: d.totalCost }));

  // Token usage chart data
  const tokenChartConfig = {
    completionTokens: { label: 'Completion Tokens', color: 'var(--chart-2)' },
    promptTokens: { label: 'Prompt Tokens', color: 'var(--chart-1)' },
  } satisfies ChartConfig;

  const costByModelTotals = React.useMemo(() => {
    return [...modelTotals].sort((a, b) => b.totalCost - a.totalCost).slice(0, 4);
  }, [modelTotals]);

  const requestDistributionTotals = React.useMemo(() => {
    const sorted = [...modelTotals].sort((a, b) => b.totalRequests - a.totalRequests);
    const topModels = sorted.slice(0, 4);
    const otherModels = sorted.slice(4);

    return otherModels.length > 0 ? [...topModels, aggregateOthers(otherModels)] : topModels;
  }, [modelTotals]);

  // Cost by model (top 4)
  const costByModelData = costByModelTotals.map((m) => ({
    name: m.name,
    cost: m.totalCost,
    fill: m.color,
  }));

  const costByModelConfig = Object.fromEntries(
    costByModelTotals.map((m) => [m.name, { label: m.name, color: m.color }])
  ) satisfies ChartConfig;

  // Request distribution donut (top 4 + Others)
  const totalModelRequests = requestDistributionTotals.reduce((s, m) => s + m.totalRequests, 0);
  const requestDistData = requestDistributionTotals.map((m) => ({
    name: m.name,
    value: m.totalRequests,
    fill: m.color,
  }));

  const donutConfig = Object.fromEntries(
    requestDistributionTotals.map((m) => [m.name, { label: m.name, color: m.color }])
  ) satisfies ChartConfig;

  // Latency sparkline
  const latencySparkData = chartData.map((d) => ({ value: d.p50Latency }));
  const latencySparkConfig = { value: { label: 'P50 Latency', color: 'var(--chart-3)' } } satisfies ChartConfig;

  // Recent activity (last 10 traces)
  const recentTraces = traces.slice(0, 10);

  const modelNameMap: Record<string, string> = Object.fromEntries(models.map((m) => [m.id, m.name]));

  return (
    <div>
      {/* Header */}
      <div className='flex items-start justify-between'>
        <div>
          <h1 className='text-2xl font-semibold text-foreground'>LLM Overview</h1>
          <p className='mt-1 text-sm text-muted-foreground'>
            Real-time monitoring of model performance, token usage, and cost trends
          </p>
        </div>
        <Select value={period} onValueChange={(v) => v && setPeriod(v)} items={periodItems}>
          <SelectTrigger className='w-[140px]'>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {periodItems.map((item) => (
              <SelectItem key={item.value} value={item.value}>
                {item.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <Separator className='my-6' />

      {/* Section A: KPI Cards */}
      <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3'>
        <KpiCard
          title='Total Requests'
          value={formatters.compact(currentSummary.totalRequests.value)}
          change={currentSummary.totalRequests.change}
          previous={formatters.compact(currentSummary.totalRequests.previous)}
          data={requestSparkline}
          color='var(--chart-1)'
        />
        <KpiCard
          title='Token Usage'
          value={formatters.compact(currentSummary.totalTokens.value)}
          change={currentSummary.totalTokens.change}
          previous={formatters.compact(currentSummary.totalTokens.previous)}
          data={tokenSparkline}
          color='var(--chart-2)'
        />
        <KpiCard
          title='Total Cost'
          value={formatters.currency(currentSummary.totalCost.value)}
          change={currentSummary.totalCost.change}
          previous={formatters.currency(currentSummary.totalCost.previous)}
          data={costSparkline}
          color='var(--chart-3)'
        />
      </div>

      {/* Section B: Token Usage Over Time */}
      <Card className='mt-8 rounded-3xl shadow-sm'>
        <CardHeader className='flex flex-row items-center justify-between'>
          <CardTitle className='text-base font-medium'>Token Usage</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={tokenChartConfig}
            className='aspect-auto h-72 w-full'
            initialDimension={{ width: 800, height: 288 }}
          >
            <AreaChart data={chartData} margin={{ top: 10, right: 10, bottom: 0, left: 0 }}>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey='date'
                tickLine={false}
                axisLine={false}
                minTickGap={32}
                tickMargin={8}
                tickFormatter={(v) => {
                  const d = new Date(v);
                  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                }}
              />
              <YAxis hide tickFormatter={(v) => formatters.compact(v)} />
              <ChartTooltip
                content={<ChartTooltipContent indicator='line' valueFormatter={(v) => formatters.compact(Number(v))} />}
              />
              <Area
                type='monotone'
                dataKey='completionTokens'
                stackId='1'
                stroke='var(--color-completionTokens)'
                strokeWidth={2}
                fill='var(--color-completionTokens)'
                fillOpacity={0.2}
                dot={false}
              />
              <Area
                type='monotone'
                dataKey='promptTokens'
                stackId='1'
                stroke='var(--color-promptTokens)'
                strokeWidth={2}
                fill='var(--color-promptTokens)'
                fillOpacity={0.2}
                dot={false}
              />
              <ChartLegend content={<ChartLegendContent />} />
            </AreaChart>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Section C: Cost Breakdown & Request Distribution */}
      <div className='mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2'>
        {/* Cost by Model */}
        <Card className='rounded-3xl shadow-sm'>
          <CardHeader>
            <CardTitle className='text-base font-medium'>Cost by Model</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={costByModelConfig}
              className='aspect-auto h-64 w-full'
              initialDimension={{ width: 400, height: 256 }}
            >
              <BarChart data={costByModelData} layout='vertical' margin={{ top: 0, right: 20, bottom: 0, left: 0 }}>
                <CartesianGrid horizontal={false} />
                <YAxis
                  dataKey='name'
                  type='category'
                  tickLine={false}
                  axisLine={false}
                  width={90}
                  tickMargin={4}
                  className='text-xs'
                />
                <XAxis type='number' tickLine={false} axisLine={false} tickFormatter={(v) => formatters.currency(v)} />
                <ChartTooltip
                  content={<ChartTooltipContent valueFormatter={(v) => formatters.currency(Number(v))} />}
                />
                <Bar dataKey='cost' radius={[0, 4, 4, 0]}>
                  {costByModelData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Request Distribution (Donut) */}
        <Card className='rounded-3xl shadow-sm'>
          <CardHeader>
            <CardTitle className='text-base font-medium'>Request Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={donutConfig}
              className='mx-auto aspect-square h-64'
              initialDimension={{ width: 256, height: 256 }}
            >
              <PieChart>
                <ChartTooltip
                  content={<ChartTooltipContent hideLabel valueFormatter={(v) => formatters.compact(Number(v))} />}
                />
                <Pie
                  data={requestDistData}
                  dataKey='value'
                  nameKey='name'
                  innerRadius={60}
                  strokeWidth={2}
                  stroke='var(--card)'
                >
                  <Label
                    content={({ viewBox }) => {
                      if (viewBox && 'cx' in viewBox && 'cy' in viewBox) {
                        return (
                          <text x={viewBox.cx} y={viewBox.cy} textAnchor='middle'>
                            <tspan
                              x={viewBox.cx}
                              y={(viewBox.cy || 0) - 5}
                              className='fill-foreground text-2xl font-bold'
                            >
                              {formatters.compact(totalModelRequests)}
                            </tspan>
                            <tspan x={viewBox.cx} y={(viewBox.cy || 0) + 15} className='fill-muted-foreground text-xs'>
                              Requests
                            </tspan>
                          </text>
                        );
                      }
                    }}
                  />
                </Pie>
                <ChartLegend content={<ChartLegendContent />} />
              </PieChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Section D: Performance Metrics */}
      <div className='mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3'>
        {/* Avg Latency */}
        <Card className='rounded-3xl shadow-sm'>
          <CardHeader className='pb-2'>
            <CardTitle className='text-sm font-medium text-muted-foreground'>Avg Latency (P50)</CardTitle>
          </CardHeader>
          <CardContent>
            <p className='text-2xl font-semibold text-foreground'>{currentSummary.avgP50Latency}ms</p>
            <ChartContainer
              config={latencySparkConfig}
              className='mt-3 aspect-auto h-10 w-full'
              initialDimension={{ width: 300, height: 40 }}
            >
              <LineChart data={latencySparkData} margin={{ top: 2, right: 0, bottom: 2, left: 0 }}>
                <Line type='monotone' dataKey='value' stroke='var(--color-value)' strokeWidth={1.5} dot={false} />
              </LineChart>
            </ChartContainer>
            <p className='mt-3 text-xs text-muted-foreground'>
              P95: {currentSummary.avgP95Latency}ms · P99: {currentSummary.avgP99Latency}ms
            </p>
          </CardContent>
        </Card>

        {/* Success Rate */}
        <Card className='rounded-3xl shadow-sm'>
          <CardHeader className='pb-2'>
            <CardTitle className='text-sm font-medium text-muted-foreground'>Success Rate</CardTitle>
          </CardHeader>
          <CardContent className='flex flex-col items-center'>
            <ProgressCircle value={currentSummary.successRate} radius={40} strokeWidth={7} variant='success'>
              <span className='text-lg font-semibold text-foreground'>{currentSummary.successRate}%</span>
            </ProgressCircle>
            <p className='mt-4 text-xs text-muted-foreground'>Errors: {currentSummary.errorRate}%</p>
          </CardContent>
        </Card>

        {/* Cache Hit Rate */}
        <Card className='rounded-3xl shadow-sm'>
          <CardHeader className='pb-2'>
            <CardTitle className='text-sm font-medium text-muted-foreground'>Cache Hit Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <p className='text-2xl font-semibold text-foreground'>{currentSummary.cacheHitRate}%</p>
            <ProgressBar value={currentSummary.cacheHitRate} className='mt-4 *:h-2' showAnimation variant='default' />
            <p className='mt-3 text-xs text-muted-foreground'>
              Saved {formatters.currency(currentSummary.cacheSavings)} in cached responses
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Section E: Recent Activity Table */}
      <Card className='mt-8 rounded-3xl shadow-sm'>
        <CardHeader>
          <CardTitle className='text-base font-medium'>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className='overflow-x-auto'>
            <Table>
              <TableHeader>
                <TableRow className='hover:bg-transparent'>
                  <TableHead className='text-muted-foreground'>Timestamp</TableHead>
                  <TableHead className='text-muted-foreground'>Model</TableHead>
                  <TableHead className='text-muted-foreground'>Prompt</TableHead>
                  <TableHead className='text-right text-muted-foreground'>Tokens</TableHead>
                  <TableHead className='text-right text-muted-foreground'>Latency</TableHead>
                  <TableHead className='text-muted-foreground'>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentTraces.map((trace) => (
                  <TableRow key={trace.traceId}>
                    <TableCell suppressHydrationWarning className='text-sm whitespace-nowrap text-muted-foreground'>
                      {relativeTime(trace.timestamp)}
                    </TableCell>
                    <TableCell>
                      <div className='flex items-center gap-2'>
                        <ProviderLogo providerId={modelMap[trace.model]?.providerId ?? 'openai'} size={14} />
                        <span className='text-sm text-foreground'>{modelNameMap[trace.model]}</span>
                      </div>
                    </TableCell>
                    <TableCell className='max-w-[200px] truncate text-sm text-muted-foreground'>
                      <TooltipProvider delay={500}>
                        <Tooltip>
                          <TooltipTrigger render={<span className='cursor-help' />}>
                            {trace.userPrompt.slice(0, 60)}...
                          </TooltipTrigger>
                          <TooltipContent side='top' className='max-w-[400px] whitespace-normal'>
                            {trace.userPrompt}
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </TableCell>
                    <TableCell className='text-right text-sm text-foreground tabular-nums'>
                      {formatters.number(trace.promptTokens)} / {formatters.number(trace.completionTokens)}
                    </TableCell>
                    <TableCell
                      className={cn(
                        'text-right text-sm tabular-nums',
                        trace.latencyMs < 500
                          ? 'text-emerald-600 dark:text-emerald-400'
                          : trace.latencyMs < 1_000
                            ? 'text-amber-600 dark:text-amber-400'
                            : 'text-destructive'
                      )}
                    >
                      {trace.latencyMs.toLocaleString()}ms
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={trace.status === 'success' ? 'default' : 'destructive'}
                        className='rounded-full capitalize'
                      >
                        {trace.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <div className='mt-4 flex justify-end'>
            <Link
              href='/traces'
              className='inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline'
            >
              View all traces
              <ArrowRight className='size-3.5' aria-hidden='true' />
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
