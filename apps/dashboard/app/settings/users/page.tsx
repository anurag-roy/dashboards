'use client';

import { ModalAddUser } from '@/components/ui/settings/modal-add-user';
import { DashboardAvatar } from '@/components/dashboard-avatar';
import { invitedUsers, roles, users } from '@/lib/data/data';
import { Button } from '@workspace/ui/components/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@workspace/ui/components/dropdown-menu';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@workspace/ui/components/select';
import { Tooltip, TooltipContent, TooltipTrigger } from '@workspace/ui/components/tooltip';
import { MoreHorizontal, Plus } from 'lucide-react';

export default function UsersPage() {
  return (
    <>
      <section aria-labelledby='existing-users'>
        <div className='sm:flex sm:items-center sm:justify-between'>
          <div>
            <h2 id='existing-users' className='scroll-mt-10 font-semibold text-foreground'>
              Users
            </h2>
            <p className='text-sm leading-6 text-muted-foreground'>
              Workspace administrators can add, manage, and remove users.
            </p>
          </div>
          <ModalAddUser>
            <Button className='mt-4 w-full gap-2 sm:mt-0 sm:w-fit'>
              <Plus className='-ml-1 size-4 shrink-0' aria-hidden='true' />
              Add user
            </Button>
          </ModalAddUser>
        </div>
        <ul role='list' className='mt-6 divide-y divide-border'>
          {users.map((user) => (
            <li key={user.name} className='flex items-center justify-between gap-x-6 py-2.5'>
              <div className='flex items-center gap-x-4 truncate'>
                <DashboardAvatar seed={user.name} className='hidden size-9 sm:inline-flex' />
                <div className='truncate'>
                  <p className='truncate text-sm font-medium text-foreground'>{user.name}</p>
                  <p className='truncate text-xs text-muted-foreground'>{user.email}</p>
                </div>
              </div>
              <div className='flex items-center gap-2'>
                {user.role === 'admin' ? (
                  <Tooltip>
                    <TooltipTrigger
                      render={
                        <div className='inline-flex w-full min-w-0 sm:w-auto'>
                          <Select defaultValue={user.role} disabled={user.role === 'admin'} items={roles}>
                            <SelectTrigger className='w-36'>
                              <SelectValue placeholder='Select' />
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
                      }
                    />
                    <TooltipContent className='max-w-44 text-xs' sideOffset={5}>
                      A workspace must have at least one admin
                    </TooltipContent>
                  </Tooltip>
                ) : (
                  <Select defaultValue={user.role} disabled={user.role === 'admin'} items={roles}>
                    <SelectTrigger className='w-36'>
                      <SelectValue placeholder='Select' />
                    </SelectTrigger>
                    <SelectContent align='end'>
                      {roles.map((role) => (
                        <SelectItem key={role.value} value={role.value} disabled={role.value === 'admin'}>
                          {role.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
                <DropdownMenu>
                  <DropdownMenuTrigger
                    render={
                      <Button
                        variant='ghost'
                        size='icon-sm'
                        className='group rounded-2xl hover:bg-muted data-open:bg-muted'
                      >
                        <MoreHorizontal
                          className='size-4 shrink-0 text-muted-foreground group-hover:text-foreground'
                          aria-hidden='true'
                        />
                      </Button>
                    }
                  />
                  <DropdownMenuContent align='end' className='w-36'>
                    <DropdownMenuItem>View details</DropdownMenuItem>
                    <DropdownMenuItem variant='destructive' disabled={user.role === 'admin'}>
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </li>
          ))}
        </ul>
      </section>
      <section className='mt-12' aria-labelledby='pending-invitations'>
        <h2 id='pending-invitations' className='scroll-mt-10 font-semibold text-foreground'>
          Pending invitations
        </h2>
        <ul role='list' className='mt-6 divide-y divide-border'>
          {invitedUsers.map((user) => (
            <li key={user.initials} className='flex items-center justify-between gap-x-6 py-2.5'>
              <div className='flex items-center gap-x-4'>
                <DashboardAvatar seed={user.email} className='hidden size-9 sm:inline-flex' />
                <div>
                  <p className='text-sm font-medium text-foreground'>{user.email}</p>
                  <p className='text-xs text-muted-foreground'>Expires in {user.expires} days</p>
                </div>
              </div>
              <div className='flex items-center gap-2'>
                <Select defaultValue={user.role} items={roles}>
                  <SelectTrigger className='w-36'>
                    <SelectValue placeholder='Select' />
                  </SelectTrigger>
                  <SelectContent align='end'>
                    {roles.map((role) => (
                      <SelectItem key={role.value} value={role.value} disabled={role.value === 'admin'}>
                        {role.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <DropdownMenu>
                  <DropdownMenuTrigger
                    render={
                      <Button
                        variant='ghost'
                        size='icon-sm'
                        className='group rounded-2xl hover:bg-muted data-open:bg-muted'
                      >
                        <MoreHorizontal
                          className='size-4 shrink-0 text-muted-foreground group-hover:text-foreground'
                          aria-hidden='true'
                        />
                      </Button>
                    }
                  />
                  <DropdownMenuContent align='end' className='w-36'>
                    <DropdownMenuItem variant='destructive' disabled={user.role === 'admin'}>
                      Revoke invitation
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
