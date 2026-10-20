import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getStrategyBySlug } from "@/lib/services/strategy-service";

export const config = {
  matcher: "/strategy/:slug",
};

export function proxy(request: NextRequest) {
  const slug = request.nextUrl.pathname.split("/").filter(Boolean).at(-1);

  if (slug && !getStrategyBySlug(decodeURIComponent(slug))) {
    return NextResponse.json(
      {
        error: "Strategy not found",
        message: `No strategy exists with the slug "${slug}". Please check the slug and try again.`,
      },
      { status: 404 },
    );
  }
}
