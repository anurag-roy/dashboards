import { InsightBadge } from '@workspace/ui/components/insight-badge';
import type { KpiEntryExtended } from '@/lib/types/overview';
import { cn } from '@/lib/utils';

export type CategoryBarCardProps = {
  title: string;
  change: string;
  value: string;
  valueDescription: string;
  subtitle: string;
  ctaDescription: string;
  ctaText: string;
  ctaLink: string;
  data: KpiEntryExtended[];
};

export function CategoryBarCard({
  title,
  change,
  value,
  valueDescription,
  subtitle,
  ctaDescription,
  ctaText,
  ctaLink,
  data,
}: CategoryBarCardProps) {
  return (
    <div className='flex flex-col justify-between'>
      <div>
        <div className='flex items-center gap-2'>
          <h3 className='font-bold text-foreground sm:text-sm'>{title}</h3>
          <InsightBadge variant='neutral'>{change}</InsightBadge>
        </div>
        <p className='mt-2 flex items-baseline gap-2'>
          <span className='text-xl text-foreground'>{value}</span>
          <span className='text-sm text-muted-foreground'>{valueDescription}</span>
        </p>
        <div className='mt-4'>
          <p className='text-sm font-medium text-foreground'>{subtitle}</p>
          <div className='mt-2 flex items-center gap-0.5'>
            {data.map((item) => (
              <div
                key={item.title}
                className={cn(item.color, 'h-1.5 rounded-full')}
                style={{ width: `${item.percentage}%` }}
              />
            ))}
          </div>
        </div>
        <ul role='list' className='mt-5 space-y-2'>
          {data.map((item) => (
            <li key={item.title} className='flex items-center gap-2 text-xs'>
              <span className={cn(item.color, 'size-2.5 rounded-sm')} aria-hidden />
              <span className='text-foreground'>{item.title}</span>
              <span className='text-muted-foreground'>
                ({item.value} / {item.percentage}%)
              </span>
            </li>
          ))}
        </ul>
      </div>
      <p className='mt-6 text-xs text-muted-foreground'>
        {ctaDescription}{' '}
        <a href={ctaLink} className='text-primary dark:text-primary/90'>
          {ctaText}
        </a>
      </p>
    </div>
  );
}
