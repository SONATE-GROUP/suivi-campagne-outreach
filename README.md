# Suivi Campagnes Outreach

Tableau de bord en ligne pour suivre les campagnes LaGrowthMachine (LGM) de tes clients :
plus besoin du Google Sheet, chaque client a son propre lien de dashboard, avec graphiques,
taux de conversion et liste des prospects.

Remplace le Google Apps Script existant : la logique de récupération des données LGM est la
même (mêmes endpoints, mêmes champs), mais les données sont stockées en base et affichées
dans une vraie interface, synchronisée automatiquement.

## Stack

- **Next.js 16** (App Router) + Tailwind v4, charte graphique Sonate
- **Turso** (libSQL) via Prisma (historique des stats dans le temps, pas juste un snapshot)
- **Recharts** pour les graphiques
- Auth par mot de passe : un espace `/admin` pour toi, un lien `/<slug-client>` par client
- Synchronisation automatique via **Vercel Cron**, + bouton de synchro manuelle dans l'admin

## Architecture

```
src/lib/lgm.ts        → appels à l'API LaGrowthMachine (repris de l'Apps Script)
src/lib/sync.ts        → synchronise un client / une campagne (stats + prospects) en base
src/app/api/cron/sync   → route appelée par Vercel Cron (protégée par CRON_SECRET)
src/app/admin           → back-office : créer des clients, ajouter leurs campagnes, sync manuelle
src/app/[slug]           → dashboard public d'un client (protégé par mot de passe)
src/app/[slug]/prospects → liste des prospects avec recherche/filtres
```

Chaque synchronisation crée un nouveau `CampaignSnapshot` (au lieu d'écraser une ligne comme
dans le Sheet), ce qui permet d'afficher une vraie courbe d'évolution dans le temps.

## Mise en route en local

```bash
npm install
cp .env.example .env   # puis remplir TURSO_DATABASE_URL, TURSO_AUTH_TOKEN, AUTH_SECRET, ADMIN_PASSWORD, CRON_SECRET
npm run db:push         # crée les tables dans la base
npm run dev
```

En local, `TURSO_DATABASE_URL` peut aussi pointer vers un fichier SQLite local (ex.
`file:./dev.db`, sans `TURSO_AUTH_TOKEN`) pour développer sans base distante.

Va sur `http://localhost:3000/admin/login`, connecte-toi avec `ADMIN_PASSWORD`, puis crée un
client (nom, slug, mot de passe, clé API LGM) et ajoute ses campagnes (l'ID de campagne LGM se
trouve dans l'URL de la campagne sur LaGrowthMachine). La première synchro se lance automatiquement
à l'ajout de chaque campagne.

## Déploiement (Vercel)

1. Crée une base sur [Turso](https://turso.tech) (`turso db create suivi-campagnes`), puis
   récupère l'URL (`turso db show suivi-campagnes --url`) et un token d'auth
   (`turso db tokens create suivi-campagnes`).
2. Importe ce repo dans Vercel.
3. Renseigne les variables d'environnement (`TURSO_DATABASE_URL`, `TURSO_AUTH_TOKEN`,
   `AUTH_SECRET`, `ADMIN_PASSWORD`, `CRON_SECRET`) dans les settings du projet Vercel.
4. Déploie. Le cron défini dans `vercel.json` (tous les jours à 6h) appellera automatiquement
   `/api/cron/sync` pour rafraîchir toutes les campagnes de tous les clients.
   > Le plan gratuit Vercel limite les crons à une exécution par jour. Passe sur un plan payant
   > si tu veux une fréquence plus élevée (ex. toutes les 4h), ou utilise le bouton
   > "Synchroniser maintenant" dans `/admin` en attendant.
5. Une fois déployé, va sur `https://ton-domaine/admin/login`, crée tes clients, et partage à
   chacun son lien `https://ton-domaine/<slug-client>` + son mot de passe.

## Migrer un client déjà suivi via Google Sheet

Pas besoin de tout retaper à la main : dans `/admin`, "Nouveau client" avec sa clé API LGM, puis
"Ajouter une campagne" pour chaque campagne (nom + ID LGM, visible dans l'URL de la campagne).
Chaque ajout déclenche une synchro immédiate qui va chercher tout l'historique des prospects.

## Sécurité

- Les clés API LGM sont stockées en base, jamais exposées côté client (tous les appels à l'API
  LGM se font depuis le serveur).
- Chaque client n'a accès qu'à son propre dashboard (mot de passe + session signée).
- L'ancien Google Apps Script peut être désactivé une fois la migration d'un client terminée.
