import type { Table } from '@tanstack/react-table';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { Button } from '@workspace/ui/components/button';

type DataTablePaginationProps<TData> = {
  table: Table<TData>;
  pageSize: number;
};

export function DataTablePagination<TData>({ table, pageSize }: DataTablePaginationProps<TData>) {
  const totalRows = table.getFilteredRowModel().rows.length;
  const currentPage = table.getState().pagination.pageIndex;
  const pageCount = table.getPageCount();
  const from = currentPage * pageSize + 1;
  const to = Math.min((currentPage + 1) * pageSize, totalRows);

  return (
    <div className='flex items-center justify-between'>
      <p className='text-sm text-muted-foreground tabular-nums'>
        {from}-{to} of {totalRows}
      </p>
      <div className='flex items-center gap-1'>
        <Button
          variant='ghost'
          size='icon'
          className='size-8'
          onClick={() => table.setPageIndex(0)}
          disabled={!table.getCanPreviousPage()}
        >
          <ChevronsLeft className='size-4' />
          <span className='sr-only'>First page</span>
        </Button>
        <Button
          variant='ghost'
          size='icon'
          className='size-8'
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          <ChevronLeft className='size-4' />
          <span className='sr-only'>Previous page</span>
        </Button>
        <Button
          variant='ghost'
          size='icon'
          className='size-8'
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          <ChevronRight className='size-4' />
          <span className='sr-only'>Next page</span>
        </Button>
        <Button
          variant='ghost'
          size='icon'
          className='size-8'
          onClick={() => table.setPageIndex(pageCount - 1)}
          disabled={!table.getCanNextPage()}
        >
          <ChevronsRight className='size-4' />
          <span className='sr-only'>Last page</span>
        </Button>
      </div>
    </div>
  );
}
