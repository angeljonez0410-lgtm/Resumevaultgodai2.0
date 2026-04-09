import { NextRequest, NextResponse } from "next/server";
import { runScheduledPublishing } from "../../../lib/publisher";

export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization");
    const cronSecret = process.env.CRON_SECRET;

    if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const result = await runScheduledPublishing();

    return NextResponse.json({
      success: true,
      source: "external-cron",
      ...result,
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to run scheduled publishing" },
      { status: 500 }
    );
  }
}
