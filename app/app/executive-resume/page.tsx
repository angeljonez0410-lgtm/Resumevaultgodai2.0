"use client";

import { useState } from "react";
import { authFetch } from "@/lib/auth-fetch";
import { Crown, Sparkles, Copy } from "lucide-react";

export default function ExecutiveResumePage() {
  const [fullName, setFullName] = useState("");
  const [targetRole, setTargetRole] = useState("");
  const [industry, setIndustry] = useState("");
  const [experience, setExperience] = useState("");
  const [achievements, setAchievements] = useState("");
  const [resume, setResume] = useState("");
  const [loading, setLoading] = useState(false);

  const generate = async () => {
    if (!targetRole.trim()) return;
    setLoading(true);
    try {
      const res = await authFetch("/api/ai-tools", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "executive-resume", fullName, targetRole, industry, experience, achievements }),
      });
      const data = await res.json();
      setResume(data.resume);
    } catch { /* ignore */ }
    setLoading(false);
  };

  const save = async () => {
    if (!resume) return;
    await authFetch("/api/resumes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: `Executive: ${targetRole}`, content: resume, job_title: targetRole, type: "executive" }),
    });
    alert("Saved to library!");
  };

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-slate-700 to-slate-900 flex items-center justify-center">
          <Crown className="w-5 h-5 text-amber-400" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Executive Resume</h1>
          <p className="text-sm text-slate-500">C-suite &amp; senior leadership resume builder</p>
        </div>
      </div>

      <div className="card p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div><label className="label">Full Name</label><input className="input" value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Jane Smith" /></div>
          <div><label className="label">Target Role *</label><input className="input" value={targetRole} onChange={(e) => setTargetRole(e.target.value)} placeholder="VP of Engineering" /></div>
          <div><label className="label">Industry</label><input className="input" value={industry} onChange={(e) => setIndustry(e.target.value)} placeholder="Technology" /></div>
        </div>
        <div className="mb-4">
          <label className="label">Leadership Experience</label>
          <textarea className="input min-h-[120px] resize-y" value={experience} onChange={(e) => setExperience(e.target.value)} placeholder="Describe your leadership roles, team sizes, P&L responsibility..." />
        </div>
        <div className="mb-5">
          <label className="label">Key Achievements</label>
          <textarea className="input min-h-[100px] resize-y" value={achievements} onChange={(e) => setAchievements(e.target.value)} placeholder="Revenue growth, cost savings, major initiatives, awards..." />
        </div>
        <button onClick={generate} disabled={!targetRole.trim() || loading} className="btn-primary gap-2 disabled:opacity-50">
          {loading ? "Crafting executive resume..." : <><Sparkles className="w-5 h-5" /> Generate Executive Resume</>}
        </button>
      </div>

      {resume && (
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-slate-700">Executive Resume</h3>
            <div className="flex gap-2">
              <button onClick={save} className="btn text-sm bg-green-600 text-white hover:bg-green-700">Save to Library</button>
              <button onClick={() => { navigator.clipboard.writeText(resume); alert("Copied!"); }} className="btn-secondary text-sm gap-1"><Copy className="w-4 h-4" /> Copy</button>
            </div>
          </div>
          <div className="prose-resume text-slate-700 whitespace-pre-wrap text-sm">{resume}</div>
        </div>
      )}
    </div>
  );
}
