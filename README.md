# CoSTAR Network Events Calendar

Embeddable, static events calendar for costarnetwork.co.uk, with a
companion admin interface for adding/editing event data without a
code change or deploy.

## Contents

| File | Purpose |
|---|---|
| `index.html` | Public calendar — embedded via `<iframe>` on the main site |
| `admin.html` | Staff interface for event/tag CRUD |
| `events.json` | Event data store |
| `tags.json` | Tag suggestion catalog (not the source of truth for which tags exist — see `ARCHITECTURE.md`) |
| `ARCHITECTURE.md` | How this works internally: data flow, rendering logic, design rationale |
| `SECURITY.md` | Threat model and mitigations |

## Summary
This is implemented as
a fully static, dependency-free site on GitHub Pages with intention of embedding via `<iframe>`.

There is no server and no database. "Backend" functionality (adding,
editing, deleting events and tags) is implemented by `admin.html` running
entirely client-side and committing directly to this repository's
`events.json`/`tags.json` via the GitHub REST API, authenticated with a
user-supplied GitHub personal access token. No user accounts or roles — 
a single GitHub PAT (per user) is the only access control.

## Configuration required before deploying to a new repo

| File | Constant(s) | Notes |
|---|---|---|
| `admin.html` | `REPO_OWNER`, `REPO_NAME`, `BRANCH` (top of `<script>`) | Target for the GitHub Contents API reads/writes |
| `index.html` | `--accent`, `--font` (`:root` in `<style>`) | Currently placeholder values pending final brand spec |
| `index.html` + `admin.html` | `LAB_COLOURS` | Fixed lab → colour map; update if lab names/count change |

## Deployment

Standard static GitHub Pages deployment:

1. Push this repo's contents to the target GitHub repository (public, or
   a plan supporting Pages on private repos).
2. **Settings → Pages** → Deploy from branch → `main` / root.
3. Confirm `events.json` and `tags.json` exist at the repo root — `tags.json`
   will be created automatically by `admin.html` on its first write if
   missing (see `ARCHITECTURE.md`).
4. Embed the deployed `index.html` URL via `<iframe>` in the target
   Storyblok component. Event links use `target="_top"`, which is required
   for them to navigate the parent page rather than the iframe — don't
   strip it.

Each admin save is a real git commit to `main`. GitHub Pages rebuilds on
push (typically under a minute; no SLA). `admin.html`'s own views re-fetch
with `cache: "no-store"` and reflect a commit immediately; the public
`index.html` reflects a commit once Pages has finished rebuilding.

## Data model

Full schema, rationale, and the tags.json/events.json relationship are in
`ARCHITECTURE.md`. Summary:

```jsonc
// events.json — array of:
{
  "id": "string, unique",
  "title": "string",
  "date": "YYYY-MM-DD",          // mutually exclusive with startDate/endDate
  "startDate": "YYYY-MM-DD",
  "endDate": "YYYY-MM-DD",
  "tags": ["string", "..."],
  "lab": "string — one of the six keys in LAB_COLOURS, or \"\"",
  "url": "absolute https URL"
}
```

```jsonc
// tags.json — flat array of tag name strings
["Networking", "Hackathon", "..."]
```

## Known limitations / suggested follow-ups

- No automated test suite.
- No build step, by design — zero dependencies, fully self-contained
  files. Revisit if complexity grows enough to warrant one.
- PAT-in-the-browser auth is appropriate for current scope; see
  `SECURITY.md` for the trade-off and the recommended alternative if that
  scope changes.
- `id` generation (`Date.now()` + `Math.random()`) is not cryptographically
  unique — fine at current volumes, consider `crypto.randomUUID()` if this
  pattern is reused somewhere collision-sensitive.
- No pagination in either the calendar or the admin list — fine at
  expected volumes, would need revisiting at scale.
- Tag rename/delete writes `events.json` then `tags.json` as two separate
  commits, not a transaction. A failure between the two leaves them
  briefly inconsistent; self-healing on next read (see `ARCHITECTURE.md`),
  not a correctness bug, but worth knowing if debugging.
