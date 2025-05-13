export interface Session {
    salonId: string; // ID du salon associé
    type: "chat" | "meet"; // Type de session (chat ou meet)
    dateDebut: Date; // Date de début de la session
    dateFin: Date; // Date de fin de la session
    createurId: string; // ID du créateur de la session
    etat: "active" | "terminée" | "en attente"; // État de la session
  }