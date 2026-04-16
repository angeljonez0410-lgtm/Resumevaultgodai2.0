type FormatInput = {
  topic: string;
  caption?: string | null;
};

export function formatInstagramCaption({ topic, caption }: FormatInput) {
  const base = caption?.trim() || topic;

  return `${base}

Save this for later and follow for more social strategy content.

#SocialMedia #ContentMarketing #CreatorTips #GrowthMarketing #DigitalStrategy #SocialBot`;
}

export function formatTwitterCaption({ topic, caption }: FormatInput) {
  const base = caption?.trim() || topic;
  const shortBase = base.length > 220 ? `${base.slice(0, 220)}...` : base;

  return `${shortBase}

#SocialMedia #CreatorEconomy #GrowthTips`;
}

export function formatLinkedInCaption({ topic, caption }: FormatInput) {
  const base = caption?.trim() || topic;

  return `${base}

What strategy is working best for your audience right now?

Follow for practical AI-powered social media tools and advice.

#SocialMedia #MarketingStrategy #LinkedInTips #CreatorGrowth`;
}

export function formatTikTokCaption({ topic, caption }: FormatInput) {
  const base = caption?.trim() || topic;
  const shortBase = base.length > 140 ? `${base.slice(0, 140)}...` : base;

  return `${shortBase}

#SocialMedia #ContentCreator #TikTokGrowth #MarketingTips`;
}

export function formatCaptionForPlatform(post: {
  platform: string;
  topic: string;
  caption?: string | null;
}) {
  switch (post.platform) {
    case "instagram":
      return formatInstagramCaption(post);
    case "twitter":
      return formatTwitterCaption(post);
    case "linkedin":
      return formatLinkedInCaption(post);
    case "tiktok":
      return formatTikTokCaption(post);
    case "reddit":
    case "threads":
      return post.caption?.trim() || post.topic;
    default:
      return post.caption?.trim() || post.topic;
  }
}
