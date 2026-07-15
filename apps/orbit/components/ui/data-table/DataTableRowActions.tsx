'use client';

import * as React from 'react';
import { Button } from '@workspace/ui/components/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@workspace/ui/components/dropdown-menu';
import { type Row } from '@tanstack/react-table';
import { MoreHorizontal } from 'lucide-react';

interface DataTableRowActionsProps<TData> {
  row: Row<TData>;
}

export function DataTableRowActions<TData>({ row }: DataTableRowActionsProps<TData>) {
  const stopRowSelection = (event: React.SyntheticEvent) => {
    event.stopPropagation();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            data-row-action
            variant='ghost'
            className='group aspect-square p-1.5 hover:border hover:border-border hover:bg-muted data-open:border-border data-open:bg-muted'
            aria-label={`Open row ${row.index + 1} actions`}
            onClick={stopRowSelection}
            onPointerDown={stopRowSelection}
          >
            <MoreHorizontal
              className='size-4 shrink-0 text-muted-foreground group-hover:text-foreground'
              aria-hidden='true'
            />
          </Button>
        }
      />
      <DropdownMenuContent
        data-row-action
        align='end'
        className='min-w-40'
        onClick={stopRowSelection}
        onPointerDown={stopRowSelection}
      >
        <DropdownMenuItem onClick={stopRowSelection}>Edit</DropdownMenuItem>
        <DropdownMenuItem variant='destructive' onClick={stopRowSelection}>
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
