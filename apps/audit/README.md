# Audit App Guide

Audit is the reporting and expense-audit dashboard in this monorepo. It runs on port `3002` and redirects `/` to `/reports`.

Use this README as the first context file before editing Audit.

## Purpose

- Expense reporting, transaction review, and audit policy management.
- Main workflows: reports, transactions, audit settings, billing, users, onboarding, and login.
- Stack: `Next.js 16`, `React 19`, `Tailwind v4`, `@workspace/ui`, `recharts`, `@tanstack/react-table`, `zod`.
- Product metadata and route links live in `app/siteConfig.ts`.

## Start Here

- Root providers and app theme: `app/layout.tsx`, `app/theme.css`
- Dashboard shell: `app/(dashboard)/layout.tsx`
- Sidebar and mobile navigation: `components/ui/navigation/sidebar.tsx`
- Reports client flow: `app/(dashboard)/reports/_components/ReportsClient.tsx`
- Transactions table and detail surface: `app/(dashboard)/transactions/_components/DataTable.tsx`, `app/(dashboard)/transactions/_components/DataTableDrawer.tsx`
- Audit settings composition: `app/(dashboard)/settings/audit/page.tsx`
- Onboarding shell: `app/onboarding/layout.tsx`
- Seed data and schemas: `lib/data/transactions.ts`, `lib/data/report.ts`, `lib/data/schema.ts`, `lib/data/data.ts`

## Route Map

- `/` - redirects to `/reports` in `next.config.mjs`
- `/reports` - `app/(dashboard)/reports/page.tsx`
- `/transactions` - `app/(dashboard)/transactions/page.tsx`
- `/settings` - redirects to `/settings/audit`
- `/settings/audit` - `app/(dashboard)/settings/audit/page.tsx`
- `/settings/billing` - `app/(dashboard)/settings/billing/page.tsx`
- `/settings/users` - `app/(dashboard)/settings/users/page.tsx`
- `/onboarding` - redirects to `/onboarding/products`
- `/onboarding/products` - `app/onboarding/products/page.tsx`
- `/onboarding/employees` - `app/onboarding/employees/page.tsx`
- `/onboarding/infrastructure` - `app/onboarding/infrastructure/page.tsx`
- `/login` - `app/login/page.tsx`
- `/_not-found` - `app/not-found.tsx`

## Shell And Navigation

- `app/layout.tsx` owns fonts, `@workspace/ui/globals.css`, `app/theme.css`, `ThemeProvider`, `TooltipProvider`, and `AuditToaster`.
- `app/(dashboard)/layout.tsx` owns the sidebar dashboard shell.
- Desktop layout is a pinned left sidebar with a centered `max-w-7xl` content column.
- Mobile layout uses `MobileSidebarHeader` and the shared sidebar mobile state.
- Sidebar primary navigation: Reports, Transactions, Settings.
- Sidebar setup navigation links to the onboarding flow.
- Settings route state treats every `/settings/*` page as active under Settings.
- Onboarding lives outside `(dashboard)` and uses its own fixed header with step progress and a "Skip to dashboard" action.

## Page Composition

### `/reports`

Primary files:

- `app/(dashboard)/reports/page.tsx`
- `app/(dashboard)/reports/_components/ReportsClient.tsx`
- `app/(dashboard)/reports/_components/Header.tsx`
- `app/(dashboard)/reports/_components/TransactionChart.tsx`

Behavior:

- Server page passes `transactions`, `referenceDateIso`, and `refreshedAt` into `ReportsClient`.
- `ReportsClient` owns filter state and uses `useDeferredValue` before filtering transactions.
- Filters: date range, expense status, country multi-select, and amount range.
- Mobile filters collapse into an `Accordion`; desktop filters are inline.
- Charts include amount, count, category, and merchant views.
- Amount and count charts render separate mobile and desktop variants for axis density.

### `/transactions`

Primary files:

- `app/(dashboard)/transactions/page.tsx`
- `app/(dashboard)/transactions/_components/DataTable.tsx`
- `app/(dashboard)/transactions/_components/Columns.tsx`
- `app/(dashboard)/transactions/_components/DataTableDrawer.tsx`
- `app/(dashboard)/transactions/_components/MobileTransactionList.tsx`

Behavior:

- Page owns the selected transaction row and opens the edit/detail surface.
- `DataTable` uses TanStack Table with sorting, merchant search, row selection, pagination, and a mobile list.
- Columns include purchased date, status, merchant, category, amount, and row actions.
- Bulk actions live in `TableBulkEditor`.
- `DataTableDrawer` renders as a desktop right `Sheet` and a mobile bottom `Drawer`.
- The transaction detail form includes expense/payment status, department, reimbursement, merchant/category fields, attachments, notes, receipt/priority flags, and an activity tab.
- Mobile drawer has keyboard-inset handling to keep focused fields visible.

### `/settings/audit`

Primary files:

- `app/(dashboard)/settings/audit/page.tsx`
- `app/(dashboard)/settings/audit/_components/AuditRules.tsx`
- `app/(dashboard)/settings/audit/_components/Approvers.tsx`
- `app/(dashboard)/settings/audit/_components/TransactionPolicy.tsx`

Behavior:

- `AuditRules` is a stateful rule builder with event/condition/action steps, pause/resume, edit flow, and toast feedback.
- `Approvers` manages an in-memory approver list with desktop `Dialog` and mobile `Drawer` invite flows.
- `TransactionPolicy` manages keyword/merchant category blocking rules, suspicious rules, delete actions, and toast feedback.
- Department permissions come from `lib/data/data.ts` and `lib/data/schema.ts`.

### `/settings/billing`

File: `app/(dashboard)/settings/billing/page.tsx`

- Subscription-style billing surface using `Card`, `Table`, `Dialog`, and shared form primitives.
- Includes billing line items, totals, and plan-management UI.

### `/settings/users`

File: `app/(dashboard)/settings/users/page.tsx`

- Members table seeded from `lib/data/data.ts`.
- Invite flow uses desktop `Dialog` and mobile `Drawer`.
- User permissions map department labels to select values.
- Remove-user action opens a confirmation dialog.

### `/onboarding/*`

Primary files:

- `app/onboarding/layout.tsx`
- `app/onboarding/products/page.tsx`
- `app/onboarding/employees/page.tsx`
- `app/onboarding/infrastructure/page.tsx`
- `app/onboarding/choice-card-styles.ts`

Behavior:

- Step order is products -> employees -> infrastructure.
- The layout owns fixed header progress and skip behavior.
- Choice-card styles are shared through `choice-card-styles.ts`.
- Products step requires at least one product selection before continuing.
- Employees step stores selected employee count.
- Infrastructure step includes provider choices and region `Select`.

### `/login`

File: `app/login/page.tsx`

- Standalone login surface outside the dashboard shell.
- Successful action routes to `/reports`.

## Shared Components

- `components/app-logo.tsx` - static Audit logo.
- `components/audit-toaster.tsx` - app-level toast rendering.
- `components/ui/navigation/sidebar.tsx` - dashboard sidebar and mobile shell.
- `components/ui/navigation/user-profile.tsx` and `dropdown-user-profile.tsx` - desktop profile menu.
- `components/ui/navigation/identity-avatar.tsx` - branded avatar helper.
- Route-local components stay colocated under `_components` for reports, transactions, and audit settings.

## Data Sources

- `lib/data/transactions.ts` - rolling transaction seed list.
- `lib/data/report.ts` - report aggregates derived from transactions.
- `lib/data/schema.ts` - Zod transaction schema, transaction type, department/role/status options.
- `lib/data/data.ts` - members and approvers for settings.
- `lib/utils.ts` - formatting and class helpers.
- `lib/use-media-query.ts` - responsive branching for Dialog/Drawer and Sheet/Drawer behavior.

## Styling And Behavior Notes

- Follow root `AGENTS.md` before changing UI.
- Use shared `@workspace/ui` primitives and semantic tokens.
- Audit has an app-specific `theme.css`; inspect it before changing colors.
- Keep dropdown labels inside `DropdownMenuGroup` when adding dropdown menu labels.
- Keep desktop/mobile overlay patterns paired: `Dialog` on desktop, `Drawer` on mobile where current code uses that split.
- Keep settings tabs as native `TabsTrigger` buttons with router-driven navigation.
- Toast behavior comes from `@workspace/ui/components/sonner` plus `AuditToaster`.

## Dev Commands

Run inside `apps/audit`:

```bash
bun run dev
bun run typecheck
bun run lint
bun run format
bun run build
bun run start
```

Ports:

- `bun run dev` - `3002`
- `bun run start` - `3002`

## Agent Checklist

- For reports, inspect `ReportsClient`, `Header`, filter components, `TransactionChart`, and transaction data together.
- For transaction editing, inspect the page, table, columns, drawer, and mobile list together.
- For audit settings, treat `AuditRules`, `Approvers`, and `TransactionPolicy` as independent stateful surfaces.
- For onboarding changes, inspect the layout and `choice-card-styles.ts` first.
- After behavior or style changes, run Audit's format, lint, typecheck, and build gates.
