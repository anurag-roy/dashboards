'use client';

import { cn, focusRing } from '@/lib/utils';
import Link from 'next/link';
import * as React from 'react';

function TabNavigation({ className, children, ...props }: React.ComponentProps<'nav'>) {
  return (
    <nav
      className={cn(
        'flex items-center justify-start overflow-x-auto border-b border-border whitespace-nowrap [scrollbar-width:none] [&::-webkit-scrollbar]:hidden',
        className
      )}
      {...props}
    >
      <ul className='flex gap-0' role='list'>
        {children}
      </ul>
    </nav>
  );
}

type TabNavigationLinkProps = React.ComponentProps<typeof Link> & {
  active?: boolean;
};

const TabNavigationLink = React.forwardRef<HTMLAnchorElement, TabNavigationLinkProps>(
  ({ className, active, ...props }, ref) => {
    return (
      <li className='flex' role='none'>
        <Link
          ref={ref}
          data-active={active ? '' : undefined}
          className={cn(
            '-mb-px flex items-center rounded-t-2xl border-b-2 border-transparent px-4 pt-1 pb-2.5 text-sm font-medium text-muted-foreground transition-[color,border-color,background-color] duration-150 ease-out',
            'hover:border-border hover:text-foreground',
            'data-active:border-primary data-active:text-primary',
            focusRing,
            className
          )}
          {...props}
        />
      </li>
    );
  }
);
TabNavigationLink.displayName = 'TabNavigationLink';

export { TabNavigation, TabNavigationLink };
