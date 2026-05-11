'use client';

import * as React from 'react';
import { Settings } from 'lucide-react';
import type { DateRange } from 'react-day-picker';

import { Button } from '@workspace/ui/components/button';
import { Checkbox } from '@workspace/ui/components/checkbox';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@workspace/ui/components/dialog';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@workspace/ui/components/drawer';
import { Label } from '@workspace/ui/components/label';
import { Select, SelectContent, SelectTrigger, SelectValue } from '@workspace/ui/components/select';
import { DateRangePicker } from '@/components/date-range-picker';
import { SelectItemPeriod } from '@/components/select-item-period';
import { ChartCard } from '@/components/ui/overview/dashboard-chart-card';
import { getPeriod } from '@/lib/overview-period';
import type { PeriodValue } from '@/lib/types/overview';
import { cn } from '@/lib/utils';
import { useMediaQuery } from '@/lib/use-media-query';

type Period = { value: PeriodValue; label: string };

const periods: Period[] = [
  { value: 'previous-period', label: 'Previous period' },
  { value: 'last-year', label: 'Last year' },
  { value: 'no-comparison', label: 'No comparison' },
];

type Category = { title: string; type: 'currency' | 'unit' };

type FilterbarProps = {
  maxDate?: Date;
  minDate?: Date;
  selectedDates: DateRange | undefined;
  onDatesChange: (dates: DateRange | undefined) => void;
  selectedPeriod: PeriodValue;
  onPeriodChange: (period: PeriodValue) => void;
  categories: Category[];
  setSelectedCategories: React.Dispatch<React.SetStateAction<string[]>>;
  selectedCategories: string[];
};

export function Filterbar({
  maxDate,
  minDate,
  selectedDates,
  onDatesChange,
  selectedPeriod,
  onPeriodChange,
  categories,
  setSelectedCategories,
  selectedCategories,
}: FilterbarProps) {
  const [tempSelectedCategories, setTempSelectedCategories] = React.useState(selectedCategories);
  const isDesktop = useMediaQuery('(min-width: 768px)');

  React.useEffect(() => {
    setTempSelectedCategories(selectedCategories);
  }, [selectedCategories]);

  const handleCategoryChange = (category: string) => {
    setTempSelectedCategories((prev) =>
      prev.includes(category) ? prev.filter((item) => item !== category) : [...prev, category]
    );
  };

  const handleApply = () => {
    setSelectedCategories(tempSelectedCategories);
  };

  const trigger = (
    <Button variant='secondary' size='sm' className='w-full gap-2 sm:w-fit'>
      <Settings className='-ml-0.5 size-4 shrink-0' aria-hidden />
      <span>Edit</span>
    </Button>
  );

  const chartOptions = (
    <div className={cn('grid grid-cols-1 gap-5 overflow-y-auto md:grid-cols-2 2xl:grid-cols-3')}>
      {categories.map((category) => (
        <Label
          htmlFor={category.title}
          key={category.title}
          className='relative block w-full cursor-pointer rounded-2xl border border-border bg-card/40 p-5 transition-colors hover:bg-muted/30'
        >
          <Checkbox
            id={category.title}
            className='absolute top-5 right-5'
            checked={tempSelectedCategories.includes(category.title)}
            onCheckedChange={() => handleCategoryChange(category.title)}
          />
          <div className='pointer-events-none w-full pt-1'>
            <ChartCard
              title={category.title as never}
              type={category.type}
              selectedDates={selectedDates}
              selectedPeriod={selectedPeriod}
              isThumbnail
            />
          </div>
        </Label>
      ))}
    </div>
  );

  return (
    <div className='flex w-full flex-col gap-3 sm:flex-row sm:justify-between'>
      <div className='w-full sm:flex sm:items-center sm:gap-3'>
        <DateRangePicker
          value={selectedDates}
          onChange={onDatesChange}
          className='w-full sm:w-fit'
          toDate={maxDate}
          fromDate={minDate}
          align='start'
        />
        <span className='hidden text-sm font-medium text-muted-foreground sm:block'>compared to</span>
        <Select
          value={selectedPeriod}
          items={periods}
          onValueChange={(v) => {
            onPeriodChange(v as PeriodValue);
          }}
        >
          <SelectTrigger className='mt-2 w-full sm:mt-0 sm:w-fit'>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {periods.map((period) => (
              <SelectItemPeriod key={period.value} value={period.value} period={getPeriod(selectedDates, period.value)}>
                {period.label}
              </SelectItemPeriod>
            ))}
          </SelectContent>
        </Select>
      </div>
      {isDesktop ? (
        <Dialog>
          <DialogTrigger render={trigger} />
          <DialogContent className='!max-w-[95vw] gap-4 sm:!max-w-6xl' showCloseButton>
            <DialogHeader>
              <DialogTitle>Customise overview charts</DialogTitle>
              <DialogDescription className='sr-only'>
                Add or remove the charts for the overview panel.
              </DialogDescription>
            </DialogHeader>
            <div className='mt-2 max-h-[70vh] overflow-y-auto'>{chartOptions}</div>
            <DialogFooter className='mt-2'>
              <DialogClose
                render={<Button className='mt-2 w-full sm:mt-0 sm:w-fit' variant='secondary' type='button' />}
              >
                Cancel
              </DialogClose>
              <DialogClose render={<Button className='w-full sm:w-fit' type='button' onClick={handleApply} />}>
                Apply
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      ) : (
        <Drawer>
          <DrawerTrigger asChild>{trigger}</DrawerTrigger>
          <DrawerContent className='max-h-[90svh]'>
            <DrawerHeader className='text-left'>
              <DrawerTitle>Customise overview charts</DrawerTitle>
              <DrawerDescription>Add or remove the charts for the overview panel.</DrawerDescription>
            </DrawerHeader>
            <div className='overflow-y-auto px-4 pb-4'>{chartOptions}</div>
            <DrawerFooter className='border-t border-border/70'>
              <DrawerClose asChild>
                <Button type='button' variant='secondary'>
                  Cancel
                </Button>
              </DrawerClose>
              <DrawerClose asChild>
                <Button type='button' onClick={handleApply}>
                  Apply
                </Button>
              </DrawerClose>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      )}
    </div>
  );
}
