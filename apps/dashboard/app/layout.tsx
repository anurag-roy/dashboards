import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';

import '@workspace/ui/globals.css';
import { siteConfig } from '@/app/siteConfig';
import { MobileSidebarHeader, Sidebar } from '@/components/ui/navigation/sidebar';
import { ThemeProvider } from '@/components/theme-provider';
import { SidebarInset, SidebarProvider } from '@workspace/ui/components/sidebar';
import { cn } from '@workspace/ui/lib/utils';
import { TooltipProvider } from '@workspace/ui/components/tooltip';

const geist = Geist({ subsets: ['latin'], variable: '--font-sans' });
const fontMono = Geist_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://yoururl.com'),
  title: siteConfig.name,
  description: siteConfig.description,
  keywords: [],
  authors: [{ name: 'yourname', url: '' }],
  creator: 'yourname',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: siteConfig.url,
    title: siteConfig.name,
    description: siteConfig.description,
    siteName: siteConfig.name,
  },
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en' suppressHydrationWarning>
      <body
        className={cn(
          'overflow-y-scroll scroll-auto antialiased selection:bg-primary/20 selection:text-primary',
          fontMono.variable,
          'font-sans',
          geist.variable
        )}
        suppressHydrationWarning
      >
        <ThemeProvider>
          <TooltipProvider delay={0}>
            <SidebarProvider>
              <Sidebar />
              <SidebarInset>
                <MobileSidebarHeader />
                <div className='mx-auto w-full max-w-7xl'>{children}</div>
              </SidebarInset>
            </SidebarProvider>
          </TooltipProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
