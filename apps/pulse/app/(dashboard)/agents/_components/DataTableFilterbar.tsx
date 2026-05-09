'use client';

import { useDebouncedCallback } from 'use-debounce';
import { useRef, useState } from 'react';
import { Button } from '@workspace/ui/components/button';
import { Input } from '@workspace/ui/components/input';
import { Label } from '@workspace/ui/components/label';
import { Switch } from '@workspace/ui/components/switch';

import { cn } from '@/lib/utils';

interface DataTableFilterbarProps {
  globalFilter: string;
  setGlobalFilter: (value: string) => void;
  registeredOnly: boolean;
  setRegisteredOnly: (checked: boolean) => void;
}

export function DataTableFilterbar({
  globalFilter,
  setGlobalFilter,
  registeredOnly,
  setRegisteredOnly,
}: DataTableFilterbarProps) {
  const [searchTerm, setSearchTerm] = useState(globalFilter);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const debouncedSetGlobalFilter = useDebouncedCallback((value: string) => {
    setGlobalFilter(value);
  }, 300);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearchTerm(value);
    debouncedSetGlobalFilter(value);
  };

  const handleClear = () => {
    setSearchTerm('');
    setGlobalFilter('');
    searchInputRef.current?.focus();
  };

  return (
    <div
      className={cn(
        'flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-border bg-muted/40 p-4 shadow-sm'
      )}
    >
      <div className='flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center'>
        <Input
          ref={searchInputRef}
          className='h-9 w-full sm:w-96'
          type='search'
          placeholder='Search agents...'
          value={searchTerm ?? ''}
          onChange={handleSearchChange}
        />
        {searchTerm ? (
          <Button
            type='button'
            variant='ghost'
            size='sm'
            className='shrink-0 text-muted-foreground'
            onClick={handleClear}
          >
            Clear
          </Button>
        ) : null}
      </div>
      <div className='flex items-center gap-2.5'>
        <Switch
          id='overview-agents-registered-only'
          checked={registeredOnly}
          onCheckedChange={(checked) => setRegisteredOnly(checked === true)}
        />
        <Label htmlFor='overview-agents-registered-only' className='cursor-pointer text-sm font-normal text-foreground'>
          Registered only
        </Label>
      </div>
    </div>
  );
}
