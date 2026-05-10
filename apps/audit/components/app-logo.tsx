import { cn } from '@workspace/ui/lib/utils';

/* eslint-disable @next/next/no-img-element */

type AppLogoProps = {
  className?: string;
  iconClassName?: string;
  showText?: boolean;
};

export function AppLogo({ className, iconClassName, showText = false }: AppLogoProps) {
  return (
    <div className={cn('flex min-w-0 items-center gap-3', className)}>
      <span className={cn('relative block size-8 shrink-0 overflow-hidden', iconClassName)}>
        <img alt='' aria-hidden='true' className='block size-full dark:hidden' src='/logos/audit-light.svg' />
        <img alt='' aria-hidden='true' className='hidden size-full dark:block' src='/logos/audit-dark.svg' />
      </span>
      {showText ? <span className='truncate text-lg font-bold text-foreground'>Audit</span> : null}
    </div>
  );
}
