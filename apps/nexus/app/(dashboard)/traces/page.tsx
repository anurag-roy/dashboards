'use client';

import * as React from 'react';
import { Separator } from '@workspace/ui/components/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@workspace/ui/components/select';
import { Input } from '@workspace/ui/components/input';
import { Button } from '@workspace/ui/components/button';
import { RotateCcw } from 'lucide-react';
import { cn } from '@workspace/ui/lib/utils';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@workspace/ui/components/accordion';

import { traces, type Trace } from '@/lib/data/traces';

import { columns } from './_components/columns';
import { DataTable } from './_components/DataTable';
import { TraceDetails } from './_components/TraceDetails';
import { FilterModel } from './_components/FilterModel';

const statusItems = [
  { value: 'all', label: 'All statuses' },
  { value: 'success', label: 'Success' },
  { value: 'error', label: 'Error' },
  { value: 'timeout', label: 'Timeout' },
];

const dateRangeItems = [
  { value: '1', label: 'Last 1h' },
  { value: '6', label: 'Last 6h' },
  { value: '24', label: 'Last 24h' },
  { value: '168', label: 'Last 7d' },
  { value: '720', label: 'Last 30d' },
];

export default function TracesPage() {
  const [selectedTrace, setSelectedTrace] = React.useState<Trace | null>(null);
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const [dateRange, setDateRange] = React.useState('720');
  const [selectedModels, setSelectedModels] = React.useState<string[]>([]);
  const [statusFilter, setStatusFilter] = React.useState('all');
  const [minLatency, setMinLatency] = React.useState('');

  const filteredTraces = React.useMemo(() => {
    let result = traces;

    // Date range
    const hours = Number(dateRange);
    const cutoff = new Date(Date.now() - hours * 60 * 60 * 1_000);
    result = result.filter((t) => new Date(t.timestamp) >= cutoff);

    // Model filter
    if (selectedModels.length > 0) {
      result = result.filter((t) => selectedModels.includes(t.model));
    }

    // Status filter
    if (statusFilter !== 'all') {
      result = result.filter((t) => t.status === statusFilter);
    }

    // Min latency
    const minMs = Number(minLatency);
    if (minMs > 0) {
      result = result.filter((t) => t.latencyMs >= minMs);
    }

    return result;
  }, [dateRange, selectedModels, statusFilter, minLatency]);

  const handleRowClick = React.useCallback((trace: Trace) => {
    setSelectedTrace(trace);
    setDrawerOpen(true);
  }, []);

  const handleReset = () => {
    setDateRange('720');
    setSelectedModels([]);
    setStatusFilter('all');
    setMinLatency('');
  };

  return (
    <div>
      <div>
        <h1 className='text-2xl font-semibold text-foreground'>Traces</h1>
        <p className='mt-1 text-sm text-muted-foreground'>
          Inspect individual LLM requests, prompts, completions, and performance metrics
        </p>
      </div>
      <Separator className='my-6' />

      {/* Mobile Filters */}
      <Accordion className='block border-border md:hidden' defaultValue={[]}>
        <AccordionItem value='filters' className='border-none'>
          <AccordionTrigger className='rounded-2xl px-3 py-2 text-sm'>Filters</AccordionTrigger>
          <AccordionContent className='pb-2'>
            <div className='flex flex-col gap-3'>
              <div className='w-full'>
                <label className='mb-1.5 block text-xs font-medium text-muted-foreground'>Time range</label>
                <Select value={dateRange} onValueChange={(v) => v && setDateRange(v)} items={dateRangeItems}>
                  <SelectTrigger className='w-full'>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {dateRangeItems.map((item) => (
                      <SelectItem key={item.value} value={item.value}>
                        {item.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <FilterModel
                selectedModels={selectedModels}
                onModelsChange={setSelectedModels}
                className='w-full'
                triggerClassName='w-full justify-between font-normal'
              />

              <div className='w-full'>
                <label className='mb-1.5 block text-xs font-medium text-muted-foreground'>Status</label>
                <Select value={statusFilter} onValueChange={(v) => v && setStatusFilter(v)} items={statusItems}>
                  <SelectTrigger className='w-full'>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {statusItems.map((item) => (
                      <SelectItem key={item.value} value={item.value}>
                        {item.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className='w-full'>
                <label className='mb-1.5 block text-xs font-medium text-muted-foreground'>Min latency (ms)</label>
                <Input
                  type='number'
                  placeholder='0'
                  value={minLatency}
                  onChange={(e) => setMinLatency(e.target.value)}
                  className='w-full'
                />
              </div>

              <Button variant='secondary' onClick={handleReset} className='w-full gap-1.5'>
                <RotateCcw className='size-3.5' aria-hidden='true' />
                Reset
              </Button>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      {/* Desktop Filterbar */}
      <div className='hidden items-end gap-3 md:flex md:flex-wrap'>
        <div className='w-auto'>
          <label className='mb-1.5 block text-xs font-medium text-muted-foreground'>Time range</label>
          <Select value={dateRange} onValueChange={(v) => v && setDateRange(v)} items={dateRangeItems}>
            <SelectTrigger className='w-[140px]'>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {dateRangeItems.map((item) => (
                <SelectItem key={item.value} value={item.value}>
                  {item.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <FilterModel
          selectedModels={selectedModels}
          onModelsChange={setSelectedModels}
          className='w-auto'
          triggerClassName='w-[180px] justify-between font-normal'
        />

        <div className='w-auto'>
          <label className='mb-1.5 block text-xs font-medium text-muted-foreground'>Status</label>
          <Select value={statusFilter} onValueChange={(v) => v && setStatusFilter(v)} items={statusItems}>
            <SelectTrigger className='w-[140px]'>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {statusItems.map((item) => (
                <SelectItem key={item.value} value={item.value}>
                  {item.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className='w-auto'>
          <label className='mb-1.5 block text-xs font-medium text-muted-foreground'>Min latency (ms)</label>
          <Input
            type='number'
            placeholder='0'
            value={minLatency}
            onChange={(e) => setMinLatency(e.target.value)}
            className='w-[120px]'
          />
        </div>

        <Button variant='secondary' onClick={handleReset} className='gap-1.5'>
          <RotateCcw className='size-3.5' aria-hidden='true' />
          Reset
        </Button>
      </div>

      <div className='mt-6'>
        <DataTable columns={columns} data={filteredTraces} onRowClick={handleRowClick} />
      </div>

      <TraceDetails trace={selectedTrace} open={drawerOpen} onOpenChange={setDrawerOpen} />
    </div>
  );
}
