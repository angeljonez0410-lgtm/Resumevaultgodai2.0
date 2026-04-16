"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { authFetch } from "@/lib/auth-fetch";
import { Activity, CalendarClock, CheckCircle2, Clock3, PlusCircle, Sparkles, Users } from "lucide-react";

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

type Account = {
  id: string;
  provider: string;
  status?: string;
};

export default function SocialBotPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [logs, setLogs] = useState<Log[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const [postsRes, logsRes, accountsRes] = await Promise.all([
          authFetch("/api/posts"),
          authFetch("/api/logs"),
          authFetch("/api/social-accounts"),
        ]);

        const postsData = await postsRes.json();
        const logsData = await logsRes.json();
        const accountsData = await accountsRes.json();

        setPosts(postsData.posts || []);
        setLogs(logsData.logs || []);
        setAccounts(accountsData.accounts || []);
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
    const connectedAccounts = accounts.filter((account) => account.status === "connected").length;

    return { total, drafts, scheduled, published, connectedAccounts };
  }, [posts, accounts]);

  const nextScheduled = useMemo(() => {
    return posts
      .filter((post) => post.status === "scheduled")
      .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())[0];
  }, [posts]);

  return (
    <main className="space-y-6 p-5 sm:p-6 lg:p-8">
      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-cyan-700">InfluencerAI Studio</p>
        <h1 className="mt-2 text-3xl font-semibold text-slate-900">Professional AI Creator Operations Center</h1>
        <p className="mt-2 max-w-3xl text-sm text-slate-600">
          Run strategy, AI character systems, content production, and multi-platform publishing in one unified studio
          modeled after your previous InfluencerAI workflow.
        </p>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
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
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-xs uppercase tracking-[0.12em] text-slate-500">Connected Accounts</p>
          <p className="mt-2 text-3xl font-semibold text-slate-900">{stats.connectedAccounts}</p>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Link href="/app/social-bot/posts" className="rounded-xl border border-cyan-200 bg-cyan-50 p-5 hover:bg-cyan-100">
          <div className="flex items-center gap-2 text-cyan-700">
            <PlusCircle className="h-4 w-4" />
            <h2 className="text-lg font-semibold text-slate-900">Content Studio</h2>
          </div>
          <p className="mt-2 text-sm text-slate-600">Generate topic ideas, captions, deep dives, hashtags, and media prompts.</p>
        </Link>

        <Link href="/app/social-bot/accounts" className="rounded-xl border border-slate-200 bg-white p-5 hover:bg-slate-50">
          <div className="flex items-center gap-2 text-slate-700">
            <Users className="h-4 w-4" />
            <h2 className="text-lg font-semibold text-slate-900">Social Accounts</h2>
          </div>
          <p className="mt-2 text-sm text-slate-600">Connect, validate, and disconnect Facebook, Instagram, LinkedIn, X, TikTok, and more.</p>
        </Link>

        <Link href="/app/social-bot/characters" className="rounded-xl border border-slate-200 bg-white p-5 hover:bg-slate-50">
          <div className="flex items-center gap-2 text-slate-700">
            <Sparkles className="h-4 w-4" />
            <h2 className="text-lg font-semibold text-slate-900">AI Characters</h2>
          </div>
          <p className="mt-2 text-sm text-slate-600">Create custom AI personas with upload support, system prompts, and content pillars.</p>
        </Link>

        <Link href="/app/social-bot/settings" className="rounded-xl border border-slate-200 bg-white p-5 hover:bg-slate-50">
          <div className="flex items-center gap-2 text-slate-700">
            <CheckCircle2 className="h-4 w-4" />
            <h2 className="text-lg font-semibold text-slate-900">Strategy Settings</h2>
          </div>
          <p className="mt-2 text-sm text-slate-600">Control brand voice, target audience, posting cadence, and automation direction.</p>
        </Link>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-2">
            <CalendarClock className="h-4 w-4 text-cyan-700" />
            <h2 className="text-lg font-semibold text-slate-900">Scheduling Snapshot</h2>
          </div>
          {nextScheduled ? (
            <div className="mt-4 rounded-lg border border-slate-200 p-4">
              <p className="text-xs uppercase tracking-wide text-slate-500">Next Scheduled Post</p>
              <p className="mt-1 text-sm font-semibold text-slate-900">{nextScheduled.topic}</p>
              <p className="mt-1 text-sm text-slate-600">Platform: {nextScheduled.platform}</p>
              <p className="mt-1 text-sm text-slate-600">Created: {new Date(nextScheduled.created_at).toLocaleString()}</p>
              <Link href="/app/social-bot/posts" className="mt-3 inline-flex text-sm font-semibold text-cyan-700 hover:text-cyan-900">
                Open Post Queue
              </Link>
            </div>
          ) : (
            <p className="mt-4 text-sm text-slate-500">No scheduled posts yet. Open Content Studio to queue your next campaign.</p>
          )}
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-2">
            <Activity className="h-4 w-4 text-cyan-700" />
            <h2 className="text-lg font-semibold text-slate-900">Recent Activity</h2>
          </div>

          {loading ? (
            <p className="mt-4 text-sm text-slate-500">Loading activity...</p>
          ) : logs.length ? (
            <div className="mt-4 space-y-3">
              {logs.slice(0, 5).map((log) => (
                <div key={log.id} className="rounded-lg border border-slate-200 p-3">
                  <p className="text-sm font-medium text-slate-900">{log.action}</p>
                  <p className="mt-1 text-sm text-slate-600">{log.result}</p>
                  <div className="mt-1 inline-flex items-center gap-1 text-xs text-slate-400">
                    <Clock3 className="h-3 w-3" />
                    {new Date(log.created_at).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="mt-4 text-sm text-slate-500">No recent activity yet.</p>
          )}

          <Link href="/app/social-bot/logs" className="mt-4 inline-flex text-sm font-semibold text-cyan-700 hover:text-cyan-900">
            View Full Log History
          </Link>
        </div>
      </section>
    </main>
  );
}
