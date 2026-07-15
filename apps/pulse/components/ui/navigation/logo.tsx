import { AppLogo } from '@/components/app-logo';

export function Logo({ className }: { className?: string }) {
  return <AppLogo showText className={className} iconClassName='size-7' />;
}
