

import AppShell from "@/components/AppShell";
import AIAssistant from "@/components/AIAssistant";

export const metadata = {
  title: "Social Bot Dashboard",
  description: "Manage and automate your social media accounts with AI.",
};

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <AppShell>
      {children}
      <AIAssistant />
    </AppShell>
  );
}
