import { NextRequest, NextResponse } from "next/server";
import { createSessionCookie } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const { password } = await req.json();

  if (!password || password !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: "Mot de passe invalide" }, { status: 401 });
  }

  await createSessionCookie({ role: "admin" });
  return NextResponse.json({ ok: true });
}
