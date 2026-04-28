'use client';

import { useEffect, useRef, useState } from 'react';
import type { Table } from '@tanstack/react-table';
import { ShieldCheck, Phone, Mail } from 'lucide-react';

import { Badge } from '@workspace/ui/components/badge';
import { ProgressCircle } from '@workspace/ui/components/progress-circle';

import type { Agent } from '@/lib/data/agents/schema';
import { accounts } from '@/lib/data/agents/schema';
import { cn, valueFormatter } from '@/lib/utils';

import { ButtonTicketGeneration } from './ButtonTicketGeneration';

const BATCH_SIZE = 10;

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

function AgentCard({ agent }: { agent: Agent }) {
  const capacity = agent.minutes_booked > 0 ? (agent.minutes_called / agent.minutes_booked) * 100 : 0;

  return (
    <div className='rounded-2xl border border-border bg-card p-4 shadow-sm'>
      <div className='flex items-start justify-between gap-3'>
        <div className='min-w-0 flex-1'>
          <div className='flex items-center gap-1.5'>
            <span className='truncate text-sm font-semibold text-foreground'>{agent.full_name}</span>
            <ShieldCheck
              className={cn(
                'size-3.5 shrink-0',
                agent.registered ? 'text-emerald-600 dark:text-emerald-500' : 'text-muted-foreground/40'
              )}
              aria-hidden
            />
          </div>
          <div className='mt-0.5 flex items-center gap-1.5 text-xs text-muted-foreground'>
            <span>AgID</span>
            <span className='font-mono font-medium uppercase tabular-nums text-foreground'>{agent.agent_id}</span>
          </div>
        </div>
        {agent.end_date ? (
          <span className='shrink-0 text-xs tabular-nums text-muted-foreground'>
            Ends{' '}
            {new Date(agent.end_date).toLocaleDateString('en-GB', {
              day: '2-digit',
              month: 'short',
              year: 'numeric',
            })}
          </span>
        ) : (
          <Badge className='shrink-0 rounded-full px-2 py-0.5 text-xs' variant='default'>
            Active
          </Badge>
        )}
      </div>

      <div className='mt-3 space-y-1 text-xs text-muted-foreground'>
        <div className='flex items-center gap-1.5'>
          <Phone className='size-3 shrink-0' aria-hidden />
          <span>{formatPhone(agent.number)}</span>
        </div>
        <div className='flex items-center gap-1.5'>
          <Mail className='size-3 shrink-0' aria-hidden />
          <span className='truncate'>{agent.email}</span>
        </div>
      </div>

      <div className='mt-3 flex items-center justify-between gap-3 border-t border-border pt-3'>
        <div className='flex items-center gap-2'>
          <ProgressCircle
            value={capacity}
            max={100}
            radius={14}
            strokeWidth={3}
            variant={minutesProgressVariant(capacity)}
            aria-hidden
          >
            <span className='text-[11px] font-semibold tabular-nums'>{Math.round(capacity)}</span>
          </ProgressCircle>
          <div className='flex flex-col text-xs'>
            <span className='text-foreground'>
              <span className='text-muted-foreground'>Called </span>
              <span className='font-medium tabular-nums'>{valueFormatter(agent.minutes_called)}</span>
            </span>
            <span className='text-muted-foreground'>
              {getAccountLabel(agent.account)} · Booked {valueFormatter(agent.minutes_booked)}
            </span>
          </div>
        </div>
        <ButtonTicketGeneration initialState={agent.ticket_generation} />
      </div>
    </div>
  );
}

type MobileAgentListProps = {
  table: Table<Agent>;
};

export function MobileAgentList({ table }: MobileAgentListProps) {
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
        visible.map((row) => <AgentCard key={row.id} agent={row.original} />)
      ) : (
        <p className='py-8 text-center text-sm text-muted-foreground'>No agents found.</p>
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
