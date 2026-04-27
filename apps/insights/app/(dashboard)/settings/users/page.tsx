'use client';

import { Plus, Trash2 } from 'lucide-react';
import { Badge } from '@workspace/ui/components/badge';
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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@workspace/ui/components/table';

import { departments, members } from '@/lib/data/data';
import { DashboardAvatar } from '@/components/dashboard-avatar';

const defaultDepartmentValue = departments[0]?.value ?? 'all-areas';

function permissionValueForLabel(label: string) {
  return departments.find((department) => department.label === label)?.value ?? defaultDepartmentValue;
}

export default function UsersPage() {
  return (
    <section aria-labelledby='members-heading' className='grid grid-cols-1 gap-8 md:grid-cols-3'>
      <div>
        <h2 id='members-heading' className='font-semibold text-foreground'>
          Members
        </h2>
        <p className='mt-2 text-sm leading-6 text-muted-foreground'>
          Invite employees to Insights and manage their permissions across teams.
        </p>
      </div>

      <div className='space-y-4 md:col-span-2'>
        <div className='flex flex-wrap items-center justify-between gap-3'>
          <p className='text-sm font-medium text-foreground'>{members.length} total users</p>

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
                  <DialogTitle>Invite new user</DialogTitle>
                  <DialogDescription>Fill in details below to send an invite to your workspace.</DialogDescription>
                </DialogHeader>
                <div className='mt-5 space-y-4'>
                  <div className='space-y-2'>
                    <Label htmlFor='new-user-email'>Email</Label>
                    <Input id='new-user-email' type='email' placeholder='user@acme.com' />
                  </div>
                  <div className='space-y-2'>
                    <Label htmlFor='new-user-permission'>Permission</Label>
                    <Select defaultValue={defaultDepartmentValue} items={departments}>
                      <SelectTrigger id='new-user-permission' className='w-full'>
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

        <div className='overflow-hidden rounded-3xl border border-border/70 bg-card'>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name / Email</TableHead>
                <TableHead>Date added</TableHead>
                <TableHead>Last active</TableHead>
                <TableHead>Permission</TableHead>
                <TableHead className='text-right'>
                  <span className='sr-only'>Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {members.map((user) => (
                <TableRow key={user.email}>
                  <TableCell>
                    <div className='flex items-center gap-3'>
                      <DashboardAvatar seed={user.name} className='size-9' />
                      <div className='space-y-0.5'>
                        <div className='flex items-center gap-2'>
                          <p className='text-sm font-medium text-foreground'>{user.name}</p>
                          {user.status === 'pending' && <Badge variant='secondary'>Pending</Badge>}
                        </div>
                        <p className='text-xs text-muted-foreground'>{user.email}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className='text-muted-foreground'>{user.dateAdded}</TableCell>
                  <TableCell className='text-muted-foreground'>{user.lastActive}</TableCell>
                  <TableCell>
                    {user.status === 'pending' ? (
                      <Button variant='secondary' size='sm'>
                        Resend invite
                      </Button>
                    ) : (
                      <Select defaultValue={permissionValueForLabel(user.permission)} items={departments}>
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
                    )}
                  </TableCell>
                  <TableCell className='text-right'>
                    <Dialog>
                      <DialogTrigger
                        render={
                          <Button variant='ghost' size='icon-sm' aria-label={`Delete ${user.name}`}>
                            <Trash2 className='size-4 text-muted-foreground' aria-hidden='true' />
                          </Button>
                        }
                      />
                      <DialogContent className='sm:max-w-md'>
                        <DialogHeader>
                          <DialogTitle>Remove user</DialogTitle>
                          <DialogDescription>
                            Are you sure you want to remove {user.name} from this workspace?
                          </DialogDescription>
                        </DialogHeader>
                        <DialogFooter className='mt-6'>
                          <DialogClose render={<Button type='button' variant='secondary' />}>Cancel</DialogClose>
                          <DialogClose render={<Button type='button' variant='destructive' />}>Delete</DialogClose>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </section>
  );
}
