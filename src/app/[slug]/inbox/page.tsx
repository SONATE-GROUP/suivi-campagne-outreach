import { notFound } from "next/navigation";
import { getClientBySlug } from "@/lib/dashboard";
import { getInboxConversations } from "@/lib/inbox";
import { InboxView } from "./inbox-view";

export const dynamic = "force-dynamic";

export default async function InboxPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const client = await getClientBySlug(slug);
  if (!client) notFound();

  const conversations = await getInboxConversations(client.id);

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
      <div>
        <h1 className="text-[22px] font-bold text-ink-cream">Inbox</h1>
        <p className="mt-1 text-[13px] text-ink-muted">
          Consultation des échanges LinkedIn et email. Lecture seule.
        </p>
      </div>
      <InboxView slug={slug} conversations={conversations} />
    </div>
  );
}
