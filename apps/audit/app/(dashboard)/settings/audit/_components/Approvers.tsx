'use client';

import { useId, useState, type FormEvent } from 'react';
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
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@workspace/ui/components/drawer';
import { Input } from '@workspace/ui/components/input';
import { Label } from '@workspace/ui/components/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@workspace/ui/components/select';
import { toast } from '@workspace/ui/components/sonner';

import { DashboardAvatar } from '@workspace/ui/components/dashboard-avatar';
import { approvers, departments } from '@/lib/data/data';
import { useMediaQuery } from '@/lib/use-media-query';

const defaultDepartmentValue = departments[0]?.value ?? 'all-areas';

type Approver = {
  name: string;
  email: string;
  permission: string;
};

function departmentValueForLabel(label: string) {
  return departments.find((department) => department.label === label)?.value ?? defaultDepartmentValue;
}

function nameFromEmail(email: string) {
  const name = email.split('@')[0] ?? 'new approver';

  return name
    .split(/[._-]/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join(' ');
}

function ApproverFields({
  idPrefix,
  email,
  permission,
  onEmailChange,
  onPermissionChange,
}: {
  idPrefix: string;
  email: string;
  permission: string;
  onEmailChange: (value: string) => void;
  onPermissionChange: (value: string) => void;
}) {
  const emailId = `${idPrefix}-email`;
  const permissionId = `${idPrefix}-permission`;

  return (
    <div className='mt-5 space-y-4'>
      <div className='space-y-2'>
        <Label htmlFor={emailId}>Email</Label>
        <Input
          id={emailId}
          type='email'
          value={email}
          onChange={(event) => onEmailChange(event.target.value)}
          placeholder='teammate@acme.com'
          required
        />
      </div>
      <div className='space-y-2'>
        <Label htmlFor={permissionId}>Permission</Label>
        <Select
          value={permission}
          items={departments}
          onValueChange={(value) => onPermissionChange(value ?? defaultDepartmentValue)}
        >
          <SelectTrigger id={permissionId} className='w-full'>
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
  );
}

function AddApproverOverlay({ onInvite }: { onInvite: (approver: Approver) => void }) {
  const isDesktop = useMediaQuery('(min-width: 768px)');
  const id = useId();
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [permission, setPermission] = useState(defaultDepartmentValue);
  const trigger = (
    <Button className='gap-2'>
      <Plus className='size-4' aria-hidden='true' />
      Add user
    </Button>
  );
  const fields = (
    <ApproverFields
      idPrefix={`${id}-${isDesktop ? 'desktop' : 'mobile'}`}
      email={email}
      permission={permission}
      onEmailChange={setEmail}
      onPermissionChange={setPermission}
    />
  );

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextEmail = email.trim().toLowerCase();

    onInvite({
      name: nameFromEmail(nextEmail),
      email: nextEmail,
      permission,
    });
    setEmail('');
    setPermission(defaultDepartmentValue);
    setOpen(false);
  }

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger render={trigger} />
        <DialogContent className='sm:max-w-lg'>
          <form onSubmit={handleSubmit}>
            <DialogHeader>
              <DialogTitle>Add approver</DialogTitle>
              <DialogDescription>Invite a teammate and assign their approval scope.</DialogDescription>
            </DialogHeader>
            {fields}
            <DialogFooter className='mt-6'>
              <DialogClose render={<Button type='button' variant='secondary' />}>Cancel</DialogClose>
              <Button type='submit'>Send invite</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>{trigger}</DrawerTrigger>
      <DrawerContent className='max-h-[90svh]'>
        <form onSubmit={handleSubmit}>
          <DrawerHeader className='text-left'>
            <DrawerTitle>Add approver</DrawerTitle>
            <DrawerDescription>Invite a teammate and assign their approval scope.</DrawerDescription>
          </DrawerHeader>
          <div className='overflow-y-auto px-4 pb-4'>{fields}</div>
          <DrawerFooter className='border-t border-border/70'>
            <DrawerClose asChild>
              <Button type='button' variant='secondary'>
                Cancel
              </Button>
            </DrawerClose>
            <Button type='submit'>Send invite</Button>
          </DrawerFooter>
        </form>
      </DrawerContent>
    </Drawer>
  );
}

export default function Approvers() {
  const [approverList, setApproverList] = useState<Approver[]>(() =>
    approvers.map((user) => ({
      name: user.name,
      email: user.email,
      permission: departmentValueForLabel(user.permission),
    }))
  );

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
          <p className='text-sm font-medium text-foreground'>{approverList.length} users with approval rights</p>

          <AddApproverOverlay
            onInvite={(approver) => {
              const existingApprover = approverList.find((user) => user.email === approver.email);

              if (existingApprover) {
                toast.warning(`${approver.email} already has approval rights.`);
                return;
              }

              setApproverList((current) => [approver, ...current]);
              toast.success(`${approver.name} invited as an approver.`);
            }}
          />
        </div>

        <ul role='list' className='divide-y divide-border rounded-3xl border border-border/70 bg-card px-4 sm:px-5'>
          {approverList.map((user) => (
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
                  value={user.permission}
                  items={departments}
                  onValueChange={(value) => {
                    const nextPermission = value ?? defaultDepartmentValue;

                    setApproverList((current) =>
                      current.map((approver) =>
                        approver.email === user.email ? { ...approver, permission: nextPermission } : approver
                      )
                    );
                    toast.success(`${user.name}'s approval scope updated.`);
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

                <Button
                  variant='ghost'
                  size='icon-sm'
                  aria-label={`Remove ${user.name}`}
                  onClick={() => {
                    setApproverList((current) => current.filter((approver) => approver.email !== user.email));
                    toast.success(`${user.name} removed from approvers.`);
                  }}
                >
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
