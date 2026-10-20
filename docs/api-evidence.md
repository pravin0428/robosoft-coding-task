# API evidence

Captured from a locally running server (`npm run dev`, Next.js 16.4.2, port
3000) on 2026-10-20. Commands used and their actual responses are shown below.
Responses are copied verbatim from the terminal output.

## 1. `GET /api/strategies/meridian-bluechip-growth/summary` â†’ 200

```powershell
Invoke-WebRequest http://localhost:3000/api/strategies/meridian-bluechip-growth/summary -UseBasicParsing
```

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

Checks: exactly 5 keys, full 4-period `trailingReturns`, exactly 3 holdings
sorted descending, no `inceptionDate`/`benchmark`/`slug` leakage.

## 2. `GET /api/strategies/meridian-bluechip-growth` â†’ 200

```json
{
  "slug": "meridian-bluechip-growth",
  "name": "Meridian Bluechip Growth",
  "fundManagerName": "Ananya Deshpande",
  "inceptionDate": "2015-06-15",
  "benchmark": "Meridian Large-Cap 100 Index (fictional)",
  "minimumInvestment": 5000,
  "currency": "INR",
  "trailingReturns": [
    { "period": "1Y", "strategyReturn": 11.2, "benchmarkReturn": 9.4 },
    { "period": "3Y", "strategyReturn": 13.5, "benchmarkReturn": 11.1 },
    { "period": "5Y", "strategyReturn": 15.8, "benchmarkReturn": 12.6 },
    { "period": "Since Inception", "strategyReturn": 14.1, "benchmarkReturn": 11.7 }
  ],
  "holdings": [
    { "name": "Aurora Semiconductors", "allocationPercentage": 8.4 },
    { "name": "Bluepeak Software", "allocationPercentage": 7.9 },
    { "name": "Crestline Pharmaceuticals", "allocationPercentage": 6.5 },
    { "name": "Deltafin Bank", "allocationPercentage": 5.8 },
    { "name": "Evergreen Consumer", "allocationPercentage": 4.7 }
  ]
}
```

## 3. Unknown slug â†’ 404 (both endpoints)

```powershell
Invoke-WebRequest http://localhost:3000/api/strategies/does-not-exist/summary -UseBasicParsing
```

Result: **HTTP 404**

```json
{
  "error": "Strategy not found",
  "message": "No strategy exists with the slug \"does-not-exist\". Please check the slug and try again."
}
```

The full-detail endpoint returns the same body and status for an unknown slug.

## 4. Page routes (verified against `next start`)

| Route | Result |
| --- | --- |
| `/` | 200 |
| `/strategy/meridian-bluechip-growth` | 200 |
| `/strategy/nope` | **404** â€” returned early by `src/proxy.ts` with the same JSON error body |

## Reproducing

```powershell
npm run dev
# in a second terminal:
Invoke-WebRequest http://localhost:3000/api/strategies/meridian-bluechip-growth/summary -UseBasicParsing |
  Select-Object -Expand Content
```

On macOS/Linux use `curl -i`:

```bash
curl -i http://localhost:3000/api/strategies/meridian-bluechip-growth/summary
curl -i http://localhost:3000/api/strategies/meridian-bluechip-growth
curl -i http://localhost:3000/api/strategies/does-not-exist/summary
```
