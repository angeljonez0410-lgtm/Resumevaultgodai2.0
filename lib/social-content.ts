import type { SocialProvider } from "@/lib/social-platforms";

export type SocialContentIdea = {
  platform: SocialProvider;
  topic: string;
  description: string;
  caption: string;
  hook: string;
  cta: string;
  hashtags: string[];
};

export const DEFAULT_SOCIAL_CONTENT: SocialContentIdea[] = [
  {
    platform: "instagram",
    topic: "Launch teaser",
    description: "Tease a new feature with a short visual-led post.",
    caption: "Something new is coming. We built this to make content planning faster and cleaner.",
    hook: "Sneak peek",
    cta: "Follow for launch details",
    hashtags: ["#SocialMedia", "#ProductLaunch", "#Creators"],
  },
  {
    platform: "facebook",
    topic: "Community question",
    description: "Ask your audience about their biggest content challenge this month.",
    caption: "What is the hardest part of your social workflow right now: ideation, writing, or consistency?",
    hook: "Quick poll",
    cta: "Drop your answer in the comments",
    hashtags: ["#Community", "#Marketing", "#ContentStrategy"],
  },
  {
    platform: "twitter",
    topic: "Hook formula",
    description: "Share a repeatable opening-line formula for better engagement.",
    caption: "Try this hook structure: Problem + stakes + promise. It boosts clarity and click-through.",
    hook: "Simple writing framework",
    cta: "Test it on your next post",
    hashtags: ["#XTips", "#Copywriting", "#GrowthMarketing"],
  },
  {
    platform: "linkedin",
    topic: "Process post",
    description: "Explain your weekly content workflow as a practical playbook.",
    caption: "Our weekly flow: Monday research, Tuesday draft, Wednesday design, Thursday schedule, Friday review.",
    hook: "Behind the scenes",
    cta: "Steal this workflow and adapt it",
    hashtags: ["#LinkedInTips", "#MarketingOps", "#B2BMarketing"],
  },
  {
    platform: "tiktok",
    topic: "Content myth",
    description: "Debunk a common short-form content myth in under 20 seconds.",
    caption: "You do not need daily posting to grow. You need clear positioning and repeatable content angles.",
    hook: "Myth vs reality",
    cta: "Save this for your next planning session",
    hashtags: ["#TikTokTips", "#ContentCreator", "#SocialGrowth"],
  },
  {
    platform: "threads",
    topic: "Daily prompt",
    description: "Share one prompt people can use to create a post in 5 minutes.",
    caption: "Prompt: What is one mistake your audience keeps making, and how do you fix it fast?",
    hook: "Post idea in one line",
    cta: "Use this prompt today",
    hashtags: ["#Threads", "#CreatorTips", "#SocialMediaMarketing"],
  },
  {
    platform: "youtube",
    topic: "Tutorial concept",
    description: "Plan a short tutorial around one repeatable social strategy.",
    caption: "Video idea: Build a 7-day content plan in 15 minutes using one core message and three formats.",
    hook: "Fast tutorial",
    cta: "Publish your own walkthrough this week",
    hashtags: ["#YouTubeCreators", "#ContentPlan", "#Marketing"],
  },
  {
    platform: "pinterest",
    topic: "Checklist pin",
    description: "Create a visual checklist for pre-publish QA.",
    caption: "Pin idea: 8-point pre-publish checklist for social posts that drives better saves and shares.",
    hook: "Shareable checklist",
    cta: "Pin this to your planning board",
    hashtags: ["#PinterestMarketing", "#SocialMediaChecklist", "#ContentCreation"],
  },
  {
    platform: "reddit",
    topic: "Strategy breakdown",
    description: "Post a practical breakdown of what changed in your content process and outcomes.",
    caption: "What changed when we moved from random posting to weekly themes and batch writing.",
    hook: "Case-study style thread",
    cta: "Share your approach and compare notes",
    hashtags: ["#MarketingStrategy", "#ContentOps", "#SocialMedia"],
  },
];
