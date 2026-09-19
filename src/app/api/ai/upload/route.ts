import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const allowedTypes = [
      "image/png",
      "image/jpeg",
      "image/webp",
      "image/gif",
      "model/gltf-binary",
      "model/gltf+json",
      "application/octet-stream",
    ];

    const allowedExtensions = [
      ".png",
      ".jpg",
      ".jpeg",
      ".webp",
      ".gif",
      ".glb",
      ".gltf",
      ".fbx",
      ".obj",
    ];

    const ext = path.extname(file.name).toLowerCase();

    if (
      !allowedTypes.includes(file.type) &&
      !allowedExtensions.includes(ext)
    ) {
      return NextResponse.json(
        { error: "Unsupported file type. Upload images (.png, .jpg, .webp) or 3D models (.glb, .gltf, .fbx, .obj)" },
        { status: 400 }
      );
    }

    if (file.size > 50 * 1024 * 1024) {
      return NextResponse.json(
        { error: "File too large. Maximum size is 50MB." },
        { status: 400 }
      );
    }

    const uploadDir = path.join(process.cwd(), "public", "uploads");
    await mkdir(uploadDir, { recursive: true });

    const timestamp = Date.now();
    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
    const fileName = `${timestamp}_${safeName}`;
    const filePath = path.join(uploadDir, fileName);

    const bytes = await file.arrayBuffer();
    await writeFile(filePath, Buffer.from(bytes));

    const isImage = [".png", ".jpg", ".jpeg", ".webp", ".gif"].includes(ext);
    const is3D = [".glb", ".gltf", ".fbx", ".obj"].includes(ext);

    return NextResponse.json({
      url: `/uploads/${fileName}`,
      name: file.name,
      size: file.size,
      type: isImage ? "image" : is3D ? "3d-model" : "unknown",
      mimeType: file.type,
    });
  } catch {
    return NextResponse.json(
      { error: "Upload failed" },
      { status: 500 }
    );
  }
}
