'use client';

import { cn, focusRing } from '@/lib/utils';
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
        <span className='flex items-center gap-3'>
          <span
            className='flex size-8 shrink-0 items-center justify-center rounded-full border border-border bg-background text-xs text-muted-foreground'
            aria-hidden='true'
          >
            ES
          </span>
          <span>Emma Stone</span>
        </span>
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
        <span
          className='flex size-7 shrink-0 items-center justify-center rounded-full border border-border bg-background text-xs text-muted-foreground'
          aria-hidden='true'
        >
          ES
        </span>
      </Button>
    </DropdownUserProfile>
  );
}
