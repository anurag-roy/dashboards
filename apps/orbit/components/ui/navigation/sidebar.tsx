'use client';

import { siteConfig } from '@/app/siteConfig';
import { Button } from '@workspace/ui/components/button';
import {
  Check,
  ChevronsUpDown,
  CircleDollarSign,
  Computer,
  ExternalLink,
  Gauge,
  Home,
  ListChecks,
  Menu,
  Moon,
  Rows3,
  Settings,
  Sun,
  UserPlus,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import * as React from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@workspace/ui/components/dropdown-menu';
import {
  Sidebar as SidebarPrimitive,
  SidebarContent,
  SidebarFooter,
  SidebarFooterTrigger,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@workspace/ui/components/sidebar';
import { Separator } from '@workspace/ui/components/separator';
import { useTheme } from 'next-themes';

import { AppLogo } from '@/components/app-logo';
import { DashboardAvatar } from '@workspace/ui/components/dashboard-avatar';
import { cn } from '@/lib/utils';
import { UserProfileDesktop } from './user-profile';

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
    icon: UserPlus,
  },
  {
    name: 'Workspace usage',
    href: '/settings/billing#billing-overview',
    icon: Gauge,
  },
  {
    name: 'Cost spend control',
    href: '/settings/billing#cost-spend-control',
    icon: CircleDollarSign,
  },
  {
    name: 'Overview – Rows written',
    href: '/overview#usage-overview',
    icon: Rows3,
  },
] as const;

type Workspace = {
  name: string;
  tier: string;
};

const workspaces: Workspace[] = [
  {
    name: 'Moon DB',
    tier: 'Pro workspace',
  },
  {
    name: 'Growth Lab',
    tier: 'Team workspace',
  },
  {
    name: 'Sandbox Ops',
    tier: 'Developer workspace',
  },
];

const mobileResourceItems = [
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
        <SidebarGroupLabel>Appearance</SidebarGroupLabel>
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
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
      <SidebarGroup>
        <SidebarGroupLabel>Resources</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            {mobileResourceItems.map((item) => (
              <SidebarMenuItem key={item.name}>
                <SidebarMenuButton type='button' onClick={onItemClick}>
                  <item.icon className='size-4 shrink-0 text-muted-foreground' aria-hidden='true' />
                  <span>{item.name}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
      <SidebarGroup>
        <SidebarGroupLabel>Account</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
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

function WorkspaceSwitcher({
  activeWorkspace,
  onWorkspaceChange,
}: {
  activeWorkspace: Workspace;
  onWorkspaceChange: (workspace: Workspace) => void;
}) {
  const { isMobile, setOpenMobile } = useSidebar();

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <SidebarMenuButton
                size='lg'
                className='data-open:bg-sidebar-accent data-open:text-sidebar-accent-foreground'
              />
            }
          >
            <DashboardAvatar seed={activeWorkspace.name} />
            <div className='grid min-w-0 flex-1 text-left text-sm leading-tight'>
              <span className='truncate font-medium'>{activeWorkspace.name}</span>
              <span className='truncate text-xs text-muted-foreground'>{activeWorkspace.tier}</span>
            </div>
            <ChevronsUpDown className='ml-auto text-muted-foreground' aria-hidden='true' />
          </DropdownMenuTrigger>
          <DropdownMenuContent align='start' side={isMobile ? 'bottom' : 'right'} sideOffset={6} className='min-w-64'>
            <DropdownMenuGroup>
              <DropdownMenuLabel>Workspaces</DropdownMenuLabel>
              {workspaces.map((workspace) => {
                const isActive = workspace.name === activeWorkspace.name;

                return (
                  <DropdownMenuItem
                    key={workspace.name}
                    onClick={() => {
                      onWorkspaceChange(workspace);
                      if (isMobile) {
                        setOpenMobile(false);
                      }
                    }}
                    className='gap-3'
                  >
                    <DashboardAvatar seed={workspace.name} className='size-7' />
                    <div className='min-w-0 flex-1'>
                      <p className='truncate text-sm font-medium text-foreground'>{workspace.name}</p>
                      <p className='truncate text-xs text-muted-foreground'>{workspace.tier}</p>
                    </div>
                    <Check className={cn('ml-auto', isActive ? 'opacity-100' : 'opacity-0')} aria-hidden='true' />
                  </DropdownMenuItem>
                );
              })}
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
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
                  tooltip={item.name}
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
                <SidebarMenuButton tooltip={item.name} render={<Link href={item.href} onClick={handleItemClick} />}>
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

function BrandHeader({ compact = false }: { compact?: boolean }) {
  return (
    <div className='flex min-w-0 items-center gap-3 rounded-2xl px-3 py-2 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-0'>
      <AppLogo iconClassName={cn(compact ? 'size-7' : 'size-8', 'group-data-[collapsible=icon]:p-0.5')} />
      <div className='min-w-0 group-data-[collapsible=icon]:hidden'>
        <p className='truncate text-lg font-bold text-foreground'>Orbit</p>
      </div>
    </div>
  );
}

export function Sidebar() {
  const [activeWorkspace, setActiveWorkspace] = React.useState(workspaces[0]);

  return (
    <SidebarPrimitive collapsible='icon'>
      <SidebarHeader className='border-b border-sidebar-border/70 pb-2'>
        <div className='hidden md:block'>
          <BrandHeader />
        </div>
        <div className='px-1 md:hidden'>
          <BrandHeader />
        </div>
        {activeWorkspace && (
          <div className='px-1 group-data-[collapsible=icon]:px-0'>
            <Separator className='my-1 bg-sidebar-border/70' />
            <WorkspaceSwitcher activeWorkspace={activeWorkspace} onWorkspaceChange={setActiveWorkspace} />
          </div>
        )}
      </SidebarHeader>
      <SidebarContent>
        <SidebarNavContent />
      </SidebarContent>
      <SidebarFooter>
        <SidebarFooterTrigger />
        <Separator className='hidden bg-sidebar-border/70 md:block' />
        <div className='hidden h-[58px] items-center group-data-[collapsible=icon]:justify-center md:flex'>
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
      </SidebarFooter>
    </SidebarPrimitive>
  );
}

export function MobileSidebarHeader() {
  const { toggleSidebar } = useSidebar();

  return (
    <div className='sticky top-0 z-40 flex h-16 shrink-0 items-center justify-between border-b border-border bg-background/95 px-3 backdrop-blur supports-backdrop-filter:bg-background/80 sm:gap-x-6 sm:px-5 md:hidden'>
      <BrandHeader compact />
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
