import { readdir } from "node:fs/promises";
import path from "node:path";

export type AssetKind = "icon" | "thumbnail";

export interface RobloxAsset {
  id: string;
  kind: AssetKind;
  name: string;
  url: string;
  source: "uploaded-dataset" | "local-library";
  dimensions: string;
}

const FEATURED_ASSETS: RobloxAsset[] = [
  {
    id: "10000284712-icon",
    kind: "icon",
    name: "Neon adventure icon",
    url: "/assets/dataset/icons/10000284712_20260406_235416.webp",
    source: "uploaded-dataset",
    dimensions: "256 × 256",
  },
  {
    id: "10000513141-icon",
    kind: "icon",
    name: "Social world icon",
    url: "/assets/dataset/icons/10000513141_20260408_001829.webp",
    source: "uploaded-dataset",
    dimensions: "256 × 256",
  },
  {
    id: "10001081846-icon",
    kind: "icon",
    name: "Action game icon",
    url: "/assets/dataset/icons/10001081846_20260407_194715.webp",
    source: "uploaded-dataset",
    dimensions: "256 × 256",
  },
  {
    id: "10002091401-icon",
    kind: "icon",
    name: "Fantasy quest icon",
    url: "/assets/dataset/icons/10002091401_20260407_194624.webp",
    source: "uploaded-dataset",
    dimensions: "256 × 256",
  },
  {
    id: "10000284712-thumb",
    kind: "thumbnail",
    name: "Neon adventure thumbnail",
    url: "/assets/dataset/thumbs/10000284712_20260406_235418_0.webp",
    source: "uploaded-dataset",
    dimensions: "768 × 432",
  },
  {
    id: "10000381984-thumb",
    kind: "thumbnail",
    name: "Exploration thumbnail",
    url: "/assets/dataset/thumbs/10000381984_20260407_081616_0.webp",
    source: "uploaded-dataset",
    dimensions: "768 × 428",
  },
  {
    id: "10000513141-thumb",
    kind: "thumbnail",
    name: "Social world thumbnail",
    url: "/assets/dataset/thumbs/10000513141_20260408_001830_0.webp",
    source: "uploaded-dataset",
    dimensions: "768 × 432",
  },
  {
    id: "10002091401-thumb",
    kind: "thumbnail",
    name: "Fantasy quest thumbnail",
    url: "/assets/dataset/thumbs/10002091401_20260407_194625_0.webp",
    source: "uploaded-dataset",
    dimensions: "768 × 432",
  },
];

function titleFromFilename(filename: string) {
  const id = filename.split("_")[0];
  return `Roblox asset ${id}`;
}

export async function listRobloxAssets(options: {
  kind?: AssetKind;
  query?: string;
  limit?: number;
} = {}): Promise<RobloxAsset[]> {
  const query = options.query?.trim().toLowerCase() || "";
  const limit = Math.min(Math.max(options.limit ?? 36, 1), 72);
  const assets = [...FEATURED_ASSETS];

  // The full uploaded archive is intentionally ignored by git. When it is
  // extracted locally, surface a small rotating slice without reading every
  // image into memory or shipping the multi-gigabyte archive to a deployment.
  const localIconDir = process.env.VIBE_ASSET_LIBRARY;
  try {
    if (!localIconDir) throw new Error("No optional asset library configured");
    const localIcons = (await readdir(path.resolve(localIconDir)))
      .filter((name) => name.endsWith(".webp"))
      .slice(0, 24);
    for (const filename of localIcons) {
      assets.push({
        id: `local-${filename}`,
        kind: "icon",
        name: titleFromFilename(filename),
        url: `/icons/icons/${filename}`,
        source: "local-library",
        dimensions: "256 × 256",
      });
    }
  } catch {
    // The curated sample keeps the library usable in a clean deployment.
  }

  return assets
    .filter((asset) => !options.kind || asset.kind === options.kind)
    .filter((asset) => !query || `${asset.name} ${asset.id}`.toLowerCase().includes(query))
    .slice(0, limit);
}

export const assetDatasetInfo = {
  name: "Roblox Game Icons & Thumbnails",
  description: "A curated sample from the uploaded icon and thumbnail archive, with the local library available when mounted.",
  readme: "Artwork remains the property of its original creators; the archive is provided as-is for research and model-training use.",
  iconCount: 43115,
  thumbnailCount: 100750,
};
