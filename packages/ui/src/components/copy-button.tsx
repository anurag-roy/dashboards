'use client';

import * as React from 'react';
import { Check, Copy } from 'lucide-react';

import { Button } from '@workspace/ui/components/button';
import { cn } from '@workspace/ui/lib/utils';

interface CopyButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  value: string;
}

export function CopyButton({ value, className, ...props }: CopyButtonProps) {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Button
      variant='ghost'
      size='icon'
      className={cn('size-8 text-muted-foreground hover:text-foreground', className)}
      onClick={handleCopy}
      {...props}
    >
      {copied ? <Check className='size-4 text-emerald-500' /> : <Copy className='size-4' />}
      <span className='sr-only'>Copy to clipboard</span>
    </Button>
  );
}
