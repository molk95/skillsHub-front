export interface IImoney {
    value: number;
    currencyType: string;
}

export interface IUser {
    name: string;
}

export interface IWallet {
    user: IUser;
    imoney: IImoney;
    isActive: boolean;
    createdAt?: string;
    updatedAt?: string;
}


