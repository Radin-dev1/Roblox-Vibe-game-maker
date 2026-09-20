import { NextRequest, NextResponse } from "next/server";
import { assetDatasetInfo, listRobloxAssets, type AssetKind } from "@/lib/assets";

export async function GET(request: NextRequest) {
  const kind = request.nextUrl.searchParams.get("kind") as AssetKind | null;
  const query = request.nextUrl.searchParams.get("q") || "";
  const limit = Number(request.nextUrl.searchParams.get("limit") || 36);

  if (kind && kind !== "icon" && kind !== "thumbnail") {
    return NextResponse.json({ error: "kind must be icon or thumbnail" }, { status: 400 });
  }

  const assets = await listRobloxAssets({ kind: kind || undefined, query, limit });
  return NextResponse.json({ assets, dataset: assetDatasetInfo });
}
