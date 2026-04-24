import { cn, focusInput, hasErrorInput } from '@/lib/utils';
import { Search } from 'lucide-react';
import * as React from 'react';
import { type VariantProps, tv } from 'tailwind-variants';

const inputStyles = tv({
  base: [
    'relative block h-9 w-full min-w-0 appearance-none rounded-3xl border border-transparent bg-input/50 px-3 py-1 text-base text-foreground outline-none transition-[color,box-shadow,background-color] md:text-sm',
    'border-border/80',
    'placeholder:text-muted-foreground',
    'disabled:border-border disabled:bg-muted disabled:text-muted-foreground',
    'dark:border-border',
    ...focusInput,
    '[&::--webkit-search-cancel-button]:hidden [&::-webkit-search-cancel-button]:hidden [&::-webkit-search-decoration]:hidden',
  ],
  variants: {
    hasError: {
      true: hasErrorInput.join(' '),
    },
    enableStepper: {
      true: '[appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none',
    },
  },
});

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement>, VariantProps<typeof inputStyles> {
  inputClassName?: string;
}

const Searchbar = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, inputClassName, hasError, enableStepper, type = 'search', ...props }: InputProps, forwardedRef) => {
    return (
      <div className={cn('relative w-full', className)}>
        <input
          ref={forwardedRef}
          type={type}
          className={cn(inputStyles({ hasError, enableStepper }), 'pl-9', inputClassName)}
          {...props}
        />
        <div className='pointer-events-none absolute bottom-0 left-3 flex h-full items-center justify-center text-muted-foreground'>
          <Search className='size-[1.125rem] shrink-0' aria-hidden='true' />
        </div>
      </div>
    );
  }
);

Searchbar.displayName = 'Searchbar';

export { Searchbar };
