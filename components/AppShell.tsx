"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { type ComponentType, useMemo, useState } from "react";
import {
  Bot,
  BriefcaseBusiness,
  ChevronLeft,
  ChevronRight,
  CreditCard,
  DollarSign,
  Lightbulb,
  Mail,
  Map,
  Menu,
  MessageSquare,
  Mic,
  Send,
  Sparkles,
  TrendingUp,
  UserCog,
  X,
} from "lucide-react";

const navSections: NavSection[] = [
  {
    id: "all",
    title: "All Features",
    titleIcon: Sparkles,
    titleColor: "text-amber-300",
    items: [
      { path: "/app/social-bot/posts?mode=cover-letter", label: "Cover Letter", icon: Mail },
      { path: "/app/social-bot/posts?mode=follow-up", label: "Follow-Up Email", icon: Send },
      { path: "/app/social-bot", label: "Application Tracker", icon: BriefcaseBusiness },
      { path: "/app/social-bot/logs", label: "Analytics", icon: TrendingUp },
      { path: "/app/social-bot/settings?tab=pricing", label: "Pricing", icon: CreditCard },
      { path: "/app/social-bot/logs?filter=reviews", label: "Reviews", icon: MessageSquare },
    ],
  },
  {
    id: "premium",
    title: "PREMIUM",
    titleIcon: Sparkles,
    titleColor: "text-amber-300",
    items: [
      { path: "/app/social-bot/characters?persona=interview", label: "Interview Coach", icon: Mic, itemColor: "text-amber-200" },
      { path: "/app/social-bot/characters?persona=salary", label: "Salary Negotiation", icon: DollarSign, itemColor: "text-amber-200" },
      { path: "/app/social-bot/settings?tab=roadmap", label: "Career Roadmap", icon: Map, itemColor: "text-amber-200" },
      { path: "/app/social-bot/posts?mode=portfolio", label: "Portfolio Ideas", icon: Lightbulb, itemColor: "text-amber-200" },
    ],
  },
  {
    id: "admin",
    title: "ADMIN",
    titleIcon: Sparkles,
    titleColor: "text-amber-300",
    items: [
      { path: "/app/social-bot/accounts", label: "Admin Users", icon: UserCog, itemColor: "text-rose-300" },
      { path: "/app/social-bot", label: "Admin AI Assistant", icon: Bot, itemColor: "text-rose-300" },
    ],
  },
];

type UserState = {
  email?: string;
  id?: string;
};

type NavItem = {
  path: string;
  label: string;
  icon: ComponentType<{ className?: string }>;
  itemColor?: string;
};

type NavSection = {
  id: string;
  title: string;
  titleIcon: ComponentType<{ className?: string }>;
  titleColor: string;
  items: NavItem[];
};

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [user] = useState<UserState | null>({
    email: "Auto dashboard session",
    id: "auto-session",
  });

  const sidebarWidth = collapsed ? "lg:w-[78px]" : "lg:w-[286px]";
  const isActive = (path: string) => {
    const base = path.split("?")[0];
    return base === "/app" ? pathname === "/app" : pathname.startsWith(base);
  };

  const userDisplay = useMemo(() => user?.email || "Signed-in user", [user]);

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
        className={`fixed left-0 top-0 z-50 flex h-screen w-[286px] flex-col border-r border-[#2d4666] bg-[#213953] transition-all duration-300 ${sidebarWidth} ${
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="flex h-14 items-center border-b border-[#2d4666] px-4">
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

        <div className="border-b border-[#2d4666] px-4 py-3">
          {!collapsed ? (
            <p className="truncate rounded-full border border-white/10 bg-[#1a2f48] px-3 py-1 text-[11px] text-slate-300">
              {userDisplay}
            </p>
          ) : null}
        </div>

        <nav className="flex-1 space-y-4 overflow-y-auto px-3 py-4">
          {navSections.map((section, sectionIndex) => {
            const SectionIcon = section.titleIcon;
            return (
              <div key={section.id}>
                {!collapsed ? (
                  <div className="mb-2 flex items-center gap-2 px-2">
                    <SectionIcon className={`h-3.5 w-3.5 ${section.titleColor}`} />
                    <p className={`text-[11px] font-bold uppercase tracking-[0.16em] ${sectionIndex === 0 ? "text-slate-100 normal-case tracking-normal text-[18px]" : "text-slate-400"}`}>
                      {section.title}
                    </p>
                  </div>
                ) : null}

                {!collapsed && sectionIndex === 0 ? <div className="mb-2 h-px bg-[#335070]" /> : null}

                <div className="space-y-1.5">
                  {section.items.map((item) => {
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
                            ? "bg-white/10 text-white shadow-[0_0_0_1px_rgba(255,255,255,0.14)]"
                            : "text-slate-300 hover:bg-white/5 hover:text-white"
                        }`}
                      >
                        <Icon className={`h-4 w-4 shrink-0 ${active ? "text-white" : item.itemColor || "text-slate-200"}`} />
                        {!collapsed ? <span className="min-w-0 truncate text-[15px] font-medium">{item.label}</span> : null}
                      </Link>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </nav>

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
