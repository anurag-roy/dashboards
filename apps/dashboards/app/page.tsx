import Image from 'next/image';
import { ArrowDownIcon, ArrowUpRightIcon } from 'lucide-react';

import { siteConfig } from '@/app/siteConfig';
import { ThemeSwitcher } from '@/app/theme-switcher';
import { Badge } from '@workspace/ui/components/badge';
import { Button } from '@workspace/ui/components/button';
import { cn } from '@workspace/ui/lib/utils';

type Dashboard = {
  name: string;
  slug: string;
  number: string;
  href: string;
  domain: string;
  category: string;
  themeClass: string;
  title: string;
  description: string;
  features: string[];
  logoLight: string;
  logoDark: string;
  screenshot: string;
  screenshotDark: string;
  screenshotAlt: string;
};

const dashboards: Dashboard[] = [
  {
    name: 'Orbit',
    slug: 'orbit',
    number: '01',
    href: siteConfig.baseLinks.orbit,
    domain: 'orbit.anuragroy.dev',
    category: 'SaaS operations',
    themeClass: 'theme-orbit',
    title: 'See usage, growth, and spend in one operating view.',
    description:
      'Orbit brings workspace activity, billing pressure, account health, and team administration into a calm control surface for subscription products.',
    features: ['Usage analytics', 'Spend controls', 'Workspace admin'],
    logoLight: '/logos/orbit-light.svg',
    logoDark: '/logos/orbit-dark.svg',
    screenshot: '/screenshots/orbit-overview.png',
    screenshotDark: '/screenshots/orbit-overview-dark.png',
    screenshotAlt: 'Orbit overview showing workspace usage, billing, and activity metrics',
  },
  {
    name: 'Audit',
    slug: 'audit',
    number: '02',
    href: siteConfig.baseLinks.audit,
    domain: 'audit.anuragroy.dev',
    category: 'Spend intelligence',
    themeClass: 'theme-audit',
    title: 'Review every expense with the right context.',
    description:
      'Audit organizes reports, transactions, policy rules, and approvals into a focused finance workflow built for faster, more confident decisions.',
    features: ['Expense reports', 'Transaction review', 'Policy workflows'],
    logoLight: '/logos/audit-light.svg',
    logoDark: '/logos/audit-dark.svg',
    screenshot: '/screenshots/audit-reports.png',
    screenshotDark: '/screenshots/audit-reports-dark.png',
    screenshotAlt: 'Audit reports dashboard showing expense filters and transaction charts',
  },
  {
    name: 'Pulse',
    slug: 'pulse',
    number: '03',
    href: siteConfig.baseLinks.pulse,
    domain: 'pulse.anuragroy.dev',
    category: 'Support operations',
    themeClass: 'theme-pulse',
    title: 'Keep customer support moving in real time.',
    description:
      'Pulse connects ticket flow, SLA performance, retention, and agent capacity so service teams can spot pressure early and respond with clarity.',
    features: ['Ticket operations', 'SLA health', 'Team capacity'],
    logoLight: '/logos/pulse-light.svg',
    logoDark: '/logos/pulse-dark.svg',
    screenshot: '/screenshots/pulse-support.png',
    screenshotDark: '/screenshots/pulse-support-dark.png',
    screenshotAlt: 'Pulse support dashboard showing ticket, SLA, and call volume metrics',
  },
  {
    name: 'Nova',
    slug: 'nova',
    number: '04',
    href: siteConfig.baseLinks.nova,
    domain: 'nova.anuragroy.dev',
    category: 'AI observability',
    themeClass: 'theme-nova',
    title: 'Understand every request across the AI gateway.',
    description:
      'Nova tracks model traffic, routing outcomes, latency, reliability, and cost across providers in one legible AI operations workspace.',
    features: ['Gateway health', 'Trace explorer', 'Model performance'],
    logoLight: '/logos/nova-light.svg',
    logoDark: '/logos/nova-dark.svg',
    screenshot: '/screenshots/nova-overview.png',
    screenshotDark: '/screenshots/nova-overview-dark.png',
    screenshotAlt: 'Nova gateway health dashboard showing AI traffic and routing outcomes',
  },
];

export default function Home() {
  return (
    <main id='top' className='min-h-screen overflow-hidden bg-background'>
      <header className='mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-5 py-5 sm:px-8 lg:px-10'>
        <a
          href={siteConfig.baseLinks.home}
          className='group inline-flex min-w-0 items-center gap-3 rounded-2xl outline-none focus-visible:ring-3 focus-visible:ring-ring/30'
          aria-label='Dashboards home'
        >
          <LogoCluster />
          <span className='flex min-w-0 flex-col'>
            <span className='text-sm font-semibold text-foreground'>Dashboards</span>
            <span className='truncate text-xs text-muted-foreground'>Four-product collection</span>
          </span>
        </a>

        <div className='flex shrink-0 items-center gap-2'>
          <ThemeSwitcher />
          <Button
            nativeButton={false}
            variant='outline'
            size='sm'
            className='size-8 px-0 sm:w-auto sm:px-3'
            render={<a href='#collection' />}
          >
            <span className='sr-only sm:not-sr-only'>Browse collection</span>
            <ArrowDownIcon data-icon='inline-end' />
          </Button>
        </div>
      </header>

      <section className='border-y border-border/70 bg-muted/20'>
        <div className='mx-auto flex w-full max-w-7xl flex-col gap-10 px-5 py-16 sm:px-8 sm:py-20 lg:px-10 lg:py-24'>
          <Badge variant='outline' className='w-fit rounded-full'>
            Product index · 01–04
          </Badge>

          <div className='grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(280px,0.45fr)] lg:items-end'>
            <h1 className='max-w-4xl text-4xl leading-[0.98] font-semibold text-foreground sm:text-7xl lg:text-[5.5rem]'>
              Four dashboards.
              <br />
              One collection.
            </h1>

            <div className='flex max-w-xl flex-col gap-5 lg:pb-2'>
              <p className='text-base leading-7 text-muted-foreground sm:text-lg'>
                Explore focused products for subscription operations, expense review, customer support, and AI
                infrastructure. Each dashboard has its own workflows, data, and visual system.
              </p>
              <a
                href='#collection'
                className='group inline-flex w-fit items-center gap-2 rounded-lg text-sm font-medium text-foreground outline-none focus-visible:ring-3 focus-visible:ring-ring/30'
              >
                Meet the collection
                <ArrowDownIcon className='size-4' />
              </a>
            </div>
          </div>
        </div>
      </section>

      <nav aria-label='Dashboard index' className='mx-auto w-full max-w-7xl px-5 py-8 sm:px-8 lg:px-10 lg:py-10'>
        <div className='grid grid-cols-2 overflow-hidden rounded-3xl border border-border bg-card shadow-sm lg:grid-cols-4'>
          {dashboards.map((dashboard, index) => (
            <a
              key={dashboard.name}
              href={`#${dashboard.slug}`}
              className={cn(
                'hub-index-link group min-w-0 bg-card outline-none focus-visible:ring-3 focus-visible:ring-ring/30 focus-visible:ring-inset',
                index > 1 && 'border-t border-border lg:border-t-0',
                index % 2 === 1 && 'border-l',
                index > 0 && 'lg:border-l'
              )}
            >
              <div className='relative aspect-[16/10] overflow-hidden bg-muted sm:aspect-[4/3]'>
                <Image
                  src={dashboard.screenshot}
                  alt=''
                  fill
                  sizes='(min-width: 1024px) 20vw, (min-width: 640px) 42vw, 90vw'
                  className='hub-index-image object-cover object-left-top dark:hidden'
                  loading='eager'
                />
                <Image
                  src={dashboard.screenshotDark}
                  alt=''
                  fill
                  sizes='(min-width: 1024px) 20vw, (min-width: 640px) 42vw, 90vw'
                  className='hub-index-image hidden object-cover object-left-top dark:block'
                  loading='eager'
                />
              </div>
              <div
                className={cn(
                  'flex items-center gap-2 border-t border-border p-3 sm:gap-3 sm:p-4',
                  dashboard.themeClass
                )}
              >
                <AppLogo dashboard={dashboard} className='size-8 rounded-lg sm:size-10 sm:rounded-xl' />
                <span className='min-w-0 flex-1'>
                  <span className='flex items-center gap-2'>
                    <span className='text-xs font-medium text-muted-foreground'>{dashboard.number}</span>
                    <span className='truncate text-sm font-semibold text-foreground'>{dashboard.name}</span>
                  </span>
                  <span className='block truncate text-xs text-muted-foreground'>{dashboard.category}</span>
                </span>
                <ArrowDownIcon className='size-4 shrink-0 text-muted-foreground' />
              </div>
            </a>
          ))}
        </div>
      </nav>

      <section id='collection' className='mx-auto w-full max-w-7xl scroll-mt-4 px-5 pb-16 sm:px-8 lg:px-10 lg:pb-24'>
        <div className='flex flex-col gap-2 border-t border-border pt-8 sm:flex-row sm:items-end sm:justify-between'>
          <h2 className='text-2xl font-semibold text-foreground sm:text-3xl'>The collection</h2>
          <p className='max-w-lg text-sm leading-6 text-muted-foreground'>
            Four distinct products, united by clear information architecture and focused operational workflows.
          </p>
        </div>

        {dashboards.map((dashboard, index) => (
          <DashboardChapter key={dashboard.name} dashboard={dashboard} imageFirst={index % 2 === 1} />
        ))}
      </section>

      <footer className='border-t border-border bg-muted/20'>
        <div className='mx-auto flex w-full max-w-7xl flex-col gap-6 px-5 py-8 sm:flex-row sm:items-center sm:justify-between sm:px-8 lg:px-10'>
          <div className='flex items-center gap-3'>
            <LogoCluster />
            <div>
              <p className='text-sm font-semibold text-foreground'>Dashboards</p>
              <p className='text-xs text-muted-foreground'>Orbit · Audit · Pulse · Nova</p>
            </div>
          </div>
          <a
            href='#top'
            className='w-fit rounded-lg text-sm font-medium text-muted-foreground transition-colors outline-none hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/30'
          >
            Back to top
          </a>
        </div>
      </footer>
    </main>
  );
}

function DashboardChapter({ dashboard, imageFirst }: { dashboard: Dashboard; imageFirst: boolean }) {
  return (
    <article
      id={dashboard.slug}
      className={cn('scroll-mt-4 border-b border-border py-16 lg:py-20', dashboard.themeClass)}
    >
      <div
        className={cn(
          'grid gap-10 lg:items-center lg:gap-14',
          imageFirst
            ? 'lg:grid-cols-[minmax(0,1.42fr)_minmax(280px,0.58fr)]'
            : 'lg:grid-cols-[minmax(280px,0.58fr)_minmax(0,1.42fr)]'
        )}
      >
        <div className={cn('flex flex-col gap-8', imageFirst && 'lg:order-2')}>
          <div className='flex items-center gap-3 text-xs font-medium text-muted-foreground'>
            <span>{dashboard.number}</span>
            <span className='h-px flex-1 bg-border' />
            <span>{dashboard.category}</span>
          </div>

          <div className='flex flex-col gap-5'>
            <div className='flex items-center gap-3'>
              <AppLogo dashboard={dashboard} className='size-12 rounded-xl' />
              <div className='min-w-0'>
                <h2 className='text-2xl font-semibold text-foreground'>{dashboard.name}</h2>
                <p className='truncate text-xs text-muted-foreground'>{dashboard.domain}</p>
              </div>
            </div>

            <h3 className='text-3xl leading-tight font-semibold text-foreground sm:text-4xl'>{dashboard.title}</h3>
            <p className='text-base leading-7 text-muted-foreground'>{dashboard.description}</p>
          </div>

          <div className='flex flex-wrap gap-2'>
            {dashboard.features.map((feature) => (
              <Badge key={feature} variant='secondary' className='rounded-full'>
                {feature}
              </Badge>
            ))}
          </div>

          <Button
            nativeButton={false}
            className='w-fit'
            render={<a href={dashboard.href} target='_blank' rel='noreferrer' />}
          >
            Open {dashboard.name}
            <ArrowUpRightIcon data-icon='inline-end' />
          </Button>
        </div>

        <a
          href={dashboard.href}
          target='_blank'
          rel='noreferrer'
          className={cn(
            'hub-project-shot group block overflow-hidden rounded-3xl border border-border bg-card shadow-sm outline-none focus-visible:ring-3 focus-visible:ring-ring/30',
            imageFirst && 'lg:order-1'
          )}
          aria-label={`Open ${dashboard.name} dashboard`}
        >
          <figure className='relative aspect-video overflow-hidden bg-muted'>
            <Image
              src={dashboard.screenshot}
              alt={dashboard.screenshotAlt}
              fill
              sizes='(min-width: 1024px) 65vw, 100vw'
              className='hub-project-image object-cover object-top dark:hidden'
              loading='eager'
            />
            <Image
              src={dashboard.screenshotDark}
              alt={dashboard.screenshotAlt}
              fill
              sizes='(min-width: 1024px) 65vw, 100vw'
              className='hub-project-image hidden object-cover object-top dark:block'
              loading='eager'
            />
            <figcaption className='absolute right-3 bottom-3 flex items-center gap-2 rounded-full border border-border bg-background/90 px-3 py-1.5 text-xs font-medium text-foreground shadow-sm backdrop-blur-sm'>
              <span className='size-1.5 rounded-full bg-primary' />
              Live dashboard
            </figcaption>
          </figure>
        </a>
      </div>
    </article>
  );
}

function LogoCluster() {
  return (
    <span className='grid size-11 shrink-0 grid-cols-2 gap-1 rounded-2xl border border-border bg-background p-1 shadow-sm'>
      {dashboards.map((dashboard) => (
        <AppLogo key={dashboard.name} dashboard={dashboard} className='size-4 rounded-md' />
      ))}
    </span>
  );
}

function AppLogo({
  dashboard,
  className,
}: {
  dashboard: Pick<Dashboard, 'name' | 'logoLight' | 'logoDark'>;
  className?: string;
}) {
  return (
    <span className={cn('relative block shrink-0 overflow-hidden', className)}>
      <Image src={dashboard.logoLight} alt='' width={48} height={48} className='size-full object-cover dark:hidden' />
      <Image
        src={dashboard.logoDark}
        alt=''
        width={48}
        height={48}
        className='hidden size-full object-cover dark:block'
      />
    </span>
  );
}
