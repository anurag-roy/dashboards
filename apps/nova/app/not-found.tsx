import Link from 'next/link';
import { Cpu, MoveRight } from 'lucide-react';
import { buttonVariants } from '@workspace/ui/components/button';
import { cn } from '@workspace/ui/lib/utils';

import { siteConfig } from './siteConfig';

export default function NotFound() {
  return (
    <div className='flex h-screen flex-col items-center justify-center bg-background px-4 text-center'>
      <Link
        href={siteConfig.baseLinks.overview}
        className='inline-flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary'
      >
        <span className='sr-only'>Go to Nova home page</span>
        <Cpu className='size-5' aria-hidden='true' />
      </Link>

      <p className='mt-6 text-5xl font-semibold text-primary'>404</p>
      <h1 className='mt-4 text-2xl font-semibold text-foreground'>Page not found</h1>
      <p className='mt-2 text-sm text-muted-foreground'>
        Sorry, we couldn&apos;t find the page you&apos;re looking for.
      </p>

      <Link href={siteConfig.baseLinks.overview} className={cn(buttonVariants({ variant: 'secondary' }), 'mt-8 gap-2')}>
        Go to the home page
        <MoveRight className='size-4' aria-hidden='true' />
      </Link>
    </div>
  );
}
