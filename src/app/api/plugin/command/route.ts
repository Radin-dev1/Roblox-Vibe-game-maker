import { NextRequest, NextResponse } from "next/server";
import { queuePluginCommand } from "@/lib/plugin-sessions";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const session = typeof body.session === "string" ? body.session : "";
    const command = body.command;
    if (!session || !command || typeof command.action !== "string") {
      return NextResponse.json({ error: "session and command.action are required" }, { status: 400 });
    }
    const queued = queuePluginCommand(session, command);
    return NextResponse.json({ queued }, { status: queued ? 200 : 404 });
  } catch {
    return NextResponse.json({ error: "Invalid command payload" }, { status: 400 });
  }
}
