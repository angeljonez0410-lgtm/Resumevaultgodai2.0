import { FolderOpen } from "lucide-react";
import InfluencerStudioPage from "@/components/InfluencerStudioPage";

export default function ProjectsPage() {
  return (
    <InfluencerStudioPage
      title="Projects"
      eyebrow="Studio Archive"
      description="Review generated assets, drafts, campaign ideas, and completed AI influencer videos."
      icon={FolderOpen}
      gradient="from-emerald-500 to-cyan-500"
      actions={[
        { label: "Create New", description: "Start a fresh video project from scratch.", href: "/app/create-video" },
        { label: "Quick Generate", description: "Use a template for a faster creative pass.", href: "/app/quick-generate" },
        { label: "Social Media", description: "Prepare a finished project for posting.", href: "/app/social-media" },
      ]}
    />
  );
}
