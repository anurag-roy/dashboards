'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@workspace/ui/components/card';
import { ProgressBar } from '@workspace/ui/components/progress-bar';
import { Badge } from '@workspace/ui/components/badge';
import { Separator } from '@workspace/ui/components/separator';
import { Button } from '@workspace/ui/components/button';
import { ExternalLink } from 'lucide-react';

import { modelTotals } from '@/lib/data/usage-by-model';
import { overviewSummary } from '@/lib/data/overview-stats';
import { formatters } from '@/lib/utils';
import { ProviderLogo } from '@/components/ProviderLogo';

const totalBudget = 20_000;
const tokenBudget = 1_000_000_000;

export default function BillingPage() {
  const usagePct = Math.round((overviewSummary.totalCost.value / totalBudget) * 100);
  const tokenPct = Math.round((overviewSummary.totalTokens.value / tokenBudget) * 100);

  return (
    <div className='space-y-10'>
      <section aria-labelledby='current-plan'>
        <div className='grid grid-cols-1 gap-x-14 gap-y-8 md:grid-cols-3'>
          <div>
            <h2 id='current-plan' className='scroll-mt-10 font-semibold text-foreground'>
              Current plan
            </h2>
            <p className='mt-1 text-sm leading-6 text-muted-foreground'>
              Manage your subscription and billing details.
            </p>
          </div>
          <div className='md:col-span-2'>
            <Card className='rounded-3xl shadow-sm'>
              <CardHeader>
                <div className='flex items-center justify-between'>
                  <CardTitle className='text-base font-semibold'>Pro Plan</CardTitle>
                  <Badge variant='secondary' className='rounded-full'>
                    $499/mo
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className='space-y-6'>
                {/* Cost Usage */}
                <div>
                  <div className='flex justify-between text-sm'>
                    <span className='text-muted-foreground'>Cost this cycle</span>
                    <span className='font-medium text-foreground tabular-nums'>
                      {formatters.currency(overviewSummary.totalCost.value)} / {formatters.currency(totalBudget)}
                    </span>
                  </div>
                  <ProgressBar
                    value={usagePct}
                    className='mt-2 *:h-2'
                    showAnimation
                    variant={usagePct > 80 ? 'warning' : 'default'}
                  />
                </div>

                {/* Token Usage */}
                <div>
                  <div className='flex justify-between text-sm'>
                    <span className='text-muted-foreground'>Token usage this cycle</span>
                    <span className='font-medium text-foreground tabular-nums'>
                      {formatters.compact(overviewSummary.totalTokens.value)} / {formatters.compact(tokenBudget)}
                    </span>
                  </div>
                  <ProgressBar
                    value={tokenPct}
                    className='mt-2 *:h-2'
                    showAnimation
                    variant={tokenPct > 80 ? 'warning' : 'default'}
                  />
                </div>

                <div className='flex justify-end'>
                  <Button variant='secondary' className='gap-1.5'>
                    Manage subscription
                    <ExternalLink className='size-3.5' aria-hidden='true' />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <Separator />

      <section aria-labelledby='cost-breakdown'>
        <div className='grid grid-cols-1 gap-x-14 gap-y-8 md:grid-cols-3'>
          <div>
            <h2 id='cost-breakdown' className='scroll-mt-10 font-semibold text-foreground'>
              Cost breakdown
            </h2>
            <p className='mt-1 text-sm leading-6 text-muted-foreground'>
              Per-model cost breakdown for the current billing cycle.
            </p>
          </div>
          <div className='md:col-span-2'>
            <ul role='list' className='divide-y divide-border'>
              {modelTotals.map((model) => (
                <li key={model.id} className='flex items-center justify-between py-4'>
                  <div className='flex items-center gap-3'>
                    <ProviderLogo providerId={model.providerId} size={18} />
                    <div>
                      <p className='text-sm font-medium text-foreground'>{model.name}</p>
                      <p className='text-xs text-muted-foreground'>{model.provider}</p>
                    </div>
                  </div>
                  <div className='text-right'>
                    <p className='text-sm font-medium text-foreground tabular-nums'>
                      {formatters.currency(model.totalCost)}
                    </p>
                    <p className='text-xs text-muted-foreground tabular-nums'>
                      {formatters.compact(model.totalRequests)} requests
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}
