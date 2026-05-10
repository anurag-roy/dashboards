import { useEffect, useMemo, useState } from 'react';
import { Button } from '@workspace/ui/components/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@workspace/ui/components/dialog';
import { Input } from '@workspace/ui/components/input';
import { Label } from '@workspace/ui/components/label';
import { Popover, PopoverContent, PopoverTrigger } from '@workspace/ui/components/popover';
import { Slider } from '@workspace/ui/components/slider';

import { formatters } from '@/lib/utils';
import type { Transaction } from '@/lib/data/schema';
import { useMediaQuery } from '@/lib/use-media-query';

type FilterAmountProps = {
  minAmount: number;
  maxAmount: number;
  amountRange: [number, number];
  transactions: Transaction[];
  onAmountChange: (value: [number, number]) => void;
};

function roundToNiceAmount(value: number) {
  return Math.max(100, Math.round(value / 100) * 100);
}

export function FilterAmount({ minAmount, maxAmount, amountRange, transactions, onAmountChange }: FilterAmountProps) {
  const [localRange, setLocalRange] = useState<[number, number]>(amountRange);
  const [dialogOpen, setDialogOpen] = useState(false);
  const isDesktop = useMediaQuery('(min-width: 768px)');

  useEffect(() => {
    setLocalRange(amountRange);
  }, [amountRange]);

  const presetOptions = useMemo(() => {
    const firstMax = roundToNiceAmount(minAmount + (maxAmount - minAmount) * 0.4);
    const secondMax = roundToNiceAmount(minAmount + (maxAmount - minAmount) * 0.7);

    return [
      {
        label: `Up to ${formatters.currency(firstMax)}`,
        min: minAmount,
        max: Math.min(maxAmount, firstMax),
      },
      {
        label: `${formatters.currency(firstMax)} to ${formatters.currency(secondMax)}`,
        min: Math.max(minAmount, firstMax),
        max: Math.min(maxAmount, secondMax),
      },
      {
        label: `${formatters.currency(secondMax)} and above`,
        min: Math.max(minAmount, secondMax),
        max: maxAmount,
      },
    ];
  }, [maxAmount, minAmount]);

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
  }, [maxAmount, minAmount, localRange, transactions]);

  const normalizeRange = (nextRange: [number, number]): [number, number] => {
    const normalized: [number, number] = nextRange[0] <= nextRange[1] ? nextRange : [nextRange[1], nextRange[0]];
    return [Math.max(minAmount, normalized[0]), Math.min(maxAmount, normalized[1])];
  };

  const setRange = (nextRange: [number, number], commit = isDesktop) => {
    const normalized = normalizeRange(nextRange);
    setLocalRange(normalized);
    if (commit) {
      onAmountChange(normalized);
    }
  };

  const trigger = (
    <Button variant='secondary' className='w-full justify-start bg-input/50 font-normal tabular-nums md:w-56'>
      {formatters.currency(amountRange[0])} - {formatters.currency(amountRange[1])}
    </Button>
  );

  const amountControls = (
    <>
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
              setRange([option.min, option.max]);
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
              setRange([nextMin, Math.max(localRange[1], nextMin)]);
            }}
          />
          <span className='text-xs font-medium text-muted-foreground'>to</span>
          <Input
            type='number'
            value={localRange[1]}
            onChange={(event) => {
              const nextMax = Number(event.target.value);
              if (Number.isNaN(nextMax)) return;
              setRange([Math.min(localRange[0], nextMax), nextMax]);
            }}
          />
        </div>
      </div>
    </>
  );

  return (
    <div className='space-y-1.5'>
      <Label htmlFor='amount-filter' className='h-4 font-medium'>
        Transaction Amount
      </Label>
      {isDesktop ? (
        <Popover>
          <PopoverTrigger id='amount-filter' render={trigger} />
          <PopoverContent align='end' className='w-[min(24rem,calc(100vw-2rem))] gap-4 p-4'>
            {amountControls}
          </PopoverContent>
        </Popover>
      ) : (
        <Dialog
          open={dialogOpen}
          onOpenChange={(open) => {
            setDialogOpen(open);
            setLocalRange(amountRange);
          }}
        >
          <DialogTrigger id='amount-filter' render={trigger} />
          <DialogContent className='max-h-[calc(100svh-2rem)] overflow-y-auto rounded-3xl p-5' showCloseButton={false}>
            <DialogHeader>
              <DialogTitle>Transaction Amount</DialogTitle>
              <DialogDescription>
                Choose a transaction amount range between {formatters.currency(minAmount)} and{' '}
                {formatters.currency(maxAmount)}.
              </DialogDescription>
            </DialogHeader>
            <div className='grid gap-4'>{amountControls}</div>
            <DialogFooter className='border-t border-border/70 pt-4'>
              <Button
                variant='secondary'
                onClick={() => {
                  setLocalRange(amountRange);
                  setDialogOpen(false);
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={() => {
                  const normalized = normalizeRange(localRange);
                  onAmountChange(normalized);
                  setLocalRange(normalized);
                  setDialogOpen(false);
                }}
              >
                Apply
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
