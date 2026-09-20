import { NextRequest, NextResponse } from "next/server";
import { generateTextResponse } from "@/lib/ai";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { message, modelId, token, history } = body as {
      message: string;
      modelId?: string;
      token?: string;
      history?: Array<{ role: "user" | "assistant"; content: string }>;
    };

    if (!message || typeof message !== "string") {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      );
    }

    const safeHistory = Array.isArray(history)
      ? history.filter((item) => item && (item.role === "user" || item.role === "assistant") && typeof item.content === "string").slice(-8)
      : [];
    const result = await generateTextResponse(message, modelId, token, safeHistory);

    return NextResponse.json({
      text: result.text,
      model: {
        id: result.model.id,
        name: result.model.name,
        provider: result.model.provider,
        color: result.model.color,
        icon: result.model.icon,
      },
      error: result.error || null,
    });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
