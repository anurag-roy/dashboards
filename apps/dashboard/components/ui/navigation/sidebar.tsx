'use client';

import { siteConfig } from '@/app/siteConfig';
import { Button } from '@workspace/ui/components/button';
import { Computer, ExternalLink, Home, Link2, ListChecks, Menu, Moon, Settings, Sun } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import * as React from 'react';
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
  useSidebar,
} from '@workspace/ui/components/sidebar';
import { useTheme } from 'next-themes';

import { DashboardAvatar } from '@/components/dashboard-avatar';
import { UserProfileDesktop } from './user-profile';
import { WorkspacesDropdownDesktop } from './sidebar-workspaces-dropdown';

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

const workspaceSummary = {
  name: 'Pulse analytics',
  role: 'Member',
  seed: 'pulse-analytics',
} as const;

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
    <>
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
    </>
  );
}

function SidebarNavContent() {
  const pathname = usePathname();
  const { isMobile, setOpenMobile } = useSidebar();

  const handleItemClick = () => {
    if (isMobile) {
      setOpenMobile(false);
    }
  };

  const isActive = (itemHref: string) => {
    if (itemHref === siteConfig.baseLinks.settings.general) {
      return pathname.startsWith('/settings');
    }
    return pathname === itemHref || pathname.startsWith(itemHref);
  };

  return (
    <>
      <SidebarGroup>
        <SidebarGroupContent>
          <SidebarMenu>
            {navigation.map((item) => (
              <SidebarMenuItem key={item.name}>
                <SidebarMenuButton
                  isActive={isActive(item.href)}
                  render={<Link href={item.href} onClick={handleItemClick} />}
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
        <SidebarGroupLabel>Shortcuts</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            {shortcuts.map((item) => (
              <SidebarMenuItem key={item.name}>
                <SidebarMenuButton render={<Link href={item.href} onClick={handleItemClick} />}>
                  <item.icon className='size-4 shrink-0' aria-hidden='true' />
                  <span>{item.name}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
      <MobileSidebarUtilityGroups isMobile={isMobile} onItemClick={handleItemClick} />
    </>
  );
}

export function Sidebar() {
  return (
    <SidebarPrimitive>
      <SidebarHeader className='border-b border-sidebar-border/70 pb-3'>
        <div className='hidden md:block'>
          <WorkspacesDropdownDesktop />
        </div>
        <div className='px-1 md:hidden'>
          <div className='flex items-center gap-3 rounded-2xl px-3 py-2.5'>
            <DashboardAvatar seed={workspaceSummary.seed} square className='size-8 rounded-2xl border-border/70' />
            <div className='min-w-0'>
              <p className='truncate text-sm font-medium text-foreground'>{workspaceSummary.name}</p>
              <p className='truncate text-xs text-muted-foreground'>{workspaceSummary.role}</p>
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
    </SidebarPrimitive>
  );
}

export function MobileSidebarHeader() {
  const { toggleSidebar } = useSidebar();

  return (
    <div className='sticky top-0 z-40 flex h-16 shrink-0 items-center justify-between border-b border-border bg-background/95 px-3 backdrop-blur sm:gap-x-6 sm:px-5 md:hidden supports-[backdrop-filter]:bg-background/80'>
      <div className='flex min-w-0 items-center gap-2.5'>
        <DashboardAvatar seed={workspaceSummary.seed} square className='size-7 rounded-2xl border-border/70' />
        <div className='min-w-0'>
          <p className='truncate text-sm font-medium text-foreground'>{workspaceSummary.name}</p>
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
