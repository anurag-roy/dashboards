import { siteConfig } from '@/app/siteConfig';
import { buttonVariants } from '@workspace/ui/components/button';
import { cn } from '@/lib/utils';
import { Database, MoveRight } from 'lucide-react';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className='flex h-screen flex-col items-center justify-center bg-background px-4'>
      <Link href={siteConfig.baseLinks.home} className='text-primary'>
        <span className='sr-only'>Home</span>
        <Database className='mt-6 h-10 w-10' aria-hidden='true' />
      </Link>
      <p className='mt-6 text-4xl font-semibold text-primary sm:text-5xl'>404</p>
      <h1 className='mt-4 text-2xl font-semibold text-foreground'>Page not found</h1>
      <p className='mt-2 text-center text-sm text-muted-foreground'>
        Sorry, we couldn’t find the page you’re looking for.
      </p>
      <Link
        href={siteConfig.baseLinks.overview}
        className={cn(buttonVariants({ variant: 'secondary' }), 'group mt-8 inline-flex gap-2')}
      >
        Go to the home page
        <MoveRight className='size-4 text-foreground' aria-hidden='true' />
      </Link>
    </div>
  );
}
