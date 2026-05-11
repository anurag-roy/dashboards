'use client';

import * as React from 'react';
import { ProgressBar } from '@workspace/ui/components/progress-bar';
import { ProgressCircle } from '@workspace/ui/components/progress-circle';
import { cn } from '@/lib/utils';
import { Button } from '@workspace/ui/components/button';
import { Card } from '@workspace/ui/components/card';
import { Input } from '@workspace/ui/components/input';
import { Label } from '@workspace/ui/components/label';
import { Separator } from '@workspace/ui/components/separator';
import { Switch } from '@workspace/ui/components/switch';
import { ExternalLink } from 'lucide-react';

const currentCycleSpend = 280;

const data: {
  name: string;
  description: string;
  value: string;
  capacity?: string;
  percentageValue?: number;
}[] = [
  {
    name: 'Starter plan',
    description: 'Discounted plan for start-ups and growing companies',
    value: '$90',
  },
  {
    name: 'Storage',
    description: 'Used 10.1 GB',
    value: '$40',
    capacity: '100 GB included',
    percentageValue: 10.1,
  },
  {
    name: 'Bandwidth',
    description: 'Used 2.9 GB',
    value: '$10',
    capacity: '5 GB included',
    percentageValue: 58,
  },
  {
    name: 'Users',
    description: 'Used 9',
    value: '$20',
    capacity: '50 users included',
    percentageValue: 18,
  },
  {
    name: 'Query super caching (EU-Central 1)',
    description: '4 GB query cache, $120/mo',
    value: '$120.00',
  },
];

type SpendSettings = {
  enabled: boolean;
  hardCap: string;
  email: string;
};

type AddOnSettings = {
  botProtection: boolean;
  insights: boolean;
};

const initialSpendSettings: SpendSettings = {
  enabled: true,
  hardCap: '350',
  email: 'admin@company.com',
};

const initialAddOns: AddOnSettings = {
  botProtection: false,
  insights: false,
};

function settingsChanged<T extends object>(current: T, saved: T) {
  return JSON.stringify(current) !== JSON.stringify(saved);
}

export default function BillingPage() {
  const [spendSettings, setSpendSettings] = React.useState(initialSpendSettings);
  const [savedSpendSettings, setSavedSpendSettings] = React.useState(initialSpendSettings);
  const [addOns, setAddOns] = React.useState(initialAddOns);
  const [savedAddOns, setSavedAddOns] = React.useState(initialAddOns);

  const spendDirty = settingsChanged(spendSettings, savedSpendSettings);
  const addOnsDirty = settingsChanged(addOns, savedAddOns);
  const hardCap = Number(spendSettings.hardCap) || 0;
  const spendPercent = spendSettings.enabled && hardCap > 0 ? Math.min((currentCycleSpend / hardCap) * 100, 100) : 0;

  const updateSpendSettings = (settings: Partial<SpendSettings>) => {
    setSpendSettings((current) => ({ ...current, ...settings }));
  };

  const updateAddOns = (settings: Partial<AddOnSettings>) => {
    setAddOns((current) => ({ ...current, ...settings }));
  };

  return (
    <>
      <div className='rounded-2xl bg-muted/40 p-6 ring-1 ring-border ring-inset'>
        <h4 className='text-sm font-semibold text-foreground'>This workspace is currently on the free plan</h4>
        <p className='mt-1 max-w-2xl text-sm leading-6 text-muted-foreground'>
          Boost your analytics and unlock advanced features with our premium plans.{' '}
          <a href='#' className='inline-flex items-center gap-1 text-primary'>
            Compare plans
            <ExternalLink className='size-4 shrink-0' aria-hidden='true' />
          </a>
        </p>
      </div>
      <div className='mt-6 space-y-10'>
        <section aria-labelledby='billing-overview'>
          <div className='grid grid-cols-1 gap-x-14 gap-y-8 md:grid-cols-3'>
            <div>
              <h2 id='billing-overview' className='scroll-mt-10 font-semibold text-foreground'>
                Billing
              </h2>
              <p className='mt-1 text-sm leading-6 text-muted-foreground'>
                Overview of current billing cycle based on fixed and on-demand charges.
              </p>
            </div>
            <div className='md:col-span-2'>
              <ul role='list' className='w-full divide-y divide-border border-b border-border'>
                {data.map((item) => (
                  <li key={item.name} className='px-2 py-4 text-sm md:p-4'>
                    <div className='w-full'>
                      <div className='flex items-center justify-between'>
                        <p className='font-medium text-foreground'>{item.name}</p>
                        <p className='font-medium text-muted-foreground'>{item.value}</p>
                      </div>
                      <div className='w-full md:w-2/3'>
                        {item.percentageValue !== undefined && (
                          <ProgressBar value={item.percentageValue} className='mt-2 [&>*]:h-1.5' />
                        )}
                        <p className='mt-1 flex items-center justify-between text-xs text-muted-foreground'>
                          <span>{item.description}</span>
                          <span>{item.capacity}</span>
                        </p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
              <div className='px-2 py-4 md:p-4'>
                <p className='flex items-center justify-between text-sm font-medium text-foreground'>
                  <span>Total (current cycle)</span>
                  <span className='font-semibold'>${currentCycleSpend}</span>
                </p>
              </div>
            </div>
          </div>
        </section>
        <Separator />
        <section aria-labelledby='cost-spend-control'>
          <div className='grid grid-cols-1 gap-x-14 gap-y-8 md:grid-cols-3'>
            <div>
              <h2 id='cost-spend-control' className='scroll-mt-10 font-semibold text-foreground'>
                Cost spend control
              </h2>
              <p className='mt-1 text-sm leading-6 text-muted-foreground'>Set hard caps for on-demand charges.</p>
            </div>
            <div className='md:col-span-2'>
              <div className='flex items-center justify-between'>
                <div className='flex items-center gap-4'>
                  <ProgressCircle value={spendPercent} radius={20} strokeWidth={4.5} />
                  <div>
                    {spendSettings.enabled ? (
                      <>
                        <p className='text-sm font-medium text-foreground'>
                          ${currentCycleSpend} / {hardCap || 0} ({spendPercent.toFixed(1)}%)
                        </p>
                        <Label htmlFor='spend-mgmt' className='text-muted-foreground'>
                          Spend management enabled
                        </Label>
                      </>
                    ) : (
                      <>
                        <p className='text-sm font-medium text-foreground'>$0 / 0 (0%)</p>
                        <Label htmlFor='spend-mgmt' className='text-muted-foreground'>
                          Spend management disabled
                        </Label>
                      </>
                    )}
                  </div>
                </div>
                <Switch
                  id='spend-mgmt'
                  name='spend-mgmt'
                  checked={spendSettings.enabled}
                  onCheckedChange={(checked) => updateSpendSettings({ enabled: checked })}
                />
              </div>
              <div
                className={cn(
                  'transform-gpu transition-all ease-[cubic-bezier(0.16,1,0.3,1.03)] will-change-transform',
                  spendSettings.enabled ? 'h-60 md:h-40' : 'h-0'
                )}
                style={{
                  transitionDuration: '300ms',
                  animationFillMode: 'backwards',
                }}
              >
                <div
                  className={cn(
                    'transition',
                    spendSettings.enabled ? 'animate-in duration-300 fade-in-0 slide-in-from-top-2' : 'hidden'
                  )}
                  style={{
                    animationDelay: '100ms',
                    animationDuration: '300ms',
                    transitionDuration: '300ms',
                    animationFillMode: 'backwards',
                  }}
                >
                  <div className='mt-8 grid grid-cols-1 gap-4 md:grid-cols-3'>
                    <div className='md:col-span-1'>
                      <Label htmlFor='hard-cap' className='font-medium'>
                        Set amount ($)
                      </Label>
                      <Input
                        id='hard-cap'
                        name='hard-cap'
                        value={spendSettings.hardCap}
                        onChange={(event) => updateSpendSettings({ hardCap: event.target.value })}
                        type='number'
                        className='mt-2'
                      />
                    </div>
                    <div className='md:col-span-2'>
                      <Label htmlFor='billing-email' className='font-medium'>
                        Provide email for notifications
                      </Label>
                      <Input
                        id='billing-email'
                        name='billing-email'
                        value={spendSettings.email}
                        onChange={(event) => updateSpendSettings({ email: event.target.value })}
                        placeholder='admin@company.com'
                        type='email'
                        className='mt-2'
                      />
                    </div>
                  </div>
                  <div className='mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end'>
                    <div className='flex flex-col gap-2 sm:flex-row sm:justify-end'>
                      <Button
                        type='button'
                        variant='secondary'
                        disabled={!spendDirty}
                        onClick={() => {
                          setSpendSettings(savedSpendSettings);
                        }}
                      >
                        Reset
                      </Button>
                      <Button
                        type='button'
                        disabled={!spendDirty}
                        onClick={() => {
                          setSavedSpendSettings(spendSettings);
                        }}
                      >
                        Update
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <Separator />
        <section aria-labelledby='add-ons'>
          <div className='grid grid-cols-1 gap-x-14 gap-y-8 md:grid-cols-3'>
            <div>
              <h2 id='add-ons' className='scroll-mt-10 font-semibold text-foreground'>
                Add-Ons
              </h2>
              <p className='mt-1 text-sm leading-6 text-muted-foreground'>
                Additional services to enhance your workspace.
              </p>
            </div>
            <div className='space-y-6 md:col-span-2'>
              <Card className='overflow-hidden p-0'>
                <div className='px-4 pt-4 pb-6'>
                  <span className='text-sm text-muted-foreground'>$25/month</span>
                  <h4 className='mt-4 text-sm font-semibold text-foreground'>Advanced bot protection</h4>
                  <p className='mt-2 max-w-xl text-sm leading-6 text-muted-foreground'>
                    Safeguard your assets with our cutting-edge bot protection. Our AI solution identifies and mitigates
                    automated traffic to protect your workspace from bad bots.
                  </p>
                </div>
                <div className='flex items-center justify-between border-t border-border bg-muted/40 p-4 dark:bg-muted/20'>
                  <div className='flex items-center gap-3'>
                    <Switch
                      id='bot-protection'
                      name='bot-protection'
                      checked={addOns.botProtection}
                      onCheckedChange={(checked) => updateAddOns({ botProtection: checked })}
                    />
                    <Label htmlFor='bot-protection'>Activate</Label>
                  </div>
                  <a href='#' className='inline-flex items-center gap-1 text-sm text-primary'>
                    Learn more
                    <ExternalLink className='size-4 shrink-0' aria-hidden='true' />
                  </a>
                </div>
              </Card>
              <Card className='overflow-hidden p-0'>
                <div className='px-4 pt-4 pb-6'>
                  <span className='text-sm text-muted-foreground'>$50/month</span>
                  <h4 className='mt-4 text-sm font-semibold text-foreground'>Workspace insights</h4>
                  <p className='mt-2 max-w-xl text-sm leading-6 text-muted-foreground'>
                    Real-time analysis of your workspace&#39;s usage, enabling you to make well-informed decisions for
                    optimization.
                  </p>
                </div>
                <div className='flex items-center justify-between border-t border-border bg-muted/40 p-4 dark:bg-muted/20'>
                  <div className='flex items-center gap-3'>
                    <Switch
                      id='insights'
                      name='insights'
                      checked={addOns.insights}
                      onCheckedChange={(checked) => updateAddOns({ insights: checked })}
                    />
                    <Label htmlFor='insights'>Activate</Label>
                  </div>
                  <a href='#' className='inline-flex items-center gap-1 text-sm text-primary'>
                    Learn more
                    <ExternalLink className='size-4 shrink-0' aria-hidden='true' />
                  </a>
                </div>
              </Card>
              <div className='flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end'>
                <div className='flex flex-col gap-2 sm:flex-row sm:justify-end'>
                  <Button
                    type='button'
                    variant='secondary'
                    disabled={!addOnsDirty}
                    onClick={() => {
                      setAddOns(savedAddOns);
                    }}
                  >
                    Reset
                  </Button>
                  <Button
                    type='button'
                    disabled={!addOnsDirty}
                    onClick={() => {
                      setSavedAddOns(addOns);
                    }}
                  >
                    Save add-ons
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
