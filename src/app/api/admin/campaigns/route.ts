import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { syncCampaign } from "@/lib/sync";

async function requireAdmin() {
  const session = await getSession();
  return session?.role === "admin";
}

export async function POST(req: NextRequest) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const { clientId, lgmCampaignId, nameTag } = await req.json();

  if (!clientId || !lgmCampaignId || !nameTag) {
    return NextResponse.json({ error: "Champs manquants" }, { status: 400 });
  }

  const campaign = await prisma.campaign.create({
    data: { clientId, lgmCampaignId, nameTag },
  });

  try {
    await syncCampaign(campaign.id);
  } catch (e) {
    return NextResponse.json({
      id: campaign.id,
      warning: `Campagne créée mais première synchro échouée : ${(e as Error).message}`,
    });
  }

  return NextResponse.json({ id: campaign.id });
}
