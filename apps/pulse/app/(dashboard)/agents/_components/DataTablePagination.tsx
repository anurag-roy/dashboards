'use client';

import { type Table } from '@tanstack/react-table';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { Button } from '@workspace/ui/components/button';

import { cn } from '@/lib/utils';

interface DataTablePaginationProps<TData> {
  table: Table<TData>;
  pageSize: number;
}

export function DataTablePagination<TData>({ table, pageSize }: DataTablePaginationProps<TData>) {
  const totalRows = table.getFilteredRowModel().rows.length;
  const currentPageIndex = table.getState().pagination.pageIndex;
  const pageCount = table.getPageCount();
  const safePageCount = pageCount < 1 ? 1 : pageCount;
  const displayPage = Math.min(currentPageIndex + 1, safePageCount);
  const firstRowIndex = totalRows === 0 ? 0 : currentPageIndex * pageSize + 1;
  const lastRowIndex = Math.min(totalRows, firstRowIndex + pageSize - 1);

  const paginationButtons = [
    {
      icon: ChevronsLeft,
      onClick: () => table.setPageIndex(0),
      disabled: !table.getCanPreviousPage(),
      srText: 'First page',
      mobileView: 'hidden sm:inline-flex',
    },
    {
      icon: ChevronLeft,
      onClick: () => table.previousPage(),
      disabled: !table.getCanPreviousPage(),
      srText: 'Previous page',
      mobileView: '',
    },
    {
      icon: ChevronRight,
      onClick: () => table.nextPage(),
      disabled: !table.getCanNextPage(),
      srText: 'Next page',
      mobileView: '',
    },
    {
      icon: ChevronsRight,
      onClick: () => table.setPageIndex(Math.max(0, table.getPageCount() - 1)),
      disabled: !table.getCanNextPage(),
      srText: 'Last page',
      mobileView: 'hidden sm:inline-flex',
    },
  ];

  return (
    <div className='flex flex-wrap items-center justify-between gap-3'>
      <div className='flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground tabular-nums'>
        <p>
          Page <span className='font-medium text-foreground'>{totalRows === 0 ? 0 : displayPage}</span> of{' '}
          <span className='font-medium text-foreground'>{totalRows === 0 ? 0 : safePageCount}</span>
        </p>
        <span className='hidden text-border sm:inline' aria-hidden='true'>
          ·
        </span>
        <p>
          <span className='font-medium text-foreground'>{pageSize}</span> per page
        </p>
        <span className='hidden text-border sm:inline' aria-hidden='true'>
          ·
        </span>
        <p className='hidden sm:block'>
          Showing{' '}
          <span className='font-medium text-foreground'>
            {firstRowIndex}-{lastRowIndex}
          </span>{' '}
          of <span className='font-medium text-foreground'>{totalRows}</span>
        </p>
      </div>
      <div className='flex items-center gap-1.5'>
        {paginationButtons.map((button) => (
          <Button
            key={button.srText}
            type='button'
            variant='secondary'
            size='icon-sm'
            className={cn(button.mobileView)}
            onClick={() => {
              button.onClick();
              table.resetRowSelection();
            }}
            disabled={button.disabled}
          >
            <span className='sr-only'>{button.srText}</span>
            <button.icon className='size-4 shrink-0' aria-hidden='true' />
          </Button>
        ))}
      </div>
    </div>
  );
}
