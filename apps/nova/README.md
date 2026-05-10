# Nova App Guide

Nova is the LLM operations dashboard in this monorepo. It runs on port `3004` and redirects `/` to `/overview`.

Use this README as the first context file before editing Nova.

## Purpose

- AI operations dashboard for monitoring LLM usage, cost, latency, traces, and model performance.
- Main workflows: overview analytics, trace inspection, model comparison, workspace settings, billing, and users.
- Stack: `Next.js 16`, `React 19`, `Tailwind v4`, `@workspace/ui`, `recharts`, `@tanstack/react-table`.
- Product metadata and route links live in `app/siteConfig.ts`.

## Start Here

- Root providers and app theme: `app/layout.tsx`
- Dashboard shell: `app/(dashboard)/layout.tsx`
- Sidebar and mobile navigation: `components/ui/navigation/sidebar.tsx`
- Overview dashboard: `app/(dashboard)/overview/page.tsx`
- Trace explorer: `app/(dashboard)/traces/page.tsx`
- Trace details: `app/(dashboard)/traces/_components/TraceDetails.tsx`
- Model comparison: `app/(dashboard)/models/page.tsx`
- Model picker: `components/ModelMultiSelect.tsx`
- Seed data and calculations: `lib/data/models.ts`, `lib/data/usage-by-model.ts`, `lib/data/traces.ts`, `lib/data/latency-buckets.ts`, `lib/data/overview-stats.ts`

## Route Map

- `/` - redirects to `/overview` in `next.config.mjs`
- `/overview` - `app/(dashboard)/overview/page.tsx`
- `/traces` - `app/(dashboard)/traces/page.tsx`
- `/models` - `app/(dashboard)/models/page.tsx`
- `/settings/general` - `app/(dashboard)/settings/general/page.tsx`
- `/settings/billing` - `app/(dashboard)/settings/billing/page.tsx`
- `/settings/users` - `app/(dashboard)/settings/users/page.tsx`
- `/login` - `app/login/page.tsx`
- `/_not-found` - `app/not-found.tsx`

## Shell And Navigation

- `app/layout.tsx` owns fonts, `@workspace/ui/globals.css`, `ThemeProvider`, `ThemeHotkey`, and `TooltipProvider`.
- `app/(dashboard)/layout.tsx` owns the sidebar dashboard shell.
- Desktop layout is a pinned left sidebar with a centered `max-w-7xl` content column.
- Mobile layout uses `MobileSidebarHeader` and the shared sidebar mobile state.
- Sidebar primary navigation: Overview, Traces, Models, Settings.
- Settings route state treats every `/settings/*` page as active under Settings.
- Mobile sidebar account/theme actions are flat menu items and close the mobile sidebar after clicks.

## Page Composition

### `/overview`

File: `app/(dashboard)/overview/page.tsx`

Behavior:

- Client component with period state for 7, 30, and 90 day views.
- KPI cards show total requests, token usage, and total cost with sparkline charts.
- Token usage chart uses stacked `AreaChart`.
- Cost by model uses a horizontal `BarChart`.
- Request distribution uses a donut `PieChart` with top models plus an "Others" aggregate.
- Performance cards show P50/P95/P99 latency, success rate, error rate, cache hit rate, and estimated cache savings.
- Recent activity table shows the latest traces with model logos, prompt preview tooltips, token counts, latency coloring, and status badges.
- "View all traces" links into `/traces`.

### `/traces`

Primary files:

- `app/(dashboard)/traces/page.tsx`
- `app/(dashboard)/traces/_components/DataTable.tsx`
- `app/(dashboard)/traces/_components/columns.tsx`
- `app/(dashboard)/traces/_components/FilterModel.tsx`
- `app/(dashboard)/traces/_components/TraceDetails.tsx`
- `app/(dashboard)/traces/_components/MobileTraceList.tsx`

Behavior:

- Page owns filter state for date range, models, status, and minimum latency.
- Date filter options: last 1h, 6h, 24h, 7d, and 30d.
- Mobile filters collapse into an `Accordion`; desktop filters are inline.
- Model filter uses the shared `ModelMultiSelect` through `FilterModel`.
- Trace table uses TanStack Table with sorting, filtering, pagination, keyboard-openable rows, and a mobile card list.
- Clicking a trace opens details.
- `TraceDetails` renders as a desktop `Dialog` and mobile `Drawer`.
- Trace details include metadata, system prompt, user prompt, completion, copy buttons, and token breakdown.

### `/models`

Primary files:

- `app/(dashboard)/models/page.tsx`
- `components/ModelMultiSelect.tsx`
- `components/ProviderLogo.tsx`
- `lib/data/usage-by-model.ts`
- `lib/data/latency-buckets.ts`

Behavior:

- Client component with period state and selected model ids.
- Default selected models: `gpt-5.5-pro`, `claude-opus-4-7`, `gemini-3.1-pro`.
- `ModelMultiSelect` groups models by provider, supports search, provider-level selection, `maxSelected`, and `minSelected`.
- Maximum compare count is 5; minimum selected count is 1.
- Per-model summary cards include request share, requests, latency, cost, tokens, and sparklines.
- Latency distribution is a multi-model bar chart.
- Daily cost is a stacked area chart.
- Performance comparison is a table with provider, requests, tokens, cost, latency, input/output pricing, and request share.

### `/settings/general`

File: `app/(dashboard)/settings/general/page.tsx`

- Workspace settings form: workspace name, default model, and rate limit.
- Default model select is built from `lib/data/models.ts`.
- Notification settings cover latency, error spikes, cost budget, and weekly digest.
- Danger zone includes leave/delete workspace cards.

### `/settings/billing`

File: `app/(dashboard)/settings/billing/page.tsx`

- Current plan card with cost and token budget progress.
- Uses `overviewSummary` and 30-day `getModelTotals`.
- Cost breakdown lists per-model cost and request volume with provider logos.

### `/settings/users`

File: `app/(dashboard)/settings/users/page.tsx`

- Team members table seeded from `lib/data/settings-users.ts`.
- Invite user flow uses a `Dialog`.
- Role options: Admin, Member, Viewer.
- Last-active display uses `relativeTime`.

### `/login`

File: `app/login/page.tsx`

- Standalone login route outside dashboard layout.
- Actions link back into `/overview`.

## Shared Components

- `components/app-logo.tsx` - static Nova logo.
- `components/ProviderLogo.tsx` - renders provider SVG logos from `public/logos`.
- `components/ModelMultiSelect.tsx` - grouped model picker used by Models and Traces.
- `components/ui/navigation/sidebar.tsx` - dashboard sidebar and mobile header.
- `components/ui/navigation/user-profile.tsx` and `dropdown-user-profile.tsx` - profile dropdown.
- Trace-local components stay under `app/(dashboard)/traces/_components`.

## Data Sources

- `lib/data/models.ts` - model catalog, featured models, provider groups, and `modelMap`.
- `lib/data/usage-by-model.ts` - 90-day generated usage series, `getModelTotals`, and chart totals.
- `lib/data/latency-buckets.ts` - latency bucket aggregation from traces and selected models.
- `lib/data/overview-stats.ts` - overview time series and summary calculations.
- `lib/data/traces.ts` - generated trace seed data and `Trace` type.
- `lib/data/settings-users.ts` - settings user rows.
- `lib/utils.ts` - currency, number, date, relative time, and class helpers.

## Styling And Behavior Notes

- Follow root `AGENTS.md` before changing UI.
- Use shared `@workspace/ui` primitives and semantic tokens.
- Chart colors should come from model colors or semantic chart variables.
- Keep Recharts usage behind `@workspace/ui/components/chart` wrappers.
- Keep `ModelMultiSelect` constraints intact when adding providers or changing model ids.
- Keep trace detail desktop/mobile overlay behavior paired: `Dialog` on desktop, `Drawer` on mobile.
- Keep settings tabs as native `TabsTrigger` buttons with router-driven navigation.

## Dev Commands

Run inside `apps/nova`:

```bash
bun run dev
bun run typecheck
bun run lint
bun run format
bun run build
bun run start
```

Ports:

- `bun run dev` - `3004`
- `bun run start` - `3004`

## Agent Checklist

- For overview chart work, inspect `overview-stats`, `usage-by-model`, `traces`, and `ProviderLogo` together.
- For trace work, inspect the page, filters, columns, `DataTable`, `TraceDetails`, and `MobileTraceList` together.
- For model comparison work, inspect `models.ts`, `usage-by-model.ts`, `latency-buckets.ts`, and `ModelMultiSelect` together.
- For settings work, check whether the needed data comes from model usage, overview summary, or `settings-users`.
- After behavior or style changes, run Nova's format, lint, typecheck, and build gates.
