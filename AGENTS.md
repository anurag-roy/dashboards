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

## Base UI / shadcn Integration Gotchas

- Many `@workspace/ui` wrappers are Base UI based (not Radix APIs).
- Prefer `render` patterns expected by the wrapper APIs; do not assume `asChild` support.
- For dropdown labels in this codebase, keep `DropdownMenuLabel` inside `DropdownMenuGroup` to avoid missing group context runtime errors.
- Avoid controlled/uncontrolled flips in Base UI components (`Select`, etc.); initialize and reset with stable value shapes.

## Select Rules (Behavior, Not Just Spacing)

- For user-facing `Select` labels, pass `items` to `Select` and use proper `label`/child text so selected values are human-readable (not kebab-case IDs).
- Select triggers used in forms should explicitly get `w-full` when they sit in grid columns; otherwise they may collapse to content width.

## Tabs Rules

- Use shadcn `Tabs` primitives directly for settings-like tab rows.
- Keep `TabsTrigger` as a native button; for route tabs, navigate via `Tabs` `onValueChange` + router push.
- For `line` variant tabs, avoid custom color overrides unless required; defaults handle active/hover/dark states better.
- Prevent equal-width stretching by setting triggers to content width (`flex-none`) when needed.

## Chart Migration Rules

- Use `@workspace/ui/components/chart` primitives for new charts.
- Keep Recharts versions aligned across workspace packages (single major/version). Mixed versions can render empty charts without obvious errors.
- Prefer semantic chart tokens (`--chart-*`, `text-muted-foreground`, etc.) over hardcoded palette classes.

## Mobile Navigation Rules

- On mobile, avoid stacking nested dropdown/popover flows for account/workspace controls.
- Prefer a single hamburger surface with flat menu items for theme/account/workspace actions.
- Avoid duplicate identity surfaces (workspace/account shown twice in one mobile sheet).

## Layout Norms For Dashboard Shell

- Default dashboard pattern: sidebar pinned left, content area constrained and centered on RHS (`max-w-*` content column).
- Avoid centering the whole shell by default unless explicitly requested.
