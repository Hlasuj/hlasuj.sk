/**
 * Creates all hlasuj.sk backlog issues on GitHub.
 * Usage: node scripts/create-github-issues.js <GITHUB_PAT>
 *
 * Get a PAT at: https://github.com/settings/tokens/new
 * Required scope: repo (or just "Issues: Read & Write" with fine-grained token)
 */

const [, , TOKEN] = process.argv;
if (!TOKEN) {
  console.error('Usage: node scripts/create-github-issues.js <GITHUB_PAT>');
  process.exit(1);
}

const REPO = 'SuperGrassX/hlasuj.sk';
const API = `https://api.github.com/repos/${REPO}/issues`;

const issues = [
  // ── SEO ──────────────────────────────────────────────────────────────────
  {
    title: 'feat(seo): server-side render homepage poll content',
    labels: ['seo', 'enhancement'],
    body: `## Problem
\`src/app/page.tsx\` is a \`'use client'\` component, so Google sees only \`Načítavam...\` (Loading...) in the initial HTML. The actual poll question and options load via JavaScript after the first render. This means:
- Googlebot cannot index the current poll question
- LCP (Largest Contentful Paint) is delayed until JS loads
- The page gets deprioritised in crawl queue

## Solution
Convert the homepage to a hybrid RSC + Client Component pattern:
1. Create a Server Component (e.g. \`src/app/page.tsx\`) that fetches the active poll from Supabase on the server
2. Pass the data as props to a \`<VoterUI />\` Client Component that handles voting interactivity
3. Keep the admin shell as a separate lazy-loaded client component

## Files to touch
- \`src/app/page.tsx\` — split into server shell + client children
- \`src/components/VoterUI.tsx\` — new file, extracted voter UI
- \`src/components/AdminShell.tsx\` — new file, extracted admin UI

## Prompt for Claude
\`\`\`
Convert src/app/page.tsx to use server-side rendering for the initial poll content.
Fetch the active poll from Supabase in a server component and pass it as props to a
<VoterUI /> client component for voting interactivity. Extract the admin panel into
a separate <AdminShell /> client component. The page should render the full poll
question and options in the initial HTML — verify with curl or view-source.
Keep all existing behavior identical after the refactor.
\`\`\``,
  },
  {
    title: 'feat(seo): add Schema.org JSON-LD structured data',
    labels: ['seo', 'enhancement'],
    body: `## Problem
No structured data on any page. Google cannot determine the site's purpose, organisation, or searchable content from machine-readable markup.

## Solution
Add JSON-LD to \`src/app/layout.tsx\`:
- \`WebSite\` schema with \`SearchAction\` — unlocks sitelinks search box in Google results
- \`Organization\` schema with name, url, description, and logo

## Example
\`\`\`tsx
<Script id="schema-org" type="application/ld+json" strategy="beforeInteractive">
  {JSON.stringify({
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "url": "https://hlasuj.sk",
        "name": "hlasuj.sk",
        "potentialAction": {
          "@type": "SearchAction",
          "target": "https://hlasuj.sk/?q={search_term_string}",
          "query-input": "required name=search_term_string"
        }
      },
      {
        "@type": "Organization",
        "name": "hlasuj.sk",
        "url": "https://hlasuj.sk",
        "description": "Anonymná platforma pre slovenské ankety"
      }
    ]
  })}
</Script>
\`\`\`

## Prompt for Claude
\`\`\`
Add JSON-LD structured data to src/app/layout.tsx using next/script with
strategy="beforeInteractive". Include WebSite schema (with SearchAction for
sitelinks search box) and Organization schema. Use BASE_URL from the existing
constant. Validate with https://search.google.com/test/rich-results after deploy.
\`\`\``,
  },
  {
    title: 'chore: update BASE_URL to custom domain when hlasuj.sk is ready',
    labels: ['chore'],
    body: `## Problem
\`BASE_URL\` is hardcoded to \`https://hlasuj-sk.vercel.app\` in three files. Once the \`hlasuj.sk\` domain is live, all canonical URLs, sitemap entries, OG image URLs, and robots.txt sitemap pointer will be wrong.

## Files to update
| File | What changes |
|------|-------------|
| \`src/app/layout.tsx\` | \`const BASE_URL\` |
| \`src/app/robots.ts\` | sitemap URL |
| \`src/app/sitemap.ts\` | \`const BASE_URL\` |

## Prompt for Claude
\`\`\`
Update BASE_URL from 'https://hlasuj-sk.vercel.app' to 'https://hlasuj.sk' in:
- src/app/layout.tsx
- src/app/robots.ts
- src/app/sitemap.ts
Also add the custom domain in the Vercel project settings if not already done.
\`\`\``,
  },

  // ── Code Quality ─────────────────────────────────────────────────────────
  {
    title: 'fix: resolve pre-existing ESLint parse errors in subpage JSX',
    labels: ['bug', 'code quality'],
    body: `## Problem
ESLint fails on three files with \`Parsing error: JSX element 'p' has no corresponding closing tag\`. These are pre-existing errors caused by mojibake/encoding corruption from an old file save. They were never caught before because lint-staged only runs on staged files.

Currently all commits require \`--no-verify\` to bypass Husky, which means linting is skipped entirely.

## Affected files and lines
| File | Line | Error |
|------|------|-------|
| \`src/app/kontakt/page.tsx\` | ~183 | JSX element 'p' has no corresponding closing tag |
| \`src/app/o-projekte/page.tsx\` | ~108 | JSX element 'p' has no corresponding closing tag |
| \`src/app/ochrana-sukromia/page.tsx\` | ~161 | JSX element 'p' has no corresponding closing tag |

## Fix
Find the line with corrupted characters or a malformed JSX structure near the reported line, repair it, and verify \`npm run lint\` passes. After this fix, commits can drop \`--no-verify\`.

## Prompt for Claude
\`\`\`
Fix ESLint parse errors in three subpage files:
- src/app/kontakt/page.tsx (around line 183)
- src/app/o-projekte/page.tsx (around line 108)
- src/app/ochrana-sukromia/page.tsx (around line 161)

Run npm run lint to see the exact errors. Find and fix the corrupted JSX
(likely a malformed <p> tag or mojibake character). After fixing, verify
npm run lint passes with no errors, then commit without --no-verify.
\`\`\``,
  },
  {
    title: 'refactor: split src/app/page.tsx into separate voter and admin components',
    labels: ['code quality', 'refactor'],
    body: `## Problem
\`src/app/page.tsx\` is ~800 lines containing the entire voter UI and admin shell in a single client component. This makes it hard to maintain, test, and reason about. It should be split before it grows further.

## Plan
1. \`src/components/VoterUI.tsx\` — poll display, option selection, voting form, results
2. \`src/components/AdminShell.tsx\` — admin login, poll management, vote analytics
3. \`src/app/page.tsx\` — thin orchestrator that decides which to render

## Prompt for Claude
\`\`\`
Refactor src/app/page.tsx by extracting:
1. The voter UI (poll display, voting, results) into src/components/VoterUI.tsx
2. The admin panel into src/components/AdminShell.tsx
3. Keep src/app/page.tsx as a thin orchestrator

Ensure all existing behaviour is identical after the refactor. Run the app and
verify voting, results display, and admin login all still work.
\`\`\``,
  },
  {
    title: 'feat(api): add pagination to GET /api/votes',
    labels: ['enhancement', 'api'],
    body: `## Problem
\`GET /api/votes\` returns all votes with no limit. As vote counts grow this will be slow and potentially time out or OOM.

## Solution
Add offset-based pagination:
- Query params: \`?limit=100&offset=0\` (default limit 100)
- Response headers: \`X-Total-Count: <n>\`
- Update admin UI to handle paginated results

## Prompt for Claude
\`\`\`
Add pagination to GET /api/votes in src/app/api/votes/route.ts.
Add limit (default 100, max 1000) and offset (default 0) query params.
Return X-Total-Count header with the total number of votes.
Update the admin vote display in src/app/page.tsx to fetch paginated results
and show a load-more button or page controls.
\`\`\``,
  },
  {
    title: 'fix(api): upsert poll options instead of delete-and-reinsert on PUT',
    labels: ['bug', 'api'],
    body: `## Problem
\`PUT /api/polls/[id]\` with an \`options\` array does a full delete of all existing options and reinserts them. This means option IDs change on every save, which breaks:
- Vote → option_id foreign key references in analytics breakdowns
- Any external system that stores option IDs

## Solution
Upsert by position:
1. Load existing options for the poll
2. Match by position: update text if position exists, insert if new, delete if removed
3. Option IDs only change when options are genuinely added/removed

## Prompt for Claude
\`\`\`
Fix PUT /api/polls/[id] in src/app/api/polls/[id]/route.ts to upsert options
by position instead of delete-and-reinsert. Match existing options by their
position field, update text in place, insert new positions, and delete removed
ones. Verify that saving a poll with unchanged options does not create new
option IDs.
\`\`\``,
  },

  // ── Features ─────────────────────────────────────────────────────────────
  {
    title: 'feat: share poll results to Facebook, Instagram, TikTok',
    labels: ['enhancement', 'social'],
    body: `## Description
Add a share button to the voter UI that posts the current poll results to social networks. Targets: Facebook, Instagram, TikTok.

## UX
- Button appears after voting and on the results screen
- Triggers a share action (either direct API post via n8n webhook, or native share sheet)
- Should include poll question + result summary + link back to hlasuj.sk

## Dependencies
- n8n webhook endpoint (see related n8n pipeline issue)
- Social media accounts connected to n8n

## Prompt for Claude
\`\`\`
Add a "Zdieľať výsledky" (Share results) button to the voter UI in src/app/page.tsx.
The button should be visible after the user votes and on the results screen.
On click, POST to the n8n webhook (store URL in env var NEXT_PUBLIC_N8N_SHARE_WEBHOOK)
with payload: { question, options: [{text, votes, percent}], url }.
Show a loading state and success/error feedback. Add NEXT_PUBLIC_N8N_SHARE_WEBHOOK
to .env.local and Vercel dashboard.
\`\`\``,
  },
  {
    title: 'feat: n8n pipeline — auto-generate polls from Slovak media feeds',
    labels: ['enhancement', 'automation', 'n8n'],
    body: `## Description
An automated n8n workflow that monitors Slovak news, identifies trending topics, and auto-creates polls on hlasuj.sk with social media posts.

## Pipeline steps
1. **Scrape** — fetch RSS/API feeds from major Slovak news sites (SME, Denník N, Aktuality, Pravda, etc.) on a schedule (e.g. daily at 08:00)
2. **Analyse** — use AI (Claude or GPT) to compare articles, score by relevance and public interest, deduplicate similar topics
3. **Select** — pick top 2–3 topics that would make good poll questions
4. **Generate** — AI writes a neutral poll question + 3–5 answer options for each selected topic
5. **Create poll** — POST to \`/api/polls\` via hlasuj.sk admin API (protected by \`ADMIN_PASSWORD\`)
6. **Post to socials** — publish the poll to Facebook, Instagram, TikTok with generated caption + link

## Required hlasuj.sk API changes
- \`POST /api/polls\` must be accessible from n8n (add API key auth or use existing admin cookie flow)

## Prompt for Claude
\`\`\`
Help design and implement the n8n automation pipeline for hlasuj.sk.
Steps: (1) identify which Slovak news RSS feeds to scrape and how to fetch them,
(2) design the AI prompt for relevance scoring and topic selection,
(3) design the AI prompt for poll question + option generation,
(4) document the hlasuj.sk API calls needed (create poll, activate poll),
(5) outline the n8n workflow JSON structure (nodes, connections, credentials).
Also check if POST /api/polls in src/app/api/polls/route.ts supports external
calls or needs changes for n8n access.
\`\`\``,
  },
  {
    title: 'docs(legal): document GDPR legal basis for phone number collection',
    labels: ['legal', 'compliance'],
    body: `## Problem
\`hlasuj.sk\` collects phone numbers on selected polls. GDPR requires a documented legal basis for this collection before the platform can be used commercially.

## What needs to be in place
- Identified legal basis (most likely: consent, per Article 6(1)(a))
- Privacy notice updated to cover phone collection explicitly
- Retention policy documented and enforced (currently configurable per poll, default 30 days — cron job deletes after \`ends_at + phone_retention_days\`)
- Data Processor Agreement with Supabase (check if standard DPA covers this)

## Current state
- Consent checkbox exists in the UI with link to \`/ochrana-sukromia\`
- \`phone_consent_at\` is stored on the vote record
- Cron job at \`/api/cron/cleanup-phones\` runs daily and nulls out expired phone numbers
- Privacy page at \`/ochrana-sukromia\` exists but may need expansion

## Action required
Consult a lawyer before any commercial launch or marketing campaign that drives significant traffic.

## Prompt for Claude
\`\`\`
Review the current phone number collection flow on hlasuj.sk:
- src/app/page.tsx (consent checkbox UI)
- src/app/api/votes/route.ts (phone storage)
- src/app/api/cron/cleanup-phones/route.ts (retention enforcement)
- src/app/ochrana-sukromia/page.tsx (privacy page)

Identify any gaps in GDPR compliance (missing disclosures, incomplete consent flow,
retention policy not visible to users) and suggest concrete improvements to the
privacy page and consent flow. Do not give legal advice — flag items that need
lawyer review.
\`\`\``,
  },

  // ── Tooling ───────────────────────────────────────────────────────────────
  {
    title: 'chore(tooling): fix Cowork computer-use screenshot capture returning blank images',
    labels: ['tooling', 'bug'],
    body: `## Problem
When Cowork uses the computer-use MCP to take screenshots, the images come back blank or black. This blocks automated frontend testing and any UI verification workflows.

## Suspected cause
- Razer Synapse overlay rendering on top of the capture target
- A DRM-protected window in focus (e.g. video player) preventing screen capture
- GPU-accelerated window not being captured by the screenshot tool

## Investigation steps
1. Disable Razer Synapse / Chroma overlay temporarily and retry
2. Check if any DRM window (Netflix, Disney+, etc.) is open during capture
3. Try switching to \`windows-graphics-capture\` mode if available in the computer-use settings

## Prompt for Claude
\`\`\`
Take a screenshot using computer-use tools and check if the result is blank.
If blank, list all currently running applications and check if any are known
to block screen capture (Razer Synapse, any DRM video player, anti-cheat software).
Suggest a fix or workaround to get screenshots working in Cowork.
\`\`\``,
  },
];

async function createIssue(issue) {
  const res = await fetch(API, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${TOKEN}`,
      Accept: 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(issue),
  });

  const data = await res.json();
  if (res.ok) {
    console.log(`✅ #${data.number} — ${data.title}`);
    console.log(`   ${data.html_url}`);
  } else {
    console.error(`❌ Failed: ${data.message}`);
  }
  // Respect GitHub's secondary rate limit (avoid burst)
  await new Promise((r) => setTimeout(r, 1000));
}

(async () => {
  console.log(`Creating ${issues.length} issues on ${REPO}...\n`);
  for (const issue of issues) {
    await createIssue(issue);
  }
  console.log('\nDone.');
})();
