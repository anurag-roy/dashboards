import { Database, GitBranch, Route } from 'lucide-react';

import { InsightBadge } from '@workspace/ui/components/insight-badge';

import type { Trace } from '@/lib/data/traces';

const routeConfig = {
  primary: { label: 'Primary', variant: 'neutral' as const, icon: Route },
  fallback: { label: 'Fallback', variant: 'warning' as const, icon: GitBranch },
  cache: { label: 'Cache', variant: 'success' as const, icon: Database },
};

export function RouteOutcomeBadge({ outcome }: { outcome: Trace['routeOutcome'] }) {
  const config = routeConfig[outcome];
  const Icon = config.icon;

  return (
    <InsightBadge variant={config.variant}>
      <Icon className='size-3' aria-hidden='true' />
      {config.label}
    </InsightBadge>
  );
}
