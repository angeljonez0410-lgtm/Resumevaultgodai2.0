"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { authFetch } from "@/lib/auth-fetch";
import { SOCIAL_PLATFORMS, type SocialProvider } from "@/lib/social-platforms";
import { CheckCircle2, CircleDashed, Loader2, RefreshCw, ShieldAlert, Trash2, PlugZap } from "lucide-react";

type SocialAccount = {
  id: string;
  provider: SocialProvider;
  account_name: string;
  handle?: string | null;
  auth_mode?: string | null;
  status?: string | null;
  token_expires_at?: string | null;
  access_token_masked?: string | null;
  refresh_token_masked?: string | null;
  connected_at?: string | null;
  last_validated_at?: string | null;
};

const initialForm = {
  provider: "instagram" as SocialProvider,
  account_name: "",
  handle: "",
  auth_mode: "token",
  access_token: "",
  refresh_token: "",
  token_expires_at: "",
};

export default function SocialBotAccountsPage() {
  const [accounts, setAccounts] = useState<SocialAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState(initialForm);
  const [message, setMessage] = useState("");

  const connectedCount = useMemo(
    () => accounts.filter((account) => account.status === "connected").length,
    [accounts]
  );

  const loadAccounts = useCallback(async () => {
    setLoading(true);
    setMessage("");

    try {
      const res = await authFetch("/api/social-accounts");
      const data = await res.json();
      if (!res.ok) {
        setMessage(data.error || "Failed to load accounts");
        setAccounts([]);
      } else {
        setAccounts(data.accounts || []);
      }
    } catch {
      setMessage("Could not connect to accounts API");
      setAccounts([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadAccounts();
  }, [loadAccounts]);

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const connected = searchParams.get("connected");
    const error = searchParams.get("error");
    const provider = searchParams.get("provider");
    const count = searchParams.get("accounts");

    if (error) {
      setMessage(error);
      return;
    }

    if (connected) {
      const providerLabel = provider ? provider.replace(/^\w/, (character) => character.toUpperCase()) : "Account";
      setMessage(
        count
          ? `${providerLabel} connected successfully. Saved ${count} account${count === "1" ? "" : "s"}.`
          : `${providerLabel} connected successfully.`
      );
      void loadAccounts();
    }
  }, [loadAccounts]);

  function connectWithMeta(provider: "facebook" | "instagram") {
    window.location.assign(`/api/social-connect/meta/start?provider=${provider}`);
  }

  const saveAccount = useCallback(async () => {
    setSaving(true);
    setMessage("");

    try {
      const res = await authFetch("/api/social-accounts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();

      if (!res.ok) {
        setMessage(data.error || "Failed to connect account");
        return;
      }

      setForm(initialForm);
      setMessage(`${form.provider} connected successfully`);
      await loadAccounts();
    } catch {
      setMessage("Could not save account connection");
    } finally {
      setSaving(false);
    }
  }, [form, loadAccounts]);

  const removeAccount = useCallback(
    async (id: string) => {
      setMessage("");
      try {
        const res = await authFetch("/api/social-accounts", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id }),
        });

        const data = await res.json();
        if (!res.ok) {
          setMessage(data.error || "Failed to disconnect account");
          return;
        }

        setMessage("Account disconnected");
        await loadAccounts();
      } catch {
        setMessage("Could not disconnect account");
      }
    },
    [loadAccounts]
  );

  return (
    <div className="mx-auto max-w-7xl space-y-6 px-5 py-6 sm:px-6 lg:px-10 lg:py-10">
      <section className="rounded-2xl border border-white/5 bg-slate-900/50 p-6">
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-violet-300">Connected Accounts</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-white">Link Your Social Platforms</h1>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-400">
          Connect Instagram, Facebook, X/Twitter, LinkedIn, TikTok, Threads, YouTube, and Pinterest accounts.
          For live publishing, add the official app credentials or tokens from each platform.
        </p>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-white/5 bg-slate-900/40 p-5">
          <p className="text-xs uppercase tracking-[0.12em] text-slate-500">Connected</p>
          <p className="mt-2 text-2xl font-semibold text-white">{connectedCount}</p>
        </div>
        <div className="rounded-2xl border border-white/5 bg-slate-900/40 p-5">
          <p className="text-xs uppercase tracking-[0.12em] text-slate-500">Saved</p>
          <p className="mt-2 text-2xl font-semibold text-white">{accounts.length}</p>
        </div>
        <div className="rounded-2xl border border-white/5 bg-slate-900/40 p-5">
          <p className="text-xs uppercase tracking-[0.12em] text-slate-500">Mode</p>
          <p className="mt-2 text-2xl font-semibold text-white">OAuth + Token</p>
        </div>
      </section>

      <section className="rounded-2xl border border-white/5 bg-slate-900/50 p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold text-white">Connect a new account</h2>
            <p className="text-sm text-slate-400">Use a platform token or OAuth-backed credentials.</p>
          </div>
          <button
            onClick={loadAccounts}
            className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-semibold text-slate-200 hover:bg-white/10"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh
          </button>
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-blue-500/15 bg-blue-500/10 px-4 py-3">
          <div>
            <p className="text-sm font-semibold text-white">Meta OAuth is ready for Facebook and Instagram.</p>
            <p className="text-xs text-slate-300">
              Click once, approve access, and the connected page accounts will appear automatically.
              You just need `META_APP_ID` and `META_APP_SECRET` configured in the environment.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => connectWithMeta("facebook")}
              className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
            >
              Connect Facebook
            </button>
            <button
              type="button"
              onClick={() => connectWithMeta("instagram")}
              className="rounded-xl bg-pink-600 px-4 py-2 text-sm font-semibold text-white hover:bg-pink-700"
            >
              Connect Instagram
            </button>
            <button
              type="button"
              onClick={() => window.location.assign("/api/social-connect/linkedin/start")}
              className="rounded-xl bg-sky-700 px-4 py-2 text-sm font-semibold text-white hover:bg-sky-800"
            >
              Connect LinkedIn
            </button>
            <button
              type="button"
              onClick={() => window.location.assign("/api/social-connect/x/start")}
              className="rounded-xl bg-slate-800 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-700"
            >
              Connect X / Twitter
            </button>
            <button
              type="button"
              onClick={() => window.location.assign("/api/social-connect/youtube/start")}
              className="rounded-xl bg-red-700 px-4 py-2 text-sm font-semibold text-white hover:bg-red-800"
            >
              Connect YouTube
            </button>
            <button
              type="button"
              onClick={() => window.location.assign("/api/social-connect/pinterest/start")}
              className="rounded-xl bg-rose-600 px-4 py-2 text-sm font-semibold text-white hover:bg-rose-700"
            >
              Connect Pinterest
            </button>
            <button
              type="button"
              onClick={() => window.location.assign("/api/social-connect/tiktok/start")}
              className="rounded-xl bg-black px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
            >
              Connect TikTok
            </button>
            <button
              type="button"
              onClick={() => window.location.assign("/api/social-connect/threads/start")}
              className="rounded-xl bg-black px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
            >
              Connect Threads
            </button>
            <button
              type="button"
              onClick={() => window.location.assign("/api/social-connect/reddit/start?subreddit=socialbot")}
              className="rounded-xl bg-orange-600 px-4 py-2 text-sm font-semibold text-white hover:bg-orange-700"
            >
              Connect Reddit
            </button>
          </div>
        </div>

        <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {SOCIAL_PLATFORMS.map((platform) => (
            <button
              key={platform.id}
              onClick={() => setForm((prev) => ({ ...prev, provider: platform.id }))}
              className={`rounded-2xl border p-4 text-left transition ${
                form.provider === platform.id
                  ? "border-violet-500/40 bg-violet-500/10"
                  : "border-white/5 bg-slate-950/70 hover:border-violet-500/20"
              }`}
            >
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-white">{platform.label}</p>
                  <p className="mt-1 text-xs text-slate-400">{platform.description}</p>
                </div>
                <span className={`rounded-full bg-gradient-to-br ${platform.accent} px-3 py-1 text-xs font-semibold text-white`}>
                  {platform.shortLabel}
                </span>
              </div>
              <p className="mt-3 text-xs leading-5 text-slate-500">{platform.connectHint}</p>
            </button>
          ))}
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <label className="space-y-2">
            <span className="text-sm font-semibold text-slate-300">Account name</span>
            <input
              value={form.account_name}
              onChange={(e) => setForm((prev) => ({ ...prev, account_name: e.target.value }))}
              placeholder="Social Bot"
              className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none ring-0 placeholder:text-slate-500"
            />
          </label>
          <label className="space-y-2">
            <span className="text-sm font-semibold text-slate-300">Handle / page</span>
            <input
              value={form.handle}
              onChange={(e) => setForm((prev) => ({ ...prev, handle: e.target.value }))}
              placeholder="@socialbot"
              className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none ring-0 placeholder:text-slate-500"
            />
          </label>
          <label className="space-y-2">
            <span className="text-sm font-semibold text-slate-300">Auth mode</span>
            <select
              value={form.auth_mode}
              onChange={(e) => setForm((prev) => ({ ...prev, auth_mode: e.target.value }))}
              className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none ring-0"
            >
              <option value="token">Token</option>
              <option value="oauth">OAuth</option>
              <option value="manual">Manual</option>
            </select>
          </label>
          <label className="space-y-2">
            <span className="text-sm font-semibold text-slate-300">Token expires at</span>
            <input
              value={form.token_expires_at}
              onChange={(e) => setForm((prev) => ({ ...prev, token_expires_at: e.target.value }))}
              type="datetime-local"
              className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none ring-0"
            />
          </label>
          <label className="space-y-2 md:col-span-2">
            <span className="text-sm font-semibold text-slate-300">Access token</span>
            <textarea
              value={form.access_token}
              onChange={(e) => setForm((prev) => ({ ...prev, access_token: e.target.value }))}
              placeholder="Paste access token or OAuth session token"
              className="min-h-28 w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none ring-0 placeholder:text-slate-500"
            />
          </label>
          <label className="space-y-2 md:col-span-2">
            <span className="text-sm font-semibold text-slate-300">Refresh token</span>
            <textarea
              value={form.refresh_token}
              onChange={(e) => setForm((prev) => ({ ...prev, refresh_token: e.target.value }))}
              placeholder="Paste refresh token if the platform provides one"
              className="min-h-24 w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none ring-0 placeholder:text-slate-500"
            />
          </label>
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <button
            onClick={saveAccount}
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-xl bg-violet-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-violet-700 disabled:opacity-50"
          >
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <PlugZap className="h-4 w-4" />}
            Connect Account
          </button>
          <button
            onClick={() => setForm(initialForm)}
            className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-semibold text-slate-200 hover:bg-white/10"
          >
            Reset
          </button>
          <div className="inline-flex items-center gap-2 rounded-xl border border-amber-500/20 bg-amber-500/10 px-4 py-2.5 text-sm text-amber-100">
            <ShieldAlert className="h-4 w-4" />
            Real publishing depends on valid platform credentials.
          </div>
        </div>

        {message ? <p className="mt-4 text-sm text-slate-400">{message}</p> : null}
      </section>

      <section className="rounded-2xl border border-white/5 bg-slate-900/50 p-6">
        <h2 className="text-xl font-bold text-white">Connected accounts</h2>
        <p className="mt-1 text-sm text-slate-400">These are the accounts the bot can use when publishing.</p>

        {loading ? (
          <div className="py-16 text-center">
            <Loader2 className="mx-auto mb-3 h-8 w-8 animate-spin text-violet-300" />
            <p className="text-sm text-slate-400">Loading connected accounts...</p>
          </div>
        ) : accounts.length === 0 ? (
          <div className="mt-6 rounded-2xl border border-dashed border-white/10 bg-slate-950/70 p-8 text-center">
            <CircleDashed className="mx-auto h-10 w-10 text-slate-500" />
            <p className="mt-3 text-sm font-semibold text-white">No accounts connected yet</p>
            <p className="mt-1 text-sm text-slate-400">Connect a provider above to unlock publishing and testing.</p>
          </div>
        ) : (
          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {accounts.map((account) => {
              const platform = SOCIAL_PLATFORMS.find((item) => item.id === account.provider);
              return (
                <article key={account.id} className="rounded-2xl border border-white/5 bg-slate-950/80 p-5">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-white">{platform?.label || account.provider}</p>
                      <p className="text-xs text-slate-500">{account.account_name}</p>
                    </div>
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        account.status === "connected"
                          ? "bg-emerald-500/15 text-emerald-200"
                          : "bg-amber-500/15 text-amber-200"
                      }`}
                    >
                      {account.status || "pending"}
                    </span>
                  </div>

                  <div className="mt-4 space-y-2 text-sm text-slate-400">
                    <p>Handle: {account.handle || "—"}</p>
                    <p>Auth mode: {account.auth_mode || "token"}</p>
                    <p>Access token: {account.access_token_masked || "—"}</p>
                    <p>Refresh token: {account.refresh_token_masked || "—"}</p>
                  </div>

                  <div className="mt-4 flex items-center gap-2">
                    <button
                      onClick={() => removeAccount(account.id)}
                      className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-rose-500/20 bg-rose-500/10 px-4 py-2 text-sm font-semibold text-rose-100 hover:bg-rose-500/15"
                    >
                      <Trash2 className="h-4 w-4" />
                      Disconnect
                    </button>
                    <div className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-4 py-2 text-xs text-slate-400">
                      <CheckCircle2 className="h-4 w-4 text-emerald-300" />
                      Ready
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
