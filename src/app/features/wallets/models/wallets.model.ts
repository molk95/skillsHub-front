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
    user: IUser | null;
    imoney: IImoney;
    isActive: boolean;
    deactivatedAt: string | null;
    createdAt?: string;
    updatedAt?: string;
}


