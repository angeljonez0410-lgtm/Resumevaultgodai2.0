"use client";

import { useState, useEffect } from "react";
import { authFetch } from "@/lib/auth-fetch";
import { Zap, Sparkles, Search, Check } from "lucide-react";

export default function AutoApplyPage() {
  const [profile, setProfile] = useState<Record<string, string> | null>(null);
  const [step, setStep] = useState(1);
  const [targetRole, setTargetRole] = useState("");
  const [location, setLocation] = useState("");
  const [experienceLevel, setExperienceLevel] = useState("Mid-level");
  const [jobs, setJobs] = useState<Record<string, unknown>[]>([]);
  const [selectedJobs, setSelectedJobs] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);
  const [packages, setPackages] = useState<Record<number, string>>({});
  const [generatingIdx, setGeneratingIdx] = useState<number | null>(null);

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

  const searchJobs = async () => {
    if (!targetRole.trim()) return;
    setLoading(true);
    try {
      const res = await authFetch("/api/ai-tools", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "auto-apply",
          targetRole,
          location,
          experienceLevel,
          skills: profile?.skills || "",
        }),
      });
      const data = await res.json();
      const jobList = Array.isArray(data.jobs) ? data.jobs : data.jobs?.jobs || [];
      setJobs(jobList);
      setStep(2);
    } catch { /* ignore */ }
    setLoading(false);
  };

  const toggleJob = (i: number) => {
    setSelectedJobs((prev) => prev.includes(i) ? prev.filter((x) => x !== i) : [...prev, i]);
  };

  const generatePackage = async (i: number) => {
    const job = jobs[i];
    setGeneratingIdx(i);
    try {
      const res = await authFetch("/api/ai-tools", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "build-resume",
          jobTitle: job.title as string,
          company: job.company as string,
          jobDescription: job.description as string,
          fullName: profile?.full_name || "",
          email: profile?.email_address || "",
          phone: profile?.phone || "",
          location: profile?.location || "",
          skills: profile?.skills || "",
          education: profile?.education ? JSON.stringify(profile.education) : "",
          oldResume: profile?.saved_resume || "",
          generateExperience: true,
        }),
      });
      const data = await res.json();
      setPackages((prev) => ({ ...prev, [i]: data.resume }));
    } catch { /* ignore */ }
    setGeneratingIdx(null);
  };

  return (
    <div>
      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
          <Zap className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Auto Apply</h1>
          <p className="text-sm text-slate-500">Find jobs &amp; generate application packages</p>
        </div>
        <span className="ml-auto px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-semibold flex items-center gap-1"><Zap className="w-3 h-3" /> Premium</span>
      </div>

      {/* Step 1: Search */}
      <div className="card p-6 mb-6 mt-6">
        <h2 className="font-semibold text-slate-700 mb-4 flex items-center gap-2">
          <span className={`w-6 h-6 rounded-full text-xs flex items-center justify-center font-bold ${step >= 1 ? "bg-amber-100 text-amber-700" : "bg-slate-100 text-slate-500"}`}>1</span>
          Search for Jobs
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div><label className="label">Target Role *</label><input className="input" value={targetRole} onChange={(e) => setTargetRole(e.target.value)} placeholder="Software Engineer" /></div>
          <div><label className="label">Location</label><input className="input" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Remote" /></div>
          <div>
            <label className="label">Experience Level</label>
            <select className="input" value={experienceLevel} onChange={(e) => setExperienceLevel(e.target.value)}>
              <option>Entry-level</option><option>Mid-level</option><option>Senior</option><option>Lead</option>
            </select>
          </div>
        </div>
        <button onClick={searchJobs} disabled={!targetRole.trim() || loading} className="btn-primary gap-2 disabled:opacity-50">
          {loading ? "Searching..." : <><Search className="w-4 h-4" /> Search Jobs</>}
        </button>
      </div>

      {/* Step 2: Select */}
      {step >= 2 && jobs.length > 0 && (
        <div className="card p-6 mb-6">
          <h2 className="font-semibold text-slate-700 mb-4 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-amber-100 text-amber-700 text-xs flex items-center justify-center font-bold">2</span>
            Select Jobs ({selectedJobs.length} selected)
          </h2>
          <div className="space-y-3">
            {jobs.map((job, i) => (
              <div key={i} className={`p-4 rounded-xl border-2 transition cursor-pointer ${selectedJobs.includes(i) ? "border-amber-400 bg-amber-50" : "border-slate-200 hover:border-slate-300"}`} onClick={() => toggleJob(i)}>
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-slate-800">{job.title as string}</p>
                      {(job.match_score as number) >= 80 && (
                        <span className="px-2 py-0.5 rounded-full bg-green-50 text-green-700 text-[10px] font-bold">{job.match_score as number}% match</span>
                      )}
                    </div>
                    <p className="text-sm text-slate-600">{job.company as string} · {job.location as string}</p>
                    <p className="text-xs text-slate-500 mt-1">{job.description as string}</p>
                    {job.salary_range ? <p className="text-xs text-emerald-600 font-medium mt-1">{job.salary_range as string}</p> : null}
                  </div>
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ml-3 ${selectedJobs.includes(i) ? "border-amber-500 bg-amber-500" : "border-slate-300"}`}>
                    {selectedJobs.includes(i) && <Check className="w-3 h-3 text-white" />}
                  </div>
                </div>
                {packages[i] && (
                  <div className="mt-3 pt-3 border-t border-slate-200">
                    <p className="text-xs font-semibold text-green-700 mb-1">✅ Application package ready</p>
                    <button onClick={(e) => { e.stopPropagation(); navigator.clipboard.writeText(packages[i]); alert("Copied!"); }} className="btn-secondary text-xs">Copy Resume</button>
                  </div>
                )}
              </div>
            ))}
          </div>
          {selectedJobs.length > 0 && (
            <div className="mt-4 flex gap-2">
              {selectedJobs.map((i) => (
                <button
                  key={i}
                  onClick={() => generatePackage(i)}
                  disabled={generatingIdx !== null}
                  className="btn text-xs bg-amber-500 text-white hover:bg-amber-600 gap-1 disabled:opacity-50"
                >
                  {generatingIdx === i ? "Generating..." : packages[i] ? "✅ Done" : <><Sparkles className="w-3 h-3" /> Generate for {(jobs[i].company as string)}</>}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
