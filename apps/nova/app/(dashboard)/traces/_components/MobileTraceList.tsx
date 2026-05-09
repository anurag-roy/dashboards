'use client';

import * as React from 'react';
import { Badge } from '@workspace/ui/components/badge';
import { Card, CardHeader, CardContent, CardFooter } from '@workspace/ui/components/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@workspace/ui/components/dropdown-menu';
import { Button } from '@workspace/ui/components/button';
import { MoreHorizontal, Copy, Eye } from 'lucide-react';
import type { Table } from '@tanstack/react-table';

import type { Trace } from '@/lib/data/traces';
import { modelMap } from '@/lib/data/models';
import { formatters, relativeTime } from '@/lib/utils';
import { cn } from '@/lib/utils';
import { ProviderLogo } from '@/components/ProviderLogo';

const BATCH_SIZE = 15;

type MobileTraceListProps = {
  table: Table<Trace>;
  onRowClick: (trace: Trace) => void;
};

export function MobileTraceList({ table, onRowClick }: MobileTraceListProps) {
  const allRows = table.getFilteredRowModel().rows;
  const [visibleCount, setVisibleCount] = React.useState(BATCH_SIZE);
  const sentinelRef = React.useRef<HTMLDivElement>(null);

  const rowCount = allRows.length;
  React.useEffect(() => {
    setVisibleCount(BATCH_SIZE);
  }, [rowCount]);

  React.useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setVisibleCount((prev) => prev + BATCH_SIZE);
        }
      },
      { rootMargin: '200px' }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const visible = allRows.slice(0, visibleCount);
  const hasMore = visibleCount < allRows.length;

  return (
    <div className='space-y-3 md:hidden'>
      {visible.length > 0 ? (
        visible.map((row) => {
          const trace = row.original;
          const model = modelMap[trace.model];
          return (
            <Card key={trace.traceId} className='rounded-2xl shadow-sm transition-colors hover:bg-muted/50'>
              <CardHeader className='flex flex-row items-center justify-between space-y-0'>
                <div className='flex items-center gap-2'>
                  <ProviderLogo providerId={model?.providerId ?? 'openai'} size={14} />
                  <span className='text-sm font-medium text-foreground'>{model?.name}</span>
                </div>
                <div className='flex items-center gap-2'>
                  <Badge
                    variant={trace.status === 'success' ? 'default' : 'destructive'}
                    className='rounded-full capitalize'
                  >
                    {trace.status}
                  </Badge>
                  <DropdownMenu>
                    <DropdownMenuTrigger
                      render={
                        <Button
                          variant='ghost'
                          size='icon'
                          className='size-8 data-[state=open]:bg-muted'
                          onClick={(e) => e.stopPropagation()}
                        >
                          <MoreHorizontal className='size-4' />
                          <span className='sr-only'>Open menu</span>
                        </Button>
                      }
                    />
                    <DropdownMenuContent align='end' className='w-[160px]'>
                      <DropdownMenuItem onClick={() => onRowClick(trace)}>
                        <Eye className='size-4' />
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => {
                          navigator.clipboard.writeText(trace.traceId);
                        }}
                      >
                        <Copy className='size-4' />
                        Copy Trace ID
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              <CardContent>
                <p className='text-sm text-muted-foreground'>{trace.userPrompt}</p>
              </CardContent>
              <CardFooter>
                <div className='flex w-full items-center justify-between text-xs text-muted-foreground'>
                  <div className='flex flex-col gap-1'>
                    <span className='font-mono'>{trace.traceId}</span>
                    <span suppressHydrationWarning className='text-muted-foreground'>
                      {relativeTime(trace.timestamp)}
                    </span>
                  </div>
                  <div className='flex flex-col items-end gap-1'>
                    <span
                      className={cn(
                        'font-medium tabular-nums',
                        trace.latencyMs < 500
                          ? 'text-emerald-600 dark:text-emerald-400'
                          : trace.latencyMs < 1_000
                            ? 'text-amber-600 dark:text-amber-400'
                            : 'text-destructive'
                      )}
                    >
                      {trace.latencyMs.toLocaleString()}ms
                    </span>
                    <span className='tabular-nums'>{formatters.currencyPrecise(trace.cost)}</span>
                  </div>
                </div>
              </CardFooter>
            </Card>
          );
        })
      ) : (
        <p className='py-8 text-center text-sm text-muted-foreground'>No results.</p>
      )}

      {hasMore && (
        <>
          <div ref={sentinelRef} className='h-px' aria-hidden />
          <p className='pb-1 text-center text-xs text-muted-foreground tabular-nums'>
            Showing {visible.length} of {allRows.length}
          </p>
        </>
      )}
    </div>
  );
}
