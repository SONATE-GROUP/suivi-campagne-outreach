import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyPassword, createSessionCookie } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const { slug, password } = await req.json();

  if (!slug || !password) {
    return NextResponse.json({ error: "Champs manquants" }, { status: 400 });
  }

  const client = await prisma.client.findUnique({ where: { slug } });
  if (!client) {
    return NextResponse.json({ error: "Identifiants invalides" }, { status: 401 });
  }

  const valid = await verifyPassword(password, client.passwordHash);
  if (!valid) {
    return NextResponse.json({ error: "Identifiants invalides" }, { status: 401 });
  }

  await createSessionCookie({ role: "client", clientId: client.id, slug: client.slug });
  return NextResponse.json({ ok: true });
}
