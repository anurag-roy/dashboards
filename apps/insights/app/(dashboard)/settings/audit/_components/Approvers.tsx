'use client';

import { useMemo, useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
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

import { DashboardAvatar } from '@workspace/ui/components/dashboard-avatar';
import { approvers, departments } from '@/lib/data/data';

export default function Approvers() {
  const defaultDepartmentValue = departments[0]?.value ?? 'all-areas';

  const initialPermissions = useMemo(
    () =>
      Object.fromEntries(
        approvers.map((user) => [
          user.email,
          departments.find((department) => department.label === user.permission)?.value ?? defaultDepartmentValue,
        ])
      ),
    [defaultDepartmentValue]
  );

  const [permissions, setPermissions] = useState<Record<string, string>>(initialPermissions);

  return (
    <section aria-labelledby='approver-list-heading' className='grid grid-cols-1 gap-8 md:grid-cols-3'>
      <div>
        <h2 id='approver-list-heading' className='font-semibold text-foreground'>
          Approvers
        </h2>
        <p className='mt-2 text-sm leading-6 text-muted-foreground'>
          Define who can approve expenses before they are posted.
        </p>
      </div>

      <div className='space-y-4 md:col-span-2'>
        <div className='flex flex-wrap items-center justify-between gap-3'>
          <p className='text-sm font-medium text-foreground'>{approvers.length} users with approval rights</p>

          <Dialog>
            <DialogTrigger
              render={
                <Button className='gap-2'>
                  <Plus className='size-4' aria-hidden='true' />
                  Add user
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
                  <DialogTitle>Add approver</DialogTitle>
                  <DialogDescription>Invite a teammate and assign their approval scope.</DialogDescription>
                </DialogHeader>
                <div className='mt-5 space-y-4'>
                  <div className='space-y-2'>
                    <Label htmlFor='approver-email'>Email</Label>
                    <Input id='approver-email' type='email' placeholder='teammate@acme.com' />
                  </div>
                  <div className='space-y-2'>
                    <Label htmlFor='approver-scope'>Permission</Label>
                    <Select defaultValue={defaultDepartmentValue} items={departments}>
                      <SelectTrigger id='approver-scope' className='w-full'>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent align='start'>
                        {departments.map((department) => (
                          <SelectItem key={department.value} value={department.value} label={department.label}>
                            {department.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter className='mt-6'>
                  <DialogClose render={<Button type='button' variant='secondary' />}>Cancel</DialogClose>
                  <Button type='submit'>Send invite</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <ul role='list' className='divide-y divide-border rounded-3xl border border-border/70 bg-card px-4 sm:px-5'>
          {approvers.map((user) => (
            <li key={user.email} className='flex flex-col gap-3 py-3 sm:flex-row sm:items-center sm:justify-between'>
              <div className='flex min-w-0 items-center gap-3'>
                <DashboardAvatar seed={user.name} />
                <div className='min-w-0'>
                  <p className='truncate text-sm font-medium text-foreground'>{user.name}</p>
                  <p className='truncate text-xs text-muted-foreground'>{user.email}</p>
                </div>
              </div>

              <div className='flex items-center gap-2'>
                <Select
                  value={permissions[user.email] ?? defaultDepartmentValue}
                  items={departments}
                  onValueChange={(value) => {
                    setPermissions((previous) => ({
                      ...previous,
                      [user.email]: value ?? defaultDepartmentValue,
                    }));
                  }}
                >
                  <SelectTrigger className='w-full sm:w-40'>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent align='end'>
                    {departments.map((department) => (
                      <SelectItem key={department.value} value={department.value} label={department.label}>
                        {department.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Button variant='ghost' size='icon-sm' aria-label={`Remove ${user.name}`}>
                  <Trash2 className='size-4 text-muted-foreground' aria-hidden='true' />
                </Button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
