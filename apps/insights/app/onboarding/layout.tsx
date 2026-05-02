'use client';

import { usePathname, useRouter } from 'next/navigation';
import { Button } from '@workspace/ui/components/button';

import { siteConfig } from '@/app/siteConfig';

type Step = {
  name: string;
  href: string;
};

const steps: Step[] = [
  { name: 'Product selection', href: siteConfig.baseLinks.onboarding.products },
  { name: 'Employees', href: siteConfig.baseLinks.onboarding.employees },
  { name: 'Infrastructure', href: siteConfig.baseLinks.onboarding.infrastructure },
];

function StepProgress({ steps }: { steps: Step[] }) {
  const pathname = usePathname();
  const currentStepIndex = Math.max(
    steps.findIndex((step) => pathname.startsWith(step.href)),
    0
  );

  return (
    <div aria-label='Onboarding progress'>
      <ol className='flex w-32 flex-nowrap gap-1 md:w-fit'>
        {steps.map((step, index) => (
          <li
            key={step.name}
            className={
              index <= currentStepIndex ? 'h-1 w-12 rounded-full bg-primary' : 'h-1 w-12 rounded-full bg-muted'
            }
          >
            <span className='sr-only'>
              {step.name} {index < currentStepIndex ? 'completed' : index === currentStepIndex ? 'current' : 'upcoming'}
            </span>
          </li>
        ))}
      </ol>
    </div>
  );
}

export default function OnboardingLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter();

  return (
    <>
      <header className='fixed inset-x-0 top-0 z-50 flex h-16 items-center justify-between gap-2 border-b border-border bg-background/95 px-3 backdrop-blur sm:px-4 md:grid md:grid-cols-[1fr_auto_1fr] md:items-center md:justify-start md:px-6 supports-[backdrop-filter]:bg-background/80'>
        <div className='hidden min-w-0 md:block' aria-hidden='true' />
        <div className='flex justify-start md:justify-center'>
          <StepProgress steps={steps} />
        </div>
        <div className='flex min-w-0 justify-end'>
          <Button
            variant='ghost'
            size='sm'
            className='shrink-0'
            type='button'
            onClick={() => {
              router.push(siteConfig.baseLinks.reports);
            }}
          >
            Skip to dashboard
          </Button>
        </div>
      </header>

      <main className='mx-auto mt-24 mb-12 w-full max-w-2xl px-4 sm:px-6'>{children}</main>
    </>
  );
}
