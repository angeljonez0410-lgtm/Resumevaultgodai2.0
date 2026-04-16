import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { getAuthUser, unauthorized } from "@/lib/auth";

type GenerateRequest = {
  name?: string;
  niche?: string;
  audience?: string;
  voice?: string;
  bio?: string;
  offers?: string;
};

export async function POST(req: NextRequest) {
  if (!(await getAuthUser(req))) return unauthorized();

  try {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "OPENAI_API_KEY is not configured" }, { status: 500 });
    }

    const input = (await req.json()) as GenerateRequest;
    if (!input.name?.trim()) {
      return NextResponse.json({ error: "Character name is required" }, { status: 400 });
    }

    const openai = new OpenAI({ apiKey });

    const prompt = `Create a social media AI character profile for a creator ops app.
Return valid JSON only with these keys:
- systemPrompt (string)
- contentPillars (array of exactly 5 short strings)
- hashtagStyle (string)
- deepDiveStyle (string)
- topicIdeas (array of exactly 10 short strings)
- bioSummary (string)

Character Input:
- Name: ${input.name}
- Niche: ${input.niche || "General creator brand"}
- Audience: ${input.audience || "Growth-focused audience"}
- Voice: ${input.voice || "Clear, practical, confident"}
- Bio: ${input.bio || ""}
- Offer: ${input.offers || ""}

Requirements:
- Keep strategy practical and conversion-focused.
- Include hooks for Instagram, LinkedIn, X, and TikTok.
- Keep the systemPrompt under 220 words.
- Avoid cliches and filler.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      response_format: { type: "json_object" },
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
      max_tokens: 1400,
    });

    const raw = completion.choices[0]?.message?.content || "{}";
    const parsed = JSON.parse(raw) as Record<string, unknown>;

    return NextResponse.json({
      blueprint: {
        systemPrompt: typeof parsed.systemPrompt === "string" ? parsed.systemPrompt : "",
        contentPillars: Array.isArray(parsed.contentPillars) ? parsed.contentPillars : [],
        hashtagStyle: typeof parsed.hashtagStyle === "string" ? parsed.hashtagStyle : "",
        deepDiveStyle: typeof parsed.deepDiveStyle === "string" ? parsed.deepDiveStyle : "",
        topicIdeas: Array.isArray(parsed.topicIdeas) ? parsed.topicIdeas : [],
        bioSummary: typeof parsed.bioSummary === "string" ? parsed.bioSummary : "",
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to generate character blueprint" },
      { status: 500 }
    );
  }
}
