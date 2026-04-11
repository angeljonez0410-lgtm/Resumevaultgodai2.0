"use client";

import { useState } from "react";
import { authFetch } from "@/lib/auth-fetch";
import { DollarSign, Sparkles, Zap } from "lucide-react";

export default function SalaryNegotiationPage() {
  const [jobTitle, setJobTitle] = useState("");
  const [company, setCompany] = useState("");
  const [currentSalary, setCurrentSalary] = useState("");
  const [targetSalary, setTargetSalary] = useState("");
  const [location, setLocation] = useState("");
  const [experienceLevel, setExperienceLevel] = useState("");
  const [strategy, setStrategy] = useState("");
  const [loading, setLoading] = useState(false);

  const generate = async () => {
    if (!jobTitle.trim()) return;
    setLoading(true);
    try {
      const res = await authFetch("/api/ai-tools", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "salary-negotiation", jobTitle, company, currentSalary, targetSalary, location, experienceLevel }),
      });
      const data = await res.json();
      setStrategy(data.strategy);
    } catch { /* ignore */ }
    setLoading(false);
  };

  return (
    <div>
      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
          <DollarSign className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Salary Negotiation</h1>
          <p className="text-sm text-slate-500">Get a comprehensive negotiation strategy</p>
        </div>
        <span className="ml-auto px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-semibold flex items-center gap-1"><Zap className="w-3 h-3" /> Premium</span>
      </div>

      <div className="card p-6 mb-6 mt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div><label className="label">Job Title *</label><input className="input" value={jobTitle} onChange={(e) => setJobTitle(e.target.value)} placeholder="Software Engineer" /></div>
          <div><label className="label">Company</label><input className="input" value={company} onChange={(e) => setCompany(e.target.value)} placeholder="Google" /></div>
          <div><label className="label">Current Salary</label><input className="input" value={currentSalary} onChange={(e) => setCurrentSalary(e.target.value)} placeholder="$100,000" /></div>
          <div><label className="label">Target Salary</label><input className="input" value={targetSalary} onChange={(e) => setTargetSalary(e.target.value)} placeholder="$130,000" /></div>
          <div><label className="label">Location</label><input className="input" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="San Francisco, CA" /></div>
          <div>
            <label className="label">Experience Level</label>
            <select className="input" value={experienceLevel} onChange={(e) => setExperienceLevel(e.target.value)}>
              <option value="">Select...</option>
              <option value="Junior">Junior (0-2 years)</option>
              <option value="Mid-level">Mid-level (3-5 years)</option>
              <option value="Senior">Senior (6-10 years)</option>
              <option value="Lead">Lead (10+ years)</option>
              <option value="Executive">Executive</option>
            </select>
          </div>
        </div>
        <button onClick={generate} disabled={!jobTitle.trim() || loading} className="btn-primary gap-2 disabled:opacity-50">
          {loading ? "Generating..." : <><Sparkles className="w-5 h-5" /> Generate Strategy</>}
        </button>
      </div>

      {strategy && (
        <div className="card p-6">
          <h3 className="font-semibold text-slate-700 mb-4">Your Negotiation Strategy</h3>
          <div className="prose-resume text-slate-700 whitespace-pre-wrap text-sm">{strategy}</div>
        </div>
      )}
    </div>
  );
}
