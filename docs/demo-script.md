# 2–3 minute demo script

Total target: ~2:45.

## 0:00 — Context (15s)

> "This is a Next.js App Router strategy detail page built for the assignment.
> All data is fictional. I'll show the page, the required summary API, the
> 404 behaviour, and the fee calculator."

## 0:15 — Home + detail page (30s)

1. Open `http://localhost:3000/` → one fictional strategy.
2. Click it (or open `/strategy/meridian-bluechip-growth`).
3. Point out: strategy name, fund manager, inception date, benchmark, minimum
   investment.
4. Scroll: trailing returns table with 1Y / 3Y / 5Y / Since Inception, strategy
   vs benchmark and the difference column.
5. Top five holdings with allocation bars and percentages.

## 0:45 — Responsiveness (15s)

Resize the browser to a phone width. The meta grid collapses to a single
column, cards stack, and the returns table scrolls horizontally instead of
breaking the layout.

## 1:00 — Required summary API (30s)

```powershell
Invoke-WebRequest http://localhost:3000/api/strategies/meridian-bluechip-growth/summary -UseBasicParsing |
  Select-Object -Expand Content
```

Call out: name, fund manager, minimum investment, all four trailing-return
periods, and exactly three holdings sorted by allocation descending — no
inception date or benchmark.

Then show the full-detail endpoint:

```powershell
Invoke-WebRequest http://localhost:3000/api/strategies/meridian-bluechip-growth -UseBasicParsing |
  Select-Object -Expand Content
```

> "The page needs inception date, benchmark and five holdings, so I added this
> one extra read-only endpoint. Both routes call the same service over the same
> sample-data module — no duplicated data or logic."

## 1:30 — 404 handling (20s)

```powershell
Invoke-WebRequest http://localhost:3000/api/strategies/does-not-exist/summary -UseBasicParsing
```

Shows HTTP 404 with the friendly JSON error. Also open
`/strategy/does-not-exist` in the browser to show that the page route returns a
real HTTP 404 (handled early by `src/proxy.ts`).

## 1:50 — Fee calculator (40s)

1. Enter `100000` → breakdown appears instantly.
2. Change holding period to `3 years` → gross/management fee/net update without
   a button.
3. Point out the formula assumptions on screen: 2% annual management fee, 1%
   exit load below one year, 1Y return used as the annual rate.
4. Validation: clear the field (required), type `abc` (numeric error), `-5`
   (negative), `0` (must be greater than zero). Errors show inline and the
   breakdown is withheld.
5. Note: with the required 1/3/5/10 dropdown the exit load is always ₹0; the
   below-one-year branch is covered by a unit test at 0.5 years.

## 2:30 — Code quality (15s)

```powershell
npm test
```

Shows 18 passing tests: fee math (including the <1 year exit-load branch),
validation, and summary transformation (3 holdings, descending, fields dropped,
no mutation of source data).

> "Data lives in one module, a service layer shapes responses, route handlers
> are thin, and the calculator math is a pure module. Thanks."
