import type { Holding } from "@/lib/schemas/strategy";
import { formatPercent } from "@/lib/format";

export default function HoldingsList({ holdings }: { holdings: Holding[] }) {
  const max = Math.max(...holdings.map((holding) => holding.allocationPercentage), 1);

  return (
    <ol className="holdings-list">
      {holdings.map((holding, index) => (
        <li key={holding.name} className="holding-row">
          <span className="holding-name">
            {index + 1}. {holding.name}
          </span>
          <span className="holding-percent">
            {formatPercent(holding.allocationPercentage)}
          </span>
          <span className="holding-bar" aria-hidden="true">
            <span
              style={{
                width: `${(holding.allocationPercentage / max) * 100}%`,
              }}
            />
          </span>
        </li>
      ))}
    </ol>
  );
}
