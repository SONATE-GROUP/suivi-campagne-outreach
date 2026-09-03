import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const lead = await prisma.lead.findUnique({
    where: { id },
    include: { campaign: { include: { client: true } } },
  });

  if (!lead) {
    return NextResponse.json({ error: "Prospect introuvable" }, { status: 404 });
  }

  const authorized =
    session.role === "admin" ||
    (session.role === "client" && session.slug === lead.campaign.client.slug);

  if (!authorized) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const { note } = await req.json();

  await prisma.lead.update({
    where: { id },
    data: { note: typeof note === "string" ? note : null },
  });

  return NextResponse.json({ ok: true });
}
