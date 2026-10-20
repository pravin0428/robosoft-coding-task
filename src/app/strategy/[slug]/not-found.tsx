import Link from "next/link";

export default function StrategyNotFound() {
  return (
    <main className="container not-found">
      <h1>404</h1>
      <p>We could not find that strategy. It may have been renamed or removed.</p>
      <Link className="button-link" href="/">
        Back to strategies
      </Link>
    </main>
  );
}
