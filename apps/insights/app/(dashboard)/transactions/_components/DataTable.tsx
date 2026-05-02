'use client';

import { useMemo, useState } from 'react';
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  type ColumnFiltersState,
  type Row,
  type SortingState,
  type VisibilityState,
  useReactTable,
} from '@tanstack/react-table';
import { Input } from '@workspace/ui/components/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@workspace/ui/components/table';

import { type Transaction } from '@/lib/data/schema';
import { cn } from '@/lib/utils';
import { getColumns } from './Columns';
import { DataTablePagination } from './DataTablePagination';
import { MobileTransactionList } from './MobileTransactionList';
import { TableBulkEditor } from './TableBulkEditor';

type DataTableProps = {
  data: Transaction[];
  pageSize?: number;
  onEditClick: (row: Row<Transaction>) => void;
};

export function DataTable({ data, pageSize = 12, onEditClick }: DataTableProps) {
  const [sorting, setSorting] = useState<SortingState>([
    {
      id: 'transaction_date',
      desc: true,
    },
  ]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});

  const columns = useMemo(() => getColumns({ onEditClick }), [onEditClick]);

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
    enableRowSelection: true,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    initialState: {
      pagination: {
        pageSize,
      },
    },
  });

  return (
    <>
      <div className='flex w-full flex-col gap-3 sm:w-fit sm:flex-row sm:items-center'>
        <Input
          placeholder='Search by merchant...'
          value={(table.getColumn('merchant')?.getFilterValue() as string) ?? ''}
          onChange={(event) => table.getColumn('merchant')?.setFilterValue(event.target.value)}
          className='h-9 w-full sm:max-w-[260px]'
        />
      </div>

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
              {table.getRowModel().rows.length > 0 ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() ? 'selected' : undefined}
                    className='group select-none'
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
                  <TableCell colSpan={columns.length} className='h-24 text-center text-muted-foreground'>
                    No transactions found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
          <TableBulkEditor table={table} rowSelection={rowSelection} />
        </div>

        <div className='mt-3'>
          <DataTablePagination table={table} pageSize={pageSize} />
        </div>
      </div>

      <MobileTransactionList table={table} onEditClick={onEditClick} />
    </>
  );
}
