'use client';

import { siteConfig } from '@/app/siteConfig';
import { Tabs, TabsList, TabsTrigger } from '@workspace/ui/components/tabs';
import { usePathname, useRouter } from 'next/navigation';

const navigationSettings = [
  { name: 'General', href: siteConfig.baseLinks.settings.general },
  { name: 'Billing & Usage', href: siteConfig.baseLinks.settings.billing },
  { name: 'Users', href: siteConfig.baseLinks.settings.users },
];

export default function SettingsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const router = useRouter();
  const activeTab = navigationSettings.some((item) => item.href === pathname)
    ? pathname
    : siteConfig.baseLinks.settings.general;

  return (
    <div className='p-4 sm:px-6 sm:pt-10 sm:pb-10 lg:px-10 lg:pt-7'>
      <h1 className='text-lg font-semibold text-foreground sm:text-xl'>Settings</h1>
      <Tabs
        value={activeTab}
        onValueChange={(value) => {
          if (value !== pathname) {
            router.push(value);
          }
        }}
        className='mt-4 sm:mt-6 lg:mt-10'
      >
        <TabsList
          variant='line'
          aria-label='Settings sections'
          className='w-full justify-start overflow-x-auto border-b border-border [scrollbar-width:none] [&::-webkit-scrollbar]:hidden'
        >
          {navigationSettings.map((item) => (
            <TabsTrigger key={item.name} value={item.href} className='flex-none'>
              {item.name}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
      <div className='pt-6'>{children}</div>
    </div>
  );
}
