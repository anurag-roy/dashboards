'use client';

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
import { Computer, ExternalLink, Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import * as React from 'react';

export type DropdownUserProfileProps = {
  children: React.ReactNode;
  align?: 'center' | 'start' | 'end';
};

export function DropdownUserProfile({ children, align = 'start' }: DropdownUserProfileProps) {
  const [mounted, setMounted] = React.useState(false);
  const { theme, setTheme } = useTheme();

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className='inline-flex'>{children}</div>;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          React.isValidElement(children) ? (children as React.ReactElement) : <Button type='button'>{children}</Button>
        }
      />
      <DropdownMenuContent align={align}>
        <DropdownMenuGroup>
          <DropdownMenuLabel>hello@anuragroy.dev</DropdownMenuLabel>
        </DropdownMenuGroup>
        <div className='sm:hidden'>
          <DropdownMenuGroup>
            <DropdownMenuLabel>Theme</DropdownMenuLabel>
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
          </DropdownMenuGroup>
        </div>
        <div className='hidden sm:block'>
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
        </div>
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
          <DropdownMenuItem>Sign out</DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
