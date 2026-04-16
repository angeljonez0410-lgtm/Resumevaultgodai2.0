"use client";

import { useState } from "react";

export default function PublishingPanel({
  onRun,
}: {
  onRun: () => Promise<void>;
}) {
  const [secret, setSecret] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function runPublishing() {
    setLoading(true);
    setMessage("");

    const res = await fetch("/api/publish-scheduled", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${secret}`,
      },
    });

    const data = await res.json();

    if (!res.ok) {
      setMessage(data.error || "Failed to run publishing");
      setLoading(false);
      return;
    }

    setMessage(`Processed ${data.processed} scheduled posts`);
    setLoading(false);
    await onRun();
  }

  return (
    <div className="studio-card">
      <h2 className="text-xl font-bold text-white">Scheduled Publishing</h2>
      <p className="mt-2 text-sm text-slate-300">Manually trigger publishing for all due scheduled posts.</p>

      <div className="mt-4 space-y-4">
        <div>
          <label className="mb-1 block text-sm font-semibold text-slate-300">Cron Secret</label>
          <input
            type="password"
            className="studio-input"
            value={secret}
            onChange={(e) => setSecret(e.target.value)}
            placeholder="Enter CRON_SECRET"
          />
        </div>

        <button
          onClick={runPublishing}
          className="rounded-xl bg-orange-600 px-5 py-3 font-semibold text-white hover:bg-orange-700"
        >
          {loading ? "Running..." : "Run Scheduled Publishing"}
        </button>

        {message ? <p className="text-sm text-slate-300">{message}</p> : null}
      </div>
    </div>
  );
}
