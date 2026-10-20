"use client";

import { useState } from "react";
import {
  calculateFees,
  validateInvestmentAmount,
  validateYears,
  HOLDING_PERIOD_OPTIONS,
} from "@/lib/calculators/fees";
import { formatINR } from "@/lib/format";

interface FeeCalculatorProps {
  annualReturnPercent: number;
  minimumInvestment: number;
}

export default function FeeCalculator({
  annualReturnPercent,
  minimumInvestment,
}: FeeCalculatorProps) {
  const [amountRaw, setAmountRaw] = useState("");
  const [years, setYears] = useState<number>(HOLDING_PERIOD_OPTIONS[0]);

  const amountValidation = validateInvestmentAmount(amountRaw);
  const yearsValidation = validateYears(years);
  const showError = amountRaw.trim() !== "" && !amountValidation.ok;

  const breakdown =
    amountValidation.ok && yearsValidation.ok
      ? calculateFees({
          investmentAmount: amountValidation.value,
          years: yearsValidation.value,
          annualReturnPercent,
        })
      : null;

  return (
    <section className="card">
      <h2 className="section-title">Fee calculator</h2>

      <div className="calculator-grid">
        <div className="field">
          <label htmlFor="investment-amount">Investment amount (INR)</label>
          <input
            id="investment-amount"
            type="text"
            inputMode="decimal"
            placeholder="e.g. 100000"
            value={amountRaw}
            onChange={(event) => setAmountRaw(event.target.value)}
            aria-invalid={showError}
            aria-describedby="investment-error"
          />
          <span id="investment-error" className="error-text" role="alert">
            {showError && !amountValidation.ok ? amountValidation.message : ""}
          </span>
        </div>

        <div className="field">
          <label htmlFor="holding-period">Holding period</label>
          <select
            id="holding-period"
            value={years}
            onChange={(event) => setYears(Number(event.target.value))}
          >
            {HOLDING_PERIOD_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option} {option === 1 ? "year" : "years"}
              </option>
            ))}
          </select>
          <span className="error-text">
            {!yearsValidation.ok ? yearsValidation.message : ""}
          </span>
        </div>
      </div>

      <div className="breakdown" aria-live="polite">
        {breakdown ? (
          <>
            <div className="breakdown-row">
              <span>Gross value</span>
              <span>{formatINR(breakdown.grossValue)}</span>
            </div>
            <div className="breakdown-row">
              <span>Management fee (2% p.a. of initial investment)</span>
              <span className="value-negative">
                − {formatINR(breakdown.managementFee)}
              </span>
            </div>
            <div className="breakdown-row">
              <span>Exit load (1% of initial investment, under 1 year)</span>
              <span className="value-negative">
                − {formatINR(breakdown.exitLoad)}
              </span>
            </div>
            <div className="breakdown-row total">
              <span>Net value</span>
              <span>{formatINR(breakdown.netValue)}</span>
            </div>
          </>
        ) : (
          <p className="muted">
            Enter a valid investment amount to see the breakdown.
          </p>
        )}
      </div>

      <p className="assumption-note">
        Projection uses the strategy&apos;s 1Y return of{" "}
        {annualReturnPercent.toFixed(2)}% as the annual rate (implementation
        assumption — the assignment does not specify a period). Illustrative
        minimum investment: {formatINR(minimumInvestment)}. Sample figures only.
      </p>
    </section>
  );
}
