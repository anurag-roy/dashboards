'use client';

import { useEffect, useRef, useState } from 'react';
import { Clock, Calendar } from 'lucide-react';

import type { Ticket } from '@/lib/data/support/schema';
import { getCategoryDetails, type Category } from '@/lib/data/support/schema';
import { cn } from '@/lib/utils';

const BATCH_SIZE = 10;

function statusPillClass(status: string) {
  switch (status) {
    case 'resolved':
      return 'bg-emerald-50/80 text-emerald-800 ring-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:ring-emerald-800/40';
    case 'in-progress':
      return 'bg-blue-50/80 text-blue-800 ring-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:ring-blue-800/40';
    case 'escalated':
      return 'bg-rose-50/80 text-rose-800 ring-rose-200 dark:bg-rose-900/20 dark:text-rose-400 dark:ring-rose-800/40';
    default:
      return 'bg-violet-50/80 text-violet-800 ring-violet-200 dark:bg-violet-900/20 dark:text-violet-400 dark:ring-violet-800/40';
  }
}

function priorityDotClass(priority: string) {
  switch (priority) {
    case 'low':
      return 'bg-emerald-500 dark:bg-emerald-400';
    case 'high':
      return 'bg-orange-500';
    case 'emergency':
      return 'bg-destructive';
    default:
      return 'bg-muted-foreground';
  }
}

function formatDuration(minutes: string | null) {
  if (minutes === null) return null;
  const mins = Number.parseInt(minutes, 10);
  if (Number.isNaN(mins)) return null;
  const hours = Math.floor(mins / 60);
  const rem = mins % 60;
  return hours > 0 ? `${hours}h ${rem}m` : `${rem}m`;
}

function TicketCard({ ticket }: { ticket: Ticket }) {
  const category = getCategoryDetails(ticket.category as Category);
  const duration = formatDuration(ticket.duration);

  return (
    <div className='rounded-2xl border border-border bg-card p-4 shadow-sm'>
      <div className='flex items-start justify-between gap-3'>
        <span
          className={cn(
            'inline-flex shrink-0 rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ring-1',
            statusPillClass(ticket.status)
          )}
        >
          {ticket.status.replace('-', ' ')}
        </span>
        <span className='flex items-center gap-1.5 text-xs text-muted-foreground capitalize'>
          <span className={cn('size-1.5 shrink-0 rounded-full', priorityDotClass(ticket.priority))} aria-hidden />
          {ticket.priority}
        </span>
      </div>

      <p className='mt-2.5 text-sm font-medium text-foreground'>{category?.name ?? ticket.category}</p>
      <p className='mt-0.5 text-xs text-muted-foreground capitalize'>{ticket.type}</p>

      <div className='mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground'>
        {duration && (
          <span className='flex items-center gap-1'>
            <Clock className='size-3 shrink-0' aria-hidden />
            {duration}
          </span>
        )}
        <span className='flex items-center gap-1'>
          <Calendar className='size-3 shrink-0' aria-hidden />
          {new Date(ticket.created).toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
          })}
        </span>
      </div>
    </div>
  );
}

type MobileTicketListProps = {
  data: Ticket[];
};

export function MobileTicketList({ data }: MobileTicketListProps) {
  const [visibleCount, setVisibleCount] = useState(BATCH_SIZE);
  const sentinelRef = useRef<HTMLDivElement>(null);

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

  const visible = data.slice(0, visibleCount);
  const hasMore = visibleCount < data.length;

  return (
    <div className='mt-6 space-y-3 md:hidden'>
      {visible.length > 0 ? (
        visible.map((ticket, i) => <TicketCard key={`${ticket.policyNumber}-${i}`} ticket={ticket} />)
      ) : (
        <p className='py-8 text-center text-sm text-muted-foreground'>No tickets found.</p>
      )}

      {hasMore && (
        <>
          <div ref={sentinelRef} className='h-px' aria-hidden />
          <p className='pb-1 text-center text-xs text-muted-foreground tabular-nums'>
            Showing {visible.length} of {data.length}
          </p>
        </>
      )}
    </div>
  );
}
