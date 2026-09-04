const STATUS_LABELS: Record<string, string> = {
  NOT_ACTIVATED: "Non activé",
  ACTIVATED: "En attente",
  CONTACTED: "Contacté",
  COMPLETED_WITHOUT_REPLY: "Terminé sans réponse",
  REPLIED: "A répondu",
  WON: "Gagné",
  LOST: "Perdu",
  PAUSED: "En pause",
  ERROR: "Erreur",
};

export function translateStatus(status: string | null | undefined): string {
  if (!status) return "";
  return STATUS_LABELS[status.toUpperCase()] ?? status;
}
