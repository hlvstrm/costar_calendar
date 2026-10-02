# Security

Threat model and mitigations for this calendar + admin system.

## Asset & trust summary

- **Confidentiality** — not a material concern. Event titles, dates,
  links, and tags are already public on the main site. No PII, no
  credentials, no payment data is stored anywhere in this system.
- **Integrity** — the actual concern. Anyone who can write to
  `events.json`/`tags.json` can inject or alter what visitors see and
  which links they're directed to.
- **Availability** — low concern. Static hosting (GitHub Pages) is highly
  available; the worst case for a bad write is a broken or empty calendar
  until reverted, not an outage affecting the main site.

## Trust boundary

The only privileged action in this system is a write to
`events.json`/`tags.json`, gated entirely by possession of a valid GitHub
PAT scoped to this repo's Contents (read/write). There is no additional
authorization layer, no roles, and no audit surface beyond GitHub's own
commit history.

## Mitigations implemented

1. **Output encoding.** Every event-derived string rendered into the DOM —
   title, tags, lab, formatted date, and the event `id` used in `data-*`
   attributes — is passed through `escapeHtml`/`escapeAttr` before
   insertion. This is the primary XSS control and covers both `index.html`
   and `admin.html`'s own rendering of event data. (The `id`-in-attribute
   case was found missing this during review and has been closed — see
   `ARCHITECTURE.md`.)
2. **URL scheme allow-list.** `admin.html` rejects any `url` not matching
   `/^https?:\/\//i` at submit time; `index.html` independently re-checks
   the same pattern before rendering the event-detail CTA as a real
   `<a href>`, falling back to an inert placeholder otherwise. This closes
   a `javascript:`-URI stored-XSS-via-click vector that would otherwise
   exist, since `url` is attacker-controllable data flowing into an `href`
   attribute.
3. **Destination-domain warning (non-blocking).** Saving an event whose
   `url` host isn't `costarnetwork.co.uk` (or a subdomain) prompts for
   confirmation, showing the actual destination host. This is a UX speed
   bump against a malicious or careless editor redirecting visitors to a
   lookalike/phishing page under a legitimate-looking event title — not a
   hard control. Deliberately non-blocking because off-site links
   (ticketing platforms, funder/partner pages) are an expected, valid use
   case. A one-line change to make this a hard allow-list instead, if the
   org's risk tolerance prefers that.
4. **Optimistic concurrency.** Every write is preceded by a fresh read of
   the target file's `sha`; a stale `sha` is rejected by GitHub (`409`)
   rather than silently overwritten, surfaced to the user as a retry
   prompt. Reduces, does not eliminate, lost-update races between
   concurrent admin sessions.
5. **No embedded secrets.** `admin.html` contains no credentials in
   source. The PAT is supplied by the user at runtime and persists only in
   `sessionStorage` (tab lifetime), never written to any file and never
   sent anywhere other than `api.github.com`.

## Known residual risks / explicitly out of scope

- **Client-side validation is not a security boundary.** Every check in
  `admin.html` — required fields, URL scheme, the domain warning — is
  bypassable by anyone calling the GitHub API directly with a valid token.
  The token itself is the actual control; see "Auth model" below.
- **Token exfiltration** (phishing, endpoint compromise, a shared or
  unlocked device) is not mitigated at the application layer and
  structurally can't be from client-side code alone — it's a process
  control (per-user tokens, short expiry, prompt revocation on loss or
  offboarding), not something fixable in this codebase.
- **No CSP.** GitHub Pages doesn't support custom response headers, so a
  `Content-Security-Policy` here would have to be a `<meta>` tag, with the
  attendant limitations (no `frame-ancestors`, no report-only mode). Not
  currently set. Reasonable defense-in-depth addition given output
  encoding is otherwise the sole XSS control.
- **No server-side rate limiting** beyond GitHub's own API limits (5,000
  req/hr for an authenticated PAT). Not expected to matter at current
  usage patterns.
- **Repo must be public** for free-tier GitHub Pages — both code and data
  are world-readable. Acceptable given the data is already public (see
  Asset summary); would not be acceptable if this pattern were reused for
  anything non-public without moving to a private repo + a paid Pages
  plan.
- **`id` fields are not cryptographically unique** (`Date.now()` +
  `Math.random()`). Negligible collision risk at expected event volumes;
  would want `crypto.randomUUID()` if this pattern is reused somewhere
  collision-sensitive.

## Auth model (current)

A GitHub fine-grained PAT, scoped to this one repo, Contents: Read/write
only, distributed per-user (not shared), with a set expiry. This is an
appropriate and proportionate control for the current scope — a small
internal editor group, public low-sensitivity content. It is explicitly
not intended as, and should not be read as, enterprise/SSO-grade access
control.

## If requirements change

If this is ever extended to handle anything more sensitive, or to a
larger or less-trusted group of editors, the PAT-in-the-browser pattern
should be replaced before scope expands: move the write path behind a
small server component (e.g. a Cloudflare Worker, a Lambda, or a GitHub
Actions `workflow_dispatch` trigger) holding a single repo-scoped
credential server-side, with editors authenticating to that component via
the org's existing identity provider (SSO/OAuth) rather than each holding
a direct GitHub credential. This is a meaningful architectural change, not
a config tweak — flagged here so it's a deliberate decision if/when it
becomes relevant, rather than a surprise.
