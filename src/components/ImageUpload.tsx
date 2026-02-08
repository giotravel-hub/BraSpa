"use client";

import { useState, useRef } from "react";
import Image from "next/image";

interface ImageUploadProps {
  images: string[];
  onChange: (urls: string[]) => void;
}

export default function ImageUpload({ images, onChange }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const MAX_SIZE = 5 * 1024 * 1024; // 5MB
  const MAX_FILES = 3;

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files?.length) return;
    setError("");

    if (images.length + files.length > MAX_FILES) {
      setError(`Maximum ${MAX_FILES} photos allowed`);
      if (inputRef.current) inputRef.current.value = "";
      return;
    }

    for (let i = 0; i < files.length; i++) {
      if (files[i].size > MAX_SIZE) {
        setError(`"${files[i].name}" exceeds 5MB limit`);
        if (inputRef.current) inputRef.current.value = "";
        return;
      }
    }

    setUploading(true);
    try {
      const formData = new FormData();
      for (let i = 0; i < files.length; i++) {
        formData.append("files", files[i]);
      }

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        const { urls } = await res.json();
        onChange([...images, ...urls]);
      } else {
        const data = await res.json();
        setError(data.error || "Upload failed");
      }
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  const removeImage = (index: number) => {
    onChange(images.filter((_, i) => i !== index));
  };

  return (
    <div>
      <div className="flex flex-wrap gap-3 mb-3">
        {images.map((url, i) => (
          <div key={i} className="relative w-24 h-24">
            <Image
              src={url}
              alt={`Upload ${i + 1}`}
              fill
              className="object-cover rounded-lg"
              sizes="96px"
            />
            <button
              type="button"
              onClick={() => removeImage(i)}
              className="absolute -top-2 -right-2 bg-stone-700 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center hover:bg-stone-900"
            >
              x
            </button>
          </div>
        ))}
      </div>

      {error && (
        <p className="text-red-700 text-sm mb-2">{error}</p>
      )}

      <div className="flex items-center gap-3">
        <label className="inline-flex items-center gap-2 px-4 py-2 bg-plum-50 text-plum-700 rounded-lg cursor-pointer hover:bg-plum-100 border border-plum-200 transition-colors">
          {uploading ? "Uploading..." : "Add Photos"}
          <input
            ref={inputRef}
            type="file"
            multiple
            accept="image/jpeg,image/png,image/webp,image/gif"
            onChange={handleUpload}
            className="hidden"
            disabled={uploading || images.length >= MAX_FILES}
          />
        </label>
        <span className="text-xs text-stone-400">
          Max 5MB per file, up to {MAX_FILES} photos
        </span>
      </div>
    </div>
  );
}
