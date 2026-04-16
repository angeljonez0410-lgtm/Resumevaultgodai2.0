"use client";

import { useState } from "react";
import { authFetch } from "../lib/auth-fetch";

export default function CalendarGenerator({
  onGenerated,
}: {
  onGenerated: () => Promise<void>;
}) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function handleGenerate() {
    setLoading(true);
    setMessage("");

    const res = await authFetch("/api/generate-calendar", {
      method: "POST",
    });

    const data = await res.json();

    if (!res.ok) {
      setMessage(data.error || "Failed to generate calendar");
      setLoading(false);
      return;
    }

    setMessage(`Generated ${data.count} scheduled posts`);
    setLoading(false);
    await onGenerated();
  }

  return (
    <div className="studio-card">
      <h2 className="text-xl font-bold text-white">30-Day Content Calendar</h2>
      <p className="mt-2 text-sm text-slate-300">Generate 30 scheduled AI post ideas using your current settings.</p>

      <button
        onClick={handleGenerate}
        className="mt-4 rounded-xl bg-emerald-600 px-5 py-3 font-semibold text-white hover:bg-emerald-700"
      >
        {loading ? "Generating..." : "Generate 30-Day Calendar"}
      </button>

      {message ? <p className="mt-4 text-sm text-slate-300">{message}</p> : null}
    </div>
  );
}
