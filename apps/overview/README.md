# Overview App Guide

This document explains how the `apps/overview` app is structured, what each route renders, and which components/patterns are used so another agent can onboard quickly.

## Purpose

- An operations-style dashboard (`Next.js 16`, `React 19`, `Tailwind v4`) for support volume, cohort retention, workflow quality, and agent performance metrics.
- Uses shared primitives from `@workspace/ui`.
- Product metadata lives in `app/siteConfig.ts` (product name: **Overview**).
- Optional **data generation** scripts refresh seeded JSON/TS data for demos (`package.json` `generate:*` scripts).

## High-Level Structure

- `app/layout.tsx`
  - Root fonts (`Geist`, `Geist_Mono`), global styles (`@workspace/ui/globals.css`).
  - Providers: `ThemeProvider`, `TooltipProvider`.
- `app/(dashboard)/layout.tsx`
  - Top navigation via `components/ui/navigation/navigation.tsx` (tabs + mobile sheet), not the sidebar pattern used in other apps.
  - Content column: `max-w-7xl`, consistent horizontal padding.
- `next.config.ts`
  - Permanent redirect: `/` → `/support`.

## Route Map

- `/` → redirects to `/support`
- `/support` → `app/(dashboard)/support/page.tsx`
- `/retention` → `app/(dashboard)/retention/page.tsx`
- `/workflow` → `app/(dashboard)/workflow/page.tsx`
- `/agents` → `app/(dashboard)/agents/page.tsx`
- `/login` → `app/login/page.tsx`

There is no custom `not-found.tsx`; unknown routes use the framework default.

## Page Composition

### `/support`

File: `app/(dashboard)/support/page.tsx`

- KPI cards (`Card`, `ProgressCircle`, `CategoryBar`), charts via `components/support-chart.tsx` and `lib/data/support/volume`.
- Ticket list/table through `app/(dashboard)/support/_components/DataTable.tsx` with seed data from `lib/data/support/tickets.ts`.
- `TicketSheet` for creating tickets (`components/ui/ticket-sheet.tsx`).

### `/retention`

File: `app/(dashboard)/retention/page.tsx`

- Cohort retention heatmaps and drill-down `Dialog` using `lib/data/retention/cohorts.ts`, `cohortsAggregate.ts`, and typed shapes from `lib/data/retention/schema.ts`.
- Uses semantic-focused styling helpers in `lib/utils.ts` (`valueFormatter`, etc.).

### `/workflow`

File: `app/(dashboard)/workflow/page.tsx`

- Department-level workflow statistics from `lib/data/workflow/workflow-data.ts` and `lib/data/workflow/schema.ts`.
- Interactive exclusions (`Checkbox`), scenario slider (`Slider`), and aggregate KPI math driven by client state.

### `/agents`

File: `app/(dashboard)/agents/page.tsx`

- Agent roster `DataTable` (`app/(dashboard)/agents/_components/*`) over `lib/data/agents/agents.ts`.
- Toolbar/filter patterns: `DataTableFilterbar`; mobile list `MobileAgentList`; ticket-generation control `ButtonTicketGeneration`.

### `/login`

File: `app/login/page.tsx`

- Marketing-style login surface with OAuth affordance (standalone route, outside dashboard layout).

## Navigation and Shell Components

- Primary nav: `components/ui/navigation/navigation.tsx`
  - Route tabs for Support, Retention, Workflow, Agents (`Tabs` + pathname).
  - Desktop: `Logo`, `Notifications`, `DropdownUserProfile`.
  - Mobile: `Sheet` menu with theme toggles and flat links.
- Supplementary pieces: `logo.tsx`, `notifications.tsx`, `user-profile.tsx`.

## Shared UI/Behavior Building Blocks

- `components/category-bar.tsx` — segmented bar summaries on Support.
- `components/support-chart.tsx` — shared chart wrapper for support metrics.
- `components/ui/ticket-sheet.tsx` — ticket creation sheet.
- Route-local tables: `app/(dashboard)/support/_components/*`, `app/(dashboard)/agents/_components/*`.

## Data Sources and Types

- `lib/data/support/*` — `tickets.ts`, `volume.ts`, `schema.ts`; optional regeneration via `bun run generate:support`.
- `lib/data/retention/*` — cohort datasets and `schema.ts`; `bun run generate:retention`.
- `lib/data/workflow/*` — `workflow-data.ts`, `schema.ts`; `bun run generate:workflow`.
- `lib/data/agents/*` — `agents.ts`, `schema.ts`; `bun run generate:agents`.
- `lib/utils.ts` — formatting and UI helpers (`valueFormatter`, `cn`, focus utilities).

## Design System and Styling Rules

- Use semantic tokens from `@workspace/ui/globals.css` (`bg-background`, `text-foreground`, `border-border`, `text-muted-foreground`, etc.).
- Prefer `@workspace/ui` wrappers over raw primitives.
- `Select` components should receive `items` when possible for human-readable trigger labels.
- Keep `SelectTrigger` `w-full` in form/grid layouts to avoid collapsed width.
- For charts, keep `recharts` aligned with `@workspace/ui` chart component version.

Some retention heatmap styling uses explicit palette classes for gradient steps; prefer semantic tokens for new surfaces unless matching existing heatmap behavior.

## Dev Commands

Run inside `apps/overview`:

- `bun run dev` (port `3003`, Turbopack)
- `bun run typecheck`
- `bun run lint`
- `bun run format`
- `bun run build`
- `bun run start` (port `3003`)

Optional seed regeneration (requires dependencies installed):

- `bun run generate:agents`
- `bun run generate:support`
- `bun run generate:retention`
- `bun run generate:workflow`

## Agent Notes (Quick Start)

If you are a new agent touching this app:

- Navigation is **top tabs + sheet**, not sidebar — start from `components/ui/navigation/navigation.tsx` and `app/(dashboard)/layout.tsx`.
- Each major route owns its own `_components` folder and data under `lib/data/<domain>/`.
- After changing generators, re-run the relevant `generate:*` script if downstream imports depend on written files.
- For cross-page UI conventions, read root `AGENTS.md` before making style changes.
