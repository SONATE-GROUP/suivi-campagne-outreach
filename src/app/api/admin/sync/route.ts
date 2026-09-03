import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { syncClient } from "@/lib/sync";

export const maxDuration = 300;

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (session?.role !== "admin") {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const { clientId } = await req.json();
  if (!clientId) {
    return NextResponse.json({ error: "clientId manquant" }, { status: 400 });
  }

  const results = await syncClient(clientId);
  return NextResponse.json({ ok: true, results });
}
