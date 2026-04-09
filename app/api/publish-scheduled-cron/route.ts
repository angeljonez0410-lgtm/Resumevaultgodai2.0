import { NextRequest, NextResponse } from "next/server";
import { runScheduledPublishing } from "../../../lib/publisher";

export async function GET(req: NextRequest) {
  try {
    const isVercelCron = req.headers.get("x-vercel-cron") === "1";
    const authHeader = req.headers.get("authorization");
    const cronSecret = process.env.CRON_SECRET;

    const isManualAuthorized = !!cronSecret && authHeader === `Bearer ${cronSecret}`;

    if (!isVercelCron && !isManualAuthorized) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const result = await runScheduledPublishing();

    return NextResponse.json({
      success: true,
      source: isVercelCron ? "vercel-cron" : "manual-cron-test",
      ...result,
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to run scheduled cron publishing" },
      { status: 500 }
    );
  }
}
