"use client";

import { useEffect, useState } from "react";
import { Sparkles, Mail, ArrowRight, Lock } from "lucide-react";
import Link from "next/link";
import { getSupabaseBrowser } from "@/lib/supabase-browser";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function autoLogin() {
      try {
        const token = localStorage.getItem("sb_access_token");
        if (token) {
          const res = await fetch("/api/auth/me", {
            headers: { Authorization: `Bearer ${token}` },
          });
          const data = await res.json();
          if (data?.user) {
            window.location.href = "/app";
            return;
          }
        }

        const supabase = getSupabaseBrowser();
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (session) {
          localStorage.setItem("sb_access_token", session.access_token);
          localStorage.setItem("sb_refresh_token", session.refresh_token || "");
          localStorage.setItem(
            "sb_user",
            JSON.stringify({ email: session.user.email, id: session.user.id })
          );
          window.location.href = "/app";
          return;
        }
      } finally {
        setCheckingSession(false);
      }
    }

    void autoLogin();
  }, []);

  const handlePasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password) return;

    setLoading(true);
    setError("");

    try {
      const supabase = getSupabaseBrowser();
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        setError(signInError.message);
        return;
      }

      if (data?.session) {
        localStorage.setItem("sb_access_token", data.session.access_token);
        localStorage.setItem("sb_refresh_token", data.session.refresh_token || "");
        localStorage.setItem(
          "sb_user",
          JSON.stringify({ email: data.session.user.email, id: data.session.user.id })
        );
      }

      window.location.href = "/app";
    } catch {
      setError("Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (checkingSession) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#1e2d42] via-[#1e2d42] to-[#2a3f5f]">
        <p className="text-slate-200 text-sm">Checking session...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1e2d42] via-[#1e2d42] to-[#2a3f5f] flex flex-col">
      <nav className="flex items-center justify-between px-6 py-4 max-w-7xl mx-auto w-full">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[#f4c542] flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-[#1e2d42]" />
          </div>
          <span className="text-white font-bold text-lg">InfluencerAI Studio</span>
        </Link>
      </nav>

      <div className="flex-1 flex items-center justify-center px-6 pb-20">
        <div className="w-full max-w-md bg-white/10 backdrop-blur-xl rounded-2xl p-8 border border-white/10">
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-[#f4c542] flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-8 h-8 text-[#1e2d42]" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">Login</h1>
            <p className="text-slate-300 text-sm">Sign in with your existing account.</p>
          </div>

          <form onSubmit={handlePasswordLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Email address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full bg-white/10 border border-white/20 text-white placeholder-slate-400 rounded-xl pl-11 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#f4c542] focus:border-transparent"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Your password"
                  className="w-full bg-white/10 border border-white/20 text-white placeholder-slate-400 rounded-xl pl-11 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#f4c542] focus:border-transparent"
                  required
                />
              </div>
            </div>

            {error ? <p className="text-red-400 text-sm bg-red-400/10 rounded-lg px-3 py-2">{error}</p> : null}

            <button
              type="submit"
              disabled={loading || !email.trim() || !password}
              className="w-full bg-[#f4c542] text-[#1e2d42] font-bold py-3 rounded-xl hover:bg-[#e0b02f] disabled:opacity-50 transition flex items-center justify-center gap-2 text-sm"
            >
              {loading ? "Signing in..." : <>Sign In <ArrowRight className="w-4 h-4" /></>}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
