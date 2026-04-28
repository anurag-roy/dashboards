import { cn } from '@/lib/utils';

type CategoryBarProps = {
  values: number[];
  colors: string[];
  className?: string;
};

export function CategoryBar({ values, colors, className }: CategoryBarProps) {
  const sum = values.reduce((acc, v) => acc + v, 0);
  if (sum <= 0) {
    return <div className={cn('h-2 w-full rounded-full bg-muted', className)} role='img' aria-label='Distribution' />;
  }

  return (
    <div
      className={cn('flex h-2 w-full overflow-hidden rounded-full bg-muted', className)}
      role='img'
      aria-label='Distribution'
    >
      {values.map((v, i) => {
        const pct = (v / sum) * 100;
        return (
          <div
            key={`segment-${i}-${pct}`}
            className={cn('min-w-0 shrink-0', colors[i] ?? 'bg-primary')}
            style={{ width: `${pct}%` }}
          />
        );
      })}
    </div>
  );
}
