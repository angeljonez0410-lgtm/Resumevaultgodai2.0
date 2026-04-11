"use client";

import { Zap, Check, Star, Crown } from "lucide-react";

const plans = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    desc: "Get started with basic tools",
    features: ["Job Analyzer", "Resume Builder", "Cover Letter Generator", "Follow-Up Emails", "5 AI generations/month"],
    cta: "Current Plan",
    featured: false,
  },
  {
    name: "Pro",
    price: "$29.99",
    period: "/month",
    desc: "Unlock premium AI tools and unlimited generations",
    features: [
      "Everything in Free",
      "Unlimited AI generations",
      "Mock Interview Coach",
      "Salary Negotiation Scripts",
      "Career Roadmap Generator",
      "Portfolio Ideas",
      "1-Page Resume Option",
      "Priority support",
    ],
    cta: "Upgrade to Pro",
    featured: true,
  },
  {
    name: "Elite",
    price: "$79.99",
    period: "/month",
    desc: "For serious job seekers — maximum firepower",
    features: [
      "Everything in Pro",
      "Auto Apply (bulk applications)",
      "Executive Resume Builder",
      "Interview Mastery (20 questions)",
      "Portfolio Builder (HTML)",
      "Dedicated AI assistant",
      "White-glove support",
    ],
    cta: "Go Elite",
    featured: false,
  },
];

const testimonials = [
  { name: "Sarah K.", role: "Product Manager", text: "Got 3 interviews in my first week using the Resume Builder. The ATS optimization is incredible.", stars: 5 },
  { name: "Marcus J.", role: "Software Engineer", text: "The Mock Interview feature helped me ace my Google interview. Worth every penny.", stars: 5 },
  { name: "Lisa T.", role: "Marketing Director", text: "Auto Apply saved me 20+ hours a week. I landed my dream job in 3 weeks.", stars: 5 },
];

export default function PricingPage() {
  return (
    <div>
      {/* Header */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-1.5 bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-xs font-semibold mb-4">
          <Zap className="w-3 h-3" /> God-Mode Your Job Hunt
        </div>
        <h1 className="text-3xl font-bold text-slate-800 mb-2">Choose Your Plan</h1>
        <p className="text-slate-500 max-w-lg mx-auto">
          Beat the ATS, ace interviews, and land your dream job with AI-powered tools.
        </p>
      </div>

      {/* Stats bar */}
      <div className="flex justify-center gap-8 mb-12 text-center">
        {[
          { value: "10,000+", label: "Resumes Generated" },
          { value: "98%", label: "Avg ATS Score" },
          { value: "4.9/5", label: "User Rating" },
        ].map((s) => (
          <div key={s.label}>
            <p className="text-2xl font-bold text-slate-800">{s.value}</p>
            <p className="text-xs text-slate-500">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Plans */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16 max-w-5xl mx-auto">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className={`card p-6 relative ${plan.featured ? "ring-2 ring-amber-400 shadow-lg scale-[1.02]" : ""}`}
          >
            {plan.featured && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-amber-400 to-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                <Crown className="w-3 h-3" /> Most Popular
              </div>
            )}
            <h3 className="text-lg font-bold text-slate-800">{plan.name}</h3>
            <div className="mt-2 mb-1">
              <span className="text-3xl font-bold text-slate-900">{plan.price}</span>
              <span className="text-sm text-slate-500">{plan.period}</span>
            </div>
            <p className="text-sm text-slate-500 mb-5">{plan.desc}</p>
            <ul className="space-y-2 mb-6">
              {plan.features.map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm text-slate-600">
                  <Check className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" /> {f}
                </li>
              ))}
            </ul>
            <button
              className={`w-full py-2.5 rounded-xl font-semibold text-sm transition ${
                plan.featured
                  ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:from-amber-600 hover:to-orange-600"
                  : plan.name === "Free"
                  ? "bg-slate-100 text-slate-500 cursor-default"
                  : "bg-slate-900 text-white hover:bg-slate-800"
              }`}
            >
              {plan.cta}
            </button>
          </div>
        ))}
      </div>

      {/* Testimonials */}
      <div className="max-w-4xl mx-auto">
        <h2 className="text-xl font-bold text-slate-800 text-center mb-8">What Our Users Say</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <div key={t.name} className="card p-5">
              <div className="flex gap-0.5 mb-3">
                {Array.from({ length: t.stars }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <p className="text-sm text-slate-600 leading-relaxed mb-3">&ldquo;{t.text}&rdquo;</p>
              <p className="text-sm font-semibold text-slate-800">{t.name}</p>
              <p className="text-xs text-slate-500">{t.role}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
