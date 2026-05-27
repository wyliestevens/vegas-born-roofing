"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { Upload, Trash2, Copy, Check, Loader2, ImageIcon } from "lucide-react";

interface UploadedImage {
  path: string;
  name: string;
  url: string;
  size: number;
  sha: string;
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function ImagesPage() {
  const [images, setImages] = useState<UploadedImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const loadImages = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const res = await fetch("/api/admin/images");
      if (!res.ok) throw new Error("Failed to load images");
      const data = await res.json();
      setImages(data.images || []);
    } catch {
      setError("Failed to load images");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadImages();
  }, [loadImages]);

  async function handleUpload(files: FileList | null) {
    if (!files || files.length === 0) return;

    const file = files[0];

    if (!file.type.startsWith("image/")) {
      setError("Only image files are allowed.");
      return;
    }

    if (file.size > 8 * 1024 * 1024) {
      setError("File must be under 8MB.");
      return;
    }

    try {
      setUploading(true);
      setError("");

      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", "general");

      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Upload failed");
      }

      await loadImages();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  async function handleDelete(image: UploadedImage) {
    if (!confirm(`Delete "${image.name}"? This cannot be undone.`)) return;

    try {
      setDeleting(image.path);
      setError("");

      const res = await fetch("/api/admin/images", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ path: image.path }),
      });

      if (!res.ok) throw new Error("Failed to delete image");
      await loadImages();
    } catch {
      setError("Failed to delete image");
    } finally {
      setDeleting(null);
    }
  }

  async function handleCopy(url: string) {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(url);
      setTimeout(() => setCopied(null), 2000);
    } catch {
      setError("Failed to copy URL");
    }
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(false);
    handleUpload(e.dataTransfer.files);
  }

  function handleDragOver(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(true);
  }

  function handleDragLeave(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(false);
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-900">Media Library</h2>
        <p className="text-slate-500 text-sm mt-1">
          Upload and manage images for your website.
        </p>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
          {error}
        </div>
      )}

      {/* Upload Zone */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => fileInputRef.current?.click()}
        className={`mb-8 border-2 border-dashed rounded-lg p-10 text-center cursor-pointer transition-colors ${
          dragOver
            ? "border-red-500 bg-red-50"
            : "border-slate-300 hover:border-red-400 hover:bg-slate-50"
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={(e) => handleUpload(e.target.files)}
          className="hidden"
        />
        {uploading ? (
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="h-10 w-10 animate-spin text-red-600" />
            <p className="text-sm text-slate-600 font-medium">Uploading...</p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <Upload className="h-10 w-10 text-slate-400" />
            <p className="text-sm text-slate-600 font-medium">
              Drag and drop an image here, or click to browse
            </p>
            <p className="text-xs text-slate-400">
              PNG, JPG, WEBP, GIF, SVG up to 8MB
            </p>
          </div>
        )}
      </div>

      {/* Image Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
        </div>
      ) : images.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-12 text-center">
          <ImageIcon className="h-12 w-12 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-500 mb-1">No images uploaded yet.</p>
          <p className="text-slate-400 text-sm">
            Use the upload zone above to add your first image.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((image) => (
            <div
              key={image.path}
              className="group relative bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden"
            >
              {/* Image Preview */}
              <div className="aspect-square bg-slate-100 relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={image.url}
                  alt={image.name}
                  className="w-full h-full object-cover"
                />

                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCopy(image.url);
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-2 bg-white text-slate-700 rounded-md text-xs font-medium hover:bg-slate-100 transition-colors"
                  >
                    {copied === image.url ? (
                      <>
                        <Check className="h-3.5 w-3.5 text-green-600" />
                        Copied
                      </>
                    ) : (
                      <>
                        <Copy className="h-3.5 w-3.5" />
                        Copy URL
                      </>
                    )}
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(image);
                    }}
                    disabled={deleting === image.path}
                    className="inline-flex items-center gap-1.5 px-3 py-2 bg-red-600 text-white rounded-md text-xs font-medium hover:bg-red-700 transition-colors disabled:opacity-50"
                  >
                    {deleting === image.path ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <Trash2 className="h-3.5 w-3.5" />
                    )}
                    Delete
                  </button>
                </div>
              </div>

              {/* File Info */}
              <div className="px-3 py-2">
                <p className="text-xs font-medium text-slate-700 truncate">
                  {image.name}
                </p>
                <p className="text-xs text-slate-400">
                  {formatSize(image.size)}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
