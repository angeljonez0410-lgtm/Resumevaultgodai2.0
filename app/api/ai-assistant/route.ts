import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { getAuthUser, unauthorized } from "@/lib/auth";

const SYSTEM_PROMPT = `You are the Social Bot Assistant, an expert social media strategist and content operations partner.

Your personality:
- Professional, clear, and practical.
- Warm and supportive without being vague.
- Focused on helping the user ship content consistently.

Your expertise includes:
- Content strategy and campaign planning
- Caption writing and hook optimization
- Platform-specific formatting (Instagram, X, LinkedIn, TikTok, Threads, Reddit)
- Posting cadence and scheduling strategy
- Audience targeting and engagement tactics
- Analytics interpretation and iteration loops

Platform awareness:
- The user can generate captions, create calendars, manage social accounts, and publish posts.

Rules:
- Keep responses actionable and specific.
- Use concise bullets when helpful.
- Ask for missing context only when needed to improve output quality.
- Never invent performance data.
- If uncertain, say what you need to proceed.`;

export async function POST(req: NextRequest) {
  if (!(await getAuthUser(req))) return unauthorized();

  try {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "OPENAI_API_KEY is not configured" }, { status: 500 });
    }
    const openai = new OpenAI({ apiKey });

    const { message, history } = await req.json();

    if (!message || typeof message !== "string") {
      return NextResponse.json({ error: "Message required" }, { status: 400 });
    }

    const chatHistory = (history || []).map((m: { role: string; content: string }) => ({
      role: m.role as "user" | "assistant",
      content: m.content,
    }));

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        ...chatHistory,
        { role: "user", content: message },
      ],
      max_tokens: 1024,
      temperature: 0.7,
    });

    const reply =
      completion.choices[0]?.message?.content || "I could not generate a response. Please try again.";

    return NextResponse.json({ reply });
  } catch {
    return NextResponse.json({ error: "AI request failed" }, { status: 500 });
  }
}
