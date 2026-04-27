import { type Column } from '@tanstack/react-table';
import { ArrowDownNarrowWide, ArrowDownWideNarrow, ChevronsUpDown } from 'lucide-react';

import { cn } from '@/lib/utils';

interface DataTableColumnHeaderProps<TData, TValue> extends React.HTMLAttributes<HTMLDivElement> {
  column: Column<TData, TValue>;
  title: string;
}

export function DataTableColumnHeader<TData, TValue>({
  column,
  title,
  className,
}: DataTableColumnHeaderProps<TData, TValue>) {
  const sortState = column.getIsSorted();

  if (!column.getCanSort()) {
    return <div className={cn(className)}>{title}</div>;
  }

  return (
    <div
      role='button'
      tabIndex={0}
      onClick={column.getToggleSortingHandler()}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          column.getToggleSortingHandler()?.(event);
        }
      }}
      className={cn(
        '-mx-2 inline-flex cursor-pointer items-center gap-2 rounded-2xl px-2.5 py-1.5 select-none hover:bg-muted',
        sortState && 'text-primary',
        className
      )}
    >
      <span>{title}</span>
      {sortState === 'asc' ? (
        <ArrowDownNarrowWide className='size-3.5 text-primary' aria-hidden='true' />
      ) : sortState === 'desc' ? (
        <ArrowDownWideNarrow className='size-3.5 text-primary' aria-hidden='true' />
      ) : (
        <ChevronsUpDown className='size-3.5 text-muted-foreground' aria-hidden='true' />
      )}
    </div>
  );
}
