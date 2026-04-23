'use client';

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

export function DataTableRowActions<TData>(_props: DataTableRowActionsProps<TData>) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            variant='ghost'
            className='group aspect-square p-1.5 hover:border hover:border-border hover:bg-muted data-open:border-border data-open:bg-muted'
          >
            <MoreHorizontal
              className='size-4 shrink-0 text-muted-foreground group-hover:text-foreground'
              aria-hidden='true'
            />
          </Button>
        }
      />
      <DropdownMenuContent align='end' className='min-w-40'>
        <DropdownMenuItem>Add</DropdownMenuItem>
        <DropdownMenuItem>Edit</DropdownMenuItem>
        <DropdownMenuItem variant='destructive'>Delete</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
