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

    if (model && model.category !== "image-3d") {
      return NextResponse.json({ error: "Select a 3D-capable model." }, { status: 400 });
    }

    const selectedModel = model || AI_MODELS.find((m) => m.id === "z-image-turbo");

    return NextResponse.json({
      status: "queued",
      message: `3D generation with ${selectedModel?.name || "Z-Image Turbo"} is queued for a GPU worker.`,
      model: selectedModel
        ? {
            id: selectedModel.id,
            name: selectedModel.name,
            provider: selectedModel.provider,
            hfId: selectedModel.hfId,
          }
        : null,
      asset: { format: "glb", prompt, ready: false },
      keyless: true,
      note: "No API key is required. The browser uses anonymous Hugging Face routing when available; production GLB export needs a GPU worker or Hugging Face Space.",
    });
  } catch {
    return NextResponse.json(
      { error: "3D generation request failed" },
      { status: 500 }
    );
  }
}
