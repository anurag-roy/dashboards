'use client';

import { roles } from '@/lib/data/data';
import { Button } from '@workspace/ui/components/button';
import { Card, CardContent } from '@workspace/ui/components/card';
import { Checkbox } from '@workspace/ui/components/checkbox';
import { Input } from '@workspace/ui/components/input';
import { Label } from '@workspace/ui/components/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@workspace/ui/components/select';
import { Separator } from '@workspace/ui/components/separator';
import { ExternalLink } from 'lucide-react';

export default function GeneralPage() {
  return (
    <div className='space-y-10'>
      <section aria-labelledby='personal-information'>
        <form>
          <div className='grid grid-cols-1 gap-x-14 gap-y-8 md:grid-cols-3'>
            <div>
              <h2 id='personal-information' className='scroll-mt-10 font-semibold text-foreground'>
                Personal information
              </h2>
              <p className='mt-1 text-sm leading-6 text-muted-foreground'>Manage your personal information and role.</p>
            </div>
            <div className='md:col-span-2'>
              <div className='grid grid-cols-1 gap-4 sm:grid-cols-6'>
                <div className='col-span-full sm:col-span-3'>
                  <Label htmlFor='first-name' className='font-medium'>
                    First name
                  </Label>
                  <Input
                    type='text'
                    id='first-name'
                    name='first-name'
                    autoComplete='given-name'
                    placeholder='Emma'
                    className='mt-2'
                  />
                </div>
                <div className='col-span-full sm:col-span-3'>
                  <Label htmlFor='last-name' className='font-medium'>
                    Last name
                  </Label>
                  <Input
                    type='text'
                    id='last-name'
                    name='last-name'
                    autoComplete='family-name'
                    placeholder='Stone'
                    className='mt-2'
                  />
                </div>
                <div className='col-span-full'>
                  <Label htmlFor='email' className='font-medium'>
                    Email
                  </Label>
                  <Input
                    type='email'
                    id='email'
                    name='email'
                    autoComplete='email'
                    placeholder='emma@acme.com'
                    className='mt-2'
                  />
                </div>
                <div className='col-span-full sm:col-span-3'>
                  <Label htmlFor='birthyear' className='font-medium'>
                    Birth year
                  </Label>
                  <Input
                    autoComplete='off'
                    id='birthyear'
                    name='year'
                    type='number'
                    placeholder='1994'
                    className='mt-2 [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none'
                    min={1900}
                    max={new Date().getFullYear()}
                    step={1}
                  />
                </div>
                <div className='col-span-full sm:col-span-3'>
                  <Label htmlFor='role' className='font-medium'>
                    Role
                  </Label>
                  <Select defaultValue='member' items={roles}>
                    <SelectTrigger name='role' id='role' className='mt-2 w-full' disabled>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {roles.map((role) => (
                        <SelectItem key={role.value} value={role.value}>
                          {role.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className='mt-2 text-xs text-muted-foreground'>Roles can only be changed by system admin.</p>
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
                Configure the types of notifications you want to receive.
              </p>
            </div>
            <div className='md:col-span-2'>
              <fieldset>
                <legend className='text-sm font-medium text-foreground'>Team</legend>
                <p className='mt-1 text-sm leading-6 text-muted-foreground'>
                  Configure the types of team alerts you want to receive.
                </p>
                <ul role='list' className='mt-4 divide-y divide-border'>
                  <li className='flex items-center gap-x-3 py-3'>
                    <Checkbox id='team-requests' name='team-requests' defaultChecked />
                    <Label htmlFor='team-requests'>Team join requests</Label>
                  </li>
                  <li className='flex items-center gap-x-3 py-3'>
                    <Checkbox id='team-activity-digest' />
                    <Label htmlFor='team-activity-digest'>Weekly team activity digest</Label>
                  </li>
                </ul>
              </fieldset>
              <fieldset className='mt-6'>
                <legend className='text-sm font-medium text-foreground'>Usage</legend>
                <p className='mt-1 text-sm leading-6 text-muted-foreground'>
                  Configure the types of usage alerts you want to receive.
                </p>
                <ul role='list' className='mt-4 divide-y divide-border'>
                  <li className='flex items-center gap-x-3 py-3'>
                    <Checkbox id='api-requests' name='api-requests' />
                    <Label htmlFor='api-requests'>API incidents</Label>
                  </li>
                  <li className='flex items-center gap-x-3 py-3'>
                    <Checkbox id='workspace-execution' name='workspace-execution' />
                    <Label htmlFor='workspace-execution'>Platform incidents</Label>
                  </li>
                  <li className='flex items-center gap-x-3 py-3'>
                    <Checkbox id='query-caching' name='query-caching' defaultChecked />
                    <Label htmlFor='query-caching'>Payment transactions</Label>
                  </li>
                  <li className='flex items-center gap-x-3 py-3'>
                    <Checkbox id='storage' name='storage' defaultChecked />
                    <Label htmlFor='storage'>User behavior</Label>
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
                      Revoke your access to this team. Other people you have added to the workspace will remain.
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
                    <h4 className='text-sm font-medium text-muted-foreground'>Delete workspace</h4>
                    <p className='mt-2 text-sm leading-6 text-muted-foreground'>
                      Revoke your access to this team. Other people you have added to the workspace will remain.
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
