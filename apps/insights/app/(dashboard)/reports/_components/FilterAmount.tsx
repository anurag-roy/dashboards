import { useEffect, useMemo, useState } from 'react';
import { Button } from '@workspace/ui/components/button';
import { Input } from '@workspace/ui/components/input';
import { Label } from '@workspace/ui/components/label';
import { Popover, PopoverContent, PopoverTrigger } from '@workspace/ui/components/popover';
import { Slider } from '@workspace/ui/components/slider';

import { transactions } from '@/lib/data/transactions';
import { formatters } from '@/lib/utils';

type FilterAmountProps = {
  minAmount: number;
  maxAmount: number;
  amountRange: [number, number];
  onAmountChange: (value: [number, number]) => void;
};

const presetOptions = [
  { label: 'Below $1,000', min: 0, max: 1_000 },
  { label: '$1,000 to $4,000', min: 1_000, max: 4_000 },
  { label: '$4,000 to $7,000', min: 4_000, max: 7_000 },
] as const;

export function FilterAmount({ minAmount, maxAmount, amountRange, onAmountChange }: FilterAmountProps) {
  const [localRange, setLocalRange] = useState<[number, number]>(amountRange);

  useEffect(() => {
    setLocalRange(amountRange);
  }, [amountRange]);

  const distributionData = useMemo(() => {
    const binsCount = 24;
    const bins = Array.from({ length: binsCount }, () => 0);
    const binSize = (maxAmount - minAmount) / binsCount || 1;

    for (const transaction of transactions) {
      const bucket = Math.min(Math.floor((transaction.amount - minAmount) / binSize), binsCount - 1);
      const bucketIndex = Math.max(0, bucket);
      bins[bucketIndex] = (bins[bucketIndex] ?? 0) + 1;
    }

    const maxBin = Math.max(...bins, 1);
    return bins.map((count, index) => {
      const lower = minAmount + index * binSize;
      const upper = lower + binSize;
      return {
        height: (count / maxBin) * 100,
        inRange: lower >= localRange[0] && upper <= localRange[1],
      };
    });
  }, [maxAmount, minAmount, localRange]);

  const setRange = (nextRange: [number, number]) => {
    const normalized: [number, number] = nextRange[0] <= nextRange[1] ? nextRange : [nextRange[1], nextRange[0]];
    setLocalRange(normalized);
    onAmountChange(normalized);
  };

  return (
    <div className='space-y-1.5'>
      <Label htmlFor='amount-filter' className='h-4 font-medium'>
        Transaction Amount
      </Label>
      <Popover>
        <PopoverTrigger
          id='amount-filter'
          render={
            <Button variant='secondary' className='w-full justify-start font-normal tabular-nums md:w-56'>
              {formatters.currency(localRange[0])} - {formatters.currency(localRange[1])}
            </Button>
          }
        />
        <PopoverContent align='end' className='w-[min(24rem,calc(100vw-2rem))] gap-4 p-4'>
          <div className='flex h-12 items-end gap-0.5'>
            {distributionData.map((bin, index) => (
              <div
                key={index}
                className={bin.inRange ? 'w-full rounded-sm bg-primary/70' : 'w-full rounded-sm bg-muted'}
                style={{ height: `${bin.height}%` }}
              />
            ))}
          </div>

          <Slider
            min={minAmount}
            max={maxAmount}
            step={50}
            value={localRange}
            onValueChange={(value) => {
              if (Array.isArray(value) && value.length === 2) {
                setRange([value[0]!, value[1]!]);
              }
            }}
          />

          <div className='space-y-2'>
            <p className='text-sm font-medium text-foreground'>Popular ranges</p>
            {presetOptions.map((option) => (
              <Button
                key={option.label}
                variant='secondary'
                className='w-full justify-start font-normal'
                onClick={() => {
                  setRange([Math.max(minAmount, option.min), Math.min(maxAmount, option.max)]);
                }}
              >
                {option.label}
              </Button>
            ))}
          </div>

          <div className='space-y-2'>
            <p className='text-sm font-medium text-foreground'>Custom range</p>
            <div className='flex items-center gap-2'>
              <Input
                type='number'
                value={localRange[0]}
                onChange={(event) => {
                  const nextMin = Number(event.target.value);
                  if (Number.isNaN(nextMin)) return;
                  setRange([Math.max(minAmount, nextMin), Math.max(localRange[1], nextMin)]);
                }}
              />
              <span className='text-xs font-medium text-muted-foreground'>to</span>
              <Input
                type='number'
                value={localRange[1]}
                onChange={(event) => {
                  const nextMax = Number(event.target.value);
                  if (Number.isNaN(nextMax)) return;
                  setRange([Math.min(localRange[0], nextMax), Math.min(maxAmount, nextMax)]);
                }}
              />
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
