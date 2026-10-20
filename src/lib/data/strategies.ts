import type { Strategy } from "@/lib/schemas/strategy";

const strategies: Strategy[] = [
  {
    slug: "meridian-bluechip-growth",
    name: "Meridian Bluechip Growth",
    fundManagerName: "Ananya Deshpande",
    inceptionDate: "2015-06-15",
    benchmark: "Meridian Large-Cap 100 Index (fictional)",
    minimumInvestment: 5000,
    currency: "INR",
    trailingReturns: [
      { period: "1Y", strategyReturn: 11.2, benchmarkReturn: 9.4 },
      { period: "3Y", strategyReturn: 13.5, benchmarkReturn: 11.1 },
      { period: "5Y", strategyReturn: 15.8, benchmarkReturn: 12.6 },
      { period: "Since Inception", strategyReturn: 14.1, benchmarkReturn: 11.7 },
    ],
    holdings: [
      { name: "Aurora Semiconductors", allocationPercentage: 8.4 },
      { name: "Bluepeak Software", allocationPercentage: 7.9 },
      { name: "Crestline Pharmaceuticals", allocationPercentage: 6.5 },
      { name: "Deltafin Bank", allocationPercentage: 5.8 },
      { name: "Evergreen Consumer", allocationPercentage: 4.7 },
    ],
  },
];

export default strategies;
