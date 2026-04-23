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
import { Input } from '@workspace/ui/components/input';
import { Label } from '@workspace/ui/components/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@workspace/ui/components/select';
import { roles } from '@/lib/data/data';

export type ModalAddUserProps = {
  children: React.ReactNode;
};

export function ModalAddUser({ children }: ModalAddUserProps) {
  const trigger = React.isValidElement(children) ? children : <Button type='button'>{children}</Button>;

  return (
    <Dialog>
      <DialogTrigger render={trigger} />
      <DialogContent className='sm:max-w-lg' showCloseButton>
        <form
          onSubmit={(e) => {
            e.preventDefault();
          }}
        >
          <DialogHeader>
            <DialogTitle>Invite people to your workspace</DialogTitle>
            <DialogDescription className='mt-1 text-sm leading-6'>
              With free plan, you can add up to 10 users to each workspace.
            </DialogDescription>
            <div className='mt-4'>
              <Label htmlFor='email-new-user' className='font-medium'>
                Email
              </Label>
              <Input id='email-new-user' name='email-new-user' placeholder='Insert email...' className='mt-2' />
            </div>
            <div className='mt-4'>
              <Label htmlFor='role-new-user' className='font-medium'>
                Select role
              </Label>
              <Select items={roles}>
                <SelectTrigger id='role-new-user' name='role-new-user' className='mt-2'>
                  <SelectValue placeholder='Select role...' />
                </SelectTrigger>
                <SelectContent align='end'>
                  {roles.map((role) => (
                    <SelectItem key={role.value} value={role.value} disabled={role.value === 'admin'}>
                      {role.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </DialogHeader>
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
