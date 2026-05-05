'use client';

import * as React from 'react';
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, XAxis, YAxis } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@workspace/ui/components/card';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  type ChartConfig,
} from '@workspace/ui/components/chart';
import { Badge } from '@workspace/ui/components/badge';
import { Separator } from '@workspace/ui/components/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@workspace/ui/components/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@workspace/ui/components/table';
import { InsightBadge } from '@workspace/ui/components/insight-badge';

import { featuredModels } from '@/lib/data/models';
import { getModelTotals, usageByModel } from '@/lib/data/usage-by-model';
import { latencyBuckets } from '@/lib/data/latency-buckets';
import { formatters } from '@/lib/utils';
import { ProviderLogo } from '@/components/ProviderLogo';

const periodItems = [
  { value: '7', label: '7 days' },
  { value: '30', label: '30 days' },
  { value: '90', label: '90 days' },
];

export default function ModelsPage() {
  const [costPeriod, setCostPeriod] = React.useState('30');
  const costDays = Number(costPeriod);

  // --- Model Comparison Cards ---
  const modelCardSparkConfigs = featuredModels.map((m) => ({
    value: { label: m.name, color: m.color },
  })) satisfies ChartConfig[];

  // Only use featured models for the latency/cost charts
  const featuredModelTotals = React.useMemo(() => {
    const all = getModelTotals(90);
    return all.filter((m) => m.featured);
  }, []);

  // --- Latency Distribution ---
  const bucketLabels = ['<100ms', '100-250ms', '250-500ms', '500ms-1s', '>1s'];
  const latencyChartData = bucketLabels.map((bucket) => {
    const row: Record<string, string | number> = { bucket };
    for (const model of featuredModels) {
      const entry = latencyBuckets.find((b) => b.bucket === bucket && b.modelId === model.id);
      row[model.id] = entry?.count ?? 0;
    }
    return row;
  });

  const latencyChartConfig = Object.fromEntries(
    featuredModels.map((m) => [m.id, { label: m.name, color: m.color }])
  ) satisfies ChartConfig;

  // --- Daily Cost by Model ---
  const uniqueDates = [...new Set(usageByModel.map((d) => d.date))].sort().slice(-costDays);
  const costChartData = uniqueDates.map((date) => {
    const row: Record<string, string | number> = { date };
    for (const model of featuredModels) {
      const entry = usageByModel.find((d) => d.date === date && d.modelId === model.id);
      row[model.id] = entry?.cost ?? 0;
    }
    return row;
  });

  const costChartConfig = Object.fromEntries(
    featuredModels.map((m) => [m.id, { label: m.name, color: m.color }])
  ) satisfies ChartConfig;

  // --- Per-model sparkline data ---
  const modelSparklines = featuredModels.map((model) => {
    const data = usageByModel
      .filter((d) => d.modelId === model.id)
      .slice(-30)
      .map((d) => ({ value: d.requests }));
    return data;
  });

  // --- Performance table data ---
  const performanceRows = [
    { label: 'Provider', values: featuredModels.map((m) => m.provider) },
    { label: 'Total Requests', values: featuredModelTotals.map((m) => formatters.compact(m.totalRequests)) },
    { label: 'Total Tokens', values: featuredModelTotals.map((m) => formatters.compact(m.totalTokens)) },
    { label: 'Avg Latency', values: featuredModelTotals.map((m) => `${m.avgLatency}ms`) },
    { label: 'Total Cost', values: featuredModelTotals.map((m) => formatters.currency(m.totalCost)) },
    { label: 'Cost / 1K Input', values: featuredModels.map((m) => formatters.currencyPrecise(m.costPer1kInput)) },
    { label: 'Cost / 1K Output', values: featuredModels.map((m) => formatters.currencyPrecise(m.costPer1kOutput)) },
  ];

  return (
    <div>
      <div>
        <h1 className='text-2xl font-semibold text-foreground'>Models</h1>
        <p className='mt-1 text-sm text-muted-foreground'>
          Compare model performance, costs, and usage patterns across your AI stack
        </p>
      </div>
      <Separator className='my-6' />

      {/* Section A: Model Comparison Cards */}
      <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3'>
        {featuredModelTotals.map((model, index) => {
          const sparkConfig = { value: { label: model.name, color: model.color } } satisfies ChartConfig;
          const sparkData = modelSparklines[index] ?? [];
          return (
            <Card key={model.id} className='rounded-3xl shadow-sm'>
              <CardHeader className='pb-2'>
                <div className='flex items-center justify-between'>
                  <div className='flex items-center gap-2'>
                    <ProviderLogo providerId={model.providerId} size={16} />
                    <CardTitle className='text-base font-semibold'>{model.name}</CardTitle>
                  </div>
                  <Badge variant='secondary' className='rounded-full text-xs'>
                    {model.provider}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className='grid grid-cols-2 gap-3'>
                  <div>
                    <p className='text-xs text-muted-foreground'>Requests</p>
                    <p className='text-sm font-semibold text-foreground tabular-nums'>
                      {formatters.compact(model.totalRequests)}
                    </p>
                  </div>
                  <div>
                    <p className='text-xs text-muted-foreground'>Avg Latency</p>
                    <p className='text-sm font-semibold text-foreground tabular-nums'>{model.avgLatency}ms</p>
                  </div>
                  <div>
                    <p className='text-xs text-muted-foreground'>Cost</p>
                    <p className='text-sm font-semibold text-foreground tabular-nums'>
                      {formatters.currency(model.totalCost)}
                    </p>
                  </div>
                  <div>
                    <p className='text-xs text-muted-foreground'>Tokens</p>
                    <p className='text-sm font-semibold text-foreground tabular-nums'>
                      {formatters.compact(model.totalTokens)}
                    </p>
                  </div>
                </div>
                <ChartContainer
                  config={sparkConfig}
                  className='mt-4 aspect-auto h-16 w-full'
                  initialDimension={{ width: 300, height: 64 }}
                >
                  <AreaChart data={sparkData} margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
                    <defs>
                      <linearGradient id={`spark-${model.id}`} x1='0' y1='0' x2='0' y2='1'>
                        <stop offset='0%' stopColor={model.color} stopOpacity={0.15} />
                        <stop offset='100%' stopColor={model.color} stopOpacity={0.01} />
                      </linearGradient>
                    </defs>
                    <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
                    <Area
                      type='monotone'
                      dataKey='value'
                      stroke={model.color}
                      strokeWidth={1.5}
                      fill={`url(#spark-${model.id})`}
                      dot={false}
                    />
                  </AreaChart>
                </ChartContainer>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Section B: Latency Distribution */}
      <Card className='mt-8 rounded-3xl shadow-sm'>
        <CardHeader>
          <CardTitle className='text-base font-medium'>Latency Distribution by Model</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={latencyChartConfig}
            className='aspect-auto h-72 w-full'
            initialDimension={{ width: 800, height: 288 }}
          >
            <BarChart data={latencyChartData} margin={{ top: 10, right: 10, bottom: 0, left: 0 }}>
              <CartesianGrid vertical={false} />
              <XAxis dataKey='bucket' tickLine={false} axisLine={false} tickMargin={8} />
              <YAxis tickLine={false} axisLine={false} />
              <ChartTooltip content={<ChartTooltipContent />} />
              {featuredModels.map((m) => (
                <Bar key={m.id} dataKey={m.id} fill={m.color} radius={[2, 2, 0, 0]} />
              ))}
              <ChartLegend content={<ChartLegendContent />} />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Section C: Daily Cost by Model */}
      <Card className='mt-8 rounded-3xl shadow-sm'>
        <CardHeader className='flex flex-row items-center justify-between'>
          <CardTitle className='text-base font-medium'>Daily Cost by Model</CardTitle>
          <Select value={costPeriod} onValueChange={(v) => v && setCostPeriod(v)} items={periodItems}>
            <SelectTrigger className='w-[120px]'>
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
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={costChartConfig}
            className='aspect-auto h-64 w-full'
            initialDimension={{ width: 800, height: 256 }}
          >
            <AreaChart data={costChartData} margin={{ top: 10, right: 10, bottom: 0, left: 0 }}>
              <defs>
                {featuredModels.map((m) => (
                  <linearGradient key={m.id} id={`costFill-${m.id}`} x1='0' y1='0' x2='0' y2='1'>
                    <stop offset='0%' stopColor={m.color} stopOpacity={0.2} />
                    <stop offset='100%' stopColor={m.color} stopOpacity={0.01} />
                  </linearGradient>
                ))}
              </defs>
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
              <YAxis hide />
              <ChartTooltip content={<ChartTooltipContent valueFormatter={(v) => formatters.currency(Number(v))} />} />
              {featuredModels.map((m) => (
                <Area
                  key={m.id}
                  type='monotone'
                  dataKey={m.id}
                  stackId='1'
                  stroke={m.color}
                  strokeWidth={1.5}
                  fill={`url(#costFill-${m.id})`}
                  dot={false}
                />
              ))}
              <ChartLegend content={<ChartLegendContent />} />
            </AreaChart>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Section D: Performance Comparison Table */}
      <Card className='mt-8 rounded-3xl shadow-sm'>
        <CardHeader>
          <CardTitle className='text-base font-medium'>Performance Comparison</CardTitle>
        </CardHeader>
        <CardContent>
          <div className='overflow-x-auto'>
            <Table>
              <TableHeader>
                <TableRow className='hover:bg-transparent'>
                  <TableHead className='sticky left-0 z-10 bg-card text-muted-foreground'>Metric</TableHead>
                  {featuredModels.map((m) => (
                    <TableHead key={m.id} className='text-center text-foreground'>
                      <div className='flex items-center justify-center gap-1.5'>
                        <ProviderLogo providerId={m.providerId} size={14} />
                        {m.name}
                      </div>
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {performanceRows.map((row, index) => (
                  <TableRow key={row.label} className={index % 2 === 0 ? 'bg-muted/30' : ''}>
                    <TableCell className='sticky left-0 z-10 bg-inherit font-medium text-foreground'>
                      {row.label}
                    </TableCell>
                    {row.values.map((val, i) => (
                      <TableCell key={featuredModels[i]!.id} className='text-center text-muted-foreground tabular-nums'>
                        {val}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
