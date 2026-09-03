import { notFound } from "next/navigation";
import { getClientBySlug } from "@/lib/dashboard";
import { DashboardShell } from "./shell";

export default async function ClientLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const client = await getClientBySlug(slug);
  if (!client) notFound();

  return (
    <DashboardShell slug={slug} clientName={client.name}>
      {children}
    </DashboardShell>
  );
}
