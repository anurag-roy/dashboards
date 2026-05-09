'use client';

import { useMemo, useState } from 'react';
import { RankingInfo, rankItem } from '@tanstack/match-sorter-utils';
import {
  type ColumnFiltersState,
  type FilterFn,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  type SortingState,
  useReactTable,
} from '@tanstack/react-table';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@workspace/ui/components/table';

import { type Agent } from '@/lib/data/agents/schema';
import { cn } from '@/lib/utils';

import { agentColumns } from './columns';
import { DataTableFilterbar } from './DataTableFilterbar';
import { DataTablePagination } from './DataTablePagination';
import { MobileAgentList } from './MobileAgentList';

const fuzzyFilter: FilterFn<Agent> = (row, _columnId, filterValue, addMeta) => {
  if (filterValue === undefined || filterValue === null || String(filterValue).trim() === '') {
    return true;
  }

  const o = row.original;
  const haystack = [
    o.full_name,
    o.agent_id,
    o.account,
    o.email,
    o.number,
    o.region,
    o.status,
    String(o.minutes_called),
    String(o.minutes_booked),
    String(o.ticket_count),
    String(o.stability),
    String(o.rating),
  ]
    .filter(Boolean)
    .join(' ');

  const itemRank = rankItem(haystack, filterValue as string);
  if (addMeta) {
    addMeta({ itemRank } as { itemRank: RankingInfo });
  }

  return itemRank.passed;
};

type DataTableProps = {
  data: Agent[];
};

const PAGE_SIZE = 20;

export function DataTable({ data }: DataTableProps) {
  const columns = useMemo(() => agentColumns, []);
  const [globalFilter, setGlobalFilter] = useState('');
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [sorting, setSorting] = useState<SortingState>([]);

  const registeredFilterValue = columnFilters.find((f) => f.id === 'registered')?.value;

  const table = useReactTable({
    data,
    columns,
    enableColumnResizing: false,
    state: {
      globalFilter,
      columnFilters,
      sorting,
    },
    onGlobalFilterChange: setGlobalFilter,
    onColumnFiltersChange: setColumnFilters,
    onSortingChange: setSorting,
    globalFilterFn: fuzzyFilter,
    initialState: {
      pagination: {
        pageIndex: 0,
        pageSize: PAGE_SIZE,
      },
    },
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <div className='space-y-6'>
      <DataTableFilterbar
        globalFilter={globalFilter}
        setGlobalFilter={setGlobalFilter}
        registeredOnly={Boolean(registeredFilterValue)}
        setRegisteredOnly={(checked) => {
          table.getColumn('registered')?.setFilterValue(checked ? true : undefined);
        }}
      />

      {/* Desktop table */}
      <div className='hidden md:block'>
        <div className='relative overflow-hidden overflow-x-auto rounded-3xl border border-border shadow-sm'>
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id} className='hover:bg-transparent'>
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
              {table.getRowModel().rows.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id} className='group border-border select-none'>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell
                        key={cell.id}
                        className={cn(
                          'whitespace-nowrap text-muted-foreground',
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
                  <TableCell colSpan={columns.length} className='h-24 text-center text-muted-foreground'>
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        <div className='mt-6'>
          <DataTablePagination table={table} pageSize={PAGE_SIZE} />
        </div>
      </div>

      {/* Mobile card list */}
      <MobileAgentList table={table} />
    </div>
  );
}
