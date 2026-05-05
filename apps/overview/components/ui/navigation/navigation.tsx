'use client';

import * as React from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useTheme } from 'next-themes';
import { Computer, ExternalLink, HeadphonesIcon, Menu, Moon, RotateCcw, Sun, Users, Workflow, X } from 'lucide-react';
import Link from 'next/link';

import { Button } from '@workspace/ui/components/button';
import { Separator } from '@workspace/ui/components/separator';
import { Sheet, SheetContent, SheetClose } from '@workspace/ui/components/sheet';
import { Tabs, TabsList, TabsTrigger } from '@workspace/ui/components/tabs';

import { siteConfig } from '@/app/siteConfig';
import { DashboardAvatar } from '@workspace/ui/components/dashboard-avatar';
import { Logo } from './logo';
import { Notifications } from './notifications';
import { DropdownUserProfile } from './user-profile';

const navItems = [
  { value: '/support', label: 'Support', icon: HeadphonesIcon },
  { value: '/retention', label: 'Retention', icon: RotateCcw },
  { value: '/workflow', label: 'Workflow', icon: Workflow },
  { value: '/agents', label: 'Agents', icon: Users },
] as const;

function MobileSheet({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const pathname = usePathname();
  const [mounted, setMounted] = React.useState(false);
  const { theme, setTheme } = useTheme();

  React.useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side='right' showCloseButton={false} className='w-full sm:max-w-sm'>
        <div className='flex items-center justify-between p-4 pb-0'>
          <Logo className='h-5' />
          <SheetClose render={<Button variant='ghost' size='icon-sm' className='rounded-full' />}>
            <X className='size-5' />
            <span className='sr-only'>Close</span>
          </SheetClose>
        </div>

        <div className='flex items-center gap-3 px-4 pt-2 pb-1'>
          <DashboardAvatar seed='Anurag Roy' className='size-10' />
          <div className='min-w-0 flex-1'>
            <p className='text-sm font-medium text-foreground'>Anurag Roy</p>
            <p className='truncate text-xs text-muted-foreground'>hello@anuragroy.dev</p>
          </div>
        </div>

        <Separator className='mx-4 mt-2' />

        <nav className='flex flex-col gap-1 p-4'>
          <p className='mb-2 px-3 text-xs font-medium tracking-wider text-muted-foreground uppercase'>Navigation</p>
          {navItems.map((item) => (
            <Link
              key={item.value}
              href={item.value}
              onClick={() => onOpenChange(false)}
              className={`flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-medium transition ${
                pathname === item.value
                  ? 'bg-muted text-foreground'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              }`}
            >
              <item.icon className='size-4 shrink-0' aria-hidden='true' />
              {item.label}
            </Link>
          ))}
        </nav>

        <Separator className='mx-4' />

        {mounted && (
          <div className='flex flex-col gap-1 p-4'>
            <p className='mb-2 px-3 text-xs font-medium tracking-wider text-muted-foreground uppercase'>Theme</p>
            {(
              [
                { value: 'light', label: 'Light', icon: Sun },
                { value: 'dark', label: 'Dark', icon: Moon },
                { value: 'system', label: 'System', icon: Computer },
              ] as const
            ).map((item) => (
              <button
                key={item.value}
                type='button'
                onClick={() => setTheme(item.value)}
                className={`flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-medium transition ${
                  theme === item.value
                    ? 'bg-muted text-foreground'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                }`}
              >
                <item.icon className='size-4 shrink-0' aria-hidden='true' />
                {item.label}
              </button>
            ))}
          </div>
        )}

        <Separator className='mx-4' />

        <div className='flex flex-col gap-1 p-4'>
          <p className='mb-2 px-3 text-xs font-medium tracking-wider text-muted-foreground uppercase'>Account</p>
          {[{ label: 'Changelog' }, { label: 'Documentation' }, { label: 'Join Slack community' }].map((item) => (
            <a
              key={item.label}
              href='#'
              className='flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-medium text-muted-foreground transition hover:bg-muted hover:text-foreground'
            >
              {item.label}
              <ExternalLink className='size-3.5 shrink-0' aria-hidden='true' />
            </a>
          ))}
          <Link
            href={siteConfig.baseLinks.login}
            onClick={() => onOpenChange(false)}
            className='flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-medium text-muted-foreground transition hover:bg-muted hover:text-foreground'
          >
            Sign out
          </Link>
        </div>
      </SheetContent>
    </Sheet>
  );
}

export function Navigation() {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const activeTab = navItems.find((item) => pathname === item.value)?.value ?? navItems[0].value;

  return (
    <div className='sticky top-0 z-30 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80'>
      <div className='mx-auto flex max-w-7xl items-center justify-between px-4 pt-3 pb-3 sm:px-6 md:pb-0'>
        <Logo className='h-6' />

        {/* Desktop header actions */}
        <div className='hidden items-center gap-1 md:flex'>
          <Notifications />
          <DropdownUserProfile />
        </div>

        {/* Mobile hamburger */}
        <Button
          type='button'
          variant='ghost'
          aria-label='Open menu'
          className='flex items-center rounded-2xl p-2.5 md:hidden'
          onClick={() => setMobileOpen(true)}
        >
          <Menu className='size-5 shrink-0' aria-hidden='true' />
        </Button>
        <MobileSheet open={mobileOpen} onOpenChange={setMobileOpen} />
      </div>

      {/* Desktop tab navigation */}
      <div className='hidden md:block'>
        <Tabs
          value={activeTab}
          onValueChange={(value) => {
            router.push(value);
          }}
          className='mt-3'
        >
          <div className='mx-auto max-w-7xl px-4 sm:px-6'>
            <TabsList variant='line'>
              {navItems.map((item) => (
                <TabsTrigger key={item.value} value={item.value}>
                  {item.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>
        </Tabs>
      </div>
    </div>
  );
}
