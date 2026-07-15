'use client';

import * as React from 'react';
import { Area, AreaChart, Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts';
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
import { Button } from '@workspace/ui/components/button';
import { Separator } from '@workspace/ui/components/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@workspace/ui/components/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@workspace/ui/components/table';
import { Activity, RotateCcw, ShieldCheck, Timer, TriangleAlert, Zap } from 'lucide-react';

import { modelMap, type ModelDefinition } from '@/lib/data/models';
import { getModelTotals, usageByModel } from '@/lib/data/usage-by-model';
import { getLatencyBuckets } from '@/lib/data/latency-buckets';
import { getModelGatewayHealth, getProviderGatewayHealth } from '@/lib/data/model-health';
import { formatters } from '@/lib/utils';
import { ProviderLogo } from '@/components/ProviderLogo';
import { ModelMultiSelect } from '@/components/ModelMultiSelect';

const periodItems = [
  { value: '7', label: '7 days' },
  { value: '30', label: '30 days' },
  { value: '90', label: '90 days' },
];

const defaultModelIds = ['gpt-5.5-pro', 'claude-opus-4-7', 'gemini-3.1-pro'];
const maxCompareModels = 5;
const bucketLabels = ['<100ms', '100-250ms', '250-500ms', '500ms-1s', '>1s'];
const allUsageDates = [...new Set(usageByModel.map((entry) => entry.date))].sort();
const usageLookup = new Map(usageByModel.map((entry) => [`${entry.date}:${entry.modelId}`, entry]));

function chartKeyForModel(modelId: string) {
  return `model_${modelId.replace(/[^a-zA-Z0-9]/g, '_')}`;
}

function formatDateTick(value: string) {
  const date = new Date(value);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function getSelectedModels(modelIds: string[]) {
  return modelIds.map((id) => modelMap[id]).filter((model): model is ModelDefinition => Boolean(model));
}

function formatDuration(value: number) {
  return value >= 1000 ? `${(value / 1000).toFixed(1)}s` : `${value}ms`;
}

const providerStatusConfig = {
  operational: { label: 'Operational', icon: ShieldCheck, className: 'bg-primary/10 text-primary' },
  monitor: { label: 'Monitor', icon: Activity, className: 'bg-muted text-muted-foreground' },
  degraded: { label: 'Degraded', icon: TriangleAlert, className: 'bg-destructive/10 text-destructive' },
} as const;

export default function ModelsPage() {
  const [period, setPeriod] = React.useState('30');
  const [selectedModelIds, setSelectedModelIds] = React.useState(defaultModelIds);
  const days = Number(period);

  const selectedModels = React.useMemo(() => getSelectedModels(selectedModelIds), [selectedModelIds]);
  const selectedDateSet = React.useMemo(() => new Set(allUsageDates.slice(-days)), [days]);
  const gatewayHealthById = React.useMemo(() => getModelGatewayHealth(days), [days]);
  const providerHealth = React.useMemo(() => getProviderGatewayHealth(days), [days]);

  const totalsById = React.useMemo(() => {
    const totals = getModelTotals(days);
    return new Map(totals.map((model) => [model.id, model]));
  }, [days]);

  const totalRequestsAllModels = React.useMemo(() => {
    let total = 0;
    for (const model of totalsById.values()) {
      total += model.totalRequests;
    }
    return total;
  }, [totalsById]);

  const selectedModelTotals = React.useMemo(() => {
    return selectedModels.map((model) => {
      const totals = totalsById.get(model.id);
      const requestShare =
        totalRequestsAllModels > 0 ? ((totals?.totalRequests ?? 0) / totalRequestsAllModels) * 100 : 0;

      return {
        ...model,
        totalRequests: totals?.totalRequests ?? 0,
        totalTokens: totals?.totalTokens ?? 0,
        totalCost: totals?.totalCost ?? 0,
        avgLatency: totals?.avgLatency ?? 0,
        requestShare,
        gatewayHealth: gatewayHealthById.get(model.id),
      };
    });
  }, [gatewayHealthById, selectedModels, totalRequestsAllModels, totalsById]);

  const chartConfig = React.useMemo(() => {
    return Object.fromEntries(
      selectedModelTotals.map((model) => [
        chartKeyForModel(model.id),
        {
          label: model.name,
          color: model.color,
        },
      ])
    ) satisfies ChartConfig;
  }, [selectedModelTotals]);

  const latencyChartData = React.useMemo(() => {
    const latencyLookup = new Map(
      getLatencyBuckets(days, selectedModelIds).map((entry) => [`${entry.bucket}:${entry.modelId}`, entry.count])
    );

    return bucketLabels.map((bucket) => {
      const row: Record<string, string | number> = { bucket };
      for (const model of selectedModelTotals) {
        row[chartKeyForModel(model.id)] = latencyLookup.get(`${bucket}:${model.id}`) ?? 0;
      }
      return row;
    });
  }, [days, selectedModelIds, selectedModelTotals]);

  const costChartData = React.useMemo(() => {
    return allUsageDates.slice(-days).map((date) => {
      const row: Record<string, string | number> = { date };
      for (const model of selectedModelTotals) {
        row[chartKeyForModel(model.id)] = usageLookup.get(`${date}:${model.id}`)?.cost ?? 0;
      }
      return row;
    });
  }, [days, selectedModelTotals]);

  const modelSparklines = React.useMemo(() => {
    return new Map(
      selectedModelTotals.map((model) => [
        model.id,
        allUsageDates
          .filter((date) => selectedDateSet.has(date))
          .map((date) => ({ value: usageLookup.get(`${date}:${model.id}`)?.requests ?? 0 })),
      ])
    );
  }, [selectedDateSet, selectedModelTotals]);

  const routingSignals = React.useMemo(() => {
    const modelsWithHealth = selectedModelTotals.filter((model) => model.gatewayHealth);
    return {
      reliable: [...modelsWithHealth].sort(
        (a, b) => (b.gatewayHealth?.successRate ?? 0) - (a.gatewayHealth?.successRate ?? 0)
      )[0],
      responsive: modelsWithHealth
        .filter((model) => (model.gatewayHealth?.p50TtftMs ?? 0) > 0)
        .sort((a, b) => (a.gatewayHealth?.p50TtftMs ?? 0) - (b.gatewayHealth?.p50TtftMs ?? 0))[0],
      efficient: [...modelsWithHealth].sort(
        (a, b) => (a.gatewayHealth?.costPer1kRequests ?? 0) - (b.gatewayHealth?.costPer1kRequests ?? 0)
      )[0],
    };
  }, [selectedModelTotals]);

  const handleResetModels = React.useCallback(() => {
    setSelectedModelIds(defaultModelIds);
  }, []);

  return (
    <div>
      <div className='flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between'>
        <div>
          <h1 className='text-2xl font-semibold text-foreground'>Model & Provider Health</h1>
          <p className='mt-1 text-sm text-muted-foreground'>
            Compare route reliability, response performance, and cost across your gateway
          </p>
        </div>
        <div className='flex flex-col gap-2 sm:flex-row sm:items-center'>
          <Select value={period} onValueChange={(value) => value && setPeriod(value)} items={periodItems}>
            <SelectTrigger className='w-full sm:w-[128px]'>
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
          <ModelMultiSelect
            selectedModels={selectedModelIds}
            onModelsChange={setSelectedModelIds}
            allLabel='Select models'
            contentAlign='end'
            maxSelected={maxCompareModels}
            minSelected={1}
            showLimit
            triggerClassName='h-9 w-full justify-between gap-1.5 rounded-3xl bg-input/50 px-3 py-2 font-normal hover:bg-input/60 sm:w-[220px]'
            triggerText={(count) => (count === 1 ? '1 model selected' : `${count} models selected`)}
          />
          <Button type='button' variant='ghost' className='w-full gap-1.5 sm:w-auto' onClick={handleResetModels}>
            <RotateCcw className='size-3.5' aria-hidden='true' />
            Reset
          </Button>
        </div>
      </div>
      <Separator className='my-6' />

      <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3'>
        {selectedModelTotals.map((model) => {
          const sparkConfig = { value: { label: model.name, color: model.color } } satisfies ChartConfig;
          const sparkData = modelSparklines.get(model.id) ?? [];
          return (
            <Card key={model.id} className='rounded-3xl shadow-sm'>
              <CardHeader className='pb-2'>
                <div className='flex items-center justify-between'>
                  <div className='flex min-w-0 items-center gap-2'>
                    <ProviderLogo providerId={model.providerId} size={16} />
                    <CardTitle className='truncate text-base font-semibold'>{model.name}</CardTitle>
                  </div>
                  <Badge variant='secondary' className='rounded-full text-xs'>
                    {model.provider}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className='grid grid-cols-2 gap-x-4 gap-y-3'>
                  <div>
                    <p className='text-xs text-muted-foreground'>Route success</p>
                    <p className='text-sm font-semibold text-foreground tabular-nums'>
                      {model.gatewayHealth?.successRate.toFixed(1) ?? '0.0'}%
                    </p>
                  </div>
                  <div>
                    <p className='text-xs text-muted-foreground'>P95 latency</p>
                    <p className='text-sm font-semibold text-foreground tabular-nums'>
                      {formatDuration(model.gatewayHealth?.p95LatencyMs ?? 0)}
                    </p>
                  </div>
                  <div>
                    <p className='text-xs text-muted-foreground'>P50 TTFT</p>
                    <p className='text-sm font-semibold text-foreground tabular-nums'>
                      {formatDuration(model.gatewayHealth?.p50TtftMs ?? 0)}
                    </p>
                  </div>
                  <div>
                    <p className='text-xs text-muted-foreground'>Gateway overhead</p>
                    <p className='text-sm font-semibold text-foreground tabular-nums'>
                      {formatDuration(model.gatewayHealth?.gatewayOverheadMs ?? 0)}
                    </p>
                  </div>
                  <div>
                    <p className='text-xs text-muted-foreground'>Fallback rate</p>
                    <p className='text-sm font-semibold text-foreground tabular-nums'>
                      {model.gatewayHealth?.fallbackRate.toFixed(1) ?? '0.0'}%
                    </p>
                  </div>
                  <div>
                    <p className='text-xs text-muted-foreground'>Cache served</p>
                    <p className='text-sm font-semibold text-foreground tabular-nums'>
                      {model.gatewayHealth?.cacheRate.toFixed(1) ?? '0.0'}%
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
                <div className='mt-3 flex items-center justify-between border-t border-border pt-3 text-xs text-muted-foreground'>
                  <span>{formatters.compact(model.totalRequests)} requests</span>
                  <span className='tabular-nums'>
                    {formatters.currency(model.gatewayHealth?.costPer1kRequests ?? 0)} / 1K req
                  </span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <section className='mt-8' aria-labelledby='routing-signals-title'>
        <div className='mb-3'>
          <h2 id='routing-signals-title' className='text-sm font-medium text-foreground'>
            Routing signals
          </h2>
          <p className='mt-1 text-sm text-muted-foreground'>Best current candidates across the selected model pool</p>
        </div>
        <div className='grid gap-3 sm:grid-cols-3'>
          <div className='rounded-2xl border border-border bg-muted/20 p-4'>
            <div className='flex items-center gap-2 text-xs text-muted-foreground'>
              <ShieldCheck className='size-3.5' aria-hidden='true' />
              Most reliable
            </div>
            <p className='mt-3 truncate text-sm font-medium text-foreground'>
              {routingSignals.reliable?.name ?? 'No data'}
            </p>
            <p className='mt-1 text-xs text-muted-foreground tabular-nums'>
              {routingSignals.reliable?.gatewayHealth?.successRate.toFixed(1) ?? '0.0'}% route success
            </p>
          </div>
          <div className='rounded-2xl border border-border bg-muted/20 p-4'>
            <div className='flex items-center gap-2 text-xs text-muted-foreground'>
              <Timer className='size-3.5' aria-hidden='true' />
              Fastest response
            </div>
            <p className='mt-3 truncate text-sm font-medium text-foreground'>
              {routingSignals.responsive?.name ?? 'No data'}
            </p>
            <p className='mt-1 text-xs text-muted-foreground tabular-nums'>
              {formatDuration(routingSignals.responsive?.gatewayHealth?.p50TtftMs ?? 0)} median TTFT
            </p>
          </div>
          <div className='rounded-2xl border border-border bg-muted/20 p-4'>
            <div className='flex items-center gap-2 text-xs text-muted-foreground'>
              <Zap className='size-3.5' aria-hidden='true' />
              Lowest route cost
            </div>
            <p className='mt-3 truncate text-sm font-medium text-foreground'>
              {routingSignals.efficient?.name ?? 'No data'}
            </p>
            <p className='mt-1 text-xs text-muted-foreground tabular-nums'>
              {formatters.currency(routingSignals.efficient?.gatewayHealth?.costPer1kRequests ?? 0)} / 1K requests
            </p>
          </div>
        </div>
      </section>

      <Card className='mt-8 rounded-3xl shadow-sm'>
        <CardHeader>
          <div className='flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between'>
            <div>
              <CardTitle className='text-base font-medium'>Provider Route Health</CardTitle>
              <p className='mt-1 text-sm text-muted-foreground'>
                Live attempt reliability across primary and fallback routes
              </p>
            </div>
            <Badge variant='outline' className='mt-2 rounded-full sm:mt-0'>
              {providerHealth.length} providers active
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className='hidden overflow-x-auto md:block'>
            <Table>
              <TableHeader>
                <TableRow className='hover:bg-transparent'>
                  <TableHead className='min-w-44 text-muted-foreground'>Provider</TableHead>
                  <TableHead className='text-muted-foreground'>Status</TableHead>
                  <TableHead className='text-right text-muted-foreground'>Route share</TableHead>
                  <TableHead className='text-right text-muted-foreground'>Success</TableHead>
                  <TableHead className='text-right text-muted-foreground'>Rate limited</TableHead>
                  <TableHead className='text-right text-muted-foreground'>P50 TTFT</TableHead>
                  <TableHead className='text-right text-muted-foreground'>P95 latency</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {providerHealth.map((provider) => {
                  const status = providerStatusConfig[provider.status];
                  const StatusIcon = status.icon;
                  return (
                    <TableRow key={provider.providerId}>
                      <TableCell>
                        <div className='flex items-center gap-2 font-medium text-foreground'>
                          <ProviderLogo providerId={provider.providerId} size={15} />
                          {provider.provider}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant='secondary' className={`rounded-full ${status.className}`}>
                          <StatusIcon data-icon='inline-start' />
                          {status.label}
                        </Badge>
                      </TableCell>
                      <TableCell className='text-right text-muted-foreground tabular-nums'>
                        {provider.attemptShare.toFixed(1)}%
                      </TableCell>
                      <TableCell className='text-right font-medium text-foreground tabular-nums'>
                        {provider.successRate.toFixed(1)}%
                      </TableCell>
                      <TableCell className='text-right text-muted-foreground tabular-nums'>
                        {provider.rateLimitRate.toFixed(1)}%
                      </TableCell>
                      <TableCell className='text-right text-muted-foreground tabular-nums'>
                        {formatDuration(provider.p50TtftMs)}
                      </TableCell>
                      <TableCell className='text-right text-muted-foreground tabular-nums'>
                        {formatDuration(provider.p95LatencyMs)}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>

          <div className='divide-y divide-border md:hidden'>
            {providerHealth.map((provider) => {
              const status = providerStatusConfig[provider.status];
              const StatusIcon = status.icon;
              return (
                <div key={provider.providerId} className='py-4 first:pt-0 last:pb-0'>
                  <div className='flex items-center justify-between gap-3'>
                    <div className='flex min-w-0 items-center gap-2 font-medium text-foreground'>
                      <ProviderLogo providerId={provider.providerId} size={15} />
                      <span className='truncate'>{provider.provider}</span>
                    </div>
                    <Badge variant='secondary' className={`rounded-full ${status.className}`}>
                      <StatusIcon data-icon='inline-start' />
                      {status.label}
                    </Badge>
                  </div>
                  <div className='mt-4 grid grid-cols-4 gap-2'>
                    <div>
                      <p className='text-xs text-muted-foreground'>Success</p>
                      <p className='mt-1 text-sm font-medium tabular-nums'>{provider.successRate.toFixed(1)}%</p>
                    </div>
                    <div>
                      <p className='text-xs text-muted-foreground'>Rate limit</p>
                      <p className='mt-1 text-sm font-medium tabular-nums'>{provider.rateLimitRate.toFixed(1)}%</p>
                    </div>
                    <div>
                      <p className='text-xs text-muted-foreground'>P50 TTFT</p>
                      <p className='mt-1 text-sm font-medium tabular-nums'>{formatDuration(provider.p50TtftMs)}</p>
                    </div>
                    <div>
                      <p className='text-xs text-muted-foreground'>P95</p>
                      <p className='mt-1 text-sm font-medium tabular-nums'>{formatDuration(provider.p95LatencyMs)}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <Card className='mt-8 rounded-3xl shadow-sm'>
        <CardHeader>
          <CardTitle className='text-base font-medium'>Latency Distribution by Model</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={chartConfig}
            className='aspect-auto h-72 w-full'
            initialDimension={{ width: 800, height: 288 }}
          >
            <BarChart data={latencyChartData} margin={{ top: 10, right: 10, bottom: 0, left: 0 }}>
              <CartesianGrid vertical={false} />
              <XAxis dataKey='bucket' tickLine={false} axisLine={false} tickMargin={8} />
              <YAxis tickLine={false} axisLine={false} />
              <ChartTooltip content={<ChartTooltipContent />} />
              {selectedModelTotals.map((model) => (
                <Bar key={model.id} dataKey={chartKeyForModel(model.id)} fill={model.color} radius={[2, 2, 0, 0]} />
              ))}
              <ChartLegend content={<ChartLegendContent />} />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>

      <Card className='mt-8 rounded-3xl shadow-sm'>
        <CardHeader>
          <CardTitle className='text-base font-medium'>Daily Cost by Model</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={chartConfig}
            className='aspect-auto h-64 w-full'
            initialDimension={{ width: 800, height: 256 }}
          >
            <AreaChart data={costChartData} margin={{ top: 10, right: 10, bottom: 0, left: 0 }}>
              <defs>
                {selectedModelTotals.map((model) => (
                  <linearGradient key={model.id} id={`costFill-${model.id}`} x1='0' y1='0' x2='0' y2='1'>
                    <stop offset='0%' stopColor={model.color} stopOpacity={0.2} />
                    <stop offset='100%' stopColor={model.color} stopOpacity={0.01} />
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
                tickFormatter={formatDateTick}
              />
              <YAxis hide />
              <ChartTooltip content={<ChartTooltipContent valueFormatter={(v) => formatters.currency(Number(v))} />} />
              {selectedModelTotals.map((model) => (
                <Area
                  key={model.id}
                  type='monotone'
                  dataKey={chartKeyForModel(model.id)}
                  stackId='1'
                  stroke={model.color}
                  strokeWidth={1.5}
                  fill={`url(#costFill-${model.id})`}
                  dot={false}
                />
              ))}
              <ChartLegend content={<ChartLegendContent />} />
            </AreaChart>
          </ChartContainer>
        </CardContent>
      </Card>

      <Card className='mt-8 rounded-3xl shadow-sm'>
        <CardHeader>
          <CardTitle className='text-base font-medium'>Gateway Performance Comparison</CardTitle>
          <p className='text-sm text-muted-foreground'>
            Usage totals paired with route-level performance for the selected models
          </p>
        </CardHeader>
        <CardContent>
          <div className='overflow-x-auto'>
            <Table>
              <TableHeader>
                <TableRow className='hover:bg-transparent'>
                  <TableHead className='min-w-52 text-muted-foreground'>Model</TableHead>
                  <TableHead className='text-muted-foreground'>Provider</TableHead>
                  <TableHead className='text-right text-muted-foreground'>Requests</TableHead>
                  <TableHead className='text-right text-muted-foreground'>Spend</TableHead>
                  <TableHead className='text-right text-muted-foreground'>Success</TableHead>
                  <TableHead className='text-right text-muted-foreground'>P50 TTFT</TableHead>
                  <TableHead className='text-right text-muted-foreground'>P95 latency</TableHead>
                  <TableHead className='text-right text-muted-foreground'>Cache</TableHead>
                  <TableHead className='text-right text-muted-foreground'>Fallback</TableHead>
                  <TableHead className='text-right text-muted-foreground'>Cost / 1K req</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {selectedModelTotals.map((model, index) => (
                  <TableRow key={model.id} className={index % 2 === 0 ? 'bg-muted/30' : ''}>
                    <TableCell className='font-medium text-foreground'>
                      <div className='flex items-center gap-2'>
                        <ProviderLogo providerId={model.providerId} size={14} />
                        <span className='whitespace-nowrap'>{model.name}</span>
                      </div>
                    </TableCell>
                    <TableCell className='text-muted-foreground'>{model.provider}</TableCell>
                    <TableCell className='text-right text-muted-foreground tabular-nums'>
                      {formatters.compact(model.totalRequests)}
                    </TableCell>
                    <TableCell className='text-right text-muted-foreground tabular-nums'>
                      {formatters.currency(model.totalCost)}
                    </TableCell>
                    <TableCell className='text-right font-medium text-foreground tabular-nums'>
                      {model.gatewayHealth?.successRate.toFixed(1) ?? '0.0'}%
                    </TableCell>
                    <TableCell className='text-right text-muted-foreground tabular-nums'>
                      {formatDuration(model.gatewayHealth?.p50TtftMs ?? 0)}
                    </TableCell>
                    <TableCell className='text-right text-muted-foreground tabular-nums'>
                      {formatDuration(model.gatewayHealth?.p95LatencyMs ?? 0)}
                    </TableCell>
                    <TableCell className='text-right text-muted-foreground tabular-nums'>
                      {model.gatewayHealth?.cacheRate.toFixed(1) ?? '0.0'}%
                    </TableCell>
                    <TableCell className='text-right text-muted-foreground tabular-nums'>
                      {model.gatewayHealth?.fallbackRate.toFixed(1) ?? '0.0'}%
                    </TableCell>
                    <TableCell className='text-right text-muted-foreground tabular-nums'>
                      {formatters.currency(model.gatewayHealth?.costPer1kRequests ?? 0)}
                    </TableCell>
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
