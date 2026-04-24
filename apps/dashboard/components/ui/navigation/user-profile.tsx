'use client';

import { cn, focusRing } from '@/lib/utils';
import { DashboardAvatar } from '@/components/dashboard-avatar';
import { Button } from '@workspace/ui/components/button';
import { MoreHorizontal } from 'lucide-react';

import { DropdownUserProfile } from './dropdown-user-profile';

export function UserProfileDesktop() {
  return (
    <DropdownUserProfile>
      <Button
        aria-label='User settings'
        variant='ghost'
        className={cn(
          focusRing,
          'group flex h-auto w-full items-center justify-between rounded-2xl px-3 py-3 text-sm font-medium text-foreground hover:bg-muted data-open:bg-muted'
        )}
      >
        <div className='flex items-center gap-3'>
          <DashboardAvatar seed='Anurag Roy' />
          <span>Anurag Roy</span>
        </div>
        <MoreHorizontal
          className='size-4 shrink-0 text-muted-foreground group-hover:text-foreground'
          aria-hidden='true'
        />
      </Button>
    </DropdownUserProfile>
  );
}

export function UserProfileMobile() {
  return (
    <DropdownUserProfile align='end'>
      <Button
        aria-label='User settings'
        variant='ghost'
        className='group flex items-center rounded-2xl p-1.5 text-sm font-medium text-foreground hover:bg-muted data-open:bg-muted'
      >
        <DashboardAvatar seed='Anurag Roy' className='size-7' />
      </Button>
    </DropdownUserProfile>
  );
}
