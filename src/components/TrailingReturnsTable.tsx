import type { TrailingReturn } from "@/lib/schemas/strategy";
import { formatPercent } from "@/lib/format";

function Delta({ value }: { value: number }) {
  const className = value >= 0 ? "value-positive" : "value-negative";
  const sign = value > 0 ? "+" : "";
  return (
    <span className={className}>
      {sign}
      {formatPercent(value)}
    </span>
  );
}

export default function TrailingReturnsTable({
  trailingReturns,
}: {
  trailingReturns: TrailingReturn[];
}) {
  return (
    <div className="table-scroll">
      <table className="data-table">
        <thead>
          <tr>
            <th scope="col">Period</th>
            <th scope="col">Strategy</th>
            <th scope="col">Benchmark</th>
            <th scope="col">Difference</th>
          </tr>
        </thead>
        <tbody>
          {trailingReturns.map((row) => (
            <tr key={row.period}>
              <th scope="row">{row.period}</th>
              <td className="value-positive">{formatPercent(row.strategyReturn)}</td>
              <td>{formatPercent(row.benchmarkReturn)}</td>
              <td>
                <Delta
                  value={Number(
                    (row.strategyReturn - row.benchmarkReturn).toFixed(2),
                  )}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
