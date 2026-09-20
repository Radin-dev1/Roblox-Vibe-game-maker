import { NextRequest, NextResponse } from "next/server";
import { generateImage } from "@/lib/ai";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { prompt, modelId, token, style } = body as {
      prompt: string;
      modelId?: string;
      token?: string;
      style?: "icon" | "thumbnail" | "concept";
    };

    if (!prompt || typeof prompt !== "string") {
      return NextResponse.json(
        { error: "Prompt is required" },
        { status: 400 }
      );
    }

    const result = await generateImage(prompt, modelId, token, style);

    return NextResponse.json({
      imageUrl: result.imageUrl || null,
      fallback: false,
      model: {
        id: result.model.id,
        name: result.model.name,
        provider: result.model.provider,
      },
      error: result.error || null,
    });
  } catch {
    return NextResponse.json(
      { error: "Image generation failed" },
      { status: 500 }
    );
  }
}
