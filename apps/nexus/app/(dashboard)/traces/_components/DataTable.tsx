'use client';

import * as React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@workspace/ui/components/table';
import { cn } from '@workspace/ui/lib/utils';
import {
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';

import type { Trace } from '@/lib/data/traces';
import { DataTablePagination } from './DataTablePagination';
import { MobileTraceList } from './MobileTraceList';

type DataTableProps = {
  columns: ColumnDef<Trace>[];
  data: Trace[];
  onRowClick: (trace: Trace) => void;
};

export function DataTable({ columns, data, onRowClick }: DataTableProps) {
  const pageSize = 20;
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);

  const table = useReactTable({
    data,
    columns,
    state: { sorting, columnFilters },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    initialState: {
      pagination: { pageIndex: 0, pageSize },
    },
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    meta: {
      onRowClick,
    },
  });

  return (
    <div className='space-y-3'>
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
                  <TableRow key={row.id} className='transition-colors hover:bg-muted/50'>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell
                        key={cell.id}
                        className={cn(
                          'whitespace-nowrap',
                          (cell.column.columnDef.meta as { className?: string } | undefined)?.className
                        )}
                      >
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
        </div>
        <div className='mt-3'>
          <DataTablePagination table={table} pageSize={pageSize} />
        </div>
      </div>

      {/* Mobile card list */}
      <MobileTraceList table={table} onRowClick={onRowClick} />
    </div>
  );
}
