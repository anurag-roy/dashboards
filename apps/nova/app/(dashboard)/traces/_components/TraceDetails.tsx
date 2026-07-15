'use client';

import * as React from 'react';
import { Badge } from '@workspace/ui/components/badge';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerClose,
} from '@workspace/ui/components/drawer';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@workspace/ui/components/dialog';
import { Separator } from '@workspace/ui/components/separator';
import { Database, X } from 'lucide-react';
import { Button } from '@workspace/ui/components/button';
import { CopyButton } from '@workspace/ui/components/copy-button';
import { InsightBadge } from '@workspace/ui/components/insight-badge';

import type { Trace } from '@/lib/data/traces';
import { modelMap } from '@/lib/data/models';
import { formatters } from '@/lib/utils';
import { cn } from '@/lib/utils';
import { useMediaQuery } from '@/lib/use-media-query';
import { ProviderLogo } from '@/components/ProviderLogo';
import { RouteOutcomeBadge } from './RouteOutcomeBadge';

type TraceDetailsProps = {
  trace: Trace | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

function MetaItem({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <p className='text-xs text-muted-foreground'>{label}</p>
      <p className='mt-0.5 text-sm font-medium text-foreground'>{value}</p>
    </div>
  );
}

function AttemptStatus({ status }: { status: Trace['attempts'][number]['status'] }) {
  const variant = status === 'success' ? 'success' : status === 'rate-limited' ? 'warning' : 'error';

  return (
    <InsightBadge variant={variant} className='capitalize'>
      {status.replace('-', ' ')}
    </InsightBadge>
  );
}

function RoutingPath({ trace }: { trace: Trace }) {
  return (
    <section>
      <div className='flex flex-wrap items-center justify-between gap-2'>
        <div className='flex items-center gap-2'>
          <p className='text-sm font-medium text-foreground'>Routing path</p>
          <RouteOutcomeBadge outcome={trace.routeOutcome} />
        </div>
        <p className='text-xs text-muted-foreground'>{trace.routePolicy.replace('-', ' ')} policy</p>
      </div>

      {trace.routeOutcome === 'cache' ? (
        <div className='mt-3 flex items-start gap-3 rounded-2xl border border-border bg-muted/30 p-4'>
          <div className='flex size-8 shrink-0 items-center justify-center rounded-full bg-muted'>
            <Database className='size-4 text-muted-foreground' aria-hidden='true' />
          </div>
          <div className='min-w-0 flex-1'>
            <p className='text-sm font-medium text-foreground'>Served from semantic cache</p>
            <p className='mt-1 text-xs leading-5 text-muted-foreground'>
              Nova returned a matching response at the edge without calling an upstream provider.
            </p>
          </div>
          <span className='shrink-0 text-sm font-medium text-foreground tabular-nums'>{trace.gatewayLatencyMs}ms</span>
        </div>
      ) : (
        <div className='mt-3 overflow-hidden rounded-2xl border border-border'>
          {trace.attempts.map((attempt, index) => {
            const attemptModel = modelMap[attempt.model];
            return (
              <div
                key={`${attempt.providerId}-${attempt.model}-${index}`}
                className='flex items-start gap-3 border-b border-border p-4 last:border-b-0'
              >
                <div className='flex size-7 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-medium text-muted-foreground tabular-nums'>
                  {index + 1}
                </div>
                <ProviderLogo providerId={attempt.providerId} size={18} className='mt-1' />
                <div className='min-w-0 flex-1'>
                  <div className='flex flex-wrap items-center gap-2'>
                    <p className='text-sm font-medium text-foreground'>{attemptModel?.name ?? attempt.model}</p>
                    <span className='text-xs text-muted-foreground'>via {attempt.provider}</span>
                  </div>
                  <p className='mt-1 text-xs text-muted-foreground'>
                    {attempt.region}
                    {attempt.timeToFirstTokenMs !== null
                      ? ` · ${attempt.timeToFirstTokenMs.toLocaleString()}ms TTFT`
                      : attempt.errorCode
                        ? ` · ${attempt.errorCode}`
                        : ''}
                  </p>
                </div>
                <div className='flex shrink-0 flex-col items-end gap-1'>
                  <AttemptStatus status={attempt.status} />
                  <span className='text-xs text-muted-foreground tabular-nums'>
                    {attempt.durationMs.toLocaleString()}ms
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}

function TraceContent({ trace }: { trace: Trace }) {
  const totalTokens = trace.promptTokens + trace.completionTokens;
  const promptPct = totalTokens > 0 ? Math.round((trace.promptTokens / totalTokens) * 100) : 0;

  return (
    <div className='overflow-y-auto px-4 pb-6 md:px-0 md:pb-0'>
      <div className='grid grid-cols-2 gap-4 sm:grid-cols-4'>
        <MetaItem label='Project' value={trace.project} />
        <MetaItem label='Environment' value={trace.environment} />
        <MetaItem label='Edge region' value={trace.region} />
        <MetaItem label='Cache' value={trace.cacheStatus} />
        <MetaItem label='End-to-end' value={`${trace.latencyMs.toLocaleString()}ms`} />
        <MetaItem
          label='Time to first token'
          value={trace.timeToFirstTokenMs === null ? 'Not available' : `${trace.timeToFirstTokenMs.toLocaleString()}ms`}
        />
        <MetaItem label='Gateway overhead' value={`${trace.gatewayLatencyMs.toLocaleString()}ms`} />
        <MetaItem label='Cost' value={formatters.currencyPrecise(trace.cost)} />
      </div>

      <Separator className='my-5' />

      <RoutingPath trace={trace} />

      <Separator className='my-5' />

      {/* Prompt Section */}
      <div>
        <div className='flex items-center justify-between'>
          <p className='text-sm font-medium text-foreground'>System Prompt</p>
          <CopyButton value={trace.systemPrompt} />
        </div>
        <div className='mt-2 rounded-2xl bg-muted/50 p-4 text-sm text-muted-foreground'>{trace.systemPrompt}</div>
      </div>

      <div className='mt-4'>
        <div className='flex items-center justify-between'>
          <p className='text-sm font-medium text-foreground'>User Prompt</p>
          <CopyButton value={trace.userPrompt} />
        </div>
        <div className='mt-2 rounded-2xl bg-muted/50 p-4 text-sm text-foreground'>{trace.userPrompt}</div>
      </div>

      <Separator className='my-5' />

      {/* Completion Section */}
      <div>
        <div className='flex items-center justify-between'>
          <p className='text-sm font-medium text-foreground'>Completion</p>
          <CopyButton value={trace.completion} />
        </div>
        <div className='mt-2 overflow-x-auto rounded-2xl bg-muted/50 p-4 text-sm text-foreground'>
          <pre className='font-sans whitespace-pre-wrap'>{trace.completion}</pre>
        </div>
      </div>

      <Separator className='my-5' />

      {/* Token Breakdown Bar */}
      <div>
        <div className='flex items-center justify-between gap-3'>
          <p className='text-sm font-medium text-foreground'>Token breakdown</p>
          <p className='text-xs text-muted-foreground'>
            {formatters.number(totalTokens)} total · {trace.finishReason} finish
          </p>
        </div>
        <div className='mt-3 flex h-2.5 w-full overflow-hidden rounded-full bg-muted'>
          <div className={cn('rounded-l-full bg-[var(--chart-1)]')} style={{ width: `${promptPct}%` }} />
          <div className={cn('rounded-r-full bg-[var(--chart-2)]')} style={{ width: `${100 - promptPct}%` }} />
        </div>
        <div className='mt-2 flex justify-between text-xs text-muted-foreground'>
          <span className='flex items-center gap-1.5'>
            <span className='inline-block size-2 rounded-sm bg-[var(--chart-1)]' />
            Prompt: {formatters.number(trace.promptTokens)} ({promptPct}%)
          </span>
          <span className='flex items-center gap-1.5'>
            <span className='inline-block size-2 rounded-sm bg-[var(--chart-2)]' />
            Completion: {formatters.number(trace.completionTokens)} ({100 - promptPct}%)
          </span>
        </div>
        <div className='mt-4 grid grid-cols-3 gap-4'>
          <MetaItem label='Temperature' value={trace.temperature} />
          <MetaItem label='Max tokens' value={formatters.number(trace.maxTokens)} />
          <MetaItem label='Top-p' value={trace.topP} />
        </div>
      </div>
    </div>
  );
}

export function TraceDetails({ trace, open, onOpenChange }: TraceDetailsProps) {
  const isDesktop = useMediaQuery('(min-width: 768px)');

  if (!trace) return null;

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className='max-h-[85vh] max-w-3xl overflow-y-auto sm:max-w-3xl'>
          <DialogHeader>
            <div className='flex flex-wrap items-center gap-3 pr-8'>
              <div className='flex items-center gap-1.5'>
                <DialogTitle className='font-mono text-sm'>{trace.traceId}</DialogTitle>
                <CopyButton value={trace.traceId} className='size-6' />
              </div>
              <Badge
                variant={trace.status === 'success' ? 'default' : 'destructive'}
                className='rounded-full capitalize'
              >
                {trace.status}
              </Badge>
              <span className='text-xs text-muted-foreground'>{modelMap[trace.model]?.name ?? trace.model}</span>
            </div>
            <DialogDescription className='sr-only'>Trace details for {trace.traceId}</DialogDescription>
          </DialogHeader>
          <TraceContent trace={trace} />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className='mx-auto max-h-[85vh] max-w-2xl'>
        <DrawerHeader className='text-left'>
          <div className='flex flex-wrap items-center gap-3 pr-10'>
            <div className='flex items-center gap-1.5'>
              <DrawerTitle className='font-mono text-sm'>{trace.traceId}</DrawerTitle>
              <CopyButton value={trace.traceId} className='size-6' />
            </div>
            <Badge variant={trace.status === 'success' ? 'default' : 'destructive'} className='rounded-full capitalize'>
              {trace.status}
            </Badge>
            <span className='text-xs text-muted-foreground'>{modelMap[trace.model]?.name ?? trace.model}</span>
          </div>
          <DrawerClose asChild>
            <Button variant='ghost' size='icon' className='absolute top-4 right-4 size-8'>
              <X />
              <span className='sr-only'>Close</span>
            </Button>
          </DrawerClose>
        </DrawerHeader>
        <DrawerDescription className='sr-only'>Trace details for {trace.traceId}</DrawerDescription>
        <TraceContent trace={trace} />
      </DrawerContent>
    </Drawer>
  );
}
