"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { authFetch } from "@/lib/auth-fetch";
import { Loader2, Sparkles, Trash2, Upload, Wand2 } from "lucide-react";

type CharacterProfile = {
  id: string;
  created_at: string;
  name: string;
  niche: string;
  audience: string;
  voice: string;
  bio: string;
  offers: string;
  ctaStyle: string;
  referenceImageUrl: string;
  systemPrompt: string;
  contentPillars: string[];
  hashtagStyle: string;
  deepDiveStyle: string;
};

const emptyForm: Omit<CharacterProfile, "id" | "created_at"> = {
  name: "",
  niche: "",
  audience: "",
  voice: "",
  bio: "",
  offers: "",
  ctaStyle: "",
  referenceImageUrl: "",
  systemPrompt: "",
  contentPillars: [],
  hashtagStyle: "",
  deepDiveStyle: "",
};

export default function CharacterStudioPage() {
  const [profiles, setProfiles] = useState<CharacterProfile[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [topicIdeas, setTopicIdeas] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");

  const selectedProfile = useMemo(
    () => profiles.find((profile) => profile.id === activeId) || null,
    [profiles, activeId]
  );

  const loadProfiles = useCallback(async () => {
    setLoading(true);
    try {
      const res = await authFetch("/api/character-profiles");
      const data = await res.json();
      if (!res.ok) {
        setMessage(data.error || "Failed to load character profiles");
        setProfiles([]);
      } else {
        setProfiles(data.profiles || []);
      }
    } catch {
      setMessage("Could not load character profiles");
      setProfiles([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadProfiles();
  }, [loadProfiles]);

  function applyProfile(profile: CharacterProfile) {
    setActiveId(profile.id);
    setForm({
      name: profile.name || "",
      niche: profile.niche || "",
      audience: profile.audience || "",
      voice: profile.voice || "",
      bio: profile.bio || "",
      offers: profile.offers || "",
      ctaStyle: profile.ctaStyle || "",
      referenceImageUrl: profile.referenceImageUrl || "",
      systemPrompt: profile.systemPrompt || "",
      contentPillars: Array.isArray(profile.contentPillars) ? profile.contentPillars : [],
      hashtagStyle: profile.hashtagStyle || "",
      deepDiveStyle: profile.deepDiveStyle || "",
    });
  }

  async function handleUpload(file: File) {
    setUploading(true);
    setMessage("");
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await authFetch("/api/upload-media", { method: "POST", body: formData });
      const data = await res.json();

      if (!res.ok) {
        setMessage(data.error || "Upload failed");
        return;
      }

      setForm((prev) => ({ ...prev, referenceImageUrl: data.publicUrl || "" }));
      setMessage("Reference image uploaded.");
    } catch {
      setMessage("Could not upload image");
    } finally {
      setUploading(false);
    }
  }

  async function generateBlueprint() {
    if (!form.name.trim()) {
      setMessage("Add a character name before generating.");
      return;
    }

    setGenerating(true);
    setMessage("");

    try {
      const res = await authFetch("/api/character-profiles/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();

      if (!res.ok) {
        setMessage(data.error || "Failed to generate blueprint");
        return;
      }

      const blueprint = data.blueprint || {};
      setForm((prev) => ({
        ...prev,
        systemPrompt: blueprint.systemPrompt || prev.systemPrompt,
        contentPillars: Array.isArray(blueprint.contentPillars) ? blueprint.contentPillars : prev.contentPillars,
        hashtagStyle: blueprint.hashtagStyle || prev.hashtagStyle,
        deepDiveStyle: blueprint.deepDiveStyle || prev.deepDiveStyle,
        bio: blueprint.bioSummary || prev.bio,
      }));
      setTopicIdeas(Array.isArray(blueprint.topicIdeas) ? blueprint.topicIdeas : []);
      setMessage("AI blueprint generated. Review and save your character.");
    } catch {
      setMessage("Could not generate blueprint");
    } finally {
      setGenerating(false);
    }
  }

  async function saveProfile() {
    if (!form.name.trim()) {
      setMessage("Character name is required.");
      return;
    }

    setSaving(true);
    setMessage("");

    try {
      const res = await authFetch("/api/character-profiles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: activeId || undefined, ...form }),
      });
      const data = await res.json();

      if (!res.ok) {
        setMessage(data.error || "Failed to save character");
        return;
      }

      const profile = data.profile as CharacterProfile;
      if (activeId) {
        setProfiles((prev) => prev.map((item) => (item.id === profile.id ? profile : item)));
      } else {
        setProfiles((prev) => [profile, ...prev]);
      }
      setActiveId(profile.id);
      setMessage("Character saved successfully.");
    } catch {
      setMessage("Could not save character");
    } finally {
      setSaving(false);
    }
  }

  async function deleteProfile(id: string) {
    setMessage("");
    try {
      const res = await authFetch("/api/character-profiles", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      const data = await res.json();
      if (!res.ok) {
        setMessage(data.error || "Failed to delete profile");
        return;
      }

      setProfiles((prev) => prev.filter((profile) => profile.id !== id));
      if (activeId === id) {
        setActiveId(null);
        setForm(emptyForm);
        setTopicIdeas([]);
      }
      setMessage("Character removed.");
    } catch {
      setMessage("Could not delete profile");
    }
  }

  return (
    <main className="space-y-6">
      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-cyan-700">AI Character Studio</p>
        <h1 className="mt-2 text-3xl font-semibold text-slate-900">Create Your Own AI Character</h1>
        <p className="mt-2 max-w-3xl text-sm text-slate-600">
          Build custom character profiles with voice, audience targeting, posting style, and a reusable AI system prompt.
          Upload a reference image, generate deep strategy, then use the character in content production.
        </p>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.3fr_1fr]">
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-xl font-semibold text-slate-900">Character Builder</h2>
            <div className="flex gap-2">
              <button
                onClick={generateBlueprint}
                disabled={generating}
                className="inline-flex items-center gap-2 rounded-lg border border-cyan-200 bg-cyan-50 px-3 py-2 text-sm font-semibold text-cyan-800 hover:bg-cyan-100 disabled:opacity-60"
              >
                {generating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Wand2 className="h-4 w-4" />}
                Generate Blueprint
              </button>
              <button
                onClick={saveProfile}
                disabled={saving}
                className="rounded-lg bg-slate-900 px-3 py-2 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-60"
              >
                {saving ? "Saving..." : activeId ? "Update Character" : "Save Character"}
              </button>
            </div>
          </div>

          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <label className="space-y-1.5">
              <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">Character Name</span>
              <input
                value={form.name}
                onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
                placeholder="Creator Coach AI"
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 outline-none focus:border-cyan-400"
              />
            </label>
            <label className="space-y-1.5">
              <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">Niche</span>
              <input
                value={form.niche}
                onChange={(e) => setForm((prev) => ({ ...prev, niche: e.target.value }))}
                placeholder="Content marketing for local businesses"
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 outline-none focus:border-cyan-400"
              />
            </label>
            <label className="space-y-1.5">
              <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">Target Audience</span>
              <input
                value={form.audience}
                onChange={(e) => setForm((prev) => ({ ...prev, audience: e.target.value }))}
                placeholder="Founders and service creators"
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 outline-none focus:border-cyan-400"
              />
            </label>
            <label className="space-y-1.5">
              <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">Voice & Tone</span>
              <input
                value={form.voice}
                onChange={(e) => setForm((prev) => ({ ...prev, voice: e.target.value }))}
                placeholder="Confident, practical, direct"
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 outline-none focus:border-cyan-400"
              />
            </label>
            <label className="space-y-1.5 md:col-span-2">
              <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">Bio / Identity</span>
              <textarea
                value={form.bio}
                onChange={(e) => setForm((prev) => ({ ...prev, bio: e.target.value }))}
                placeholder="What this AI character stands for and how it helps your audience..."
                className="min-h-20 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 outline-none focus:border-cyan-400"
              />
            </label>
            <label className="space-y-1.5 md:col-span-2">
              <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">Offer / Outcome</span>
              <textarea
                value={form.offers}
                onChange={(e) => setForm((prev) => ({ ...prev, offers: e.target.value }))}
                placeholder="What this character is selling, promoting, or helping users achieve"
                className="min-h-20 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 outline-none focus:border-cyan-400"
              />
            </label>
            <label className="space-y-1.5 md:col-span-2">
              <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">Reference Image URL</span>
              <input
                value={form.referenceImageUrl}
                onChange={(e) => setForm((prev) => ({ ...prev, referenceImageUrl: e.target.value }))}
                placeholder="https://..."
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 outline-none focus:border-cyan-400"
              />
            </label>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-3">
            <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50">
              {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />} Upload Reference
              <input
                type="file"
                accept="image/png,image/jpeg,image/webp"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    void handleUpload(file);
                  }
                  e.currentTarget.value = "";
                }}
              />
            </label>
            <button
              type="button"
              onClick={() => {
                setActiveId(null);
                setForm(emptyForm);
                setTopicIdeas([]);
              }}
              className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              New Character
            </button>
            <Link
              href="/app/social-bot/posts"
              className="rounded-lg bg-cyan-700 px-3 py-2 text-sm font-semibold text-white hover:bg-cyan-800"
            >
              Use in Content Studio
            </Link>
          </div>

          {form.referenceImageUrl ? (
            <div className="mt-4 rounded-lg border border-slate-200 p-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Reference Preview</p>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={form.referenceImageUrl} alt="Character reference" className="mt-2 max-h-48 rounded-lg object-cover" />
            </div>
          ) : null}

          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <label className="space-y-1.5 md:col-span-2">
              <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">System Prompt</span>
              <textarea
                value={form.systemPrompt}
                onChange={(e) => setForm((prev) => ({ ...prev, systemPrompt: e.target.value }))}
                placeholder="Generated by AI blueprint or write your own..."
                className="min-h-36 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 outline-none focus:border-cyan-400"
              />
            </label>
            <label className="space-y-1.5">
              <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">Hashtag Strategy</span>
              <textarea
                value={form.hashtagStyle}
                onChange={(e) => setForm((prev) => ({ ...prev, hashtagStyle: e.target.value }))}
                className="min-h-20 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 outline-none focus:border-cyan-400"
              />
            </label>
            <label className="space-y-1.5">
              <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">Deep Dive Style</span>
              <textarea
                value={form.deepDiveStyle}
                onChange={(e) => setForm((prev) => ({ ...prev, deepDiveStyle: e.target.value }))}
                className="min-h-20 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 outline-none focus:border-cyan-400"
              />
            </label>
          </div>

          {message ? <p className="mt-4 text-sm text-slate-600">{message}</p> : null}
        </div>

        <div className="space-y-6">
          <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-900">Saved Characters</h3>
            {loading ? (
              <p className="mt-3 text-sm text-slate-500">Loading...</p>
            ) : profiles.length === 0 ? (
              <p className="mt-3 text-sm text-slate-500">No characters saved yet.</p>
            ) : (
              <div className="mt-4 space-y-3">
                {profiles.map((profile) => (
                  <article key={profile.id} className="rounded-lg border border-slate-200 p-3">
                    <div className="flex items-start justify-between gap-3">
                      <button
                        type="button"
                        onClick={() => applyProfile(profile)}
                        className="text-left"
                      >
                        <p className="text-sm font-semibold text-slate-900">{profile.name}</p>
                        <p className="mt-1 text-xs text-slate-500">{profile.niche || "General"}</p>
                      </button>
                      <button
                        type="button"
                        onClick={() => void deleteProfile(profile.id)}
                        className="rounded-md p-1.5 text-slate-400 hover:bg-slate-100 hover:text-rose-600"
                        aria-label="Delete profile"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                    <p className="mt-2 text-xs text-slate-400">Updated {new Date(profile.created_at).toLocaleString()}</p>
                  </article>
                ))}
              </div>
            )}
          </section>

          <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-900">Content Pillars</h3>
            {form.contentPillars.length ? (
              <ul className="mt-3 space-y-2">
                {form.contentPillars.map((pillar) => (
                  <li key={pillar} className="rounded-md bg-slate-50 px-3 py-2 text-sm text-slate-700">
                    {pillar}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-3 text-sm text-slate-500">Generate a blueprint to fill this section.</p>
            )}
          </section>

          <section className="rounded-xl border border-cyan-200 bg-cyan-50 p-6 shadow-sm">
            <div className="flex items-center gap-2 text-cyan-900">
              <Sparkles className="h-4 w-4" />
              <h3 className="text-lg font-semibold">AI Topic Ideas</h3>
            </div>
            {topicIdeas.length ? (
              <ul className="mt-3 space-y-2">
                {topicIdeas.map((idea) => (
                  <li key={idea} className="text-sm text-cyan-900">
                    {idea}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-3 text-sm text-cyan-900/80">No ideas yet. Generate a blueprint from the builder.</p>
            )}
            {selectedProfile ? (
              <p className="mt-3 text-xs text-cyan-900/80">Currently editing: {selectedProfile.name}</p>
            ) : null}
          </section>
        </div>
      </section>
    </main>
  );
}
