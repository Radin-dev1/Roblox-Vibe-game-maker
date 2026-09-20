import { NextRequest, NextResponse } from "next/server";
import { pollPluginSession } from "@/lib/plugin-sessions";

export async function GET(req: NextRequest) {
  const session = req.nextUrl.searchParams.get("session");

  if (!session) {
    return NextResponse.json({ commands: [], connected: false });
  }

  const result = pollPluginSession(session);
  if (!result) return NextResponse.json({ commands: [], connected: false }, { status: 404 });
  return NextResponse.json({ ...result, connected: true });
}
