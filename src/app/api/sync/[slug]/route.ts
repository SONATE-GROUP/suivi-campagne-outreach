import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { getClientBySlug } from "@/lib/dashboard";
import { syncClient } from "@/lib/sync";

export const maxDuration = 300;

export async function POST(
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

  const results = await syncClient(client.id);
  return NextResponse.json({ ok: true, results });
}
