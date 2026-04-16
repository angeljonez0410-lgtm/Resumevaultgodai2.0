"use client";

import Link from "next/link";
import SettingsPanel from "@/components/SettingsPanel";

export default function SocialBotSettingsPage() {
  return (
    <main className="studio-page">
      <section className="studio-card">
        <h1 className="text-2xl font-semibold text-white">Strategy Settings</h1>
        <p className="mt-1 text-sm text-slate-300">
          Configure audience, brand voice, and cadence so your AI outputs are consistent across captions, deep dives,
          hashtags, and campaign plans.
        </p>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <Link href="/app/social-bot/posts" className="studio-subcard text-sm text-slate-300 transition hover:border-cyan-400/30">
          Tune settings, then generate in Content Studio
        </Link>
        <Link href="/app/social-bot/characters" className="studio-subcard text-sm text-slate-300 transition hover:border-cyan-400/30">
          Apply settings to your custom AI characters
        </Link>
        <Link href="/app/social-bot/accounts" className="studio-subcard text-sm text-slate-300 transition hover:border-cyan-400/30">
          Confirm connected accounts before publishing
        </Link>
      </section>

      <SettingsPanel onSaved={async () => Promise.resolve()} />
    </main>
  );
}
