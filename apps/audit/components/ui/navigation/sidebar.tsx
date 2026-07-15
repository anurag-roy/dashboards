'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTheme } from 'next-themes';
import { BarChart3, Computer, Compass, ExternalLink, Menu, Moon, Settings2, Sun, Table2 } from 'lucide-react';
import { Button } from '@workspace/ui/components/button';
import {
  Sidebar as SidebarPrimitive,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  useSidebar,
} from '@workspace/ui/components/sidebar';

import { AppLogo } from '@/components/app-logo';
import { siteConfig } from '@/app/siteConfig';
import { DashboardAvatar } from '@workspace/ui/components/dashboard-avatar';
import { UserProfileDesktop } from './user-profile';

const workspace = {
  name: 'Audit',
} as const;

const navigation = [
  { name: 'Reports', href: siteConfig.baseLinks.reports, icon: BarChart3 },
  { name: 'Transactions', href: siteConfig.baseLinks.transactions, icon: Table2 },
  { name: 'Settings', href: siteConfig.baseLinks.settings.audit, icon: Settings2 },
] as const;

const setupNavigation = [
  { name: 'Onboarding', href: siteConfig.baseLinks.onboarding.products, icon: Compass },
] as const;

const mobileAccountItems = [
  { name: 'Changelog', icon: ExternalLink },
  { name: 'Documentation', icon: ExternalLink },
  { name: 'Join Slack community', icon: ExternalLink },
] as const;

type MobileSidebarUtilityGroupsProps = {
  isMobile: boolean;
  onItemClick: () => void;
};

function MobileSidebarUtilityGroups({ isMobile, onItemClick }: MobileSidebarUtilityGroupsProps) {
  const [mounted, setMounted] = React.useState(false);
  const { theme, setTheme } = useTheme();

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!isMobile) {
    return null;
  }

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Account</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              type='button'
              isActive={mounted && theme === 'light'}
              onClick={() => {
                setTheme('light');
              }}
            >
              <Sun className='size-4 shrink-0' aria-hidden='true' />
              <span>Light theme</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              type='button'
              isActive={mounted && theme === 'dark'}
              onClick={() => {
                setTheme('dark');
              }}
            >
              <Moon className='size-4 shrink-0' aria-hidden='true' />
              <span>Dark theme</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              type='button'
              isActive={mounted && theme === 'system'}
              onClick={() => {
                setTheme('system');
              }}
            >
              <Computer className='size-4 shrink-0' aria-hidden='true' />
              <span>System theme</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          {mobileAccountItems.map((item) => (
            <SidebarMenuItem key={item.name}>
              <SidebarMenuButton type='button' onClick={onItemClick}>
                <item.icon className='size-4 shrink-0 text-muted-foreground' aria-hidden='true' />
                <span>{item.name}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
          <SidebarMenuItem>
            <SidebarMenuButton type='button' onClick={onItemClick}>
              <span>Sign out</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}

function SidebarNavContent() {
  const pathname = usePathname();
  const { isMobile, setOpenMobile } = useSidebar();

  const closeMobileMenu = React.useCallback(() => {
    if (isMobile) {
      setOpenMobile(false);
    }
  }, [isMobile, setOpenMobile]);

  const isActive = React.useCallback(
    (itemHref: string) => {
      if (itemHref === siteConfig.baseLinks.settings.audit) {
        return pathname.startsWith('/settings');
      }
      if (itemHref === siteConfig.baseLinks.onboarding.products) {
        return pathname.startsWith('/onboarding');
      }
      return pathname === itemHref || pathname.startsWith(`${itemHref}/`);
    },
    [pathname]
  );

  return (
    <>
      <SidebarGroup>
        <SidebarGroupLabel>Platform</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            {navigation.map((item) => (
              <SidebarMenuItem key={item.name}>
                <SidebarMenuButton
                  isActive={isActive(item.href)}
                  tooltip={item.name}
                  render={<Link href={item.href} onClick={closeMobileMenu} />}
                >
                  <item.icon className='size-4 shrink-0' aria-hidden='true' />
                  <span>{item.name}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>

      <SidebarGroup>
        <SidebarGroupLabel>Setup</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            {setupNavigation.map((item) => (
              <SidebarMenuItem key={item.name}>
                <SidebarMenuButton
                  isActive={isActive(item.href)}
                  tooltip={item.name}
                  render={<Link href={item.href} onClick={closeMobileMenu} />}
                >
                  <item.icon className='size-4 shrink-0' aria-hidden='true' />
                  <span>{item.name}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>

      <MobileSidebarUtilityGroups isMobile={isMobile} onItemClick={closeMobileMenu} />
    </>
  );
}

export function Sidebar() {
  return (
    <SidebarPrimitive collapsible='icon'>
      <SidebarHeader className='border-b border-sidebar-border/70 pb-3'>
        <div className='hidden md:block'>
          <div className='flex items-center gap-3 rounded-2xl px-3 py-2.5 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-0'>
            <AppLogo iconClassName='size-8' />
            <div className='min-w-0 group-data-[collapsible=icon]:hidden'>
              <p className='truncate text-lg font-bold text-foreground'>{workspace.name}</p>
            </div>
          </div>
        </div>
        <div className='px-1 md:hidden'>
          <div className='flex items-center gap-3 rounded-2xl px-3 py-2.5'>
            <AppLogo iconClassName='size-8' />
            <div className='min-w-0'>
              <p className='truncate text-lg font-bold text-foreground'>{workspace.name}</p>
            </div>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarNavContent />
      </SidebarContent>
      <SidebarFooter>
        <div className='md:block'>
          <div className='hidden md:block'>
            <UserProfileDesktop />
          </div>
          <div className='px-3 py-2 md:hidden'>
            <div className='flex items-center gap-3 rounded-2xl px-2 py-1'>
              <DashboardAvatar seed='Anurag Roy' className='size-8' />
              <div className='min-w-0'>
                <p className='truncate text-sm font-medium text-foreground'>Anurag Roy</p>
                <p className='truncate text-xs text-muted-foreground'>hello@anuragroy.dev</p>
              </div>
            </div>
          </div>
        </div>
      </SidebarFooter>
      <SidebarRail />
    </SidebarPrimitive>
  );
}

export function MobileSidebarHeader() {
  const { toggleSidebar } = useSidebar();

  return (
    <div className='sticky top-0 z-40 flex h-16 shrink-0 items-center justify-between border-b border-border bg-background/95 px-3 backdrop-blur supports-[backdrop-filter]:bg-background/80 sm:gap-x-6 sm:px-5 md:hidden'>
      <div className='flex min-w-0 items-center gap-2.5'>
        <AppLogo iconClassName='size-7' />
        <div className='min-w-0'>
          <p className='truncate text-lg font-bold text-foreground'>{workspace.name}</p>
        </div>
      </div>
      <Button
        type='button'
        variant='ghost'
        aria-label='open sidebar'
        className='group flex items-center rounded-2xl p-2.5 text-sm font-medium hover:bg-muted'
        onClick={toggleSidebar}
      >
        <Menu className='size-6 shrink-0 sm:size-5' aria-hidden='true' />
      </Button>
    </div>
  );
}
