export interface ISalon {
  nom: string;
  description?: string;
  dateCreation: Date;
  createurId: string;  // Angular ne reconnaît pas Types.ObjectId, on utilise string
  [key: string]: any;  // Permet d'ajouter dynamiquement des propriétés comme _id sans les définir explicitement
}
