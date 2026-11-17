"use client";

import { useState } from "react";

export function FileField({
  label,
  accept,
  disabled,
  onFile,
}: {
  label: string;
  accept: string;
  disabled?: boolean;
  onFile: (file: File) => void;
}) {
  const [name, setName] = useState<string | null>(null);

  return (
    <label className="file-field">
      <input
        type="file"
        accept={accept}
        disabled={disabled}
        onChange={(e) => {
          const file = e.target.files?.[0];
          setName(file?.name ?? null);
          if (file) onFile(file);
          e.target.value = "";
        }}
      />
      <span className="outline">{label}</span>
      <span className="file-name">{name ?? "Nenhum arquivo selecionado"}</span>
    </label>
  );
}
