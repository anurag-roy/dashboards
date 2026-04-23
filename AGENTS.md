# UI Design Language For App Migrations

Use this guide when migrating any app into this monorepo with shadcn/ui.

## Baseline

- Treat `@workspace/ui` components as the source of truth for visual language.
- Keep styling aligned with the current shadcn **Luma/base** look.
- Before styling custom components, inspect:
  - `packages/ui/src/components/button.tsx`
  - `packages/ui/src/components/input.tsx`
  - `packages/ui/src/components/select.tsx`
  - `packages/ui/src/components/dropdown-menu.tsx`
  - `packages/ui/src/components/card.tsx`
  - `packages/ui/src/components/badge.tsx`

## Tokens And Colors

- Use semantic tokens/classes (`bg-background`, `text-foreground`, `text-muted-foreground`, `border-border`, etc.).
- Avoid hardcoded palette classes (`gray-*`, `indigo-*`, hex values) when semantic tokens exist.
- Preserve both light and dark behavior through existing token system.

## Radius And Elevation

- Buttons/inputs/select triggers: keep existing shadcn sizing and radius behavior.
- Cards should be visually softer than default Luma extremes for migrated dashboard UIs:
  - Prefer `rounded-3xl` + `shadow-sm` for main cards.
  - Use `rounded-2xl` and minimal/no shadow for secondary callout surfaces.
  - Avoid overusing `rounded-4xl` + `shadow-md` unless explicitly requested.

## Select And Menu Spacing

- `Select` popup spacing should match `DropdownMenu` rhythm.
- Keep select popup/item spacing aligned with dropdown menu conventions:
  - popup container padding style equivalent to dropdown menu (`p-1.5`)
  - item horizontal padding equivalent to dropdown menu item (`pl-3 pr-8`)
  - label horizontal padding equivalent to dropdown menu label (`px-3`)
- Do not stack extra nested x-padding in `SelectGroup`/`SelectPrimitive.List` that makes options feel too tight or too wide.

## Badges

- Badge-like pills should be fully rounded when used as compact status chips.
- Custom status badge components should use `rounded-full` and follow `Badge` spacing/weight conventions.

## Migration QA Checklist

- Compare custom-built controls against equivalent `@workspace/ui` components before finalizing.
- Validate consistency across:
  - border radius
  - spacing density
  - shadow intensity
  - hover/focus states
- Run quality gates after style changes:
  - format
  - lint
  - typecheck
  - build (for affected app)
