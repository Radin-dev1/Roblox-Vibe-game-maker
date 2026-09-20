import { NextRequest, NextResponse } from "next/server";
import { recordPluginResults } from "@/lib/plugin-sessions";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const session = typeof body.session === "string" ? body.session : "";
    const results = Array.isArray(body.results) ? body.results : [];
    const received = recordPluginResults(session, results);
    return NextResponse.json({ received, count: results.length }, { status: received ? 200 : 404 });
  } catch {
    return NextResponse.json({ error: "Failed to process results" }, { status: 500 });
  }
}
