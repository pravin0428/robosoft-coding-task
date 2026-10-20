import { describe, expect, it } from "vitest";
import {
  calculateFees,
  validateInvestmentAmount,
  validateYears,
} from "@/lib/calculators/fees";

describe("calculateFees", () => {
  it("computes gross value, management fee and net value for a 1 year hold", () => {
    const result = calculateFees({
      investmentAmount: 100000,
      years: 1,
      annualReturnPercent: 10,
    });

    expect(result.grossValue).toBeCloseTo(110000, 6);
    expect(result.managementFee).toBeCloseTo(2000, 6);
    expect(result.exitLoad).toBe(0);
    expect(result.netValue).toBeCloseTo(108000, 6);
  });

  it("compounds over multiple years and scales the management fee linearly", () => {
    const result = calculateFees({
      investmentAmount: 100000,
      years: 3,
      annualReturnPercent: 10,
    });

    expect(result.grossValue).toBeCloseTo(133100, 6);
    expect(result.managementFee).toBeCloseTo(6000, 6);
    expect(result.exitLoad).toBe(0);
    expect(result.netValue).toBeCloseTo(127100, 6);
  });

  it("charges a 1% exit load when the holding period is below one year", () => {
    const result = calculateFees({
      investmentAmount: 100000,
      years: 0.5,
      annualReturnPercent: 10,
    });

    expect(result.exitLoad).toBeCloseTo(1000, 6);
    expect(result.netValue).toBeCloseTo(
      result.grossValue - result.managementFee - 1000,
      6,
    );
  });

  it("applies no exit load at exactly one year", () => {
    const result = calculateFees({
      investmentAmount: 250000,
      years: 1,
      annualReturnPercent: 11.2,
    });

    expect(result.exitLoad).toBe(0);
  });

  it("handles a 10 year projection", () => {
    const result = calculateFees({
      investmentAmount: 500000,
      years: 10,
      annualReturnPercent: 11.2,
    });

    expect(result.grossValue).toBeCloseTo(
      500000 * Math.pow(1.112, 10),
      6,
    );
    expect(result.managementFee).toBeCloseTo(100000, 6);
    expect(result.netValue).toBeCloseTo(
      result.grossValue - result.managementFee,
      6,
    );
  });
});

describe("validateInvestmentAmount", () => {
  it("rejects an empty value", () => {
    const result = validateInvestmentAmount("   ");
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.message).toMatch(/required/i);
  });

  it("rejects non-numeric input", () => {
    for (const raw of ["abc", "10k", "1e5", "10,000", "--5", "1.2.3"]) {
      const result = validateInvestmentAmount(raw);
      expect(result.ok, `expected "${raw}" to be rejected`).toBe(false);
      if (!result.ok) expect(result.message).toMatch(/numeric/i);
    }
  });

  it("rejects negative and zero values", () => {
    const negative = validateInvestmentAmount("-100");
    expect(negative.ok).toBe(false);
    if (!negative.ok) expect(negative.message).toMatch(/negative/i);

    const zero = validateInvestmentAmount("0");
    expect(zero.ok).toBe(false);
    if (!zero.ok) expect(zero.message).toMatch(/greater than zero/i);
  });

  it("accepts valid positive amounts", () => {
    const result = validateInvestmentAmount(" 250000.50 ");
    expect(result).toEqual({ ok: true, value: 250000.5 });
  });
});

describe("validateYears", () => {
  it("accepts only the supported holding periods", () => {
    for (const years of [1, 3, 5, 10]) {
      expect(validateYears(years).ok).toBe(true);
    }
  });

  it("rejects invalid holding periods", () => {
    for (const years of [0, 2, 4, -1, Number.NaN]) {
      expect(validateYears(years).ok).toBe(false);
    }
  });
});
