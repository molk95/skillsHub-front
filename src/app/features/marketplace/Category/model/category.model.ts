export interface Category {
  user: any;
    _id?: string;
    name: string;
    description: string;
    category: string;
  Skills: string[];
  deletedAt?:Date;
  createdAt?:Date;
  updatedAt?: Date;
  }