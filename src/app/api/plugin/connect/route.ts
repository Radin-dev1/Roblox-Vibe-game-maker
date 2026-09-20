import { NextRequest, NextResponse } from "next/server";
import { createPluginSession } from "@/lib/plugin-sessions";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const sessionId = createPluginSession(body.scene || {}, body.version);

    return NextResponse.json({
      sessionId,
      status: "connected",
      version: body.version,
    });
  } catch {
    return NextResponse.json({ error: "Connection failed" }, { status: 500 });
  }
}
