'use client';

import { useEffect, useRef, useState } from 'react';
import type { Row, Table } from '@tanstack/react-table';
import { Calendar, MoreHorizontal, ShoppingBag } from 'lucide-react';
import { Button } from '@workspace/ui/components/button';
import { Card, CardContent, CardFooter, CardHeader } from '@workspace/ui/components/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@workspace/ui/components/dropdown-menu';
import { InsightBadge } from '@workspace/ui/components/insight-badge';

import { expenseStatuses, type Transaction } from '@/lib/data/schema';
import { formatters } from '@/lib/utils';

const BATCH_SIZE = 10;

function TransactionCard({ transaction, onEditClick }: { transaction: Transaction; onEditClick: () => void }) {
  const status = expenseStatuses.find((s) => s.value === transaction.expense_status);

  return (
    <Card size='sm'>
      <CardHeader className='grid-cols-[1fr_auto] gap-3'>
        <div className='min-w-0 flex-1'>
          <p className='truncate text-sm font-semibold text-foreground'>{transaction.merchant}</p>
          <div className='mt-1'>{status && <InsightBadge variant={status.variant}>{status.label}</InsightBadge>}</div>
        </div>
        <div className='flex shrink-0 items-center gap-2'>
          <span className='text-sm font-semibold text-foreground tabular-nums'>
            {formatters.currency(transaction.amount)}
          </span>
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button
                  type='button'
                  variant='ghost'
                  size='icon-sm'
                  className='rounded-2xl text-muted-foreground hover:bg-muted hover:text-foreground data-open:bg-muted data-open:text-foreground'
                  aria-label='Transaction actions'
                />
              }
            >
              <MoreHorizontal className='size-4' aria-hidden='true' />
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end' className='min-w-40'>
              <DropdownMenuItem onClick={onEditClick}>Edit</DropdownMenuItem>
              <DropdownMenuItem variant='destructive'>Delete</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>

      <CardContent className='flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground'>
        <span className='flex items-center gap-1'>
          <ShoppingBag className='size-3 shrink-0' aria-hidden />
          {transaction.category}
        </span>
        <span className='flex items-center gap-1'>
          <Calendar className='size-3 shrink-0' aria-hidden />
          {formatters.date(transaction.transaction_date)}
        </span>
      </CardContent>

      <CardFooter className='text-xs text-muted-foreground'>
        <span className='truncate'>{transaction.country}</span>
      </CardFooter>
    </Card>
  );
}

type MobileTransactionListProps = {
  table: Table<Transaction>;
  onEditClick: (row: Row<Transaction>) => void;
};

export function MobileTransactionList({ table, onEditClick }: MobileTransactionListProps) {
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
          <TransactionCard key={row.id} transaction={row.original} onEditClick={() => onEditClick(row)} />
        ))
      ) : (
        <p className='py-8 text-center text-sm text-muted-foreground'>No transactions found.</p>
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
