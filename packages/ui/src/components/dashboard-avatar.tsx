'use client';

import { palettes } from '@oreo-design/avatar';
import { Avatar } from '@oreo-design/avatar/react';
import { useId, type CSSProperties } from 'react';

import { cn } from '@workspace/ui/lib/utils';
import { useTheme } from 'next-themes';

const avatarStyle = { width: '100%', height: '100%' } satisfies CSSProperties;

const hashSeed = (seed: string) => {
  let hash = 2166136261;
  for (let index = 0; index < seed.length; index += 1) {
    hash ^= seed.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
};

const getPaletteForSeed = (seed: string) => {
  const paletteIndex = hashSeed(seed) % palettes.length;
  return palettes[paletteIndex]!.id;
};

type DashboardAvatarProps = {
  seed: string;
  className?: string;
};

export function DashboardAvatar({ seed, className }: DashboardAvatarProps) {
  const instanceId = useId();
  const theme = useTheme();
  const resolvedTheme = (theme.resolvedTheme || 'light') as 'light' | 'dark';

  return (
    <div className={cn('inline-flex size-8 shrink-0 rounded-full overflow-clip', className)} aria-hidden='true'>
      <Avatar
        className='size-full [&>svg]:!size-full'
        style={avatarStyle}
        shape='flare'
        palette={getPaletteForSeed(seed)}
        variantId={instanceId}
        appearance={resolvedTheme}
      />
    </div>
  );
}
