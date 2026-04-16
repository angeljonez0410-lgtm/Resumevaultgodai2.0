import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { getSupabaseAdmin } from "@/lib/supabase-admin";
import { getAuthUser, unauthorized } from "@/lib/auth";

export async function POST(req: NextRequest) {
  if (!(await getAuthUser(req))) return unauthorized();

  try {
    const body = await req.json();
    const topicInput = typeof body.topic === "string" ? body.topic.trim() : "";
    const platformInput = typeof body.platform === "string" ? body.platform.trim() : "instagram";

    if (!topicInput) {
      return NextResponse.json({ error: "Topic is required" }, { status: 400 });
    }

    const supabase = getSupabaseAdmin();
    const { data: settings } = await supabase
      .from("social_settings")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    const brandVoice = settings?.brand_voice || "Clear, confident, useful";
    const targetAudience = settings?.target_audience || "Founders, creators, and growth teams";

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "OPENAI_API_KEY is not configured" }, { status: 500 });
    }
    const openai = new OpenAI({ apiKey });

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      response_format: { type: "json_object" },
      temperature: 0.8,
      messages: [
        {
          role: "system",
          content:
            "You are a senior social content strategist. Return valid JSON only with keys: topic, description, deep_dive, hashtags, caption, image_prompt, video_prompt. hashtags must be an array of strings without # symbols.",
        },
        {
          role: "user",
          content: `Create a high-performing content brief.

Platform: ${platformInput}
Topic seed: ${topicInput}
Brand voice: ${brandVoice}
Target audience: ${targetAudience}

Requirements:
- topic: refined title (short and punchy)
- description: 2-3 sentence strategic summary
- deep_dive: actionable talking points in one paragraph
- hashtags: 10 relevant hashtags
- caption: final publish-ready caption with line breaks and hashtags at end
- image_prompt: realistic image generation prompt
- video_prompt: realistic short-form video generation prompt`,
        },
      ],
    });

    const raw = completion.choices[0]?.message?.content || "{}";
    let parsed: {
      topic?: string;
      description?: string;
      deep_dive?: string;
      hashtags?: string[];
      caption?: string;
      image_prompt?: string;
      video_prompt?: string;
    };

    try {
      parsed = JSON.parse(raw);
    } catch {
      parsed = {};
    }

    const hashtags = Array.isArray(parsed.hashtags)
      ? parsed.hashtags
          .map((tag) => `${tag}`.trim().replace(/^#/, ""))
          .filter(Boolean)
          .slice(0, 12)
      : [];

    const result = {
      topic: parsed.topic?.trim() || topicInput,
      description: parsed.description?.trim() || "",
      deepDive: parsed.deep_dive?.trim() || "",
      hashtags,
      caption: parsed.caption?.trim() || "",
      imagePrompt: parsed.image_prompt?.trim() || "",
      videoPrompt: parsed.video_prompt?.trim() || "",
    };

    await supabase.from("social_logs").insert({
      action: "Generated content brief",
      result: `Generated brief for ${result.topic}`,
    });

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to generate content brief" },
      { status: 500 }
    );
  }
}
