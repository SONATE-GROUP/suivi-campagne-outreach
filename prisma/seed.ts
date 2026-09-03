import { PrismaClient } from "@prisma/client";
import { PrismaLibSQL } from "@prisma/adapter-libsql";
import bcrypt from "bcryptjs";

const adapter = new PrismaLibSQL({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN,
});
const prisma = new PrismaClient({ adapter });

// Optionnel : pré-remplit un premier client à partir de variables d'environnement,
// pratique pour migrer un client existant sans repasser par l'interface /admin.
// SEED_CLIENT_SLUG, SEED_CLIENT_NAME, SEED_CLIENT_PASSWORD, SEED_CLIENT_LGM_API_KEY,
// SEED_CAMPAIGNS (JSON: [{ "id": "...", "nameTag": "..." }, ...])
async function main() {
  const slug = process.env.SEED_CLIENT_SLUG;
  const name = process.env.SEED_CLIENT_NAME;
  const password = process.env.SEED_CLIENT_PASSWORD;
  const lgmApiKey = process.env.SEED_CLIENT_LGM_API_KEY;
  const campaignsJson = process.env.SEED_CAMPAIGNS;

  if (!slug || !name || !password || !lgmApiKey) {
    console.log(
      "Aucune variable SEED_CLIENT_* définie : rien à faire. Utilisez plutôt /admin pour créer un client."
    );
    return;
  }

  const client = await prisma.client.upsert({
    where: { slug },
    update: {},
    create: {
      slug,
      name,
      passwordHash: await bcrypt.hash(password, 10),
      lgmApiKey,
    },
  });

  const campaigns: { id: string; nameTag: string }[] = campaignsJson
    ? JSON.parse(campaignsJson)
    : [];

  for (const campaign of campaigns) {
    await prisma.campaign.upsert({
      where: { clientId_lgmCampaignId: { clientId: client.id, lgmCampaignId: campaign.id } },
      update: { nameTag: campaign.nameTag },
      create: { clientId: client.id, lgmCampaignId: campaign.id, nameTag: campaign.nameTag },
    });
  }

  console.log(`Client "${name}" (/${slug}) créé avec ${campaigns.length} campagne(s).`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
