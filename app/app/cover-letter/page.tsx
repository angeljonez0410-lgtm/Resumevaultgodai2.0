"use client";

import { useState, useEffect } from "react";
import { authFetch } from "@/lib/auth-fetch";
import { Mail, Sparkles, Copy } from "lucide-react";

const tones = ["Professional", "Enthusiastic", "Conversational", "Formal", "Creative"];

export default function CoverLetterPage() {
  const [profile, setProfile] = useState<Record<string, string> | null>(null);
  const [jobTitle, setJobTitle] = useState("");
  const [company, setCompany] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [tone, setTone] = useState("Professional");
  const [letter, setLetter] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await authFetch("/api/profile");
        if (res.ok && !cancelled) setProfile(await res.json());
      } catch { /* ignore */ }
    })();
    return () => { cancelled = true; };
  }, []);

  const generate = async () => {
    if (!jobDescription.trim()) return;
    setLoading(true);
    try {
      const res = await authFetch("/api/ai-tools", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "cover-letter",
          jobTitle,
          company,
          jobDescription,
          fullName: profile?.full_name || "",
          skills: profile?.skills || "",
          experience: profile?.saved_resume || "",
          tone,
        }),
      });
      const data = await res.json();
      setLetter(data.letter);
    } catch { /* ignore */ }
    setLoading(false);
  };

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center">
          <Mail className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Cover Letter Generator</h1>
          <p className="text-sm text-slate-500">Write a compelling cover letter for any job</p>
        </div>
      </div>

      <div className="card p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="label">Job Title *</label>
            <input className="input" value={jobTitle} onChange={(e) => setJobTitle(e.target.value)} placeholder="e.g. Senior Developer" />
          </div>
          <div>
            <label className="label">Company *</label>
            <input className="input" value={company} onChange={(e) => setCompany(e.target.value)} placeholder="e.g. Google" />
          </div>
        </div>

        <div className="mb-4">
          <label className="label">Tone</label>
          <div className="flex flex-wrap gap-2">
            {tones.map((t) => (
              <button key={t} onClick={() => setTone(t)} className={`px-3 py-1.5 rounded-full text-xs font-medium transition ${tone === t ? "bg-purple-600 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}>
                {t}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-5">
          <label className="label">Job Description *</label>
          <textarea className="input min-h-[180px] resize-y" value={jobDescription} onChange={(e) => setJobDescription(e.target.value)} placeholder="Paste the job description..." />
        </div>

        <button onClick={generate} disabled={!jobDescription.trim() || loading} className="btn-primary gap-2 disabled:opacity-50">
          {loading ? "Generating..." : <><Sparkles className="w-5 h-5" /> Generate Cover Letter</>}
        </button>
      </div>

      {letter && (
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-slate-700">Your Cover Letter</h3>
            <button onClick={() => { navigator.clipboard.writeText(letter); alert("Copied!"); }} className="btn-secondary text-sm gap-1">
              <Copy className="w-4 h-4" /> Copy
            </button>
          </div>
          <div className="prose-resume text-slate-700 whitespace-pre-wrap text-sm">{letter}</div>
        </div>
      )}
    </div>
  );
}
