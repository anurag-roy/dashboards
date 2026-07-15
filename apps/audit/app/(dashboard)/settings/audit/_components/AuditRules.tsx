'use client';

import { useState, type FormEvent, type ReactNode } from 'react';
import {
  ArrowDownToDot,
  CircleArrowOutUpRight,
  CircleCheck,
  CirclePause,
  CirclePlay,
  Settings,
  SquareFunction,
  Trash2,
} from 'lucide-react';
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
      'bg-orange-500/10 text-orange-700 ring-1 ring-inset ring-orange-500/25 dark:bg-orange-500/15 dark:text-orange-300 dark:ring-orange-400/20',
    cardClassName: 'bg-orange-500/5 ring-orange-500/35 dark:bg-orange-500/10 dark:ring-orange-400/30',
    titleClassName: 'text-orange-700 dark:text-orange-300',
  },
  {
    id: 'condition',
    title: 'Is greater than USD 75',
    description: 'Applies to all merchant categories',
    icon: SquareFunction,
    iconClassName:
      'bg-sky-500/10 text-sky-700 ring-1 ring-inset ring-sky-500/25 dark:bg-sky-500/15 dark:text-sky-300 dark:ring-sky-400/20',
    cardClassName: 'bg-sky-500/5 ring-sky-500/35 dark:bg-sky-500/10 dark:ring-sky-400/30',
    titleClassName: 'text-sky-700 dark:text-sky-300',
  },
  {
    id: 'action',
    title: 'Require receipt',
    description: 'Within 15 days',
    icon: CircleArrowOutUpRight,
    iconClassName:
      'bg-emerald-500/10 text-emerald-700 ring-1 ring-inset ring-emerald-500/25 dark:bg-emerald-500/15 dark:text-emerald-300 dark:ring-emerald-400/20',
    cardClassName: 'bg-emerald-500/5 ring-emerald-500/35 dark:bg-emerald-500/10 dark:ring-emerald-400/30',
    titleClassName: 'text-emerald-700 dark:text-emerald-300',
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

function FlowRuleCard({
  step,
  title,
  description,
  children,
}: {
  step: (typeof ruleSteps)[number];
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <Card className={`relative rounded-2xl ${step.cardClassName}`}>
      <CardHeader>
        <div className='flex items-start justify-between gap-3'>
          <div className='flex min-w-0 items-start gap-3'>
            <span
              className={`inline-flex size-10 shrink-0 items-center justify-center rounded-xl ${step.iconClassName}`}
            >
              <step.icon className='size-4' aria-hidden='true' />
            </span>
            <div className='min-w-0'>
              <CardTitle className='text-sm'>{title}</CardTitle>
              <p className='mt-1 text-sm text-muted-foreground'>{description}</p>
            </div>
          </div>
          <Button variant='ghost' size='icon-sm' aria-label={`Remove ${title}`}>
            <Trash2 className='size-4 text-muted-foreground' aria-hidden='true' />
          </Button>
        </div>
      </CardHeader>
      <CardContent className='space-y-3'>{children}</CardContent>
    </Card>
  );
}

function FlowConnector() {
  return (
    <div className='flex h-8 justify-center' aria-hidden='true'>
      <span className='w-px bg-border' />
    </div>
  );
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
          Enable comprehensive audit trails to track expenses, ensuring compliance and enhancing security.
        </p>
      </div>

      <Card className='md:col-span-2' size='sm'>
        <CardHeader>
          <CardTitle className='text-sm'>Applied Rules</CardTitle>
        </CardHeader>
        <CardContent className='space-y-8'>
          <Accordion defaultValue={['rule-1']}>
            <AccordionItem value='rule-1' className='rounded-2xl bg-background ring-1 ring-border'>
              <AccordionTrigger className='rounded-2xl px-4 py-3 hover:no-underline'>
                <div className='flex w-full items-center justify-between gap-3 text-left'>
                  <span className='truncate text-sm font-medium text-foreground'>{activeRule.name}</span>
                  <span className='flex shrink-0 items-center gap-2'>
                    {!isPaused && (
                      <CircleCheck className='size-5 text-emerald-600 dark:text-emerald-400' aria-hidden='true' />
                    )}
                    <Badge
                      variant={isPaused ? 'secondary' : 'outline'}
                      className={
                        isPaused
                          ? 'shrink-0 rounded-full'
                          : 'shrink-0 rounded-full border-emerald-500/25 bg-emerald-500/10 text-emerald-700 dark:border-emerald-400/25 dark:bg-emerald-500/15 dark:text-emerald-300'
                      }
                    >
                      {isPaused ? 'Paused' : 'Live'}
                    </Badge>
                  </span>
                </div>
              </AccordionTrigger>
              <AccordionContent className='border-t border-border/70 px-4 pt-5 pb-4'>
                <ol className='space-y-5'>
                  {appliedRuleSteps.map((step, index) => (
                    <li key={step.id} className='flex items-start gap-3'>
                      <span
                        className={`mt-0.5 inline-flex size-9 shrink-0 items-center justify-center rounded-xl ${step.iconClassName}`}
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
                <div className='mt-7 flex flex-wrap items-center justify-between gap-3'>
                  <p className='text-xs text-muted-foreground'>Updated 30d ago</p>
                  <div className='flex flex-wrap items-center gap-2'>
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
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          <Separator />

          <form className='space-y-6' onSubmit={handleSaveRule}>
            <div className='flex flex-wrap items-center justify-between gap-2'>
              <h3 className='text-sm font-medium text-foreground'>{isEditing ? 'Edit rule' : 'Create new rule'}</h3>
              <div className='flex items-center gap-2'>
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
                <Button type='button' variant='secondary' disabled>
                  Add rule
                </Button>
              </div>
            </div>

            <Card className='rounded-2xl bg-muted/20 ring-border' size='sm'>
              <CardContent className='space-y-6 pt-6'>
                <div className='space-y-2'>
                  <Label htmlFor='rule-name'>Rule Name</Label>
                  <Input
                    id='rule-name'
                    value={ruleDraft.name}
                    onChange={(event) => setRuleDraft((current) => ({ ...current, name: event.target.value }))}
                    placeholder='E.g. Min. Transaction Amount USD'
                  />
                </div>

                <div className='space-y-4'>
                  <h4 className='text-sm font-medium text-foreground'>Define Rule Flow</h4>
                  <div>
                    <div className='flex flex-col'>
                      <FlowRuleCard step={ruleSteps[0]} title='Event' description='Select an event you want to audit'>
                        <Label htmlFor='event-select'>Select an event</Label>
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
                      </FlowRuleCard>

                      <FlowConnector />

                      <FlowRuleCard
                        step={ruleSteps[1]}
                        title='Function'
                        description='If applicable, choose a complementary condition'
                      >
                        <Label htmlFor='condition-select'>Select function</Label>
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
                          onChange={(event) =>
                            setRuleDraft((current) => ({ ...current, threshold: event.target.value }))
                          }
                          placeholder='0'
                          aria-label='Threshold amount'
                        />
                      </FlowRuleCard>

                      <FlowConnector />

                      <FlowRuleCard
                        step={ruleSteps[2]}
                        title='Action'
                        description='Choose a corresponding behavior for the event'
                      >
                        <Label htmlFor='action-select'>Select action</Label>
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
                      </FlowRuleCard>

                      <FlowConnector />

                      <div className='flex justify-center'>
                        <div className='flex flex-wrap items-center justify-center gap-1 rounded-2xl bg-foreground p-1 text-background shadow-sm'>
                          {ruleSteps.map((step) => (
                            <div
                              key={step.id}
                              className='flex items-center gap-1.5 rounded-xl px-2 py-1 text-xs font-medium'
                            >
                              <step.icon className='size-3.5' aria-hidden='true' />
                              {step.id === 'condition' ? 'Function' : sentenceCase(step.id)}
                            </div>
                          ))}
                          <Button type='submit' size='sm' className='h-8 rounded-xl'>
                            {isEditing ? 'Update' : 'Save'}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </form>
        </CardContent>
      </Card>
    </section>
  );
}
