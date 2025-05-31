import { Category } from "../../Category/model/category.model";
export interface User {
  _id?: string;
  id?: string;
  fullName?: string;
  // autres propriétés utilisateur
}

export interface Skill {
  _id?: string;
  name: string;
  description: string;
  category: Category | null;
  user?: User | string;           // un utilisateur (objet ou ID)
  users?: (User | string)[];      // plusieurs utilisateurs possibles
  github?: {
    validatedSkills: string[];
    username: string;
    lastUpdated: Date;
  };
  createdAt?: Date;
  updatedAt?: Date;
}
