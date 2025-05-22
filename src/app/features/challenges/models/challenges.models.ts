export interface Challenge {
    _id: string;
    title: string;
    description: string;
    skill: string;
    difficulty: 'easy' | 'medium' | 'hard';
    startDate: Date;
    createdBy: string;
    createdAt?: Date;
    updatedAt?: Date;
  }