'use client';

import { createColumnHelper, type ColumnDef, type Row } from '@tanstack/react-table';
import { MoreHorizontal } from 'lucide-react';
import { Button } from '@workspace/ui/components/button';
import { Checkbox } from '@workspace/ui/components/checkbox';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@workspace/ui/components/dropdown-menu';
import { InsightBadge } from '@workspace/ui/components/insight-badge';

import { expenseStatuses, type Transaction } from '@/lib/data/schema';
import { formatters } from '@/lib/utils';
import { DataTableColumnHeader } from './DataTableColumnHeader';

const columnHelper = createColumnHelper<Transaction>();

export const getColumns = ({ onEditClick }: { onEditClick: (row: Row<Transaction>) => void }) =>
  [
    columnHelper.display({
      id: 'select',
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected()}
          indeterminate={!table.getIsAllPageRowsSelected() && table.getIsSomeRowsSelected()}
          onCheckedChange={() => table.toggleAllPageRowsSelected()}
          aria-label='Select all'
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onClick={(event) => event.stopPropagation()}
          onCheckedChange={() => row.toggleSelected()}
          aria-label='Select row'
        />
      ),
      enableSorting: false,
      enableHiding: false,
      meta: {
        displayName: 'Select',
      },
    }),
    columnHelper.accessor('transaction_date', {
      header: ({ column }) => <DataTableColumnHeader column={column} title='Purchased on' />,
      cell: ({ getValue }) => formatters.dateTime(getValue()),
      enableSorting: true,
      enableHiding: false,
      meta: {
        className: 'tabular-nums',
        displayName: 'Purchased on',
      },
    }),
    columnHelper.accessor('expense_status', {
      header: ({ column }) => <DataTableColumnHeader column={column} title='Status' />,
      enableSorting: true,
      meta: {
        className: 'text-left',
        displayName: 'Status',
      },
      cell: ({ row }) => {
        const value = row.getValue('expense_status');
        const status = expenseStatuses.find((item) => item.value === value);
        if (!status) {
          return value;
        }
        return <InsightBadge variant={status.variant}>{status.label}</InsightBadge>;
      },
    }),
    columnHelper.accessor('merchant', {
      header: ({ column }) => <DataTableColumnHeader column={column} title='Merchant' />,
      enableSorting: false,
      meta: {
        className: 'text-left',
        displayName: 'Merchant',
      },
    }),
    columnHelper.accessor('category', {
      header: ({ column }) => <DataTableColumnHeader column={column} title='Category' />,
      enableSorting: false,
      meta: {
        className: 'text-left',
        displayName: 'Category',
      },
    }),
    columnHelper.accessor('amount', {
      header: ({ column }) => <DataTableColumnHeader column={column} title='Amount' />,
      enableSorting: true,
      meta: {
        className: 'text-right',
        displayName: 'Amount',
      },
      cell: ({ getValue }) => <span className='font-medium'>{formatters.currency(getValue())}</span>,
    }),
    columnHelper.display({
      id: 'actions',
      header: () => <span className='sr-only'>Actions</span>,
      enableSorting: false,
      enableHiding: false,
      meta: {
        className: 'text-right',
        displayName: 'Actions',
      },
      cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button
                type='button'
                variant='ghost'
                size='icon-sm'
                className='rounded-2xl text-muted-foreground hover:bg-muted hover:text-foreground data-open:bg-muted data-open:text-foreground'
                aria-label='Open transaction actions'
                onClick={(e: React.MouseEvent) => e.stopPropagation()}
              />
            }
          >
            <MoreHorizontal className='size-4' aria-hidden='true' />
          </DropdownMenuTrigger>
          <DropdownMenuContent align='end' className='min-w-40'>
            <DropdownMenuItem onClick={() => onEditClick(row)}>Edit</DropdownMenuItem>
            <DropdownMenuItem variant='destructive'>Delete</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    }),
  ] as ColumnDef<Transaction>[];
