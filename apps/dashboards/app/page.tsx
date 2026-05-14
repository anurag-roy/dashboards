import Image from 'next/image';
import type { LucideIcon } from 'lucide-react';
import {
  ActivityIcon,
  ArrowRightIcon,
  ArrowUpRightIcon,
  BarChart3Icon,
  BotIcon,
  BriefcaseBusinessIcon,
  CheckCircle2Icon,
  CircleDollarSignIcon,
  Clock3Icon,
  GaugeIcon,
  Layers3Icon,
  ShieldCheckIcon,
  SparklesIcon,
  WandSparklesIcon,
} from 'lucide-react';

import { siteConfig } from '@/app/siteConfig';
import { Badge } from '@workspace/ui/components/badge';
import { Button } from '@workspace/ui/components/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@workspace/ui/components/card';
import { cn } from '@workspace/ui/lib/utils';

type Dashboard = {
  name: string;
  href: string;
  domain: string;
  themeClass: string;
  title: string;
  summary: string;
  outcome: string;
  services: string[];
  highlights: string[];
  logoLight: string;
  logoDark: string;
  Icon: LucideIcon;
  scene: 'orbit' | 'audit' | 'pulse' | 'nova';
};

const dashboards: Dashboard[] = [
  {
    name: 'Orbit',
    href: siteConfig.baseLinks.orbit,
    domain: 'orbit.anuragroy.dev',
    themeClass: 'theme-orbit',
    title: 'Turn usage and billing data into a calm operating cockpit.',
    summary:
      'Orbit shows how I would help a SaaS team understand account activity, workspace growth, usage limits, and billing pressure without making the interface feel heavy.',
    outcome:
      'Best for subscription products, internal admin tools, and customer success teams that need clarity around usage and revenue signals.',
    services: ['Dashboard strategy', 'Usage analytics', 'Billing workflows'],
    highlights: ['Usage overview', 'Cost controls', 'Team management'],
    logoLight: '/logos/orbit-light.svg',
    logoDark: '/logos/orbit-dark.svg',
    Icon: BarChart3Icon,
    scene: 'orbit',
  },
  {
    name: 'Audit',
    href: siteConfig.baseLinks.audit,
    domain: 'audit.anuragroy.dev',
    themeClass: 'theme-audit',
    title: 'Give finance teams a faster way to review spend and risk.',
    summary:
      'Audit is a polished expense review product with reports, transaction queues, policy rules, approval flows, and onboarding screens built for teams that need decisions to move quickly.',
    outcome:
      'Best for fintech, operations, and finance workflows where trust, review speed, and clear exception handling matter.',
    services: ['Workflow design', 'Review queues', 'Policy builders'],
    highlights: ['Expense reports', 'Transaction details', 'Approval rules'],
    logoLight: '/logos/audit-light.svg',
    logoDark: '/logos/audit-dark.svg',
    Icon: ShieldCheckIcon,
    scene: 'audit',
  },
  {
    name: 'Pulse',
    href: siteConfig.baseLinks.pulse,
    domain: 'pulse.anuragroy.dev',
    themeClass: 'theme-pulse',
    title: 'Make service operations easier to monitor and improve.',
    summary:
      'Pulse brings support volume, retention cohorts, workflow simulation, and agent capacity into one focused operating surface for leaders who need to spot issues early.',
    outcome:
      'Best for support teams, call centers, service businesses, and operational leaders who need better visibility into daily performance.',
    services: ['Operations dashboards', 'Scenario tools', 'Mobile workflows'],
    highlights: ['Ticket flow', 'Retention heatmap', 'Agent capacity'],
    logoLight: '/logos/pulse-light.svg',
    logoDark: '/logos/pulse-dark.svg',
    Icon: ActivityIcon,
    scene: 'pulse',
  },
  {
    name: 'Nova',
    href: siteConfig.baseLinks.nova,
    domain: 'nova.anuragroy.dev',
    themeClass: 'theme-nova',
    title: 'Help AI teams understand cost, quality, and reliability.',
    summary:
      'Nova is an AI operations dashboard for monitoring model usage, latency, traces, cost, and provider performance in a way both engineering and business teams can read.',
    outcome:
      'Best for AI products, automation platforms, and internal teams that need to control spend while improving model reliability.',
    services: ['AI product dashboards', 'Trace review', 'Cost intelligence'],
    highlights: ['Model comparison', 'Trace explorer', 'Usage trends'],
    logoLight: '/logos/nova-light.svg',
    logoDark: '/logos/nova-dark.svg',
    Icon: BotIcon,
    scene: 'nova',
  },
];

const proofPoints = [
  {
    label: 'Product thinking',
    value: '4 demos',
    Icon: BriefcaseBusinessIcon,
  },
  {
    label: 'Built for real workflows',
    value: '12+ screens',
    Icon: Layers3Icon,
  },
  {
    label: 'Responsive by default',
    value: 'Desktop + mobile',
    Icon: CheckCircle2Icon,
  },
];

export default function Home() {
  return (
    <main className='min-h-screen overflow-hidden bg-background'>
      <section className='relative border-b border-border/70'>
        <div className='hub-hero-mesh absolute inset-0 opacity-80' />
        <div className='relative mx-auto flex w-full max-w-7xl flex-col gap-14 px-6 py-6 sm:px-8 lg:px-10'>
          <header className='flex items-center justify-between gap-4'>
            <a
              href={siteConfig.baseLinks.home}
              className='group inline-flex items-center gap-3 rounded-2xl outline-none focus-visible:ring-3 focus-visible:ring-ring/30'
              aria-label='Dashboards home'
            >
              <LogoCluster />
              <div className='flex flex-col'>
                <span className='text-sm font-semibold text-foreground'>Anurag Roy</span>
                <span className='text-xs text-muted-foreground'>Software design and development</span>
              </div>
            </a>
            <Button
              nativeButton={false}
              variant='outline'
              size='sm'
              render={<a href={siteConfig.baseLinks.portfolio} />}
            >
              Visit portfolio
              <ArrowUpRightIcon data-icon='inline-end' />
            </Button>
          </header>

          <div className='grid gap-10 py-8 lg:grid-cols-[minmax(0,1fr)_420px] lg:items-end lg:py-14'>
            <div className='flex max-w-3xl flex-col gap-7'>
              <Badge
                variant='outline'
                className='w-fit rounded-full border-border/80 bg-background/80 px-3 text-muted-foreground shadow-sm'
              >
                Freelance product engineering
              </Badge>
              <div className='flex flex-col gap-5'>
                <h1 className='text-4xl font-semibold text-foreground sm:text-5xl lg:text-6xl'>
                  I build business software that makes complex work feel simple.
                </h1>
                <p className='max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg'>
                  This is a small gallery of demo products I designed and built to show the kind of polished dashboards,
                  internal tools, and operational web apps I can create for client teams.
                </p>
              </div>
              <div className='flex flex-col gap-3 sm:flex-row'>
                <Button nativeButton={false} size='lg' render={<a href='#work' />}>
                  View the work
                  <ArrowRightIcon data-icon='inline-end' />
                </Button>
                <Button
                  nativeButton={false}
                  variant='outline'
                  size='lg'
                  render={<a href={siteConfig.baseLinks.portfolio} />}
                >
                  Work with me
                  <ArrowUpRightIcon data-icon='inline-end' />
                </Button>
              </div>
            </div>

            <HeroIllustration />
          </div>
        </div>
      </section>

      <section className='mx-auto grid w-full max-w-7xl gap-4 px-6 py-8 sm:grid-cols-3 sm:px-8 lg:px-10'>
        {proofPoints.map((point) => (
          <Card key={point.label} size='sm' className='rounded-3xl bg-card/80'>
            <CardContent className='flex items-center gap-3'>
              <span className='flex size-10 items-center justify-center rounded-full bg-primary/10 text-primary'>
                <point.Icon className='size-4' />
              </span>
              <div className='min-w-0'>
                <p className='text-sm font-medium text-foreground'>{point.value}</p>
                <p className='truncate text-sm text-muted-foreground'>{point.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </section>

      <section id='work' className='mx-auto flex w-full max-w-7xl flex-col gap-5 px-6 pt-4 pb-14 sm:px-8 lg:px-10'>
        <div className='flex max-w-3xl flex-col gap-3'>
          <p className='text-sm font-medium text-foreground'>Selected demo products</p>
          <p className='text-sm leading-6 text-muted-foreground'>
            Each demo focuses on a different business problem, with realistic screens, responsive layouts, and the kind
            of interaction detail clients expect from production software.
          </p>
        </div>

        <div className='flex flex-col gap-5'>
          {dashboards.map((dashboard, index) => (
            <DashboardCard key={dashboard.name} dashboard={dashboard} index={index} />
          ))}
        </div>
      </section>
    </main>
  );
}

function DashboardCard({ dashboard, index }: { dashboard: Dashboard; index: number }) {
  const Icon = dashboard.Icon;

  return (
    <Card
      className={cn('hub-reveal rounded-3xl border-border/80 bg-card/90 py-0 shadow-sm', dashboard.themeClass)}
      style={{ animationDelay: `${120 + index * 90}ms` }}
    >
      <div
        className={cn(
          'grid min-h-[520px] gap-0 lg:grid-cols-[minmax(0,0.94fr)_minmax(0,1.06fr)]',
          index % 2 === 1 && 'lg:grid-cols-[minmax(0,1.06fr)_minmax(0,0.94fr)]'
        )}
      >
        <div className={cn('flex flex-col justify-between gap-8 p-5 sm:p-7 lg:p-8', index % 2 === 1 && 'lg:order-2')}>
          <CardHeader className='gap-6 px-0 pt-0'>
            <div className='flex flex-col gap-6'>
              <div className='flex items-center justify-between gap-4'>
                <div className='flex min-w-0 items-center gap-3'>
                  <AppLogo dashboard={dashboard} className='size-12 rounded-xl' />
                  <div className='min-w-0'>
                    <CardTitle className='text-2xl font-semibold'>{dashboard.name}</CardTitle>
                    <CardDescription className='truncate'>{dashboard.domain}</CardDescription>
                  </div>
                </div>
                <div className='flex size-11 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary'>
                  <Icon className='size-5' />
                </div>
              </div>

              <div className='flex flex-col gap-4'>
                <h2 className='text-2xl leading-tight font-semibold text-foreground sm:text-3xl'>{dashboard.title}</h2>
                <p className='text-sm leading-6 text-muted-foreground sm:text-base'>{dashboard.summary}</p>
              </div>
            </div>
          </CardHeader>

          <CardContent className='flex flex-col gap-6 px-0'>
            <div className='grid gap-3 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3'>
              {dashboard.services.map((service) => (
                <div key={service} className='rounded-2xl border border-border/80 bg-background/70 px-3 py-3'>
                  <p className='text-sm font-medium text-foreground'>{service}</p>
                </div>
              ))}
            </div>
            <div className='rounded-2xl border border-border/80 bg-muted/30 p-4'>
              <p className='text-sm leading-6 text-muted-foreground'>{dashboard.outcome}</p>
            </div>
          </CardContent>

          <CardFooter className='flex-col items-stretch gap-4 border-t border-border/70 px-0 py-5 sm:flex-row sm:items-center sm:justify-between'>
            <div className='flex flex-wrap gap-2'>
              {dashboard.highlights.map((highlight) => (
                <Badge key={highlight} variant='secondary' className='rounded-full'>
                  {highlight}
                </Badge>
              ))}
            </div>
            <Button nativeButton={false} variant='outline' render={<a href={dashboard.href} />}>
              View demo
              <ArrowUpRightIcon data-icon='inline-end' />
            </Button>
          </CardFooter>
        </div>

        <div
          className={cn(
            'min-h-[420px] border-t border-border/70 lg:border-t-0 lg:border-l',
            index % 2 === 1 && 'lg:order-1 lg:border-r lg:border-l-0'
          )}
        >
          <DashboardScene dashboard={dashboard} />
        </div>
      </div>
    </Card>
  );
}

function DashboardScene({ dashboard }: { dashboard: Dashboard }) {
  return (
    <div className='relative h-full min-h-[420px] overflow-hidden rounded-b-3xl bg-muted/25 p-4 sm:p-6 lg:rounded-r-3xl lg:rounded-b-none'>
      <div className='absolute inset-0 bg-[linear-gradient(to_right,var(--border)_1px,transparent_1px),linear-gradient(to_bottom,var(--border)_1px,transparent_1px)] bg-[size:34px_34px] opacity-25' />
      <div className='absolute inset-x-8 top-8 h-24 rounded-full bg-primary/10 blur-3xl' />
      <div className='relative h-full'>
        {dashboard.scene === 'orbit' && <OrbitScene />}
        {dashboard.scene === 'audit' && <AuditScene />}
        {dashboard.scene === 'pulse' && <PulseScene />}
        {dashboard.scene === 'nova' && <NovaScene />}
      </div>
    </div>
  );
}

function HeroIllustration() {
  return (
    <Card className='relative overflow-hidden rounded-3xl bg-card/80 py-0'>
      <div className='absolute inset-0 bg-[linear-gradient(135deg,var(--muted),transparent_42%,var(--accent))] opacity-45' />
      <div className='relative flex flex-col gap-5 p-5'>
        <div className='flex items-center justify-between gap-4 rounded-2xl border border-border/80 bg-background/75 px-4 py-3 shadow-sm'>
          <div className='flex items-center gap-3'>
            <LogoCluster />
            <div>
              <p className='text-sm font-medium text-foreground'>Client-ready interfaces</p>
              <p className='text-xs text-muted-foreground'>Strategy, design, build, polish</p>
            </div>
          </div>
          <SparklesIcon className='size-4 text-primary' />
        </div>
        <div className='grid gap-3 sm:grid-cols-2'>
          {dashboards.map((dashboard, index) => (
            <div
              key={dashboard.name}
              className={cn(
                'hub-reveal flex min-h-36 flex-col justify-between rounded-3xl border border-border/80 bg-background/80 p-4 shadow-sm',
                dashboard.themeClass
              )}
              style={{ animationDelay: `${220 + index * 80}ms` }}
            >
              <div className='flex items-center justify-between gap-3'>
                <AppLogo dashboard={dashboard} className='size-9 rounded-xl' />
                <span className='flex size-8 items-center justify-center rounded-full bg-primary/10 text-primary'>
                  <dashboard.Icon className='size-4' />
                </span>
              </div>
              <div className='flex flex-col gap-2'>
                <p className='text-sm font-medium text-foreground'>{dashboard.name}</p>
                <div className='flex items-center gap-1.5'>
                  <span className='h-1.5 w-10 rounded-full bg-primary' />
                  <span className='h-1.5 w-6 rounded-full bg-primary/30' />
                  <span className='h-1.5 w-12 rounded-full bg-primary/15' />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}

function OrbitScene() {
  return (
    <BrowserFrame label='Workspace usage'>
      <div className='grid h-full gap-3 lg:grid-cols-[0.72fr_1.28fr]'>
        <SceneSidebar items={['Overview', 'Details', 'Billing', 'Team']} />
        <div className='flex min-w-0 flex-col gap-3'>
          <div className='grid gap-3 sm:grid-cols-3'>
            {[
              ['Usage cap', '84%'],
              ['Active seats', '214'],
              ['Spend pace', '+12%'],
            ].map(([label, value]) => (
              <div key={label} className='rounded-2xl border border-border/80 bg-background p-3 shadow-sm'>
                <p className='text-xs text-muted-foreground'>{label}</p>
                <p className='mt-2 text-xl font-semibold text-foreground'>{value}</p>
                <div className='mt-3 h-1.5 rounded-full bg-muted'>
                  <div className='h-full w-3/4 rounded-full bg-primary' />
                </div>
              </div>
            ))}
          </div>
          <div className='grid flex-1 gap-3 sm:grid-cols-[1fr_180px]'>
            <div className='rounded-2xl border border-border/80 bg-background p-4 shadow-sm'>
              <div className='mb-4 flex items-center justify-between gap-4'>
                <p className='text-sm font-medium text-foreground'>Usage trend</p>
                <Badge variant='secondary' className='rounded-full'>
                  30 days
                </Badge>
              </div>
              <LineChartIllustration />
              <div className='mt-4 grid gap-2'>
                {['API requests', 'Storage', 'Seats'].map((row, index) => (
                  <MetricRow key={row} label={row} value={`${64 + index * 11}%`} width={`${60 + index * 12}%`} />
                ))}
              </div>
            </div>
            <div className='flex flex-col gap-3'>
              <RingPanel label='Budget used' value='68%' />
              <MiniTable rows={['Enterprise', 'Growth', 'Starter']} />
            </div>
          </div>
        </div>
      </div>
    </BrowserFrame>
  );
}

function AuditScene() {
  return (
    <BrowserFrame label='Expense review'>
      <div className='grid h-full gap-3 lg:grid-cols-[1fr_230px]'>
        <div className='flex min-w-0 flex-col gap-3'>
          <div className='grid gap-3 sm:grid-cols-3'>
            {[
              ['Pending review', '$42.8k'],
              ['Exceptions', '18'],
              ['Approved today', '73'],
            ].map(([label, value]) => (
              <div key={label} className='rounded-2xl border border-border/80 bg-background p-3 shadow-sm'>
                <p className='text-xs text-muted-foreground'>{label}</p>
                <p className='mt-2 text-xl font-semibold text-foreground'>{value}</p>
              </div>
            ))}
          </div>
          <div className='grid flex-1 gap-3 sm:grid-cols-[1fr_170px]'>
            <div className='rounded-2xl border border-border/80 bg-background p-4 shadow-sm'>
              <div className='mb-4 flex items-center justify-between'>
                <p className='text-sm font-medium text-foreground'>Spend by category</p>
                <CircleDollarSignIcon className='size-4 text-primary' />
              </div>
              <BarStack rows={['Travel', 'Software', 'Meals', 'Cloud']} />
            </div>
            <div className='rounded-2xl border border-border/80 bg-background p-4 shadow-sm'>
              <p className='text-sm font-medium text-foreground'>Policy rules</p>
              <div className='mt-4 flex flex-col gap-3'>
                {['Receipt missing', 'High amount', 'New vendor'].map((rule) => (
                  <div
                    key={rule}
                    className='flex items-center gap-2 rounded-xl bg-muted/50 p-2 text-xs text-muted-foreground'
                  >
                    <span className='size-2 rounded-full bg-primary' />
                    {rule}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className='rounded-3xl border border-border/80 bg-background p-4 shadow-sm'>
          <div className='flex items-center justify-between gap-3'>
            <p className='text-sm font-medium text-foreground'>Transaction detail</p>
            <ShieldCheckIcon className='size-4 text-primary' />
          </div>
          <div className='mt-4 flex flex-col gap-3'>
            {['Merchant', 'Department', 'Approver', 'Receipt'].map((item, index) => (
              <div key={item} className='rounded-2xl bg-muted/40 p-3'>
                <p className='text-xs text-muted-foreground'>{item}</p>
                <div className='mt-2 h-2 rounded-full bg-primary/20'>
                  <div className='h-full rounded-full bg-primary' style={{ width: `${48 + index * 12}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </BrowserFrame>
  );
}

function PulseScene() {
  return (
    <BrowserFrame label='Service operations'>
      <div className='flex h-full flex-col gap-3'>
        <div className='flex flex-wrap gap-2'>
          {['Support', 'Retention', 'Workflow', 'Agents'].map((item, index) => (
            <span
              key={item}
              className={cn(
                'rounded-full border border-border/80 px-3 py-1 text-xs',
                index === 0 ? 'bg-primary text-primary-foreground' : 'bg-background text-muted-foreground'
              )}
            >
              {item}
            </span>
          ))}
        </div>
        <div className='grid flex-1 gap-3 lg:grid-cols-[0.85fr_1.15fr]'>
          <div className='flex flex-col gap-3'>
            <div className='rounded-2xl border border-border/80 bg-background p-4 shadow-sm'>
              <div className='flex items-center justify-between'>
                <p className='text-sm font-medium text-foreground'>Ticket flow</p>
                <Clock3Icon className='size-4 text-primary' />
              </div>
              <div className='mt-4 flex flex-col gap-2'>
                {['New', 'Triaged', 'Escalated', 'Resolved'].map((stage, index) => (
                  <div key={stage} className='grid grid-cols-[72px_1fr] items-center gap-3 text-xs'>
                    <span className='text-muted-foreground'>{stage}</span>
                    <span className='h-2 rounded-full bg-primary/20'>
                      <span className='block h-full rounded-full bg-primary' style={{ width: `${92 - index * 15}%` }} />
                    </span>
                  </div>
                ))}
              </div>
            </div>
            <RingPanel label='SLA health' value='92' />
          </div>
          <div className='grid gap-3 sm:grid-cols-[1fr_160px]'>
            <div className='rounded-2xl border border-border/80 bg-background p-4 shadow-sm'>
              <p className='text-sm font-medium text-foreground'>Retention cohorts</p>
              <div className='mt-4 grid grid-cols-7 gap-1.5'>
                {Array.from({ length: 35 }).map((_, index) => (
                  <span
                    key={index}
                    className='aspect-square rounded-md bg-primary'
                    style={{ opacity: 0.18 + ((index * 7) % 10) * 0.07 }}
                  />
                ))}
              </div>
            </div>
            <div className='rounded-2xl border border-border/80 bg-background p-4 shadow-sm'>
              <p className='text-sm font-medium text-foreground'>Agent load</p>
              <div className='mt-4 flex flex-col gap-3'>
                {['Ava', 'Mia', 'Leo'].map((agent, index) => (
                  <MetricRow key={agent} label={agent} value={`${72 + index * 8}%`} width={`${72 + index * 8}%`} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </BrowserFrame>
  );
}

function NovaScene() {
  return (
    <BrowserFrame label='AI operations'>
      <div className='grid h-full gap-3 lg:grid-cols-[0.72fr_1.28fr]'>
        <SceneSidebar items={['Overview', 'Traces', 'Models', 'Settings']} />
        <div className='grid min-w-0 gap-3 sm:grid-cols-[1fr_190px]'>
          <div className='flex flex-col gap-3'>
            <div className='rounded-2xl border border-border/80 bg-background p-4 shadow-sm'>
              <div className='flex items-center justify-between'>
                <p className='text-sm font-medium text-foreground'>Model comparison</p>
                <BotIcon className='size-4 text-primary' />
              </div>
              <div className='mt-4 flex flex-wrap gap-2'>
                {['GPT', 'Claude', 'Gemini', 'Llama'].map((model, index) => (
                  <span
                    key={model}
                    className={cn(
                      'rounded-full border px-3 py-1 text-xs',
                      index < 3
                        ? 'border-primary/20 bg-primary/10 text-primary'
                        : 'border-border bg-muted/50 text-muted-foreground'
                    )}
                  >
                    {model}
                  </span>
                ))}
              </div>
              <div className='mt-5'>
                <LineChartIllustration />
              </div>
            </div>
            <MiniTable rows={['Trace 9A2', 'Trace 4F1', 'Trace C80', 'Trace B16']} />
          </div>
          <div className='flex flex-col gap-3'>
            <RingPanel label='Cache savings' value='$8.4k' />
            <div className='rounded-2xl border border-border/80 bg-background p-4 shadow-sm'>
              <p className='text-sm font-medium text-foreground'>Latency bands</p>
              <div className='mt-4 flex h-28 items-end gap-2'>
                {[42, 78, 56, 92, 65, 38, 84].map((height, index) => (
                  <span key={index} className='flex-1 rounded-t-lg bg-primary/70' style={{ height: `${height}%` }} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </BrowserFrame>
  );
}

function BrowserFrame({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className='h-full rounded-3xl border border-border/80 bg-background/90 p-3 shadow-sm backdrop-blur'>
      <div className='mb-3 flex items-center justify-between gap-4 rounded-2xl border border-border/70 bg-muted/30 px-3 py-2'>
        <div className='flex items-center gap-1.5'>
          <span className='size-2.5 rounded-full bg-primary/80' />
          <span className='size-2.5 rounded-full bg-primary/40' />
          <span className='size-2.5 rounded-full bg-primary/20' />
        </div>
        <span className='truncate text-xs font-medium text-muted-foreground'>{label}</span>
        <WandSparklesIcon className='size-3.5 text-primary' />
      </div>
      <div className='min-h-[350px]'>{children}</div>
    </div>
  );
}

function SceneSidebar({ items }: { items: string[] }) {
  return (
    <div className='hidden rounded-2xl border border-border/80 bg-background p-3 shadow-sm lg:flex lg:flex-col lg:gap-2'>
      {items.map((item, index) => (
        <div
          key={item}
          className={cn(
            'flex items-center gap-2 rounded-xl px-3 py-2 text-xs',
            index === 0 ? 'bg-primary text-primary-foreground' : 'text-muted-foreground'
          )}
        >
          <span className='size-1.5 rounded-full bg-current' />
          {item}
        </div>
      ))}
    </div>
  );
}

function RingPanel({ label, value }: { label: string; value: string }) {
  return (
    <div className='rounded-2xl border border-border/80 bg-background p-4 shadow-sm'>
      <div className='flex items-center justify-between gap-3'>
        <p className='text-sm font-medium text-foreground'>{label}</p>
        <GaugeIcon className='size-4 text-primary' />
      </div>
      <div className='mt-5 flex items-center justify-center'>
        <div className='relative flex size-28 items-center justify-center rounded-full bg-[conic-gradient(var(--primary)_0_245deg,var(--muted)_245deg_360deg)]'>
          <div className='absolute size-20 rounded-full bg-background' />
          <span className='relative text-lg font-semibold text-foreground'>{value}</span>
        </div>
      </div>
    </div>
  );
}

function MiniTable({ rows }: { rows: string[] }) {
  return (
    <div className='rounded-2xl border border-border/80 bg-background p-4 shadow-sm'>
      <div className='mb-3 flex items-center justify-between'>
        <p className='text-sm font-medium text-foreground'>Recent activity</p>
        <span className='size-2 rounded-full bg-primary' />
      </div>
      <div className='flex flex-col gap-2'>
        {rows.map((row, index) => (
          <div
            key={row}
            className='grid grid-cols-[1fr_auto] items-center gap-3 rounded-xl bg-muted/40 px-3 py-2 text-xs'
          >
            <span className='truncate text-muted-foreground'>{row}</span>
            <span className='h-1.5 w-10 rounded-full bg-primary/20'>
              <span className='block h-full rounded-full bg-primary' style={{ width: `${42 + index * 13}%` }} />
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function MetricRow({ label, value, width }: { label: string; value: string; width: string }) {
  return (
    <div className='grid grid-cols-[1fr_auto] items-center gap-3'>
      <div className='min-w-0'>
        <div className='mb-1 flex items-center justify-between gap-2 text-xs'>
          <span className='truncate text-muted-foreground'>{label}</span>
          <span className='font-medium text-foreground'>{value}</span>
        </div>
        <div className='h-1.5 rounded-full bg-muted'>
          <div className='h-full rounded-full bg-primary' style={{ width }} />
        </div>
      </div>
    </div>
  );
}

function LineChartIllustration() {
  return (
    <svg viewBox='0 0 360 150' className='h-36 w-full overflow-visible text-primary' aria-hidden='true'>
      <defs>
        <linearGradient id='line-fill' x1='0' x2='0' y1='0' y2='1'>
          <stop offset='0%' stopColor='currentColor' stopOpacity='0.28' />
          <stop offset='100%' stopColor='currentColor' stopOpacity='0' />
        </linearGradient>
      </defs>
      <path
        d='M12 122 C 52 98, 72 112, 104 74 S 172 46, 210 68 S 272 110, 348 34'
        fill='none'
        stroke='currentColor'
        strokeLinecap='round'
        strokeWidth='4'
      />
      <path
        d='M12 122 C 52 98, 72 112, 104 74 S 172 46, 210 68 S 272 110, 348 34 L 348 148 L 12 148 Z'
        fill='url(#line-fill)'
      />
      {[12, 104, 210, 348].map((cx, index) => (
        <circle key={cx} cx={cx} cy={[122, 74, 68, 34][index]} r='5' fill='currentColor' />
      ))}
    </svg>
  );
}

function BarStack({ rows }: { rows: string[] }) {
  return (
    <div className='flex flex-col gap-3'>
      {rows.map((row, index) => (
        <div key={row} className='grid grid-cols-[82px_1fr] items-center gap-3 text-xs'>
          <span className='text-muted-foreground'>{row}</span>
          <span className='flex h-7 overflow-hidden rounded-full bg-muted'>
            <span className='bg-primary' style={{ width: `${38 + index * 8}%`, opacity: 0.88 }} />
            <span className='bg-primary/40' style={{ width: `${26 - index * 3}%` }} />
            <span className='bg-primary/15' style={{ width: `${20 + index * 2}%` }} />
          </span>
        </div>
      ))}
    </div>
  );
}

function LogoCluster() {
  return (
    <div className='grid size-11 grid-cols-2 gap-1 rounded-2xl border border-border/80 bg-background p-1 shadow-sm'>
      {dashboards.map((dashboard) => (
        <AppLogo key={dashboard.name} dashboard={dashboard} className='size-4 rounded-md' />
      ))}
    </div>
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
