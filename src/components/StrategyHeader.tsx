import type { Strategy } from "@/lib/schemas/strategy";
import { formatDate, formatINR } from "@/lib/format";

export default function StrategyHeader({ strategy }: { strategy: Strategy }) {
  return (
    <header className="card">
      <h1 className="strategy-name">{strategy.name}</h1>
      <p className="strategy-subtitle">
        Managed by {strategy.fundManagerName} · Minimum investment{" "}
        {formatINR(strategy.minimumInvestment)}
      </p>
      <dl className="meta-grid">
        <div className="meta-item">
          <dt>Fund manager</dt>
          <dd>{strategy.fundManagerName}</dd>
        </div>
        <div className="meta-item">
          <dt>Inception date</dt>
          <dd>{formatDate(strategy.inceptionDate)}</dd>
        </div>
        <div className="meta-item">
          <dt>Benchmark</dt>
          <dd>{strategy.benchmark}</dd>
        </div>
        <div className="meta-item">
          <dt>Minimum investment</dt>
          <dd>{formatINR(strategy.minimumInvestment)}</dd>
        </div>
      </dl>
    </header>
  );
}
