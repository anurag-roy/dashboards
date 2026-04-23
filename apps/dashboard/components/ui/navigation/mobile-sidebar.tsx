'use client';

import { siteConfig } from '@/app/siteConfig';
import { Button } from '@workspace/ui/components/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@workspace/ui/components/sheet';
import { cn, focusRing } from '@/lib/utils';
import { Home, Link2, ListChecks, Menu, Settings } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import * as React from 'react';

const navigation = [
  { name: 'Overview', href: siteConfig.baseLinks.overview, icon: Home },
  { name: 'Details', href: siteConfig.baseLinks.details, icon: ListChecks },
  {
    name: 'Settings',
    href: siteConfig.baseLinks.settings.general,
    icon: Settings,
  },
] as const;

const shortcuts = [
  { name: 'Add new user', href: '/settings/users', icon: Link2 },
  { name: 'Workspace usage', href: '/settings/billing#billing-overview', icon: Link2 },
  { name: 'Cost spend control', href: '/settings/billing#cost-spend-control', icon: Link2 },
  { name: 'Overview – Rows written', href: '/overview#usage-overview', icon: Link2 },
] as const;

export function MobileSidebar() {
  const pathname = usePathname();
  const [open, setOpen] = React.useState(false);

  const isActive = (itemHref: string) => {
    if (itemHref === siteConfig.baseLinks.settings.general) {
      return pathname.startsWith('/settings');
    }
    return pathname === itemHref || pathname.startsWith(itemHref);
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        render={
          <Button
            variant='ghost'
            aria-label='open sidebar'
            className='group flex items-center rounded-2xl p-2.5 text-sm font-medium hover:bg-muted data-open:bg-muted'
          >
            <Menu className='size-6 shrink-0 sm:size-5' aria-hidden='true' />
          </Button>
        }
      />
      <SheetContent side='left' className='w-full sm:max-w-lg' showCloseButton>
        <SheetHeader>
          <SheetTitle>Retail Analytics</SheetTitle>
        </SheetHeader>
        <div className='px-3 pb-8'>
          <nav aria-label='core mobile navigation links' className='flex flex-1 flex-col gap-8 pt-2'>
            <ul role='list' className='flex flex-col gap-1.5'>
              {navigation.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className={cn(
                      isActive(item.href)
                        ? 'bg-primary/10 text-primary ring-1 ring-primary/20'
                        : 'text-muted-foreground hover:text-foreground',
                      'flex items-center gap-x-2.5 rounded-2xl px-3 py-2 text-base font-medium transition hover:bg-muted sm:text-sm',
                      focusRing
                    )}
                  >
                    <item.icon className='size-5 shrink-0' aria-hidden='true' />
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
            <div>
              <span className='text-sm leading-6 font-semibold text-muted-foreground sm:text-xs'>Shortcuts</span>
              <ul aria-label='shortcuts' role='list' className='mt-1 flex flex-col gap-1'>
                {shortcuts.map((item) => {
                  return (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        onClick={() => setOpen(false)}
                        className={cn(
                          'flex items-center gap-x-2.5 rounded-2xl px-3 py-2 font-medium text-muted-foreground transition hover:bg-muted hover:text-foreground sm:text-sm',
                          focusRing
                        )}
                      >
                        <item.icon className='size-4 shrink-0' aria-hidden='true' />
                        {item.name}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          </nav>
        </div>
      </SheetContent>
    </Sheet>
  );
}
