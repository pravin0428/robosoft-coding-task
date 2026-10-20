import { describe, expect, it } from "vitest";
import strategies from "@/lib/data/strategies";
import {
  getStrategyBySlug,
  getStrategySummary,
  toSummary,
} from "@/lib/services/strategy-service";

describe("sample data", () => {
  it("contains exactly one fictional strategy with five holdings and four periods", () => {
    expect(strategies).toHaveLength(1);
    expect(strategies[0].holdings).toHaveLength(5);
    expect(strategies[0].trailingReturns).toHaveLength(4);
  });
});

describe("getStrategyBySlug", () => {
  it("returns the strategy for a known slug", () => {
    const strategy = getStrategyBySlug("meridian-bluechip-growth");
    expect(strategy?.name).toBe("Meridian Bluechip Growth");
    expect(strategy?.holdings).toHaveLength(5);
  });

  it("returns undefined for an unknown slug", () => {
    expect(getStrategyBySlug("does-not-exist")).toBeUndefined();
    expect(getStrategySummary("does-not-exist")).toBeUndefined();
  });
});

describe("toSummary", () => {
  const strategy = strategies[0];

  it("keeps only the summary fields", () => {
    const summary = toSummary(strategy);

    expect(Object.keys(summary).sort()).toEqual(
      [
        "fundManagerName",
        "holdings",
        "minimumInvestment",
        "name",
        "trailingReturns",
      ].sort(),
    );
    expect(summary).not.toHaveProperty("inceptionDate");
    expect(summary).not.toHaveProperty("benchmark");
    expect(summary).not.toHaveProperty("slug");
  });

  it("returns exactly three holdings sorted by allocation descending", () => {
    const summary = toSummary(strategy);

    expect(summary.holdings).toHaveLength(3);
    expect(summary.holdings.map((holding) => holding.name)).toEqual([
      "Aurora Semiconductors",
      "Bluepeak Software",
      "Crestline Pharmaceuticals",
    ]);

    const allocations = summary.holdings.map(
      (holding) => holding.allocationPercentage,
    );
    expect(allocations).toEqual([8.4, 7.9, 6.5]);
    expect(allocations).toEqual([...allocations].sort((a, b) => b - a));
  });

  it("preserves the full trailing returns array", () => {
    const summary = toSummary(strategy);
    expect(summary.trailingReturns).toHaveLength(4);
    expect(summary.trailingReturns).toEqual(strategy.trailingReturns);
  });

  it("does not mutate the source holdings order", () => {
    const before = strategy.holdings.map((holding) => holding.name);
    toSummary(strategy);
    expect(strategy.holdings.map((holding) => holding.name)).toEqual(before);
  });
});
