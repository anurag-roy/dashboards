export const databases: {
  label: string;
  value: string;
  description: string;
  isRecommended: boolean;
}[] = [
  {
    label: 'Base performance',
    value: 'base-performance',
    description: '1/8 vCPU, 1 GB RAM',
    isRecommended: true,
  },
  {
    label: 'Advanced performance',
    value: 'advanced-performance',
    description: '1/4 vCPU, 2 GB RAM',
    isRecommended: false,
  },
  {
    label: 'Turbo performance',
    value: 'turbo-performance',
    description: '1/2 vCPU, 4 GB RAM',
    isRecommended: false,
  },
];
