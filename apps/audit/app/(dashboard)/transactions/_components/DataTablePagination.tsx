import { type Table } from '@tanstack/react-table';
import { ChevronFirst, ChevronLast, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@workspace/ui/components/button';

interface DataTablePaginationProps<TData> {
  table: Table<TData>;
  pageSize: number;
}

export function DataTablePagination<TData>({ table, pageSize }: DataTablePaginationProps<TData>) {
  const totalRows = table.getFilteredRowModel().rows.length;
  const currentPage = table.getState().pagination.pageIndex;
  const pageCount = table.getPageCount();
  const firstRowIndex = totalRows === 0 ? 0 : currentPage * pageSize + 1;
  const lastRowIndex = Math.min(totalRows, firstRowIndex + pageSize - 1);

  const paginationButtons = [
    {
      icon: ChevronFirst,
      onClick: () => table.setPageIndex(0),
      disabled: !table.getCanPreviousPage(),
      srText: 'First page',
    },
    {
      icon: ChevronLeft,
      onClick: () => table.previousPage(),
      disabled: !table.getCanPreviousPage(),
      srText: 'Previous page',
    },
    {
      icon: ChevronRight,
      onClick: () => table.nextPage(),
      disabled: !table.getCanNextPage(),
      srText: 'Next page',
    },
    {
      icon: ChevronLast,
      onClick: () => table.setPageIndex(table.getPageCount() - 1),
      disabled: !table.getCanNextPage(),
      srText: 'Last page',
    },
  ];

  return (
    <>
      <div className='hidden items-center justify-between gap-4 sm:flex'>
        <p className='text-sm text-muted-foreground tabular-nums'>
          {table.getFilteredSelectedRowModel().rows.length} of {totalRows} selected
        </p>
        <div className='flex items-center gap-4'>
          <p className='text-sm text-muted-foreground tabular-nums'>
            Showing{' '}
            <span className='font-medium text-foreground'>
              {firstRowIndex}-{lastRowIndex}
            </span>{' '}
            of <span className='font-medium text-foreground'>{totalRows}</span>
          </p>
          <div className='flex items-center gap-1.5'>
            {paginationButtons.map((button) => (
              <Button
                key={button.srText}
                variant='secondary'
                size='icon-sm'
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

      {pageCount > 1 && (
        <div className='fixed inset-x-0 bottom-0 z-40 border-t border-border/70 bg-background/95 px-4 py-3 backdrop-blur supports-[backdrop-filter]:bg-background/85 sm:hidden'>
          <div className='flex items-center justify-between gap-3'>
            <p className='text-sm text-muted-foreground tabular-nums'>
              Showing{' '}
              <span className='font-medium text-foreground'>
                {firstRowIndex}-{lastRowIndex}
              </span>{' '}
              of <span className='font-medium text-foreground'>{totalRows}</span>
            </p>
            <div className='flex items-center gap-1'>
              {paginationButtons.map((button) => (
                <Button
                  key={`mobile-${button.srText}`}
                  variant='secondary'
                  size='icon-sm'
                  className='shrink-0'
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
      )}
    </>
  );
}
