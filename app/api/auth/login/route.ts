import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json(
    { error: "Login is disabled. Open the dashboard directly." },
    { status: 410 }
  );
}
