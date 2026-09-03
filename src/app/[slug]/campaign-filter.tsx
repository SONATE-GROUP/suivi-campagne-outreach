"use client";

import { useRouter, useSearchParams } from "next/navigation";

type Campaign = { id: string; nameTag: string };

export function CampaignFilter({
  slug,
  campaigns,
}: {
  slug: string;
  campaigns: Campaign[];
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const current = searchParams.get("campaign") ?? "all";

  function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const value = e.target.value;
    router.push(value === "all" ? `/${slug}` : `/${slug}?campaign=${value}`);
  }

  return (
    <select
      value={current}
      onChange={handleChange}
      className="rounded-lg border border-sonate-green-border bg-white px-3 py-2 text-sm outline-none focus:border-sonate-green"
    >
      <option value="all">Toutes les campagnes</option>
      {campaigns.map((c) => (
        <option key={c.id} value={c.id}>
          {c.nameTag}
        </option>
      ))}
    </select>
  );
}
