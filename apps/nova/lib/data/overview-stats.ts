import { format, subDays } from 'date-fns';

export type DailyStats = {
  date: string;
  totalRequests: number;
  totalTokens: number;
  directRequests: number;
  cacheHits: number;
  fallbackRequests: number;
  providerFallbacks: number;
  modelFallbacks: number;
  failedRequests: number;
  blockedRequests: number;
  retriedRequests: number;
  totalCost: number;
  cacheSavings: number;
  p95Ttft: number;
  p95Latency: number;
  avgThroughput: number;
};

export type ProviderHealth = {
  id: string;
  name: string;
  status: 'operational' | 'degraded';
  uptime: number;
  p95Ttft: number;
  throughput: number;
  errorRate: number;
  requests: number;
  routeShare: number;
};

export type RoutingOutcome = {
  id: string;
  label: string;
  description: string;
  value: number;
  percentage: number;
  variant: 'default' | 'neutral' | 'warning' | 'error';
};

export type GatewayIncident = {
  id: string;
  provider: string;
  title: string;
  description: string;
  status: 'investigating' | 'monitoring' | 'resolved';
  time: string;
};

function seededRandom(seed: number) {
  const x = Math.sin(seed) * 10_000;
  return x - Math.floor(x);
}

function generateDailyStats(daysBack: number): DailyStats[] {
  const data: DailyStats[] = [];
  const today = new Date();

  for (let daysAgo = daysBack; daysAgo >= 0; daysAgo--) {
    const date = subDays(today, daysAgo);
    const dayOfWeek = date.getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    const seed = daysAgo * 137 + 42;
    const growthFactor = 1 + ((daysBack - daysAgo) / daysBack) * 0.18;
    const baseRequests = isWeekend ? 10_400 : 15_800;
    const totalRequests = Math.floor((baseRequests + seededRandom(seed) * 3_200 - 1_200) * growthFactor);
    const totalTokens = Math.round(totalRequests * (1_850 + seededRandom(seed + 10) * 750));

    // The newest three days model an Anthropic rate-limit incident that the gateway absorbs.
    const incidentFactor = daysAgo <= 2 ? 1 : 0;
    const cacheRate = 0.3 + seededRandom(seed + 1) * 0.09;
    const fallbackRate = 0.014 + seededRandom(seed + 2) * 0.012 + incidentFactor * 0.032;
    const failureRate = 0.0025 + seededRandom(seed + 3) * 0.003 + incidentFactor * 0.0015;
    const blockedRate = 0.0015 + seededRandom(seed + 4) * 0.0015;
    const retryRate = 0.018 + seededRandom(seed + 5) * 0.016 + incidentFactor * 0.022;

    const cacheHits = Math.floor(totalRequests * cacheRate);
    const fallbackRequests = Math.floor(totalRequests * fallbackRate);
    const providerFallbacks = Math.floor(fallbackRequests * 0.76);
    const modelFallbacks = fallbackRequests - providerFallbacks;
    const failedRequests = Math.floor(totalRequests * failureRate);
    const blockedRequests = Math.floor(totalRequests * blockedRate);
    const retriedRequests = Math.floor(totalRequests * retryRate);
    const directRequests = totalRequests - cacheHits - fallbackRequests - failedRequests - blockedRequests;

    const costPerRequest = 0.0092 + seededRandom(seed + 6) * 0.0034;
    const totalCost = Math.round((directRequests + fallbackRequests) * costPerRequest * 100) / 100;
    const cacheSavings = Math.round(cacheHits * 0.008 * 100) / 100;
    const p95Ttft = Math.round(470 + seededRandom(seed + 7) * 135 + incidentFactor * 155);
    const p95Latency = Math.round(1_450 + seededRandom(seed + 8) * 420 + incidentFactor * 210);
    const avgThroughput = Math.round(94 + seededRandom(seed + 9) * 28 - incidentFactor * 9);

    data.push({
      date: format(date, 'yyyy-MM-dd'),
      totalRequests,
      totalTokens,
      directRequests,
      cacheHits,
      fallbackRequests,
      providerFallbacks,
      modelFallbacks,
      failedRequests,
      blockedRequests,
      retriedRequests,
      totalCost,
      cacheSavings,
      p95Ttft,
      p95Latency,
      avgThroughput,
    });
  }

  return data;
}

export const overviewStats = generateDailyStats(180);

function sum(arr: DailyStats[], key: keyof DailyStats): number {
  return arr.reduce((total, item) => total + (item[key] as number), 0);
}

function avg(arr: DailyStats[], key: keyof DailyStats): number {
  return arr.length === 0 ? 0 : sum(arr, key) / arr.length;
}

function pctChange(current: number, previous: number): number {
  return previous === 0 ? 0 : Math.round(((current - previous) / previous) * 1_000) / 10;
}

export function getOverviewSummary(days: number) {
  const currentPeriod = overviewStats.slice(-days);
  const previousPeriod = overviewStats.slice(-(days * 2), -days);
  const totalRequests = sum(currentPeriod, 'totalRequests');
  const previousRequests = sum(previousPeriod, 'totalRequests');
  const totalTokens = sum(currentPeriod, 'totalTokens');
  const previousTotalTokens = sum(previousPeriod, 'totalTokens');
  const totalCost = sum(currentPeriod, 'totalCost');
  const previousTotalCost = sum(previousPeriod, 'totalCost');
  const successfulRequests =
    totalRequests - sum(currentPeriod, 'failedRequests') - sum(currentPeriod, 'blockedRequests');
  const previousSuccessfulRequests =
    previousRequests - sum(previousPeriod, 'failedRequests') - sum(previousPeriod, 'blockedRequests');
  const fallbackRequests = sum(currentPeriod, 'fallbackRequests');
  const previousFallbackRequests = sum(previousPeriod, 'fallbackRequests');
  const cacheSavings = sum(currentPeriod, 'cacheSavings');
  const previousCacheSavings = sum(previousPeriod, 'cacheSavings');

  const successRate = (successfulRequests / totalRequests) * 100;
  const previousSuccessRate = (previousSuccessfulRequests / previousRequests) * 100;
  const fallbackRate = (fallbackRequests / totalRequests) * 100;
  const previousFallbackRate = (previousFallbackRequests / previousRequests) * 100;

  return {
    requests: {
      value: totalRequests,
      change: pctChange(totalRequests, previousRequests),
    },
    totalTokens: {
      value: totalTokens,
      change: pctChange(totalTokens, previousTotalTokens),
    },
    totalCost: {
      value: Math.round(totalCost * 100) / 100,
      change: pctChange(totalCost, previousTotalCost),
    },
    successRate: {
      value: Math.round(successRate * 100) / 100,
      change: Math.round((successRate - previousSuccessRate) * 100) / 100,
    },
    p95Ttft: {
      value: Math.round(avg(currentPeriod, 'p95Ttft')),
      change: pctChange(avg(currentPeriod, 'p95Ttft'), avg(previousPeriod, 'p95Ttft')),
    },
    p95Latency: {
      value: Math.round(avg(currentPeriod, 'p95Latency')),
      change: pctChange(avg(currentPeriod, 'p95Latency'), avg(previousPeriod, 'p95Latency')),
    },
    fallbackRate: {
      value: Math.round(fallbackRate * 100) / 100,
      change: Math.round((fallbackRate - previousFallbackRate) * 100) / 100,
    },
    cacheSavings: {
      value: Math.round(cacheSavings * 100) / 100,
      change: pctChange(cacheSavings, previousCacheSavings),
    },
    cacheHitRate: Math.round((sum(currentPeriod, 'cacheHits') / totalRequests) * 1_000) / 10,
    retryRate: Math.round((sum(currentPeriod, 'retriedRequests') / totalRequests) * 1_000) / 10,
  };
}

export function getProviderHealth(days: number): ProviderHealth[] {
  const totalRequests = getOverviewSummary(days).requests.value;
  const incidentWeight = days <= 7 ? 1 : days <= 30 ? 0.55 : 0.24;
  const providers = [
    {
      id: 'openai',
      name: 'OpenAI',
      status: 'operational' as const,
      uptime: 99.99,
      p95Ttft: 412,
      throughput: 121,
      errorRate: 0.18,
      routeShare: 34.8,
    },
    {
      id: 'anthropic',
      name: 'Anthropic',
      status: 'degraded' as const,
      uptime: 99.72,
      p95Ttft: Math.round(615 + incidentWeight * 165),
      throughput: Math.round(94 - incidentWeight * 11),
      errorRate: Math.round((0.62 + incidentWeight * 1.24) * 100) / 100,
      routeShare: 29.2,
    },
    {
      id: 'google',
      name: 'Google Vertex',
      status: 'operational' as const,
      uptime: 99.98,
      p95Ttft: 338,
      throughput: 146,
      errorRate: 0.24,
      routeShare: 21.4,
    },
    {
      id: 'bedrock',
      name: 'AWS Bedrock',
      status: 'operational' as const,
      uptime: 99.95,
      p95Ttft: 462,
      throughput: 108,
      errorRate: 0.31,
      routeShare: 9.8,
    },
    {
      id: 'mistral',
      name: 'Mistral',
      status: 'operational' as const,
      uptime: 99.96,
      p95Ttft: 521,
      throughput: 102,
      errorRate: 0.29,
      routeShare: 4.8,
    },
  ];

  return providers.map((provider) => ({
    ...provider,
    requests: Math.round(totalRequests * (provider.routeShare / 100)),
  }));
}

export function getRoutingOutcomes(days: number): RoutingOutcome[] {
  const period = overviewStats.slice(-days);
  const total = sum(period, 'totalRequests');
  const values = {
    primary: sum(period, 'directRequests'),
    cache: sum(period, 'cacheHits'),
    providerFallback: sum(period, 'providerFallbacks'),
    modelFallback: sum(period, 'modelFallbacks'),
    blocked: sum(period, 'blockedRequests'),
    failed: sum(period, 'failedRequests'),
  };

  return [
    {
      id: 'primary',
      label: 'Primary route',
      description: 'Served by the first selected provider',
      value: values.primary,
      percentage: (values.primary / total) * 100,
      variant: 'default' as const,
    },
    {
      id: 'cache',
      label: 'Cache served',
      description: 'Returned without an upstream request',
      value: values.cache,
      percentage: (values.cache / total) * 100,
      variant: 'neutral' as const,
    },
    {
      id: 'providerFallback',
      label: 'Provider fallback',
      description: 'Same model, alternate provider',
      value: values.providerFallback,
      percentage: (values.providerFallback / total) * 100,
      variant: 'warning' as const,
    },
    {
      id: 'modelFallback',
      label: 'Model fallback',
      description: 'Backup model completed the request',
      value: values.modelFallback,
      percentage: (values.modelFallback / total) * 100,
      variant: 'warning' as const,
    },
    {
      id: 'blocked',
      label: 'Policy blocked',
      description: 'Stopped by gateway policy',
      value: values.blocked,
      percentage: (values.blocked / total) * 100,
      variant: 'neutral' as const,
    },
    {
      id: 'failed',
      label: 'Failed',
      description: 'No route completed successfully',
      value: values.failed,
      percentage: (values.failed / total) * 100,
      variant: 'error' as const,
    },
  ];
}

export function getBudgetSummary() {
  const monthly = getOverviewSummary(30);
  const limit = 7_500;
  const spent = monthly.totalCost.value;
  const projected = Math.round(spent * 1.17);

  return {
    limit,
    spent,
    projected,
    utilization: Math.round((spent / limit) * 1_000) / 10,
    projects: [
      { name: 'Production chat', share: 42 },
      { name: 'Support copilot', share: 27 },
      { name: 'Coding agents', share: 19 },
      { name: 'Other', share: 12 },
    ].map((project) => ({
      ...project,
      spend: Math.round(spent * (project.share / 100)),
    })),
  };
}

export const gatewayIncidents: GatewayIncident[] = [
  {
    id: 'inc_01',
    provider: 'Anthropic',
    title: 'Elevated rate limiting',
    description: 'Fallback routing is absorbing impact; 96.8% of affected requests recovered.',
    status: 'investigating',
    time: '18m ago',
  },
  {
    id: 'inc_02',
    provider: 'OpenAI',
    title: 'TTFT returned to baseline',
    description: 'Latency in us-east has remained within SLO for the last 45 minutes.',
    status: 'monitoring',
    time: '1h ago',
  },
  {
    id: 'inc_03',
    provider: 'Google Vertex',
    title: 'Routing maintenance completed',
    description: 'Traffic has returned to the preferred regional endpoint.',
    status: 'resolved',
    time: '6h ago',
  },
];

export const overviewSummary = getOverviewSummary(30);
