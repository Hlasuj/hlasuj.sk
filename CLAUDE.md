@AGENTS.md

**hlasuj.sk** — anonymous Slovak polling app. Live at [hlasuj-sk.vercel.app](https://hlasuj-sk.vercel.app). No accounts, no cookies, no IP tracking — privacy is a core feature.

Always work from `C:\Users\Admin\hlasuj-sk`.

## Task Backlog

See [TASKS.md](./TASKS.md) for the full backlog — pending features, SEO improvements, code quality issues, and completed work.

## Pre-commit

Husky blocks commits if lint or tests fail. Order: `lint-staged` (ESLint --fix) → Prettier → `npm test`.

## Env Vars

Required in `.env.local` and Vercel dashboard:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `ADMIN_PASSWORD` — plain-text; hashed to SHA-256 for cookie comparison
- `CRON_SECRET` — random secret; Vercel sends it as `Authorization: Bearer <secret>` on cron invocations

**Local `.env.local` is currently missing** — `npm run build`/`npm run dev` fail locally without it, which forces every UI change to go through a full commit → push → wait for Vercel → test-on-phone cycle instead of local testing. Set this up (copy values from the Vercel dashboard) to cut iteration time and commit count dramatically on UI/UX work.

## Admin Auth

Hidden `⋯` menu → `POST /api/admin/login` → sets `admin_token` httpOnly cookie (`sha256(ADMIN_PASSWORD)`, 24h, `sameSite: strict`, timing-safe compare via `checkAdminAuth()` in `src/lib/auth.ts`).

## DB Schema

- **`polls`** — `id`, `question`, `active`, `collect_phone`, `starts_at`, `ends_at`, `phone_retention_days`, `created_at`
- **`poll_options`** — `id`, `poll_id`, `text`, `position`
- **`votes`** — `poll_id`, `option_id`, `timestamp`, `country`, `device_type`, `browser_lang`, `age_group`, `gender`, `phone`, `phone_consent_at`

## Cron Jobs

`GET /api/cron/cleanup-phones` — runs daily at 02:00 UTC (configured in `vercel.json`). Finds polls where `ends_at + phone_retention_days` (default 30) is in the past and sets `phone = null` on all votes for those polls. Protected by `Authorization: Bearer <CRON_SECRET>` header.

## Next.js 16 Gotchas

- `cookies()`, `headers()`, `params`, `searchParams` must be awaited — sync access removed
- `middleware.ts` → `proxy.ts`; export must be named `proxy`
- `next build` no longer runs ESLint — use `npm run lint`

## Known Issues

- `src/app/page.tsx` is ~800 lines (entire voter UI + admin shell in one client component). Split if it grows.
- `GET /api/votes` has no pagination.
- `PUT /api/polls/[id]` with `options` does full delete-and-reinsert — option IDs change on every save.
- Admin cookie is `sha256(ADMIN_PASSWORD)` — acceptable for low-stakes panel, not for sensitive data.

## Available Skills

- /commit — format → optional optimize → commit message → push → optional frontend test
- /test — run unit tests or write them if none exist
- /frontend-test — browser test the live site using Claude in Chrome
- /optimize — performance, bundle size, and code quality fixes
- /format — Prettier + ESLint auto-fix

## Global Issue Management Skills

Three reusable global skills for managing GitHub issues across any project:

- **critical-review** — Visit live site, identify issues/bugs/UX improvements, create GitHub issues with implementation prompts (manual trigger)
- **batch-create-issues** — Create multiple GitHub issues at once with descriptions and implementation prompts (manual trigger)
- **close-issue** — Close a GitHub issue and update TASKS.md completion tracking (**proactive** — I do this automatically when you mention an issue is done)

See `.claude/skills/README.md` for detailed usage and template prompts.

### When to use

- **critical-review**: After launch or during planning to capture all issues in one pass
- **batch-create-issues**: You have a list of issues ready to file; create them all at once
- **close-issue**: An issue is implemented and tested; mention it and I'll close the issue + update TASKS.md

### Proactive authorization

You've authorized me to use **close-issue** proactively: when you say "issue #17 is done" or "we fixed the contact form", I will automatically close the issue and update TASKS.md without asking.

## Workflow for Feature Development

**For UX/feature issues: Discuss approach BEFORE implementing**

1. **Discovery** — Clarify the problem and desired outcome
2. **Options** — Present 2-3 approaches with pros/cons for each
3. **Recommendation** — Suggest best approach (with reasoning)
4. **Approval** — Get user feedback and pick direction together
5. **Implementation** — Build with full context and alignment
6. **Testing** — User tests before closing issue

This prevents rework and ensures we build the right thing. For simple bug fixes (typos, null guards), proceed directly to implementation.

## Commit Hygiene

- **Don't split a fix and its TASKS.md/issue-close update into two commits** unless real time passed between them (e.g. user asked to test first). If I'm marking something done in the same turn as the code change, fold both into one commit.
- **Create the GitHub issue before referencing its number in a commit message**, not after — don't guess/reserve numbers.
- Prefer testing locally (see Env Vars above) over push-to-Vercel-to-test cycles; each such cycle tends to produce its own commit even for a one-line tweak.

## Agent Behavior

After every task, always give a code change summary the user can learn from:

- What was changed and where (file + what specifically)
- Show the key code change — a short before/after snippet or the most important new code block
- Why it was done that way — the reasoning, not just the outcome
- What problem it solves or what it improves
- Any SQL migrations, env vars, or manual steps needed
  The goal is that the user walks away understanding the code better, not just knowing it was done.
