import { type Table } from '@tanstack/react-table';
import { ChevronLeft, ChevronRight } from 'lucide-react';

import { Button } from '@workspace/ui/components/button';

type DataTablePaginationProps<TData> = {
  table: Table<TData>;
};

export function DataTablePagination<TData>({ table }: DataTablePaginationProps<TData>) {
  const pageIndex = table.getState().pagination.pageIndex;
  const pageCount = table.getPageCount();
  const current = pageIndex + 1;

  return (
    <div className='flex items-center justify-between gap-4 pt-1'>
      <p className='text-sm text-muted-foreground tabular-nums'>
        Page <span className='font-medium text-foreground'>{current}</span> of{' '}
        <span className='font-medium text-foreground'>{Math.max(pageCount, 1)}</span>
      </p>
      <div className='flex items-center gap-1.5'>
        <Button
          type='button'
          variant='secondary'
          size='icon-sm'
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
          aria-label='Previous page'
        >
          <ChevronLeft className='size-4 shrink-0' aria-hidden />
        </Button>
        <Button
          type='button'
          variant='secondary'
          size='icon-sm'
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
          aria-label='Next page'
        >
          <ChevronRight className='size-4 shrink-0' aria-hidden />
        </Button>
      </div>
    </div>
  );
}
