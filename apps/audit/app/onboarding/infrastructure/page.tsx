'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Building2, Cloud } from 'lucide-react';
import { Button } from '@workspace/ui/components/button';
import { Card } from '@workspace/ui/components/card';
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldLabel,
  FieldLegend,
  FieldSet,
  FieldTitle,
} from '@workspace/ui/components/field';
import { Input } from '@workspace/ui/components/input';
import { Label } from '@workspace/ui/components/label';
import { RadioGroup, RadioGroupItem } from '@workspace/ui/components/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@workspace/ui/components/select';
import { Slider } from '@workspace/ui/components/slider';

import { siteConfig } from '@/app/siteConfig';
import { choiceCardFieldClass, choiceCardFieldLabelClass } from '@/app/onboarding/choice-card-styles';

type Region = {
  value: string;
  label: string;
  multiplier: number;
};

type CloudProviderRegions = {
  aws: Region[];
  azure: Region[];
};

const regionOptions: CloudProviderRegions = {
  aws: [
    { value: 'us-east-2', label: 'Ohio (us-east-2)', multiplier: 1.0 },
    { value: 'us-east-1', label: 'N. Virginia (us-east-1)', multiplier: 1.1 },
    { value: 'eu-west-1', label: 'Ireland (eu-west-1)', multiplier: 1.2 },
    { value: 'ap-southeast-1', label: 'Singapore (ap-southeast-1)', multiplier: 1.3 },
  ],
  azure: [
    { value: 'eastus', label: 'East US (eastus)', multiplier: 1.0 },
    { value: 'eastus2', label: 'East US 2 (eastus2)', multiplier: 1.1 },
    { value: 'germanywestcentral', label: 'Germany West Central', multiplier: 1.3 },
    { value: 'switzerlandnorth', label: 'Switzerland North', multiplier: 1.4 },
  ],
};

const providers = [
  { value: 'aws', label: 'AWS', icon: Cloud },
  { value: 'azure', label: 'Azure', icon: Building2 },
] as const;

export default function OnboardingInfrastructurePage() {
  const router = useRouter();
  const [cloudProvider, setCloudProvider] = useState<keyof CloudProviderRegions>('aws');
  const [region, setRegion] = useState(regionOptions.aws[0]?.value ?? 'us-east-2');
  const [activeHours, setActiveHours] = useState([8]);
  const [storageVolume, setStorageVolume] = useState(20);
  const [compression, setCompression] = useState('false');

  useEffect(() => {
    const firstRegion = regionOptions[cloudProvider][0];
    if (firstRegion) {
      setRegion(firstRegion.value);
    }
  }, [cloudProvider]);

  const monthlyEstimate = useMemo(() => {
    const basePrices = { aws: 0.023, azure: 0.025 } as const;
    const activeHourMultiplier = 0.05;
    const compressionMultiplier = compression === 'true' ? 0.7 : 1.0;
    const basePrice = basePrices[cloudProvider];
    const selectedRegion = regionOptions[cloudProvider].find((item) => item.value === region);
    const regionMultiplier = selectedRegion?.multiplier ?? 1;

    const storagePrice = basePrice * storageVolume * regionMultiplier * compressionMultiplier;
    const activeHoursPrice = (activeHours[0] ?? 0) * activeHourMultiplier;
    const totalPerMonth = (storagePrice + activeHoursPrice) * 30 * 10;

    const low = Math.round(totalPerMonth * 0.8).toLocaleString();
    const high = Math.round(totalPerMonth * 1.2).toLocaleString();
    return `${low} - ${high} USD`;
  }, [activeHours, cloudProvider, compression, region, storageVolume]);

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        router.push(siteConfig.baseLinks.reports);
      }}
      className='space-y-7'
    >
      <div className='space-y-2'>
        <h1 className='text-2xl font-semibold text-foreground sm:text-3xl'>Create a compute cluster</h1>
        <p className='text-sm text-muted-foreground'>
          Choose your provider and baseline capacity to start ingesting data.
        </p>
      </div>

      <FieldSet>
        <FieldLegend variant='label'>Cloud provider</FieldLegend>
        <RadioGroup
          value={cloudProvider}
          onValueChange={(value) => setCloudProvider(value as keyof CloudProviderRegions)}
          className='grid grid-cols-1 gap-3 sm:grid-cols-2'
        >
          {providers.map((provider) => {
            const isSelected = cloudProvider === provider.value;

            return (
              <FieldLabel key={provider.value} htmlFor={provider.value} className={choiceCardFieldLabelClass}>
                <Field orientation='horizontal' className={choiceCardFieldClass(isSelected)}>
                  <FieldContent>
                    <FieldTitle className='min-w-0 gap-2'>
                      <provider.icon className='size-4 shrink-0 text-muted-foreground' aria-hidden='true' />
                      <span className='truncate'>{provider.label}</span>
                    </FieldTitle>
                    <FieldDescription>{regionOptions[provider.value].length} regions available</FieldDescription>
                  </FieldContent>
                  <RadioGroupItem id={provider.value} value={provider.value} />
                </Field>
              </FieldLabel>
            );
          })}
        </RadioGroup>
      </FieldSet>

      <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
        <div className='space-y-2'>
          <Label htmlFor='storage'>Storage (GB)</Label>
          <Input
            id='storage'
            type='number'
            min={6}
            max={128}
            value={storageVolume}
            onChange={(event) => {
              const value = Number(event.target.value);
              if (Number.isNaN(value)) {
                return;
              }
              setStorageVolume(Math.min(128, Math.max(6, value)));
            }}
          />
        </div>

        <FieldSet>
          <FieldLegend variant='label'>Auto-compress data?</FieldLegend>
          <RadioGroup
            value={compression}
            onValueChange={(value) => setCompression(value)}
            className='flex flex-col gap-3'
          >
            <Field orientation='horizontal'>
              <RadioGroupItem id='compression-yes' value='true' />
              <FieldLabel htmlFor='compression-yes' className='font-normal'>
                Yes
              </FieldLabel>
            </Field>
            <Field orientation='horizontal'>
              <RadioGroupItem id='compression-no' value='false' />
              <FieldLabel htmlFor='compression-no' className='font-normal'>
                No
              </FieldLabel>
            </Field>
          </RadioGroup>
        </FieldSet>
      </div>

      <div className='space-y-2'>
        <Label htmlFor='region'>Region</Label>
        <Select
          value={region}
          items={regionOptions[cloudProvider]}
          onValueChange={(value) => {
            if (value) {
              setRegion(value);
            }
          }}
        >
          <SelectTrigger id='region' className='w-full'>
            <SelectValue />
          </SelectTrigger>
          <SelectContent align='start'>
            {regionOptions[cloudProvider].map((option) => (
              <SelectItem key={option.value} value={option.value} label={option.label}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className='space-y-2'>
        <Label htmlFor='active-hours'>Active hours per day</Label>
        <div className='flex items-center gap-3'>
          <Slider
            id='active-hours'
            min={1}
            max={24}
            step={1}
            value={activeHours}
            onValueChange={(value) => {
              const nextValue = Array.isArray(value) ? (value[0] ?? 8) : (value as number);
              if (Array.isArray(value)) {
                setActiveHours([value[0] ?? 8]);
              } else {
                setActiveHours([nextValue]);
              }
            }}
          />
          <span className='inline-flex h-8 min-w-12 items-center justify-center rounded-2xl border border-border bg-background px-2 text-sm text-foreground tabular-nums'>
            {activeHours[0]}h
          </span>
        </div>
      </div>

      <Card className='p-5'>
        <p className='text-sm text-muted-foreground'>Estimated monthly cost</p>
        <p className='mt-1 text-3xl font-semibold text-foreground sm:text-4xl'>{monthlyEstimate}</p>
      </Card>

      <div className='fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/95 px-4 py-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] backdrop-blur supports-[backdrop-filter]:bg-background/80 md:static md:border-0 md:bg-transparent md:p-0 md:backdrop-blur-none'>
        <div className='mx-auto flex w-full max-w-2xl justify-between gap-2'>
          <Button
            type='button'
            variant='ghost'
            onClick={() => {
              router.push(siteConfig.baseLinks.onboarding.employees);
            }}
          >
            Back
          </Button>
          <Button type='submit' className='min-w-24'>
            Continue
          </Button>
        </div>
      </div>
    </form>
  );
}
