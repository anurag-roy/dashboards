import { models } from './models';
import { traces } from './traces';

export type LatencyBucket = {
  bucket: string;
  modelId: string;
  count: number;
};

const bucketRanges = [
  { label: '<100ms', min: 0, max: 100 },
  { label: '100-250ms', min: 100, max: 250 },
  { label: '250-500ms', min: 250, max: 500 },
  { label: '500ms-1s', min: 500, max: 1_000 },
  { label: '>1s', min: 1_000, max: Infinity },
] as const;

const latestTraceTime = traces.reduce((latest, trace) => {
  return Math.max(latest, new Date(trace.timestamp).getTime());
}, 0);

export function getLatencyBuckets(days?: number, modelIds?: string[]): LatencyBucket[] {
  const cutoff = days ? latestTraceTime - days * 24 * 60 * 60 * 1_000 : null;
  const selectedModelIds = modelIds ? new Set(modelIds) : null;

  return models
    .filter((model) => !selectedModelIds || selectedModelIds.has(model.id))
    .flatMap((model) => {
      const modelTraces = traces.filter((trace) => {
        if (trace.model !== model.id) {
          return false;
        }

        return cutoff === null || new Date(trace.timestamp).getTime() >= cutoff;
      });

      return bucketRanges.map((range) => ({
        bucket: range.label,
        modelId: model.id,
        count: modelTraces.filter((trace) => trace.latencyMs >= range.min && trace.latencyMs < range.max).length,
      }));
    });
}

export const latencyBuckets = getLatencyBuckets();
