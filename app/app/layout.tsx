import AppShell from "@/components/AppShell";

export const metadata = {
  title: "ResumeVault GodAI",
  description: "Beat the ATS in 60 seconds — God-Mode your job hunt",
};

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return <AppShell>{children}</AppShell>;
}
