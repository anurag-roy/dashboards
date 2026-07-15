'use client';

import { InsightBadge } from '@workspace/ui/components/insight-badge';
import { Checkbox } from '@workspace/ui/components/checkbox';
import { statuses } from '@/lib/data/data';
import type { Usage } from '@/lib/data/schema';
import { cn, formatters } from '@/lib/utils';
import { createColumnHelper, type ColumnDef } from '@tanstack/react-table';

import { DataTableColumnHeader } from './DataTableColumnHeader';
import { type ConditionFilter } from './DataTableFilter';
import { DataTableRowActions } from './DataTableRowActions';

type StatusVariant = 'default' | 'neutral' | 'success' | 'error' | 'warning';

const columnHelper = createColumnHelper<Usage>();

export const columns = [
  columnHelper.display({
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        indeterminate={!table.getIsAllPageRowsSelected() && table.getIsSomeRowsSelected()}
        onCheckedChange={(checked) => table.toggleAllPageRowsSelected(checked)}
        className='translate-y-0.5'
        aria-label='Select all'
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(checked) => row.toggleSelected(checked)}
        className='translate-y-0.5'
        aria-label='Select row'
      />
    ),
    enableSorting: false,
    enableHiding: false,
    meta: {
      displayName: 'Select',
    },
  }),
  columnHelper.accessor('owner', {
    header: ({ column }) => <DataTableColumnHeader column={column} title='Owner' />,
    enableSorting: true,
    enableHiding: false,
    meta: {
      className: 'text-left',
      displayName: 'Owner',
    },
  }),
  columnHelper.accessor('status', {
    header: ({ column }) => <DataTableColumnHeader column={column} title='Status' />,
    enableSorting: true,
    meta: {
      className: 'text-left',
      displayName: 'Status',
    },
    cell: ({ row }) => {
      const status = statuses.find((item) => item.value === row.getValue('status'));
      if (!status) {
        return null;
      }
      return <InsightBadge variant={status.variant as StatusVariant}>{status.label}</InsightBadge>;
    },
  }),
  columnHelper.accessor('region', {
    header: ({ column }) => <DataTableColumnHeader column={column} title='Region' />,
    enableSorting: false,
    meta: {
      className: 'text-left',
      displayName: 'Region',
    },
    filterFn: 'arrIncludesSome',
  }),
  columnHelper.accessor('stability', {
    header: ({ column }) => <DataTableColumnHeader column={column} title='Stability' />,
    enableSorting: false,
    meta: {
      className: 'text-left',
      displayName: 'Stability',
    },
    cell: ({ getValue }) => {
      const value = getValue();
      function Indicator({ number }: { number: number }) {
        let category: 'zero' | 'bad' | 'ok' | 'good';
        if (number === 0) {
          category = 'zero';
        } else if (number < 9) {
          category = 'bad';
        } else if (number >= 9 && number <= 15) {
          category = 'ok';
        } else {
          category = 'good';
        }
        const getBarClass = (index: number) => {
          if (category === 'zero') {
            return 'bg-muted';
          }
          if (category === 'good') {
            return 'bg-primary';
          }
          if (category === 'ok' && index < 2) {
            return 'bg-primary';
          }
          if (category === 'bad' && index < 1) {
            return 'bg-primary';
          }
          return 'bg-muted';
        };
        return (
          <div className='flex gap-0.5'>
            <div className={cn('h-3.5 w-1 rounded-sm', getBarClass(0))} />
            <div className={cn('h-3.5 w-1 rounded-sm', getBarClass(1))} />
            <div className={cn('h-3.5 w-1 rounded-sm', getBarClass(2))} />
          </div>
        );
      }
      return (
        <div className='flex items-center gap-0.5'>
          <span className='w-6'>{value}</span>
          <Indicator number={value} />
        </div>
      );
    },
  }),
  columnHelper.accessor('costs', {
    header: ({ column }) => <DataTableColumnHeader column={column} title='Costs' />,
    enableSorting: true,
    meta: {
      className: 'text-right',
      displayName: 'Costs',
    },
    cell: ({ getValue }) => <span className='font-medium'>{formatters.currency!(Number(getValue() ?? 0))}</span>,
    filterFn: (row, columnId, filterValue: ConditionFilter) => {
      const v = row.getValue(columnId) as number;
      const [min, max] = filterValue.value as [number, number];
      switch (filterValue.condition) {
        case 'is-equal-to':
          return v == min;
        case 'is-between':
          return v >= min && v <= max;
        case 'is-greater-than':
          return v > min;
        case 'is-less-than':
          return v < min;
        default:
          return true;
      }
    },
  }),
  columnHelper.accessor('lastEdited', {
    header: ({ column }) => <DataTableColumnHeader column={column} title='Last edited' />,
    enableSorting: false,
    meta: {
      className: 'tabular-nums',
      displayName: 'Last edited',
    },
  }),
  columnHelper.display({
    id: 'edit',
    header: 'Edit',
    enableSorting: false,
    enableHiding: false,
    meta: {
      className: 'text-right',
      displayName: 'Edit',
    },
    cell: ({ row }) => <DataTableRowActions row={row} />,
  }),
] as ColumnDef<Usage>[];
