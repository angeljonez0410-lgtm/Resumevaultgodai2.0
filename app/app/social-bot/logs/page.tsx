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
    <main className="space-y-6">
      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">Activity Logs</h1>
            <p className="mt-1 text-sm text-slate-600">
              Monitor generation events, account connections, publishing, and post actions.
            </p>
          </div>
          <button
            type="button"
            onClick={() => void loadLogs()}
            className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
          >
            Refresh
          </button>
        </div>
      </section>

      {loading ? (
        <section className="rounded-xl border border-slate-200 bg-white p-6 text-sm text-slate-500 shadow-sm">
          Loading logs...
        </section>
      ) : (
        <LogsPanel logs={logs} />
      )}
    </main>
  );
}
