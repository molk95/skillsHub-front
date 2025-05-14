export interface Category {
    _id?: string;
    name: string;
    description: string;
    category: string;
  Skills: string[];
  deletedAt?:Date;
  createdAt?:Date;
  updatedAt?: Date;
  }