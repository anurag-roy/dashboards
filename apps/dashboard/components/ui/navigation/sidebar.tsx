'use client';

import { siteConfig } from '@/app/siteConfig';
import { cn, focusRing } from '@/lib/utils';
import { Home, Link2, ListChecks, Settings } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { MobileSidebar } from './mobile-sidebar';
import { UserProfileDesktop, UserProfileMobile } from './user-profile';
import { WorkspacesDropdownDesktop, WorkspacesDropdownMobile } from './sidebar-workspaces-dropdown';

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
  {
    name: 'Add new user',
    href: '/settings/users',
    icon: Link2,
  },
  {
    name: 'Workspace usage',
    href: '/settings/billing#billing-overview',
    icon: Link2,
  },
  {
    name: 'Cost spend control',
    href: '/settings/billing#cost-spend-control',
    icon: Link2,
  },
  {
    name: 'Overview – Rows written',
    href: '/overview#usage-overview',
    icon: Link2,
  },
] as const;

export function Sidebar() {
  const pathname = usePathname();
  const isActive = (itemHref: string) => {
    if (itemHref === siteConfig.baseLinks.settings.general) {
      return pathname.startsWith('/settings');
    }
    return pathname === itemHref || pathname.startsWith(itemHref);
  };
  return (
    <>
      <nav className='hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col' aria-label='App'>
        <aside className='flex grow flex-col gap-y-8 overflow-y-auto border-r border-border bg-background px-4 py-5'>
          <WorkspacesDropdownDesktop />
          <nav aria-label='core navigation links' className='flex flex-1 flex-col gap-10'>
            <ul role='list' className='flex flex-col gap-1'>
              {navigation.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className={cn(
                      isActive(item.href)
                        ? 'bg-primary/10 text-primary ring-1 ring-primary/20'
                        : 'text-muted-foreground hover:text-foreground',
                      'flex items-center gap-x-2.5 rounded-2xl px-3 py-2 text-sm font-medium transition hover:bg-muted',
                      focusRing
                    )}
                  >
                    <item.icon className='size-4 shrink-0' aria-hidden='true' />
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
            <div>
              <span className='text-xs leading-6 font-semibold text-muted-foreground'>Shortcuts</span>
              <ul aria-label='shortcuts' role='list' className='mt-1 flex flex-col gap-1'>
                {shortcuts.map((item) => (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className={cn(
                        'flex items-center gap-x-2.5 rounded-2xl px-3 py-2 text-sm font-medium text-muted-foreground transition hover:bg-muted hover:text-foreground',
                        focusRing
                      )}
                    >
                      <item.icon className='size-4 shrink-0' aria-hidden='true' />
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </nav>
          <div className='mt-auto'>
            <UserProfileDesktop />
          </div>
        </aside>
      </nav>
      <div className='sticky top-0 z-40 flex h-16 shrink-0 items-center justify-between border-b border-border bg-background/95 px-3 shadow-sm backdrop-blur sm:gap-x-6 sm:px-5 lg:hidden'>
        <WorkspacesDropdownMobile />
        <div className='flex items-center gap-1 sm:gap-2'>
          <UserProfileMobile />
          <MobileSidebar />
        </div>
      </div>
    </>
  );
}
