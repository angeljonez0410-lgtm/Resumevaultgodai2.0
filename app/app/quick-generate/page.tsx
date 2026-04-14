import { Wand2 } from "lucide-react";
import InfluencerStudioPage from "@/components/InfluencerStudioPage";

export default function QuickGeneratePage() {
  return (
    <InfluencerStudioPage
      title="Quick Generate"
      eyebrow="Scene Templates"
      description="Use fast templates for hooks, scenes, captions, and video prompts when you need fresh content quickly."
      icon={Wand2}
      gradient="from-cyan-500 to-blue-600"
      actions={[
        { label: "Prompt Optimizer", description: "Clean up rough ideas into production-ready prompt language.", href: "/AIAssistant" },
        { label: "Create Video", description: "Move the generated prompt into a video project.", href: "/app/create-video" },
        { label: "Social Media", description: "Convert output into a post and schedule it.", href: "/app/social-media" },
      ]}
    />
  );
}
