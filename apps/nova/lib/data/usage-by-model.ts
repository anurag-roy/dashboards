import { subDays, format } from 'date-fns';
import { models } from './models';

export type ModelDailyUsage = {
  date: string;
  modelId: string;
  requests: number;
  tokens: number;
  cost: number;
  avgLatency: number;
};

function seededRandom(seed: number): number {
  const x = Math.sin(seed) * 10_000;
  return x - Math.floor(x);
}

// Weights control request volume distribution.
// GPT-5.5 Pro has fewer requests but extreme per-token cost → highest daily cost.
// GPT-5.5 has the most requests → high volume, moderate cost.
// Other models get small slices of traffic.
const modelWeights: Record<string, number> = {
  'gpt-5.5-pro': 0.08,
  'gpt-5.5': 0.28,
  'claude-opus-4-7': 0.18,
  'claude-sonnet-4-6': 0.16,
  'gemini-3.1-pro': 0.14,
  // Other models share remaining ~16%
  'gpt-5.4-nano': 0.04,
  'claude-haiku-4-5': 0.035,
  'gemini-3-flash': 0.03,
  'deepseek-v4-pro': 0.025,
  'mistral-medium-2604': 0.02,
};

const baseLatencyByModel: Record<string, number> = {
  'gpt-5.5-pro': 380,
  'gpt-5.5': 260,
  'claude-opus-4-7': 420,
  'claude-sonnet-4-6': 220,
  'gemini-3.1-pro': 180,
  'gpt-5.4-nano': 120,
  'claude-haiku-4-5': 150,
  'gemini-3-flash': 100,
  'deepseek-v4-pro': 300,
  'mistral-medium-2604': 240,
};

function generateUsageByModel(days: number): ModelDailyUsage[] {
  const data: ModelDailyUsage[] = [];
  const today = new Date();

  for (let i = days; i >= 0; i--) {
    const date = subDays(today, i);
    const dayOfWeek = date.getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    const dateStr = format(date, 'yyyy-MM-dd');

    const baseDailyRequests = isWeekend ? 10_000 : 16_000;
    const growthFactor = 1 + ((days - i) / days) * 0.15;

    for (const model of models) {
      const seed = i * 137 + models.indexOf(model) * 31 + 99;
      const weight = modelWeights[model.id] ?? 0.02;
      const jitter = 0.8 + seededRandom(seed) * 0.4;

      const requests = Math.floor(baseDailyRequests * weight * growthFactor * jitter);
      const avgTokensPerRequest = 1_800 + Math.floor(seededRandom(seed + 1) * 600);
      const tokens = requests * avgTokensPerRequest;
      const cost = Math.round((tokens / 1_000) * ((model.costPer1kInput + model.costPer1kOutput) / 2) * 100) / 100;

      const baseLat = baseLatencyByModel[model.id] ?? 250;
      const avgLatency = Math.floor(baseLat + seededRandom(seed + 2) * 100);

      data.push({ date: dateStr, modelId: model.id, requests, tokens, cost, avgLatency });
    }
  }

  return data;
}

export const usageByModel = generateUsageByModel(90);

export function getModelTotals(days: number) {
  const uniqueDates = [...new Set(usageByModel.map((d) => d.date))].sort().slice(-days);
  const cutoffDate = uniqueDates[0];

  return models.map((model) => {
    const modelData = usageByModel.filter((d) => d.modelId === model.id && d.date >= cutoffDate!);
    return {
      ...model,
      totalRequests: modelData.reduce((s, d) => s + d.requests, 0),
      totalTokens: modelData.reduce((s, d) => s + d.tokens, 0),
      totalCost: Math.round(modelData.reduce((s, d) => s + d.cost, 0) * 100) / 100,
      avgLatency: Math.round(modelData.reduce((s, d) => s + d.avgLatency, 0) / (modelData.length || 1)),
    };
  });
}

/** Aggregate per-model totals for charts (default 90) */
export const modelTotals = getModelTotals(90);

/**
 * Chart-ready totals — featured models + "Other" aggregate.
 * Returns the 5 featured models individually, and sums all non-featured into a single "Other" entry.
 */
export function getChartModelTotals(days: number) {
  const all = getModelTotals(days);
  const featured = all.filter((m) => m.featured);
  const others = all.filter((m) => !m.featured);

  const otherAggregate = {
    id: 'other',
    name: 'Other',
    provider: 'Various',
    providerId: 'other',
    color: 'var(--muted-foreground)',
    costPer1kInput: 0,
    costPer1kOutput: 0,
    featured: false as const,
    totalRequests: others.reduce((s, m) => s + m.totalRequests, 0),
    totalTokens: others.reduce((s, m) => s + m.totalTokens, 0),
    totalCost: Math.round(others.reduce((s, m) => s + m.totalCost, 0) * 100) / 100,
    avgLatency: Math.round(others.reduce((s, m) => s + m.avgLatency, 0) / (others.length || 1)),
  };

  return [...featured, otherAggregate];
}
