type LogEntry = {
  id: string;
  action: string;
  result: string;
  created_at: string;
};

export default function LogsPanel({
  logs,
}: {
  logs: LogEntry[];
}) {
  return (
    <div className="studio-card">
      <h2 className="text-xl font-bold text-white">Logs</h2>

      <div className="mt-4 space-y-3">
        {logs.map((log) => (
          <div key={log.id} className="rounded-xl border border-white/10 bg-slate-950/70 p-3">
            <div className="font-semibold text-white">{log.action}</div>
            <div className="mt-1 text-sm text-slate-300">{log.result}</div>
            <div className="mt-2 text-xs text-slate-500">{new Date(log.created_at).toLocaleString()}</div>
          </div>
        ))}

        {!logs.length && <p className="text-sm text-slate-400">No logs yet</p>}
      </div>
    </div>
  );
}
