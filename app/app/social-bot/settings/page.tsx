"use client";

import Link from "next/link";
import SettingsPanel from "@/components/SettingsPanel";

export default function SocialBotSettingsPage() {
  return (
    <main className="space-y-6 p-5 sm:p-6 lg:p-8">
      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-semibold text-slate-900">Strategy Settings</h1>
        <p className="mt-1 text-sm text-slate-600">
          Configure audience, brand voice, and cadence so your AI outputs are consistent across captions, deep dives,
          hashtags, and campaign plans.
        </p>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <Link href="/app/social-bot/posts" className="rounded-xl border border-slate-200 bg-white p-4 text-sm text-slate-700 hover:bg-slate-50">
          Tune settings, then generate in Content Studio
        </Link>
        <Link href="/app/social-bot/characters" className="rounded-xl border border-slate-200 bg-white p-4 text-sm text-slate-700 hover:bg-slate-50">
          Apply settings to your custom AI characters
        </Link>
        <Link href="/app/social-bot/accounts" className="rounded-xl border border-slate-200 bg-white p-4 text-sm text-slate-700 hover:bg-slate-50">
          Confirm connected accounts before publishing
        </Link>
      </section>

      <SettingsPanel onSaved={async () => Promise.resolve()} />
    </main>
  );
}
