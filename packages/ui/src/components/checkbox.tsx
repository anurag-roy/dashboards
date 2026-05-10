'use client';

import { Checkbox as CheckboxPrimitive } from '@base-ui/react/checkbox';

import { cn } from '@workspace/ui/lib/utils';

function Checkbox({ className, ...props }: CheckboxPrimitive.Root.Props) {
  return (
    <CheckboxPrimitive.Root
      data-slot='checkbox'
      className={cn(
        'peer relative flex size-4 shrink-0 items-center justify-center rounded-[5px] border border-transparent bg-input/90 accent-primary transition-shadow outline-none group-has-disabled/field:opacity-50 after:absolute after:-inset-x-3 after:-inset-y-2 focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 aria-invalid:aria-checked:border-primary data-indeterminate:border-primary data-indeterminate:bg-primary data-indeterminate:text-primary-foreground dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 dark:data-indeterminate:bg-primary data-checked:border-primary data-checked:bg-primary data-checked:text-primary-foreground dark:data-checked:bg-primary',
        className
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator
        data-slot='checkbox-indicator'
        keepMounted
        render={(indicatorProps, state) => (
          <span
            {...indicatorProps}
            className={cn('flex size-full items-center justify-center text-current [&>svg]:size-3.5')}
          >
            {state.indeterminate ? (
              <svg
                aria-hidden='true'
                viewBox='0 0 16 16'
                fill='none'
                xmlns='http://www.w3.org/2000/svg'
                className='size-3.5'
              >
                <line stroke='currentColor' strokeLinecap='round' strokeWidth='2' x1='4' x2='12' y1='8' y2='8' />
              </svg>
            ) : state.checked ? (
              <svg
                aria-hidden='true'
                viewBox='0 0 16 16'
                fill='none'
                xmlns='http://www.w3.org/2000/svg'
                className='size-3.5'
              >
                <path
                  d='M11.2 5.6L6.8 10 4.8 8'
                  stroke='currentColor'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth='2'
                />
              </svg>
            ) : null}
          </span>
        )}
      >
        {null}
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  );
}

export { Checkbox };
