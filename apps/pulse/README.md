# Pulse App Guide

Pulse is the operations dashboard in this monorepo. It runs on port `3003` and redirects `/` to `/support`.

Use this README as the first context file before editing Pulse.

## Purpose

- Support operations dashboard for ticket volume, retention, workflow quality, and agent performance.
- Main workflows: support dashboard, ticket creation, cohort retention analysis, workflow scenario simulation, and agent management.
- Stack: `Next.js 16`, `React 19`, `Tailwind v4`, `@workspace/ui`, `recharts`, `@tanstack/react-table`.
- Pulse is the only app here with generator scripts for demo datasets.

## Start Here

- Root providers and app theme: `app/layout.tsx`
- Dashboard top navigation shell: `app/(dashboard)/layout.tsx`
- Top nav and mobile sheet: `components/ui/navigation/navigation.tsx`
- Support page and ticket sheet: `app/(dashboard)/support/page.tsx`, `components/ui/ticket-sheet.tsx`
- Retention heatmap: `app/(dashboard)/retention/page.tsx`
- Workflow simulator: `app/(dashboard)/workflow/page.tsx`
- Agents table: `app/(dashboard)/agents/page.tsx`, `app/(dashboard)/agents/_components/DataTable.tsx`
- Data and generators: `lib/data/<domain>/*`

## Route Map

- `/` - redirects to `/support` in `next.config.ts`
- `/support` - `app/(dashboard)/support/page.tsx`
- `/retention` - `app/(dashboard)/retention/page.tsx`
- `/workflow` - `app/(dashboard)/workflow/page.tsx`
- `/agents` - `app/(dashboard)/agents/page.tsx`
- `/login` - `app/login/page.tsx`

There is no custom `not-found.tsx`; unknown routes use the framework default.

## Shell And Navigation

- `app/layout.tsx` owns fonts, `@workspace/ui/globals.css`, `ThemeProvider`, and `TooltipProvider`.
- `app/(dashboard)/layout.tsx` renders `Navigation` above a centered `max-w-7xl` content column.
- Pulse uses top navigation, not the sidebar shell used by Orbit, Audit, and Nova.
- Desktop navigation is a sticky top bar with route tabs.
- Mobile navigation is a right-side `Sheet` with flat route, theme, and account actions.
- Primary nav items: Support, Retention, Workflow, Agents.
- `components/ui/navigation/logo.tsx`, `notifications.tsx`, and `user-profile.tsx` support the top bar.

## Page Composition

### `/support`

Primary files:

- `app/(dashboard)/support/page.tsx`
- `app/(dashboard)/support/_components/DataTable.tsx`
- `app/(dashboard)/support/_components/columns.tsx`
- `app/(dashboard)/support/_components/MobileTicketList.tsx`
- `components/ui/ticket-sheet.tsx`
- `components/support-chart.tsx`
- `components/category-bar.tsx`

Behavior:

- Shows support KPI cards for current tickets, SLA performance, and call volume trends.
- `SupportChart` uses `@workspace/ui/components/chart`, `recharts`, and `lib/data/support/volume.ts`.
- Ticket table uses TanStack Table with pagination and a mobile ticket card list.
- `TicketSheet` is a three-step create-ticket flow:
  - step 1: ticket type, category, policy type, policy number.
  - step 2: priority, description, expected duration.
  - step 3: review summary.
- `TicketSheet` renders as a desktop right `Sheet` and mobile bottom `Drawer`.
- Created tickets are currently logged locally; there is no persistence boundary yet.

### `/retention`

File: `app/(dashboard)/retention/page.tsx`

Behavior:

- Renders a cohort retention heatmap from `lib/data/retention/cohorts.ts`.
- Uses explicit blue heatmap classes for retention intensity; this is a deliberate data-viz exception to semantic-only colors.
- Clicking a cohort opens `CohortDetailsDialog`.
- Detail dialog includes activity summary, satisfaction, performance, top issues, and channel distribution.
- Aggregate metrics come from `lib/data/retention/cohortsAggregate.ts`.
- The page includes cohort statistics and top issues cards below the heatmap.

### `/workflow`

File: `app/(dashboard)/workflow/page.tsx`

Behavior:

- Interactive case-testing scenario simulator.
- Data source: `lib/data/workflow/workflow-data.ts`.
- Department metadata: `lib/data/workflow/schema.ts`.
- State includes excluded departments and scenario test quota.
- Slider and numeric input both update quota.
- Excluding all departments shows a blocking overlay with a reset action.
- Desktop view uses a horizontal process diagram; mobile uses a vertical stacked diagram.
- Impact overview calculates cost savings and FTE impact over 1, 5, and 10 year horizons from in-page assumptions.

### `/agents`

Primary files:

- `app/(dashboard)/agents/page.tsx`
- `app/(dashboard)/agents/_components/DataTable.tsx`
- `app/(dashboard)/agents/_components/columns.tsx`
- `app/(dashboard)/agents/_components/DataTableFilterbar.tsx`
- `app/(dashboard)/agents/_components/MobileAgentList.tsx`
- `app/(dashboard)/agents/_components/ButtonTicketGeneration.tsx`

Behavior:

- Agents table is backed by `lib/data/agents/agents.ts`.
- Uses TanStack Table with fuzzy global search through `@tanstack/match-sorter-utils`.
- Registered-only filtering is implemented as a hidden column filter.
- Columns include agent identity, contact info, contract dates, account, capacity, and ticket generation.
- Capacity uses `ProgressCircle` with warning/error variants based on booked vs called minutes.
- Mobile has a dedicated agent card list.
- Ticket generation is local button state.

### `/login`

File: `app/login/page.tsx`

- Standalone login route outside dashboard layout.
- Actions link back into `/support`.

## Shared Components

- `components/app-logo.tsx` - product logo asset.
- `components/ui/navigation/navigation.tsx` - sticky desktop tabs and mobile sheet.
- `components/ui/ticket-sheet.tsx` - responsive create-ticket flow.
- `components/support-chart.tsx` - call volume line chart.
- `components/category-bar.tsx` - segmented status bar.
- `components/ui/navigation/notifications.tsx` - notification popover/button.
- `components/ui/navigation/user-profile.tsx` - profile dropdown.

## Data Sources And Generators

- `lib/data/support/tickets.ts` - support ticket rows.
- `lib/data/support/volume.ts` - call-volume series.
- `lib/data/support/schema.ts` - ticket schema, categories, policy types, priorities.
- `lib/data/support/generator.ts` - rewrites ticket seed data.
- `lib/data/retention/cohorts.ts` - cohort heatmap data.
- `lib/data/retention/cohortsAggregate.ts` - retention aggregates.
- `lib/data/retention/schema.ts` - cohort types.
- `lib/data/retention/generator.ts` - rewrites cohort and aggregate data.
- `lib/data/workflow/workflow-data.ts` - workflow simulation data.
- `lib/data/workflow/schema.ts` - workflow department types.
- `lib/data/workflow/generator.ts` - rewrites workflow data.
- `lib/data/agents/agents.ts` - agent rows.
- `lib/data/agents/schema.ts` - agent types and account options.
- `lib/data/agents/generator.ts` - rewrites agent data.

## Generator Commands

Run inside `apps/pulse`:

```bash
bun run generate:agents
bun run generate:support
bun run generate:retention
bun run generate:workflow
```

After changing a generator, run its matching command and then inspect the generated file diff before committing.

## Styling And Behavior Notes

- Follow root `AGENTS.md` before changing UI.
- Use shared `@workspace/ui` primitives and semantic tokens.
- Pulse intentionally differs from the other apps by using top tabs instead of a sidebar.
- Keep mobile nav as one flat sheet surface.
- Keep data-heavy cards compact and dashboard-oriented; avoid marketing-style layout.
- Retention heatmap palette classes are existing behavior. Prefer semantic tokens for new non-heatmap surfaces.
- Selects should pass `items` and explicit item labels.

## Dev Commands

Run inside `apps/pulse`:

```bash
bun run dev
bun run typecheck
bun run lint
bun run format
bun run build
bun run start
```

Ports:

- `bun run dev` - `3003`
- `bun run start` - `3003`

## Agent Checklist

- For support work, inspect the page, ticket sheet, support table, support schema, and support data together.
- For retention work, inspect both `cohorts.ts` and `cohortsAggregate.ts`; regenerate both through the retention generator when changing generated shape.
- For workflow work, keep department exclusion, scenario quota, and impact calculations in sync.
- For agent table work, inspect the fuzzy filter, hidden registered filter, columns, and mobile list together.
- After behavior or style changes, run Pulse's format, lint, typecheck, and build gates.
