'use client';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@workspace/ui/components/table';
import { cn } from '@/lib/utils';
import * as React from 'react';

import { DataTableBulkEditor } from './DataTableBulkEditor';
import { Filterbar } from './DataTableFilterbar';
import { DataTablePagination } from './DataTablePagination';
import { MobileUsageList } from './MobileUsageList';

import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';

interface DataTableProps<TData> {
  columns: ColumnDef<TData>[];
  data: TData[];
}

export function DataTable<TData>({ columns, data }: DataTableProps<TData>) {
  const pageSize = 20;
  const [rowSelection, setRowSelection] = React.useState({});

  const handleRowClick = (event: React.MouseEvent<HTMLTableRowElement>, toggleSelected: () => void) => {
    const target = event.target;

    if (target instanceof HTMLElement && target.closest('[data-row-action]')) {
      return;
    }

    toggleSelected();
  };

  const table = useReactTable({
    data,
    columns,
    state: {
      rowSelection,
    },
    initialState: {
      pagination: {
        pageIndex: 0,
        pageSize,
      },
    },
    enableRowSelection: true,
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <div className='space-y-3'>
      <Filterbar table={table} />
      {/* Desktop table */}
      <div className='hidden md:block'>
        <div className='relative overflow-hidden overflow-x-auto rounded-3xl border border-border shadow-sm'>
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id} className='border-b border-border hover:bg-transparent'>
                  {headerGroup.headers.map((header) => (
                    <TableHead
                      key={header.id}
                      className={cn(
                        'whitespace-nowrap text-muted-foreground',
                        (header.column.columnDef.meta as { className?: string } | undefined)?.className
                      )}
                    >
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() ? 'selected' : undefined}
                    onClick={(event) => handleRowClick(event, () => row.toggleSelected(!row.getIsSelected()))}
                    className='group cursor-pointer select-none'
                  >
                    {row.getVisibleCells().map((cell, index) => (
                      <TableCell
                        key={cell.id}
                        className={cn(
                          'relative whitespace-nowrap text-muted-foreground first:w-10',
                          (cell.column.columnDef.meta as { className?: string } | undefined)?.className
                        )}
                      >
                        {index === 0 && row.getIsSelected() && (
                          <div className='absolute inset-y-0 left-0 w-0.5 bg-primary' />
                        )}
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length} className='h-24 text-center'>
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
          <DataTableBulkEditor table={table} rowSelection={rowSelection} />
        </div>
        <div className='mt-3'>
          <DataTablePagination table={table} pageSize={pageSize} />
        </div>
      </div>

      {/* Mobile card list */}
      <MobileUsageList table={table} />
    </div>
  );
}
