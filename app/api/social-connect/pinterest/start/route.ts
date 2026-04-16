import { NextRequest, NextResponse } from "next/server";
import { buildPinterestOAuthUrl } from "@/lib/pinterest-oauth";

export async function GET(req: NextRequest) {
  try {
    const redirectUri = new URL("/api/social-connect/pinterest/callback", req.url).toString();
    const state = `pinterest:${crypto.randomUUID()}`;
    const authUrl = buildPinterestOAuthUrl(redirectUri, state);
    const response = NextResponse.redirect(authUrl);

    response.cookies.set("pinterest_oauth_state", state, {
      httpOnly: true,
      sameSite: "lax",
      secure: req.nextUrl.protocol === "https:",
      path: "/",
      maxAge: 600,
    });

    return response;
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to start Pinterest OAuth" },
      { status: 500 }
    );
  }
}
