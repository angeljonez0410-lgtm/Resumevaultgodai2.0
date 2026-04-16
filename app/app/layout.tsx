import AppShell from "@/components/AppShell";
import AppLayoutClient from "./layout-client";

export const metadata = {
  title: "Social Bot",
  description: "Manage accounts, posts, and publishing from one social media dashboard.",
};

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <AppShell>
      {children}
      <AppLayoutClient />
    </AppShell>
  );
}
