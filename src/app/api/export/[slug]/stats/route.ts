import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { getClientBySlug } from "@/lib/dashboard";
import { prisma } from "@/lib/prisma";
import { toCsv } from "@/lib/csv";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
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

  const snapshots = await prisma.campaignSnapshot.findMany({
    where: { campaign: { clientId: client.id } },
    include: { campaign: { select: { nameTag: true } } },
    orderBy: [{ campaign: { nameTag: "asc" } }, { capturedAt: "asc" }],
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

  const rows = snapshots.map((s) => ({
    Date: s.capturedAt.toISOString(),
    Campagne: s.campaign.nameTag,
    Expediteur: s.sender,
    "Taille audience": s.audienceSize,
    Contactes: s.contacted,
    Reponses: s.replies,
    Gagnes: s.won,
    Perdus: s.lost,
    Termines: s.completed,
    "Contactes LinkedIn": s.contactedLinkedin,
    "Contactes email": s.contactedEmail,
    "Demandes de connexion envoyees": s.connectionRequestsSent,
    Relations: s.relations,
    "Demandes de connexion acceptees": s.connectionRequestsAccepted,
    "Messages LinkedIn envoyes": s.linkedinMessagesSent,
    "Reponses LinkedIn": s.linkedinReplies,
    "Deja connectes": s.alreadyConnected,
    "Mails envoyes": s.emailsSent,
    "Mails recus": s.emailsReceived,
    "Mails ouverts": s.emailsOpened,
    "Reponses mail": s.emailReplies,
    "Clics mail": s.emailClicks,
    "Mails rejetes": s.emailBounced,
  }));

  const csv = toCsv(rows, headers);

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${slug}-stats.csv"`,
    },
  });
}
