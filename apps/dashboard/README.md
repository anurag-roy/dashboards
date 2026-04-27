# Dashboard App Guide

This document explains how the `apps/dashboard` app is structured, what each route renders, and which components/patterns are used so another agent can onboard quickly.

## Purpose

- A dashboard UI migrated to the monorepo stack (`Next.js 16`, `React 19`, `Tailwind v4`).
- Uses shared design system primitives from `@workspace/ui` (Base UI wrappers + shadcn-style APIs).
- Main UX areas:
  - overview analytics
  - detailed usage table
  - workspace settings (general, billing, users)

## High-Level Structure

- `app/layout.tsx`
  - Global shell and providers.
  - Uses `ThemeProvider`, `TooltipProvider`, `SidebarProvider`, `Sidebar`, `SidebarInset`.
  - Layout norm: sidebar pinned left, RHS constrained and centered (`max-w-7xl`).
- `app/(main)/layout.tsx`
  - Shared inner spacing for main routes (`/overview`, `/details`).
- `app/settings/layout.tsx`
  - Settings header + route tabs (`Tabs`, `TabsList`, `TabsTrigger`, `variant='line'`).

## Route Map

- `/overview` -> `app/(main)/overview/page.tsx`
- `/details` -> `app/(main)/details/page.tsx`
- `/settings/general` -> `app/settings/general/page.tsx`
- `/settings/billing` -> `app/settings/billing/page.tsx`
- `/settings/users` -> `app/settings/users/page.tsx`
- `/_not-found` -> `app/not-found.tsx`

## Page Composition

### `/overview`

File: `app/(main)/overview/page.tsx`

- Current billing cycle cards:
  - `ProgressBarCard` (Usage)
  - `ProgressBarCard` (Workspace)
  - `CategoryBarCard` (Costs)
- Overview controls:
  - `Filterbar` from `components/ui/overview/dashboard-filterbar.tsx`
  - date range (`DateRangePicker`)
  - comparison select (`Select`)
  - chart customization dialog (`Dialog` + `Checkbox` + `ChartCard` thumbnails)
- Chart grid:
  - `ChartCard` from `components/ui/overview/dashboard-chart-card.tsx`
  - Chart implementation uses `@workspace/ui/components/chart` (`ChartContainer`, `ChartTooltip`, `ChartTooltipContent`) + `recharts`.
  - Current vs comparison lines use semantic chart tokens (`--chart-1`, `--chart-2`).

### `/details`

File: `app/(main)/details/page.tsx`

- Renders a single `DataTable` with `usage` data and `columns` definition.
- Main stack:
  - `DataTable` -> `components/ui/data-table/DataTable.tsx`
  - `columns` -> `components/ui/data-table/columns.tsx`
  - toolbar/filter/search -> `DataTableFilterbar`
  - per-filter popovers -> `DataTableFilter`
  - column visibility/reordering popover -> `DataTableViewOptions`
  - pagination -> `DataTablePagination`
  - bulk command bar -> `DataTableBulkEditor` + `CommandBar`
- Table tech:
  - `@tanstack/react-table`
  - column drag/reorder with `@atlaskit/pragmatic-drag-and-drop`

### `/settings/*` shared wrapper

File: `app/settings/layout.tsx`

- Heading: `Settings`
- Route tabs: `General`, `Billing & Usage`, `Users`
- Tab navigation is route-driven via `Tabs` `onValueChange` + `router.push`.
- `TabsTrigger` stays native button (no direct `Link` render target).

### `/settings/general`

File: `app/settings/general/page.tsx`

- Sections:
  - Personal information form (`Input`, disabled `Select` for role)
  - Notification settings (`Checkbox` groups)
  - Danger zone cards (`Card`, secondary/destructive actions)

### `/settings/billing`

File: `app/settings/billing/page.tsx`

- Sections:
  - Billing overview list with `ProgressBar`
  - Cost spend control with `ProgressCircle`, `Switch`, animated cap form
  - Add-ons cards with `Switch` toggles

### `/settings/users`

File: `app/settings/users/page.tsx`

- Existing users list:
  - avatar + email + role `Select` + row action `DropdownMenu`
  - add-user flow via `ModalAddUser`
- Pending invitations list:
  - invite entries with role `Select` + revoke action dropdown

### `/_not-found`

File: `app/not-found.tsx`

- 404 page with CTA link back to `/overview`.

## Navigation and Shell Components

- Sidebar and mobile nav: `components/ui/navigation/sidebar.tsx`
  - desktop: workspace switcher at top, nav groups, profile at footer
  - mobile: workspace summary + hamburger in header, flat account/workspace actions inside sidebar content
- Workspace dropdown/modal: `components/ui/navigation/sidebar-workspaces-dropdown.tsx` + `modal-add-workspace.tsx`
- User dropdown: `components/ui/navigation/user-profile.tsx` + `dropdown-user-profile.tsx`
- Avatar rendering: `components/dashboard-avatar.tsx` (`boring-avatars` backed)

## Shared UI/Behavior Building Blocks

- Chart helpers/components:
  - `components/ui/overview/dashboard-chart-card.tsx`
  - `components/select-item-period.tsx`
  - `components/date-range-picker.tsx`
- Progress components:
  - `components/progress-bar.tsx`
  - `components/progress-circle.tsx`
- Data-table stack:
  - `components/ui/data-table/*`
- Modal utilities:
  - `components/ui/settings/modal-add-user.tsx`
  - `components/ui/navigation/modal-add-workspace.tsx`

## Data Sources and Types

- `lib/data/overview-data.ts`
  - overview time-series seed transformed to current-year-friendly dates (`shiftOverviewYear`).
- `lib/data/data.ts`
  - table/filter seeds (`roles`, `statuses`, `regions`, `conditions`, `users`, `invitedUsers`, `usage`).
  - `usage.lastEdited` date refresh transform (`shiftUsageYear`).
- `lib/data/schema.ts`
  - shared types (`Usage`, `OverviewData`).
- `lib/types/overview.ts`
  - overview-specific UI types (`PeriodValue`, KPI shapes).

## Design System and Styling Rules

- Use semantic tokens from `@workspace/ui/globals.css` (`bg-background`, `text-foreground`, `border-border`, `text-muted-foreground`, etc.).
- Prefer `@workspace/ui` wrappers over raw primitive usage.
- `Select` components should receive `items` when possible for human-readable trigger labels.
- Keep `SelectTrigger` `w-full` in form/grid layouts to avoid collapsed width.
- For charts, keep `recharts` aligned with `@workspace/ui` chart component version.

## Dev Commands

Run inside `apps/dashboard`:

- `bun run dev` (port `3001`)
- `bun run typecheck`
- `bun run lint`
- `bun run build`
- `bun run start` (port `3001`)

## Agent Notes (Quick Start)

If you are a new agent touching this app:

- Start by checking route wrappers: `app/layout.tsx`, `app/(main)/layout.tsx`, `app/settings/layout.tsx`.
- For page-level work, edit page files first, then descend into `components/ui/<domain>`.
- For visual changes, prefer tokenized classes and reuse `@workspace/ui` primitives.
- For cross-page consistency rules and migration learnings, read root `AGENTS.md` before making UI changes.
