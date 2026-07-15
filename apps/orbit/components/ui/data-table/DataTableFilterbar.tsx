'use client';

import { conditions, regions, statuses } from '@/lib/data/data';
import { formatters } from '@/lib/utils';
import { Button } from '@workspace/ui/components/button';
import { Input } from '@workspace/ui/components/input';
import { Download } from 'lucide-react';
import { type Table } from '@tanstack/react-table';
import { useState } from 'react';
import { useDebouncedCallback } from 'use-debounce';

import { DataTableFilter } from './DataTableFilter';
import { ViewOptions } from './DataTableViewOptions';

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
}

export function Filterbar<TData>({ table }: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;
  const [searchTerm, setSearchTerm] = useState<string>('');

  const debouncedSetFilterValue = useDebouncedCallback((value: string) => {
    table.getColumn('owner')?.setFilterValue(value);
  }, 300);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setSearchTerm(value);
    debouncedSetFilterValue(value);
  };

  return (
    <div className='flex flex-wrap items-center justify-between gap-3 sm:gap-x-6'>
      <div className='flex w-full flex-col gap-3 sm:w-fit sm:flex-row sm:items-center'>
        {table.getColumn('status')?.getIsVisible() && (
          <DataTableFilter column={table.getColumn('status')} title='Status' options={statuses} type='select' />
        )}
        {table.getColumn('region')?.getIsVisible() && (
          <DataTableFilter column={table.getColumn('region')} title='Region' options={regions} type='checkbox' />
        )}
        {table.getColumn('costs')?.getIsVisible() && (
          <DataTableFilter
            column={table.getColumn('costs')}
            title='Costs'
            type='number'
            options={conditions}
            formatter={(v) => formatters.currency!(Number(v))}
          />
        )}
        {table.getColumn('owner')?.getIsVisible() && (
          <Input
            type='search'
            placeholder='Search by owner...'
            value={searchTerm}
            onChange={handleSearchChange}
            className='h-9 w-full sm:max-w-[260px]'
          />
        )}
        {isFiltered && (
          <Button
            variant='ghost'
            onClick={() => {
              debouncedSetFilterValue.cancel();
              setSearchTerm('');
              table.getColumn('owner')?.setFilterValue('');
              table.resetColumnFilters();
            }}
            className='h-9 justify-start rounded-3xl border border-border px-3 font-semibold text-muted-foreground hover:text-primary sm:border-none'
          >
            Clear filters
          </Button>
        )}
      </div>
      <div className='flex items-center gap-2'>
        <Button variant='secondary' size='sm' className='hidden gap-x-2 lg:inline-flex'>
          <Download className='size-4 shrink-0' aria-hidden='true' />
          Export
        </Button>
        <ViewOptions table={table} />
      </div>
    </div>
  );
}
