export interface IImoney {
  _id?: string;
  value: number;
  currencyType: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface IUser {
  _id?: string;
  fullName: string;
  email?: string;
  wallet?: string;
  // Add other user properties as needed
}

export interface IWallet {
  _id: string;
  user: {
    _id: string;
    fullName: string;
    email: string;
    role?: string; // Added role property for admin interface
  };
  imoney?: {
    _id: string;
    value: number;
    currencyType: string;
  };
  isActive: boolean;
  deactivatedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface ITransaction {
  id: string;
  walletId: string;
  amount: number;
  type: 'topup' | 'purchase' | 'refund' | 'gift_sent' | 'gift_received';
  description: string;
  createdAt: Date;
  status: 'pending' | 'completed' | 'failed';
  reference?: string;
}

export interface IGiftTransaction {
  _id: string;
  senderUserId: string;
  senderName: string;
  senderEmail: string;
  recipientUserId: string;
  recipientName: string;
  recipientEmail: string;
  amount: number;
  message?: string;
  reason?: 'birthday' | 'congratulations' | 'thank_you' | 'just_because' | 'other';
  status: 'pending' | 'completed' | 'failed' | 'cancelled';
  transactionId?: string;
  createdAt: Date;
  completedAt?: Date;
}

export interface IGiftRequest {
  recipientEmail: string;
  amount: number;
  message?: string;
  reason?: 'birthday' | 'congratulations' | 'thank_you' | 'just_because' | 'other';
}

export interface IGiftResponse {
  success: boolean;
  message: string;
  gift?: IGiftTransaction;
  senderNewBalance?: number;
  recipientNewBalance?: number;
}

export interface IWalletAnalytics {
  thisMonth: number;
  lastMonth: number;
  percentChange: number;
  topCategories?: {
    category: string;
    amount: number;
  }[];
}
