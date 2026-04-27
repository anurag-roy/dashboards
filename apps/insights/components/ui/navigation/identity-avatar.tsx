import { DashboardAvatar } from '@/components/dashboard-avatar';

type IdentityAvatarProps = {
  name: string;
  className?: string;
  square?: boolean;
};

export function IdentityAvatar({ name, className, square = false }: IdentityAvatarProps) {
  return <DashboardAvatar seed={name} square={square} className={className} />;
}
