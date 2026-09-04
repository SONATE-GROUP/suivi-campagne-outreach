import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { getClientBySlug } from "@/lib/dashboard";
import { prisma } from "@/lib/prisma";
import { toCsv } from "@/lib/csv";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const campaignId = req.nextUrl.searchParams.get("campaign") ?? undefined;
  const session = await getSession();
  const authorized =
    session?.role === "admin" || (session?.role === "client" && session.slug === slug);

  if (!authorized) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const client = await getClientBySlug(slug);
  if (!client) {
    return NextResponse.json({ error: "Client introuvable" }, { status: 404 });
  }

  const campaigns = await prisma.campaign.findMany({
    where: {
      clientId: client.id,
      ...(campaignId ? { id: campaignId } : {}),
    },
    select: {
      nameTag: true,
      snapshots: {
        orderBy: { capturedAt: "desc" },
        take: 1,
      },
    },
    orderBy: { nameTag: "asc" },
  });

  const headers = [
    "Date",
    "Campagne",
    "Expediteur",
    "Taille audience",
    "Contactes",
    "Reponses",
    "Gagnes",
    "Perdus",
    "Termines",
    "Contactes LinkedIn",
    "Contactes email",
    "Demandes de connexion envoyees",
    "Relations",
    "Demandes de connexion acceptees",
    "Messages LinkedIn envoyes",
    "Reponses LinkedIn",
    "Deja connectes",
    "Mails envoyes",
    "Mails recus",
    "Mails ouverts",
    "Reponses mail",
    "Clics mail",
    "Mails rejetes",
  ];

  // A campaign has many historical snapshots. The export is intended as a
  // current campaign summary, so retain only the latest snapshot per campaign.
  const rows = campaigns.flatMap((campaign) => {
    const snapshot = campaign.snapshots[0];
    if (!snapshot) return [];

    return [{
      Date: snapshot.capturedAt.toISOString(),
      Campagne: campaign.nameTag,
      Expediteur: snapshot.sender,
      "Taille audience": snapshot.audienceSize,
      Contactes: snapshot.contacted,
      Reponses: snapshot.replies,
      Gagnes: snapshot.won,
      Perdus: snapshot.lost,
      Termines: snapshot.completed,
      "Contactes LinkedIn": snapshot.contactedLinkedin,
      "Contactes email": snapshot.contactedEmail,
      "Demandes de connexion envoyees": snapshot.connectionRequestsSent,
      Relations: snapshot.relations,
      "Demandes de connexion acceptees": snapshot.connectionRequestsAccepted,
      "Messages LinkedIn envoyes": snapshot.linkedinMessagesSent,
      "Reponses LinkedIn": snapshot.linkedinReplies,
      "Deja connectes": snapshot.alreadyConnected,
      "Mails envoyes": snapshot.emailsSent,
      "Mails recus": snapshot.emailsReceived,
      "Mails ouverts": snapshot.emailsOpened,
      "Reponses mail": snapshot.emailReplies,
      "Clics mail": snapshot.emailClicks,
      "Mails rejetes": snapshot.emailBounced,
    }];
  });

  const csv = toCsv(rows, headers);

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${slug}-stats.csv"`,
    },
  });
}
