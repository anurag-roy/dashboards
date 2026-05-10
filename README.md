# Dashboards Monorepo

This repository contains four Next.js dashboard apps built on a shared `@workspace/ui` design system and orchestrated with Turborepo.

Read this file first when working across apps. Then read the app README for the specific product you are changing.

## Apps At A Glance

| App | Workspace | Port | Default Route | Product Surface |
| --- | --- | ---: | --- | --- |
| Orbit | `apps/orbit` | `3001` | `/overview` | Usage analytics, billing cycle metrics, usage details, workspace settings |
| Audit | `apps/audit` | `3002` | `/reports` | Expense reports, transaction review, audit policy settings, onboarding |
| Pulse | `apps/pulse` | `3003` | `/support` | Support metrics, cohort retention, workflow simulation, agent performance |
| Nova | `apps/nova` | `3004` | `/overview` | LLM usage, traces, model comparison, AI operations settings |

## Workspace Layout

- `apps/orbit` - sidebar-based usage analytics dashboard.
- `apps/audit` - sidebar-based audit dashboard plus onboarding and login routes outside the shell.
- `apps/pulse` - top-navigation operations dashboard with optional data-generation scripts.
- `apps/nova` - sidebar-based LLM operations dashboard with trace and model analysis flows.
- `packages/ui` - shared shadcn/Base UI wrappers, tokens, charts, sidebar, tables, and form primitives.
- `packages/typescript-config` - shared TypeScript configuration.
- `AGENTS.md` - UI migration rules for this repo. Read it before styling work.

## Tech Stack

- Bun workspace monorepo.
- Turborepo for task fan-out.
- Next.js 16 and React 19 in every app.
- Tailwind v4 with app theme classes and shared `@workspace/ui/globals.css`.
- `@workspace/ui` for shared Luma/base shadcn-style components.
- Recharts through `@workspace/ui/components/chart` for chart work.
- TanStack Table for data tables.
- Oxlint, oxfmt, and `tsc --noEmit` for quality gates.

## Root Commands

Run from the repository root:

```bash
bun run dev
bun run start
bun run build
bun run lint
bun run format
bun run typecheck
```

`bun run dev` and `bun run start` fan out through Turbo. For focused work, prefer a filtered command:

```bash
bun run dev --filter=orbit
bun run build --filter=audit
bun run typecheck --filter=pulse
```

Do not start all four apps together unless that is the actual task. For routine verification, run static gates and a single affected app first.

## App Commands

Each app has the same baseline scripts:

```bash
bun run dev
bun run build
bun run start
bun run lint
bun run format
bun run typecheck
```

Pulse also has data generation commands:

```bash
bun run generate:agents
bun run generate:support
bun run generate:retention
bun run generate:workflow
```

Run those from `apps/pulse` after changing a Pulse generator.

## Shared UI Rules

- Treat `@workspace/ui` as the source of truth for component behavior and visual language.
- Use semantic tokens such as `bg-background`, `text-foreground`, `text-muted-foreground`, and `border-border`.
- Keep app layouts aligned with the current Luma/base shadcn look.
- Use shared chart primitives from `@workspace/ui/components/chart` for new charts.
- Use `Select` with `items` plus item labels so trigger text stays human-readable.
- Keep route tabs as native `TabsTrigger` buttons and navigate with `Tabs` `onValueChange`.
- Many shared wrappers are Base UI based. Prefer the existing `render` patterns and do not assume Radix `asChild` support.
- For mobile navigation, prefer one flat hamburger/sheet/sidebar surface instead of nested account/workspace popovers.

## Shell Patterns

- Orbit, Audit, and Nova use a pinned left sidebar on desktop and a minimal mobile sidebar header.
- Pulse uses a sticky top bar with route tabs on desktop and a right-side mobile sheet.
- Dashboard content is constrained to a centered `max-w-7xl` column on the right side of each shell.
- Brand logos live in each app's `public/logos` tree and render through app-local logo components.

## Data And Demo State

Most app data is local seed data under `apps/<app>/lib/data`. The dashboards are demo/admin surfaces, so many forms are local-only UI flows:

- Orbit usage, users, and overview data come from `apps/orbit/lib/data`.
- Audit transactions, reports, members, approvers, and departments come from `apps/audit/lib/data`.
- Pulse has generated seed files and generators under `apps/pulse/lib/data/<domain>`.
- Nova models, usage, traces, latency buckets, overview stats, and settings users come from `apps/nova/lib/data`.

When wiring real backends later, preserve the page contracts and table/filter state shapes first, then replace the seed data boundary.

## Documentation Map

- `apps/orbit/README.md` - Orbit routes, usage chart state, details table, settings, sidebar shortcuts.
- `apps/audit/README.md` - Audit reports, transaction drawer behavior, audit policy settings, onboarding.
- `apps/pulse/README.md` - Pulse top navigation, ticket sheet, retention heatmap, workflow simulator, generators.
- `apps/nova/README.md` - Nova LLM overview charts, trace filtering/detail, model comparison, settings.

## Quality Gates

For docs-only changes, a readback/diff check is usually enough. For app behavior or styling changes, run the affected app gates:

```bash
bun run format --filter=<app>
bun run lint --filter=<app>
bun run typecheck --filter=<app>
bun run build --filter=<app>
```

If the change touches `packages/ui`, broaden verification to every affected app.
