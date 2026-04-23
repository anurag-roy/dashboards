export type ColorUtility = 'bg' | 'stroke' | 'fill' | 'text';

/** Maps Tremor color keys to design tokens (chart + semantic). */
export const chartColors = {
  indigo: {
    bg: 'bg-chart-1',
    stroke: 'stroke-chart-1',
    fill: 'fill-chart-1',
    text: 'text-chart-1',
  },
  gray: {
    bg: 'bg-chart-2',
    stroke: 'stroke-chart-2',
    fill: 'fill-chart-2',
    text: 'text-muted-foreground',
  },
  blue: {
    bg: 'bg-chart-3',
    stroke: 'stroke-chart-3',
    fill: 'fill-chart-3',
    text: 'text-chart-3',
  },
  emerald: {
    bg: 'bg-emerald-500',
    stroke: 'stroke-emerald-500',
    fill: 'fill-emerald-500',
    text: 'text-emerald-500',
  },
  violet: {
    bg: 'bg-violet-500',
    stroke: 'stroke-violet-500',
    fill: 'fill-violet-500',
    text: 'text-violet-500',
  },
  amber: {
    bg: 'bg-amber-500',
    stroke: 'stroke-amber-500',
    fill: 'fill-amber-500',
    text: 'text-amber-500',
  },
  cyan: {
    bg: 'bg-cyan-500',
    stroke: 'stroke-cyan-500',
    fill: 'fill-cyan-500',
    text: 'text-cyan-500',
  },
  pink: {
    bg: 'bg-pink-500',
    stroke: 'stroke-pink-500',
    fill: 'fill-pink-500',
    text: 'text-pink-500',
  },
} as const satisfies {
  [color: string]: { [K in ColorUtility]: string };
};

export type AvailableChartColorsKeys = keyof typeof chartColors;

export const AvailableChartColors: AvailableChartColorsKeys[] = Object.keys(chartColors) as AvailableChartColorsKeys[];

export const constructCategoryColors = (
  categories: string[],
  colors: AvailableChartColorsKeys[]
): Map<string, AvailableChartColorsKeys> => {
  const categoryColors = new Map<string, AvailableChartColorsKeys>();
  categories.forEach((category, index) => {
    const color = colors[index % colors.length] ?? 'gray';
    categoryColors.set(category, color);
  });
  return categoryColors;
};

export const getColorClassName = (color: AvailableChartColorsKeys, type: ColorUtility): string => {
  const fallback = chartColors.gray;
  return chartColors[color]?.[type] ?? fallback[type];
};

export const getYAxisDomain = (
  autoMinValue: boolean,
  minValue: number | undefined,
  maxValue: number | undefined
): (number | string)[] => {
  const minDomain = autoMinValue ? 'auto' : (minValue ?? 0);
  const maxDomain = maxValue ?? 'auto';
  return [minDomain, maxDomain];
};

export function hasOnlyOneValueForKey<T extends Record<string, unknown>>(array: T[], keyToCheck: string): boolean {
  const val: unknown[] = [];
  for (const obj of array) {
    if (Object.prototype.hasOwnProperty.call(obj, keyToCheck)) {
      val.push(obj[keyToCheck as keyof T]);
      if (val.length > 1) {
        return false;
      }
    }
  }
  return true;
}
