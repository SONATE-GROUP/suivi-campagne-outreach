import { NextRequest, NextResponse } from "next/server";
import { syncAllClients } from "@/lib/sync";

export const maxDuration = 300;

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const results = await syncAllClients();
  return NextResponse.json({ ok: true, results });
}
