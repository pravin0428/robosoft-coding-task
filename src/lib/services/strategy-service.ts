import strategies from "@/lib/data/strategies";
import type { Strategy, StrategySummary } from "@/lib/schemas/strategy";

export function listStrategies(): Strategy[] {
  return strategies;
}

export function getStrategyBySlug(slug: string): Strategy | undefined {
  return strategies.find((strategy) => strategy.slug === slug);
}

export function toSummary(strategy: Strategy): StrategySummary {
  const holdings = [...strategy.holdings]
    .sort((a, b) => b.allocationPercentage - a.allocationPercentage)
    .slice(0, 3);

  return {
    name: strategy.name,
    fundManagerName: strategy.fundManagerName,
    minimumInvestment: strategy.minimumInvestment,
    trailingReturns: strategy.trailingReturns,
    holdings,
  };
}

export function getStrategySummary(slug: string): StrategySummary | undefined {
  const strategy = getStrategyBySlug(slug);
  return strategy ? toSummary(strategy) : undefined;
}
