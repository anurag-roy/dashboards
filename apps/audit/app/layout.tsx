import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';

import '@workspace/ui/globals.css';
import { siteConfig } from '@/app/siteConfig';
import { ThemeProvider } from '@workspace/ui/components/theme-provider';
import { TooltipProvider } from '@workspace/ui/components/tooltip';
import { cn } from '@workspace/ui/lib/utils';

const geist = Geist({ subsets: ['latin'], variable: '--font-sans' });
const geistMono = Geist_Mono({
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
      { url: '/logos/audit-light.svg', media: '(prefers-color-scheme: light)', type: 'image/svg+xml' },
      { url: '/logos/audit-dark.svg', media: '(prefers-color-scheme: dark)', type: 'image/svg+xml' },
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
          'overflow-y-scroll scroll-auto bg-background antialiased selection:bg-primary/20 selection:text-primary',
          geist.variable,
          geistMono.variable,
          'font-sans'
        )}
        suppressHydrationWarning
      >
        <ThemeProvider>
          <TooltipProvider delay={0}>{children}</TooltipProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
