"use client";

import { useState, useEffect } from "react";
import { authFetch } from "@/lib/auth-fetch";
import { Search, Sparkles, FileText } from "lucide-react";

export default function JobAnalyzerPage() {
  const [jobTitle, setJobTitle] = useState("");
  const [company, setCompany] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [analysis, setAnalysis] = useState("");
  const [keywords, setKeywords] = useState<Record<string, string[]> | null>(null);
  const [resume, setResume] = useState("");
  const [loading, setLoading] = useState(false);
  const [buildingResume, setBuildingResume] = useState(false);
  const [step, setStep] = useState(1);

  // Profile data
  const [profile, setProfile] = useState<Record<string, string> | null>(null);
  const [useOldResume, setUseOldResume] = useState(true);
  const [generateExperience, setGenerateExperience] = useState(false);

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

  const analyzeJob = async () => {
    if (!jobDescription.trim()) return;
    setLoading(true);
    try {
      const res = await authFetch("/api/ai-tools", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "analyze-job", jobTitle, company, jobDescription }),
      });
      const data = await res.json();
      setAnalysis(data.analysis);
      setKeywords(data.keywords);
      setStep(2);
    } catch { /* ignore */ }
    setLoading(false);
  };

  const buildResume = async () => {
    setBuildingResume(true);
    try {
      const res = await authFetch("/api/ai-tools", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "build-resume",
          jobTitle,
          company,
          jobDescription,
          fullName: profile?.full_name || "",
          email: profile?.email_address || "",
          phone: profile?.phone || "",
          location: profile?.location || "",
          skills: profile?.skills || "",
          education: profile?.education ? JSON.stringify(profile.education) : "",
          oldResume: useOldResume ? profile?.saved_resume || "" : "",
          generateExperience,
        }),
      });
      const data = await res.json();
      setResume(data.resume);
    } catch { /* ignore */ }
    setBuildingResume(false);
  };

  const saveResume = async () => {
    if (!resume) return;
    await authFetch("/api/resumes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: `${jobTitle} Resume`, content: resume, job_title: jobTitle, company, type: "tailored" }),
    });
    alert("Resume saved to library!");
  };

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
          <Search className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Job Analyzer</h1>
          <p className="text-sm text-slate-500">Extract ATS keywords &amp; build an optimized resume</p>
        </div>
      </div>

      {/* Step 1: Analyze */}
      <div className="card p-6 mb-6">
        <h2 className="font-semibold text-slate-700 mb-4 flex items-center gap-2">
          <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 text-xs flex items-center justify-center font-bold">1</span>
          Paste Job Description
        </h2>
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
        <div className="mb-4">
          <label className="label">Job Description *</label>
          <textarea className="input min-h-[180px] resize-y" value={jobDescription} onChange={(e) => setJobDescription(e.target.value)} placeholder="Paste the full job description here..." />
        </div>
        <button onClick={analyzeJob} disabled={!jobDescription.trim() || loading} className="btn-primary gap-2 disabled:opacity-50">
          {loading ? (
            <><span className="animate-spin">⏳</span> Analyzing...</>
          ) : (
            <><Sparkles className="w-4 h-4" /> Analyze Job</>
          )}
        </button>
      </div>

      {/* Keywords */}
      {keywords && (
        <div className="card p-6 mb-6">
          <h3 className="font-semibold text-slate-700 mb-3">ATS Keywords Found</h3>
          <div className="space-y-3">
            {Object.entries(keywords).map(([category, words]) => (
              <div key={category}>
                <p className="text-xs font-semibold text-slate-500 uppercase mb-1">{category.replace(/_/g, " ")}</p>
                <div className="flex flex-wrap gap-1.5">
                  {(words as string[]).map((w: string, i: number) => (
                    <span key={i} className="inline-block px-2.5 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700">{w}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Analysis */}
      {analysis && (
        <div className="card p-6 mb-6">
          <h3 className="font-semibold text-slate-700 mb-3">Job Analysis</h3>
          <div className="prose-resume text-slate-700 whitespace-pre-wrap text-sm">{analysis}</div>
        </div>
      )}

      {/* Step 2: Build Resume */}
      {step === 2 && (
        <div className="card p-6 mb-6">
          <h2 className="font-semibold text-slate-700 mb-4 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 text-xs flex items-center justify-center font-bold">2</span>
            Build Optimized Resume
          </h2>

          <div className="bg-slate-50 rounded-lg p-4 mb-5 space-y-3 border border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-700">Use Old Resume</p>
                <p className="text-xs text-slate-500">Include your existing resume data</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" checked={useOldResume} onChange={(e) => setUseOldResume(e.target.checked)} className="sr-only peer" />
                <div className="w-9 h-5 bg-gray-300 rounded-full peer peer-checked:bg-emerald-500 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-full"></div>
              </label>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-700">AI Generate Experience</p>
                <p className="text-xs text-slate-500">Let AI expand experience if needed</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" checked={generateExperience} onChange={(e) => setGenerateExperience(e.target.checked)} className="sr-only peer" />
                <div className="w-9 h-5 bg-gray-300 rounded-full peer peer-checked:bg-emerald-500 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-full"></div>
              </label>
            </div>
          </div>

          <button onClick={buildResume} disabled={buildingResume} className="btn-primary gap-2 disabled:opacity-50">
            {buildingResume ? (
              <><span className="animate-spin">⏳</span> Building Resume...</>
            ) : (
              <><FileText className="w-4 h-4" /> Build ATS Resume (98-100%)</>
            )}
          </button>
        </div>
      )}

      {/* Resume Output */}
      {resume && (
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-slate-700">Generated Resume</h3>
            <div className="flex gap-2">
              <button onClick={saveResume} className="btn text-sm bg-green-600 text-white hover:bg-green-700">Save to Library</button>
              <button onClick={() => { navigator.clipboard.writeText(resume); alert("Copied!"); }} className="btn-secondary text-sm">Copy</button>
            </div>
          </div>
          <div className="prose-resume bg-white border rounded-xl p-6 text-slate-700 whitespace-pre-wrap text-sm">{resume}</div>
        </div>
      )}
    </div>
  );
}
