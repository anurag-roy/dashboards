import { Skeleton } from '@workspace/ui/components/skeleton';

export default function ReportsLoading() {
  return (
    <div className='space-y-6'>
      <div className='rounded-3xl border border-border/70 bg-background p-4 sm:p-6'>
        <Skeleton className='h-6 w-40' />
        <Skeleton className='mt-2 h-4 w-56' />
        <div className='mt-4 flex flex-wrap gap-2'>
          <Skeleton className='h-9 w-32 rounded-3xl' />
          <Skeleton className='h-9 w-40 rounded-3xl' />
          <Skeleton className='h-9 w-44 rounded-3xl' />
          <Skeleton className='h-9 w-52 rounded-3xl' />
        </div>
      </div>

      <div className='space-y-6'>
        <div className='rounded-3xl border border-border/70 p-4 sm:p-6'>
          <Skeleton className='h-4 w-56' />
          <Skeleton className='mt-3 h-8 w-36' />
          <Skeleton className='mt-6 h-64 w-full rounded-2xl' />
        </div>
        <div className='rounded-3xl border border-border/70 p-4 sm:p-6'>
          <Skeleton className='h-4 w-48' />
          <Skeleton className='mt-3 h-8 w-36' />
          <Skeleton className='mt-6 h-64 w-full rounded-2xl' />
        </div>
      </div>
    </div>
  );
}
