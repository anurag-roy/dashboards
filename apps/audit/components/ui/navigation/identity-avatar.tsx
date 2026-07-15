import { DashboardAvatar } from '@workspace/ui/components/dashboard-avatar';

type IdentityAvatarProps = {
  name: string;
  className?: string;
};

export function IdentityAvatar({ name, className }: IdentityAvatarProps) {
  return <DashboardAvatar seed={name} className={className} />;
}
