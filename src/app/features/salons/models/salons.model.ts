export interface ISalon {
  _id?: string; // optionnel pour la création
  nom: string;
  description?: string;
  dateCreation: Date;
  createurId: string;
}