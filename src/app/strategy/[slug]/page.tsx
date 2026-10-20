import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { getStrategyBySlug } from "@/lib/services/strategy-service";
import StrategyHeader from "@/components/StrategyHeader";
import TrailingReturnsTable from "@/components/TrailingReturnsTable";
import HoldingsList from "@/components/HoldingsList";
import FeeCalculator from "@/components/FeeCalculator";

type Params = { slug: string };

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const strategy = getStrategyBySlug(slug);
  if (!strategy) return { title: "Strategy not found" };
  return {
    title: `${strategy.name} · Strategy Detail`,
    description: `Fictional sample strategy detail page for ${strategy.name}.`,
  };
}

export const instant = false;

export default async function StrategyPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const strategy = getStrategyBySlug(slug);

  if (!strategy) notFound();

  return (
    <main className="container">
      <nav className="breadcrumbs">
        <Link href="/">Strategies</Link> / {strategy.name}
      </nav>

      <StrategyHeader strategy={strategy} />

      <section className="card">
        <h2 className="section-title">Trailing returns</h2>
        <TrailingReturnsTable trailingReturns={strategy.trailingReturns} />
        <p className="assumption-note">
          Illustrative figures for a fictional strategy. Not real performance
          data.
        </p>
      </section>

      <section className="card">
        <h2 className="section-title">Top five holdings</h2>
        <HoldingsList holdings={strategy.holdings} />
        <p className="assumption-note">
          Allocation percentages are fictional and cover the top five positions
          only.
        </p>
      </section>

      <FeeCalculator
        annualReturnPercent={
          strategy.trailingReturns.find((row) => row.period === "1Y")
            ?.strategyReturn ?? 0
        }
        minimumInvestment={strategy.minimumInvestment}
      />
    </main>
  );
}
