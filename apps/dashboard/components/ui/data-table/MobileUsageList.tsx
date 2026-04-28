'use client';

import { useEffect, useRef, useState } from 'react';
import type { Table } from '@tanstack/react-table';
import { MapPin, Calendar } from 'lucide-react';

import { InsightBadge } from '@workspace/ui/components/insight-badge';

import { statuses } from '@/lib/data/data';
import type { Usage } from '@/lib/data/schema';
import { formatters } from '@/lib/utils';

import { DataTableRowActions } from './DataTableRowActions';

const BATCH_SIZE = 10;

type StatusVariant = 'default' | 'neutral' | 'success' | 'error' | 'warning';

function UsageCard({ row }: { row: { original: Usage; id: string } }) {
  const item = row.original;
  const status = statuses.find((s) => s.value === item.status);

  return (
    <div className='rounded-2xl border border-border bg-card p-4 shadow-sm'>
      <div className='flex items-start justify-between gap-3'>
        <div className='min-w-0 flex-1'>
          <p className='truncate text-sm font-semibold text-foreground'>{item.owner}</p>
          <div className='mt-1'>
            {status && <InsightBadge variant={status.variant as StatusVariant}>{status.label}</InsightBadge>}
          </div>
        </div>
        <div className='flex shrink-0 items-center gap-2'>
          <span className='text-sm font-semibold tabular-nums text-foreground'>
            {formatters.currency!(Number(item.costs ?? 0))}
          </span>
          <DataTableRowActions row={row as never} />
        </div>
      </div>

      <div className='mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground'>
        <span className='flex items-center gap-1'>
          <MapPin className='size-3 shrink-0' aria-hidden />
          {item.region}
        </span>
        <span className='flex items-center gap-1'>
          <Calendar className='size-3 shrink-0' aria-hidden />
          {item.lastEdited}
        </span>
      </div>
    </div>
  );
}

type MobileUsageListProps<TData> = {
  table: Table<TData>;
};

export function MobileUsageList<TData>({ table }: MobileUsageListProps<TData>) {
  const allRows = table.getFilteredRowModel().rows;
  const [visibleCount, setVisibleCount] = useState(BATCH_SIZE);
  const sentinelRef = useRef<HTMLDivElement>(null);

  const rowCount = allRows.length;
  useEffect(() => {
    setVisibleCount(BATCH_SIZE);
  }, [rowCount]);

  useEffect(() => {
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
        visible.map((row) => (
          <UsageCard key={row.id} row={row as unknown as { original: Usage; id: string }} />
        ))
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
