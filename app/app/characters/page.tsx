import { Users } from "lucide-react";
import InfluencerStudioPage from "@/components/InfluencerStudioPage";

export default function CharactersPage() {
  return (
    <InfluencerStudioPage
      title="Characters"
      eyebrow="Master Library"
      description="Create and manage reusable AI influencer identities for every video, campaign, and social post."
      icon={Users}
      gradient="from-violet-500 to-purple-600"
      actions={[
        { label: "New Character", description: "Build a polished identity with style, personality, and visual direction.", href: "/app/profile" },
        { label: "Character Prompts", description: "Turn a concept into a production-ready image or video prompt.", href: "/app/quick-generate" },
        { label: "Use in Video", description: "Send a character into the video creation flow.", href: "/app/create-video" },
      ]}
    />
  );
}
