import Link from "next/link";
import { listStrategies } from "@/lib/services/strategy-service";

export default function HomePage() {
  const strategies = listStrategies();

  return (
    <main className="container">
      <h1 className="strategy-name">Strategies</h1>

      <ul className="strategy-list">
        {strategies.map((strategy) => (
          <li key={strategy.slug}>
            <Link href={`/strategy/${strategy.slug}`}>
              <span>
                <strong>{strategy.name}</strong>
                <br />
                <span className="muted">
                  Fund manager: {strategy.fundManagerName}
                </span>
              </span>
              <span className="chevron" aria-hidden="true">
                →
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
