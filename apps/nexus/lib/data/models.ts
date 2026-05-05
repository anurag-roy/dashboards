export type ModelDefinition = {
  id: string;
  name: string;
  provider: string;
  providerId: string;
  color: string;
  costPer1kInput: number;
  costPer1kOutput: number;
  /** Whether this model is one of the 5 "featured" models shown explicitly in charts */
  featured: boolean;
};

// ── Featured models ───────────────────────────────────────────────
// Pricing from models.json (costs per 1M tokens → divided to per 1K)
//
// GPT-5.5 Pro:      $30/M in, $180/M out   → 0.030, 0.180
// GPT-5.5:          $5/M in, $30/M out      → 0.005, 0.030
// Claude Opus 4.7:  $5/M in, $25/M out      → 0.005, 0.025
// Claude Sonnet 4.6: $3/M in, $15/M out     → 0.003, 0.015
// Gemini 3.1 Pro:   $2/M in, $12/M out      → 0.002, 0.012
export const featuredModels: ModelDefinition[] = [
  {
    id: 'gpt-5.5-pro',
    name: 'GPT-5.5 Pro',
    provider: 'OpenAI',
    providerId: 'openai',
    color: 'var(--chart-1)',
    costPer1kInput: 0.03,
    costPer1kOutput: 0.18,
    featured: true,
  },
  {
    id: 'gpt-5.5',
    name: 'GPT-5.5',
    provider: 'OpenAI',
    providerId: 'openai',
    color: 'var(--chart-2)',
    costPer1kInput: 0.005,
    costPer1kOutput: 0.03,
    featured: true,
  },
  {
    id: 'claude-opus-4-7',
    name: 'Claude Opus 4.7',
    provider: 'Anthropic',
    providerId: 'anthropic',
    color: 'var(--chart-3)',
    costPer1kInput: 0.005,
    costPer1kOutput: 0.025,
    featured: true,
  },
  {
    id: 'claude-sonnet-4-6',
    name: 'Claude Sonnet 4.6',
    provider: 'Anthropic',
    providerId: 'anthropic',
    color: 'var(--chart-4)',
    costPer1kInput: 0.003,
    costPer1kOutput: 0.015,
    featured: true,
  },
  {
    id: 'gemini-3.1-pro',
    name: 'Gemini 3.1 Pro',
    provider: 'Google',
    providerId: 'google',
    color: 'var(--chart-5)',
    costPer1kInput: 0.002,
    costPer1kOutput: 0.012,
    featured: true,
  },
];

// ── Other models (from models.json) ───────────────────────────────
// These appear in traces/activity but are grouped as "Other" in charts.
export const otherModels: ModelDefinition[] = [
  {
    id: 'gpt-5.4-nano',
    name: 'GPT-5.4 nano',
    provider: 'OpenAI',
    providerId: 'openai',
    color: 'hsl(var(--muted))',
    costPer1kInput: 0.0002,
    costPer1kOutput: 0.00125,
    featured: false,
  },
  {
    id: 'claude-haiku-4-5',
    name: 'Claude Haiku 4.5',
    provider: 'Anthropic',
    providerId: 'anthropic',
    color: 'hsl(var(--muted))',
    costPer1kInput: 0.001,
    costPer1kOutput: 0.005,
    featured: false,
  },
  {
    id: 'gemini-3-flash',
    name: 'Gemini 3 Flash',
    provider: 'Google',
    providerId: 'google',
    color: 'hsl(var(--muted))',
    costPer1kInput: 0.0005,
    costPer1kOutput: 0.003,
    featured: false,
  },
  {
    id: 'deepseek-v4-pro',
    name: 'DeepSeek V4 Pro',
    provider: 'DeepSeek',
    providerId: 'deepseek',
    color: 'hsl(var(--muted))',
    costPer1kInput: 0.00174,
    costPer1kOutput: 0.00348,
    featured: false,
  },
  {
    id: 'mistral-medium-2604',
    name: 'Mistral Medium 3.5',
    provider: 'Mistral',
    providerId: 'mistral',
    color: 'hsl(var(--muted))',
    costPer1kInput: 0.0015,
    costPer1kOutput: 0.0075,
    featured: false,
  },
];

/** All models — used for trace generation */
export const models: ModelDefinition[] = [...featuredModels, ...otherModels];

/** Lookup by id */
export const modelMap = Object.fromEntries(models.map((m) => [m.id, m])) as Record<string, ModelDefinition>;

/** Provider → models, for grouped selects */
export type ProviderGroup = { provider: string; providerId: string; models: ModelDefinition[] };

export const modelsByProvider: ProviderGroup[] = (() => {
  const map = new Map<string, ModelDefinition[]>();
  for (const m of models) {
    if (!map.has(m.provider)) map.set(m.provider, []);
    map.get(m.provider)!.push(m);
  }
  return Array.from(map.entries()).map(([provider, mods]) => ({
    provider,
    providerId: mods[0]!.providerId,
    models: mods,
  }));
})();
