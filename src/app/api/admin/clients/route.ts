import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession, hashPassword } from "@/lib/auth";

async function requireAdmin() {
  const session = await getSession();
  return session?.role === "admin";
}

export async function GET() {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const clients = await prisma.client.findMany({
    include: { campaigns: { select: { id: true } } },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(
    clients.map((c) => ({
      id: c.id,
      slug: c.slug,
      name: c.name,
      campaignCount: c.campaigns.length,
      createdAt: c.createdAt,
    }))
  );
}

export async function POST(req: NextRequest) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const { slug, name, password, lgmApiKey } = await req.json();

  if (!slug || !name || !password || !lgmApiKey) {
    return NextResponse.json({ error: "Champs manquants" }, { status: 400 });
  }

  const slugPattern = /^[a-z0-9-]+$/;
  if (!slugPattern.test(slug)) {
    return NextResponse.json(
      { error: "Le slug doit contenir uniquement des lettres minuscules, chiffres et tirets" },
      { status: 400 }
    );
  }

  const existing = await prisma.client.findUnique({ where: { slug } });
  if (existing) {
    return NextResponse.json({ error: "Ce slug existe déjà" }, { status: 409 });
  }

  const client = await prisma.client.create({
    data: {
      slug,
      name,
      passwordHash: await hashPassword(password),
      lgmApiKey,
    },
  });

  return NextResponse.json({ id: client.id, slug: client.slug });
}
