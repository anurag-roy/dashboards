import Image from 'next/image';
import { cn } from '@workspace/ui/lib/utils';

type ProviderLogoProps = {
  providerId: string;
  className?: string;
  size?: number;
};

/**
 * Renders a provider logo from /logos/{providerId}.svg.
 * In dark mode the SVG uses currentColor, so we invert via CSS.
 */
export function ProviderLogo({ providerId, className, size = 16 }: ProviderLogoProps) {
  return (
    <Image
      src={`/logos/${providerId}.svg`}
      alt={providerId}
      width={size}
      height={size}
      className={cn('dark:invert', className)}
    />
  );
}
