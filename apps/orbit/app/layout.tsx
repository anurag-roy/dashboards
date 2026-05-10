import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';

import '@workspace/ui/globals.css';
import { siteConfig } from '@/app/siteConfig';
import { MobileSidebarHeader, Sidebar } from '@/components/ui/navigation/sidebar';
import { ThemeProvider } from '@workspace/ui/components/theme-provider';
import { SidebarInset, SidebarProvider } from '@workspace/ui/components/sidebar';
import { cn } from '@workspace/ui/lib/utils';
import { TooltipProvider } from '@workspace/ui/components/tooltip';

const geist = Geist({ subsets: ['latin'], variable: '--font-sans' });
const fontMono = Geist_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: [],
  authors: [{ name: 'Anurag Roy', url: 'https://anuragroy.dev' }],
  creator: 'Anurag Roy',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: siteConfig.url,
    title: siteConfig.name,
    description: siteConfig.description,
    siteName: siteConfig.name,
  },
  icons: {
    icon: [
      { url: '/logos/orbit-light.svg', media: '(prefers-color-scheme: light)', type: 'image/svg+xml' },
      { url: '/logos/orbit-dark.svg', media: '(prefers-color-scheme: dark)', type: 'image/svg+xml' },
    ],
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
          'theme-orbit overflow-y-scroll scroll-auto antialiased selection:bg-primary/20 selection:text-primary',
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
