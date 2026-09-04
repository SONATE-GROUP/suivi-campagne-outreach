import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { getClientBySlug } from "@/lib/dashboard";
import { prisma } from "@/lib/prisma";

async function authorize(slug: string) {
  const session = await getSession();
  return session?.role === "admin" || (session?.role === "client" && session.slug === slug);
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  if (!(await authorize(slug))) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const client = await getClientBySlug(slug);
  if (!client) {
    return NextResponse.json({ error: "Client introuvable" }, { status: 404 });
  }

  const { conversationId } = await req.json();
  if (!conversationId) {
    return NextResponse.json({ error: "conversationId manquant" }, { status: 400 });
  }

  await prisma.hiddenConversation.upsert({
    where: { clientId_conversationId: { clientId: client.id, conversationId } },
    update: {},
    create: { clientId: client.id, conversationId },
  });

  return NextResponse.json({ ok: true });
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  if (!(await authorize(slug))) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const client = await getClientBySlug(slug);
  if (!client) {
    return NextResponse.json({ error: "Client introuvable" }, { status: 404 });
  }

  const { conversationId } = await req.json();
  if (!conversationId) {
    return NextResponse.json({ error: "conversationId manquant" }, { status: 400 });
  }

  await prisma.hiddenConversation.deleteMany({
    where: { clientId: client.id, conversationId },
  });

  return NextResponse.json({ ok: true });
}
