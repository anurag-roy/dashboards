import { cn } from '@/lib/utils';
import { Button } from '@workspace/ui/components/button';
import { ChevronFirst, ChevronLast, ChevronLeft, ChevronRight } from 'lucide-react';
import { type Table } from '@tanstack/react-table';

interface DataTablePaginationProps<TData> {
  table: Table<TData>;
  pageSize: number;
}

export function DataTablePagination<TData>({ table, pageSize }: DataTablePaginationProps<TData>) {
  const paginationButtons = [
    {
      icon: ChevronFirst,
      onClick: () => table.setPageIndex(0),
      disabled: !table.getCanPreviousPage(),
      srText: 'First page',
      mobileView: 'hidden sm:block',
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
      icon: ChevronLast,
      onClick: () => table.setPageIndex(table.getPageCount() - 1),
      disabled: !table.getCanNextPage(),
      srText: 'Last page',
      mobileView: 'hidden sm:block',
    },
  ];

  const totalRows = table.getFilteredRowModel().rows.length;
  const currentPage = table.getState().pagination.pageIndex;
  const firstRowIndex = currentPage * pageSize + 1;
  const lastRowIndex = Math.min(totalRows, firstRowIndex + pageSize - 1);

  return (
    <div className='flex items-center justify-between'>
      <div className='text-sm text-muted-foreground tabular-nums'>
        {table.getFilteredSelectedRowModel().rows.length} of {totalRows} row(s) selected.
      </div>
      <div className='flex items-center gap-x-6 lg:gap-x-8'>
        <p className='hidden text-sm text-muted-foreground tabular-nums sm:block'>
          Showing{' '}
          <span className='font-medium text-foreground'>
            {firstRowIndex}-{lastRowIndex}
          </span>{' '}
          of <span className='font-medium text-foreground'>{totalRows}</span>
        </p>
        <div className='flex items-center gap-x-1.5'>
          {paginationButtons.map((button) => (
            <Button
              key={button.srText}
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
    </div>
  );
}
