'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { BarChart3, Building2, Cloud } from 'lucide-react';
import { Button } from '@workspace/ui/components/button';
import { Card } from '@workspace/ui/components/card';
import { Input } from '@workspace/ui/components/input';
import { Label } from '@workspace/ui/components/label';

import { siteConfig } from '@/app/siteConfig';

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  return (
    <div className='flex min-h-dvh items-center justify-center p-4 sm:p-6'>
      <Card className='w-full max-w-md rounded-3xl border-border/70 p-6 sm:p-8'>
        <div className='space-y-6'>
          <div className='space-y-4'>
            <span className='inline-flex size-10 items-center justify-center rounded-2xl bg-primary/10 text-primary'>
              <BarChart3 className='size-5' aria-hidden='true' />
            </span>
            <div className='space-y-1'>
              <h1 className='text-2xl font-semibold text-foreground'>Log in to Insights</h1>
              <p className='text-sm text-muted-foreground'>
                Don&apos;t have an account?{' '}
                <Link href='#' className='text-primary hover:underline'>
                  Sign up
                </Link>
              </p>
            </div>
          </div>

          <div className='grid gap-2 sm:grid-cols-2'>
            <Button variant='secondary' className='gap-2'>
              <Cloud className='size-4' aria-hidden='true' />
              GitHub
            </Button>
            <Button variant='secondary' className='gap-2'>
              <Building2 className='size-4' aria-hidden='true' />
              Google
            </Button>
          </div>

          <div className='flex items-center gap-3 text-xs tracking-wide text-muted-foreground uppercase'>
            <span className='h-px flex-1 bg-border' />
            <span>or</span>
            <span className='h-px flex-1 bg-border' />
          </div>

          <form
            onSubmit={(event) => {
              event.preventDefault();
              if (loading) {
                return;
              }
              setLoading(true);
              window.setTimeout(() => {
                router.push(siteConfig.baseLinks.reports);
              }, 700);
            }}
            className='space-y-4'
          >
            <div className='space-y-2'>
              <Label htmlFor='email'>Email</Label>
              <Input id='email' type='email' autoComplete='email' placeholder='emily.ross@acme.com' required />
            </div>
            <div className='space-y-2'>
              <Label htmlFor='password'>Password</Label>
              <Input id='password' type='password' autoComplete='current-password' placeholder='Password' required />
            </div>
            <Button type='submit' className='w-full' disabled={loading}>
              {loading ? 'Signing in...' : 'Continue'}
            </Button>
          </form>

          <p className='text-sm text-muted-foreground'>
            Forgot your password?{' '}
            <Link href='#' className='text-primary hover:underline'>
              Reset password
            </Link>
          </p>
        </div>
      </Card>
    </div>
  );
}
