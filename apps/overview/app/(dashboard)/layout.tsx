import { Navigation } from '@/components/ui/navigation/navigation';

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Navigation />
      <div className='mx-auto w-full max-w-7xl p-4 sm:px-6 sm:py-8 lg:px-10 lg:py-7'>{children}</div>
    </>
  );
}
