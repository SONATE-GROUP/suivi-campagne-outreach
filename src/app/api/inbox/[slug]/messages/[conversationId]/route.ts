import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { getClientBySlug } from "@/lib/dashboard";
import { fetchConversationMessages } from "@/lib/lgm";

// GET only: this route reads a conversation's messages from LaGrowthMachine.
// It must never call (and must never be extended to call) LGM's write
// endpoints (send message, archive, snooze, edit note) — the inbox is
// strictly read-only for both clients and admins.
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string; conversationId: string }> }
) {
  const { slug, conversationId } = await params;
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

  const messages = await fetchConversationMessages(client.lgmApiKey, conversationId);
  return NextResponse.json({ messages });
}
