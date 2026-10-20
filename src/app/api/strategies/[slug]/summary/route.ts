import { getStrategySummary } from "@/lib/services/strategy-service";
import type { ApiError } from "@/lib/schemas/strategy";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const summary = getStrategySummary(slug);

  if (!summary) {
    const body: ApiError = {
      error: "Strategy not found",
      message: `No strategy exists with the slug "${slug}". Please check the slug and try again.`,
    };
    return Response.json(body, { status: 404 });
  }

  return Response.json(summary);
}
