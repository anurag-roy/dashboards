'use client';

import { ShieldCheck } from 'lucide-react';
import { Badge } from '@workspace/ui/components/badge';
import { ProgressCircle } from '@workspace/ui/components/progress-circle';
import { ColumnDef, createColumnHelper, FilterFn } from '@tanstack/react-table';

import { type Agent, accounts } from '@/lib/data/agents/schema';
import { cn, valueFormatter } from '@/lib/utils';

import { ButtonTicketGeneration } from './ButtonTicketGeneration';
import { DataTableColumnHeader } from './DataTableColumnHeader';

const registeredOnlyFilter: FilterFn<Agent> = (row, columnId, filterValue) => {
  if (filterValue !== true) return true;
  return row.getValue(columnId) === true;
};

const columnHelper = createColumnHelper<Agent>();

function minutesProgressVariant(valuePct: number): 'error' | 'warning' | 'default' {
  if (valuePct >= 85) return 'error';
  if (valuePct > 60) return 'warning';
  return 'default';
}

function formatPhone(phone: string) {
  return phone.replace(/(\+41)(\d{2})(\d{3})(\d{2})(\d{2})/, '$1 $2 $3 $4 $5');
}

function getAccountLabel(value: string) {
  return accounts.find((a) => a.value === value)?.label ?? value;
}

export const agentColumns: ColumnDef<Agent>[] = [
  columnHelper.accessor('registered', {
    enableColumnFilter: true,
    enableSorting: true,
    enableHiding: true,
    filterFn: registeredOnlyFilter,
    meta: {
      displayName: 'Registered',
      className: 'hidden',
    },
  }),
  columnHelper.accessor('full_name', {
    id: 'full_name',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Agent' />,
    enableSorting: true,
    meta: {
      className: 'text-left',
      displayName: 'Agent',
    },
    cell: ({ row }) => (
      <div className='flex flex-col gap-1'>
        <span className='font-medium text-foreground'>{row.original.full_name}</span>
        <div className='flex items-center gap-1 text-xs'>
          <span className='text-muted-foreground'>AgID</span>
          <span className='font-mono font-medium uppercase tabular-nums text-foreground'>
            {row.original.agent_id}
          </span>
          <ShieldCheck
            className={cn(
              'size-3 shrink-0',
              row.original.registered ? 'text-emerald-600 dark:text-emerald-500' : 'text-muted-foreground/40'
            )}
            aria-hidden='true'
          />
        </div>
      </div>
    ),
  }),
  columnHelper.accessor('number', {
    header: ({ column }) => <DataTableColumnHeader column={column} title='Contact Information' />,
    enableSorting: false,
    meta: {
      className: 'text-left',
      displayName: 'Contact Information',
    },
    cell: ({ row }) => (
      <div className='flex flex-col gap-1'>
        <span className='text-foreground'>{formatPhone(row.original.number)}</span>
        <span className='text-xs text-muted-foreground'>{row.original.email}</span>
      </div>
    ),
  }),
  columnHelper.accessor('end_date', {
    header: ({ column }) => <DataTableColumnHeader column={column} title='Contract Dates' />,
    enableSorting: true,
    meta: {
      className: 'text-left',
      displayName: 'Contract Dates',
    },
    cell: ({ row }) => (
      <div className='flex flex-col gap-1'>
        <span className='tabular-nums text-foreground'>
          {row.original.end_date ? (
            <>
              End:{' '}
              {new Date(row.original.end_date).toLocaleDateString('en-GB', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
              })}
            </>
          ) : (
            <Badge className='rounded-full px-2 py-0.5' variant='default'>
              Active
            </Badge>
          )}
        </span>
        <span className='text-xs tabular-nums text-muted-foreground'>
          Start:{' '}
          {new Date(row.original.start_date).toLocaleDateString('en-GB', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
          })}
        </span>
      </div>
    ),
  }),
  columnHelper.accessor('account', {
    header: ({ column }) => <DataTableColumnHeader column={column} title='Account' />,
    enableSorting: true,
    meta: {
      className: 'text-left',
      displayName: 'Account',
    },
    cell: ({ row }) => (
      <div className='flex flex-col gap-1'>
        <span className='text-foreground'>{getAccountLabel(row.original.account)}</span>
        <span className='text-xs text-muted-foreground'>Main division</span>
      </div>
    ),
  }),
  columnHelper.accessor('minutes_called', {
    header: ({ column }) => <DataTableColumnHeader column={column} title='Capacity (mins)' />,
    enableSorting: true,
    meta: {
      className: 'text-left',
      displayName: 'Capacity (mins)',
    },
    cell: ({ row }) => {
      const { minutes_called, minutes_booked } = row.original;
      const capacity = minutes_booked > 0 ? (minutes_called / minutes_booked) * 100 : 0;

      return (
        <div className='flex items-center gap-2.5'>
          <ProgressCircle
            value={capacity}
            max={100}
            radius={14}
            strokeWidth={3}
            variant={minutesProgressVariant(capacity)}
            aria-hidden='true'
          >
            <span className='text-[11px] font-semibold tabular-nums'>{Math.round(capacity)}</span>
          </ProgressCircle>
          <div className='flex flex-col gap-0'>
            <span className='text-foreground'>
              <span className='text-muted-foreground'>Called </span>
              <span className='font-medium tabular-nums'>{valueFormatter(minutes_called)}</span>
            </span>
            <span className='text-xs text-muted-foreground'>Booked {valueFormatter(minutes_booked)}</span>
          </div>
        </div>
      );
    },
  }),
  columnHelper.accessor('ticket_generation', {
    header: ({ column }) => <DataTableColumnHeader column={column} title='Ticket Generation' />,
    enableSorting: false,
    meta: {
      className: 'text-left',
      displayName: 'Ticket Generation',
    },
    cell: ({ row }) => <ButtonTicketGeneration initialState={row.original.ticket_generation} />,
  }),
] as ColumnDef<Agent>[];
