import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { getSupabaseAdmin } from "../../../lib/supabase-admin";
import { getAuthUser, unauthorized } from "../../../lib/auth";

export async function POST(req: NextRequest) {
  if (!(await getAuthUser(req))) return unauthorized();
  try {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "OPENAI_API_KEY is not configured" }, { status: 500 });
    }
    const openai = new OpenAI({ apiKey });

    const body = await req.json();
    const { topic } = body;

    if (!topic) {
      return NextResponse.json({ error: "Topic is required" }, { status: 400 });
    }

    const supabase = getSupabaseAdmin();

    const { data: settings } = await supabase
      .from("social_settings")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    const brandVoice = settings?.brand_voice || "Professional, helpful, empowering";
    const targetAudience = settings?.target_audience || "Founders, creators, and small business audiences";
    const postFrequency = settings?.post_frequency || "daily";

    const prompt = `
You are writing a high-performing social media caption for a standalone brand.

Topic: ${topic}
Brand voice: ${brandVoice}
Target audience: ${targetAudience}
Post frequency style: ${postFrequency}

Write one engaging caption with:
- a strong hook
- useful advice
- short paragraphs
- a call to action
- relevant hashtags

Keep it platform-neutral and ready for Instagram, LinkedIn, or Twitter.
`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.8,
    });

    const caption =
      completion.choices[0]?.message?.content?.trim() || "No caption generated";

    await supabase.from("social_logs").insert({
      action: "Generated AI caption",
      result: `Caption generated for topic: ${topic}`,
    });

    return NextResponse.json({ caption });
  } catch {
    return NextResponse.json(
      { error: "Failed to generate caption" },
      { status: 500 }
    );
  }
}
