'use client';

import { Button } from '@workspace/ui/components/button';
import { Card, CardContent } from '@workspace/ui/components/card';
import { Checkbox } from '@workspace/ui/components/checkbox';
import { Input } from '@workspace/ui/components/input';
import { Label } from '@workspace/ui/components/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@workspace/ui/components/select';
import { Separator } from '@workspace/ui/components/separator';
import { ExternalLink } from 'lucide-react';

import { models } from '@/lib/data/models';

const modelItems = models.map((m) => ({ value: m.id, label: m.name }));

export default function GeneralPage() {
  return (
    <div className='space-y-10'>
      <section aria-labelledby='workspace-settings'>
        <form>
          <div className='grid grid-cols-1 gap-x-14 gap-y-8 md:grid-cols-3'>
            <div>
              <h2 id='workspace-settings' className='scroll-mt-10 font-semibold text-foreground'>
                Workspace settings
              </h2>
              <p className='mt-1 text-sm leading-6 text-muted-foreground'>
                Manage workspace configuration and defaults.
              </p>
            </div>
            <div className='md:col-span-2'>
              <div className='grid grid-cols-1 gap-4 sm:grid-cols-6'>
                <div className='col-span-full sm:col-span-3'>
                  <Label htmlFor='workspace-name' className='font-medium'>
                    Workspace name
                  </Label>
                  <Input
                    type='text'
                    id='workspace-name'
                    name='workspace-name'
                    placeholder='Nova'
                    defaultValue='Nova'
                    className='mt-2'
                  />
                </div>
                <div className='col-span-full sm:col-span-3'>
                  <Label htmlFor='default-model' className='font-medium'>
                    Default model
                  </Label>
                  <Select defaultValue='gpt-5.5' items={modelItems}>
                    <SelectTrigger name='default-model' id='default-model' className='mt-2 w-full'>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {modelItems.map((item) => (
                        <SelectItem key={item.value} value={item.value}>
                          {item.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className='col-span-full sm:col-span-3'>
                  <Label htmlFor='rate-limit' className='font-medium'>
                    Rate limit (req/min)
                  </Label>
                  <Input
                    type='number'
                    id='rate-limit'
                    name='rate-limit'
                    placeholder='1000'
                    defaultValue='1000'
                    className='mt-2 [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none'
                    min={1}
                  />
                </div>
                <div className='col-span-full mt-6 flex justify-end'>
                  <Button type='submit'>Save settings</Button>
                </div>
              </div>
            </div>
          </div>
        </form>
      </section>
      <Separator />
      <section aria-labelledby='notification-settings'>
        <form>
          <div className='grid grid-cols-1 gap-x-14 gap-y-8 md:grid-cols-3'>
            <div>
              <h2 id='notification-settings' className='scroll-mt-10 font-semibold text-foreground'>
                Notification settings
              </h2>
              <p className='mt-1 text-sm leading-6 text-muted-foreground'>
                Configure the types of alerts you want to receive.
              </p>
            </div>
            <div className='md:col-span-2'>
              <fieldset>
                <legend className='text-sm font-medium text-foreground'>Alerts</legend>
                <p className='mt-1 text-sm leading-6 text-muted-foreground'>
                  Configure which events trigger notifications.
                </p>
                <ul role='list' className='mt-4 divide-y divide-border'>
                  <li className='flex items-center gap-x-3 py-3'>
                    <Checkbox id='latency-threshold' name='latency-threshold' defaultChecked />
                    <Label htmlFor='latency-threshold'>Latency threshold exceeded (P99 &gt; 2s)</Label>
                  </li>
                  <li className='flex items-center gap-x-3 py-3'>
                    <Checkbox id='error-spikes' name='error-spikes' defaultChecked />
                    <Label htmlFor='error-spikes'>Error rate spikes (&gt; 2%)</Label>
                  </li>
                  <li className='flex items-center gap-x-3 py-3'>
                    <Checkbox id='cost-budget' name='cost-budget' />
                    <Label htmlFor='cost-budget'>Cost budget alerts (80% threshold)</Label>
                  </li>
                  <li className='flex items-center gap-x-3 py-3'>
                    <Checkbox id='weekly-digest' name='weekly-digest' defaultChecked />
                    <Label htmlFor='weekly-digest'>Weekly usage digest</Label>
                  </li>
                </ul>
              </fieldset>
              <div className='col-span-full mt-6 flex justify-end'>
                <Button type='submit'>Save settings</Button>
              </div>
            </div>
          </div>
        </form>
      </section>
      <Separator />
      <section aria-labelledby='danger-zone'>
        <form>
          <div className='grid grid-cols-1 gap-x-14 gap-y-8 md:grid-cols-3'>
            <div>
              <h2 id='danger-zone' className='scroll-mt-10 font-semibold text-foreground'>
                Danger zone
              </h2>
              <p className='mt-1 text-sm leading-6 text-muted-foreground'>
                Manage general workspace. Contact system admin for more information.{' '}
                <a
                  href='#'
                  className='inline-flex items-center gap-1 text-primary hover:underline hover:underline-offset-4'
                >
                  Learn more
                  <ExternalLink className='size-4 shrink-0' aria-hidden='true' />
                </a>
              </p>
            </div>
            <div className='space-y-6 md:col-span-2'>
              <Card className='p-4'>
                <div className='flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between sm:gap-10'>
                  <div>
                    <h4 className='text-sm font-medium text-foreground'>Leave workspace</h4>
                    <p className='mt-2 text-sm leading-6 text-muted-foreground'>
                      Revoke your access to this workspace. Other members will remain.
                    </p>
                  </div>
                  <Button variant='secondary' className='self-start text-destructive sm:self-auto'>
                    Leave
                  </Button>
                </div>
              </Card>
              <Card className='overflow-hidden p-0'>
                <CardContent className='flex flex-col gap-4 p-4 sm:flex-row sm:items-start sm:justify-between sm:gap-10'>
                  <div>
                    <h4 className='text-sm font-medium text-foreground'>Delete workspace</h4>
                    <p className='mt-2 text-sm leading-6 text-muted-foreground'>
                      Permanently delete this workspace and all its data. This action cannot be undone.
                    </p>
                  </div>
                  <Button
                    variant='secondary'
                    disabled
                    className='self-start whitespace-nowrap text-destructive disabled:opacity-50 sm:self-auto'
                  >
                    Delete workspace
                  </Button>
                </CardContent>
                <div className='border-t border-border bg-muted/40 p-4 dark:bg-muted/20'>
                  <p className='text-sm text-muted-foreground'>
                    You cannot delete the workspace because you are not the system admin.
                  </p>
                </div>
              </Card>
            </div>
          </div>
        </form>
      </section>
    </div>
  );
}
