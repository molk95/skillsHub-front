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
    };
    imoney: {
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
    type: 'topup' | 'purchase' | 'refund';
    description: string;
    createdAt: Date;
    status: 'pending' | 'completed' | 'failed';
    reference?: string;
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
