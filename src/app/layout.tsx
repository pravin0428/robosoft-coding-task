import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Robosoft Strategy Detail",
    template: "%s | Robosoft Strategy Detail",
  },
  description:
    "Assignment submission: responsive strategy detail page with fictional sample data.",
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
            fictional sample data created for an assignment. Nothing on this
            page is real financial information.
          </div>
        </footer>
      </body>
    </html>
  );
}
