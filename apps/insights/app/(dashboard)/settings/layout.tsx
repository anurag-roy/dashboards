'use client';

import { usePathname, useRouter } from 'next/navigation';
import { Tabs, TabsList, TabsTrigger } from '@workspace/ui/components/tabs';

import { siteConfig } from '@/app/siteConfig';

const navigationSettings = [
  { name: 'Audit', href: siteConfig.baseLinks.settings.audit },
  { name: 'Billing & Usage', href: siteConfig.baseLinks.settings.billing },
  { name: 'Users', href: siteConfig.baseLinks.settings.users },
] as const;

export default function SettingsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const router = useRouter();
  const activeTab = navigationSettings.some((item) => item.href === pathname)
    ? pathname
    : siteConfig.baseLinks.settings.audit;

  return (
    <section className='space-y-6 py-1'>
      <div className='space-y-1'>
        <h1 className='text-lg font-semibold text-foreground sm:text-xl'>Settings</h1>
        <p className='text-sm text-muted-foreground'>Manage policies, billing configuration, and workspace access.</p>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={(value) => {
          if (value !== pathname) {
            router.push(value);
          }
        }}
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

      <div>{children}</div>
    </section>
  );
}
