'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Badge } from '@workspace/ui/components/badge';
import { Button } from '@workspace/ui/components/button';
import { Checkbox } from '@workspace/ui/components/checkbox';
import {
  Field,
  FieldContent,
  FieldLabel,
  FieldLegend,
  FieldSet,
  FieldTitle,
} from '@workspace/ui/components/field';

import { siteConfig } from '@/app/siteConfig';
import { choiceCardFieldClass, choiceCardFieldLabelClass } from '@/app/onboarding/choice-card-styles';

type Category = {
  id: string;
  title: string;
  subcategories: string[];
};

const categories: Category[] = [
  {
    id: 'analytics',
    title: 'User Analytics',
    subcategories: ['User segmentation', 'Cohort analysis', 'Retention analysis'],
  },
  {
    id: 'events',
    title: 'Event Tracking',
    subcategories: ['Custom events', 'Automated events', 'Event funnels'],
  },
  {
    id: 'ab-testing',
    title: 'A/B Testing',
    subcategories: ['Experiment setup', 'Variant analysis', 'Reporting'],
  },
  {
    id: 'journeys',
    title: 'User Journeys',
    subcategories: ['Journey mapping', 'Conversion paths', 'Drop-off analysis'],
  },
  {
    id: 'engagement',
    title: 'Engagement Tracking',
    subcategories: ['Email campaigns', 'Push notifications', 'In-app messages'],
  },
  {
    id: 'data',
    title: 'Data Management',
    subcategories: ['Data import', 'Data export', 'Integrations'],
  },
];

export default function OnboardingProductsPage() {
  const router = useRouter();
  const [selected, setSelected] = useState<Record<string, boolean>>({});

  const hasSelection = useMemo(() => Object.values(selected).some(Boolean), [selected]);

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        if (!hasSelection) {
          return;
        }
        router.push(siteConfig.baseLinks.onboarding.employees);
      }}
      className='space-y-6'
    >
      <div className='space-y-2'>
        <h1 className='text-2xl font-semibold text-foreground sm:text-3xl'>Which products are you interested in?</h1>
        <p className='text-sm text-muted-foreground'>
          Select one or more to personalize your onboarding flow and default dashboards.
        </p>
      </div>

      <FieldSet>
        <FieldLegend className='sr-only'>Select products you are interested in</FieldLegend>
        <div data-slot='checkbox-group' className='flex flex-col gap-3'>
          {categories.map((category) => {
            const isChecked = selected[category.id] ?? false;

            return (
              <FieldLabel key={category.id} htmlFor={category.id} className={choiceCardFieldLabelClass}>
                <Field orientation='horizontal' className={choiceCardFieldClass(isChecked)}>
                  <FieldContent>
                    <FieldTitle>{category.title}</FieldTitle>
                    <div className='flex flex-wrap gap-1.5'>
                      {category.subcategories.map((subcategory) => (
                        <Badge key={subcategory} variant='secondary'>
                          {subcategory}
                        </Badge>
                      ))}
                    </div>
                  </FieldContent>
                  <Checkbox
                    id={category.id}
                    checked={isChecked}
                    onCheckedChange={(checked) => {
                      setSelected((previous) => ({
                        ...previous,
                        [category.id]: checked === true,
                      }));
                    }}
                  />
                </Field>
              </FieldLabel>
            );
          })}
        </div>
      </FieldSet>

      <div className='flex justify-end'>
        <Button type='submit' disabled={!hasSelection}>
          Continue
        </Button>
      </div>
    </form>
  );
}
