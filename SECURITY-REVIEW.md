# Security Review — hlasuj.sk

**Date:** 2026-06-05  
**Scope:** Next.js 16 / Supabase app, deployed on Vercel  
**Files reviewed:** `src/app/page.tsx`, `src/app/api/polls/route.ts`, `src/app/api/polls/[id]/route.ts`, `src/app/api/vote/route.ts`, `src/app/api/votes/route.ts`, `src/lib/supabase.ts`

---

## CRITICAL

### C1 — Admin password hardcoded in client-side bundle

**File:** `src/app/page.tsx:4`

```ts
const ADMIN_PASSWORD = 'sp2024admin';
```

The file is marked `"use client"`, so this constant is shipped verbatim in the JavaScript bundle served to every visitor. Anyone can open DevTools → Sources, search for `ADMIN_PASSWORD`, and see it in seconds. The password also appears to be weak and guessable.

**Fix:** Move admin auth to the server. Options in increasing robustness:

1. Add a password-check API route (`POST /api/admin/auth`) that compares against `process.env.ADMIN_PASSWORD` (server-only env var, no `NEXT_PUBLIC_` prefix) and returns a short-lived signed JWT or sets an `httpOnly` cookie.
2. Use Supabase Auth — create an admin user, log in via `supabase.auth.signInWithPassword()`, and protect all admin API routes by verifying the session server-side.

---

### C2 — Admin-mutating API routes have zero authentication

**Files:** `src/app/api/polls/route.ts` (POST), `src/app/api/polls/[id]/route.ts` (PUT, DELETE)

Anyone on the internet can:

```bash
# Create a poll
curl -X POST https://hlasuj-sk.vercel.app/api/polls \
  -H "Content-Type: application/json" \
  -d '{"question":"Hacked","options":["Yes","No"],"active":true}'

# Delete every poll
curl -X DELETE https://hlasuj-sk.vercel.app/api/polls/<id>
```

No token, no cookie, no IP check — nothing. This is a complete admin bypass.

**Fix:** All state-mutating routes (POST/PUT/DELETE on `/api/polls`) must verify a server-side credential before proceeding. The simplest approach: check for a signed session cookie set by C1's fix. With Supabase Auth, call `supabase.auth.getUser()` from the request headers and return 401 if no valid admin session.

---

## HIGH

### H1 — All vote data publicly readable, including demographic breakdowns

**File:** `src/app/api/votes/route.ts`

`GET /api/votes` returns every vote record — timestamp, country, device, age group, gender — to any unauthenticated caller. This is loaded on page init for every visitor:

```ts
fetch('/api/votes').then((r) => r.json()); // page.tsx:540
```

Even without phone numbers, the combination of age + gender + timestamp + country is quasi-identifying and constitutes personal data under GDPR.

**Fix:** Either (a) restrict this endpoint to authenticated admin sessions, or (b) only return aggregated counts per option, never raw rows, for public consumers. The admin dashboard should call a separate, authenticated endpoint for raw data.

### H2 — Phone numbers stored with no server-side `collect_phone` guard

**File:** `src/app/api/vote/route.ts`

The vote API inserts `phone` unconditionally:

```ts
phone: phone || null,
```

Whether or not the poll has `collect_phone: true` is only enforced in the UI. A direct API call can store a phone number against any poll, regardless of whether that poll was configured to collect it. If someone enumerates poll IDs, they can associate phone numbers with any poll.

**Fix:** In the vote API route, look up the poll record and check `collect_phone === true` before persisting the phone field. Reject or nullify phone if the poll doesn't have it enabled.

### H3 — No vote rate limiting / duplicate prevention

**File:** `src/app/api/vote/route.ts`

`POST /api/vote` accepts unlimited submissions with no deduplication. A script can trivially flood a poll:

```bash
for i in $(seq 1 10000); do
  curl -s -X POST https://hlasuj-sk.vercel.app/api/vote \
    -H "Content-Type: application/json" \
    -d '{"poll_id":"...","option_id":"..."}' &
done
```

This corrupts all results and any demographic analysis.

**Fix:**

- Add Vercel rate limiting on `/api/vote` (via `vercel.json` or middleware).
- Alternatively, use a short-lived browser fingerprint cookie or localStorage flag to soft-prevent repeat votes from the same device.
- For stronger protection: require a signed token issued at page load (keyed to a session UUID) that can only be redeemed once.

### H4 — No input validation on vote submission

**File:** `src/app/api/vote/route.ts`

The route inserts all body fields without validation:

- `poll_id` / `option_id` — not checked to be valid UUIDs or to exist in the database
- `country`, `device_type`, `browser_lang` — not validated against allowed values
- `age_group`, `gender` — free strings, not validated against enum lists
- `phone` — no format validation

Anyone can insert garbage data: `{"poll_id": null, "option_id": "'; DROP TABLE votes;--"}`. Supabase uses parameterized queries so SQL injection is blocked, but semantic corruption is not.

**Fix:** Validate all fields server-side before insert. At minimum: assert `poll_id` and `option_id` are UUIDs, verify `option_id` belongs to `poll_id` (a DB lookup), and validate enum fields against fixed lists.

---

## MEDIUM

### M1 — Supabase anon key is used for all server-side operations

**All API route files**

Every API route (including admin mutations) uses `NEXT_PUBLIC_SUPABASE_ANON_KEY`. This key is:

1. Intended for client-side use with RLS enforcement
2. Already exposed in the browser bundle (by the `NEXT_PUBLIC_` prefix convention)

Admin write operations should use `SUPABASE_SERVICE_ROLE_KEY` (server-only env var) to bypass RLS for privileged operations, while RLS enforces read restrictions on the anon key. Currently there's no separation — everything relies on the anon key, so RLS is the only defense layer, and its configuration is unknown from the codebase alone.

**Action required:** Verify RLS is enabled on all tables (`polls`, `poll_options`, `votes`) in the Supabase dashboard. At minimum:

- `votes`: anon can INSERT, cannot SELECT (public voting, private results)
- `polls`: anon can SELECT active polls only; cannot INSERT/UPDATE/DELETE
- `poll_options`: anon can SELECT; cannot modify

### M2 — Raw Supabase error messages returned to clients

**All API route files**

```ts
return NextResponse.json({ error: error.message }, { status: 500 });
```

Supabase errors can include table names, column names, constraint names, and query fragments. This helps attackers map the database schema.

**Fix:** Log the full error server-side (`console.error(error)`) and return a generic message to the client: `{ error: "Internal server error" }`.

### M3 — No CSRF protection on state-mutating routes

The API routes set no `SameSite` cookie requirements and perform no origin checking. If admin auth is added via cookies (C1 fix), CSRF tokens or `SameSite=Strict` cookies will be needed to prevent cross-site request forgery against the admin session.

**Fix:** When implementing the auth cookie (C1 fix), set `SameSite=Strict; HttpOnly; Secure`. Also consider checking the `Origin` header in mutation routes.

### M4 — No input length limits on poll content

**File:** `src/app/api/polls/route.ts`

`question` and option `text` fields have no server-side length cap. An attacker can insert megabyte-sized strings, bloating the database and causing downstream rendering issues.

**Fix:** Cap `question` at e.g. 500 chars and each option at 200 chars. Return 400 if exceeded.

---

## LOW

### L1 — `dangerouslySetInnerHTML` for CSS

**File:** `src/app/page.tsx:91`

```tsx
<style dangerouslySetInnerHTML={{ __html: cssStyles }} />
```

The `cssStyles` string is currently static and hardcoded, so there's no active XSS here. But the pattern suppresses React's XSS protection. If `cssStyles` ever interpolates user-controlled data (e.g. a theme color from a URL param), it becomes an injection point.

**Fix:** Since the styles are static, use a plain `<style>` tag via a module or move to CSS Modules / Tailwind classes. Avoid `dangerouslySetInnerHTML` as a habit.

### L2 — Dead code ships to client (mock data)

**File:** `src/app/page.tsx:8-27`

```ts
const INITIAL_POLLS = [...]
const MOCK_VOTES: Vote[] = [...]
```

These constants are unused now that the real API is wired up, but they ship in the bundle. More importantly, `INITIAL_POLLS` contains hardcoded poll IDs (`"p1"`, `"p2"`) that differ from real DB UUIDs — if any code path ever falls back to them, logic breaks silently.

**Fix:** Delete the constants.

### L3 — No `Content-Security-Policy` header

The app fetches from Google Fonts (`fonts.googleapis.com`) inline in the CSS string. Without a CSP header, there's no protection against injected scripts or unauthorized resource loads.

**Fix:** Add a CSP via `next.config.ts` headers or a Vercel `vercel.json` headers block.

### L4 — `collect_phone` UI claims anonymity while collecting PII

**File:** `src/app/page.tsx:154-156`

```tsx
<p>
  Vaše odpovede sú <strong>úplne anonymné</strong>. Nezbierame IP adresy ani
  cookies.
</p>
```

The demographic gate tells users responses are "completely anonymous," but the app can collect phone numbers. Phone numbers are directly identifying personal data under GDPR. This is a privacy/legal risk independent of the technical security posture.

**Fix:** Update the anonymity claim to be conditional — only show it on polls that don't collect phone numbers. Add a clear GDPR disclosure when `collect_phone` is true.

---

## Summary Table

| ID  | Severity     | Issue                                                 | Effort to fix     |
| --- | ------------ | ----------------------------------------------------- | ----------------- |
| C1  | **Critical** | Admin password in client JS bundle                    | Medium            |
| C2  | **Critical** | Admin API routes fully unauthenticated                | Medium            |
| H1  | **High**     | All raw vote data publicly readable                   | Low               |
| H2  | **High**     | Phone stored regardless of poll config                | Low               |
| H3  | **High**     | No rate limiting on vote submission                   | Medium            |
| H4  | **High**     | No server-side input validation on votes              | Low               |
| M1  | **Medium**   | Anon key used for admin ops; RLS status unknown       | Low (verify)      |
| M2  | **Medium**   | Raw DB errors exposed to clients                      | Low               |
| M3  | **Medium**   | No CSRF protection                                    | Low (with C1 fix) |
| M4  | **Medium**   | No input length limits                                | Low               |
| L1  | Low          | `dangerouslySetInnerHTML` for CSS                     | Low               |
| L2  | Low          | Dead mock data in bundle                              | Trivial           |
| L3  | Low          | No Content-Security-Policy header                     | Low               |
| L4  | Low          | Privacy disclosure inconsistent with phone collection | Low               |

## Recommended fix order

1. **C1 + C2 together** — move auth server-side and gate all admin routes. This is the highest-risk gap and is foundational for M3.
2. **H1** — restrict `/api/votes` to authenticated admin.
3. **H4** — add input validation to `/api/vote`. Low effort, high value.
4. **H2** — server-side `collect_phone` guard.
5. **M1** — verify RLS in Supabase dashboard; add service role key for admin routes once C1/C2 are done.
6. **H3** — rate limiting (easiest via Vercel config).
7. Everything else in order of effort.
