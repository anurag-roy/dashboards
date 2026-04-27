'use client';

import { CircleCheck, Plus } from 'lucide-react';
import { Button } from '@workspace/ui/components/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@workspace/ui/components/dialog';
import { Input } from '@workspace/ui/components/input';
import { Label } from '@workspace/ui/components/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@workspace/ui/components/select';
import { Separator } from '@workspace/ui/components/separator';
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@workspace/ui/components/table';

const lineItems = [
  {
    name: 'Starter Tier (Start-Up Discount)',
    quantity: 1,
    unit: '$90',
    price: '$90',
  },
  {
    name: 'Bank & CPA Integration',
    quantity: 1,
    unit: '$25',
    price: '$25',
  },
  {
    name: 'Corporate Card (VISA World Elite)',
    quantity: 2,
    unit: '$45',
    price: '$90',
  },
] as const;

const states = [
  { value: 'colorado', label: 'Colorado' },
  { value: 'florida', label: 'Florida' },
  { value: 'georgia', label: 'Georgia' },
  { value: 'delaware', label: 'Delaware' },
  { value: 'hawaii', label: 'Hawaii' },
] as const;

export default function BillingPage() {
  return (
    <div className='space-y-8'>
      <section aria-labelledby='billing-overview-heading' className='grid grid-cols-1 gap-8 md:grid-cols-3'>
        <div>
          <h2 id='billing-overview-heading' className='font-semibold text-foreground'>
            Billing
          </h2>
          <p className='mt-2 text-sm leading-6 text-muted-foreground'>
            Overview of your current billing cycle and usage-based charges.
          </p>
        </div>

        <div className='space-y-4 md:col-span-2'>
          <p className='text-sm font-medium text-foreground'>Current billing cycle (Aug 31 - Sep 30, 2024)</p>
          <div className='overflow-hidden rounded-3xl border border-border/70 bg-card'>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Item</TableHead>
                  <TableHead className='text-right'>Quantity</TableHead>
                  <TableHead className='text-right'>Unit price</TableHead>
                  <TableHead className='text-right'>Price</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {lineItems.map((item) => (
                  <TableRow key={item.name}>
                    <TableCell>{item.name}</TableCell>
                    <TableCell className='text-right tabular-nums'>{item.quantity}</TableCell>
                    <TableCell className='text-right tabular-nums'>{item.unit}</TableCell>
                    <TableCell className='text-right tabular-nums'>{item.price}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
              <TableFooter>
                <TableRow>
                  <TableHead colSpan={3} className='text-right font-normal text-muted-foreground'>
                    Subtotal
                  </TableHead>
                  <TableCell className='text-right font-medium tabular-nums'>$205.00</TableCell>
                </TableRow>
                <TableRow>
                  <TableHead colSpan={3} className='text-right font-normal text-muted-foreground'>
                    VAT (7.7%)
                  </TableHead>
                  <TableCell className='text-right font-medium tabular-nums'>$15.80</TableCell>
                </TableRow>
                <TableRow>
                  <TableHead colSpan={3} className='text-right text-foreground'>
                    Total
                  </TableHead>
                  <TableCell className='text-right text-foreground tabular-nums'>$220.80</TableCell>
                </TableRow>
              </TableFooter>
            </Table>
          </div>
          <p className='text-xs text-muted-foreground'>
            Includes 10,000 trackable expenses/month and USD 0.10 for each additional expense.
          </p>
        </div>
      </section>

      <Separator />

      <section aria-labelledby='payment-method-heading' className='grid grid-cols-1 gap-8 md:grid-cols-3'>
        <div>
          <h2 id='payment-method-heading' className='font-semibold text-foreground'>
            Payment method
          </h2>
          <p className='mt-2 text-sm leading-6 text-muted-foreground'>
            Payments are charged to the card(s) listed below.
          </p>
        </div>

        <div className='space-y-4 md:col-span-2'>
          <div className='flex flex-wrap items-center justify-between gap-3'>
            <p className='text-sm font-medium text-foreground'>Cards</p>
            <Dialog>
              <DialogTrigger
                render={
                  <Button className='gap-2'>
                    <Plus className='size-4' aria-hidden='true' />
                    Add card
                  </Button>
                }
              />
              <DialogContent className='sm:max-w-lg'>
                <form
                  onSubmit={(event) => {
                    event.preventDefault();
                  }}
                >
                  <DialogHeader>
                    <DialogTitle>Add payment card</DialogTitle>
                    <DialogDescription>Enter card details to add a new payment method.</DialogDescription>
                  </DialogHeader>
                  <div className='mt-5 space-y-4'>
                    <div className='space-y-2'>
                      <Label htmlFor='card-name'>Cardholder name</Label>
                      <Input id='card-name' placeholder='Cardholder Name' />
                    </div>
                    <div className='space-y-2'>
                      <Label htmlFor='card-number'>Card number</Label>
                      <Input id='card-number' placeholder='**** **** **** 1234' />
                    </div>
                    <div className='grid grid-cols-2 gap-3'>
                      <div className='space-y-2'>
                        <Label htmlFor='card-expiry'>Expiry date</Label>
                        <Input id='card-expiry' placeholder='MM/YY' />
                      </div>
                      <div className='space-y-2'>
                        <Label htmlFor='card-cvv'>CVV</Label>
                        <Input id='card-cvv' placeholder='123' />
                      </div>
                    </div>
                  </div>
                  <DialogFooter className='mt-6'>
                    <DialogClose render={<Button type='button' variant='secondary' />}>Cancel</DialogClose>
                    <Button type='submit'>Add card</Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          <div className='overflow-hidden rounded-3xl border border-border/70 bg-card'>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Provider</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Number (Last 4)</TableHead>
                  <TableHead>Exp. Date</TableHead>
                  <TableHead className='text-right'>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>MasterCard</TableCell>
                  <TableCell>
                    <span className='inline-flex items-center gap-1.5 text-foreground'>
                      <CircleCheck className='size-4 text-primary' aria-hidden='true' />
                      Active
                    </span>
                  </TableCell>
                  <TableCell>Credit</TableCell>
                  <TableCell className='tabular-nums'>**** 1234</TableCell>
                  <TableCell className='tabular-nums'>01/2028</TableCell>
                  <TableCell className='text-right'>
                    <Button variant='ghost' size='sm'>
                      Edit
                    </Button>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </div>
      </section>

      <Separator />

      <section aria-labelledby='billing-address-heading' className='grid grid-cols-1 gap-8 md:grid-cols-3'>
        <div>
          <h2 id='billing-address-heading' className='font-semibold text-foreground'>
            Billing address
          </h2>
          <p className='mt-2 text-sm leading-6 text-muted-foreground'>Add a postal address to appear on invoices.</p>
        </div>

        <div className='md:col-span-2'>
          <form className='space-y-4 rounded-3xl border border-border/70 bg-card p-4 sm:p-6'>
            <div className='space-y-2'>
              <Label htmlFor='address-line-1'>Address line 1</Label>
              <Input id='address-line-1' defaultValue='8272 Postal Way' />
            </div>
            <div className='space-y-2'>
              <Label htmlFor='address-line-2'>Address line 2</Label>
              <Input id='address-line-2' placeholder='Suite, floor, building' />
            </div>
            <div className='space-y-2'>
              <Label htmlFor='city'>City</Label>
              <Input id='city' defaultValue='Denver' />
            </div>
            <div className='grid grid-cols-1 gap-3 sm:grid-cols-2'>
              <div className='space-y-2'>
                <Label htmlFor='state'>State</Label>
                <Select defaultValue={states[0].value} items={states}>
                  <SelectTrigger id='state' className='w-full'>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent align='start'>
                    {states.map((state) => (
                      <SelectItem key={state.value} value={state.value} label={state.label}>
                        {state.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className='space-y-2'>
                <Label htmlFor='postal-code'>Postal code</Label>
                <Input id='postal-code' defaultValue='63001' inputMode='numeric' />
              </div>
            </div>
            <div className='flex justify-end'>
              <Button type='submit'>Update address</Button>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
}
