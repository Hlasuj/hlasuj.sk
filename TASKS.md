# hlasuj.sk — Task Backlog

Live at [hlasuj-sk.vercel.app](https://hlasuj-sk.vercel.app). Commits via CMD: `git add . && git commit --no-verify -m "..." && git push` (Husky ESLint has pre-existing errors in subpages; `--no-verify` skips until fixed).

---

## Pending

### SEO

- [ ] **Server-side render homepage** (issue #6) — `src/app/page.tsx` is `'use client'`, so Google sees only `Načítavam...`. Move the active poll fetch to a server component (RSC) and pass data down. Big LCP win.
- [ ] **Schema.org structured data** (issue #7) — Add JSON-LD (`WebSite` + `Organization`) to `src/app/layout.tsx`. Unlocks sitelinks search box eligibility and better Google understanding.
- [ ] **Custom domain** (issue #8) — `hlasuj-sk.vercel.app` has no Slovak SEO signal. When `hlasuj.sk` is ready, update `BASE_URL` in three files: `src/app/layout.tsx`, `src/app/robots.ts`, `src/app/sitemap.ts`.

### Code Quality

- [ ] **Fix pre-existing ESLint errors** (issue #9) in `src/app/kontakt/page.tsx` (line ~183), `src/app/o-projekte/page.tsx` (line ~108), `src/app/ochrana-sukromia/page.tsx` (line ~161). ESLint reports unclosed `<p>` tags — likely caused by mojibake/encoding corruption from an old save. lint-staged now catches these because the files are staged. Fix: find the corrupted character and repair the JSX.
- [ ] **Split `src/app/page.tsx`** (issue #10) — currently ~800 lines (voter UI + admin shell in one client component). Split into separate voter and admin components when it grows further.
- [ ] **Paginate `GET /api/votes`** (issue #11) — no pagination currently; will be slow on large vote counts.
- [ ] **Fix `PUT /api/polls/[id]`** (issue #12) — `options` update does full delete-and-reinsert, so option IDs change on every save. Consider upsert by position instead.

### Features

- [ ] **Share results button** (issue #13) — design done, blocked on social network setup. Publish to Facebook, Instagram, TikTok. Add when social accounts + n8n are ready.
- [ ] **n8n automation pipeline** (issue #16) — scrape feeds from main Slovak media sites → compare most relevant news → select the few most valid topics → generate a poll post for each. Details TBD. Pipeline feeds poll creation on hlasuj.sk and posts to FB/Insta/TikTok.
- [ ] **GDPR legal basis documentation** (issue #14) — phone number collection needs documented legal basis (consent vs legitimate interest) before commercial launch. Needs a lawyer.
- [ ] **Multiple concurrent active polls** (issue #22) — support discovery/browsing of multiple active polls instead of funneling to single active poll.
- [ ] **Poll topic suggestion form** (issue #23) — add lightweight form for users to suggest poll topics.
- [ ] **Email/RSS digest** (issue #24) — opt-in notification (email or RSS feed) for new polls and results.
- [ ] **Embeddable results widget** (issue #26) — iframe-friendly results view for media embed distribution.
- [ ] **Surface methodology** (issue #27) — make poll topic selection process and cadence more prominent on /o-projekte (not just in FAQ).
- [ ] **Display site-wide vote count** (issue #28) — show all-time total votes (across all polls) in addition to current poll count. Five placement options: below poll count, footer, header badge, results page, or /o-projekte. Decide on best placement and implement.

### Tooling

- [ ] **Fix computer-use screenshot capture** (issue #15) — Cowork returns blank screenshots, likely blocked by Razer overlay or DRM window. Investigate or disable overlay during capture.

### Bugs

- [ ] **Fix /kontakt form** (issue #17) — contact form is non-functional; either wire it up (POST to API + email via Resend/SendGrid) or remove it entirely to avoid displaying a broken form.

---

## In Progress (Testing)

- **Issue #20** — Question-first voting flow (Krok 1: preview → Krok 2: demographics → Vote)
  - Created PollPreview component showing poll question + options (read-only)
  - Changed initial step from 'gate' to 'preview'
  - Updated DemographicGate to show "Krok 2 z 2" with back button
  - Status: Awaiting testing before closing

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
- Fixed previous-polls "1970 date" bug (issue #18) — added null guard for `poll.ends_at` in `src/components/PreviousPolls.tsx`
- Fixed typo on /o-projekte (issue #19) — "nezboiera" → "nezbiera"
- Added vote count social proof to demographics gate (issue #21) — displays "X Slovákov sa vyjadrilo..." before age/gender selection
