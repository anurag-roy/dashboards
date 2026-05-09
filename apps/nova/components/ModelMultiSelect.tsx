'use client';

import * as React from 'react';
import { Button } from '@workspace/ui/components/button';
import { Checkbox } from '@workspace/ui/components/checkbox';
import { Input } from '@workspace/ui/components/input';
import { Popover, PopoverContent, PopoverTrigger } from '@workspace/ui/components/popover';
import { ChevronDown } from 'lucide-react';

import { modelsByProvider } from '@/lib/data/models';
import { ProviderLogo } from '@/components/ProviderLogo';
import { cn } from '@workspace/ui/lib/utils';

type ModelMultiSelectProps = {
  selectedModels: string[];
  onModelsChange: (models: string[]) => void;
  allLabel?: string;
  className?: string;
  contentAlign?: 'start' | 'center' | 'end';
  label?: string;
  maxSelected?: number;
  minSelected?: number;
  showLimit?: boolean;
  triggerClassName?: string;
  triggerText?: (count: number) => React.ReactNode;
};

export function ModelMultiSelect({
  selectedModels,
  onModelsChange,
  allLabel = 'All models',
  className,
  contentAlign = 'start',
  label,
  maxSelected,
  minSelected = 0,
  showLimit = false,
  triggerClassName,
  triggerText,
}: ModelMultiSelectProps) {
  const idPrefix = React.useId().replace(/:/g, '');
  const [searchTerm, setSearchTerm] = React.useState('');

  const filteredProviders = React.useMemo(() => {
    const normalized = searchTerm.toLowerCase().trim();
    if (!normalized) {
      return modelsByProvider;
    }

    return modelsByProvider
      .map((group) => ({
        ...group,
        models: group.models.filter((model) => model.name.toLowerCase().includes(normalized)),
      }))
      .filter((group) => group.provider.toLowerCase().includes(normalized) || group.models.length > 0);
  }, [searchTerm]);

  const selectedCount = selectedModels.length;
  const labelText = triggerText?.(selectedCount) ?? (selectedCount === 0 ? allLabel : `${selectedCount} selected`);

  return (
    <div className={className}>
      {label ? <label className='mb-1.5 block text-xs font-medium text-muted-foreground'>{label}</label> : null}
      <Popover>
        <PopoverTrigger
          render={
            <Button
              type='button'
              variant='secondary'
              className={cn('w-full justify-between gap-2 font-normal', triggerClassName)}
            >
              <span className='truncate'>{labelText}</span>
              <span className='inline-flex items-center gap-1'>
                {showLimit && maxSelected ? (
                  <span className='rounded-full bg-muted px-2 py-0.5 text-xs text-foreground tabular-nums'>
                    {selectedCount}/{maxSelected}
                  </span>
                ) : selectedCount > 0 ? (
                  <span className='rounded-full bg-muted px-2 py-0.5 text-xs text-foreground tabular-nums'>
                    {selectedCount}
                  </span>
                ) : null}
                <ChevronDown className='size-3.5 text-muted-foreground' aria-hidden='true' />
              </span>
            </Button>
          }
        />
        <PopoverContent align={contentAlign} className='w-[min(24rem,calc(100vw-2rem))] gap-3 p-3'>
          <div>
            <Input
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder='Search provider or model'
            />
            {maxSelected ? (
              <p className='mt-2 text-xs text-muted-foreground'>Choose up to {maxSelected} models to compare.</p>
            ) : null}
          </div>

          <div className='max-h-80 space-y-4 overflow-y-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden'>
            {filteredProviders.length === 0 ? (
              <p className='text-sm text-muted-foreground'>No matching model.</p>
            ) : (
              filteredProviders.map((group) => {
                const allSelected =
                  group.models.length > 0 && group.models.every((model) => selectedModels.includes(model.id));
                const someSelected = group.models.some((model) => selectedModels.includes(model.id));
                const selectedInGroupCount = group.models.filter((model) => selectedModels.includes(model.id)).length;
                const missingGroupModels = group.models.filter((model) => !selectedModels.includes(model.id));
                const providerSelectionDisabled = Boolean(
                  maxSelected && !allSelected && selectedCount + missingGroupModels.length > maxSelected
                );
                const providerDeselectionDisabled =
                  selectedInGroupCount > 0 && selectedCount - selectedInGroupCount < minSelected;
                const providerDisabled = providerSelectionDisabled || providerDeselectionDisabled;
                const providerId = `${idPrefix}-provider-${group.provider.replace(/\s+/g, '-')}`;

                return (
                  <div key={group.provider} className='space-y-2'>
                    <label
                      htmlFor={providerId}
                      aria-disabled={providerDisabled}
                      className={cn(
                        '-mx-0.5 flex cursor-pointer items-center gap-2 rounded-xl px-2 py-1.5 transition-colors hover:bg-foreground/10',
                        providerDisabled && 'cursor-not-allowed opacity-50 hover:bg-transparent'
                      )}
                    >
                      <Checkbox
                        id={providerId}
                        checked={allSelected}
                        indeterminate={!allSelected && someSelected}
                        disabled={providerDisabled}
                        onCheckedChange={(checked) => {
                          const next = new Set(selectedModels);
                          if (checked === true) {
                            group.models.forEach((model) => next.add(model.id));
                          } else {
                            group.models.forEach((model) => next.delete(model.id));
                          }

                          const nextModels = Array.from(next).slice(0, maxSelected ?? undefined);
                          if (nextModels.length >= minSelected) {
                            onModelsChange(nextModels);
                          }
                        }}
                      />
                      <ProviderLogo providerId={group.providerId} size={14} className='opacity-70' />
                      <span className='min-w-0 flex-1 text-sm font-medium'>{group.provider}</span>
                    </label>

                    <div className='ml-5 space-y-1'>
                      {group.models.map((model) => {
                        const checked = selectedModels.includes(model.id);
                        const disabled = Boolean(
                          (!checked && maxSelected && selectedCount >= maxSelected) ||
                          (checked && selectedCount <= minSelected)
                        );
                        const modelId = `${idPrefix}-model-${model.id}`;

                        return (
                          <label
                            key={model.id}
                            htmlFor={modelId}
                            aria-disabled={disabled}
                            className={cn(
                              'flex cursor-pointer items-center gap-2 rounded-lg py-1.5 pr-2 pl-2 transition-colors hover:bg-foreground/10',
                              disabled && 'cursor-not-allowed opacity-50 hover:bg-transparent'
                            )}
                          >
                            <Checkbox
                              id={modelId}
                              checked={checked}
                              disabled={disabled}
                              onCheckedChange={(nextChecked) => {
                                const next = new Set(selectedModels);
                                if (nextChecked === true) {
                                  if (maxSelected && next.size >= maxSelected) {
                                    return;
                                  }
                                  next.add(model.id);
                                } else {
                                  next.delete(model.id);
                                }

                                const nextModels = Array.from(next);
                                if (nextModels.length >= minSelected) {
                                  onModelsChange(nextModels);
                                }
                              }}
                            />
                            <span className='min-w-0 flex-1 truncate text-sm font-normal'>{model.name}</span>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
