import { cn } from '@/lib/utils';

/** FieldLabel wrapping choice cards: remove duplicate label border; avoid checked fill from Field defaults. */
export const choiceCardFieldLabelClass = 'w-full has-data-checked:bg-background !border-0 rounded-2xl';

/** Single surface for radio and checkbox option cards — matches @workspace/ui Card (radius, ring, shadow). */
export function choiceCardFieldClass(selected: boolean) {
  return cn(
    'w-full overflow-hidden rounded-2xl bg-card text-sm text-card-foreground shadow-sm ring-1 ring-foreground/6 transition-[box-shadow,ring-color,ring-width] dark:shadow-none dark:ring-foreground/10',
    selected && 'ring-2 ring-primary/25 dark:ring-primary/30'
  );
}
