import { Settings } from "lucide-react";
import InfluencerStudioPage from "@/components/InfluencerStudioPage";

export default function SettingsPage() {
  return (
    <InfluencerStudioPage
      title="Settings"
      eyebrow="Workspace"
      description="Control connected accounts, publishing preferences, defaults, and studio configuration."
      icon={Settings}
      gradient="from-slate-500 to-violet-500"
      actions={[
        { label: "Connected Accounts", description: "Manage social channels and platform access.", href: "/app/social-bot/accounts" },
        { label: "Publishing Defaults", description: "Tune posting preferences for the studio workflow.", href: "/app/social-bot/settings" },
        { label: "Activity Logs", description: "Review recent publishing and automation activity.", href: "/app/social-bot/logs" },
      ]}
    />
  );
}
