import { NextResponse } from "next/server";
import { getViews, incrementViews } from "@/lib/views";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  return NextResponse.json({ slug, views: getViews(slug) });
}

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  return NextResponse.json({ slug, views: incrementViews(slug) });
}
