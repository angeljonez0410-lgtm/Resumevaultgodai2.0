import Link from "next/link";
import { Sparkles, Zap, Wand2, Users, CalendarClock, ArrowRight } from "lucide-react";

const features = [
  {
    title: "Character Training",
    description: "Create reusable AI characters with their own voice, prompt brain, and visual reference profile.",
    icon: Users,
  },
  {
    title: "Prompt-to-Post",
    description: "Generate topic, caption, deep-dive, hashtags, and visual prompts in a single production workflow.",
    icon: Wand2,
  },
  {
    title: "Publishing Ops",
    description: "Connect platforms, schedule campaigns, and monitor operations with live activity tracking.",
    icon: CalendarClock,
  },
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white">
      <div className="mx-auto max-w-6xl px-6 py-16 lg:py-24">
        <div className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl lg:p-12">
          <div className="inline-flex items-center gap-2 rounded-full bg-cyan-500/15 px-4 py-1.5 text-sm font-semibold text-cyan-200">
            <Zap className="h-4 w-4" /> InfluencerAI Studio
          </div>

          <h1 className="mt-6 text-4xl font-bold tracking-tight text-white lg:text-6xl">
            Professional AI Creator Studio
            <span className="block bg-gradient-to-r from-cyan-300 to-blue-400 bg-clip-text text-transparent">
              for Content + Social Ops
            </span>
          </h1>

          <p className="mt-5 max-w-3xl text-base text-slate-300 lg:text-lg">
            This app now follows the same style and workflow direction as your previous InfluencerAI build:
            clean control surfaces, in-depth content ops, social account management, and custom AI character creation.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link
              href="/app/social-bot"
              className="inline-flex items-center gap-2 rounded-xl bg-cyan-500 px-6 py-3 text-sm font-bold text-slate-950 hover:bg-cyan-400"
            >
              <Sparkles className="h-4 w-4" /> Open Studio
            </Link>
            <Link
              href="/app/social-bot"
              className="inline-flex items-center gap-2 rounded-xl border border-white/15 px-6 py-3 text-sm font-semibold text-white hover:bg-white/10"
            >
              View Dashboard <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

        <section className="mt-10 grid gap-4 lg:grid-cols-3">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <article key={feature.title} className="rounded-2xl border border-white/10 bg-white/5 p-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/15 text-cyan-300">
                  <Icon className="h-5 w-5" />
                </div>
                <h2 className="mt-4 text-lg font-semibold text-white">{feature.title}</h2>
                <p className="mt-2 text-sm text-slate-300">{feature.description}</p>
              </article>
            );
          })}
        </section>
      </div>
    </main>
  );
}
