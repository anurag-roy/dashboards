import { AlertTriangle, FileCheck, FileText, FolderMinus } from 'lucide-react';
import { createColumnHelper } from '@tanstack/react-table';

import { Badge } from '@workspace/ui/components/badge';

import { getCategoryDetails, type Category, type Ticket } from '@/lib/data/support/schema';
import { cn } from '@/lib/utils';

type TypeKey = Ticket['type'];

const typeIcons: Partial<Record<TypeKey, typeof FileText>> = {
  fnol: FolderMinus,
  policy: FileText,
  claims: FileCheck,
  emergency: AlertTriangle,
  coverage: FileText,
  billing: FileText,
};

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
    case 'medium':
      return 'bg-muted-foreground';
    case 'high':
      return 'bg-orange-500';
    case 'emergency':
      return 'bg-destructive';
    default:
      return 'bg-muted-foreground';
  }
}

const columnHelper = createColumnHelper<Ticket>();

export const supportColumns = [
  columnHelper.accessor('status', {
    header: 'Status',
    meta: { className: 'text-left' },
    cell: (ctx) => (
      <span className={cn('inline-flex rounded-full px-3 py-1 text-xs font-semibold ring-1 capitalize', statusPillClass(ctx.getValue()))}>
        {ctx.getValue().replace('-', ' ')}
      </span>
    ),
  }),
  columnHelper.accessor('type', {
    header: 'Type',
    meta: { className: 'text-left' },
    cell: (ctx) => {
      const t = ctx.getValue() as TypeKey;
      const Icon = typeIcons[t];
      const label = t.charAt(0).toUpperCase() + t.slice(1);
      return (
        <div className='flex items-center gap-2'>
          {Icon ? <Icon className='size-4 shrink-0 text-muted-foreground' aria-hidden /> : null}
          <span className='text-foreground'>{label}</span>
        </div>
      );
    },
  }),
  columnHelper.accessor('category', {
    header: 'Category',
    meta: { className: 'text-left max-w-[min(18rem,45vw)]' },
    cell: (ctx) => {
      const raw = ctx.getValue() as Category;
      const details = getCategoryDetails(raw);
      return <span className='font-medium text-foreground'>{details?.name ?? raw}</span>;
    },
  }),
  columnHelper.accessor('priority', {
    header: 'Priority',
    meta: { className: 'text-left' },
    cell: (ctx) => (
      <Badge variant='outline' className='gap-1.5 rounded-full border-border font-normal capitalize'>
        <span className={cn('size-2 shrink-0 rounded-sm', priorityDotClass(ctx.getValue()))} aria-hidden />
        {ctx.getValue()}
      </Badge>
    ),
  }),
  columnHelper.accessor('duration', {
    header: 'Duration',
    meta: { className: 'text-right tabular-nums' },
    cell: (ctx) => {
      const minutes = ctx.getValue();
      if (minutes === null) {
        return <span className='text-muted-foreground'>—</span>;
      }
      const mins = Number.parseInt(minutes, 10);
      if (Number.isNaN(mins)) {
        return null;
      }
      const hours = Math.floor(mins / 60);
      const remainingMins = mins % 60;
      return (
        <span className='text-muted-foreground'>
          {hours > 0 ? `${hours}h ` : ''}
          {remainingMins}m
        </span>
      );
    },
  }),
  columnHelper.accessor('created', {
    header: 'Created',
    meta: { className: 'text-left tabular-nums' },
    cell: (ctx) =>
      new Date(ctx.getValue()).toLocaleString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
  }),
];
