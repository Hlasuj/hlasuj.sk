# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Commands

```bash
npm run dev      # Start dev server at http://localhost:3000 (uses Turbopack by default)
npm run build    # Production build (also uses Turbopack by default)
npm run start    # Start production server
npm run lint     # Run ESLint directly (next lint no longer exists in Next.js 16)
```

There is no test suite configured yet.

## Architecture

- **Framework**: Next.js 16.2.4 with App Router (`src/app/`)
- **Styling**: Tailwind CSS v4 via PostCSS (`@tailwindcss/postcss`)
- **Backend**: Supabase — client singleton exported from `src/lib/supabase.ts`, reads `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- **Path alias**: `@/*` maps to `src/*`

## Next.js 16 Breaking Changes

This project runs Next.js 16, which has breaking changes from earlier versions. Read `node_modules/next/dist/docs/` before writing code that touches these areas.

**Async-only APIs** — synchronous access is fully removed:
- `cookies()`, `headers()`, `draftMode()` must be awaited
- `params` and `searchParams` props in layouts/pages/routes are Promises — always `await` them
- Use `npx next typegen` to generate `PageProps`/`LayoutProps`/`RouteContext` type helpers

**Routing**:
- `middleware.ts` is renamed to `proxy.ts`; the export must be named `proxy` (not `middleware`)
- All parallel route slots (`@slot/`) require an explicit `default.js` file or the build fails

**Caching**:
- `revalidateTag(tag)` requires a second `cacheLife` profile argument: `revalidateTag('tag', 'max')`
- Use `updateTag` (Server Actions only) for immediate read-your-writes cache invalidation
- `unstable_cacheLife` / `unstable_cacheTag` are now stable — import as `cacheLife` / `cacheTag`
- `experimental.dynamicIO` is renamed to `cacheComponents` (top-level config option)
- PPR: use `cacheComponents: true` instead of `experimental.ppr`

**Linting**: `next build` no longer runs ESLint automatically. Use `npm run lint` explicitly.

**Config**:
- Turbopack config moved from `experimental.turbopack` to top-level `turbopack`
- `serverRuntimeConfig` / `publicRuntimeConfig` removed — use `process.env` directly in Server Components and `NEXT_PUBLIC_*` for client-accessible values
- `images.domains` deprecated — use `images.remotePatterns`
- Sass tilde (`~`) imports not supported by Turbopack — use bare package names

**Removed**: AMP support, `next lint` CLI command, `devIndicators.appIsrStatus/buildActivity/buildActivityPosition`
