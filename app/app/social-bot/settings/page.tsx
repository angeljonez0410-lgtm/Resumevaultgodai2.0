"use client";

import SettingsPanel from "@/components/SettingsPanel";

export default function SocialBotSettingsPage() {
  return (
    <main className="space-y-6">
      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-semibold text-slate-900">Strategy Settings</h1>
        <p className="mt-1 text-sm text-slate-600">
          Configure audience, voice, and posting cadence so every generated asset stays consistent with your brand.
        </p>
      </section>

      <SettingsPanel onSaved={async () => Promise.resolve()} />
    </main>
  );
}
