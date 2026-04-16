"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { getSupabaseBrowser } from "@/lib/supabase-browser";
import {
  Bot,
  ChevronLeft,
  ChevronRight,
  LayoutDashboard,
  LogOut,
  Menu,
  Settings,
  Sparkles,
  Users,
  X,
  Activity,
  Share2,
  FileText,
} from "lucide-react";

const navItems = [
  { path: "/app/social-bot", label: "Dashboard", icon: LayoutDashboard },
  { path: "/app/social-bot/posts", label: "Content Studio", icon: FileText },
  { path: "/app/social-bot/accounts", label: "Social Accounts", icon: Share2 },
  { path: "/app/social-bot/characters", label: "AI Characters", icon: Users },
  { path: "/app/social-bot/logs", label: "Activity Logs", icon: Activity },
  { path: "/app/social-bot/settings", label: "Settings", icon: Settings },
];

type UserState = {
  email?: string;
  id?: string;
};

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [authChecking, setAuthChecking] = useState(true);
  const [user, setUser] = useState<UserState | null>(null);

  const sidebarWidth = collapsed ? "lg:w-[78px]" : "lg:w-[286px]";
  const isActive = (path: string) => (path === "/app" ? pathname === "/app" : pathname.startsWith(path));

  useEffect(() => {
    async function verifySession() {
      let token = localStorage.getItem("sb_access_token");
      let refreshToken = localStorage.getItem("sb_refresh_token");

      try {
        if (!token) {
          const { data } = await getSupabaseBrowser().auth.getSession();
          if (data?.session) {
            token = data.session.access_token;
            refreshToken = data.session.refresh_token;
            localStorage.setItem("sb_access_token", token);
            localStorage.setItem("sb_refresh_token", refreshToken || "");
            localStorage.setItem(
              "sb_user",
              JSON.stringify({ email: data.session.user.email, id: data.session.user.id })
            );
          }
        }

        if (!token) {
          router.replace("/login");
          return;
        }

        const res = await fetch("/api/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();

        if (!data?.user) {
          const { data: refreshed } = await getSupabaseBrowser().auth.getSession();
          if (refreshed?.session?.access_token) {
            token = refreshed.session.access_token;
            localStorage.setItem("sb_access_token", token);
            localStorage.setItem("sb_refresh_token", refreshed.session.refresh_token || "");
            localStorage.setItem(
              "sb_user",
              JSON.stringify({ email: refreshed.session.user.email, id: refreshed.session.user.id })
            );

            const retry = await fetch("/api/auth/me", {
              headers: { Authorization: `Bearer ${token}` },
            });
            const retryData = await retry.json();
            if (retryData?.user) {
              setUser(retryData.user);
              return;
            }
          }

          localStorage.removeItem("sb_access_token");
          localStorage.removeItem("sb_refresh_token");
          localStorage.removeItem("sb_user");
          router.replace("/login");
          return;
        }

        setUser(data.user);
      } catch {
        router.replace("/login");
      } finally {
        setAuthChecking(false);
      }
    }

    void verifySession();
  }, [router]);

  const userDisplay = useMemo(() => user?.email || "Signed-in user", [user]);

  const handleSignOut = async () => {
    try {
      await getSupabaseBrowser().auth.signOut();
    } catch {
      // Ignore supabase logout errors and clear local session anyway.
    }

    localStorage.removeItem("sb_access_token");
    localStorage.removeItem("sb_refresh_token");
    localStorage.removeItem("sb_user");
    router.push("/login");
  };

  if (authChecking) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 text-slate-200">
        <p className="text-sm">Checking your session...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {mobileOpen ? (
        <button
          aria-label="Close navigation"
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      ) : null}

      <aside
        className={`fixed left-0 top-0 z-50 flex h-screen w-[286px] flex-col border-r border-cyan-500/10 bg-[#0b1220]/95 transition-all duration-300 ${sidebarWidth} ${
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="flex h-16 items-center border-b border-cyan-500/10 px-4">
          <Link href="/app/social-bot" className="flex min-w-0 items-center gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-gradient-to-br from-cyan-500 to-blue-600">
              <Sparkles className="h-4 w-4 text-white" />
            </div>
            {!collapsed ? (
              <span className="truncate text-[17px] font-semibold tracking-tight text-white">InfluencerAI Studio</span>
            ) : null}
          </Link>
          <button className="ml-auto rounded-lg p-1 text-slate-400 lg:hidden" onClick={() => setMobileOpen(false)}>
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="border-b border-cyan-500/10 px-4 py-3">
          {!collapsed ? (
            <p className="truncate rounded-full border border-white/10 bg-slate-900 px-3 py-1 text-[11px] text-slate-300">
              {userDisplay}
            </p>
          ) : null}
        </div>

        <nav className="flex-1 space-y-1.5 overflow-y-auto px-3 py-4">
          {navItems.map((item) => {
            const active = isActive(item.path);
            const Icon = item.icon;
            return (
              <Link
                key={`${item.label}-${item.path}`}
                href={item.path}
                onClick={() => setMobileOpen(false)}
                title={collapsed ? item.label : undefined}
                className={`group relative flex min-h-10 items-center gap-3 rounded-lg px-3 py-2.5 transition-all duration-200 ${
                  active
                    ? "bg-cyan-500/15 text-cyan-300 shadow-[0_0_0_1px_rgba(34,211,238,0.25)]"
                    : "text-slate-400 hover:bg-white/5 hover:text-white"
                }`}
              >
                {active ? <span className="absolute left-0 top-1/2 h-5 w-1 -translate-y-1/2 rounded-r-full bg-cyan-500" /> : null}
                <Icon className={`h-5 w-5 shrink-0 ${active ? "text-cyan-300" : ""}`} />
                {!collapsed ? <span className="min-w-0 truncate text-[13px] font-medium">{item.label}</span> : null}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-cyan-500/10 p-3">
          <button
            onClick={handleSignOut}
            className="flex min-h-10 w-full items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium text-slate-400 transition hover:bg-white/5 hover:text-white"
            title={collapsed ? "Sign Out" : undefined}
          >
            <LogOut className="h-5 w-5 shrink-0" />
            {!collapsed ? <span>Sign Out</span> : null}
          </button>
        </div>

        <button
          onClick={() => setCollapsed((value) => !value)}
          className="absolute -right-3 top-20 hidden h-6 w-6 items-center justify-center rounded-full border border-white/10 bg-slate-800 text-slate-400 transition hover:text-white lg:flex"
          aria-label={collapsed ? "Expand navigation" : "Collapse navigation"}
        >
          {collapsed ? <ChevronRight className="h-3 w-3" /> : <ChevronLeft className="h-3 w-3" />}
        </button>
      </aside>

      <header className="fixed left-0 right-0 top-0 z-30 flex h-14 items-center border-b border-white/5 bg-slate-950/95 px-4 backdrop-blur lg:hidden">
        <button className="rounded-lg p-2 text-slate-300" onClick={() => setMobileOpen(true)} aria-label="Open navigation">
          <Menu className="h-5 w-5" />
        </button>
        <Link href="/app/social-bot" className="ml-auto flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600">
            <Bot className="h-3.5 w-3.5" />
          </div>
          <span className="text-sm font-semibold">InfluencerAI Studio</span>
        </Link>
      </header>

      <main className={`min-h-screen pt-14 transition-all duration-300 lg:pt-0 ${collapsed ? "lg:pl-[78px]" : "lg:pl-[286px]"}`}>
        {children}
      </main>
    </div>
  );
}
