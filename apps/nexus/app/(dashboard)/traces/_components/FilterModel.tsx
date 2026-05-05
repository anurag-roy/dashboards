import { useMemo, useState } from 'react';
import { Button } from '@workspace/ui/components/button';
import { Checkbox } from '@workspace/ui/components/checkbox';
import { Input } from '@workspace/ui/components/input';
import { Popover, PopoverContent, PopoverTrigger } from '@workspace/ui/components/popover';
import { modelsByProvider } from '@/lib/data/models';
import { ProviderLogo } from '@/components/ProviderLogo';

type FilterModelProps = {
  selectedModels: string[];
  onModelsChange: (models: string[]) => void;
  className?: string;
  triggerClassName?: string;
};

export function FilterModel({ selectedModels, onModelsChange, className, triggerClassName }: FilterModelProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredProviders = useMemo(() => {
    const normalized = searchTerm.toLowerCase().trim();
    if (!normalized) {
      return modelsByProvider;
    }

    return modelsByProvider
      .map((group) => ({
        ...group,
        models: group.models.filter((m) => m.name.toLowerCase().includes(normalized)),
      }))
      .filter((group) => group.provider.toLowerCase().includes(normalized) || group.models.length > 0);
  }, [searchTerm]);

  const selectedCount = selectedModels.length;

  return (
    <div className={className}>
      <label className='mb-1.5 block text-xs font-medium text-muted-foreground'>Model</label>
      <Popover>
        <PopoverTrigger
          render={
            <Button variant='secondary' className={triggerClassName || 'w-full justify-between font-normal'}>
              <span>{selectedCount === 0 ? 'All models' : `${selectedCount} selected`}</span>
              {selectedCount > 0 && (
                <span className='rounded-full bg-muted px-2 py-0.5 text-xs text-foreground tabular-nums'>
                  {selectedCount}
                </span>
              )}
            </Button>
          }
        />
        <PopoverContent align='start' className='w-[min(22rem,calc(100vw-2rem))] gap-3 p-3'>
          <Input
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder='Search provider or model'
          />

          <div className='max-h-72 space-y-4 overflow-y-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden'>
            {filteredProviders.length === 0 ? (
              <p className='text-sm text-muted-foreground'>No matching model.</p>
            ) : (
              filteredProviders.map((group) => {
                const allSelected = group.models.length > 0 && group.models.every((m) => selectedModels.includes(m.id));
                const someSelected = group.models.some((m) => selectedModels.includes(m.id));
                const providerId = `provider-${group.provider.replace(/\s+/g, '-')}`;

                return (
                  <div key={group.provider} className='space-y-2'>
                    <label
                      htmlFor={providerId}
                      className='-mx-0.5 flex cursor-pointer items-center gap-2 rounded-xl px-2 py-1.5 transition-colors hover:bg-foreground/10'
                    >
                      <Checkbox
                        id={providerId}
                        checked={allSelected}
                        indeterminate={!allSelected && someSelected}
                        onCheckedChange={(checked) => {
                          const next = new Set(selectedModels);
                          if (checked === true) {
                            group.models.forEach((m) => next.add(m.id));
                          } else {
                            group.models.forEach((m) => next.delete(m.id));
                          }
                          onModelsChange(Array.from(next));
                        }}
                      />
                      <ProviderLogo providerId={group.providerId} size={14} className='opacity-70' />
                      <span className='min-w-0 flex-1 text-sm font-medium'>{group.provider}</span>
                    </label>

                    <div className='ml-5 space-y-1'>
                      {group.models.map((model) => {
                        const checked = selectedModels.includes(model.id);
                        const mId = `model-${model.id}`;

                        return (
                          <label
                            key={model.id}
                            htmlFor={mId}
                            className='flex cursor-pointer items-center gap-2 rounded-lg py-1.5 pr-2 pl-2 transition-colors hover:bg-foreground/10'
                          >
                            <Checkbox
                              id={mId}
                              checked={checked}
                              onCheckedChange={(nextChecked) => {
                                const next = new Set(selectedModels);
                                if (nextChecked === true) {
                                  next.add(model.id);
                                } else {
                                  next.delete(model.id);
                                }
                                onModelsChange(Array.from(next));
                              }}
                            />
                            <span className='min-w-0 flex-1 text-sm font-normal'>{model.name}</span>
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
