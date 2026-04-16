import { NextRequest, NextResponse } from "next/server";
import { buildMetaOAuthUrl, isMetaProvider } from "@/lib/meta-oauth";

export async function GET(req: NextRequest) {
  try {
    const provider = req.nextUrl.searchParams.get("provider") || "facebook";

    if (!isMetaProvider(provider)) {
      return NextResponse.json({ error: "Provider must be facebook or instagram" }, { status: 400 });
    }

    const redirectUri = new URL("/api/social-connect/meta/callback", req.url).toString();
    const state = `${provider}:${crypto.randomUUID()}`;
    const authUrl = buildMetaOAuthUrl(provider, redirectUri, state);
    const response = NextResponse.redirect(authUrl);

    response.cookies.set("meta_oauth_state", state, {
      httpOnly: true,
      sameSite: "lax",
      secure: req.nextUrl.protocol === "https:",
      path: "/",
      maxAge: 600,
    });

    return response;
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to start Meta OAuth" },
      { status: 500 }
    );
  }
}
