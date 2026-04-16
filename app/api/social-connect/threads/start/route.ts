import { NextRequest, NextResponse } from "next/server";
import { buildThreadsOAuthUrl } from "@/lib/threads-oauth";

export async function GET(req: NextRequest) {
  try {
    const redirectUri = new URL("/api/social-connect/threads/callback", req.url).toString();
    const state = `threads:${crypto.randomUUID()}`;
    const authUrl = buildThreadsOAuthUrl(redirectUri, state);
    const response = NextResponse.redirect(authUrl);

    response.cookies.set("threads_oauth_state", state, {
      httpOnly: true,
      sameSite: "lax",
      secure: req.nextUrl.protocol === "https:",
      path: "/",
      maxAge: 600,
    });

    return response;
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to start Threads OAuth" },
      { status: 500 }
    );
  }
}
