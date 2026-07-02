@AGENTS.md

**hlasuj.sk** — anonymous Slovak polling app. Live at [hlasuj-sk.vercel.app](https://hlasuj-sk.vercel.app). No accounts, no cookies, no IP tracking — privacy is a core feature.

Always work from `C:\Users\Admin\hlasuj-sk`.

## Task Backlog

See [TASKS.md](./TASKS.md) for the full backlog — pending + completed work, cross-referenced to GitHub issues.

## Local Dev

`.env.local` is set up and working — `npm run dev` / `npm run build` / `npm test` all run locally against real Supabase data. Vars: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `ADMIN_PASSWORD`, `CRON_SECRET`.

These are marked **Sensitive** in Vercel, so `vercel env pull` won't fetch them (Vercel blocks sensitive vars from syncing to the Development environment). If `.env.local` is ever lost, re-enter values manually — pulling won't work.

Husky pre-commit: `lint-staged` (ESLint --fix) → Prettier → `npm test`. Blocks commit on failure.

## Admin Auth

Hidden `⋯` menu in the voter header (`VoterPoll`, `src/app/page.tsx`) → `POST /api/admin/login` → sets `admin_token` httpOnly cookie (`sha256(ADMIN_PASSWORD)`, 24h, `sameSite: strict`, timing-safe compare via `checkAdminAuth()` in `src/lib/auth.ts`). Whether this should stay reachable from the public voter UI is an open question — issue #29.

## DB Schema

- **`polls`** — `id`, `question`, `active`, `collect_phone`, `starts_at`, `ends_at`, `phone_retention_days`, `created_at`
- **`poll_options`** — `id`, `poll_id`, `text`, `position`
- **`votes`** — `poll_id`, `option_id`, `timestamp`, `country`, `device_type`, `browser_lang`, `age_group`, `gender`, `phone`, `phone_consent_at`

## Cron Jobs

`GET /api/cron/cleanup-phones` — daily at 02:00 UTC (`vercel.json`). Nulls `phone` on votes where `ends_at + phone_retention_days` (default 30) has passed. Protected by `Authorization: Bearer <CRON_SECRET>`.

## Next.js 16 Gotchas

- `cookies()`, `headers()`, `params`, `searchParams` must be awaited
- `middleware.ts` → `proxy.ts`; export must be named `proxy`
- `next build` no longer runs ESLint — use `npm run lint`

## Known Issues

(full list + issue numbers in TASKS.md)

- `src/app/page.tsx` is ~2200 lines — entire voter UI + admin shell in one client component. Split if touching it gets painful. Issue #10.
- `GET /api/votes` has no pagination. Issue #11.
- `PUT /api/polls/[id]` does full delete-and-reinsert on options — IDs churn every save. Issue #12.
- Admin cookie is `sha256(ADMIN_PASSWORD)` — fine for a low-stakes single-operator panel, not for sensitive data.

## Skills

- `/commit`, `/test`, `/frontend-test`, `/optimize`, `/format` — see individual skill files
- **critical-review**, **batch-create-issues**, **close-issue** — global GitHub issue workflow skills, see `.claude/skills/README.md`
- **close-issue runs proactively**: mention an issue is done and I'll close it + update TASKS.md without asking — unless you've said you want to test first for that specific issue, in which case wait for explicit confirmation

## Workflow

- **UX/feature work**: discuss approach first — options + tradeoffs + a recommendation — before implementing. Skip this for trivial fixes (typos, null guards).
- **Commits**: don't split a fix and its TASKS.md/issue-close update into two commits unless real time passed between them. Create GitHub issues before referencing their number in a commit message.
- Test locally (`npm run dev`) before pushing — avoid push-to-Vercel-to-test cycles, they burn commits.

## Agent Behavior

After every task, give a code change summary: what changed + where, the key snippet, why this approach, what it fixes, any migrations/env vars/manual steps needed. Goal: the user understands the code better, not just that it was done.
