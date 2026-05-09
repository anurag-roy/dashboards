'use client';

import { useState } from 'react';
import { CheckCircle, XCircle } from 'lucide-react';
import { Button } from '@workspace/ui/components/button';

import { cn } from '@/lib/utils';

type ButtonTicketGenerationProps = Omit<React.ComponentPropsWithoutRef<typeof Button>, 'onClick'> & {
  initialState: boolean;
};

export function ButtonTicketGeneration({ initialState, className, ...props }: ButtonTicketGenerationProps) {
  const [enabled, setEnabled] = useState(initialState);

  return (
    <Button
      type='button'
      variant='outline'
      size='sm'
      className={cn('gap-1.5 border-border bg-background font-medium text-foreground hover:bg-muted', className)}
      onClick={() => setEnabled((v) => !v)}
      {...props}
    >
      {enabled ? (
        <CheckCircle className='size-4 shrink-0 text-emerald-600 dark:text-emerald-500' aria-hidden='true' />
      ) : (
        <XCircle className='size-4 shrink-0 text-muted-foreground' aria-hidden='true' />
      )}
      {enabled ? 'On' : 'Off'}
    </Button>
  );
}
