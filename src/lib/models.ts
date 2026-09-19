export interface AIModel {
  id: string;
  name: string;
  provider: string;
  hfId: string;
  category: "text" | "image-2d" | "image-3d";
  description: string;
  capabilities: string[];
  icon: string;
  color: string;
  requiresToken: boolean;
}

export const AI_MODELS: AIModel[] = [
  {
    id: "gemma-4",
    name: "Gemma 4 E4B",
    provider: "Google",
    hfId: "google/gemma-4-E4B-it",
    category: "text",
    description: "Fast, efficient text generation and code completion",
    capabilities: ["text", "code", "planning"],
    icon: "G",
    color: "#4285f4",
    requiresToken: false,
  },
  {
    id: "janus-pro",
    name: "Janus Pro 7B",
    provider: "DeepSeek",
    hfId: "deepseek-ai/Janus-Pro-7B",
    category: "text",
    description: "Multimodal understanding and code generation",
    capabilities: ["text", "code", "vision", "planning"],
    icon: "J",
    color: "#00d4aa",
    requiresToken: false,
  },
  {
    id: "llama-3",
    name: "Llama 3 8B",
    provider: "Meta",
    hfId: "meta-llama/Meta-Llama-3-8B-Instruct",
    category: "text",
    description: "Strong reasoning and instruction following",
    capabilities: ["text", "code", "reasoning", "planning"],
    icon: "L",
    color: "#7c5cfc",
    requiresToken: true,
  },
  {
    id: "flux-dev",
    name: "FLUX.1 Dev",
    provider: "Black Forest Labs",
    hfId: "black-forest-labs/FLUX.1-dev",
    category: "image-2d",
    description: "High-quality 2D image generation from text prompts",
    capabilities: ["text-to-image", "concept-art", "thumbnails"],
    icon: "F",
    color: "#ff6b6b",
    requiresToken: false,
  },
  {
    id: "glm-ocr",
    name: "GLM OCR",
    provider: "ZAI",
    hfId: "zai-org/GLM-OCR",
    category: "image-2d",
    description: "Visual understanding and image analysis",
    capabilities: ["ocr", "image-understanding"],
    icon: "O",
    color: "#fbbf24",
    requiresToken: false,
  },
  {
    id: "z-image-turbo",
    name: "Z-Image Turbo",
    provider: "Tongyi MAI",
    hfId: "Tongyi-MAI/Z-Image-Turbo",
    category: "image-3d",
    description: "Fast 3D asset generation from text or images",
    capabilities: ["text-to-3d", "image-to-3d"],
    icon: "Z",
    color: "#a78bfa",
    requiresToken: false,
  },
  {
    id: "pixal3d",
    name: "Pixal3D",
    provider: "TencentARC",
    hfId: "TencentARC/Pixal3D",
    category: "image-3d",
    description: "High-fidelity 3D model generation",
    capabilities: ["text-to-3d", "3d-reconstruction"],
    icon: "P",
    color: "#00d4aa",
    requiresToken: false,
  },
];

export const KNOWLEDGE_SOURCES = [
  {
    name: "Roblox Brain",
    url: "https://github.com/TabooHarmony/roblox-brain",
    type: "github" as const,
    description: "Game architecture and design patterns — embedded in system prompt",
  },
  {
    name: "Roblox Dev Skills",
    url: "https://github.com/ohzw/roblox-dev-skills",
    type: "github" as const,
    description: "Development workflows and best practices — embedded in system prompt",
  },
  {
    name: "Luau Skills",
    url: "https://github.com/luumenlabs/luau-skills",
    type: "github" as const,
    description: "Luau programming patterns — embedded in system prompt",
  },
  {
    name: "Roblox Skills",
    url: "https://github.com/AshExplained/roblox-skills",
    type: "github" as const,
    description: "Comprehensive game development skills — embedded in system prompt",
  },
  {
    name: "Luau Corpus",
    url: "https://huggingface.co/datasets/Roblox/luau_corpus",
    type: "dataset" as const,
    description: "Large-scale Luau code dataset — patterns embedded in system prompt",
  },
  {
    name: "Luau Reasoning v1.0",
    url: "https://huggingface.co/datasets/487798RGW/Roblox-Luau-Reasoning-v1.0",
    type: "dataset" as const,
    description: "Code reasoning and problem-solving — logic embedded in system prompt",
  },
  {
    name: "Roblox Images",
    url: "https://huggingface.co/datasets/Shashashasha/Roblox_Images_Dataset",
    type: "dataset" as const,
    description: "Game screenshots and thumbnails — used for image generation context",
  },
  {
    name: "Roblox Avatars",
    url: "https://huggingface.co/datasets/deletesystem32forfreerobux/roblox-avatars",
    type: "dataset" as const,
    description: "Avatar reference images — used for image generation context",
  },
  {
    name: "Roblox Avatars (Genetsds)",
    url: "https://huggingface.co/datasets/Genetsds/roblox.avatars",
    type: "dataset" as const,
    description: "Extended avatar dataset — used for image generation context",
  },
];

export function getTextModels() {
  return AI_MODELS.filter((m) => m.category === "text");
}

export function getImageModels() {
  return AI_MODELS.filter((m) => m.category === "image-2d");
}

export function get3DModels() {
  return AI_MODELS.filter((m) => m.category === "image-3d");
}

export function getBestModelForTask(
  task: "code" | "plan" | "image" | "3d"
): AIModel {
  switch (task) {
    case "code":
      return AI_MODELS.find((m) => m.id === "gemma-4")!;
    case "plan":
      return AI_MODELS.find((m) => m.id === "janus-pro")!;
    case "image":
      return AI_MODELS.find((m) => m.id === "flux-dev")!;
    case "3d":
      return AI_MODELS.find((m) => m.id === "z-image-turbo")!;
  }
}
