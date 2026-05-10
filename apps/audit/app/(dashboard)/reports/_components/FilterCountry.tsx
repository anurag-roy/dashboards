import { useEffect, useMemo, useState } from 'react';
import { Button } from '@workspace/ui/components/button';
import { Checkbox } from '@workspace/ui/components/checkbox';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@workspace/ui/components/dialog';
import { Input } from '@workspace/ui/components/input';
import { Label } from '@workspace/ui/components/label';
import { Popover, PopoverContent, PopoverTrigger } from '@workspace/ui/components/popover';

import { locations } from '@/lib/data/schema';
import { useMediaQuery } from '@/lib/use-media-query';

type FilterCountryProps = {
  selectedCountries: string[];
  onCountriesChange: (countries: string[]) => void;
};

export function FilterCountry({ selectedCountries, onCountriesChange }: FilterCountryProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [draftCountries, setDraftCountries] = useState<string[]>(selectedCountries);
  const isDesktop = useMediaQuery('(min-width: 768px)');

  useEffect(() => {
    setDraftCountries(selectedCountries);
  }, [selectedCountries]);

  const filteredLocations = useMemo(() => {
    const normalized = searchTerm.toLowerCase().trim();
    if (!normalized) {
      return locations;
    }

    return locations
      .map((location) => ({
        ...location,
        countries: location.countries.filter((country) => country.toLowerCase().includes(normalized)),
      }))
      .filter(
        (location) =>
          location.name.toLowerCase().includes(normalized) ||
          location.countries.some((country) => country.toLowerCase().includes(normalized))
      );
  }, [searchTerm]);

  const activeCountries = isDesktop ? selectedCountries : draftCountries;
  const selectedCount = selectedCountries.length;

  const setCountries = (countries: string[]) => {
    if (isDesktop) {
      onCountriesChange(countries);
      return;
    }

    setDraftCountries(countries);
  };

  const trigger = (
    <Button variant='secondary' className='w-full justify-between bg-input/50 font-normal md:w-48'>
      <span>Selected locations</span>
      <span className='rounded-full bg-muted px-2 py-0.5 text-xs text-foreground tabular-nums'>{selectedCount}</span>
    </Button>
  );

  const locationControls = (
    <>
      <Input
        value={searchTerm}
        onChange={(event) => setSearchTerm(event.target.value)}
        placeholder='Search continent or country'
      />

      <div className='max-h-72 space-y-4 overflow-y-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden'>
        {filteredLocations.length === 0 ? (
          <p className='text-sm text-muted-foreground'>No matching location.</p>
        ) : (
          filteredLocations.map((location) => {
            const allSelected = location.countries.every((country) => activeCountries.includes(country));
            const someSelected = location.countries.some((country) => activeCountries.includes(country));
            const continentId = `continent-${location.name.replace(/\s+/g, '-')}`;

            return (
              <div key={location.name} className='space-y-2'>
                <label
                  htmlFor={continentId}
                  className='-mx-0.5 flex cursor-pointer items-center gap-2 rounded-xl px-2 py-1.5 transition-colors hover:bg-foreground/10'
                >
                  <Checkbox
                    id={continentId}
                    checked={allSelected}
                    indeterminate={!allSelected && someSelected}
                    onCheckedChange={(checked) => {
                      const next = new Set(activeCountries);
                      if (checked === true) {
                        location.countries.forEach((country) => next.add(country));
                      } else {
                        location.countries.forEach((country) => next.delete(country));
                      }
                      setCountries(Array.from(next));
                    }}
                  />
                  <span className='min-w-0 flex-1 text-sm font-medium'>{location.name}</span>
                </label>

                <div className='ml-5 space-y-1'>
                  {location.countries.map((country) => {
                    const checked = activeCountries.includes(country);
                    const countryId = `country-${country.replace(/\s+/g, '-')}`;

                    return (
                      <label
                        key={country}
                        htmlFor={countryId}
                        className='flex cursor-pointer items-center gap-2 rounded-lg py-1.5 pr-2 pl-2 transition-colors hover:bg-foreground/10'
                      >
                        <Checkbox
                          id={countryId}
                          checked={checked}
                          onCheckedChange={(nextChecked) => {
                            const next = new Set(activeCountries);
                            if (nextChecked === true) {
                              next.add(country);
                            } else {
                              next.delete(country);
                            }
                            setCountries(Array.from(next));
                          }}
                        />
                        <span className='min-w-0 flex-1 text-sm font-normal'>{country}</span>
                      </label>
                    );
                  })}
                </div>
              </div>
            );
          })
        )}
      </div>
    </>
  );

  return (
    <div className='space-y-1.5'>
      <Label htmlFor='location-filter' className='h-4 font-medium'>
        Locations
      </Label>
      {isDesktop ? (
        <Popover>
          <PopoverTrigger id='location-filter' render={trigger} />
          <PopoverContent align='end' className='w-[min(22rem,calc(100vw-2rem))] gap-3 p-3'>
            {locationControls}
          </PopoverContent>
        </Popover>
      ) : (
        <Dialog
          open={dialogOpen}
          onOpenChange={(open) => {
            setDialogOpen(open);
            setDraftCountries(selectedCountries);
            setSearchTerm('');
          }}
        >
          <DialogTrigger id='location-filter' render={trigger} />
          <DialogContent className='max-h-[calc(100svh-2rem)] overflow-y-auto rounded-3xl p-5' showCloseButton={false}>
            <DialogHeader>
              <DialogTitle>Locations</DialogTitle>
              <DialogDescription>Select the countries included in this report.</DialogDescription>
            </DialogHeader>
            <div className='grid gap-3'>{locationControls}</div>
            <DialogFooter className='border-t border-border/70 pt-4'>
              <Button
                variant='secondary'
                onClick={() => {
                  setDraftCountries(selectedCountries);
                  setDialogOpen(false);
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={() => {
                  onCountriesChange(draftCountries);
                  setDialogOpen(false);
                }}
              >
                Apply
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
