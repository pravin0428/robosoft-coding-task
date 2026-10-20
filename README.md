# Robosoft Strategy Detail — coding assignment

A responsive Next.js (App Router) strategy detail page and an interactive fee
calculator for a fictional investment strategy, plus the required summary API.

> **Sample-data disclaimer.** Every strategy name, fund manager, benchmark,
> holding, allocation and performance figure in this project is **fictional**.
> Nothing here describes a real fund, portfolio or performance, and nothing is
> financial advice.

## Project overview

The Strategy Detail page shows a snapshot of a single strategy (manager,
inception date, benchmark, minimum investment), its trailing returns versus a
benchmark, and its top five holdings. The interactive Fee Calculator lets a user
project the net value of an investment over 1, 3, 5 or 10 years and see a
breakdown of gross value, management fee, exit load and net value.

All information is served from one in-memory source of fictional sample data
through a small service layer, and the required summary endpoint exposes a
trimmed, contract-specific view of the same data.

## Features

- **Strategy snapshot** — name, fund manager, inception date, benchmark and
  minimum investment.
- **Trailing returns** — 1Y, 3Y, 5Y and Since Inception, with strategy returns,
  benchmark returns and the difference.
- **Top five holdings** — each with its allocation percentage and a visual bar.
- **Live fee calculator** — recalculates instantly on every amount or holding
  period change; no submit button.
- **Input validation** — inline, specific messages for empty, non-numeric,
  negative and zero amounts.
- **API error handling** — unknown strategy slugs return HTTP 404 with a clean
  JSON error body.
- **Responsive layout** — single-column stacking and a horizontally scrollable
  returns table on small screens.

## Tech stack

Only what the project actually uses:

- **Next.js 16.4.2** (App Router, Server Components, route handlers, proxy)
- **React 19.3.0** and **react-dom 19.3.0**
- **TypeScript 5**
- **Vitest 4** (unit tests)
- **ESLint 9** with `eslint-config-next`
- Plain CSS (`src/app/globals.css`) — no CSS framework

## Prerequisites

- **Node.js 20.x** (developed and verified on Node **20.19.0**)
- **npm 10.x** (developed and verified on npm **10.8.2**)

## Getting started

```bash
npm install
npm run dev
```

Then open <http://localhost:3000>, click the strategy, or go directly to
`/strategy/meridian-bluechip-growth`.

> **Optional troubleshooting:** if `npm install` ever fails with
> `Cannot read properties of null (reading 'edgesOut')` — an npm 10.8.x
> peer-resolution issue that can be triggered by Vitest's optional peers — retry
> with `npm install --legacy-peer-deps`. This was not observed during the
> verified setup on npm 10.8.2; it is only a fallback.

### Production build

```bash
npm run build
npm run start
```

## Routes and API

| Route | Description |
| --- | --- |
| `/` | Strategy index; links to the detail page. |
| `/strategy/meridian-bluechip-growth` | Strategy detail page. |
| `/api/strategies/meridian-bluechip-growth/summary` | Required summary endpoint. |
| `/api/strategies/meridian-bluechip-growth` | Full-detail endpoint that feeds the page. |

Unknown strategy slugs return **HTTP 404** with a friendly JSON error for both
the page route (handled early in `src/proxy.ts`) and the API routes:

```json
{
  "error": "Strategy not found",
  "message": "No strategy exists with the slug \"does-not-exist\". Please check the slug and try again."
}
```

## API response

`GET /api/strategies/meridian-bluechip-growth/summary` returns `200 OK`. The
`holdings` array contains **exactly three** holdings — the three highest
allocations — sorted in descending order by `allocationPercentage`.
`minimumInvestment` is a numeric amount in **INR** (e.g. `5000` = ₹5,000).

```json
{
  "name": "Meridian Bluechip Growth",
  "fundManagerName": "Ananya Deshpande",
  "minimumInvestment": 5000,
  "trailingReturns": [
    { "period": "1Y", "strategyReturn": 11.2, "benchmarkReturn": 9.4 },
    { "period": "3Y", "strategyReturn": 13.5, "benchmarkReturn": 11.1 },
    { "period": "5Y", "strategyReturn": 15.8, "benchmarkReturn": 12.6 },
    { "period": "Since Inception", "strategyReturn": 14.1, "benchmarkReturn": 11.7 }
  ],
  "holdings": [
    { "name": "Aurora Semiconductors", "allocationPercentage": 8.4 },
    { "name": "Bluepeak Software", "allocationPercentage": 7.9 },
    { "name": "Crestline Pharmaceuticals", "allocationPercentage": 6.5 }
  ]
}
```

```bash
# macOS / Linux
curl -i http://localhost:3000/api/strategies/meridian-bluechip-growth/summary
```

```powershell
# Windows PowerShell
Invoke-WebRequest http://localhost:3000/api/strategies/meridian-bluechip-growth/summary -UseBasicParsing | Select-Object -Expand Content
```

## Calculator assumptions

The calculator takes an investment amount and a holding period of 1, 3, 5 or 10
years, and recalculates on every change.

```
grossValue    = investmentAmount × (1 + annualReturnPercent / 100) ^ years
managementFee = investmentAmount × 0.02 × years     # 2% of initial investment per year
exitLoad      = years < 1 ? investmentAmount × 0.01 : 0   # 1% only when under one year
netValue      = grossValue − managementFee − exitLoad
```

- **Annual management fee:** charged at **2% of the initial investment per
  year** (linear on the initial amount, not on the growing balance).
- **Exit load:** **1% of the initial investment**, applied **only when the
  holding period is under one year**; otherwise zero.
- **Return rate assumption:** the assignment does not specify which trailing
  period drives the projection, so the calculator uses the strategy's **1Y
  strategy return** (11.2%). This is passed in as a prop and stated in the UI.
  Because the required dropdown offers only 1, 3, 5 and 10 years, the exit load
  is always ₹0 through the UI; the below-one-year branch is implemented and
  covered directly by a unit test at `years = 0.5`.

Validation is handled by pure functions in `src/lib/calculators/fees.ts`:

| Input | Message |
| --- | --- |
| Investment amount empty / whitespace | Investment amount is required. |
| Amount non-numeric (`abc`, `10k`, `1e5`, `10,000`) or non-finite | Enter a valid numeric amount. |
| Amount negative (`-5`) | Investment amount cannot be negative. |
| Amount zero (`0`) | Investment amount must be greater than zero. |
| Holding period not in {1, 3, 5, 10} (e.g. `0`, negative, out of range) | Select a valid holding period. |

The amount is entered as text (the field is numeric-oriented on mobile), so the
calculator validates the raw string before use. The holding period comes from a
controlled dropdown limited to 1, 3, 5 and 10 years, so its invalid branches are
defensive rather than reachable through the UI. An invalid amount suppresses the
breakdown and shows the message inline.

## Testing

All commands come straight from `package.json`:

```bash
npm test        # vitest run — unit tests for the fee math and summary shaping
npm run lint    # eslint
npm run build   # next build — production build
```

`npm test` runs two files:

- `src/lib/calculators/fees.test.ts` — gross value, management fee, net value,
  compounding over 3 and 10 years, the `< 1 year` exit-load branch at 0.5 years,
  no exit load at exactly 1 year, and every validation branch.
- `src/lib/services/strategy-service.test.ts` — known/unknown slug lookups,
  summary contains exactly the five contract fields, exactly three holdings in
  descending order, full returns preserved, source data not mutated.

## Project structure

```
src/
├── app/
│   ├── layout.tsx                    # shell, header, fictional-data footer
│   ├── page.tsx                      # strategy index
│   ├── globals.css                   # responsive styles (no CSS framework)
│   ├── strategy/[slug]/
│   │   ├── page.tsx                  # Server Component detail page
│   │   └── not-found.tsx             # custom 404 UI
│   └── api/strategies/[slug]/
│       ├── route.ts                  # full detail (feeds the page)
│       └── summary/route.ts          # required summary endpoint
├── components/
│   ├── StrategyHeader.tsx            # server
│   ├── TrailingReturnsTable.tsx      # server
│   ├── HoldingsList.tsx              # server
│   └── FeeCalculator.tsx             # client ("use client")
└── lib/
    ├── data/strategies.ts            # single source of fictional data
    ├── schemas/strategy.ts           # domain + API types
    ├── services/strategy-service.ts  # lookups + summary shaping
    ├── calculators/fees.ts           # pure fee math + validation
    └── format.ts                     # INR / percent / date formatting
src/proxy.ts                          # early 404 for unknown page slugs
```

Route handlers are thin (resolve `params`, call the service, return JSON). All
data access and shaping live in `src/lib/services/strategy-service.ts`. The
detail page is a Server Component and calls the service directly instead of
calling its own API over HTTP.

### Why two endpoints

The page needs `inceptionDate`, `benchmark` and five holdings, but the required
summary endpoint must return three holdings and must not include the inception
date or benchmark. The smallest clean solution is two read-only endpoints over
**one** service and **one** data source: `summary` returns the exact contract via
`toSummary()`, and the full-detail route serves the page. No duplicated data or
logic.

### Next.js 16 note

Next.js 16.4.2 enables Cache Components by default, so the dynamic `[slug]`
detail route opts into blocking render with `export const instant = false`. A
dynamic parameter has no response status available while the static shell
streams, so unknown page slugs are rejected early by `src/proxy.ts`, which
returns the HTTP 404 before render. Verified against `next start`: known page
`200`, unknown page `404`, both API endpoints `200`/`404`, production build
succeeds.

## Further documentation

- Written diagnostic answers: [`docs/diagnostics.md`](docs/diagnostics.md)
- Captured API responses: [`docs/api-evidence.md`](docs/api-evidence.md)
- 2–3 minute demo run-of-show: [`docs/demo-script.md`](docs/demo-script.md)
