"use client";

import { useState, useEffect } from "react";
import { authFetch } from "@/lib/auth-fetch";
import { FileText, Trash2, Copy, Download } from "lucide-react";

interface Resume {
  id: string;
  title: string;
  content: string;
  job_title?: string;
  company?: string;
  type?: string;
  created_at: string;
}

export default function ResumeLibraryPage() {
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [selected, setSelected] = useState<Resume | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await authFetch("/api/resumes");
        if (res.ok && !cancelled) setResumes(await res.json());
      } catch { /* ignore */ }
    })();
    return () => { cancelled = true; };
  }, []);

  const deleteResume = async (id: string) => {
    if (!confirm("Delete this resume?")) return;
    await authFetch(`/api/resumes?id=${id}`, { method: "DELETE" });
    setResumes((prev) => prev.filter((r) => r.id !== id));
    if (selected?.id === id) setSelected(null);
  };

  const downloadTxt = (r: Resume) => {
    const blob = new Blob([r.content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${r.title.replace(/\s+/g, "_")}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center">
          <FileText className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Resume Library</h1>
          <p className="text-sm text-slate-500">All your saved resumes in one place</p>
        </div>
      </div>

      {resumes.length === 0 ? (
        <div className="card p-12 text-center">
          <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-500 font-medium">No resumes saved yet</p>
          <p className="text-sm text-slate-400 mt-1">Use the Resume Builder or Job Analyzer to generate resumes</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* List */}
          <div className="lg:col-span-1 space-y-3">
            {resumes.map((r) => (
              <div
                key={r.id}
                onClick={() => setSelected(r)}
                className={`card p-4 cursor-pointer transition-all hover:shadow-md ${selected?.id === r.id ? "ring-2 ring-indigo-400" : ""}`}
              >
                <div className="flex items-start justify-between">
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-slate-800 text-sm truncate">{r.title}</p>
                    {r.company && <p className="text-xs text-slate-500 mt-0.5">{r.company}</p>}
                    <p className="text-xs text-slate-400 mt-1">{new Date(r.created_at).toLocaleDateString()}</p>
                  </div>
                  <div className="flex items-center gap-1 ml-2 flex-shrink-0">
                    <button onClick={(e) => { e.stopPropagation(); downloadTxt(r); }} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600">
                      <Download className="w-4 h-4" />
                    </button>
                    <button onClick={(e) => { e.stopPropagation(); deleteResume(r.id); }} className="p-1.5 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-500">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                {r.type && (
                  <span className={`inline-block mt-2 px-2 py-0.5 rounded-full text-[10px] font-medium ${r.type === "tailored" ? "bg-blue-50 text-blue-700" : "bg-emerald-50 text-emerald-700"}`}>
                    {r.type}
                  </span>
                )}
              </div>
            ))}
          </div>

          {/* Preview */}
          <div className="lg:col-span-2">
            {selected ? (
              <div className="card p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-semibold text-slate-800">{selected.title}</h2>
                  <button onClick={() => { navigator.clipboard.writeText(selected.content); alert("Copied!"); }} className="btn-secondary text-sm gap-1">
                    <Copy className="w-4 h-4" /> Copy
                  </button>
                </div>
                <div className="prose-resume text-slate-700 whitespace-pre-wrap text-sm border-t pt-4">{selected.content}</div>
              </div>
            ) : (
              <div className="card p-12 text-center">
                <p className="text-slate-400">Select a resume to preview</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
