import { modelMap } from './models';
import { traces, type ProviderAttempt, type Trace } from './traces';

export type ModelGatewayHealth = {
  modelId: string;
  requests: number;
  successRate: number;
  fallbackRate: number;
  cacheRate: number;
  p50TtftMs: number;
  p95LatencyMs: number;
  gatewayOverheadMs: number;
  costPer1kRequests: number;
};

export type ProviderGatewayHealth = {
  provider: string;
  providerId: string;
  requests: number;
  attemptShare: number;
  successRate: number;
  rateLimitRate: number;
  p50TtftMs: number;
  p95LatencyMs: number;
  status: 'operational' | 'monitor' | 'degraded';
};

function percentile(values: number[], percentileValue: number) {
  if (values.length === 0) return 0;

  const sorted = [...values].sort((a, b) => a - b);
  return sorted[Math.min(Math.ceil((percentileValue / 100) * sorted.length) - 1, sorted.length - 1)] ?? 0;
}

function tracesForPeriod(days: number) {
  const cutoff = Date.now() - days * 24 * 60 * 60 * 1000;
  return traces.filter((trace) => new Date(trace.timestamp).getTime() >= cutoff);
}

function percentage(part: number, total: number) {
  return total > 0 ? (part / total) * 100 : 0;
}

export function getModelGatewayHealth(days: number) {
  const periodTraces = tracesForPeriod(days);
  const tracesByModel = new Map<string, Trace[]>();

  for (const trace of periodTraces) {
    const modelTraces = tracesByModel.get(trace.model) ?? [];
    modelTraces.push(trace);
    tracesByModel.set(trace.model, modelTraces);
  }

  return new Map(
    [...tracesByModel.entries()].map(([modelId, modelTraces]) => {
      const successfulTraces = modelTraces.filter((trace) => trace.status === 'success');
      const timeToFirstToken = successfulTraces.flatMap((trace) =>
        trace.timeToFirstTokenMs === null ? [] : [trace.timeToFirstTokenMs]
      );
      const totalCost = modelTraces.reduce((sum, trace) => sum + trace.cost, 0);

      const health: ModelGatewayHealth = {
        modelId,
        requests: modelTraces.length,
        successRate: percentage(successfulTraces.length, modelTraces.length),
        fallbackRate: percentage(
          modelTraces.filter((trace) => trace.routeOutcome === 'fallback').length,
          modelTraces.length
        ),
        cacheRate: percentage(modelTraces.filter((trace) => trace.cacheStatus === 'hit').length, modelTraces.length),
        p50TtftMs: Math.round(percentile(timeToFirstToken, 50)),
        p95LatencyMs: Math.round(
          percentile(
            modelTraces.map((trace) => trace.latencyMs),
            95
          )
        ),
        gatewayOverheadMs: Math.round(
          modelTraces.reduce((sum, trace) => sum + trace.gatewayLatencyMs, 0) / modelTraces.length
        ),
        costPer1kRequests: modelTraces.length > 0 ? (totalCost / modelTraces.length) * 1000 : 0,
      };

      return [modelId, health];
    })
  );
}

type ProviderAccumulator = {
  provider: string;
  providerId: string;
  requests: number;
  attempts: ProviderAttempt[];
};

export function getProviderGatewayHealth(days: number) {
  const periodTraces = tracesForPeriod(days);
  const providers = new Map<string, ProviderAccumulator>();

  for (const trace of periodTraces) {
    const model = modelMap[trace.model];
    if (model) {
      const provider = providers.get(model.providerId) ?? {
        provider: model.provider,
        providerId: model.providerId,
        requests: 0,
        attempts: [],
      };
      provider.requests += 1;
      providers.set(model.providerId, provider);
    }

    for (const attempt of trace.attempts) {
      const provider = providers.get(attempt.providerId) ?? {
        provider: attempt.provider,
        providerId: attempt.providerId,
        requests: 0,
        attempts: [],
      };
      provider.attempts.push(attempt);
      providers.set(attempt.providerId, provider);
    }
  }

  const totalAttempts = [...providers.values()].reduce((sum, provider) => sum + provider.attempts.length, 0);

  return [...providers.values()]
    .map((provider): ProviderGatewayHealth => {
      const successfulAttempts = provider.attempts.filter((attempt) => attempt.status === 'success');
      const rateLimitedAttempts = provider.attempts.filter((attempt) => attempt.status === 'rate-limited');
      const successRate = percentage(successfulAttempts.length, provider.attempts.length);
      const rateLimitRate = percentage(rateLimitedAttempts.length, provider.attempts.length);
      const status =
        successRate >= 97 && rateLimitRate < 4
          ? 'operational'
          : successRate >= 80 && rateLimitRate < 15
            ? 'monitor'
            : 'degraded';

      return {
        provider: provider.provider,
        providerId: provider.providerId,
        requests: provider.requests,
        attemptShare: percentage(provider.attempts.length, totalAttempts),
        successRate,
        rateLimitRate,
        p50TtftMs: Math.round(
          percentile(
            successfulAttempts.flatMap((attempt) =>
              attempt.timeToFirstTokenMs === null ? [] : [attempt.timeToFirstTokenMs]
            ),
            50
          )
        ),
        p95LatencyMs: Math.round(
          percentile(
            provider.attempts.map((attempt) => attempt.durationMs),
            95
          )
        ),
        status,
      };
    })
    .sort((a, b) => b.requests - a.requests);
}
