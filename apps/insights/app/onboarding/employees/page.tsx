'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@workspace/ui/components/button';
import { Field, FieldContent, FieldLabel, FieldLegend, FieldSet, FieldTitle } from '@workspace/ui/components/field';
import { RadioGroup, RadioGroupItem } from '@workspace/ui/components/radio-group';

import { siteConfig } from '@/app/siteConfig';
import { choiceCardFieldClass, choiceCardFieldLabelClass } from '@/app/onboarding/choice-card-styles';

const employeeCounts = [
  { value: '1', label: '1' },
  { value: '2-5', label: '2-5' },
  { value: '6-20', label: '6-20' },
  { value: '21-100', label: '21-100' },
  { value: '101-500', label: '101-500' },
  { value: '501+', label: '501+' },
] as const;

export default function OnboardingEmployeesPage() {
  const router = useRouter();
  const [selectedEmployeeCount, setSelectedEmployeeCount] = useState('');

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        if (!selectedEmployeeCount) {
          return;
        }
        router.push(siteConfig.baseLinks.onboarding.infrastructure);
      }}
      className='space-y-6'
    >
      <div className='space-y-2'>
        <h1 className='text-2xl font-semibold text-foreground sm:text-3xl'>
          How many employees does your company have?
        </h1>
        <p className='text-sm text-muted-foreground'>This helps us tune sensible defaults for limits and workflows.</p>
      </div>

      <FieldSet>
        <FieldLegend className='sr-only'>Select number of employees</FieldLegend>
        <RadioGroup
          value={selectedEmployeeCount}
          onValueChange={(value) => setSelectedEmployeeCount(value)}
          className='grid grid-cols-1 gap-3'
          required
        >
          {employeeCounts.map((count) => {
            const isSelected = selectedEmployeeCount === count.value;

            return (
              <FieldLabel key={count.value} htmlFor={count.value} className={choiceCardFieldLabelClass}>
                <Field orientation='horizontal' className={choiceCardFieldClass(isSelected)}>
                  <FieldContent>
                    <FieldTitle>{count.label}</FieldTitle>
                  </FieldContent>
                  <RadioGroupItem value={count.value} id={count.value} />
                </Field>
              </FieldLabel>
            );
          })}
        </RadioGroup>
      </FieldSet>

      <div className='flex justify-between gap-2'>
        <Button
          type='button'
          variant='ghost'
          onClick={() => {
            router.push(siteConfig.baseLinks.onboarding.products);
          }}
        >
          Back
        </Button>
        <Button type='submit' disabled={!selectedEmployeeCount}>
          Continue
        </Button>
      </div>
    </form>
  );
}
