export const getBadgeType = (value: number) => {
  if (value > 0) {
    return 'success' as const;
  }
  if (value < 0) {
    if (value < -50) {
      return 'warning' as const;
    }
    return 'error' as const;
  }
  return 'neutral' as const;
};
