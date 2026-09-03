import Link from "next/link";

export default function Home() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-6 px-6 text-center">
      <img src="/logo/sonate-logo-beige.png" alt="Sonate" className="h-14 w-auto" />
      <div>
        <h1 className="text-2xl font-bold text-ink-cream">Suivi des campagnes outreach</h1>
        <p className="mt-2 text-ink-muted">
          Accédez à votre tableau de bord via le lien qui vous a été communiqué.
        </p>
      </div>
      <Link
        href="/admin/login"
        className="text-sm text-ink-orange underline underline-offset-2"
      >
        Accès administrateur
      </Link>
    </main>
  );
}
