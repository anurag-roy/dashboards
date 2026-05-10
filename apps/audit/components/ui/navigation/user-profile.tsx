'use client';

import { MoreHorizontal } from 'lucide-react';
import { Button } from '@workspace/ui/components/button';

import { cn, focusRing } from '@/lib/utils';
import { DashboardAvatar } from '@workspace/ui/components/dashboard-avatar';
import { DropdownUserProfile } from './dropdown-user-profile';

const user = {
  name: 'Anurag Roy',
  email: 'hello@anuragroy.dev',
};

export function UserProfileDesktop() {
  return (
    <DropdownUserProfile>
      <Button
        aria-label='User settings'
        variant='ghost'
        className={cn(
          focusRing,
          'group flex h-auto w-full items-center justify-between overflow-hidden rounded-2xl px-3 py-3 text-sm font-medium text-foreground group-data-[collapsible=icon]:size-8 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:p-0 hover:bg-muted data-open:bg-muted'
        )}
      >
        <div className='flex items-center gap-3'>
          <DashboardAvatar seed={user.name} />
          <span className='group-data-[collapsible=icon]:hidden'>{user.name}</span>
        </div>
        <MoreHorizontal
          className='size-4 shrink-0 text-muted-foreground group-hover:text-foreground group-data-[collapsible=icon]:hidden'
          aria-hidden='true'
        />
      </Button>
    </DropdownUserProfile>
  );
}
