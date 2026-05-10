'use client';

import { Toaster } from '@workspace/ui/components/sonner';

import { useMediaQuery } from '@/lib/use-media-query';

export function AuditToaster() {
  const isMobile = useMediaQuery('(max-width: 767px)');

  return <Toaster position={isMobile ? 'bottom-center' : 'bottom-right'} richColors closeButton visibleToasts={3} />;
}
