'use client';

import * as Popover from '@radix-ui/react-popover';
import * as React from 'react';

import { cn, focusRing } from '@/lib/utils';

const shortcutStyles = cn(
  'hidden h-6 items-center justify-center rounded-xl bg-secondary px-2.5 font-mono text-xs text-muted-foreground ring-1 ring-border transition select-none ring-inset sm:flex'
);

interface CommandBarProps extends React.PropsWithChildren {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  defaultOpen?: boolean;
  disableAutoFocus?: boolean;
}

const CommandBar = ({
  open = false,
  onOpenChange,
  defaultOpen = false,
  disableAutoFocus = true,
  children,
}: CommandBarProps) => {
  return (
    <Popover.Root open={open} onOpenChange={onOpenChange} defaultOpen={defaultOpen}>
      <Popover.Anchor className={cn('fixed inset-x-0 bottom-8 mx-auto flex w-fit items-center')} />
      <Popover.Portal>
        <Popover.Content
          side='top'
          sideOffset={0}
          onOpenAutoFocus={(e) => {
            if (disableAutoFocus) {
              e.preventDefault();
            }
          }}
          className={cn(
            'z-50',
            'data-[state=closed]:animate-out data-[state=closed]:fade-out-0',
            'data-[state=open]:animate-in data-[state=open]:fade-in-0'
          )}
        >
          {children}
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
};
CommandBar.displayName = 'CommandBar';

const CommandBarValue = React.forwardRef<HTMLDivElement, React.ComponentPropsWithoutRef<'div'>>(
  ({ className, ...props }, ref) => {
    return (
      <div ref={ref} className={cn('px-3 py-2.5 text-sm text-popover-foreground tabular-nums', className)} {...props} />
    );
  }
);
CommandBarValue.displayName = 'CommandBar.Value';

const CommandBarBar = React.forwardRef<HTMLDivElement, React.ComponentPropsWithoutRef<'div'>>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'relative flex items-center rounded-3xl border border-border bg-card px-1.5 py-1 shadow-lg ring-1 ring-foreground/5 dark:ring-foreground/10',
          className
        )}
        {...props}
      />
    );
  }
);
CommandBarBar.displayName = 'CommandBarBar';

const CommandBarSeperator = React.forwardRef<HTMLDivElement, Omit<React.ComponentPropsWithoutRef<'div'>, 'children'>>(
  ({ className, ...props }, ref) => {
    return <div ref={ref} className={cn('h-4 w-px bg-border', className)} {...props} />;
  }
);
CommandBarSeperator.displayName = 'CommandBar.Seperator';

interface CommandProps extends Omit<React.ComponentPropsWithoutRef<'button'>, 'children' | 'onClick'> {
  action: () => void | Promise<void>;
  label: string;
  shortcut: { shortcut: string; label?: string };
}

const CommandBarCommand = React.forwardRef<HTMLButtonElement, CommandProps>(
  ({ className, type = 'button', label, action, shortcut, disabled, ...props }: CommandProps, ref) => {
    React.useEffect(() => {
      const handleKeyDown = (event: KeyboardEvent) => {
        if (event.key === shortcut.shortcut) {
          event.preventDefault();
          event.stopPropagation();
          action();
        }
      };

      if (!disabled) {
        document.addEventListener('keydown', handleKeyDown);
      }

      return () => {
        document.removeEventListener('keydown', handleKeyDown);
      };
    }, [action, shortcut, disabled]);

    return (
      <span
        className={cn(
          'flex items-center gap-x-2 rounded-2xl bg-card p-1.5 text-base font-medium text-foreground transition outline-none focus:z-10 sm:text-sm',
          'sm:last-of-type:-mr-1',
          className
        )}
      >
        <button
          ref={ref}
          type={type}
          onClick={action}
          disabled={disabled}
          className={cn(
            'flex items-center gap-x-2 rounded-xl px-2 py-1.5 hover:bg-muted',
            'focus-visible:bg-muted',
            'disabled:text-muted-foreground',
            focusRing
          )}
          {...props}
        >
          <span>{label}</span>
          <span className={shortcutStyles}>
            {shortcut.label ? shortcut.label.toUpperCase() : shortcut.shortcut.toUpperCase()}
          </span>
        </button>
      </span>
    );
  }
);
CommandBarCommand.displayName = 'CommandBar.Command';

export { CommandBar, CommandBarBar, CommandBarCommand, CommandBarSeperator, CommandBarValue };
