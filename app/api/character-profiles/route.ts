import { NextRequest, NextResponse } from "next/server";
import { getAuthUser, unauthorized } from "@/lib/auth";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

type CharacterProfilePayload = {
  id?: string;
  name?: string;
  niche?: string;
  audience?: string;
  voice?: string;
  bio?: string;
  offers?: string;
  ctaStyle?: string;
  referenceImageUrl?: string;
  systemPrompt?: string;
  contentPillars?: string[];
  hashtagStyle?: string;
  deepDiveStyle?: string;
};

type CharacterProfileRecord = CharacterProfilePayload & {
  id: string;
  created_at: string;
};

const CHARACTER_ACTION = "character_profile";

function toSafeProfile(rawResult: string | null, id: string, createdAt: string): CharacterProfileRecord | null {
  if (!rawResult) return null;

  try {
    const parsed = JSON.parse(rawResult) as CharacterProfilePayload;
    return {
      id,
      created_at: createdAt,
      name: parsed.name || "Untitled Character",
      niche: parsed.niche || "",
      audience: parsed.audience || "",
      voice: parsed.voice || "",
      bio: parsed.bio || "",
      offers: parsed.offers || "",
      ctaStyle: parsed.ctaStyle || "",
      referenceImageUrl: parsed.referenceImageUrl || "",
      systemPrompt: parsed.systemPrompt || "",
      contentPillars: Array.isArray(parsed.contentPillars) ? parsed.contentPillars : [],
      hashtagStyle: parsed.hashtagStyle || "",
      deepDiveStyle: parsed.deepDiveStyle || "",
    };
  } catch {
    return null;
  }
}

export async function GET(req: NextRequest) {
  if (!(await getAuthUser(req))) return unauthorized();

  try {
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from("social_logs")
      .select("id, action, result, created_at")
      .eq("action", CHARACTER_ACTION)
      .order("created_at", { ascending: false })
      .limit(50);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const profiles = (data || [])
      .map((row) => toSafeProfile(row.result as string | null, row.id as string, row.created_at as string))
      .filter(Boolean);

    return NextResponse.json({ profiles });
  } catch {
    return NextResponse.json({ error: "Failed to fetch character profiles" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  if (!(await getAuthUser(req))) return unauthorized();

  try {
    const payload = (await req.json()) as CharacterProfilePayload;

    if (!payload.name?.trim()) {
      return NextResponse.json({ error: "Character name is required" }, { status: 400 });
    }

    const profilePayload = {
      name: payload.name.trim(),
      niche: payload.niche?.trim() || "",
      audience: payload.audience?.trim() || "",
      voice: payload.voice?.trim() || "",
      bio: payload.bio?.trim() || "",
      offers: payload.offers?.trim() || "",
      ctaStyle: payload.ctaStyle?.trim() || "",
      referenceImageUrl: payload.referenceImageUrl?.trim() || "",
      systemPrompt: payload.systemPrompt?.trim() || "",
      contentPillars: Array.isArray(payload.contentPillars)
        ? payload.contentPillars.map((pillar) => pillar.trim()).filter(Boolean)
        : [],
      hashtagStyle: payload.hashtagStyle?.trim() || "",
      deepDiveStyle: payload.deepDiveStyle?.trim() || "",
    };

    const supabase = getSupabaseAdmin();

    if (payload.id) {
      const { data, error } = await supabase
        .from("social_logs")
        .update({
          action: CHARACTER_ACTION,
          result: JSON.stringify(profilePayload),
        })
        .eq("id", payload.id)
        .select("id, result, created_at")
        .single();

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }

      const profile = toSafeProfile(data.result as string, data.id as string, data.created_at as string);
      return NextResponse.json({ profile });
    }

    const { data, error } = await supabase
      .from("social_logs")
      .insert({
        action: CHARACTER_ACTION,
        result: JSON.stringify(profilePayload),
      })
      .select("id, result, created_at")
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const profile = toSafeProfile(data.result as string, data.id as string, data.created_at as string);
    return NextResponse.json({ profile }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to save character profile" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  if (!(await getAuthUser(req))) return unauthorized();

  try {
    const { id } = (await req.json()) as { id?: string };
    if (!id) {
      return NextResponse.json({ error: "id is required" }, { status: 400 });
    }

    const supabase = getSupabaseAdmin();
    const { error } = await supabase
      .from("social_logs")
      .delete()
      .eq("id", id)
      .eq("action", CHARACTER_ACTION);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to delete profile" }, { status: 500 });
  }
}
