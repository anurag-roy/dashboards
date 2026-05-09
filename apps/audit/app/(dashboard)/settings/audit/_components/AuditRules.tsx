import { ArrowDownToDot, CircleArrowOutUpRight, CirclePause, Settings, SquareFunction } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@workspace/ui/components/accordion';
import { Badge } from '@workspace/ui/components/badge';
import { Button } from '@workspace/ui/components/button';
import { Card, CardContent, CardHeader, CardTitle } from '@workspace/ui/components/card';
import { Input } from '@workspace/ui/components/input';
import { Label } from '@workspace/ui/components/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@workspace/ui/components/select';
import { Separator } from '@workspace/ui/components/separator';

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
  { value: 'attachment', label: 'Attachment is received' },
  { value: 'payment', label: 'Payment has been made' },
  { value: 'transfer', label: 'Transfer has been made' },
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

export default function AuditRules() {
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
            <AccordionItem value='rule-1' className='rounded-2xl border border-border bg-background'>
              <AccordionTrigger className='rounded-2xl px-4 py-3 hover:no-underline'>
                <div className='flex w-full items-center justify-between gap-3 text-left'>
                  <span className='truncate text-sm font-medium text-foreground'>
                    IRS receipt rule for all US employees
                  </span>
                  <Badge
                    variant='outline'
                    className='shrink-0 rounded-full border-primary/20 bg-primary/10 text-primary dark:border-primary/30 dark:bg-primary/20'
                  >
                    Live
                  </Badge>
                </div>
              </AccordionTrigger>
              <AccordionContent className='pt-0 pb-4'>
                <ol className='space-y-3'>
                  {ruleSteps.map((step, index) => (
                    <li key={step.id} className='flex items-start gap-3'>
                      <span
                        className={`mt-0.5 inline-flex size-8 shrink-0 items-center justify-center rounded-xl ${step.iconClassName}`}
                      >
                        <step.icon className='size-4' aria-hidden='true' />
                      </span>
                      <div>
                        <p className='text-sm font-medium text-foreground'>
                          {index + 1}. {step.title}
                        </p>
                        <p className='text-xs text-muted-foreground'>{step.description}</p>
                      </div>
                    </li>
                  ))}
                </ol>
                <div className='mt-5 flex flex-wrap items-center gap-2'>
                  <Button variant='secondary' className='gap-2'>
                    <Settings className='size-4' aria-hidden='true' />
                    Edit
                  </Button>
                  <Button variant='destructive' className='gap-2'>
                    <CirclePause className='size-4' aria-hidden='true' />
                    Pause
                  </Button>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          <Separator />

          <div className='space-y-4'>
            <h3 className='text-sm font-medium text-foreground'>Create new rule</h3>
            <div className='space-y-2'>
              <Label htmlFor='rule-name'>Rule name</Label>
              <Input id='rule-name' placeholder='e.g. Min transaction amount for receipt request' />
            </div>
            <div className='grid grid-cols-1 gap-3 lg:grid-cols-3'>
              <Card className='rounded-2xl border-border/70'>
                <CardHeader className='pb-3'>
                  <CardTitle className='text-sm'>Event</CardTitle>
                </CardHeader>
                <CardContent className='space-y-2'>
                  <Label htmlFor='event-select'>Select event</Label>
                  <Select defaultValue={eventOptions[0].value} items={eventOptions}>
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
                <CardHeader className='pb-3'>
                  <CardTitle className='text-sm'>Condition</CardTitle>
                </CardHeader>
                <CardContent className='space-y-2'>
                  <Label htmlFor='condition-select'>Apply when</Label>
                  <Select defaultValue={conditionOptions[0].value} items={conditionOptions}>
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
                  <Input type='number' min={0} placeholder='0' aria-label='Threshold amount' />
                </CardContent>
              </Card>

              <Card className='rounded-2xl border-border/70'>
                <CardHeader className='pb-3'>
                  <CardTitle className='text-sm'>Action</CardTitle>
                </CardHeader>
                <CardContent className='space-y-2'>
                  <Label htmlFor='action-select'>Then</Label>
                  <Select defaultValue={actionOptions[0].value} items={actionOptions}>
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
              <Button>Save rule</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
