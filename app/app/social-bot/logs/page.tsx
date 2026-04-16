"use client";

import { useCallback, useEffect, useState } from "react";
import LogsPanel from "@/components/LogsPanel";
import { authFetch } from "@/lib/auth-fetch";

type LogEntry = {
  id: string;
  action: string;
  result: string;
  created_at: string;
};

export default function SocialBotLogsPage() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [loading, setLoading] = useState(true);

  const loadLogs = useCallback(async () => {
    setLoading(true);
    try {
      const res = await authFetch("/api/logs");
      const data = await res.json();
      setLogs(data.logs || []);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadLogs();
  }, [loadLogs]);

  return (
    <main className="studio-page">
      <section className="studio-card">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-semibold text-white">Activity Logs</h1>
            <p className="mt-1 text-sm text-slate-300">
              Monitor generation events, account connections, publishing, and post actions.
            </p>
          </div>
          <button
            type="button"
            onClick={() => void loadLogs()}
            className="rounded-lg border border-white/15 bg-slate-950 px-4 py-2 text-sm font-semibold text-slate-100 hover:bg-slate-900"
          >
            Refresh
          </button>
        </div>
      </section>

      {loading ? (
        <section className="studio-card text-sm text-slate-300">
          Loading logs...
        </section>
      ) : (
        <LogsPanel logs={logs} />
      )}
    </main>
  );
}
