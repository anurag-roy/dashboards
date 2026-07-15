'use client';

import { cn, focusRing } from '@/lib/utils';
import { Button } from '@workspace/ui/components/button';
import { Checkbox } from '@workspace/ui/components/checkbox';
import { Input } from '@workspace/ui/components/input';
import { Label } from '@workspace/ui/components/label';
import { Popover, PopoverContent, PopoverTrigger } from '@workspace/ui/components/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@workspace/ui/components/select';
import { type Column } from '@tanstack/react-table';
import { CornerDownRight, Plus, ChevronsDown } from 'lucide-react';
import * as React from 'react';

export type ConditionFilter = {
  condition: string;
  value: [number | string, number | string];
};

type FilterType = 'select' | 'checkbox' | 'number';

interface DataTableFilterProps<TData, TValue> {
  column: Column<TData, TValue> | undefined;
  title?: string;
  options?: {
    label: string;
    value: string;
  }[];
  type?: FilterType;
  formatter?: (value: unknown) => string;
}

const ColumnFiltersLabel = ({
  columnFilterLabels,
  className,
}: {
  columnFilterLabels: string[] | undefined;
  className?: string;
}) => {
  if (!columnFilterLabels) return null;

  if (columnFilterLabels.length < 3) {
    return (
      <span className={cn('truncate', className)}>
        {columnFilterLabels.map((value, index) => (
          <span key={value} className='font-semibold text-primary'>
            {value}
            {index < columnFilterLabels.length - 1 && ', '}
          </span>
        ))}
      </span>
    );
  }

  return (
    <span className={cn('font-semibold text-primary', className)}>
      {columnFilterLabels[0]} and {columnFilterLabels.length - 1} more
    </span>
  );
};

type FilterValues = string | string[] | ConditionFilter | undefined;

const isConditionFilter = (value: FilterValues): value is ConditionFilter =>
  typeof value === 'object' && value !== null && 'condition' in value;

export function DataTableFilter<TData, TValue>({
  column,
  title,
  options,
  type = 'select',
  formatter = (value: unknown) => String(value),
}: DataTableFilterProps<TData, TValue>) {
  const columnFilters = column?.getFilterValue() as FilterValues;
  const getEmptyValue = React.useCallback(
    (): Exclude<FilterValues, undefined> =>
      type === 'checkbox' ? [] : type === 'number' ? { condition: '', value: ['', ''] } : '',
    [type]
  );
  const [selectedValues, setSelectedValues] = React.useState<FilterValues>(() => columnFilters ?? getEmptyValue());
  const [open, setOpen] = React.useState(false);
  const hasSelectedValue = React.useMemo(() => {
    if (typeof selectedValues === 'string') {
      return selectedValues !== '';
    }
    if (Array.isArray(selectedValues)) {
      return selectedValues.length > 0;
    }
    if (isConditionFilter(selectedValues)) {
      return selectedValues.condition !== '';
    }
    return false;
  }, [selectedValues]);

  const columnFilterLabels = React.useMemo(() => {
    if (!selectedValues) return undefined;

    if (Array.isArray(selectedValues)) {
      if (selectedValues.length === 0) return undefined;
      return selectedValues.map((value) => formatter(value));
    }

    if (typeof selectedValues === 'string') {
      if (selectedValues === '') return undefined;
      return [formatter(selectedValues)];
    }

    if (typeof selectedValues === 'object' && 'condition' in selectedValues) {
      const condition = options?.find((option) => option.value === selectedValues.condition)?.label;
      if (!condition) return undefined;
      if (!selectedValues.value?.[0] && !selectedValues.value?.[1]) return [`${condition}`];
      if (!selectedValues.value?.[1]) return [`${condition} ${formatter(selectedValues.value?.[0])}`];
      return [`${condition} ${formatter(selectedValues.value?.[0])} and ${formatter(selectedValues.value?.[1])}`];
    }

    return undefined;
  }, [selectedValues, options, formatter]);

  const getDisplayedFilter = () => {
    switch (type) {
      case 'select':
        return (
          <Select
            value={typeof selectedValues === 'string' ? selectedValues : ''}
            items={options}
            onValueChange={(value) => {
              setSelectedValues(value ?? '');
            }}
          >
            <SelectTrigger className='mt-2'>
              <SelectValue placeholder='Select' />
            </SelectTrigger>
            <SelectContent>
              {options?.map((item) => (
                <SelectItem key={item.value} value={item.value}>
                  {item.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      case 'checkbox':
        return (
          <div className='mt-2 max-h-40 space-y-2 overflow-y-auto'>
            {options?.map((option) => {
              return (
                <div key={option.label} className='flex items-center gap-2.5 rounded-xl px-1 py-1'>
                  <Checkbox
                    id={option.value}
                    checked={(selectedValues as string[])?.includes(option.value)}
                    onCheckedChange={(checked) => {
                      setSelectedValues((prev) => {
                        const previousValues = Array.isArray(prev) ? prev : [];
                        if (checked) {
                          return previousValues.includes(option.value)
                            ? previousValues
                            : [...previousValues, option.value];
                        }
                        return previousValues.filter((value) => value !== option.value);
                      });
                    }}
                  />
                  <Label htmlFor={option.value} className='text-sm'>
                    {option.label}
                  </Label>
                </div>
              );
            })}
          </div>
        );
      case 'number': {
        const numberFilter = isConditionFilter(selectedValues)
          ? selectedValues
          : { condition: '', value: ['', ''] as [number | string, number | string] };
        const isBetween = numberFilter.condition === 'is-between';
        return (
          <div className='space-y-2'>
            <Select
              value={numberFilter.condition}
              items={options}
              onValueChange={(value) => {
                setSelectedValues((prev) => {
                  const previousNumberFilter = isConditionFilter(prev) ? prev : { condition: '', value: ['', ''] };
                  return {
                    condition: value ?? '',
                    value: [value !== '' ? previousNumberFilter.value?.[0] : '', ''],
                  };
                });
              }}
            >
              <SelectTrigger className='mt-2'>
                <SelectValue placeholder='Select condition' />
              </SelectTrigger>
              <SelectContent>
                {options?.map((item) => (
                  <SelectItem key={item.value} value={item.value}>
                    {item.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className='flex w-full items-center gap-2'>
              <CornerDownRight className='size-4 shrink-0 text-muted-foreground' aria-hidden='true' />
              <Input
                disabled={!numberFilter.condition}
                type='number'
                placeholder='$0'
                value={numberFilter.value?.[0] as string | number}
                onChange={(e) => {
                  setSelectedValues((prev) => {
                    const previousNumberFilter = isConditionFilter(prev) ? prev : { condition: '', value: ['', ''] };
                    return {
                      condition: previousNumberFilter.condition,
                      value: [e.target.value, isBetween ? previousNumberFilter.value?.[1] : ''],
                    };
                  });
                }}
              />
              {numberFilter.condition === 'is-between' && (
                <>
                  <span className='text-xs font-medium text-muted-foreground'>and</span>
                  <Input
                    disabled={!numberFilter.condition}
                    type='number'
                    placeholder='$0'
                    value={numberFilter.value?.[1] as string | number}
                    onChange={(e) => {
                      setSelectedValues((prev) => {
                        const previousNumberFilter = isConditionFilter(prev)
                          ? prev
                          : { condition: '', value: ['', ''] };
                        return {
                          condition: previousNumberFilter.condition,
                          value: [previousNumberFilter.value?.[0], e.target.value],
                        };
                      });
                    }}
                  />
                </>
              )}
            </div>
          </div>
        );
      }
    }
  };

  React.useEffect(() => {
    setSelectedValues(columnFilters ?? getEmptyValue());
  }, [columnFilters, getEmptyValue]);

  return (
    <Popover
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (!next) {
          if (
            !columnFilters ||
            (typeof columnFilters === 'string' && columnFilters === '') ||
            (Array.isArray(columnFilters) && columnFilters.length === 0) ||
            (isConditionFilter(columnFilters) && columnFilters.condition === '')
          ) {
            column?.setFilterValue('');
            setSelectedValues(getEmptyValue());
          }
        }
      }}
    >
      <PopoverTrigger
        render={
          <button
            type='button'
            className={cn(
              'flex h-9 w-full items-center gap-x-2 rounded-3xl border border-border px-3 font-medium whitespace-nowrap text-muted-foreground hover:bg-muted sm:w-fit sm:text-xs',
              hasSelectedValue ? '' : 'border-dashed',
              focusRing
            )}
          >
            <span
              aria-hidden='true'
              onClick={(e) => {
                if (hasSelectedValue) {
                  e.stopPropagation();
                  column?.setFilterValue('');
                  setSelectedValues(getEmptyValue());
                }
              }}
            >
              <Plus
                className={cn('size-4 shrink-0 transition', hasSelectedValue && 'rotate-45 hover:text-destructive')}
                aria-hidden='true'
              />
            </span>
            {columnFilterLabels && columnFilterLabels.length > 0 ? (
              <span>{title}</span>
            ) : (
              <span className='w-full text-left sm:w-fit'>{title}</span>
            )}
            {columnFilterLabels && columnFilterLabels.length > 0 && (
              <span className='h-4 w-px bg-border' aria-hidden='true' />
            )}
            <ColumnFiltersLabel columnFilterLabels={columnFilterLabels} className='w-full text-left sm:w-fit' />
            <ChevronsDown className='size-4 shrink-0 text-muted-foreground' aria-hidden='true' />
          </button>
        }
      />
      <PopoverContent
        align='start'
        sideOffset={7}
        className='max-w-[min(100vw-2rem,20rem)] min-w-60 sm:max-w-64 sm:min-w-64'
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const valueToApply =
              (type === 'select' && selectedValues === '') ||
              (type === 'checkbox' && Array.isArray(selectedValues) && selectedValues.length === 0) ||
              (type === 'number' && isConditionFilter(selectedValues) && selectedValues.condition === '')
                ? ''
                : selectedValues;
            column?.setFilterValue(valueToApply);
            setOpen(false);
          }}
        >
          <div className='space-y-3'>
            <div>
              <Label className='text-base font-medium sm:text-sm'>Filter by {title}</Label>
              {getDisplayedFilter()}
            </div>
            <Button type='submit' className='w-full'>
              Apply
            </Button>
            {columnFilterLabels && columnFilterLabels.length > 0 && (
              <Button
                variant='secondary'
                className='w-full'
                type='button'
                onClick={() => {
                  column?.setFilterValue('');
                  setSelectedValues(getEmptyValue());
                }}
              >
                Reset
              </Button>
            )}
          </div>
        </form>
      </PopoverContent>
    </Popover>
  );
}
