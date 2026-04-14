import { Video } from "lucide-react";
import InfluencerStudioPage from "@/components/InfluencerStudioPage";

export default function CreateVideoPage() {
  return (
    <InfluencerStudioPage
      title="Create Video"
      eyebrow="Production"
      description="Generate short-form AI influencer videos with a selected character, scene direction, caption, and posting goal."
      icon={Video}
      gradient="from-fuchsia-500 to-pink-600"
      actions={[
        { label: "Start from Character", description: "Choose a saved influencer identity and create a new scene.", href: "/app/characters" },
        { label: "Generate Caption", description: "Draft captions and hooks for the video rollout.", href: "/app/social-media" },
        { label: "View Projects", description: "Track drafts, generated videos, and completed assets.", href: "/app/projects" },
      ]}
    />
  );
}
