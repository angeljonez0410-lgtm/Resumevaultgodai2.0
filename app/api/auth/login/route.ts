import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(req: NextRequest) {
  try {
    const { email, redirectTo } = await req.json();

    if (!email || typeof email !== "string") {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!url || !anonKey) {
      return NextResponse.json(
        { error: "Server configuration error" },
        { status: 500 }
      );
    }

    const supabase = createClient(url, anonKey);

    // Validate redirectTo to prevent open redirect
    let safeRedirect: string | undefined;
    if (redirectTo && typeof redirectTo === "string") {
      const appUrl = process.env.APP_URL || "";
      try {
        const redirectUrl = new URL(redirectTo);
        const appOrigin = appUrl ? new URL(appUrl).origin : undefined;
        if (appOrigin && redirectUrl.origin === appOrigin) {
          safeRedirect = redirectTo;
        }
      } catch {
        // Invalid URL — ignore
      }
    }

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: safeRedirect,
      },
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ message: "Magic link sent. Check your email." });
  } catch {
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
