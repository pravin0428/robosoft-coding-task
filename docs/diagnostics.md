# Written diagnostic answers

Three questions from the assignment, answered directly.

---

## 1. This page is largely static/reference data that rarely changes intraday. Would you render it via SSR, SSG/ISR, or CSR in Next.js, and why?

**SSG with ISR** for the strategy content, with a small client-side island for
the calculator. Not CSR, and not per-request SSR by default.

- The strategy content (name, fund manager, inception date, benchmark, returns,
  holdings) is public reference data that changes at most daily. Rendering it
  ahead of time gives the fastest TTFB, a CDN-cacheable HTML response, good
  SEO/social previews, and no loading skeleton on first paint.
- **ISR** keeps that build-time benefit while letting the page refresh after a
  revalidation window (`export const revalidate = 3600`, or tag-based
  `revalidateTag` when a backend job publishes new returns). Users get a static
  response and the data is never more than one window stale.
- **SSR** only becomes right when the output is per-request or per-user
  (personalized portfolio value, entitlements, geo-pricing) or when freshness
  must be tighter than the revalidation window — at the cost of a server render
  on every hit.
- **CSR** is the wrong default here: the page is content/SEO-bearing reference
  data, so client fetching delays first meaningful paint, adds a loading state,
  and leaves crawlers with little to index. CSR is justified only for the small
  interactive part that depends on user input.

**How this project applies it.** The detail page is a React Server Component; it
calls `getStrategyBySlug()` directly (no self-fetch) and renders the static
content on the server. Only `FeeCalculator` is a Client Component (`"use client"`),
holding its two inputs in local state and recomputing the breakdown on change —
the interactive island the points above argue for.

Because Next.js 16 enables Cache Components and this is a dynamic `[slug]` route
whose value is unknown at build time, the page opts into blocking render with
`export const instant = false` rather than emitting a partial static shell.
Unknown slugs are rejected with a real HTTP 404 upstream in `src/proxy.ts` before
render. With a real backend the same page would declare `generateStaticParams`
for known slugs and lean fully on ISR; the calculator would not change.

## 2. If two users could somehow trigger an update to the same strategy entry at the same time (e.g. via an admin panel), what could go wrong, and how would you prevent it?

**Note:** this project has no database, admin panel, or write endpoint — the
sample data is read-only and in-memory. This answer is about how concurrency
would be handled once writes exist.

**What can go wrong**

- **Lost update:** both admins load the same record, both submit; the second
  write silently overwrites the first, and the first admin believes their change
  was saved.
- **Dirty/partial writes:** one request updates returns while another updates
  holdings; without a transaction a reader can observe a half-applied state.
- **Stale read-modify-write:** a value is recomputed from a row that is already
  outdated by the time the write lands.
- **Conflicting invariants:** two edits each pass validation independently but
  together push allocation sums or required fields out of range.
- **No accountability:** without timestamps/actors you cannot tell which change
  won or why.

**How to prevent it**

1. **Optimistic concurrency control** — add a `version` (or `updated_at`)
   column. The client sends the version it read; the write is
   `UPDATE strategies SET ..., version = version + 1 WHERE id = $1 AND version = $2`.
   Zero rows updated means someone else changed the row → return `409 Conflict`
   and have the admin reload/re-merge. Cheapest fix; holds no locks.
2. **Transactions with row locks** for multi-table edits (strategy + holdings):
   `BEGIN; SELECT ... FOR UPDATE; ... COMMIT;` so related writes are atomic.
3. **HTTP-level equivalents** — `ETag` + `If-Match` on PATCH/PUT returning
   `412 Precondition Failed` on mismatch; an `Idempotency-Key` so a network
   retry cannot double-apply a write.
4. **Validation and constraints in the database**, not only the UI (allocation
   ranges, required fields, uniqueness of slug).
5. **Audit log / events** (who changed what, before/after) so conflicts are
   diagnosable and recoverable.

## 3. As this page and calculator grow more complex over time, what state-management approach would you reach for (Context, Redux Toolkit, Zustand, React Query, etc.) and why?

**Start with the smallest thing that fits the shape of the state, and add a
library only when a specific pain appears.** The key distinction is server/cache
state versus local UI state — they have different tools.

- **Now:** the page splits cleanly into (a) server data and (b) local UI state.
  Server data is read and rendered by React Server Components through the
  service layer; the calculator owns two local values (`amountRaw`, `years`) in
  `useState` and derives the breakdown on render. That is sufficient, so no
  global store is warranted. If the calculator inputs should survive reloads or
  be shareable, move them into URL search params — free state with back/forward
  support.
- **Next step — server/cache state:** when data becomes client-fetched (live
  returns, polling, mutations with optimistic updates), reach for **TanStack
  Query** (or SWR). It handles caching, deduplication, background refetch,
  retries and invalidation — problems a client state library does not solve.
- **Next step — client-only shared state:** if several sibling components need
  the same non-server state (wizard steps, a comparison basket, filters),
  **Zustand** fits well: tiny API, selector-based re-renders, no provider tree.
  Context is fine for low-frequency dependency injection (theme, locale, auth
  user) but causes broad re-renders and provider nesting when used as a general
  store.
- **Redux Toolkit** earns its cost only with many interacting flows, strict
  action/event semantics, time-travel debugging, large teams, or middleware
  requirements. For a single page with one calculator it would be
  over-engineering.

**Rule of thumb:** React Server Components + the service layer for server data,
TanStack Query when server state becomes client-side, URL params for shareable
state, local `useState` for the calculator, Context for static injection,
Zustand when client state genuinely becomes shared and complex, and Redux
Toolkit only when application complexity justifies it.
