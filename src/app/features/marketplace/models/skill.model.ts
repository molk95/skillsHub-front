import { Category } from "./category.model";
export interface User {
  _id?: string;
  id?: string;
  name?: string;
  // autres propriétés utilisateur
}

export interface Skill {
  _id?: string;
  name: string;
  description: string;
  category: Category | null;
  user?: User | string;
  users?: (User | string)[];
  github?: {
    validatedSkills: string[];
    username: string;
    lastUpdated: Date;
  };
  createdAt?: Date;
  updatedAt?: Date;
}
