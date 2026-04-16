import AppShell from "@/components/AppShell";
import AppLayoutClient from "./layout-client";

export const metadata = {
  title: "InfluencerAI Studio",
  description: "Professional AI studio for social content, character workflows, and multi-platform publishing.",
};

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <AppShell>
      {children}
      <AppLayoutClient />
    </AppShell>
  );
}
