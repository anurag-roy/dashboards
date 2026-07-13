import { subMinutes, format } from 'date-fns';
import { models } from './models';

export type Trace = {
  traceId: string;
  timestamp: string;
  model: string;
  status: 'success' | 'error' | 'timeout';
  promptTokens: number;
  completionTokens: number;
  latencyMs: number;
  cost: number;
  temperature: number;
  maxTokens: number;
  topP: number;
  systemPrompt: string;
  userPrompt: string;
  completion: string;
  project: string;
  environment: 'production' | 'preview';
  region: string;
  routePolicy: 'balanced' | 'cost-optimized' | 'lowest-latency';
  routeOutcome: 'primary' | 'fallback' | 'cache';
  cacheStatus: 'hit' | 'miss' | 'bypass';
  gatewayLatencyMs: number;
  providerLatencyMs: number;
  timeToFirstTokenMs: number | null;
  finishReason: 'stop' | 'length' | 'error' | 'timeout';
  attempts: ProviderAttempt[];
};

export type ProviderAttempt = {
  provider: string;
  providerId: string;
  model: string;
  region: string;
  status: 'success' | 'rate-limited' | 'error' | 'timeout';
  durationMs: number;
  timeToFirstTokenMs: number | null;
  errorCode?: string;
};

const systemPrompts = [
  'You are a helpful coding assistant. Respond with clean, well-documented code.',
  'You are a data analyst. Provide insights based on the data presented.',
  'You are a technical writer. Create clear, concise documentation.',
  'You are a customer support agent. Be empathetic and solution-oriented.',
  'You are a marketing strategist. Provide creative campaign ideas.',
];

const userPrompts = [
  'Summarize the Q3 earnings report for the board presentation, focusing on key revenue drivers and areas of concern.',
  'Write a Python function to parse CSV files and generate statistical summaries with error handling.',
  'Extract the top 5 action items from the meeting transcript and assign priority levels.',
  'Generate a comprehensive API documentation for our user authentication endpoints.',
  'Analyze customer feedback data from the last month and identify recurring themes.',
  'Create a SQL query to find the top 10 customers by lifetime value with their purchase history.',
  'Draft an email response to a customer complaint about delayed shipping.',
  'Build a React component for a data visualization dashboard with filtering capabilities.',
  'Compare the performance metrics of our three microservices and suggest optimizations.',
  'Translate the product description into French, German, and Spanish maintaining brand voice.',
  'Review this code for security vulnerabilities and suggest improvements.',
  'Generate test cases for the payment processing module covering edge cases.',
  'Summarize the latest research paper on transformer architectures in 200 words.',
  'Create a project timeline for the Q4 product launch with milestones and dependencies.',
  'Analyze this log file and identify the root cause of the service outage.',
  'Write unit tests for the authentication middleware with mocked dependencies.',
  'Generate a comprehensive onboarding guide for new engineering team members.',
  'Optimize this database query that is causing performance bottlenecks in production.',
  'Create a risk assessment matrix for the proposed infrastructure migration.',
  'Draft a technical RFC for implementing real-time notifications using WebSockets.',
];

const completions = [
  'Based on the Q3 earnings data, revenue increased 12% YoY driven primarily by enterprise subscriptions...',
  'Here is a Python function with comprehensive error handling and type hints for CSV parsing...',
  'The top 5 action items from the meeting are: 1) Finalize API design by Friday (High)...',
  'Authentication API Documentation\n\n## POST /auth/login\nAuthenticates a user and returns a JWT token...',
  'Analysis of 2,847 feedback entries reveals three dominant themes: 1) Onboarding complexity (34%)...',
  'SELECT c.id, c.name, SUM(o.total) as lifetime_value, COUNT(o.id) as order_count FROM customers c...',
  'Dear [Customer], Thank you for reaching out. I sincerely apologize for the delay in your shipment...',
  'Here is a React dashboard component with filtering, responsive layout, and chart integration...',
  'Service comparison analysis:\n- Auth Service: P99 latency 45ms, 99.99% uptime\n- Payment Service: P99 120ms...',
  'FR: Notre solution innovante transforme la façon dont les entreprises gèrent leurs données...',
];

const projects = ['support-copilot', 'checkout-assistant', 'docs-search', 'internal-tools'];
const regions = ['iad1', 'sfo1', 'fra1', 'sin1'];
const routePolicies: Trace['routePolicy'][] = ['balanced', 'lowest-latency', 'cost-optimized'];

function seededRandom(seed: number): number {
  const x = Math.sin(seed) * 10_000;
  return x - Math.floor(x);
}

function generateTraceId(seed: number): string {
  const chars = '0123456789abcdef';
  let id = 'tr_';
  for (let i = 0; i < 24; i++) {
    id += chars[Math.floor(seededRandom(seed + i * 7) * chars.length)];
  }
  return id;
}

// Weighted model selection — featured models dominate, "other" models surface occasionally
const modelWeights: [string, number][] = [
  ['gpt-5.5-pro', 0.1],
  ['gpt-5.5', 0.25],
  ['claude-opus-4-7', 0.18],
  ['claude-sonnet-4-6', 0.16],
  ['gemini-3.1-pro', 0.14],
  ['gpt-5.4-nano', 0.04],
  ['claude-haiku-4-5', 0.035],
  ['gemini-3-flash', 0.03],
  ['deepseek-v4-pro', 0.025],
  ['mistral-medium-2604', 0.02],
];
const cumulativeWeights = (() => {
  let sum = 0;
  return modelWeights.map(([id, w]) => {
    sum += w;
    return [id, sum] as [string, number];
  });
})();

function pickModel(seed: number) {
  const r = seededRandom(seed);
  for (const [id, cumW] of cumulativeWeights) {
    if (r < cumW) return models.find((m) => m.id === id) ?? models[0]!;
  }
  return models[0]!;
}

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

function generateTraces(count: number): Trace[] {
  const data: Trace[] = [];
  const now = new Date();

  for (let i = 0; i < count; i++) {
    const seed = i * 31 + 7;
    const model = pickModel(seed);

    const minutesAgo = Math.floor(seededRandom(seed + 1) * 43_200);
    const timestamp = subMinutes(now, minutesAgo);

    const statusRoll = seededRandom(seed + 2);
    const status: Trace['status'] = statusRoll < 0.008 ? 'timeout' : statusRoll < 0.025 ? 'error' : 'success';

    const promptTokens = 200 + Math.floor(seededRandom(seed + 3) * 2_800);
    const completionTokens = status === 'success' ? 100 + Math.floor(seededRandom(seed + 4) * 2_000) : 0;

    const baseLatency = baseLatencyByModel[model.id] ?? 250;
    const cacheRoll = seededRandom(seed + 13);
    const fallbackRoll = seededRandom(seed + 14);
    const routeOutcome: Trace['routeOutcome'] =
      status === 'success' && cacheRoll < 0.12
        ? 'cache'
        : status === 'success' && fallbackRoll < 0.09
          ? 'fallback'
          : 'primary';
    const gatewayLatencyMs =
      routeOutcome === 'cache'
        ? 24 + Math.floor(seededRandom(seed + 15) * 28)
        : 18 + Math.floor(seededRandom(seed + 15) * 42);
    const providerLatencyMs =
      routeOutcome === 'cache'
        ? 0
        : status === 'timeout'
          ? 30_000 - gatewayLatencyMs
          : Math.floor(baseLatency + seededRandom(seed + 5) * baseLatency * 2.5);
    const fallbackPenaltyMs = routeOutcome === 'fallback' ? 180 + Math.floor(seededRandom(seed + 16) * 460) : 0;
    const latencyMs = gatewayLatencyMs + providerLatencyMs + fallbackPenaltyMs;
    const timeToFirstTokenMs =
      status !== 'success'
        ? null
        : routeOutcome === 'cache'
          ? gatewayLatencyMs
          : Math.min(
              providerLatencyMs,
              Math.floor(baseLatency * 0.55 + seededRandom(seed + 17) * Math.max(60, baseLatency * 0.8))
            );

    const cost =
      Math.round((promptTokens * model.costPer1kInput + completionTokens * model.costPer1kOutput) * 100) / 100;

    const temperature = [0, 0.3, 0.5, 0.7, 1.0][Math.floor(seededRandom(seed + 6) * 5)]!;
    const maxTokens = [512, 1024, 2048, 4096][Math.floor(seededRandom(seed + 7) * 4)]!;
    const topP = [0.9, 0.95, 1.0][Math.floor(seededRandom(seed + 8) * 3)]!;

    const systemPrompt = systemPrompts[Math.floor(seededRandom(seed + 9) * systemPrompts.length)]!;
    const userPrompt = userPrompts[Math.floor(seededRandom(seed + 10) * userPrompts.length)]!;
    const completion =
      status === 'error'
        ? 'Error: Request failed with status 500'
        : status === 'timeout'
          ? 'Error: Upstream provider timed out before returning a completion'
          : completions[Math.floor(seededRandom(seed + 11) * completions.length)]!;

    const region = regions[Math.floor(seededRandom(seed + 18) * regions.length)]!;
    const attempts: ProviderAttempt[] = [];

    if (routeOutcome !== 'cache') {
      if (routeOutcome === 'fallback') {
        const fallbackSource =
          models[(models.indexOf(model) + 1 + Math.floor(seededRandom(seed + 19) * 3)) % models.length]!;
        attempts.push({
          provider: fallbackSource.provider,
          providerId: fallbackSource.providerId,
          model: fallbackSource.id,
          region,
          status: seededRandom(seed + 20) < 0.72 ? 'rate-limited' : 'error',
          durationMs: fallbackPenaltyMs,
          timeToFirstTokenMs: null,
          errorCode: seededRandom(seed + 20) < 0.72 ? '429_RATE_LIMITED' : '503_UPSTREAM_UNAVAILABLE',
        });
      }

      attempts.push({
        provider: model.provider,
        providerId: model.providerId,
        model: model.id,
        region,
        status: status === 'success' ? 'success' : status,
        durationMs: providerLatencyMs,
        timeToFirstTokenMs: status === 'success' ? timeToFirstTokenMs : null,
        errorCode: status === 'timeout' ? 'GATEWAY_TIMEOUT' : status === 'error' ? '500_PROVIDER_ERROR' : undefined,
      });
    }

    data.push({
      traceId: generateTraceId(seed + 12),
      timestamp: format(timestamp, "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'"),
      model: model.id,
      status,
      promptTokens,
      completionTokens,
      latencyMs,
      cost,
      temperature,
      maxTokens,
      topP,
      systemPrompt,
      userPrompt,
      completion,
      project: projects[Math.floor(seededRandom(seed + 21) * projects.length)]!,
      environment: seededRandom(seed + 22) < 0.88 ? 'production' : 'preview',
      region,
      routePolicy: routePolicies[Math.floor(seededRandom(seed + 23) * routePolicies.length)]!,
      routeOutcome,
      cacheStatus: routeOutcome === 'cache' ? 'hit' : seededRandom(seed + 24) < 0.82 ? 'miss' : 'bypass',
      gatewayLatencyMs,
      providerLatencyMs,
      timeToFirstTokenMs,
      finishReason:
        status === 'timeout'
          ? 'timeout'
          : status === 'error'
            ? 'error'
            : seededRandom(seed + 25) < 0.06
              ? 'length'
              : 'stop',
      attempts,
    });
  }

  return data.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
}

export const traces = generateTraces(250);
