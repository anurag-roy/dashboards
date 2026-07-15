'use client';

import { Line, LineChart, XAxis } from 'recharts';

import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@workspace/ui/components/chart';

import { volume } from '@/lib/data/support/volume';
import { cn, valueFormatter } from '@/lib/utils';

const chartConfig = {
  Today: {
    label: 'Today',
    color: 'var(--chart-2)',
  },
  Yesterday: {
    label: 'Yesterday',
    color: 'var(--chart-1)',
  },
};

type SupportChartProps = {
  className?: string;
};

export function SupportChart({ className }: SupportChartProps) {
  const start = volume[0]?.time;
  const end = volume[volume.length - 1]?.time;

  return (
    <ChartContainer config={chartConfig} className={cn('h-28 min-h-28 w-full min-w-0 [&_svg]:aspect-auto', className)}>
      <LineChart accessibilityLayer data={volume} margin={{ left: 0, right: 0, top: 4, bottom: 0 }}>
        <XAxis
          dataKey='time'
          tickLine={false}
          axisLine={false}
          interval='preserveStartEnd'
          ticks={start && end ? [start, end] : undefined}
          tickFormatter={(value) => String(value)}
          className='text-[10px]'
        />
        <ChartTooltip
          cursor={{ stroke: 'hsl(var(--border))', strokeWidth: 1 }}
          content={<ChartTooltipContent valueFormatter={(v) => valueFormatter(Number(v))} indicator='line' />}
        />
        <Line
          type='linear'
          dataKey='Today'
          stroke='var(--color-Today)'
          strokeWidth={2}
          strokeLinecap='round'
          dot={false}
          activeDot={{ r: 3, className: 'fill-background stroke-[var(--color-Today)]' }}
        />
        <Line
          type='linear'
          dataKey='Yesterday'
          stroke='var(--color-Yesterday)'
          strokeWidth={2}
          strokeLinecap='round'
          dot={false}
          activeDot={{ r: 3, className: 'fill-background stroke-[var(--color-Yesterday)]' }}
        />
      </LineChart>
    </ChartContainer>
  );
}
