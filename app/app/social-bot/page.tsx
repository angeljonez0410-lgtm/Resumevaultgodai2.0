"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { authFetch } from "@/lib/auth-fetch";

type Post = {
  id: string;
  status: string;
  platform: string;
  topic: string;
  created_at: string;
};

type Log = {
  id: string;
  action: string;
  result: string;
  created_at: string;
};

export default function SocialBotPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [logs, setLogs] = useState<Log[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const [postsRes, logsRes] = await Promise.all([
          authFetch("/api/posts"),
          authFetch("/api/logs"),
        ]);
        const postsData = await postsRes.json();
        const logsData = await logsRes.json();
        setPosts(postsData.posts || []);
        setLogs(logsData.logs || []);
      } finally {
        setLoading(false);
      }
    }
    void load();
  }, []);

  const stats = useMemo(() => {
    const total = posts.length;
    const drafts = posts.filter((post) => post.status === "draft").length;
    const scheduled = posts.filter((post) => post.status === "scheduled").length;
    const published = posts.filter((post) => post.status === "posted").length;
    return { total, drafts, scheduled, published };
  }, [posts]);

  return (
    <main className="space-y-6">
      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-cyan-700">Social Bot</p>
        <h1 className="mt-2 text-3xl font-semibold text-slate-900">Content Operations Dashboard</h1>
        <p className="mt-2 max-w-3xl text-sm text-slate-600">
          Plan campaigns, generate prompts, create assets, and manage publishing from one workflow.
        </p>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-xs uppercase tracking-[0.12em] text-slate-500">Total Posts</p>
          <p className="mt-2 text-3xl font-semibold text-slate-900">{stats.total}</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-xs uppercase tracking-[0.12em] text-slate-500">Drafts</p>
          <p className="mt-2 text-3xl font-semibold text-slate-900">{stats.drafts}</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-xs uppercase tracking-[0.12em] text-slate-500">Scheduled</p>
          <p className="mt-2 text-3xl font-semibold text-slate-900">{stats.scheduled}</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-xs uppercase tracking-[0.12em] text-slate-500">Published</p>
          <p className="mt-2 text-3xl font-semibold text-slate-900">{stats.published}</p>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <Link
          href="/app/social-bot/posts"
          className="rounded-xl border border-cyan-200 bg-cyan-50 p-5 hover:bg-cyan-100"
        >
          <h2 className="text-lg font-semibold text-slate-900">Open Content Studio</h2>
          <p className="mt-1 text-sm text-slate-600">
            Generate AI brief, hashtags, deep-dive copy, and image/video prompts.
          </p>
        </Link>
        <Link
          href="/app/social-bot/accounts"
          className="rounded-xl border border-slate-200 bg-white p-5 hover:bg-slate-50"
        >
          <h2 className="text-lg font-semibold text-slate-900">Manage Connected Platforms</h2>
          <p className="mt-1 text-sm text-slate-600">Connect Meta, X, LinkedIn, TikTok, Reddit, YouTube, and more.</p>
        </Link>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">Recent Activity</h2>
        {loading ? (
          <p className="mt-3 text-sm text-slate-500">Loading activity...</p>
        ) : logs.length ? (
          <div className="mt-4 space-y-3">
            {logs.slice(0, 8).map((log) => (
              <div key={log.id} className="rounded-lg border border-slate-200 p-3">
                <p className="text-sm font-medium text-slate-900">{log.action}</p>
                <p className="mt-1 text-sm text-slate-600">{log.result}</p>
                <p className="mt-1 text-xs text-slate-400">{new Date(log.created_at).toLocaleString()}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="mt-3 text-sm text-slate-500">No recent activity yet.</p>
        )}
      </section>
    </main>
  );
}
