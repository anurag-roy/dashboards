'use client';

import { formatDistanceToNow, format } from 'date-fns';
import { Bell } from 'lucide-react';
import { Button } from '@workspace/ui/components/button';
import { Popover, PopoverContent, PopoverTrigger } from '@workspace/ui/components/popover';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@workspace/ui/components/tabs';

interface Notification {
  id: string;
  message: string;
  date: string;
  read: boolean;
}

const notifications: Notification[] = [
  {
    id: 'msg_j2k4l9m3',
    message: "We've updated the navigation to make it easier to find the things you use most.",
    date: '2026-04-15',
    read: false,
  },
  {
    id: 'msg_h8n2p5r6',
    message:
      "We're updating our Privacy Policy, effective 1 May 2026. By keeping your account open after that date, you are agreeing to the updated terms.",
    date: '2026-03-28',
    read: false,
  },
  {
    id: 'msg_t7v9w4x2',
    message: 'New feature: Dark mode is now available across all platforms.',
    date: '2026-02-10',
    read: false,
  },
  {
    id: 'msg_a3b5c7d9',
    message: 'Introducing our new mobile app features for enhanced productivity.',
    date: '2025-11-15',
    read: true,
  },
  {
    id: 'msg_e2f4g6h8',
    message: "Security update: We've added two-factor authentication support.",
    date: '2025-09-22',
    read: true,
  },
  {
    id: 'msg_k1l3m5n7',
    message: "We're updating our Privacy Policy as of 3rd February 2025.",
    date: '2025-07-06',
    read: true,
  },
  {
    id: 'msg_p8q2r4s6',
    message: 'New collaboration tools are now available in your workspace.',
    date: '2025-05-18',
    read: true,
  },
  {
    id: 'msg_u9v1w3x5',
    message: 'Platform maintenance scheduled for next weekend.',
    date: '2025-03-30',
    read: true,
  },
  {
    id: 'msg_y7z9a2b4',
    message: 'Check out our new tutorial series for advanced features.',
    date: '2025-01-15',
    read: true,
  },
];

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();

  return now.getTime() - date.getTime() < 7 * 24 * 60 * 60 * 1000
    ? formatDistanceToNow(date, { addSuffix: true })
    : format(date, 'd MMM yyyy');
}

function NotificationItem({ notification }: { notification: Notification }) {
  return (
    <li className='py-1.5'>
      <a href='#' className='relative block rounded-xl px-3 py-2.5 hover:bg-muted focus:outline-none'>
        <span aria-hidden='true' className='absolute inset-0' />
        <p className='text-sm text-foreground'>
          {!notification.read && (
            <span aria-hidden='true' className='mr-1.5 mb-px inline-flex size-2 shrink-0 rounded-full bg-primary' />
          )}
          {notification.message}
        </p>
        <p className='mt-2 text-xs text-muted-foreground'>{formatDate(notification.date)}</p>
      </a>
    </li>
  );
}

function NotificationList({ showAll = false }: { showAll?: boolean }) {
  const filteredNotifications = showAll ? notifications : notifications.filter(({ read }) => !read);

  return (
    <ol aria-label='Notifications' className='flex max-h-96 flex-col divide-y divide-border overflow-y-auto'>
      {filteredNotifications.map((notification) => (
        <NotificationItem key={notification.id} notification={notification} />
      ))}
    </ol>
  );
}

export function Notifications() {
  const unreadCount = notifications.filter(({ read }) => !read).length;

  return (
    <Popover>
      <PopoverTrigger
        render={
          <Button
            variant='ghost'
            size='icon-lg'
            aria-label='Open notifications'
            className='relative rounded-full hover:bg-muted data-open:bg-muted'
          />
        }
      >
        <span className='flex size-8 items-center justify-center rounded-full border border-border bg-background'>
          {unreadCount > 0 && (
            <span className='absolute top-1 right-1 size-2 shrink-0 rounded-full bg-primary' aria-hidden='true' />
          )}
          <Bell className='size-4 shrink-0 text-muted-foreground' aria-hidden='true' />
        </span>
      </PopoverTrigger>
      <PopoverContent align='end' className='z-20 ml-2 w-[26rem] max-w-[95vw] px-4 sm:ml-0'>
        <div className='flex items-center justify-between gap-4'>
          <h2 className='text-base font-semibold text-foreground'>Notifications</h2>
          <Button variant='ghost' size='sm' className='shrink-0'>
            Mark all as read
          </Button>
        </div>
        <Tabs defaultValue='unread'>
          <TabsList className='w-full'>
            <TabsTrigger value='unread'>Unread</TabsTrigger>
            <TabsTrigger value='all'>All</TabsTrigger>
          </TabsList>
          <TabsContent value='unread'>
            <NotificationList />
          </TabsContent>
          <TabsContent value='all'>
            <NotificationList showAll />
            <Button variant='outline' className='mt-2 w-full' size='sm'>
              View all
            </Button>
          </TabsContent>
        </Tabs>
      </PopoverContent>
    </Popover>
  );
}
