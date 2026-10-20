export const MANAGEMENT_FEE_RATE = 0.02;
export const EXIT_LOAD_RATE = 0.01;
export const HOLDING_PERIOD_OPTIONS = [1, 3, 5, 10] as const;

export type HoldingPeriod = (typeof HOLDING_PERIOD_OPTIONS)[number];

export interface FeeInputs {
  investmentAmount: number;
  years: number;
  annualReturnPercent: number;
}

export interface FeeBreakdown {
  grossValue: number;
  managementFee: number;
  exitLoad: number;
  netValue: number;
}

export function calculateFees({
  investmentAmount,
  years,
  annualReturnPercent,
}: FeeInputs): FeeBreakdown {
  const grossValue =
    investmentAmount * Math.pow(1 + annualReturnPercent / 100, years);
  const managementFee = investmentAmount * MANAGEMENT_FEE_RATE * years;
  const exitLoad =
    years < 1 ? investmentAmount * EXIT_LOAD_RATE : 0;
  const netValue = grossValue - managementFee - exitLoad;

  return { grossValue, managementFee, exitLoad, netValue };
}

export type ValidationResult =
  | { ok: true; value: number }
  | { ok: false; message: string };

export function validateInvestmentAmount(raw: string): ValidationResult {
  const trimmed = raw.trim();

  if (trimmed === "") {
    return { ok: false, message: "Investment amount is required." };
  }

  if (!/^-?\d*\.?\d+$/.test(trimmed)) {
    return { ok: false, message: "Enter a valid numeric amount." };
  }

  const value = Number(trimmed);

  if (!Number.isFinite(value)) {
    return { ok: false, message: "Enter a valid numeric amount." };
  }

  if (value < 0) {
    return { ok: false, message: "Investment amount cannot be negative." };
  }

  if (value === 0) {
    return { ok: false, message: "Investment amount must be greater than zero." };
  }

  return { ok: true, value };
}

export function validateYears(years: number): ValidationResult {
  if (!HOLDING_PERIOD_OPTIONS.includes(years as HoldingPeriod)) {
    return { ok: false, message: "Select a valid holding period." };
  }
  return { ok: true, value: years };
}
