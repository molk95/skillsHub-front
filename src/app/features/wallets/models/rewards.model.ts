export interface IRewards {
  _id: string;
  user: string;
  points: number;
  redeemed: number;
  createdAt: string;
  updatedAt: string;
}

export interface IRewardsHistory {
  _id: string;
  user: string;
  type: 'EARNED' | 'REDEEMED';
  points: number;
  wallet: string;
  source?: 'wallet_topup' | 'skill_purchase' | 'challenge_purchase' | 'manual' | 'points_to_imoney';
  description?: string;
  relatedId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface IConversionTier {
  points: number;
  imoney: number;
}

export interface IConversionInfo {
  userPoints: number;
  conversionTiers: IConversionTier[];
  availableTiers: IConversionTier[];
  bestTier: IConversionTier | null;
  canConvert: boolean;
  minimumPoints: number;
}

export interface IRewardsWithConversion {
  rewards: IRewards | null;
  conversion: IConversionInfo;
}

export interface IPointsConversionRequest {
  userId: string;
  points: number;
}

export interface IPointsConversionResponse {
  message: string;
  pointsDeducted: number;
  imoneyAdded: number;
  newWalletBalance: number;
  remainingPoints: number;
  conversionRate: number;
  wallet: any;
}
