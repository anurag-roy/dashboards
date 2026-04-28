import { cn } from '@/lib/utils';

export function Logo({ className }: { className?: string }) {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      viewBox='0 0 180 24'
      fill='none'
      className={cn('h-6 text-foreground', className)}
    >
      <circle cx='12' cy='12' r='10' className='fill-primary' />
      <circle cx='12' cy='12' r='4' className='fill-primary-foreground' />
      <text
        x='30'
        y='18'
        className='fill-current'
        style={{
          fontSize: '18px',
          fontWeight: 600,
          fontFamily: 'var(--font-sans), system-ui, sans-serif',
          letterSpacing: '-0.02em',
        }}
      >
        Overview
      </text>
    </svg>
  );
}
