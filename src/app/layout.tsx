import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Robosoft Strategy Detail",
    template: "%s | Robosoft Strategy Detail",
  },
  description:
    "Responsive strategy detail page with trailing returns, holdings and a fee calculator.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en">
      <body>
        <header className="site-header">
          <div className="container">
            <Link href="/" className="brand">
              Robosoft<span>·</span> Strategies
            </Link>
          </div>
        </header>
        {children}
        <footer className="site-footer">
          <div className="container">
            All strategies, holdings, managers and returns shown here are
            fictional and for demonstration only.
          </div>
        </footer>
      </body>
    </html>
  );
}
