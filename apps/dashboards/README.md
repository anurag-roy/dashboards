# Dashboards Hub Guide

Dashboards Hub is the client-facing showcase page for the four demo dashboards in this monorepo. It runs on port `3000` and serves the future `dashboards.anuragroy.dev` surface.

Use this README as the first context file before editing the hub page.

## Purpose

- Client pitch page that presents Orbit, Audit, Pulse, and Nova as examples of freelance product engineering work.
- Main workflow: quickly understand the kind of business software Anurag can build, then open a relevant dashboard demo.
- Stack: `Next.js 16`, `React 19`, `Tailwind v4`, `@workspace/ui`, and app-local SVG logos.
- Product metadata and destination links live in `app/siteConfig.ts`.

## Start Here

- Root providers and app theme: `app/layout.tsx`, `app/theme.css`
- Launch page composition: `app/page.tsx`
- Domain/link metadata: `app/siteConfig.ts`
- Local logo copies: `public/logos`

## Route Map

- `/` - `app/page.tsx`

## Page Composition

### `/`

File: `app/page.tsx`

- Server component with no client-side state.
- Header links back to the hub root and to `anuragroy.dev`.
- Hero copy speaks to prospective clients, not a technical audience.
- Dashboard cards link to:
  - `https://orbit.anuragroy.dev`
  - `https://audit.anuragroy.dev`
  - `https://pulse.anuragroy.dev`
  - `https://nova.anuragroy.dev`
- Each vertically stacked card uses the app's logo pair, theme class, client-facing positioning, and a custom product illustration based on that app's actual screens.

## Styling And Behavior Notes

- Follow root `AGENTS.md` before changing UI.
- Use shared `@workspace/ui` primitives and semantic tokens.
- The hub imports `@workspace/ui/globals.css` and adds Audit's missing `theme-audit` tokens locally in `app/theme.css`.
- Orbit, Pulse, and Nova use the shared theme classes already present in `@workspace/ui/globals.css`.
- Keep the page static unless a real interactive requirement is added.
- Avoid implementation-first copy on the rendered page. Save framework, hosting, and port details for docs.
- The app is intentionally separate from the four dashboard workspaces so deployment can target `dashboards.anuragroy.dev` independently.

## Dev Commands

Run inside `apps/dashboards`:

```bash
bun run dev
bun run typecheck
bun run lint
bun run format
bun run build
bun run start
```

Ports:

- `bun run dev` - `3000`
- `bun run start` - `3000`

## Agent Checklist

- For link or domain changes, start with `app/siteConfig.ts`.
- For visual/card changes, inspect `app/page.tsx` and shared components in `packages/ui/src/components`.
- After behavior or style changes, run the hub's format, lint, typecheck, and build gates.
