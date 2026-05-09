'use client';

import * as React from 'react';
import { useTheme } from 'next-themes';
import { Computer, ExternalLink, Moon, Sun } from 'lucide-react';
import { Button } from '@workspace/ui/components/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@workspace/ui/components/dropdown-menu';
import Link from 'next/link';

import { siteConfig } from '@/app/siteConfig';
import { DashboardAvatar } from '@workspace/ui/components/dashboard-avatar';

export function DropdownUserProfile() {
  const [mounted, setMounted] = React.useState(false);
  const { theme, setTheme } = useTheme();

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            variant='ghost'
            size='icon-lg'
            aria-label='Open settings'
            className='rounded-full hover:bg-muted data-open:bg-muted'
          />
        }
      >
        <DashboardAvatar seed='Anurag Roy' className='size-8' />
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end'>
        <DropdownMenuGroup>
          <DropdownMenuLabel>hello@anuragroy.dev</DropdownMenuLabel>
        </DropdownMenuGroup>

        <DropdownMenuGroup>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>Theme</DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
              <DropdownMenuRadioGroup
                value={theme}
                onValueChange={(value) => {
                  setTheme(value);
                }}
              >
                <DropdownMenuRadioItem value='light' aria-label='Switch to Light Mode'>
                  <Sun className='size-4 shrink-0' aria-hidden='true' />
                  Light
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value='dark' aria-label='Switch to Dark Mode'>
                  <Moon className='size-4 shrink-0' aria-hidden='true' />
                  Dark
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value='system' aria-label='Switch to System Mode'>
                  <Computer className='size-4 shrink-0' aria-hidden='true' />
                  System
                </DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuSubContent>
          </DropdownMenuSub>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        <DropdownMenuGroup>
          <DropdownMenuItem>
            Changelog
            <ExternalLink className='ml-1 size-3.5 shrink-0 text-muted-foreground' aria-hidden='true' />
          </DropdownMenuItem>
          <DropdownMenuItem>
            Documentation
            <ExternalLink className='ml-1 size-3.5 shrink-0 text-muted-foreground' aria-hidden='true' />
          </DropdownMenuItem>
          <DropdownMenuItem>
            Join Slack community
            <ExternalLink className='ml-1 size-3.5 shrink-0 text-muted-foreground' aria-hidden='true' />
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        <DropdownMenuGroup>
          <DropdownMenuItem>
            <Link href={siteConfig.baseLinks.login} className='w-full'>
              Sign out
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
