# Orbit App Guide

Orbit is the usage analytics dashboard in this monorepo. It runs on port `3001` and redirects `/` to `/overview`.

Use this README as the first context file before editing Orbit.

## Purpose

- Usage analytics and billing-cycle monitoring for a workspace.
- Main workflows: overview KPIs/charts, detailed usage table, billing controls, users, and general settings.
- Stack: `Next.js 16`, `React 19`, `Tailwind v4`, `@workspace/ui`, `recharts`, `@tanstack/react-table`.
- Product metadata and canonical links live in `app/siteConfig.ts`.

## Start Here

- Shell and providers: `app/layout.tsx`
- Main route spacing: `app/(main)/layout.tsx`
- Settings tabs: `app/settings/layout.tsx`
- Sidebar and mobile navigation: `components/ui/navigation/sidebar.tsx`
- Overview page: `app/(main)/overview/page.tsx`
- Details table: `app/(main)/details/page.tsx`
- Seed data and schemas: `lib/data/data.ts`, `lib/data/overview-data.ts`, `lib/data/schema.ts`

## Route Map

- `/` - redirects to `/overview` in `next.config.mjs`
- `/overview` - `app/(main)/overview/page.tsx`
- `/details` - `app/(main)/details/page.tsx`
- `/settings/general` - `app/settings/general/page.tsx`
- `/settings/billing` - `app/settings/billing/page.tsx`
- `/settings/users` - `app/settings/users/page.tsx`
- `/_not-found` - `app/not-found.tsx`

## Shell And Navigation

- `app/layout.tsx` owns the full dashboard shell, not a route group.
- Providers: `ThemeProvider`, `TooltipProvider`, `SidebarProvider`, `Sidebar`, `SidebarInset`.
- Desktop layout is a pinned left sidebar with a centered `max-w-7xl` content column.
- Mobile layout uses `MobileSidebarHeader` plus the shared sidebar mobile state.
- `components/app-logo.tsx` renders the static Orbit logo and name.
- Sidebar primary navigation: Overview, Details, Settings.
- Sidebar shortcuts link into `/settings/users`, `/settings/billing#billing-overview`, `/settings/billing#cost-spend-control`, and `/overview#usage-overview`.
- Mobile sidebar account/theme actions are flat menu items and close the mobile sidebar after clicks.

## Page Composition

### `/overview`

File: `app/(main)/overview/page.tsx`

- Client component with local state for `selectedDates`, `selectedPeriod`, and `selectedCategories`.
- Current billing cycle cards:
  - `ProgressBarCard` for usage.
  - `ProgressBarCard` for workspace activity.
  - `CategoryBarCard` for cost mix.
- Overview controls live in `components/ui/overview/dashboard-filterbar.tsx`.
- Date range uses `components/date-range-picker.tsx` and `react-day-picker`.
- Period options are converted through `lib/overview-period.ts`.
- Chart customization uses a `Dialog` with checkbox-selected chart categories.
- Chart cards use `components/ui/overview/dashboard-chart-card.tsx`.
- Chart rendering uses `@workspace/ui/components/chart` plus `recharts` line charts.
- Overview seed data is shifted through `lib/data/overview-data.ts` so dates stay current.

### `/details`

File: `app/(main)/details/page.tsx`

- Renders `DataTable` with `usage` seed data and `columns`.
- Table stack:
  - `components/ui/data-table/DataTable.tsx`
  - `components/ui/data-table/columns.tsx`
  - `DataTableFilterbar`, `DataTableFilter`, `DataTableViewOptions`
  - `DataTablePagination`, `DataTableBulkEditor`, `MobileUsageList`
- Uses TanStack Table with sorting, filtering, pagination, row selection, and a mobile card-list fallback.
- Filters include owner search, status select, region checkbox filtering, and cost condition filtering.
- Column visibility and ordering use `DataTableViewOptions` and Atlassian pragmatic drag-and-drop packages.

### `/settings/general`

File: `app/settings/general/page.tsx`

- Personal information form using shared `Input`, `Select`, `Checkbox`, `Card`, and `Separator`.
- Role select is disabled and must keep `items={roles}` for readable display text.
- Notification settings are grouped by Team and Usage.
- Danger zone has leave/delete workspace cards; delete is disabled for non-admin state.

### `/settings/billing`

File: `app/settings/billing/page.tsx`

- Billing overview list with `ProgressBar` usage rows.
- Cost spend control uses `ProgressCircle`, `Switch`, and animated cap/email inputs.
- Add-ons are card rows with `Switch` activation controls.
- Anchor ids are used by sidebar shortcuts: `billing-overview` and `cost-spend-control`.

### `/settings/users`

File: `app/settings/users/page.tsx`

- Existing users list and pending invitations list.
- Invite flow lives in `components/ui/settings/modal-add-user.tsx`.
- Role changes use shared `Select` with `items={roles}`.
- Admin role select is disabled and wrapped in a tooltip explaining the constraint.
- Row actions use `DropdownMenu`.

## Shared Components

- `components/app-logo.tsx` - static product logo.
- `components/command-bar.tsx` - bulk action command bar used by the details table.
- `components/date-range-picker.tsx` - date range popover/calendar.
- `components/select-item-period.tsx` - readable period select item labels.
- `components/ui/overview/dashboard-progress-bar-card.tsx` - overview progress-card wrapper around shared `ProgressBar`.
- `components/ui/navigation/*` - sidebar, user profile, and dropdown behavior.
- `components/ui/overview/*` - overview KPI cards, chart cards, and filter bar.
- `components/ui/data-table/*` - details table stack.

## Data Sources

- `lib/data/overview-data.ts` - overview chart seed data and current-year date shifting.
- `lib/data/data.ts` - users, invited users, roles, statuses, regions, conditions, and usage rows.
- `lib/data/schema.ts` - `Usage` and `OverviewData` types.
- `lib/types/overview.ts` - overview UI types such as `PeriodValue`.
- `lib/chart-helpers.ts` - chart value helpers.
- `lib/utils.ts` - formatters and shared utilities.

## Styling And Behavior Notes

- Follow root `AGENTS.md` before changing UI.
- Use semantic tokens and shared `@workspace/ui` components.
- Main cards should stay close to the migrated dashboard style: `rounded-3xl` and `shadow-sm` for primary cards.
- Do not replace the static brand row with a workspace switcher.
- Keep `Select` triggers `w-full` inside form grids.
- Keep route tabs in `app/settings/layout.tsx` as native `TabsTrigger` buttons with router-driven navigation.
- Keep mobile navigation flat; avoid adding a separate profile dropdown in the mobile top bar.

## Dev Commands

Run inside `apps/orbit`:

```bash
bun run dev
bun run typecheck
bun run lint
bun run format
bun run build
bun run start
```

Ports:

- `bun run dev` - `3001`
- `bun run start` - `3001`

## Agent Checklist

- For route work, start with the page file, then descend into `components/ui/<domain>`.
- For overview changes, inspect `overview-data`, `overview-period`, and `dashboard-filterbar` together.
- For details-table changes, inspect `DataTable.tsx`, `columns.tsx`, and `DataTableFilterbar.tsx` together.
- For shell changes, inspect `app/layout.tsx` and `components/ui/navigation/sidebar.tsx`.
- After behavior or style changes, run Orbit's format, lint, typecheck, and build gates.
