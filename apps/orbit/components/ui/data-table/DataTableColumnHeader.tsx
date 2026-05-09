'use client';

import { type Column } from '@tanstack/react-table';
import { ChevronDown, ChevronUp, ChevronsUpDown } from 'lucide-react';
import { Button } from '@workspace/ui/components/button';

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
    <div className={cn(className)}>
      <Button
        type='button'
        variant='ghost'
        size='sm'
        className='-ml-2 h-8 gap-1.5 px-2 font-medium text-foreground hover:bg-muted'
        onClick={column.getToggleSortingHandler()}
      >
        <span>{title}</span>
        {sortState === 'asc' ? (
          <ChevronUp className='size-3.5 shrink-0 text-foreground' aria-hidden='true' />
        ) : sortState === 'desc' ? (
          <ChevronDown className='size-3.5 shrink-0 text-foreground' aria-hidden='true' />
        ) : (
          <ChevronsUpDown className='size-3.5 shrink-0 text-muted-foreground' aria-hidden='true' />
        )}
      </Button>
    </div>
  );
}
