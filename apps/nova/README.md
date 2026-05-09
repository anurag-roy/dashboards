# Nova App Guide

This document explains how the `apps/nova` app is structured, what each route renders, and which components/patterns are used so another agent can onboard quickly.

## Purpose

- An LLM operations dashboard UI (`Next.js 16`, `React 19`, `Tailwind v4`) focused on monitoring model performance, costs, and traces.
- Uses shared design system primitives from `@workspace/ui` (Base UI wrappers + shadcn-style APIs).
- Main UX areas:
  - overview KPIs and charts
  - trace explorer with filters and row detail
  - per-model analytics and comparison
  - workspace settings (general, billing, users)
- Marketing metadata and canonical URLs live in `app/siteConfig.ts` (product name: **Nova**).

## High-Level Structure

- `app/layout.tsx`
  - Root fonts (`Geist`, `Geist_Mono`), global styles (`@workspace/ui/globals.css`).
  - Providers: `ThemeProvider`, `ThemeHotkey`, `TooltipProvider`.
  - No sidebar here; dashboard shell is scoped to `(dashboard)`.
- `app/(dashboard)/layout.tsx`
  - Dashboard shell: `SidebarProvider`, `Sidebar`, `SidebarInset`, `MobileSidebarHeader`.
  - Layout norm: sidebar pinned left, RHS constrained and centered (`max-w-7xl`).
- `app/(dashboard)/settings/layout.tsx`
  - Settings header + route tabs (`Tabs`, `TabsList`, `TabsTrigger`, `variant='line'`).
- `next.config.mjs`
  - Permanent redirect: `/` → `/overview`.

## Route Map

- `/` → redirects to `/overview`
- `/overview` → `app/(dashboard)/overview/page.tsx`
- `/traces` → `app/(dashboard)/traces/page.tsx`
- `/models` → `app/(dashboard)/models/page.tsx`
- `/settings/general` → `app/(dashboard)/settings/general/page.tsx`
- `/settings/billing` → `app/(dashboard)/settings/billing/page.tsx`
- `/settings/users` → `app/(dashboard)/settings/users/page.tsx`
- `/login` → `app/login/page.tsx`
- `/_not-found` → `app/not-found.tsx`

## Page Composition

### `/overview`

File: `app/(dashboard)/overview/page.tsx`

- KPI-style cards with sparklines, period `Select` (7 / 30 / 90 days).
- Charts via `@workspace/ui/components/chart` (`ChartContainer`, `ChartTooltip`, `ChartTooltipContent`, `ChartLegend`) + `recharts` (area, bar, line, pie).
- Usage summary table with `ProviderLogo`, token/cost formatting from `lib/utils`.
- Data assembled from `overview-stats`, `models`, `usage-by-model`, and `traces`.

### `/traces`

File: `app/(dashboard)/traces/page.tsx`

- Client-side filters: date range `Select`, status `Select`, min latency `Input`, model filter (`FilterModel` + shared `ModelMultiSelect`).
- Reset control clears filters.
- Main surface: `DataTable` + `columns` (`app/(dashboard)/traces/_components/`).
- Row click opens trace detail (`TraceDetails`); mobile uses `MobileTraceList`.
- Table tech: `@tanstack/react-table` with sorting, filtering, pagination (`DataTablePagination`).

### `/models`

File: `app/(dashboard)/models/page.tsx`

- Period `Select` and `ModelMultiSelect` to choose models to compare (caps and defaults defined in-page).
- Charts for usage trends and latency distribution (`getLatencyBuckets` / `lib/data/latency-buckets.ts`).
- Summary table with totals from `getModelTotals` and `usage-by-model`.

### `/settings/*` shared wrapper

File: `app/(dashboard)/settings/layout.tsx`

- Heading: `Settings`
- Route tabs: `General`, `Billing & Usage`, `Users`
- Tab navigation is route-driven via `Tabs` `onValueChange` + `router.push`.
- `TabsTrigger` stays native button (no direct `Link` render target).

### `/settings/general`

File: `app/(dashboard)/settings/general/page.tsx`

- Workspace settings form: name, default model (`Select` with `items` from `lib/data/models`), rate limit.
- Notification settings (`Checkbox` list).
- Danger zone cards (`Card`, secondary/destructive actions).

### `/settings/billing`

File: `app/(dashboard)/settings/billing/page.tsx`

- Current plan card, spend vs budget (`ProgressBar`), token usage.
- Model cost breakdown using `getModelTotals` and `ProviderLogo`.

### `/settings/users`

File: `app/(dashboard)/settings/users/page.tsx`

- Team table seeded from `lib/data/settings-users.ts`: avatar (`DashboardAvatar`), role `Select`, invite dialog (`Dialog` + form fields).

### `/login`

File: `app/login/page.tsx`

- Centered sign-in style layout (OAuth-style primary action). Standalone route outside the dashboard layout.

### `/_not-found`

File: `app/not-found.tsx`

- 404 page with CTA link back to `/overview` (`siteConfig.baseLinks.overview`).

## Navigation and Shell Components

- Sidebar and mobile nav: `components/ui/navigation/sidebar.tsx`
  - Nav items: Overview, Traces, Models, Settings (settings links to general).
  - Desktop: workspace header, nav groups, `UserProfileDesktop` in footer.
  - Mobile: `MobileSidebarHeader`, flat theme + account-style actions in sidebar content.
- User dropdown: `components/ui/navigation/user-profile.tsx` + `dropdown-user-profile.tsx`

## Shared UI/Behavior Building Blocks

- `components/ProviderLogo.tsx` — provider logos for tables and cards (`public/logos/*.svg`).
- `components/ModelMultiSelect.tsx` — multi-select used on Models and Traces filters.
- Trace table: `app/(dashboard)/traces/_components/*` (`DataTable`, `columns`, `TraceDetails`, `FilterModel`, `MobileTraceList`, `DataTablePagination`, `DataTableColumnHeader`).

## Data Sources and Types

- `lib/data/models.ts` — `ModelDefinition`, featured model catalog, `modelMap`.
- `lib/data/usage-by-model.ts` — time-series usage by model, `getModelTotals`.
- `lib/data/latency-buckets.ts` — latency histogram buckets for model charts.
- `lib/data/overview-stats.ts` — overview KPIs and summary stats.
- `lib/data/traces.ts` — `Trace` type and generated trace seed data.
- `lib/data/settings-users.ts` — settings users table seed.
- `lib/utils.ts` — `formatters`, `relativeTime`, and shared helpers.

## Design System and Styling Rules

- Use semantic tokens from `@workspace/ui/globals.css` (`bg-background`, `text-foreground`, `border-border`, `text-muted-foreground`, etc.).
- Prefer `@workspace/ui` wrappers over raw primitives.
- `Select` components should receive `items` when possible for human-readable trigger labels.
- Keep `SelectTrigger` `w-full` in form/grid layouts to avoid collapsed width.
- For charts, keep `recharts` aligned with `@workspace/ui` chart component version.

## Dev Commands

Run inside `apps/nova`:

- `bun run dev` (port `3004`, Turbopack)
- `bun run typecheck`
- `bun run lint`
- `bun run format`
- `bun run build`
- `bun run start` (port `3004`)

## Agent Notes (Quick Start)

If you are a new agent touching this app:

- Start by checking route wrappers: `app/layout.tsx`, `app/(dashboard)/layout.tsx`, `app/(dashboard)/settings/layout.tsx`, and `next.config.mjs` redirects.
- For page-level work, edit page files first, then descend into colocated `_components` or `components/`.
- For visual changes, prefer tokenized classes and reuse `@workspace/ui` primitives.
- For cross-page consistency rules and migration learnings, read root `AGENTS.md` before making UI changes.
