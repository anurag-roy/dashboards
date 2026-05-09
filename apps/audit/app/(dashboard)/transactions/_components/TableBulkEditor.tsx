'use client';

import { type RowSelectionState, type Table } from '@tanstack/react-table';
import { Button } from '@workspace/ui/components/button';

type DataTableBulkEditorProps<TData> = {
  table: Table<TData>;
  rowSelection: RowSelectionState;
};

export function TableBulkEditor<TData>({ table, rowSelection }: DataTableBulkEditorProps<TData>) {
  const selectedCount = Object.keys(rowSelection).length;
  if (selectedCount === 0) {
    return null;
  }

  return (
    <div className='pointer-events-none fixed inset-x-0 bottom-6 z-50 flex justify-center px-4'>
      <div className='pointer-events-auto flex items-center gap-2 rounded-3xl border border-border bg-card px-2 py-2 shadow-lg ring-1 ring-foreground/5 dark:ring-foreground/10'>
        <span className='px-2 text-sm text-foreground tabular-nums'>{selectedCount} selected</span>
        <Button variant='ghost' size='sm'>
          Edit
        </Button>
        <Button variant='ghost' size='sm'>
          Delete
        </Button>
        <Button
          variant='secondary'
          size='sm'
          onClick={() => {
            table.resetRowSelection();
          }}
        >
          Reset
        </Button>
      </div>
    </div>
  );
}
