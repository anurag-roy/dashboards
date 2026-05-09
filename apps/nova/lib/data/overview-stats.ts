import { subDays, format } from 'date-fns';

export type DailyStats = {
  date: string;
  totalRequests: number;
  promptTokens: number;
  completionTokens: number;
  totalCost: number;
  p50Latency: number;
  p95Latency: number;
  p99Latency: number;
  errorCount: number;
  successCount: number;
  cacheHits: number;
};

function seededRandom(seed: number) {
  const x = Math.sin(seed) * 10_000;
  return x - Math.floor(x);
}

function generateDailyStats(daysBack: number): DailyStats[] {
  const data: DailyStats[] = [];
  const today = new Date();

  for (let i = daysBack; i >= 0; i--) {
    const date = subDays(today, i);
    const dayOfWeek = date.getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    const seed = i * 137 + 42;

    const baseRequests = isWeekend ? 10_000 : 16_000;
    const requestJitter = Math.floor(seededRandom(seed) * 4_000) - 2_000;
    const growthFactor = 1 + ((daysBack - i) / daysBack) * 0.15;
    const totalRequests = Math.floor((baseRequests + requestJitter) * growthFactor);

    const avgPromptTokens = 1_300 + Math.floor(seededRandom(seed + 1) * 400);
    const avgCompletionTokens = 850 + Math.floor(seededRandom(seed + 2) * 300);
    const promptTokens = totalRequests * avgPromptTokens;
    const completionTokens = totalRequests * avgCompletionTokens;

    const costPerRequest = 0.008 + seededRandom(seed + 3) * 0.006;
    const totalCost = Math.round(totalRequests * costPerRequest * 100) / 100;

    const p50Latency = 220 + Math.floor(seededRandom(seed + 4) * 80);
    const p95Latency = Math.floor(p50Latency * 3.2 + seededRandom(seed + 5) * 200);
    const p99Latency = Math.floor(p95Latency * 1.6 + seededRandom(seed + 6) * 300);

    const errorRate = 0.003 + seededRandom(seed + 7) * 0.008;
    const errorCount = Math.floor(totalRequests * errorRate);
    const successCount = totalRequests - errorCount;

    const cacheRate = 0.28 + seededRandom(seed + 8) * 0.15;
    const cacheHits = Math.floor(totalRequests * cacheRate);

    data.push({
      date: format(date, 'yyyy-MM-dd'),
      totalRequests,
      promptTokens,
      completionTokens,
      totalCost,
      p50Latency,
      p95Latency,
      p99Latency,
      errorCount,
      successCount,
      cacheHits,
    });
  }

  return data;
}

export const overviewStats = generateDailyStats(90);

export function sum(arr: DailyStats[], key: keyof DailyStats): number {
  return arr.reduce((acc, d) => acc + (d[key] as number), 0);
}

export function avg(arr: DailyStats[], key: keyof DailyStats): number {
  return arr.length === 0 ? 0 : sum(arr, key) / arr.length;
}

export function pctChange(current: number, previous: number): number {
  return previous === 0 ? 0 : Math.round(((current - previous) / previous) * 1_000) / 10;
}

export function getOverviewSummary(days: number) {
  const currentPeriod = overviewStats.slice(-days);
  const prevPeriod = overviewStats.slice(-(days * 2), -days);

  return {
    totalRequests: {
      value: sum(currentPeriod, 'totalRequests'),
      change: pctChange(sum(currentPeriod, 'totalRequests'), sum(prevPeriod, 'totalRequests')),
      previous: sum(prevPeriod, 'totalRequests'),
    },
    totalTokens: {
      value: sum(currentPeriod, 'promptTokens') + sum(currentPeriod, 'completionTokens'),
      change: pctChange(
        sum(currentPeriod, 'promptTokens') + sum(currentPeriod, 'completionTokens'),
        sum(prevPeriod, 'promptTokens') + sum(prevPeriod, 'completionTokens')
      ),
      previous: sum(prevPeriod, 'promptTokens') + sum(prevPeriod, 'completionTokens'),
    },
    totalCost: {
      value: sum(currentPeriod, 'totalCost'),
      change: pctChange(sum(currentPeriod, 'totalCost'), sum(prevPeriod, 'totalCost')),
      previous: sum(prevPeriod, 'totalCost'),
    },
    avgP50Latency: Math.round(avg(currentPeriod, 'p50Latency')),
    avgP95Latency: Math.round(avg(currentPeriod, 'p95Latency')),
    avgP99Latency: Math.round(avg(currentPeriod, 'p99Latency')),
    successRate: Math.round((sum(currentPeriod, 'successCount') / sum(currentPeriod, 'totalRequests')) * 1_000) / 10,
    errorRate: Math.round((sum(currentPeriod, 'errorCount') / sum(currentPeriod, 'totalRequests')) * 1_000) / 10,
    cacheHitRate: Math.round((sum(currentPeriod, 'cacheHits') / sum(currentPeriod, 'totalRequests')) * 1_000) / 10,
    cacheSavings: Math.round(sum(currentPeriod, 'cacheHits') * 0.01 * 100) / 100,
  };
}

export const overviewSummary = getOverviewSummary(30);
