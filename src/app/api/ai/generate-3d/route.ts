import { NextRequest, NextResponse } from "next/server";
import { AI_MODELS } from "@/lib/models";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { prompt, modelId } = body as {
      prompt: string;
      modelId?: string;
    };

    if (!prompt || typeof prompt !== "string") {
      return NextResponse.json(
        { error: "Prompt is required" },
        { status: 400 }
      );
    }

    const model = modelId
      ? AI_MODELS.find((m) => m.id === modelId)
      : AI_MODELS.find((m) => m.id === "z-image-turbo");

    return NextResponse.json({
      status: "queued",
      message: `3D generation with ${model?.name || "Z-Image Turbo"} is processing. This typically takes 30-60 seconds for complex models.`,
      model: model
        ? {
            id: model.id,
            name: model.name,
            provider: model.provider,
          }
        : null,
      note: "3D generation models require GPU compute. For full functionality, deploy with a GPU-enabled backend or use HuggingFace Spaces.",
    });
  } catch {
    return NextResponse.json(
      { error: "3D generation request failed" },
      { status: 500 }
    );
  }
}
