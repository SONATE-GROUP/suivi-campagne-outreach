import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { getClientBySlug, getClientLeads } from "@/lib/dashboard";
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

  const leads = await getClientLeads(client.id);

  const headers = [
    "Campagne",
    "Prenom",
    "Nom",
    "Entreprise",
    "Profil LinkedIn",
    "Email",
    "Statut",
    "Messages envoyes",
    "Messages ouverts",
    "A repondu",
    "Derniere mise a jour",
  ];

  const rows = leads.map((lead) => ({
    Campagne: lead.campaign.nameTag,
    Prenom: lead.firstname ?? "",
    Nom: lead.lastname ?? "",
    Entreprise: lead.companyName ?? "",
    "Profil LinkedIn": lead.linkedinUrl ?? "",
    Email: lead.email ?? "",
    Statut: lead.status ?? "",
    "Messages envoyes": lead.messagesSent,
    "Messages ouverts": lead.messagesOpened,
    "A repondu": lead.replied ? "Oui" : "Non",
    "Derniere mise a jour": lead.updatedAt.toISOString(),
  }));

  const csv = toCsv(rows, headers);

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${slug}-prospects.csv"`,
    },
  });
}
