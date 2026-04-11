import { NextRequest, NextResponse } from "next/server";
import { getAuthUser, unauthorized } from "@/lib/auth";
import { listResumes, createResume, deleteResume } from "@/lib/db";

export async function GET(req: NextRequest) {
  const auth = await getAuthUser(req);
  if (!auth) return unauthorized();
  try {
    const resumes = await listResumes(auth.user.id);
    return NextResponse.json(resumes);
  } catch {
    return NextResponse.json({ error: "Failed to load resumes" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const auth = await getAuthUser(req);
  if (!auth) return unauthorized();
  try {
    const body = await req.json();
    const resume = await createResume(auth.user.id, body);
    return NextResponse.json(resume);
  } catch {
    return NextResponse.json({ error: "Failed to save resume" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const auth = await getAuthUser(req);
  if (!auth) return unauthorized();
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });
    await deleteResume(id, auth.user.id);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Failed to delete resume" }, { status: 500 });
  }
}
