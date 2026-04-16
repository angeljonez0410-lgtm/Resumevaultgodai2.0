"use client";

import { useEffect, useState } from "react";
import { authFetch } from "../lib/auth-fetch";

type MediaFile = {
  name: string;
  filePath: string;
  publicUrl: string;
  createdAt?: string;
};

export default function MediaLibrary({
  onSelect,
  refreshKey,
}: {
  onSelect: (url: string) => void;
  refreshKey: number;
}) {
  const [files, setFiles] = useState<MediaFile[]>([]);
  const [message, setMessage] = useState("");

  async function loadFiles() {
    const res = await authFetch("/api/media-library");
    const data = await res.json();

    if (!res.ok) {
      setMessage(data.error || "Failed to load media");
      return;
    }

    setFiles(data.files || []);
  }

  useEffect(() => {
    void loadFiles();
  }, [refreshKey]);

  return (
    <div className="studio-card">
      <h3 className="text-lg font-bold text-white">Media Library</h3>

      {message ? <p className="mt-3 text-sm text-slate-300">{message}</p> : null}

      <div className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
        {files.map((file) => (
          <button
            key={file.filePath}
            type="button"
            onClick={() => onSelect(file.publicUrl)}
            className="rounded-xl border border-white/10 bg-slate-950/60 p-2 text-left transition hover:border-cyan-400/40"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={file.publicUrl} alt={file.name} className="h-32 w-full rounded-lg object-cover" />
            <p className="mt-2 break-all text-xs text-slate-300">{file.name}</p>
          </button>
        ))}
      </div>

      {!files.length ? <p className="mt-4 text-sm text-slate-500">No uploaded media yet</p> : null}
    </div>
  );
}
