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
import { X } from 'lucide-react';
import { Button } from '@workspace/ui/components/button';
import { CopyButton } from '@workspace/ui/components/copy-button';

import type { Trace } from '@/lib/data/traces';
import { modelMap } from '@/lib/data/models';
import { formatters } from '@/lib/utils';
import { cn } from '@/lib/utils';
import { useMediaQuery } from '@/lib/use-media-query';

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

function TraceContent({ trace }: { trace: Trace }) {
  const model = modelMap[trace.model];
  const totalTokens = trace.promptTokens + trace.completionTokens;
  const promptPct = totalTokens > 0 ? Math.round((trace.promptTokens / totalTokens) * 100) : 0;

  return (
    <div className='overflow-y-auto px-4 pb-6 md:px-0 md:pb-0'>
      {/* Metadata Grid */}
      <div className='grid grid-cols-2 gap-4 sm:grid-cols-4'>
        <MetaItem label='Model' value={model?.name ?? trace.model} />
        <MetaItem label='Latency' value={`${trace.latencyMs.toLocaleString()}ms`} />
        <MetaItem label='Total Tokens' value={formatters.number(totalTokens)} />
        <MetaItem label='Cost' value={formatters.currencyPrecise(trace.cost)} />
        <MetaItem label='Temperature' value={trace.temperature} />
        <MetaItem label='Max Tokens' value={formatters.number(trace.maxTokens)} />
        <MetaItem label='Top-p' value={trace.topP} />
        <MetaItem label='Timestamp' value={formatters.dateTime(trace.timestamp)} />
      </div>

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
        <p className='text-sm font-medium text-foreground'>Token Breakdown</p>
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
        <DialogContent className='max-h-[85vh] max-w-2xl overflow-y-auto sm:max-w-2xl'>
          <DialogHeader>
            <div className='flex items-center gap-3'>
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
          <div className='flex items-center gap-3'>
            <div className='flex items-center gap-1.5'>
              <DrawerTitle className='font-mono text-sm'>{trace.traceId}</DrawerTitle>
              <CopyButton value={trace.traceId} className='size-6' />
            </div>
            <Badge variant={trace.status === 'success' ? 'default' : 'destructive'} className='rounded-full capitalize'>
              {trace.status}
            </Badge>
          </div>
          <DrawerClose asChild>
            <Button variant='ghost' size='icon' className='absolute top-4 right-4 size-8'>
              <X className='size-4' />
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
