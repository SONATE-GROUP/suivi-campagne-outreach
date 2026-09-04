const STATUS_LABELS: Record<string, string> = {
  NOT_ACTIVATED: "Non activé",
  ACTIVATED: "En attente",
  ENRICHED: "Enrichi",
  CONTACTED: "Contacté",
  TO_QUALIFY: "À qualifier",
  OUT_OF_OFFICE: "Absent du bureau",
  WRONG_TIMING: "Mauvais timing",
  CALL_BOOKED: "Appel programmé",
  INTERESTED: "Intéressé",
  NOT_INTERESTED: "Pas intéressé",
  ALREADY_EQUIPPED: "Déjà équipé",
  WRONG_TARGET: "Mauvaise cible",
  NEGOTIATING: "En négociation",
  READY_TO_BUY: "Prêt à acheter",
  CONVERTED: "Converti",
  COMPLETED_WITHOUT_REPLY: "Terminé sans réponse",
  SUBSCRIBED: "Abonné",
  UNSUBSCRIBED: "Désabonné",
  PAUSED: "En pause",
  RESUME: "Repris",
  STOPPED: "Arrêté",
};

export function translateStatus(status: string | null | undefined): string {
  if (!status) return "";
  return STATUS_LABELS[status.toUpperCase()] ?? status;
}
