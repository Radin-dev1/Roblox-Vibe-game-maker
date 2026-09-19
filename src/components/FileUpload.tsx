"use client";

import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface UploadedFile {
  url: string;
  name: string;
  size: number;
  type: "image" | "3d-model" | "unknown";
}

interface FileUploadProps {
  onUpload: (file: UploadedFile) => void;
  compact?: boolean;
}

export default function FileUpload({ onUpload, compact = false }: FileUploadProps) {
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(
    async (file: File) => {
      setError(null);
      setUploading(true);

      try {
        const formData = new FormData();
        formData.append("file", file);

        const res = await fetch("/api/ai/upload", {
          method: "POST",
          body: formData,
        });

        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || "Upload failed");
        }

        const data = await res.json();
        onUpload(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Upload failed");
      } finally {
        setUploading(false);
      }
    },
    [onUpload]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  if (compact) {
    return (
      <>
        <button
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="flex items-center justify-center w-9 h-9 rounded-full bg-[var(--bg-overlay)] border border-[var(--edge)] hover:border-[var(--edge-hover)] transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] active:scale-[0.93] disabled:opacity-40"
          aria-label="Upload file"
        >
          {uploading ? (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="animate-spin-slow" style={{ color: "var(--text-muted)" }}>
              <path d="M21 12a9 9 0 11-6.219-8.56" />
            </svg>
          ) : (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: "var(--text-muted)" }}>
              <path d="M21.44 11.05l-9.19 9.19a6 6 0 01-8.49-8.49l9.19-9.19a4 4 0 015.66 5.66l-9.2 9.19a2 2 0 01-2.83-2.83l8.49-8.48" />
            </svg>
          )}
        </button>
        <input
          ref={inputRef}
          type="file"
          accept="image/*,.glb,.gltf,.fbx,.obj"
          onChange={handleChange}
          className="hidden"
        />
      </>
    );
  }

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={handleDrop}
      onClick={() => inputRef.current?.click()}
      className={`relative cursor-pointer rounded-2xl border-2 border-dashed p-8 text-center transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] ${
        dragging
          ? "border-accent bg-accent/5 scale-[1.01]"
          : "border-[var(--edge)] hover:border-[var(--edge-hover)] hover:bg-[var(--bg-overlay)]"
      }`}
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/*,.glb,.gltf,.fbx,.obj"
        onChange={handleChange}
        className="hidden"
      />

      {uploading ? (
        <div className="flex flex-col items-center gap-3">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="animate-spin-slow" style={{ color: "var(--text-muted)" }}>
            <path d="M21 12a9 9 0 11-6.219-8.56" />
          </svg>
          <p className="text-[13px]" style={{ color: "var(--text-muted)" }}>
            Uploading...
          </p>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-3">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: "var(--text-faint)" }}>
            <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
            <polyline points="17 8 12 3 7 8" />
            <line x1="12" y1="3" x2="12" y2="15" />
          </svg>
          <div>
            <p className="text-[13px] font-medium" style={{ color: "var(--text-secondary)" }}>
              Drop images or 3D models here
            </p>
            <p className="text-[11px] mt-1" style={{ color: "var(--text-faint)" }}>
              PNG, JPG, WebP, GLB, GLTF, FBX, OBJ — up to 50MB
            </p>
          </div>
        </div>
      )}

      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mt-3 text-[12px] text-danger"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}
