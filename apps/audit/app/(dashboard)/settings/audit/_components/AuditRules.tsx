'use client';

import { useState, type FormEvent } from 'react';
import { ArrowDownToDot, CircleArrowOutUpRight, CirclePause, CirclePlay, Settings, SquareFunction } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@workspace/ui/components/accordion';
import { Badge } from '@workspace/ui/components/badge';
import { Button } from '@workspace/ui/components/button';
import { Card, CardContent, CardHeader, CardTitle } from '@workspace/ui/components/card';
import { Input } from '@workspace/ui/components/input';
import { Label } from '@workspace/ui/components/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@workspace/ui/components/select';
import { Separator } from '@workspace/ui/components/separator';
import { toast } from '@workspace/ui/components/sonner';

const ruleSteps = [
  {
    id: 'event',
    title: 'Transaction has been made',
    description: 'Applies across all employees',
    icon: ArrowDownToDot,
    iconClassName:
      'bg-chart-1/20 text-chart-4 ring-1 ring-inset ring-chart-1/25 dark:bg-chart-1/10 dark:text-chart-1 dark:ring-chart-1/20',
  },
  {
    id: 'condition',
    title: 'Is greater than USD 75',
    description: 'Applies to all merchant categories',
    icon: SquareFunction,
    iconClassName:
      'bg-chart-2/15 text-chart-3 ring-1 ring-inset ring-chart-2/20 dark:bg-chart-2/10 dark:text-chart-2 dark:ring-chart-2/15',
  },
  {
    id: 'action',
    title: 'Require receipt',
    description: 'Within 15 days',
    icon: CircleArrowOutUpRight,
    iconClassName:
      'bg-chart-3/20 text-chart-5 ring-1 ring-inset ring-chart-3/25 dark:bg-chart-3/15 dark:text-chart-3 dark:ring-chart-3/20',
  },
] as const;

const eventOptions = [
  { value: 'attachment', label: 'Attachment received' },
  { value: 'payment', label: 'Payment made' },
  { value: 'transfer', label: 'Transfer made' },
] as const;

const conditionOptions = [
  { value: 'greater-than', label: 'is greater than' },
  { value: 'equal-to', label: 'is equal to' },
  { value: 'less-than', label: 'is less than' },
] as const;

const actionOptions = [
  { value: 'require-receipt', label: 'Require receipt' },
  { value: 'require-approval', label: 'Require approval' },
  { value: 'block', label: 'Block transaction' },
] as const;

type RuleDraft = {
  name: string;
  event: (typeof eventOptions)[number]['value'];
  condition: (typeof conditionOptions)[number]['value'];
  threshold: string;
  action: (typeof actionOptions)[number]['value'];
};

const initialRule: RuleDraft = {
  name: 'IRS receipt rule',
  event: 'payment',
  condition: 'greater-than',
  threshold: '75',
  action: 'require-receipt',
};

const defaultDraft: RuleDraft = {
  name: '',
  event: eventOptions[0].value,
  condition: conditionOptions[0].value,
  threshold: '75',
  action: actionOptions[0].value,
};

function optionLabel(options: readonly { value: string; label: string }[], value: string) {
  return options.find((option) => option.value === value)?.label ?? value;
}

function sentenceCase(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

export default function AuditRules() {
  const [activeRule, setActiveRule] = useState<RuleDraft>(initialRule);
  const [ruleDraft, setRuleDraft] = useState<RuleDraft>(defaultDraft);
  const [isPaused, setIsPaused] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const appliedRuleSteps = [
    {
      ...ruleSteps[0],
      title: optionLabel(eventOptions, activeRule.event),
      description: 'Applies across all employees',
    },
    {
      ...ruleSteps[1],
      title: `${sentenceCase(optionLabel(conditionOptions, activeRule.condition))} USD ${activeRule.threshold || '0'}`,
      description: 'Applies to all merchant categories',
    },
    {
      ...ruleSteps[2],
      title: optionLabel(actionOptions, activeRule.action),
      description: activeRule.action === 'require-receipt' ? 'Within 15 days' : 'Routes exceptions immediately',
    },
  ];

  function handleSaveRule(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextRule = {
      ...ruleDraft,
      name: ruleDraft.name.trim() || 'Custom audit rule',
      threshold: ruleDraft.threshold || '0',
    };

    setActiveRule(nextRule);
    setRuleDraft(defaultDraft);
    setIsEditing(false);
    toast.success(`${nextRule.name} ${isEditing ? 'updated' : 'saved'} and applied.`);
  }

  return (
    <section aria-labelledby='audit-rules-heading' className='grid grid-cols-1 gap-8 md:grid-cols-3'>
      <div>
        <h2 id='audit-rules-heading' className='font-semibold text-foreground'>
          Configure audit trails
        </h2>
        <p className='mt-2 text-sm leading-6 text-muted-foreground'>
          Enable comprehensive audit trails to track expenses, enforce policy, and improve operational visibility.
        </p>
      </div>

      <Card className='md:col-span-2'>
        <CardHeader>
          <CardTitle className='text-sm'>Applied rules</CardTitle>
        </CardHeader>
        <CardContent className='space-y-6'>
          <Accordion defaultValue={['rule-1']}>
            <AccordionItem value='rule-1' className='rounded-2xl bg-background'>
              <AccordionTrigger className='rounded-2xl px-4 py-3 hover:no-underline'>
                <div className='flex w-full items-center justify-between gap-3 text-left'>
                  <span className='truncate text-sm font-medium text-foreground'>{activeRule.name}</span>
                  <Badge
                    variant={isPaused ? 'secondary' : 'outline'}
                    className={
                      isPaused
                        ? 'shrink-0 rounded-full'
                        : 'shrink-0 rounded-full border-primary/20 bg-primary/10 text-primary dark:border-primary/30 dark:bg-primary/20'
                    }
                  >
                    {isPaused ? 'Paused' : 'Live'}
                  </Badge>
                </div>
              </AccordionTrigger>
              <AccordionContent className='pt-0 pb-4'>
                <ol className='space-y-3'>
                  {appliedRuleSteps.map((step, index) => (
                    <li key={step.id} className='flex items-start gap-3'>
                      <span
                        className={`mt-0.5 inline-flex size-8 shrink-0 items-center justify-center rounded-xl ${step.iconClassName}`}
                      >
                        <step.icon className='size-4' aria-hidden='true' />
                      </span>
                      <div>
                        <p className='!mb-1 text-sm font-medium text-foreground'>
                          {index + 1}. {step.title}
                        </p>
                        <p className='text-xs text-muted-foreground'>{step.description}</p>
                      </div>
                    </li>
                  ))}
                </ol>
                <div className='mt-5 flex flex-wrap items-center gap-2'>
                  <Button
                    variant='secondary'
                    className='gap-2'
                    onClick={() => {
                      setRuleDraft(activeRule);
                      setIsEditing(true);
                    }}
                  >
                    <Settings className='size-4' aria-hidden='true' />
                    Edit
                  </Button>
                  <Button
                    variant={isPaused ? 'secondary' : 'destructive'}
                    className='gap-2'
                    onClick={() => {
                      const nextPaused = !isPaused;

                      setIsPaused(nextPaused);
                      toast.success(`${activeRule.name} ${nextPaused ? 'paused' : 'resumed'}.`);
                    }}
                  >
                    {isPaused ? (
                      <CirclePlay className='size-4' aria-hidden='true' />
                    ) : (
                      <CirclePause className='size-4' aria-hidden='true' />
                    )}
                    {isPaused ? 'Resume' : 'Pause'}
                  </Button>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          <Separator />

          <form className='space-y-4' onSubmit={handleSaveRule}>
            <div className='flex flex-wrap items-center justify-between gap-2'>
              <h3 className='text-sm font-medium text-foreground'>{isEditing ? 'Edit rule' : 'Create new rule'}</h3>
              {isEditing && (
                <Button
                  type='button'
                  variant='ghost'
                  size='sm'
                  onClick={() => {
                    setRuleDraft(defaultDraft);
                    setIsEditing(false);
                  }}
                >
                  Clear edit
                </Button>
              )}
            </div>
            <div className='space-y-2'>
              <Label htmlFor='rule-name'>Rule name</Label>
              <Input
                id='rule-name'
                value={ruleDraft.name}
                onChange={(event) => setRuleDraft((current) => ({ ...current, name: event.target.value }))}
                placeholder='e.g. Min transaction amount for receipt request'
              />
            </div>
            <div className='grid grid-cols-1 gap-3 lg:grid-cols-3'>
              <Card className='rounded-2xl border-border/70'>
                <CardHeader>
                  <CardTitle className='text-sm'>Event</CardTitle>
                </CardHeader>
                <CardContent className='space-y-2'>
                  <Label htmlFor='event-select'>Select event</Label>
                  <Select
                    value={ruleDraft.event}
                    items={eventOptions}
                    onValueChange={(value) => {
                      if (value) {
                        setRuleDraft((current) => ({ ...current, event: value as RuleDraft['event'] }));
                      }
                    }}
                  >
                    <SelectTrigger id='event-select' className='w-full'>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent align='start'>
                      {eventOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value} label={option.label}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </CardContent>
              </Card>

              <Card className='rounded-2xl border-border/70'>
                <CardHeader>
                  <CardTitle className='text-sm'>Condition</CardTitle>
                </CardHeader>
                <CardContent className='space-y-2'>
                  <Label htmlFor='condition-select'>Apply when</Label>
                  <Select
                    value={ruleDraft.condition}
                    items={conditionOptions}
                    onValueChange={(value) => {
                      if (value) {
                        setRuleDraft((current) => ({ ...current, condition: value as RuleDraft['condition'] }));
                      }
                    }}
                  >
                    <SelectTrigger id='condition-select' className='w-full'>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent align='start'>
                      {conditionOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value} label={option.label}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Input
                    type='number'
                    min={0}
                    value={ruleDraft.threshold}
                    onChange={(event) => setRuleDraft((current) => ({ ...current, threshold: event.target.value }))}
                    placeholder='0'
                    aria-label='Threshold amount'
                  />
                </CardContent>
              </Card>

              <Card className='rounded-2xl border-border/70'>
                <CardHeader>
                  <CardTitle className='text-sm'>Action</CardTitle>
                </CardHeader>
                <CardContent className='space-y-2'>
                  <Label htmlFor='action-select'>Then</Label>
                  <Select
                    value={ruleDraft.action}
                    items={actionOptions}
                    onValueChange={(value) => {
                      if (value) {
                        setRuleDraft((current) => ({ ...current, action: value as RuleDraft['action'] }));
                      }
                    }}
                  >
                    <SelectTrigger id='action-select' className='w-full'>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent align='start'>
                      {actionOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value} label={option.label}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </CardContent>
              </Card>
            </div>
            <div className='flex justify-end'>
              <Button type='submit'>{isEditing ? 'Update rule' : 'Save rule'}</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </section>
  );
}
