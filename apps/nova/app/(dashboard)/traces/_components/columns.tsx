import type { ColumnDef } from '@tanstack/react-table';
import { Badge } from '@workspace/ui/components/badge';
import { cn } from '@workspace/ui/lib/utils';

import type { Trace } from '@/lib/data/traces';
import { modelMap } from '@/lib/data/models';
import { formatters, relativeTime } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@workspace/ui/components/tooltip';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@workspace/ui/components/dropdown-menu';
import { Button } from '@workspace/ui/components/button';
import { MoreHorizontal, Copy, Eye } from 'lucide-react';
import { CopyButton } from '@workspace/ui/components/copy-button';
import { DataTableColumnHeader } from './DataTableColumnHeader';
import { ProviderLogo } from '@/components/ProviderLogo';
import { RouteOutcomeBadge } from './RouteOutcomeBadge';

export const columns: ColumnDef<Trace>[] = [
  {
    accessorKey: 'traceId',
    header: 'Trace ID',
    cell: ({ row }) => {
      const id = row.getValue('traceId') as string;
      return (
        <div className='flex items-center gap-1.5'>
          <span className='font-mono text-xs text-muted-foreground'>
            {id.slice(0, 8)}...{id.slice(-4)}
          </span>
          <CopyButton value={id} className='size-6 text-muted-foreground/50 hover:text-foreground' />
        </div>
      );
    },
    enableSorting: false,
  },
  {
    accessorKey: 'timestamp',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Timestamp' />,
    cell: ({ row }) => (
      <span
        suppressHydrationWarning
        className='text-sm whitespace-nowrap text-muted-foreground'
        title={row.getValue('timestamp')}
      >
        {relativeTime(row.getValue('timestamp'))}
      </span>
    ),
  },
  {
    accessorKey: 'model',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Model' />,
    cell: ({ row }) => {
      const modelId = row.getValue('model') as string;
      const model = modelMap[modelId];
      return (
        <div className='flex items-center gap-2'>
          <ProviderLogo providerId={model?.providerId ?? 'openai'} size={14} />
          <span className='text-sm text-foreground'>{model?.name ?? modelId}</span>
        </div>
      );
    },
    filterFn: (row, id, value: string[]) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: 'userPrompt',
    header: 'Prompt',
    cell: ({ row }) => (
      <TooltipProvider delay={500}>
        <Tooltip>
          <TooltipTrigger
            render={<span className='block max-w-[200px] cursor-help truncate text-sm text-muted-foreground' />}
          >
            {(row.getValue('userPrompt') as string).slice(0, 60)}...
          </TooltipTrigger>
          <TooltipContent side='top' className='max-w-[400px] whitespace-normal'>
            {row.getValue('userPrompt') as string}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    ),
    enableSorting: false,
    meta: { className: 'hidden 2xl:table-cell' },
  },
  {
    accessorKey: 'routeOutcome',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Route' />,
    cell: ({ row }) => (
      <div className='flex flex-col items-start gap-1'>
        <RouteOutcomeBadge outcome={row.original.routeOutcome} />
        <span className='text-xs text-muted-foreground tabular-nums'>
          {row.original.attempts.length === 0
            ? `${row.original.gatewayLatencyMs}ms edge`
            : `${row.original.attempts.length} ${row.original.attempts.length === 1 ? 'attempt' : 'attempts'}`}
        </span>
      </div>
    ),
  },
  {
    id: 'tokens',
    accessorFn: (row) => row.promptTokens + row.completionTokens,
    header: ({ column }) => <DataTableColumnHeader column={column} title='Tokens' className='justify-end' />,
    cell: ({ row }) => (
      <span className='text-right text-sm text-foreground tabular-nums'>
        {formatters.number(row.original.promptTokens)} / {formatters.number(row.original.completionTokens)}
      </span>
    ),
    meta: { className: 'text-right' },
  },
  {
    accessorKey: 'latencyMs',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Latency' className='justify-end' />,
    cell: ({ row }) => {
      const ms = row.getValue('latencyMs') as number;
      return (
        <span
          className={cn(
            'text-right text-sm tabular-nums',
            ms < 500
              ? 'text-emerald-600 dark:text-emerald-400'
              : ms < 1_000
                ? 'text-amber-600 dark:text-amber-400'
                : 'text-destructive'
          )}
        >
          {ms.toLocaleString()}ms
        </span>
      );
    },
    meta: { className: 'text-right' },
  },
  {
    accessorKey: 'cost',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Cost' className='justify-end' />,
    cell: ({ row }) => (
      <span className='text-right text-sm text-foreground tabular-nums'>
        {formatters.currencyPrecise(row.getValue('cost'))}
      </span>
    ),
    meta: { className: 'text-right' },
  },
  {
    accessorKey: 'status',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Status' />,
    cell: ({ row }) => {
      const status = row.getValue('status') as string;
      return (
        <Badge variant={status === 'success' ? 'default' : 'destructive'} className='rounded-full capitalize'>
          {status}
        </Badge>
      );
    },
    filterFn: (row, id, value: string[]) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    id: 'actions',
    cell: ({ row, table }) => {
      const trace = row.original;
      return (
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button
                variant='ghost'
                size='icon'
                className='size-8 data-[state=open]:bg-muted'
                onClick={(e) => e.stopPropagation()}
              >
                <MoreHorizontal />
                <span className='sr-only'>Open menu</span>
              </Button>
            }
          />
          <DropdownMenuContent align='end' className='w-[160px]'>
            <DropdownMenuGroup>
              <DropdownMenuItem
                onClick={() => {
                  const meta = table.options.meta as { onRowClick?: (trace: Trace) => void } | undefined;
                  meta?.onRowClick?.(trace);
                }}
              >
                <Eye />
                View details
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  navigator.clipboard.writeText(trace.traceId);
                }}
              >
                <Copy />
                Copy trace ID
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
