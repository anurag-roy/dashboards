'use client';

import { type FocusEvent, useEffect, useMemo, useRef, useState } from 'react';
import { type Row } from '@tanstack/react-table';
import { FileText, Upload, X } from 'lucide-react';
import { Button } from '@workspace/ui/components/button';
import { Checkbox } from '@workspace/ui/components/checkbox';
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from '@workspace/ui/components/drawer';
import { Input } from '@workspace/ui/components/input';
import { Label } from '@workspace/ui/components/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@workspace/ui/components/select';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@workspace/ui/components/sheet';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@workspace/ui/components/tabs';
import { Textarea } from '@workspace/ui/components/textarea';

import { departments } from '@/lib/data/data';
import { expenseStatuses, paymentStatuses, type Transaction } from '@/lib/data/schema';
import { useMediaQuery } from '@/lib/use-media-query';
import { formatters } from '@/lib/utils';
import { DataTableDrawerFeed } from './DataTableDrawerFeed';

type DataTableDrawerProps = {
  row: Row<Transaction> | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const expenseStatusItems = expenseStatuses.map((status) => ({ value: status.value, label: status.label }));
const paymentStatusItems = paymentStatuses.map((status) => ({ value: status.value, label: status.label }));
const reimbursementItems = [
  { value: 'corporate-card', label: 'Corporate card' },
  { value: 'bank-transfer', label: 'Bank transfer' },
  { value: 'cash', label: 'Cash reimbursement' },
] as const;
const keyboardVisibilityThreshold = 80;
const keyboardScrollMargin = 16;
const nonTextInputTypes = new Set([
  'checkbox',
  'radio',
  'range',
  'color',
  'file',
  'image',
  'button',
  'submit',
  'reset',
]);

function isKeyboardInput(target: EventTarget | null): target is HTMLElement {
  if (target instanceof HTMLInputElement) {
    return !nonTextInputTypes.has(target.type);
  }

  return target instanceof HTMLTextAreaElement || (target instanceof HTMLElement && target.isContentEditable);
}

function useKeyboardInset(enabled: boolean) {
  const [keyboardInset, setKeyboardInset] = useState(0);

  useEffect(() => {
    if (!enabled || typeof window === 'undefined' || !window.visualViewport) {
      setKeyboardInset(0);
      return;
    }

    const viewport = window.visualViewport;

    const updateKeyboardInset = () => {
      const nextInset = Math.max(0, window.innerHeight - viewport.height - viewport.offsetTop);
      setKeyboardInset(nextInset > keyboardVisibilityThreshold ? Math.round(nextInset) : 0);
    };

    updateKeyboardInset();
    viewport.addEventListener('resize', updateKeyboardInset);
    viewport.addEventListener('scroll', updateKeyboardInset);

    return () => {
      viewport.removeEventListener('resize', updateKeyboardInset);
      viewport.removeEventListener('scroll', updateKeyboardInset);
    };
  }, [enabled]);

  return keyboardInset;
}

function keepFocusedFieldVisible(event: FocusEvent<HTMLElement>, scrollRef: React.RefObject<HTMLDivElement | null>) {
  const target = event.target;
  const scrollContainer = scrollRef.current;

  if (!isKeyboardInput(target) || !scrollContainer || typeof window === 'undefined') {
    return;
  }

  const scrollIntoVisibleArea = () => {
    const viewport = window.visualViewport;
    const viewportTop = viewport?.offsetTop ?? 0;
    const viewportBottom = viewport ? viewport.offsetTop + viewport.height : window.innerHeight;
    const containerRect = scrollContainer.getBoundingClientRect();
    const targetRect = target.getBoundingClientRect();
    const visibleTop = Math.max(containerRect.top, viewportTop) + keyboardScrollMargin;
    const visibleBottom = Math.min(containerRect.bottom, viewportBottom) - keyboardScrollMargin;

    if (targetRect.bottom > visibleBottom) {
      scrollContainer.scrollBy({ top: targetRect.bottom - visibleBottom, behavior: 'smooth' });
      return;
    }

    if (targetRect.top < visibleTop) {
      scrollContainer.scrollBy({ top: targetRect.top - visibleTop, behavior: 'smooth' });
    }
  };

  window.requestAnimationFrame(scrollIntoVisibleArea);
  window.setTimeout(scrollIntoVisibleArea, 300);
}

function TransactionDrawerActions({ onClose }: { onClose: () => void }) {
  return (
    <>
      <Button onClick={onClose}>Save changes</Button>
      <Button variant='secondary' onClick={onClose}>
        Cancel
      </Button>
    </>
  );
}

function DrawerFormContent({
  transaction,
  scrollRef,
  keyboardInset,
  showInlineActions = false,
  onClose,
  expenseStatus,
  setExpenseStatus,
  paymentStatus,
  setPaymentStatus,
  department,
  setDepartment,
  reimbursementType,
  setReimbursementType,
  requiresReceipt,
  setRequiresReceipt,
  priorityReview,
  setPriorityReview,
  attachments,
  setAttachments,
  notes,
  setNotes,
  activity,
}: {
  transaction: Transaction;
  scrollRef: React.RefObject<HTMLDivElement | null>;
  keyboardInset: number;
  showInlineActions?: boolean;
  onClose: () => void;
  expenseStatus: Transaction['expense_status'];
  setExpenseStatus: (v: Transaction['expense_status']) => void;
  paymentStatus: Transaction['payment_status'];
  setPaymentStatus: (v: Transaction['payment_status']) => void;
  department: string;
  setDepartment: (v: string) => void;
  reimbursementType: (typeof reimbursementItems)[number]['value'];
  setReimbursementType: (v: (typeof reimbursementItems)[number]['value']) => void;
  requiresReceipt: boolean;
  setRequiresReceipt: (v: boolean) => void;
  priorityReview: boolean;
  setPriorityReview: (v: boolean) => void;
  attachments: string[];
  setAttachments: React.Dispatch<React.SetStateAction<string[]>>;
  notes: string;
  setNotes: (v: string) => void;
  activity: { id: string; actor: string; action: string; at: string }[];
}) {
  return (
    <div
      ref={scrollRef}
      className='min-h-0 flex-1 overflow-y-auto'
      onFocusCapture={(event) => keepFocusedFieldVisible(event, scrollRef)}
    >
      <div
        className='flex flex-col gap-6 p-4 md:p-6'
        style={keyboardInset > 0 ? { paddingBottom: keyboardInset + 24 } : undefined}
      >
        <div className='grid grid-cols-1 gap-3 rounded-3xl border border-border/70 bg-muted/30 p-4 sm:grid-cols-2'>
          <div>
            <p className='text-xs text-muted-foreground'>Purchased on</p>
            <p className='font-medium'>{formatters.dateTime(transaction.transaction_date)}</p>
          </div>
          <div>
            <p className='text-xs text-muted-foreground'>Amount</p>
            <p className='font-medium'>{formatters.currency(transaction.amount)}</p>
          </div>
          <div>
            <p className='text-xs text-muted-foreground'>Merchant</p>
            <p className='font-medium'>{transaction.merchant}</p>
          </div>
          <div>
            <p className='text-xs text-muted-foreground'>Country</p>
            <p className='font-medium'>{transaction.country}</p>
          </div>
        </div>

        <Tabs defaultValue='details'>
          <TabsList variant='line' className='bg-transparent p-0'>
            <TabsTrigger value='details' className='flex-none px-0 data-active:shadow-none'>
              Details
            </TabsTrigger>
            <TabsTrigger value='activity' className='flex-none px-0 data-active:shadow-none'>
              Activity
            </TabsTrigger>
          </TabsList>

          <TabsContent value='details' className='space-y-4 pt-2'>
            <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
              <div className='space-y-2'>
                <Label htmlFor='expense-status'>Expense status</Label>
                <Select
                  value={expenseStatus}
                  items={expenseStatusItems}
                  onValueChange={(value) => {
                    if (value) setExpenseStatus(value as Transaction['expense_status']);
                  }}
                >
                  <SelectTrigger id='expense-status' className='w-full'>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent align='start'>
                    {expenseStatuses.map((status) => (
                      <SelectItem key={status.value} value={status.value} label={status.label}>
                        {status.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className='space-y-2'>
                <Label htmlFor='payment-status'>Payment status</Label>
                <Select
                  value={paymentStatus}
                  items={paymentStatusItems}
                  onValueChange={(value) => {
                    if (value) setPaymentStatus(value as Transaction['payment_status']);
                  }}
                >
                  <SelectTrigger id='payment-status' className='w-full'>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent align='start'>
                    {paymentStatuses.map((status) => (
                      <SelectItem key={status.value} value={status.value} label={status.label}>
                        {status.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
              <div className='space-y-2'>
                <Label htmlFor='department'>Department</Label>
                <Select
                  value={department}
                  items={departments}
                  onValueChange={(value) => {
                    if (value) setDepartment(value);
                  }}
                >
                  <SelectTrigger id='department' className='w-full'>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent align='start'>
                    {departments.map((departmentOption) => (
                      <SelectItem
                        key={departmentOption.value}
                        value={departmentOption.value}
                        label={departmentOption.label}
                      >
                        {departmentOption.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className='space-y-2'>
                <Label htmlFor='reimbursement'>Reimbursement</Label>
                <Select
                  value={reimbursementType}
                  items={reimbursementItems}
                  onValueChange={(value) => {
                    if (value) setReimbursementType(value as (typeof reimbursementItems)[number]['value']);
                  }}
                >
                  <SelectTrigger id='reimbursement' className='w-full'>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent align='start'>
                    {reimbursementItems.map((item) => (
                      <SelectItem key={item.value} value={item.value} label={item.label}>
                        {item.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className='space-y-2'>
              <Label htmlFor='category'>Category</Label>
              <Input id='category' defaultValue={transaction.category} />
            </div>

            <div className='space-y-2'>
              <Label htmlFor='merchant'>Merchant</Label>
              <Input id='merchant' defaultValue={transaction.merchant} />
            </div>

            <div className='space-y-3 rounded-2xl border border-border/70 bg-muted/20 p-4'>
              <div className='flex items-center justify-between gap-3'>
                <div>
                  <p className='text-sm font-medium text-foreground'>Attachments</p>
                  <p className='text-xs text-muted-foreground'>Upload receipts, invoices, or backup documents.</p>
                </div>
                <div className='shrink-0'>
                  <Input
                    id='transaction-attachments'
                    type='file'
                    multiple
                    className='hidden'
                    onChange={(event) => {
                      const fileNames = Array.from(event.target.files ?? []).map((file) => file.name);
                      if (fileNames.length > 0) {
                        setAttachments((previous) => [...previous, ...fileNames]);
                      }
                      event.target.value = '';
                    }}
                  />
                  <Label
                    htmlFor='transaction-attachments'
                    className='inline-flex h-8 cursor-pointer items-center gap-1.5 rounded-2xl border border-border px-3 text-xs font-medium text-foreground hover:bg-muted'
                  >
                    <Upload className='size-3.5' aria-hidden='true' />
                    Upload file
                  </Label>
                </div>
              </div>

              {attachments.length === 0 ? (
                <p className='text-sm text-muted-foreground'>No files attached yet.</p>
              ) : (
                <ul className='space-y-2'>
                  {attachments.map((attachment) => (
                    <li
                      key={attachment}
                      className='flex items-center justify-between gap-2 rounded-xl border border-border/70 bg-background px-3 py-2'
                    >
                      <span className='flex min-w-0 items-center gap-2 text-sm text-foreground'>
                        <FileText className='size-4 shrink-0 text-muted-foreground' aria-hidden='true' />
                        <span className='truncate'>{attachment}</span>
                      </span>
                      <Button
                        type='button'
                        variant='ghost'
                        size='icon-xs'
                        className='rounded-xl'
                        onClick={() => {
                          setAttachments((previous) => previous.filter((file) => file !== attachment));
                        }}
                        aria-label={`Remove ${attachment}`}
                      >
                        <X className='size-3.5 text-muted-foreground' aria-hidden='true' />
                      </Button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className='space-y-2'>
              <Label htmlFor='notes'>Notes</Label>
              <Textarea
                id='notes'
                value={notes}
                onChange={(event) => setNotes(event.target.value)}
                className='min-h-32'
                placeholder='Add context for reviewers...'
              />
            </div>

            <div className='space-y-2'>
              <div className='flex items-center gap-2'>
                <Checkbox
                  id='requires-receipt'
                  checked={requiresReceipt}
                  onCheckedChange={(value) => setRequiresReceipt(value === true)}
                />
                <Label htmlFor='requires-receipt' className='text-sm font-normal'>
                  Receipt required before approval
                </Label>
              </div>
              <div className='flex items-center gap-2'>
                <Checkbox
                  id='priority-review'
                  checked={priorityReview}
                  onCheckedChange={(value) => setPriorityReview(value === true)}
                />
                <Label htmlFor='priority-review' className='text-sm font-normal'>
                  Mark for priority finance review
                </Label>
              </div>
            </div>
          </TabsContent>

          <TabsContent value='activity' className='pt-3'>
            <DataTableDrawerFeed events={activity} />
          </TabsContent>
        </Tabs>

        {showInlineActions && (
          <div className='flex flex-col gap-2 border-t border-border/70 pt-4'>
            <TransactionDrawerActions onClose={onClose} />
          </div>
        )}
      </div>
    </div>
  );
}

export function DataTableDrawer({ row, open, onOpenChange }: DataTableDrawerProps) {
  const isDesktop = useMediaQuery('(min-width: 768px)');
  const transaction = row?.original ?? null;
  const scrollRef = useRef<HTMLDivElement>(null);
  const keyboardInset = useKeyboardInset(open && !isDesktop);
  const keyboardOpen = keyboardInset > 0;

  const [expenseStatus, setExpenseStatus] = useState<Transaction['expense_status']>('pending');
  const [paymentStatus, setPaymentStatus] = useState<Transaction['payment_status']>('processing');
  const [department, setDepartment] = useState(departments[0]?.value ?? 'all-areas');
  const [reimbursementType, setReimbursementType] = useState<(typeof reimbursementItems)[number]['value']>(
    reimbursementItems[0].value
  );
  const [requiresReceipt, setRequiresReceipt] = useState(true);
  const [priorityReview, setPriorityReview] = useState(false);
  const [attachments, setAttachments] = useState<string[]>([]);
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (!transaction) return;

    setExpenseStatus(transaction.expense_status);
    setPaymentStatus(transaction.payment_status);
    setDepartment(departments[0]?.value ?? 'all-areas');
    setReimbursementType(reimbursementItems[0].value);
    setRequiresReceipt(transaction.expense_status !== 'approved');
    setPriorityReview(transaction.expense_status === 'actionRequired' || transaction.expense_status === 'inAudit');
    setAttachments([`${transaction.transaction_id}-receipt.pdf`]);
    setNotes('');
  }, [transaction]);

  const activity = useMemo(() => {
    if (!transaction) return [];

    return [
      {
        id: `${transaction.transaction_id}-1`,
        actor: 'Anurag Roy',
        action: `updated status to ${expenseStatus}`,
        at: transaction.lastEdited,
      },
      {
        id: `${transaction.transaction_id}-2`,
        actor: 'Riley Carter',
        action: 'attached receipt for review',
        at: transaction.lastEdited,
      },
      {
        id: `${transaction.transaction_id}-3`,
        actor: 'System',
        action: 'created transaction',
        at: transaction.transaction_date,
      },
    ];
  }, [expenseStatus, transaction]);

  const formProps = {
    transaction: transaction!,
    scrollRef,
    keyboardInset: isDesktop ? 0 : keyboardInset,
    showInlineActions: !isDesktop && keyboardOpen,
    onClose: () => onOpenChange(false),
    expenseStatus,
    setExpenseStatus,
    paymentStatus,
    setPaymentStatus,
    department,
    setDepartment,
    reimbursementType,
    setReimbursementType,
    requiresReceipt,
    setRequiresReceipt,
    priorityReview,
    setPriorityReview,
    attachments,
    setAttachments,
    notes,
    setNotes,
    activity,
  };

  if (!isDesktop) {
    return (
      <Drawer open={open} onOpenChange={onOpenChange} repositionInputs={false}>
        <DrawerContent className='data-[vaul-drawer-direction=bottom]:max-h-[90svh]'>
          <DrawerHeader className='shrink-0'>
            <DrawerTitle>
              {transaction ? `Transaction ${transaction.transaction_id}` : 'Transaction details'}
            </DrawerTitle>
            <DrawerDescription>Review details, adjust status, and leave notes.</DrawerDescription>
          </DrawerHeader>

          {transaction ? (
            <DrawerFormContent {...formProps} />
          ) : (
            <div className='p-6 text-sm text-muted-foreground'>Select a transaction to view details.</div>
          )}

          <DrawerFooter className={keyboardOpen ? 'hidden' : 'shrink-0 border-t border-border/70'}>
            <TransactionDrawerActions onClose={() => onOpenChange(false)} />
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side='right'
        className='overflow-hidden p-0 data-[side=right]:w-full data-[side=right]:sm:max-w-[min(53vw,38.5rem)] data-[side=right]:lg:max-w-[min(38vw,38.5rem)]'
      >
        <SheetHeader className='shrink-0 border-b border-border/70'>
          <SheetTitle>{transaction ? `Transaction ${transaction.transaction_id}` : 'Transaction details'}</SheetTitle>
          <SheetDescription>Review details, adjust status, and leave notes.</SheetDescription>
        </SheetHeader>

        {transaction ? (
          <DrawerFormContent {...formProps} />
        ) : (
          <div className='p-6 text-sm text-muted-foreground'>Select a transaction to view details.</div>
        )}

        <SheetFooter className='shrink-0 border-t border-border/70'>
          <Button variant='secondary' onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={() => onOpenChange(false)}>Save changes</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
