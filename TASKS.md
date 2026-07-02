# hlasuj.sk — Task Backlog

Live at [hlasuj-sk.vercel.app](https://hlasuj-sk.vercel.app). Commits via CMD: `git add . && git commit --no-verify -m "..." && git push` (Husky ESLint has pre-existing errors in subpages; `--no-verify` skips until fixed).

---

## Pending

### SEO

- [ ] **Server-side render homepage** — `src/app/page.tsx` is `'use client'`, so Google sees only `Načítavam...`. Move the active poll fetch to a server component (RSC) and pass data down. Big LCP win.
- [ ] **Schema.org structured data** — Add JSON-LD (`WebSite` + `Organization`) to `src/app/layout.tsx`. Unlocks sitelinks search box eligibility and better Google understanding.
- [ ] **Custom domain** — `hlasuj-sk.vercel.app` has no Slovak SEO signal. When `hlasuj.sk` is ready, update `BASE_URL` in three files: `src/app/layout.tsx`, `src/app/robots.ts`, `src/app/sitemap.ts`.

### Code Quality

- [ ] **Fix pre-existing ESLint errors** in `src/app/kontakt/page.tsx` (line ~183), `src/app/o-projekte/page.tsx` (line ~108), `src/app/ochrana-sukromia/page.tsx` (line ~161). ESLint reports unclosed `<p>` tags — likely caused by mojibake/encoding corruption from an old save. lint-staged now catches these because the files are staged. Fix: find the corrupted character and repair the JSX.
- [ ] **Split `src/app/page.tsx`** — currently ~800 lines (voter UI + admin shell in one client component). Split into separate voter and admin components when it grows further.
- [ ] **Paginate `GET /api/votes`** — no pagination currently; will be slow on large vote counts.
- [ ] **Fix `PUT /api/polls/[id]`** — `options` update does full delete-and-reinsert, so option IDs change on every save. Consider upsert by position instead.

### Features

- [ ] **Share results button** — design done, blocked on social network embeds + n8n workflow setup. Add when n8n is ready.
- [ ] **GDPR legal basis documentation** — phone number collection needs documented legal basis (consent vs legitimate interest) before commercial launch. Needs a lawyer.

### Tooling

- [ ] **Fix computer-use screenshot capture** — Cowork returns blank screenshots, likely blocked by Razer overlay or DRM window. Investigate or disable overlay during capture.

---

## Completed

- Husky + lint-staged + Prettier + Jest pre-commit hooks
- SQL migrations: `starts_at`, `ends_at`, `phone_retention_days`, `phone_consent_at` columns
- Realtime votes (public read policy + `supabase_realtime` publication)
- `CRON_SECRET` added to Vercel; cron job cleans up phone numbers after retention period
- Light theme for all subpages (kontakt, o-projekte, ochrana-sukromia, predchadzajuce-ankety)
- Previous polls archive — deactivated polls show in `/predchadzajuce-ankety`
- GDPR phone consent checkbox with link to `/ochrana-sukromia`
- Winner picker in admin (random draw from phone numbers per poll)
- Delete phones button in admin + `GET/DELETE /api/polls/[id]/phones` API
- Slovak mobile phone validation (`+421 9xx` or `09xx`)
- `phone_consent_at` stored on vote submission
- SEO: OG tags, Twitter card, `robots.txt`, `sitemap.xml`, dynamic OG image (`/opengraph-image`), per-page titles + descriptions, per-page canonical URLs, per-page OG metadata overrides on all subpages
- Supabase project transferred to new account
- frontend-test skill fixed (tool name prefix `mcp__Claude_in_Chrome__` → `mcp__claude-in-chrome__`)
