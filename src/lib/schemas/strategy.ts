export type ReturnPeriod = "1Y" | "3Y" | "5Y" | "Since Inception";

export interface TrailingReturn {
  period: ReturnPeriod;
  strategyReturn: number;
  benchmarkReturn: number;
}

export interface Holding {
  name: string;
  allocationPercentage: number;
}

export interface Strategy {
  slug: string;
  name: string;
  fundManagerName: string;
  inceptionDate: string;
  benchmark: string;
  minimumInvestment: number;
  currency: "INR";
  trailingReturns: TrailingReturn[];
  holdings: Holding[];
}

export interface StrategySummary {
  name: string;
  fundManagerName: string;
  minimumInvestment: number;
  trailingReturns: TrailingReturn[];
  holdings: Holding[];
}

export interface ApiError {
  error: string;
  message: string;
}
