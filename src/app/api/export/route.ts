import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { code, filename } = await req.json();

    if (!code || !filename) {
      return NextResponse.json({ error: "Code and filename required" }, { status: 400 });
    }

    const headers = new Headers();
    headers.set("Content-Type", "text/plain; charset=utf-8");
    headers.set("Content-Disposition", `attachment; filename="${filename}"`);

    return new NextResponse(code, { headers });
  } catch {
    return NextResponse.json({ error: "Export failed" }, { status: 500 });
  }
}
