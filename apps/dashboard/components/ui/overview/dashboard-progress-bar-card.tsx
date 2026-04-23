import { InsightBadge } from '@workspace/ui/components/insight-badge';
import { ProgressBar } from '@/components/progress-bar';
import type { KpiEntry } from '@/lib/types/overview';

export type ProgressBarCardProps = {
  title: string;
  change: string;
  value: string;
  valueDescription: string;
  ctaDescription: string;
  ctaText: string;
  ctaLink: string;
  data: KpiEntry[];
};

export function ProgressBarCard({
  title,
  change,
  value,
  valueDescription,
  ctaDescription,
  ctaText,
  ctaLink,
  data,
}: ProgressBarCardProps) {
  return (
    <div className='flex flex-col justify-between'>
      <div>
        <div className='flex items-center gap-2'>
          <dt className='font-bold text-foreground sm:text-sm'>{title}</dt>
          <InsightBadge variant='neutral'>{change}</InsightBadge>
        </div>
        <dd className='mt-2 flex items-baseline gap-2'>
          <span className='text-xl text-foreground'>{value}</span>
          <span className='text-sm text-muted-foreground'>{valueDescription}</span>
        </dd>
        <ul role='list' className='mt-4 space-y-5'>
          {data.map((item) => (
            <li key={item.title}>
              <p className='flex justify-between text-sm'>
                <span className='font-medium text-foreground'>{item.title}</span>
                <span className='font-medium text-foreground'>
                  {item.current}
                  <span className='font-normal text-muted-foreground'>
                    /{item.allowed}
                    {item.unit}
                  </span>
                </span>
              </p>
              <ProgressBar value={item.percentage} className='mt-2 [&>*]:h-1.5' />
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
