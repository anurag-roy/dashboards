'use client';

import * as React from 'react';
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
import { roles } from '@/lib/data/data';
import { useMediaQuery } from '@/lib/use-media-query';

export type InviteUser = {
  email: string;
  role: string;
};

export type ModalAddUserProps = {
  children: React.ReactNode;
  onInvite?: (user: InviteUser) => void;
};

function InviteFields({
  idPrefix,
  email,
  role,
  onEmailChange,
  onRoleChange,
}: {
  idPrefix: string;
  email: string;
  role: string;
  onEmailChange: (value: string) => void;
  onRoleChange: (value: string) => void;
}) {
  const emailId = `${idPrefix}-email-new-user`;
  const roleId = `${idPrefix}-role-new-user`;

  return (
    <div className='mt-4 flex flex-col gap-4'>
      <div>
        <Label htmlFor={emailId} className='font-medium'>
          Email
        </Label>
        <Input
          id={emailId}
          name={emailId}
          placeholder='you@company.com'
          type='email'
          value={email}
          onChange={(event) => onEmailChange(event.target.value)}
          className='mt-2'
        />
      </div>
      <div>
        <Label htmlFor={roleId} className='font-medium'>
          Select role
        </Label>
        <Select
          value={role}
          onValueChange={(value) => {
            if (value) {
              onRoleChange(value);
            }
          }}
          items={roles}
        >
          <SelectTrigger id={roleId} name={roleId} className='mt-2 w-full'>
            <SelectValue placeholder='Select role...' />
          </SelectTrigger>
          <SelectContent align='end'>
            {roles.map((roleOption) => (
              <SelectItem
                key={roleOption.value}
                value={roleOption.value}
                label={roleOption.label}
                disabled={roleOption.value === 'admin'}
              >
                {roleOption.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}

export function ModalAddUser({ children, onInvite }: ModalAddUserProps) {
  const isDesktop = useMediaQuery('(min-width: 768px)');
  const id = React.useId();
  const [open, setOpen] = React.useState(false);
  const [email, setEmail] = React.useState('');
  const [role, setRole] = React.useState('member');
  const trigger = React.isValidElement(children) ? children : <Button type='button'>{children}</Button>;

  const handleInvite = () => {
    const trimmedEmail = email.trim();

    if (!trimmedEmail) {
      toast.error('Email required', {
        description: 'Add an email address before sending the invite.',
      });
      return;
    }

    onInvite?.({ email: trimmedEmail, role });
    toast.success('Invitation added', {
      description: `${trimmedEmail} is now pending.`,
    });
    setEmail('');
    setRole('member');
    setOpen(false);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    handleInvite();
  };

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger render={trigger} />
        <DialogContent className='sm:max-w-lg' showCloseButton>
          <form className='contents' onSubmit={handleSubmit}>
            <DialogHeader>
              <DialogTitle>Invite people to your workspace</DialogTitle>
              <DialogDescription className='mt-1 text-sm leading-6'>
                On the free plan, you can add up to 10 users to each workspace.
              </DialogDescription>
            </DialogHeader>
            <InviteFields
              idPrefix={`${id}-desktop`}
              email={email}
              role={role}
              onEmailChange={setEmail}
              onRoleChange={setRole}
            />
            <DialogFooter className='mt-6'>
              <DialogClose
                className='mt-2 w-full sm:mt-0 sm:w-auto'
                render={<Button variant='secondary' type='button' className='w-full sm:w-fit' />}
              >
                Go back
              </DialogClose>
              <Button type='submit' className='w-full sm:w-fit'>
                Add user
              </Button>
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
        <form className='contents' onSubmit={handleSubmit}>
          <DrawerHeader className='text-left'>
            <DrawerTitle>Invite people to your workspace</DrawerTitle>
            <DrawerDescription>On the free plan, you can add up to 10 users to each workspace.</DrawerDescription>
          </DrawerHeader>
          <div className='overflow-y-auto px-4 pb-4'>
            <InviteFields
              idPrefix={`${id}-mobile`}
              email={email}
              role={role}
              onEmailChange={setEmail}
              onRoleChange={setRole}
            />
          </div>
          <DrawerFooter className='border-t border-border/70'>
            <DrawerClose asChild>
              <Button type='button' variant='secondary'>
                Go back
              </Button>
            </DrawerClose>
            <Button type='submit'>Add user</Button>
          </DrawerFooter>
        </form>
      </DrawerContent>
    </Drawer>
  );
}
