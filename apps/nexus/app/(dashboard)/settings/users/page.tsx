'use client';

import * as React from 'react';
import { Badge } from '@workspace/ui/components/badge';
import { Button } from '@workspace/ui/components/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
  DialogTrigger,
} from '@workspace/ui/components/dialog';
import { Input } from '@workspace/ui/components/input';
import { Label } from '@workspace/ui/components/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@workspace/ui/components/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@workspace/ui/components/table';
import { Plus } from 'lucide-react';

import { settingsUsers } from '@/lib/data/settings-users';
import { relativeTime } from '@/lib/utils';
import { DashboardAvatar } from '@workspace/ui/components/dashboard-avatar';

const roleItems = [
  { value: 'Admin', label: 'Admin' },
  { value: 'Member', label: 'Member' },
  { value: 'Viewer', label: 'Viewer' },
];

export default function UsersPage() {
  return (
    <div className='space-y-10'>
      <section aria-labelledby='team-members'>
        <div className='grid grid-cols-1 gap-x-14 gap-y-8 md:grid-cols-3'>
          <div>
            <h2 id='team-members' className='scroll-mt-10 font-semibold text-foreground'>
              Team members
            </h2>
            <p className='mt-1 text-sm leading-6 text-muted-foreground'>
              Manage team access and roles for your workspace.
            </p>
          </div>
          <div className='md:col-span-2'>
            <div className='flex justify-end'>
              <Dialog>
                <DialogTrigger
                  render={
                    <Button className='gap-1.5'>
                      <Plus className='size-4' aria-hidden='true' />
                      Invite user
                    </Button>
                  }
                />
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Invite team member</DialogTitle>
                    <DialogDescription>Send an invitation to add a new member to this workspace.</DialogDescription>
                  </DialogHeader>
                  <div className='grid gap-4 py-4'>
                    <div className='grid gap-2'>
                      <Label htmlFor='invite-email'>Email address</Label>
                      <Input id='invite-email' type='email' placeholder='colleague@company.com' />
                    </div>
                    <div className='grid gap-2'>
                      <Label htmlFor='invite-role'>Role</Label>
                      <Select defaultValue='Member' items={roleItems}>
                        <SelectTrigger id='invite-role' className='w-full'>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {roleItems.map((item) => (
                            <SelectItem key={item.value} value={item.value}>
                              {item.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <DialogFooter>
                    <DialogClose render={<Button variant='secondary'>Cancel</Button>} />
                    <Button type='submit'>Send invitation</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            <div className='mt-6 overflow-hidden rounded-3xl border border-border shadow-sm'>
              <Table>
                <TableHeader>
                  <TableRow className='hover:bg-transparent'>
                    <TableHead className='text-muted-foreground'>User</TableHead>
                    <TableHead className='text-muted-foreground'>Role</TableHead>
                    <TableHead className='text-muted-foreground'>Last active</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {settingsUsers.map((user) => (
                    <TableRow key={user.email}>
                      <TableCell>
                        <div className='flex items-center gap-3'>
                          <DashboardAvatar seed={user.name} className='size-8' />
                          <div>
                            <p className='text-sm font-medium text-foreground'>{user.name}</p>
                            <p className='text-xs text-muted-foreground'>{user.email}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={user.role === 'Admin' ? 'default' : 'secondary'} className='rounded-full'>
                          {user.role}
                        </Badge>
                      </TableCell>
                      <TableCell suppressHydrationWarning className='text-sm text-muted-foreground'>
                        {relativeTime(user.lastActive)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
