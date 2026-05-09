import { cn } from '@workspace/ui/lib/utils';

type AppLogoProps = {
  className?: string;
  iconClassName?: string;
  showText?: boolean;
};

export function AppLogo({ className, iconClassName, showText = false }: AppLogoProps) {
  return (
    <div className={cn('flex min-w-0 items-center gap-3', className)}>
      <span className={cn('relative block size-8 shrink-0 overflow-hidden', iconClassName)}>
        <span
          aria-hidden='true'
          className="block size-full bg-[url('/logos/pulse-light.svg')] bg-cover bg-center dark:bg-[url('/logos/pulse-dark.svg')]"
        />
      </span>
      {showText ? <span className='truncate text-lg font-bold text-foreground'>Pulse</span> : null}
    </div>
  );
}
