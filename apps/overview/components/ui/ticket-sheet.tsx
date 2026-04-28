'use client';

import * as React from 'react';

import { Button } from '@workspace/ui/components/button';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from '@workspace/ui/components/drawer';
import { Input } from '@workspace/ui/components/input';
import { Label } from '@workspace/ui/components/label';
import { RadioGroup, RadioGroupItem } from '@workspace/ui/components/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@workspace/ui/components/select';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@workspace/ui/components/sheet';
import { Textarea } from '@workspace/ui/components/textarea';
import { cn } from '@/lib/utils';
import {
  categoryTypes,
  policyTypes,
  priorities,
  ticketTypes,
  type Category,
  type PolicyType,
  type Ticket,
} from '@/lib/data/support/schema';
import { useMediaQuery } from '@/lib/use-media-query';

type TicketFormData = Partial<Ticket>;

const initialFormData = (): TicketFormData => ({
  status: 'in-progress',
  category: categoryTypes[0]?.value ?? 'accident-report',
  type: ticketTypes[0]?.value ?? 'fnol',
  policyType: policyTypes[0]?.value ?? 'auto',
  priority: priorities[0]?.value ?? 'emergency',
  description: '',
  policyNumber: '',
  duration: '0',
  created: new Date().toISOString(),
});

const categorySelectItems = categoryTypes.map((c) => ({ value: c.value, label: c.name }));
const policySelectItems = policyTypes.map((p) => ({ value: p.value, label: p.name }));

type TicketSheetProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

function SummaryItem({ label, value }: { label: string; value: string | number | null | undefined }) {
  return (
    <div className='space-y-1'>
      <p className='text-sm font-medium text-muted-foreground'>{label}</p>
      <p className='text-sm text-foreground'>{value ?? 'Not provided'}</p>
    </div>
  );
}

function FormField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <Label className='font-medium'>{label}</Label>
      <div className='mt-2'>{children}</div>
    </div>
  );
}

type FormPageProps = {
  formData: TicketFormData;
  onUpdateForm: (updates: Partial<TicketFormData>) => void;
};

function StepOneContent({ formData, onUpdateForm }: FormPageProps) {
  return (
    <div className='space-y-6'>
      <FormField label='Contact Type'>
        <RadioGroup
          name='ticket-type'
          value={formData.type}
          onValueChange={(value) => onUpdateForm({ type: value })}
          className='grid grid-cols-1 gap-2 sm:grid-cols-2'
        >
          {ticketTypes.map((type) => (
            <label
              key={type.value}
              className={cn(
                'block cursor-pointer rounded-2xl border border-border bg-card p-3 text-left transition-colors',
                'has-[[data-slot=radio-group-item][data-checked]]:border-primary',
                'has-[[data-slot=radio-group-item][data-checked]]:bg-primary/5',
                'has-[[data-slot=radio-group-item][data-checked]]:ring-2 has-[[data-slot=radio-group-item][data-checked]]:ring-ring/25',
                'hover:bg-muted/40'
              )}
            >
              <div className='flex items-start gap-3'>
                <RadioGroupItem value={type.value} id={`ticket-type-${type.value}`} className='mt-0.5' />
                <div className='min-w-0 flex-1'>
                  <span className='text-sm font-medium text-foreground'>{type.name}</span>
                  <span className='mt-0.5 block text-xs text-muted-foreground'>{type.extended}</span>
                </div>
              </div>
            </label>
          ))}
        </RadioGroup>
      </FormField>

      <FormField label='Category'>
        <Select
          value={formData.category}
          onValueChange={(value) => onUpdateForm({ category: value as Category })}
          items={categorySelectItems}
        >
          <SelectTrigger className='w-full'>
            <SelectValue placeholder='Select category' />
          </SelectTrigger>
          <SelectContent align='start'>
            {categoryTypes.map((category) => (
              <SelectItem
                key={category.value}
                value={category.value}
                label={category.name}
                className='items-start whitespace-normal [&_[data-slot=select-item-text]]:items-start'
              >
                <div className='flex min-w-0 flex-col gap-0.5 py-0.5 text-left'>
                  <span className='leading-snug'>{category.name}</span>
                  <span className='text-xs font-normal text-muted-foreground'>{category.description}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </FormField>

      <FormField label='Policy Type'>
        <Select
          value={formData.policyType}
          onValueChange={(value) => onUpdateForm({ policyType: value as PolicyType })}
          items={policySelectItems}
        >
          <SelectTrigger className='w-full'>
            <SelectValue placeholder='Select policy type' />
          </SelectTrigger>
          <SelectContent align='start'>
            {policyTypes.map((type) => (
              <SelectItem
                key={type.value}
                value={type.value}
                label={type.name}
                className='items-start whitespace-normal [&_[data-slot=select-item-text]]:items-start'
              >
                <div className='flex min-w-0 flex-col gap-0.5 py-0.5 text-left'>
                  <span className='leading-snug'>{type.name}</span>
                  <span className='text-xs font-normal text-muted-foreground'>{type.description}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </FormField>

      <FormField label='Policy Number'>
        <Input
          disabled
          name='policyNumber'
          value={formData.policyNumber ?? ''}
          onChange={(e) => onUpdateForm({ policyNumber: e.target.value })}
          placeholder='Auto generated'
          className='w-full'
        />
      </FormField>
    </div>
  );
}

function StepTwoContent({ formData, onUpdateForm }: FormPageProps) {
  return (
    <div className='space-y-6'>
      <FormField label='Priority Level'>
        <RadioGroup
          name='priority'
          value={formData.priority}
          onValueChange={(value) => onUpdateForm({ priority: value })}
          className='grid grid-cols-1 gap-2'
        >
          {priorities.map((priority) => (
            <label
              key={priority.value}
              className={cn(
                'block cursor-pointer rounded-2xl border border-border bg-card p-3 text-left transition-colors',
                'has-[[data-slot=radio-group-item][data-checked]]:border-primary',
                'has-[[data-slot=radio-group-item][data-checked]]:bg-primary/5',
                'has-[[data-slot=radio-group-item][data-checked]]:ring-2 has-[[data-slot=radio-group-item][data-checked]]:ring-ring/25',
                'hover:bg-muted/40'
              )}
            >
              <div className='flex items-start gap-3'>
                <RadioGroupItem value={priority.value} id={`priority-${priority.value}`} className='mt-0.5' />
                <div className='min-w-0 flex-1 space-y-1'>
                  <div className='flex flex-wrap items-center justify-between gap-2'>
                    <span className='text-sm font-medium text-foreground'>{priority.label}</span>
                    <span className='text-xs text-muted-foreground'>SLA: {String(priority.sla)}</span>
                  </div>
                  <p className='text-xs text-muted-foreground'>{priority.description}</p>
                </div>
              </div>
            </label>
          ))}
        </RadioGroup>
      </FormField>

      <FormField label='Description'>
        <Textarea
          name='description'
          value={formData.description ?? ''}
          onChange={(e) => onUpdateForm({ description: e.target.value })}
          placeholder='Detailed description of the issue…'
          className='min-h-32 w-full'
        />
      </FormField>

      <FormField label='Expected Call Duration (minutes)'>
        <Input
          name='duration'
          type='number'
          value={formData.duration ?? ''}
          onChange={(e) => {
            const v = e.target.value;
            onUpdateForm({ duration: v === '' ? null : v });
          }}
          placeholder='0'
          min={0}
          className='w-full'
        />
      </FormField>
    </div>
  );
}

function StepThreeContent({ formData }: { formData: TicketFormData }) {
  const typeName = ticketTypes.find((t) => t.value === formData.type)?.name;
  const categoryName = categoryTypes.find((c) => c.value === formData.category)?.name;
  const policyName = policyTypes.find((p) => p.value === formData.policyType)?.name;
  const priorityLabel = priorities.find((p) => p.value === formData.priority)?.label;

  const durationLabel =
    formData.duration != null && formData.duration !== ''
      ? `${formData.duration} minute${formData.duration === '1' ? '' : 's'}`
      : undefined;

  return (
    <div className='rounded-2xl border border-border bg-card shadow-sm'>
      <div className='border-b border-border p-4'>
        <h3 className='font-medium text-foreground'>Ticket information</h3>
        <div className='mt-4 space-y-4'>
          <SummaryItem label='Contact type' value={typeName} />
          <SummaryItem label='Category' value={categoryName} />
          <SummaryItem label='Policy type' value={policyName} />
          <SummaryItem label='Policy number' value={formData.policyNumber || undefined} />
        </div>
      </div>
      <div className='p-4'>
        <h3 className='font-medium text-foreground'>Details</h3>
        <div className='mt-4 space-y-4'>
          <SummaryItem label='Priority' value={priorityLabel} />
          <SummaryItem label='Description' value={formData.description || undefined} />
          <SummaryItem label='Expected call duration' value={durationLabel} />
          <SummaryItem
            label='Created'
            value={formData.created ? new Date(formData.created).toLocaleString() : undefined}
          />
        </div>
      </div>
    </div>
  );
}

const stepTitles = ['Create Support Ticket', 'Ticket Details', 'Review Ticket'] as const;
const stepDescriptions = ['Ticket type and category', 'Priority and description', 'Confirm details before submitting'] as const;

function FooterButtons({
  step,
  setStep,
  onClose,
  onSubmit,
}: {
  step: number;
  setStep: (s: number) => void;
  onClose: () => void;
  onSubmit: () => void;
}) {
  if (step === 1) {
    return (
      <>
        <Button type='button' variant='secondary' onClick={onClose}>
          Cancel
        </Button>
        <Button type='button' onClick={() => setStep(2)}>
          Continue
        </Button>
      </>
    );
  }
  if (step === 2) {
    return (
      <>
        <Button type='button' variant='secondary' onClick={() => setStep(1)}>
          Back
        </Button>
        <Button type='button' onClick={() => setStep(3)}>
          Review
        </Button>
      </>
    );
  }
  return (
    <>
      <Button type='button' variant='secondary' onClick={() => setStep(2)}>
        Back
      </Button>
      <Button type='button' onClick={onSubmit}>
        Create Ticket
      </Button>
    </>
  );
}

export function TicketSheet({ open, onOpenChange }: TicketSheetProps) {
  const [formData, setFormData] = React.useState<TicketFormData>(initialFormData);
  const [step, setStep] = React.useState(1);
  const isDesktop = useMediaQuery('(min-width: 640px)');
  const scrollRef = React.useRef<HTMLDivElement>(null);

  const onUpdateForm = React.useCallback((updates: Partial<TicketFormData>) => {
    setFormData((prev) => ({ ...prev, ...updates }));
  }, []);

  const goToStep = React.useCallback((next: number) => {
    setStep(next);
    requestAnimationFrame(() => scrollRef.current?.scrollTo({ top: 0 }));
  }, []);

  const handleSubmit = () => {
    console.log('Ticket created:', formData);
    onOpenChange(false);
  };

  const handleClose = () => onOpenChange(false);

  const title = stepTitles[step - 1];
  const description = stepDescriptions[step - 1];

  const content = (
    <>
      {step === 1 && <StepOneContent formData={formData} onUpdateForm={onUpdateForm} />}
      {step === 2 && <StepTwoContent formData={formData} onUpdateForm={onUpdateForm} />}
      {step === 3 && <StepThreeContent formData={formData} />}
    </>
  );

  if (!isDesktop) {
    return (
      <Drawer open={open} onOpenChange={onOpenChange}>
        <DrawerContent className='h-[90dvh] max-h-[90dvh]'>
          <DrawerHeader>
            <DrawerTitle>{title}</DrawerTitle>
            <DrawerDescription>{description}</DrawerDescription>
          </DrawerHeader>
          <div ref={scrollRef} className='flex-1 overflow-y-auto px-4 py-2'>
            {content}
          </div>
          <DrawerFooter className='flex-row justify-between gap-2'>
            <FooterButtons step={step} setStep={goToStep} onClose={handleClose} onSubmit={handleSubmit} />
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side='right' showCloseButton className='w-full gap-0 p-0 data-[side=right]:sm:max-w-xl'>
        <div className='flex min-h-0 flex-1 flex-col'>
          <SheetHeader className='border-b border-border'>
            <SheetTitle>{title}</SheetTitle>
            <SheetDescription>{description}</SheetDescription>
          </SheetHeader>
          <div ref={scrollRef} className='flex min-h-0 flex-1 flex-col overflow-y-auto px-6 py-6'>
            {content}
          </div>
        </div>

        <SheetFooter className='flex-row flex-wrap gap-2 border-t border-border sm:justify-between'>
          {step === 1 ? (
            <>
              <SheetClose render={<Button type='button' variant='secondary' />}>Cancel</SheetClose>
              <Button type='button' onClick={() => goToStep(2)}>
                Continue
              </Button>
            </>
          ) : (
            <FooterButtons step={step} setStep={goToStep} onClose={handleClose} onSubmit={handleSubmit} />
          )}
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
