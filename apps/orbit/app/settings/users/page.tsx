'use client';

import * as React from 'react';
import { type InviteUser, ModalAddUser } from '@/components/ui/settings/modal-add-user';
import { DashboardAvatar } from '@workspace/ui/components/dashboard-avatar';
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

const initialsFromEmail = (email: string) => {
  const [name = email] = email.split('@');
  const parts = name.split(/[._-]/).filter(Boolean);

  return (parts.length > 1 ? `${parts[0]?.[0] ?? ''}${parts[1]?.[0] ?? ''}` : name.slice(0, 2)).toUpperCase();
};

export default function UsersPage() {
  const [members, setMembers] = React.useState(users);
  const [pendingInvitations, setPendingInvitations] = React.useState(invitedUsers);
  const [memberRoles, setMemberRoles] = React.useState(() =>
    Object.fromEntries(users.map((user) => [user.name, user.role]))
  );
  const [invitationRoles, setInvitationRoles] = React.useState(() =>
    Object.fromEntries(invitedUsers.map((user) => [user.initials, user.role]))
  );

  const handleInvite = (invite: InviteUser) => {
    const invitation = {
      initials: `${initialsFromEmail(invite.email)}-${Date.now()}`,
      email: invite.email,
      role: invite.role,
      expires: 14,
    };

    setPendingInvitations((current) => [invitation, ...current]);
    setInvitationRoles((current) => ({ ...current, [invitation.initials]: invite.role }));
  };

  const removeMember = (name: string) => {
    setMembers((current) => current.filter((user) => user.name !== name));
    setMemberRoles((current) => {
      const next = { ...current };
      delete next[name];
      return next;
    });
  };

  const revokeInvitation = (initials: string) => {
    setPendingInvitations((current) => current.filter((user) => user.initials !== initials));
    setInvitationRoles((current) => {
      const next = { ...current };
      delete next[initials];
      return next;
    });
  };

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
          <ModalAddUser onInvite={handleInvite}>
            <Button type='button' className='mt-4 w-full gap-2 sm:mt-0 sm:w-fit'>
              <Plus className='-ml-1 size-4 shrink-0' aria-hidden='true' />
              Add user
            </Button>
          </ModalAddUser>
        </div>
        <ul role='list' className='mt-6 divide-y divide-border'>
          {members.map((user) => (
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
                          <Select value={memberRoles[user.name] ?? user.role} disabled items={roles}>
                            <SelectTrigger className='w-36'>
                              <SelectValue placeholder='Select' />
                            </SelectTrigger>
                            <SelectContent align='end'>
                              {roles.map((role) => (
                                <SelectItem
                                  key={role.value}
                                  value={role.value}
                                  label={role.label}
                                  disabled={role.value === 'admin'}
                                >
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
                  <Select
                    value={memberRoles[user.name] ?? user.role}
                    onValueChange={(value) => {
                      if (!value) {
                        return;
                      }

                      setMemberRoles((current) => ({ ...current, [user.name]: value }));
                    }}
                    items={roles}
                  >
                    <SelectTrigger className='w-36'>
                      <SelectValue placeholder='Select' />
                    </SelectTrigger>
                    <SelectContent align='end'>
                      {roles.map((role) => (
                        <SelectItem
                          key={role.value}
                          value={role.value}
                          label={role.label}
                          disabled={role.value === 'admin'}
                        >
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
                    <DropdownMenuItem
                      variant='destructive'
                      disabled={user.role === 'admin'}
                      onClick={() => removeMember(user.name)}
                    >
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
          {pendingInvitations.map((user) => (
            <li key={user.initials} className='flex items-center justify-between gap-x-6 py-2.5'>
              <div className='flex items-center gap-x-4'>
                <DashboardAvatar seed={user.email} className='hidden size-9 sm:inline-flex' />
                <div>
                  <p className='text-sm font-medium text-foreground'>{user.email}</p>
                  <p className='text-xs text-muted-foreground'>Expires in {user.expires} days</p>
                </div>
              </div>
              <div className='flex items-center gap-2'>
                <Select
                  value={invitationRoles[user.initials] ?? user.role}
                  onValueChange={(value) => {
                    if (!value) {
                      return;
                    }

                    setInvitationRoles((current) => ({ ...current, [user.initials]: value }));
                  }}
                  items={roles}
                >
                  <SelectTrigger className='w-36'>
                    <SelectValue placeholder='Select' />
                  </SelectTrigger>
                  <SelectContent align='end'>
                    {roles.map((role) => (
                      <SelectItem
                        key={role.value}
                        value={role.value}
                        label={role.label}
                        disabled={role.value === 'admin'}
                      >
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
                    <DropdownMenuItem variant='destructive' onClick={() => revokeInvitation(user.initials)}>
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
