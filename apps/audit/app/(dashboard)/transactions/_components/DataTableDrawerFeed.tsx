import { formatDistanceToNow } from 'date-fns';

type FeedEvent = {
  id: string;
  actor: string;
  action: string;
  at: string;
};

type DataTableDrawerFeedProps = {
  events: FeedEvent[];
};

export function DataTableDrawerFeed({ events }: DataTableDrawerFeedProps) {
  if (events.length === 0) {
    return <p className='text-sm text-muted-foreground'>No recent activity.</p>;
  }

  return (
    <ol className='space-y-4'>
      {events.map((event) => (
        <li key={event.id} className='relative pl-5'>
          <span className='absolute top-2 left-0 size-2 rounded-full bg-primary/70' />
          <div className='space-y-1 rounded-2xl border border-border/70 bg-muted/30 p-3'>
            <p className='text-sm text-foreground'>
              <span className='font-medium'>{event.actor}</span> {event.action}
            </p>
            <p className='text-xs text-muted-foreground'>
              {formatDistanceToNow(new Date(event.at), { addSuffix: true })}
            </p>
          </div>
        </li>
      ))}
    </ol>
  );
}
