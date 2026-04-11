"use client";

import { useState, useEffect } from "react";
import { authFetch } from "@/lib/auth-fetch";
import { FileText, Sparkles, Briefcase, User, Check, Zap, AlertCircle } from "lucide-react";
import Link from "next/link";

function OptionsPanel({ useOldResume, setUseOldResume, generateExperience, setGenerateExperience, onePage, setOnePage }: {
  useOldResume: boolean; setUseOldResume: (v: boolean) => void;
  generateExperience: boolean; setGenerateExperience: (v: boolean) => void;
  onePage: boolean; setOnePage: (v: boolean) => void;
}) {
  return (
    <div className="bg-slate-50 rounded-lg p-4 mb-5 space-y-3 border border-slate-200">
      <h4 className="font-semibold text-slate-700 text-sm mb-3">Resume Options</h4>
      {[
        { label: "Use Old Resume", desc: "Include your existing resume data", checked: useOldResume, onChange: setUseOldResume },
        { label: "AI Generate Experience", desc: "Let AI expand experience if needed", checked: generateExperience, onChange: setGenerateExperience },
        { label: "1-Page Resume", desc: "Condense to one page", checked: onePage, onChange: setOnePage, premium: true },
      ].map((opt) => (
        <div key={opt.label} className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-700">{opt.label}</p>
            <p className="text-xs text-slate-500">{opt.desc}</p>
          </div>
          {opt.premium ? (
            <span className="text-xs text-amber-600 flex items-center gap-1"><Zap className="w-3 h-3" /> Premium</span>
          ) : (
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" checked={opt.checked} onChange={(e) => opt.onChange(e.target.checked)} className="sr-only peer" />
              <div className="w-9 h-5 bg-gray-300 rounded-full peer peer-checked:bg-emerald-500 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-full"></div>
            </label>
          )}
        </div>
      ))}
    </div>
  );
}

function ResumeOutput({ content, type, onSave, savedMsg }: {
  content: string; type: "tailored" | "general";
  onSave: (type: "tailored" | "general") => void; savedMsg: string;
}) {
  return (
    <div className="mt-6 space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-slate-600">✅ Resume generated — review below, then save or download.</p>
        <div className="flex gap-2">
          <button onClick={() => onSave(type)} className="btn text-sm bg-green-600 text-white hover:bg-green-700 gap-1">
            {savedMsg === type ? <><Check className="w-4 h-4" /> Saved!</> : <><FileText className="w-4 h-4" /> Save to Library</>}
          </button>
          <button onClick={() => { navigator.clipboard.writeText(content); alert("Copied!"); }} className="btn-secondary text-sm">Copy</button>
        </div>
      </div>
      <div className="prose-resume card p-6 text-slate-700 whitespace-pre-wrap text-sm">{content}</div>
    </div>
  );
}

export default function ResumeBuilderPage() {
  const [tab, setTab] = useState<"tailored" | "general">("tailored");
  const [profile, setProfile] = useState<Record<string, unknown> | null>(null);

  // Tailored to job
  const [jobTitle, setJobTitle] = useState("");
  const [company, setCompany] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [tailoredResume, setTailoredResume] = useState("");

  // General
  const [generalJD, setGeneralJD] = useState("");
  const [generalResume, setGeneralResume] = useState("");

  // Options
  const [useOldResume, setUseOldResume] = useState(true);
  const [generateExperience, setGenerateExperience] = useState(false);
  const [onePage, setOnePage] = useState(false);

  const [loading, setLoading] = useState(false);
  const [savedMsg, setSavedMsg] = useState("");

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

  const generateResume = async (type: "tailored" | "general") => {
    const jd = type === "tailored" ? jobDescription : generalJD;
    if (!jd.trim()) return;
    setLoading(true);
    try {
      const res = await authFetch("/api/ai-tools", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "build-resume",
          jobTitle: type === "tailored" ? jobTitle : "",
          company: type === "tailored" ? company : "",
          jobDescription: jd,
          fullName: (profile?.full_name as string) || "",
          email: (profile?.email_address as string) || "",
          phone: (profile?.phone as string) || "",
          location: (profile?.location as string) || "",
          skills: (profile?.skills as string) || "",
          education: profile?.education ? JSON.stringify(profile.education) : "",
          oldResume: useOldResume ? (profile?.saved_resume as string) || "" : "",
          generateExperience,
          onePage,
        }),
      });
      const data = await res.json();
      if (type === "tailored") setTailoredResume(data.resume);
      else setGeneralResume(data.resume);
    } catch { /* ignore */ }
    setLoading(false);
  };

  const saveResume = async (type: "tailored" | "general") => {
    const content = type === "tailored" ? tailoredResume : generalResume;
    if (!content) return;
    await authFetch("/api/resumes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: type === "tailored" && jobTitle ? `${jobTitle} Resume` : "General Resume",
        content,
        job_title: jobTitle || "",
        company: company || "",
        type,
      }),
    });
    setSavedMsg(type);
    setTimeout(() => setSavedMsg(""), 3000);
  };

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center">
          <FileText className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Resume Builder</h1>
          <p className="text-sm text-slate-500">Generate ATS-optimized resumes from your profile</p>
        </div>
      </div>

      {!profile?.full_name && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0" />
          <p className="text-sm text-amber-800">
            <Link href="/app/profile" className="underline font-medium">Set up your profile</Link> first for fully personalized resumes.
          </p>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-2 mb-6 bg-slate-100 p-1 rounded-xl w-fit">
        <button onClick={() => setTab("tailored")} className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition ${tab === "tailored" ? "bg-white shadow text-slate-800" : "text-slate-500"}`}>
          <Briefcase className="w-4 h-4" /> Tailor to Job
        </button>
        <button onClick={() => setTab("general")} className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition ${tab === "general" ? "bg-white shadow text-slate-800" : "text-slate-500"}`}>
          <User className="w-4 h-4" /> Build from Profile
        </button>
      </div>

      {tab === "tailored" && (
        <div>
          <div className="card p-6 mb-6">
            <p className="text-sm text-slate-500 mb-5">Paste a job description and we&apos;ll generate a resume precisely tailored to that role — optimized for 98-100% ATS match.</p>
            <OptionsPanel useOldResume={useOldResume} setUseOldResume={setUseOldResume} generateExperience={generateExperience} setGenerateExperience={setGenerateExperience} onePage={onePage} setOnePage={setOnePage} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="label">Job Title</label>
                <input className="input" value={jobTitle} onChange={(e) => setJobTitle(e.target.value)} placeholder="e.g. Senior Product Manager" />
              </div>
              <div>
                <label className="label">Company</label>
                <input className="input" value={company} onChange={(e) => setCompany(e.target.value)} placeholder="e.g. Google" />
              </div>
            </div>
            <div className="mb-5">
              <label className="label">Job Description *</label>
              <textarea className="input min-h-[180px] resize-y" value={jobDescription} onChange={(e) => setJobDescription(e.target.value)} placeholder="Paste the full job description here..." />
            </div>
            <button onClick={() => generateResume("tailored")} disabled={!jobDescription.trim() || loading} className="btn-primary gap-2 disabled:opacity-50">
              {loading ? "Generating..." : <><Sparkles className="w-5 h-5" /> Generate Resume (98-100% ATS)</>}
            </button>
          </div>
          {tailoredResume && !loading && <ResumeOutput content={tailoredResume} type="tailored" onSave={saveResume} savedMsg={savedMsg} />}
        </div>
      )}

      {tab === "general" && (
        <div>
          <div className="card p-6 mb-6">
            <p className="text-sm text-slate-500 mb-5">Generate a comprehensive resume from your profile data — paste a job description to optimize for ATS.</p>
            <OptionsPanel useOldResume={useOldResume} setUseOldResume={setUseOldResume} generateExperience={generateExperience} setGenerateExperience={setGenerateExperience} onePage={onePage} setOnePage={setOnePage} />
            <div className="mb-5">
              <label className="label">Job Description *</label>
              <textarea className="input min-h-[180px] resize-y" value={generalJD} onChange={(e) => setGeneralJD(e.target.value)} placeholder="Paste the full job description here..." />
            </div>
            <button onClick={() => generateResume("general")} disabled={!generalJD.trim() || loading} className="btn-primary gap-2 disabled:opacity-50">
              {loading ? "Generating..." : <><Sparkles className="w-5 h-5" /> Generate Resume (98-100% ATS)</>}
            </button>
          </div>
          {generalResume && !loading && <ResumeOutput content={generalResume} type="general" onSave={saveResume} savedMsg={savedMsg} />}
        </div>
      )}
    </div>
  );
}
