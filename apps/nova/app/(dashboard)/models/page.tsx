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
import { RotateCcw } from 'lucide-react';

import { modelMap, type ModelDefinition } from '@/lib/data/models';
import { getModelTotals, usageByModel } from '@/lib/data/usage-by-model';
import { getLatencyBuckets } from '@/lib/data/latency-buckets';
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

export default function ModelsPage() {
  const [period, setPeriod] = React.useState('30');
  const [selectedModelIds, setSelectedModelIds] = React.useState(defaultModelIds);
  const days = Number(period);

  const selectedModels = React.useMemo(() => getSelectedModels(selectedModelIds), [selectedModelIds]);
  const selectedDateSet = React.useMemo(() => new Set(allUsageDates.slice(-days)), [days]);

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
      };
    });
  }, [selectedModels, totalRequestsAllModels, totalsById]);

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

  const handleResetModels = React.useCallback(() => {
    setSelectedModelIds(defaultModelIds);
  }, []);

  return (
    <div>
      <div className='flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between'>
        <div>
          <h1 className='text-2xl font-semibold text-foreground'>Models</h1>
          <p className='mt-1 text-sm text-muted-foreground'>
            Compare model performance, costs, and usage patterns across your AI stack
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
                <div className='grid grid-cols-2 gap-3'>
                  <div>
                    <p className='text-xs text-muted-foreground'>Request share</p>
                    <p className='text-sm font-semibold text-foreground tabular-nums'>
                      {model.requestShare.toFixed(1)}%
                    </p>
                  </div>
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
          <CardTitle className='text-base font-medium'>Performance Comparison</CardTitle>
        </CardHeader>
        <CardContent>
          <div className='overflow-x-auto'>
            <Table>
              <TableHeader>
                <TableRow className='hover:bg-transparent'>
                  <TableHead className='min-w-52 text-muted-foreground'>Model</TableHead>
                  <TableHead className='text-muted-foreground'>Provider</TableHead>
                  <TableHead className='text-right text-muted-foreground'>Requests</TableHead>
                  <TableHead className='text-right text-muted-foreground'>Tokens</TableHead>
                  <TableHead className='text-right text-muted-foreground'>Cost</TableHead>
                  <TableHead className='text-right text-muted-foreground'>Avg Latency</TableHead>
                  <TableHead className='text-right text-muted-foreground'>Input / 1K</TableHead>
                  <TableHead className='text-right text-muted-foreground'>Output / 1K</TableHead>
                  <TableHead className='text-right text-muted-foreground'>Share</TableHead>
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
                      {formatters.compact(model.totalTokens)}
                    </TableCell>
                    <TableCell className='text-right text-muted-foreground tabular-nums'>
                      {formatters.currency(model.totalCost)}
                    </TableCell>
                    <TableCell className='text-right text-muted-foreground tabular-nums'>
                      {model.avgLatency}ms
                    </TableCell>
                    <TableCell className='text-right text-muted-foreground tabular-nums'>
                      {formatters.currencyPrecise(model.costPer1kInput)}
                    </TableCell>
                    <TableCell className='text-right text-muted-foreground tabular-nums'>
                      {formatters.currencyPrecise(model.costPer1kOutput)}
                    </TableCell>
                    <TableCell className='text-right text-muted-foreground tabular-nums'>
                      {model.requestShare.toFixed(1)}%
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
