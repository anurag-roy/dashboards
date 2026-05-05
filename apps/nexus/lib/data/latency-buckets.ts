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

export const latencyBuckets: LatencyBucket[] = models.flatMap((model) => {
  const modelTraces = traces.filter((t) => t.model === model.id);

  return bucketRanges.map((range) => ({
    bucket: range.label,
    modelId: model.id,
    count: modelTraces.filter((t) => t.latencyMs >= range.min && t.latencyMs < range.max).length,
  }));
});
