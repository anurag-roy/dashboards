'use client';

import * as React from 'react';
import { MonitorIcon, MoonIcon, SunIcon } from 'lucide-react';
import { useTheme } from 'next-themes';

import { Button } from '@workspace/ui/components/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@workspace/ui/components/tooltip';
import { cn } from '@workspace/ui/lib/utils';

const themes = [
  { value: 'light', label: 'Light theme', icon: SunIcon },
  { value: 'dark', label: 'Dark theme', icon: MoonIcon },
  { value: 'system', label: 'System theme', icon: MonitorIcon },
] as const;

export function ThemeSwitcher() {
  const [mounted, setMounted] = React.useState(false);
  const { theme, setTheme } = useTheme();

  React.useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div
      className='flex items-center rounded-full border border-border bg-muted/40 p-0.5'
      role='group'
      aria-label='Theme'
    >
      {themes.map((item) => (
        <Tooltip key={item.value}>
          <TooltipTrigger
            render={
              <Button
                type='button'
                variant='ghost'
                size='icon-xs'
                className={cn(
                  'rounded-full text-muted-foreground hover:bg-background hover:text-foreground',
                  mounted && theme === item.value && 'bg-background text-foreground shadow-sm hover:bg-background'
                )}
                aria-label={item.label}
                aria-pressed={mounted && theme === item.value}
                onClick={() => setTheme(item.value)}
              />
            }
          >
            <item.icon aria-hidden='true' />
          </TooltipTrigger>
          <TooltipContent>{item.label}</TooltipContent>
        </Tooltip>
      ))}
    </div>
  );
}
