'use client';

import * as React from 'react';
import { Plus } from 'lucide-react';

import { Button } from '@workspace/ui/components/button';
import { Card, CardContent, CardHeader, CardTitle } from '@workspace/ui/components/card';
import { ProgressCircle } from '@workspace/ui/components/progress-circle';
import { Separator } from '@workspace/ui/components/separator';

import { CategoryBar } from '@/components/category-bar';
import { SupportChart } from '@/components/support-chart';
import { TicketSheet } from '@/components/ui/ticket-sheet';
import { tickets } from '@/lib/data/support/tickets';
import { volume } from '@/lib/data/support/volume';
import { DataTable } from './_components/DataTable';

const todayVolumeTotal = volume.reduce((sum, row) => sum + row.Today, 0);
const yesterdayVolumeTotal = volume.reduce((sum, row) => sum + row.Yesterday, 0);

export default function SupportPage() {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <main>
      <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
        <div>
          <h1 className='text-2xl font-semibold text-foreground'>Support Dashboard</h1>
          <p className='text-muted-foreground sm:text-sm/6'>
            Real-time monitoring of support metrics with AI-powered insights
          </p>
        </div>
        <Button onClick={() => setIsOpen(true)} className='flex items-center gap-2'>
          <Plus className='size-4 shrink-0' aria-hidden />
          Create Ticket
        </Button>
        <TicketSheet open={isOpen} onOpenChange={setIsOpen} />
      </div>

      <Separator className='mt-6' />

      <dl className='mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3'>
        <Card className='rounded-3xl shadow-sm'>
          <CardHeader className='gap-0 px-6 pb-0'>
            <CardTitle className='text-sm font-medium text-muted-foreground'>Current Tickets</CardTitle>
          </CardHeader>
          <CardContent className='px-6 pt-2'>
            <dd className='text-3xl font-semibold text-foreground'>247</dd>
            <CategoryBar
              values={[82, 13, 5]}
              colors={['bg-primary', 'bg-muted-foreground/40', 'bg-destructive']}
              className='mt-6'
            />
            <ul role='list' className='mt-4 flex flex-wrap gap-x-10 gap-y-4 text-sm'>
              <li>
                <span className='text-base font-semibold text-foreground'>82%</span>
                <div className='flex items-center gap-2'>
                  <span className='size-2.5 shrink-0 rounded-sm bg-primary' aria-hidden />
                  <span className='text-muted-foreground'>Resolved</span>
                </div>
              </li>
              <li>
                <span className='text-base font-semibold text-foreground'>13%</span>
                <div className='flex items-center gap-2'>
                  <span className='size-2.5 shrink-0 rounded-sm bg-muted-foreground/50' aria-hidden />
                  <span className='text-muted-foreground'>In Progress</span>
                </div>
              </li>
              <li>
                <span className='text-base font-semibold text-foreground'>5%</span>
                <div className='flex items-center gap-2'>
                  <span className='size-2.5 shrink-0 rounded-sm bg-destructive' aria-hidden />
                  <span className='text-muted-foreground'>Escalated</span>
                </div>
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card className='rounded-3xl shadow-sm'>
          <CardHeader className='gap-0 px-6 pb-0'>
            <CardTitle className='text-sm font-medium text-muted-foreground'>SLA Performance</CardTitle>
          </CardHeader>
          <CardContent className='px-6 pt-4'>
            <div className='flex flex-nowrap items-center justify-between gap-y-4'>
              <dd className='space-y-3'>
                <div>
                  <div className='flex items-center gap-2'>
                    <span className='size-2.5 shrink-0 rounded-sm bg-primary' aria-hidden />
                    <span className='text-sm text-muted-foreground'>Within SLA</span>
                  </div>
                  <span className='mt-1 block text-2xl font-semibold text-foreground'>83.3%</span>
                </div>
                <div>
                  <div className='flex items-center gap-2'>
                    <span className='size-2.5 shrink-0 rounded-sm bg-destructive' aria-hidden />
                    <span className='text-sm text-foreground'>SLA Breached</span>
                  </div>
                  <span className='mt-1 block text-2xl font-semibold text-foreground'>16.7%</span>
                </div>
              </dd>
              <ProgressCircle value={83} radius={45} strokeWidth={7} variant='default' />
            </div>
          </CardContent>
        </Card>

        <Card className='rounded-3xl shadow-sm'>
          <CardHeader className='gap-0 px-6 pb-0'>
            <CardTitle className='text-sm font-medium text-muted-foreground'>Call Volume Trends</CardTitle>
          </CardHeader>
          <CardContent className='px-6 pt-4'>
            <div className='flex flex-wrap items-center gap-x-8 gap-y-4'>
              <dd className='space-y-3 whitespace-nowrap'>
                <div>
                  <div className='flex items-center gap-2'>
                    <span
                      className='size-2.5 shrink-0 rounded-sm'
                      style={{ backgroundColor: 'var(--chart-2)' }}
                      aria-hidden
                    />
                    <span className='text-sm text-muted-foreground'>Today</span>
                  </div>
                  <span className='mt-1 block text-2xl font-semibold text-foreground'>
                    {todayVolumeTotal.toLocaleString('en-US')}
                  </span>
                </div>
                <div>
                  <div className='flex items-center gap-2'>
                    <span
                      className='size-2.5 shrink-0 rounded-sm'
                      style={{ backgroundColor: 'var(--chart-1)' }}
                      aria-hidden
                    />
                    <span className='text-sm text-muted-foreground'>Yesterday</span>
                  </div>
                  <span className='mt-1 block text-2xl font-semibold text-foreground'>
                    {yesterdayVolumeTotal.toLocaleString('en-US')}
                  </span>
                </div>
              </dd>
              <div className='min-h-28 min-w-0 flex-1'>
                <SupportChart />
              </div>
            </div>
          </CardContent>
        </Card>
      </dl>

      <DataTable data={tickets} />
    </main>
  );
}
