import { Skeleton } from '@workspace/ui/components/skeleton';

export default function TransactionsLoading() {
  return (
    <div className='space-y-6'>
      <div className='space-y-2'>
        <Skeleton className='h-6 w-40' />
        <Skeleton className='h-4 w-80 max-w-full' />
      </div>

      <div className='rounded-3xl border border-border/70 p-4'>
        <div className='flex flex-wrap items-center justify-between gap-3'>
          <Skeleton className='h-9 w-64 max-w-full rounded-2xl' />
          <Skeleton className='h-9 w-28 rounded-2xl' />
        </div>
        <div className='mt-4 space-y-2'>
          <Skeleton className='h-10 w-full rounded-2xl' />
          <Skeleton className='h-10 w-full rounded-2xl' />
          <Skeleton className='h-10 w-full rounded-2xl' />
          <Skeleton className='h-10 w-full rounded-2xl' />
        </div>
      </div>
    </div>
  );
}
