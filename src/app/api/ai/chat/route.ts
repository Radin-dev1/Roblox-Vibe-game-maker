import { NextRequest, NextResponse } from "next/server";
import { generateTextResponse } from "@/lib/ai";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { message, modelId, token } = body as {
      message: string;
      modelId?: string;
      token?: string;
    };

    if (!message || typeof message !== "string") {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      );
    }

    const result = await generateTextResponse(message, modelId, token);

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
