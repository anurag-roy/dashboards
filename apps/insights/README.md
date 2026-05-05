# Insights App Guide

This document explains how the `apps/insights` app is structured, what each route renders, and which components/patterns are used so another agent can onboard quickly.

## Purpose

- A reporting and expense-audit style dashboard (`Next.js 16`, `React 19`, `Tailwind v4`) built on `@workspace/ui`.
- Product framing and URLs live in `app/siteConfig.ts` (product name: **Signal Atlas**).
- Main UX areas:
  - filtered reporting charts over transactions
  - full transactions table with drawer editing and bulk actions
  - workspace settings (audit policies, billing, users)
  - multi-step onboarding outside the dashboard shell

## High-Level Structure

- `app/layout.tsx`
  - Root fonts (`Geist`, `Geist_Mono`), global styles (`@workspace/ui/globals.css`).
  - Providers: `ThemeProvider`, `TooltipProvider`.
- `app/(dashboard)/layout.tsx`
  - Dashboard shell: `SidebarProvider`, `Sidebar`, `SidebarInset`, `MobileSidebarHeader`.
  - Layout norm: sidebar pinned left, RHS constrained and centered (`max-w-7xl`).
- `app/(dashboard)/settings/layout.tsx`
  - Settings intro copy + route tabs (`Tabs`, `TabsList`, `TabsTrigger`, `variant='line'`).
- `app/onboarding/layout.tsx`
  - Fixed header with step progress and “Skip to dashboard”; narrow content column (`max-w-2xl`).
- `next.config.mjs`
  - Permanent redirect: `/` → `/reports`.

## Route Map

- `/` → redirects to `/reports`
- `/reports` → `app/(dashboard)/reports/page.tsx`
- `/transactions` → `app/(dashboard)/transactions/page.tsx`
- `/settings` → `app/(dashboard)/settings/page.tsx` (redirects to `/settings/audit`)
- `/settings/audit` → `app/(dashboard)/settings/audit/page.tsx`
- `/settings/billing` → `app/(dashboard)/settings/billing/page.tsx`
- `/settings/users` → `app/(dashboard)/settings/users/page.tsx`
- `/onboarding` → `app/onboarding/page.tsx` (redirects to `/onboarding/products`)
- `/onboarding/products` → `app/onboarding/products/page.tsx`
- `/onboarding/employees` → `app/onboarding/employees/page.tsx`
- `/onboarding/infrastructure` → `app/onboarding/infrastructure/page.tsx`
- `/login` → `app/login/page.tsx`
- `/_not-found` → `app/not-found.tsx`

## Page Composition

### `/reports`

File: `app/(dashboard)/reports/page.tsx`

- Client-side filters with `useDeferredValue` for smoother updates.
- `Header` wires range, expense status, country, and amount filters; reset restores defaults.
- `TransactionChart` (`recharts` + shared patterns) for amount and count series; responsive duplicate charts for mobile (`sm:hidden` / `hidden sm:block`).
- Filter helpers and types: `app/(dashboard)/reports/_components/dateRanges.ts`, `types.ts`.
- Data source: `lib/data/transactions.ts` (see also aggregated series in `lib/data/report.ts`).

### `/transactions`

File: `app/(dashboard)/transactions/page.tsx`

- `DataTable` from `app/(dashboard)/transactions/_components/DataTable.tsx` backed by `@tanstack/react-table`.
- Row actions open `DataTableDrawer`; bulk selection flows through `TableBulkEditor`.
- Mobile list: `MobileTransactionList`.
- Types: `Transaction` from `lib/data/schema.ts` (Zod-backed).

### `/settings/*` shared wrapper

File: `app/(dashboard)/settings/layout.tsx`

- Tabs: `Audit`, `Billing & Usage`, `Users`.
- Route-driven navigation via `Tabs` `onValueChange` + `router.push`.
- `TabsTrigger` remains a native button (no direct `Link` as trigger).

### `/settings/audit`

File: `app/(dashboard)/settings/audit/page.tsx`

- Composed sections: `AuditRules`, `Approvers`, `TransactionPolicy` under `settings/audit/_components/`.

### `/settings/billing`

File: `app/(dashboard)/settings/billing/page.tsx`

- Billing line items, totals, and subscription-style UI (`Card`, `Table`, `Dialog` patterns).

### `/settings/users`

File: `app/(dashboard)/settings/users/page.tsx`

- Members table seeded from `lib/data/data.ts` (`members`, `department`-linked permissions).

### `/onboarding/*`

Files: `app/onboarding/*/page.tsx`

- Wizard steps (products → employees → infrastructure); index route redirects to products.
- Shared chrome from `app/onboarding/layout.tsx`.

### `/login`

File: `app/login/page.tsx`

- Card-based login UI; navigates into the app on success (client-side).

### `/_not-found`

File: `app/not-found.tsx`

- 404 with CTA back to `/reports` (`siteConfig.baseLinks.reports`).

## Navigation and Shell Components

- Sidebar: `components/ui/navigation/sidebar.tsx`
  - Primary nav: Reports, Transactions, Settings (defaults to audit).
  - Secondary: Onboarding entry.
  - Desktop footer: `UserProfileDesktop`; mobile: theme + utility-style rows.
- User menu: `dropdown-user-profile.tsx` + `user-profile.tsx`
- Optional branded avatar helper: `components/ui/navigation/identity-avatar.tsx`

## Shared UI/Behavior Building Blocks

- Reports: `app/(dashboard)/reports/_components/*` (`Header`, `TransactionChart`, `FilterDate`, `FilterAmount`, `FilterExpenseStatus`, `FilterCountry`).
- Transactions: `app/(dashboard)/transactions/_components/*` (`DataTable`, `Columns`, `DataTableDrawer`, `DataTableDrawerFeed`, `DataTablePagination`, `TableBulkEditor`, `MobileTransactionList`, `DataTableColumnHeader`).

## Data Sources and Types

- `lib/data/transactions.ts` — transaction seed list used by reports and table.
- `lib/data/report.ts` — daily aggregates derived from `transactions`.
- `lib/data/schema.ts` — Zod `transactionSchema`, `Transaction` type, category/merchant enums.
- `lib/data/data.ts` — departments and members for settings users.
- `lib/utils.ts` — shared helpers.

## Design System and Styling Rules

- Use semantic tokens from `@workspace/ui/globals.css` (`bg-background`, `text-foreground`, `border-border`, `text-muted-foreground`, etc.).
- Prefer `@workspace/ui` wrappers over raw primitives.
- `Select` components should receive `items` when possible for human-readable trigger labels.
- Keep `SelectTrigger` `w-full` in form/grid layouts to avoid collapsed width.
- For charts, keep `recharts` aligned with `@workspace/ui` chart component version.

## Dev Commands

Run inside `apps/insights`:

- `bun run dev` (port `3002`, Turbopack)
- `bun run typecheck`
- `bun run lint`
- `bun run format`
- `bun run build`
- `bun run start` (port `3002`)

## Agent Notes (Quick Start)

If you are a new agent touching this app:

- Start with `app/layout.tsx`, `app/(dashboard)/layout.tsx`, `app/(dashboard)/settings/layout.tsx`, and `next.config.mjs` redirects.
- For dashboard pages, follow colocated `_components` folders per route.
- Onboarding lives outside `(dashboard)` — it does not use the sidebar layout.
- For cross-page UI conventions, read root `AGENTS.md` before making style changes.
