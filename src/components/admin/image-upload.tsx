"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";

interface ImageUploadProps {
  bucket: "business-logos" | "business-covers" | "business-gallery";
  pathPrefix: string; // usually the business id
  value: string | null;
  onChange: (url: string | null) => void;
  label: string;
  aspect?: "square" | "wide";
}

/** Uploads directly to Supabase Storage from the browser (admin session,
 * RLS on storage.objects requires is_admin()). Stores only the resulting
 * public URL on the business row -- see 0011_storage.sql. */
export function ImageUpload({
  bucket,
  pathPrefix,
  value,
  onChange,
  label,
  aspect = "wide",
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFile(file: File) {
    setUploading(true);
    setError(null);
    try {
      const supabase = createClient();
      const ext = file.name.split(".").pop();
      const path = `${pathPrefix}/${crypto.randomUUID()}.${ext}`;
      const { error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(path, file, { upsert: true });
      if (uploadError) throw uploadError;
      const { data } = supabase.storage.from(bucket).getPublicUrl(path);
      onChange(data.publicUrl);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al subir la imagen");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div>
      <p className="mb-1 text-sm font-medium">{label}</p>
      <div
        className={
          aspect === "square"
            ? "relative h-24 w-24 overflow-hidden rounded-lg border border-dashed border-border bg-secondary"
            : "relative h-32 w-full overflow-hidden rounded-lg border border-dashed border-border bg-secondary"
        }
      >
        {value && <Image src={value} alt="" fill className="object-cover" />}
        {value && (
          <button
            type="button"
            onClick={() => onChange(null)}
            className="absolute right-1 top-1 rounded-full bg-black/60 p-1 text-white"
            aria-label="Quitar imagen"
          >
            <X className="h-3 w-3" />
          </button>
        )}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
          e.target.value = "";
        }}
      />
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="mt-2"
        disabled={uploading}
        onClick={() => inputRef.current?.click()}
      >
        <Upload className="h-3.5 w-3.5" />
        {uploading ? "Subiendo..." : value ? "Cambiar" : "Subir imagen"}
      </Button>
      {error && <p className="mt-1 text-xs text-destructive">{error}</p>}
    </div>
  );
}
