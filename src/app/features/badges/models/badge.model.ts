export enum BadgeEnum {
    PARTICIPANT = 'PARTICIPANT',
    EXPERT = 'EXPERT',
    INTERMEDIATE = 'INTERMEDIATE',
    BEGINNER = 'BEGINNER',
  }
  
  export interface Badge {
    score: any;
    _id: string;
    userId: string;
    challengeId: string;
    name: string;
    type: BadgeEnum;
    percentage: number;
    totalPercentage: number;
    awardedAt: Date;
    imageUrl?: string;
    certificateImageUrl?: string;
    createdAt?: Date;
    updatedAt?: Date;
  }
  
  export interface Challenge {
    _id: string;
    title: string;
    description: string;
    startDate: Date;
    endDate: Date;
  }